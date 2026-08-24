import {
  getVictimState,
} from '../../engine/vampire/feedingEngine'

import './FeedingPanel.css'

export default function FeedingPanel({
  game,
  victim,
  onDrink,
  onStop,
}) {
  const playerBlood =
    game?.blood?.current ?? 0

  const playerMaximum =
    game?.blood?.maximum ?? 10

  const state =
    getVictimState(
      victim
    )

  const playerFull =
    playerBlood >=
    playerMaximum

  const victimDead =
    !victim.alive ||
    victim.blood.current <= 0

  return (
    <div className="feeding-overlay">
      <section className="feeding-panel">
        <header className="feeding-header">
          <span>
            ALIMENTAÇÃO
          </span>

          <h2>
            O Beijo
          </h2>
        </header>

        <div className="feeding-columns">
          <div className="feeding-character">
            <span>
              VOCÊ
            </span>

            <strong>
              {playerBlood}
              /
              {playerMaximum}
            </strong>

            <small>
              Pontos de Sangue
            </small>
          </div>

          <div className="feeding-transfer">
            →
          </div>

          <div className="feeding-character">
            <span>
              {
                victim.name
              }
            </span>

            <strong>
              {
                victim.blood
                  .current
              }
              /
              {
                victim.blood
                  .maximum
              }
            </strong>

            <small>
              Sangue restante
            </small>
          </div>
        </div>

        <div
          className={
            `feeding-victim-state ${state.key}`
          }
        >
          <span>
            ESTADO DA VÍTIMA
          </span>

          <strong>
            {state.label}
          </strong>

          <p>
            {
              state.description
            }
          </p>
        </div>

        {!victimDead &&
          !playerFull && (
          <>
            <p className="feeding-description">
              Você sente o sangue
              entrando em seu corpo.

              A fome diminui.

              Você ainda está no
              controle e pode decidir
              quando parar.
            </p>

            <div className="feeding-actions">
              <button
                type="button"
                onClick={() =>
                  onDrink(1)
                }
              >
                Beber 1 ponto
              </button>

              <button
                type="button"
                onClick={() =>
                  onDrink(2)
                }
              >
                Beber 2 pontos
              </button>

              <button
                type="button"
                className="feeding-stop"
                onClick={
                  onStop
                }
              >
                Parar
              </button>
            </div>
          </>
        )}

        {playerFull &&
          !victimDead && (
          <div className="feeding-message">
            <strong>
              Você está saciado.
            </strong>

            <p>
              Sua reserva de sangue
              está cheia.
            </p>

            <button
              type="button"
              onClick={
                onStop
              }
            >
              Parar
            </button>
          </div>
        )}

        {victimDead && (
          <div className="feeding-death">
            <span>
              SILÊNCIO
            </span>

            <strong>
              A vítima não está mais respirando.
            </strong>

            <p>
              Você bebeu além do ponto
              em que ela poderia sobreviver.
            </p>

            <button
              type="button"
              onClick={
                onStop
              }
            >
              Afastar-se
            </button>
          </div>
        )}
      </section>
    </div>
  )
}