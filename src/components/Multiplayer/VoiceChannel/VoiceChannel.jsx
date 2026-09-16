import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useLocalParticipant,
  useParticipants,
} from '@livekit/components-react'

import {
  supabase,
} from '../../../lib/supabaseClient.js'

import './VoiceChannel.css'


function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  )
}


function VoiceParticipants() {
  const participants =
    useParticipants()

  return (
    <div className="voice-channel-participants">
      <div className="voice-channel-count">
        <span className="voice-live-dot" />

        <span>
          {participants.length === 1
            ? '1 NA VOZ'
            : `${participants.length} NA VOZ`}
        </span>
      </div>

      {participants.map(
        participant => (
          <div
            className="voice-participant"
            key={participant.identity}
          >
            <span className="voice-participant-dot" />

            <div>
              <strong>
                {participant.name ||
                  'Desconhecido'}
              </strong>

              <small>
                {participant.isMicrophoneEnabled
                  ? 'MICROFONE ATIVO'
                  : 'MUDO'}
              </small>
            </div>
          </div>
        )
      )}
    </div>
  )
}


function VoiceControls({
  onLeave,
}) {
  const {
    localParticipant,
  } = useLocalParticipant()

  const [
    microphoneEnabled,
    setMicrophoneEnabled,
  ] = useState(
    localParticipant
      .isMicrophoneEnabled
  )

  useEffect(() => {
    function syncMicrophone() {
      setMicrophoneEnabled(
        localParticipant
          .isMicrophoneEnabled
      )
    }

    localParticipant.on(
      'trackMuted',
      syncMicrophone
    )

    localParticipant.on(
      'trackUnmuted',
      syncMicrophone
    )

    localParticipant.on(
      'localTrackPublished',
      syncMicrophone
    )

    localParticipant.on(
      'localTrackUnpublished',
      syncMicrophone
    )

    syncMicrophone()

    return () => {
      localParticipant.off(
        'trackMuted',
        syncMicrophone
      )

      localParticipant.off(
        'trackUnmuted',
        syncMicrophone
      )

      localParticipant.off(
        'localTrackPublished',
        syncMicrophone
      )

      localParticipant.off(
        'localTrackUnpublished',
        syncMicrophone
      )
    }
  }, [
    localParticipant,
  ])

  async function toggleMicrophone() {
    try {
      const next =
        !localParticipant
          .isMicrophoneEnabled

      await localParticipant
        .setMicrophoneEnabled(
          next
        )

      setMicrophoneEnabled(
        localParticipant
          .isMicrophoneEnabled
      )
    } catch (error) {
      console.error(
        'Erro ao alterar microfone:',
        error
      )
    }
  }

  return (
    <div className="voice-channel-controls">
      <button
        type="button"
        onClick={toggleMicrophone}
      >
        {microphoneEnabled
          ? 'SILENCIAR'
          : 'ATIVAR MICROFONE'}
      </button>

      <button
        type="button"
        className="leave"
        onClick={onLeave}
      >
        SAIR DA VOZ
      </button>
    </div>
  )
}


function ConnectedVoice({
  onLeave,
}) {
  return (
    <>
      <RoomAudioRenderer />

      <StartAudio
        label="ATIVAR ÁUDIO"
      />

      <VoiceParticipants />

      <VoiceControls
        onLeave={onLeave}
      />
    </>
  )
}


export default function VoiceChannel({
  locationId,
  areaId,
  title = 'CONVERSA POR VOZ',
}) {
  const [
    connection,
    setConnection,
  ] = useState(null)

  const [
    connecting,
    setConnecting,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const requestedRoom =
    useMemo(
      () =>
        `voice:${locationId}:${areaId}`,
      [
        locationId,
        areaId,
      ]
    )


  /*
   * Ao mudar de área, a conexão
   * anterior é encerrada.
   *
   * A voz nunca acompanha o
   * jogador automaticamente.
   */
  useEffect(() => {
    setConnection(null)
    setConnecting(false)
    setError('')
  }, [
    requestedRoom,
  ])


  /*
   * Confere diretamente no banco
   * se o Presence/perfil já terminou
   * de sincronizar a nova área.
   *
   * Isso evita:
   *
   * React = stage
   * Banco = main
   *
   * durante alguns milissegundos.
   */
  async function waitForAreaSync() {
    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth
        .getUser()

    if (
      authError ||
      !authData?.user
    ) {
      throw new Error(
        'Sua sessão não está disponível.'
      )
    }

    const userId =
      authData.user.id

    const maxAttempts = 10

    for (
      let attempt = 1;
      attempt <= maxAttempts;
      attempt += 1
    ) {
      const {
        data: profile,
        error: profileError,
      } =
        await supabase
          .from('player_profiles')
          .select(
            'current_location,current_area'
          )
          .eq(
            'id',
            userId
          )
          .single()

      if (profileError) {
        throw new Error(
          'Não foi possível verificar sua área atual.'
        )
      }

      const locationMatches =
        profile?.current_location ===
        locationId

      const areaMatches =
        profile?.current_area ===
        areaId

      if (
        locationMatches &&
        areaMatches
      ) {
        return true
      }

      /*
       * Espera 200 ms antes de
       * conferir novamente.
       *
       * Máximo total aproximado:
       * 2 segundos.
       */
      await sleep(200)
    }

    return false
  }


  async function readFunctionError(
    functionError
  ) {
    try {
      const context =
        functionError?.context

      if (!context) {
        return ''
      }

      const response =
        typeof context.clone ===
        'function'
          ? context.clone()
          : context

      const body =
        await response.json()

      return (
        body?.error ||
        body?.message ||
        ''
      )
    } catch (readError) {
      console.error(
        'Não foi possível ler a resposta da Edge Function:',
        readError
      )

      return ''
    }
  }


  async function joinVoice() {
    if (connecting) {
      return
    }

    try {
      setConnecting(true)
      setError('')


      /*
       * 1. Verifica se a área já
       * chegou ao banco.
       */
      const synchronized =
        await waitForAreaSync()

      if (!synchronized) {
        throw new Error(
          'Sua posição ainda está sendo sincronizada. Aguarde um instante e tente novamente.'
        )
      }


      /*
       * 2. Somente após o clique
       * pedimos acesso ao microfone.
       */
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        throw new Error(
          'Seu navegador não oferece acesso ao microfone.'
        )
      }

      const stream =
        await navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: false,
          })

      /*
       * Esse stream serve apenas
       * para verificar/perguntar a
       * permissão.
       *
       * O LiveKit abrirá seu próprio
       * track de microfone depois.
       */
      stream
        .getTracks()
        .forEach(
          track => track.stop()
        )


      /*
       * 3. Agora o servidor pode
       * gerar o token para a área
       * correta.
       */
      const {
        data,
        error:
          functionError,
      } =
        await supabase
          .functions
          .invoke(
            'livekit-token',
            {
              body: {},
            }
          )

      if (functionError) {
        const serverMessage =
          await readFunctionError(
            functionError
          )

        throw new Error(
          serverMessage ||
          functionError.message ||
          'A Edge Function recusou a conexão.'
        )
      }

      console.log(
        '[VOICE DEBUG]',
        {
          url: data?.url,
          room: data?.room,
          hasToken: Boolean(data?.token),
        }
      )

      if (
        !data?.token ||
        !data?.url ||
        !data?.room
      ) {
        throw new Error(
          data?.error ||
          'Servidor não retornou os dados necessários da voz.'
        )
      }


      /*
       * 4. Defesa extra.
       *
       * Mesmo depois de esperar a
       * sincronização, nunca usamos
       * um token de outra área.
       */
      if (
        data.room !==
        requestedRoom
      ) {
        throw new Error(
          `A sala mudou durante a conexão. Esperada "${requestedRoom}", recebida "${data.room}".`
        )
      }


      /*
       * 5. Somente agora montamos
       * LiveKitRoom.
       */
      setConnection({
        token:
          data.token,

        serverUrl:
          data.url,

        room:
          data.room,
      })
    } catch (err) {
      console.error(
        'Erro ao entrar na voz:',
        err
      )

      setError(
        err?.message ||
        'Não foi possível entrar na conversa por voz.'
      )
    } finally {
      setConnecting(false)
    }
  }


  function leaveVoice() {
    setConnection(null)
    setConnecting(false)
    setError('')
  }


  return (
    <section className="voice-channel">
      <div className="voice-channel-heading">
        <div>
          <span>
            {title}
          </span>

          <small>
            Somente jogadores nesta área
          </small>
        </div>

        {connection && (
          <span className="voice-connected">
            ● CONECTADO
          </span>
        )}
      </div>


      {!connection ? (
        <div className="voice-channel-disconnected">
          <div>
            <strong>
              ÁUDIO DA ÁREA
            </strong>

            <span>
              Entre apenas quando quiser conversar.
            </span>
          </div>

          <button
            type="button"
            onClick={joinVoice}
            disabled={connecting}
          >
            {connecting
              ? 'SINCRONIZANDO...'
              : 'ENTRAR NA VOZ'}
          </button>
        </div>
      ) : (
        <LiveKitRoom
          token={connection.token}
          serverUrl={
            connection.serverUrl
          }
          connect={true}
          audio={true}
          video={false}
          options={{
            adaptiveStream: true,
            dynacast: true,
          }}
          onDisconnected={
            leaveVoice
          }
          onError={
            roomError => {
              console.error(
                'Erro LiveKit:',
                roomError
              )

              setError(
                roomError?.message ||
                'A conexão de voz encontrou um erro.'
              )
            }
          }
        >
          <ConnectedVoice
            onLeave={leaveVoice}
          />
        </LiveKitRoom>
      )}


      {error && (
        <p className="voice-channel-error">
          {error}
        </p>
      )}
    </section>
  )
}
