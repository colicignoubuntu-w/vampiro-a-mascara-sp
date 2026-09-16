import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  useMultiplayer,
} from '../../multiplayer/MultiplayerProvider.jsx'

import './OnlinePlayers.css'

function formatLocation(location) {
  if (!location) {
    return 'Local desconhecido'
  }

  const knownLocations = {
    menu: 'No menu',
    creation: 'Criando personagem',
    sheet: 'Na ficha',
    prologue: 'Prólogo',
    free_roam: 'São Paulo',
    ultimo_gole: 'Último Gole',
    vesuvius: 'Vesuvius',
    asylum: 'Asylum',
    paulista: 'Avenida Paulista',
    galeria_do_rock: 'Galeria do Rock',
  }

  if (knownLocations[location]) {
    return knownLocations[location]
  }

  return String(location)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

function formatArea(
  location,
  area
) {
  if (
    location !== 'ultimo_gole' ||
    !area
  ) {
    return null
  }

  const ultimoGoleAreas = {
    main:
      'Salão principal',

    stage:
      'Perto do palco',

    bar:
      'Balcão',

    vip:
      'Área VIP',

    stairs:
      'Escadas dos fundos',

    basement:
      'Porão',
  }

  return (
    ultimoGoleAreas[area] ??
    String(area)
      .replaceAll('_', ' ')
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      )
  )
}

function formatPlayerLocation(
  player
) {
  const location =
    formatLocation(
      player?.location
    )

  const area =
    formatArea(
      player?.location,
      player?.area
    )

  if (!area) {
    return location
  }

  return `${location} · ${area}`
}

export default function OnlinePlayers({
  user,
}) {
  const {
    players,
    connected,
    profile,
    error: multiplayerError,
    setDisplayName,
  } = useMultiplayer()

  const [
    panelOpen,
    setPanelOpen,
  ] = useState(false)

  const panelRef =
    useRef(null)

  const [
    editingName,
    setEditingName,
  ] = useState(false)

  const [
    name,
    setName,
  ] = useState('')

  const [
    localError,
    setLocalError,
  ] = useState('')

  const hasDefaultName =
    String(
      profile?.display_name || ''
    ).startsWith(
      'Desconhecido'
    )

  useEffect(() => {
    setName(
      hasDefaultName
        ? ''
        : profile?.display_name || ''
    )
  }, [
    profile?.display_name,
    hasDefaultName,
  ])

  useEffect(() => {
    if (!panelOpen) {
      return undefined
    }

    function handlePointerDown(
      event
    ) {
      if (
        panelRef.current &&
        !panelRef.current.contains(
          event.target
        )
      ) {
        setPanelOpen(false)
        setEditingName(false)
      }
    }

    function handleKeyDown(
      event
    ) {
      if (event.key === 'Escape') {
        setPanelOpen(false)
        setEditingName(false)
      }
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown
    )

    document.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      )

      document.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [panelOpen])

  async function saveName(event) {
    event.preventDefault()

    const cleanName =
      name.trim()

    if (!cleanName) {
      setLocalError(
        'Informe um nome.'
      )

      return
    }

    try {
      setLocalError('')

      const updated =
        await setDisplayName(
          cleanName
        )

      setName(
        updated?.display_name ||
          cleanName
      )

      setEditingName(false)
    } catch (err) {
      console.error(
        'Erro ao salvar nome:',
        err
      )

      setLocalError(
        'Não foi possível salvar o nome.'
      )
    }
  }

  const visibleError =
    localError ||
    multiplayerError

  return (
    <div
      className="online-players-shell"
      ref={panelRef}
    >
      <button
        type="button"
        className={
          panelOpen
            ? 'online-players-toggle active'
            : 'online-players-toggle'
        }
        onClick={() => {
          setPanelOpen(
            current => !current
          )
        }}
        aria-expanded={panelOpen}
        aria-label={
          panelOpen
            ? 'Fechar jogadores online'
            : 'Abrir jogadores online'
        }
      >
        <span
          className={
            connected
              ? 'online-status-dot online'
              : 'online-status-dot'
          }
        />

        <span className="online-toggle-label">
          {connected
            ? 'ONLINE'
            : 'CONECTANDO'}
        </span>

        <strong>
          {players.length}
        </strong>

        <span
          className={
            panelOpen
              ? 'online-toggle-arrow open'
              : 'online-toggle-arrow'
          }
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {panelOpen && (
        <aside className="online-players">
          <header className="online-players-header">
            <div>
              <span
                className={
                  connected
                    ? 'online-status-dot online'
                    : 'online-status-dot'
                }
              />

              <span className="online-status-label">
                {connected
                  ? 'ONLINE'
                  : 'CONECTANDO'}
              </span>
            </div>

            <div className="online-header-actions">
              <strong>
                {players.length}
              </strong>

              <button
                type="button"
                className="online-players-close"
                onClick={() => {
                  setPanelOpen(false)
                  setEditingName(false)
                }}
                aria-label="Fechar jogadores online"
              >
                ×
              </button>
            </div>
          </header>

          <div className="online-players-title">
            JOGADORES NA NOITE
          </div>

          {hasDefaultName &&
            !editingName && (
              <button
                type="button"
                className="online-set-name"
                onClick={() => {
                  setLocalError('')
                  setEditingName(true)
                }}
              >
                DEFINIR SEU NOME
              </button>
            )}

          {editingName && (
            <form
              className="online-name-form"
              onSubmit={saveName}
            >
              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                maxLength={40}
                placeholder="Nome do jogador"
                autoFocus
              />

              <button type="submit">
                SALVAR
              </button>
            </form>
          )}

          {visibleError && (
            <p className="online-error">
              {visibleError}
            </p>
          )}

          <div className="online-players-list">
            {players.length === 0 ? (
              <p className="online-empty">
                Nenhum jogador visível.
              </p>
            ) : (
              players.map(
                (player) => (
                  <div
                    className="online-player"
                    key={player.userId}
                  >
                    <span className="online-player-dot" />

                    <div>
                      <strong>
                        {player.displayName}

                        {player.userId ===
                          user?.id && (
                          <small>
                            VOCÊ
                          </small>
                        )}
                      </strong>

                      <span>
                        {formatPlayerLocation(
                          player
                        )}
                      </span>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </aside>
      )}
    </div>
  )
}
