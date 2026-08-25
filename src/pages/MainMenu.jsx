import {
  hasFinishedCharacter,
  loadFinalCharacter,
} from '../utils/characterFinalizer'
import AudioControls from '../components/AudioControls/AudioControls'
import {
  useSceneAudio,
} from '../engine/audio/useSceneAudio'

export default function MainMenu({
  onNewGame,
  onContinue,
  onOpenSheet,
}) {
  useSceneAudio(
    'main_menu',
    null
  )

  const hasCharacter =
    hasFinishedCharacter()

  const character =
    hasCharacter
      ? loadFinalCharacter()
      : null

  const characterName =
    character?.identity?.name ||
    'Personagem'

  const clan =
    character?.identity?.clan ||
    ''

  const generation =
    character?.identity?.generation ||
    ''

  return (
    <main className="main-menu">
      <div className="main-menu-background" />

      <div className="main-menu-overlay" />

      <section className="main-menu-content">
        <div className="main-menu-brand">
          <span className="main-menu-kicker">
            VAMPIRO
          </span>

          <h1>
            SÃO PAULO
          </h1>

          <p>
            As noites escondem mais
            do que a cidade permite ver.
          </p>
        </div>

        {hasCharacter && (
          <div className="main-menu-save">
            <span>
              Último personagem
            </span>

            <strong>
              {characterName}
            </strong>

            <small>
              {clan}

              {generation
                ? ` · ${generation}`
                : ''}
            </small>
          </div>
        )}

        <nav className="main-menu-actions">
          <button
            type="button"
            className="main-menu-button primary"
            onClick={
              onNewGame
            }
          >
            Novo Jogo
          </button>

          <button
            type="button"
            className="main-menu-button"
            disabled={
              !hasCharacter
            }
            onClick={
              onContinue
            }
          >
            Continuar
          </button>

          <button
            type="button"
            className="main-menu-button"
            disabled={
              !hasCharacter
            }
            onClick={
              onOpenSheet
            }
          >
            Ficha
          </button>

          <AudioControls />
        </nav>

        {!hasCharacter && (
          <p className="main-menu-hint">
            Crie um personagem para
            liberar Continuar e Ficha.
          </p>
        )}

        <footer className="main-menu-footer">
          <span>
            Crônica de São Paulo
          </span>

          <span>
            Noite 1
          </span>
        </footer>
      </section>
    </main>
  )
}
