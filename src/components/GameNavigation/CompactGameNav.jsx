import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { createPortal } from 'react-dom'

import Relationships from '../Relationships/Relationships'
import NightLife from '../NightLife/NightLife'
import AudioControls from '../AudioControls/AudioControls'
import Smartphone from '../Phone/Smartphone'
import CityMap from '../CityMap/CityMap'

import './CompactGameNav.css'

export default function CompactGameNav({
  game,
  onGameChange,
  blocked = false,

  onOpenSheet,
  onOpenQuests,
  onOpenMasquerade,
  onOpenDisciplines,
  disciplineCount = 0,
  onToggleDev,
  onMenu,
  onTravel,
}) {
  const [
    panel,
    setPanel,
  ] = useState(
    null
  )

  const [
    mapOpen,
    setMapOpen,
  ] = useState(
    false
  )

  const panelRef =
    useRef(
      null
    )

  function togglePanel(
    id
  ) {
    setPanel(
      current =>
        current === id
          ? null
          : id
    )
  }

  function closePanel() {
    setPanel(
      null
    )
  }

  useEffect(
    () => {
      if (!panel) {
        return undefined
      }

      function onKeyDown(
        event
      ) {
        if (
          event.key ===
          'Escape'
        ) {
          closePanel()
        }
      }

      function onPointerDown(
        event
      ) {
        if (
          panelRef.current &&
          !panelRef.current.contains(
            event.target
          )
        ) {
          closePanel()
        }
      }

      document.addEventListener(
        'keydown',
        onKeyDown
      )

      document.addEventListener(
        'pointerdown',
        onPointerDown
      )

      return () => {
        document.removeEventListener(
          'keydown',
          onKeyDown
        )

        document.removeEventListener(
          'pointerdown',
          onPointerDown
        )
      }
    },
    [
      panel,
    ]
  )

  const nav = (
    <nav
      className="compact-game-nav"
      aria-label="Navegação principal"
      ref={panelRef}
    >
      <button
        type="button"
        className="compact-game-nav-button"
        onClick={
          onOpenSheet
        }
        disabled={
          blocked
        }
      >
        <span className="compact-game-nav-icon">
          ◈
        </span>

        <span>
          Personagem
        </span>
      </button>

      <div className="compact-game-nav-group">
        <button
          type="button"
          className={[
            'compact-game-nav-button',
            panel === 'diary'
              ? 'is-active'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() =>
            togglePanel(
              'diary'
            )
          }
          disabled={
            blocked
          }
          aria-expanded={
            panel ===
            'diary'
          }
        >
          <span className="compact-game-nav-icon">
            ◫
          </span>

          <span>
            Diário
          </span>
        </button>

        {panel ===
          'diary' && (
          <div className="compact-game-nav-popover compact-game-nav-popover-diary">
            <header>
              <span>
                DIÁRIO
              </span>

              <strong>
                Crônica
              </strong>
            </header>

            <div className="compact-game-nav-section">
              <Relationships
                game={
                  game
                }
                onChange={
                  onGameChange
                }
                blocked={
                  blocked
                }
              />

              <button
                type="button"
                onClick={() => {
                  closePanel()

                  onOpenQuests?.()
                }}
                disabled={
                  blocked
                }
              >
                Missões
              </button>
            </div>

            <p>
              Relações, missões e pistas importantes ficam reunidas aqui.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        className="compact-game-nav-button"
        onClick={() =>
          setMapOpen(
            true
          )
        }
        disabled={
          blocked
        }
      >
        <span className="compact-game-nav-icon">
          ◇
        </span>

        <span>
          Mapa
        </span>
      </button>

      <div className="compact-game-nav-phone">
        <Smartphone
          game={
            game
          }
          onChange={
            onGameChange
          }
          blocked={
            blocked
          }
        />
      </div>

      <div className="compact-game-nav-group">
        <button
          type="button"
          className={[
            'compact-game-nav-button',
            panel === 'menu'
              ? 'is-active'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() =>
            togglePanel(
              'menu'
            )
          }
          disabled={
            blocked
          }
          aria-expanded={
            panel ===
            'menu'
          }
        >
          <span className="compact-game-nav-icon">
            ☰
          </span>

          <span>
            Menu
          </span>
        </button>

        {panel ===
          'menu' && (
          <div className="compact-game-nav-popover compact-game-nav-popover-menu">
            <header>
              <span>
                MENU
              </span>

              <strong>
                Sistema
              </strong>
            </header>

            <div className="compact-game-nav-section">
              {disciplineCount >
                0 && (
                <button
                  type="button"
                  onClick={() => {
                    closePanel()

                    onOpenDisciplines?.()
                  }}
                  disabled={
                    blocked
                  }
                >
                  Poderes
                  {' '}
                  (
                  {
                    disciplineCount
                  }
                  )
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  closePanel()

                  onOpenMasquerade?.()
                }}
                disabled={
                  blocked
                }
              >
                Máscara
              </button>

              <NightLife
                game={
                  game
                }
                onChange={
                  onGameChange
                }
                blocked={
                  blocked
                }
                compact
              />
            </div>

            <div className="compact-game-nav-subsection">
              <span>
                ÁUDIO
              </span>

              <AudioControls />
            </div>

            {import.meta.env.DEV && (
              <div className="compact-game-nav-subsection">
                <span>
                  DESENVOLVIMENTO
                </span>

                <button
                  type="button"
                  onClick={() => {
                    closePanel()

                    onToggleDev?.()
                  }}
                >
                  DEV
                </button>
              </div>
            )}

            <button
              type="button"
              className="compact-game-nav-main-menu"
              onClick={() => {
                closePanel()

                onMenu?.()
              }}
            >
              Menu principal
            </button>
          </div>
        )}
      </div>
    </nav>
  )

  return (
    <>
      {nav}

      {mapOpen &&
        createPortal(
          <CityMap
            game={
              game
            }
            onClose={() =>
              setMapOpen(
                false
              )
            }
            onTravel={(
              travel
            ) => {
              setMapOpen(
                false
              )

              onTravel?.(
                travel
              )
            }}
          />,
          document.body
        )}
    </>
  )
}
