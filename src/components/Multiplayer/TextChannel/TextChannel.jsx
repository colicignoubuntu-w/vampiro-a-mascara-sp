import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  getChannelMessages,
  sendChannelMessage,
  subscribeToChannel,
} from '../../../engine/multiplayer/chatEngine.js'

import {
  useMultiplayer,
} from '../../../multiplayer/MultiplayerProvider.jsx'

import './TextChannel.css'

function formatTime(value) {
  if (!value) {
    return ''
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return ''
  }

  return date.toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )
}

function mergeMessage(
  current,
  incoming
) {
  if (
    current.some(
      (message) =>
        message.id ===
        incoming.id
    )
  ) {
    return current
  }

  return [
    ...current,
    incoming,
  ].slice(-100)
}

export default function TextChannel({
  channelId = 'global',
  title = '# GLOBAL',
  subtitle = 'São Paulo Online',
}) {
  const {
    profile,
  } = useMultiplayer()

  const [
    messages,
    setMessages,
  ] = useState([])

  const [
    text,
    setText,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    sending,
    setSending,
  ] = useState(false)

  const [
    realtimeStatus,
    setRealtimeStatus,
  ] = useState(
    'CONNECTING'
  )

  const [
    error,
    setError,
  ] = useState('')

  const bottomRef =
    useRef(null)

  useEffect(() => {
    let active = true
    let subscription = null

    async function start() {
      try {
        setLoading(true)
        setError('')

        const history =
          await getChannelMessages(
            channelId
          )

        if (!active) {
          return
        }

        setMessages(
          history
        )

        subscription =
          subscribeToChannel({
            channelId,

            onMessage:
              (message) => {
                if (!active) {
                  return
                }

                setMessages(
                  (current) =>
                    mergeMessage(
                      current,
                      message
                    )
                )
              },

            onStatusChange:
              setRealtimeStatus,
          })
      } catch (startError) {
        console.error(
          'Erro ao abrir canal:',
          startError
        )

        if (active) {
          setError(
            'Não foi possível abrir o canal.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    start()

    return () => {
      active = false

      if (subscription) {
        subscription
          .disconnect()
          .catch(
            (
              disconnectError
            ) => {
              console.error(
                'Erro ao fechar canal:',
                disconnectError
              )
            }
          )
      }
    }
  }, [channelId])

  useEffect(() => {
    bottomRef.current
      ?.scrollIntoView({
        behavior: 'smooth',
      })
  }, [messages])

  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    const cleanText =
      text.trim()

    if (
      !cleanText ||
      sending
    ) {
      return
    }

    if (!profile?.id) {
      setError(
        'Seu perfil ainda está carregando.'
      )

      return
    }

    try {
      setSending(true)
      setError('')

      await sendChannelMessage({
        channelId,

        userId:
          profile.id,

        displayName:
          profile.display_name ||
          'Desconhecido',

        message:
          cleanText,
      })

      setText('')
    } catch (sendError) {
      console.error(
        'Erro ao enviar mensagem:',
        sendError
      )

      setError(
        sendError?.message ||
          'Não foi possível enviar a mensagem.'
      )
    } finally {
      setSending(false)
    }
  }

  const realtimeConnected =
    realtimeStatus ===
    'SUBSCRIBED'

  return (
    <section className="text-channel">
      <header className="text-channel-header">
        <div>
          <span className="text-channel-kicker">
            {subtitle}
          </span>

          <h3>
            {title}
          </h3>
        </div>

        <span
          className={[
            'text-channel-live',

            realtimeConnected
              ? 'online'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <i />

          {realtimeConnected
            ? 'AO VIVO'
            : 'CONECTANDO'}
        </span>
      </header>

      <div className="text-channel-messages">
        {loading && (
          <p className="text-channel-system">
            Carregando mensagens...
          </p>
        )}

        {!loading &&
          messages.length ===
            0 && (
            <p className="text-channel-system">
              Ainda não há mensagens.
              Seja o primeiro a falar.
            </p>
          )}

        {messages.map(
          (message) => {
            const own =
              message.userId ===
              profile?.id

            return (
              <article
                key={message.id}
                className={[
                  'text-channel-message',

                  own
                    ? 'own'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="text-channel-message-meta">
                  <strong>
                    {
                      message.displayName
                    }
                  </strong>

                  {own && (
                    <small>
                      VOCÊ
                    </small>
                  )}

                  <time>
                    {formatTime(
                      message.createdAt
                    )}
                  </time>
                </div>

                <p>
                  {message.message}
                </p>
              </article>
            )
          }
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="text-channel-error">
          {error}
        </p>
      )}

      <form
        className="text-channel-form"
        onSubmit={
          handleSubmit
        }
      >
        <textarea
          value={text}
          onChange={(event) =>
            setText(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key ===
                'Enter' &&
              !event.shiftKey
            ) {
              event.preventDefault()

              event.currentTarget
                .form
                ?.requestSubmit()
            }
          }}
          maxLength={500}
          rows={2}
          placeholder="Mensagem para #global..."
        />

        <div className="text-channel-form-footer">
          <span>
            {text.length}/500
          </span>

          <button
            type="submit"
            disabled={
              sending ||
              !text.trim()
            }
          >
            {sending
              ? 'ENVIANDO'
              : 'ENVIAR'}
          </button>
        </div>
      </form>
    </section>
  )
}
