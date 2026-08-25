import {
  getVictimState,
} from '../../engine/vampire/feedingEngine'

import './FeedingPanel.css'

function formatDice(
  dice
) {
  if (
    !Array.isArray(dice) ||
    dice.length === 0
  ) {
    return '—'
  }

  return dice.join(
    ', '
  )
}

export default function FeedingPanel({
  game,
  victim,
  stopFeedingRoll = null,
  onDrink,
  onStop,
  onResolveStopFeeding,
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

  const stopTestSuccess =
    stopFeedingRoll
      ?.result ===
    'success'

  const stopTestBotch =
    stopFeedingRoll
      ?.result ===
    'botch'

  const stopTestFailure =
    Boolean(
      stopFeedingRoll
    ) &&
    !stopTestSuccess

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
              {victim.name}
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
            {state.description}
          </p>
        </div>

        {stopFeedingRoll && (
          <div className="feeding-message">
            <span>
              AUTOCONTROLE
            </span>

            <strong>
              {
                stopTestSuccess
                  ? 'Você domina a Besta.'
                  : stopTestBotch
                    ? 'A Besta toma o controle.'
                    : 'A Besta não quer parar.'
              }
            </strong>

            <p>
              Autocontrole:{' '}
              {
                stopFeedingRoll
                  .virtueValue ??
                '—'
              }
              {' · '}
              Dificuldade:{' '}
              {
                stopFeedingRoll
                  .difficulty ??
                '—'
              }
            </p>

            <p>
              Dados:{' '}
              {
                formatDice(
                  stopFeedingRoll
                    .dice
                )
              }
            </p>

            <p>
              Sucessos:{' '}
              {
                stopFeedingRoll
                  .successes ??
                0
              }
            </p>

            {stopTestSuccess && (
              <p>
                Você consegue afastar
                os dentes e interromper
                a alimentação.
              </p>
            )}

            {stopTestFailure && (
              <p>
                {
                  stopTestBotch
                    ? 'Você perde o controle de forma violenta. A Besta tenta arrancar mais sangue antes que você consiga reagir.'
                    : 'O cheiro e o gosto do sangue vencem sua decisão. A Besta força você a beber mais.'
                }
              </p>
            )}

            <button
              type="button"
              onClick={
                onResolveStopFeeding
              }
            >
              {
                stopTestSuccess
                  ? 'Afastar-se'
                  : stopTestBotch
                    ? 'A Besta assume'
                    : 'A Besta bebe mais'
              }
            </button>
          </div>
        )}

        {!stopFeedingRoll &&
          !victimDead &&
          !playerFull && (
          <>
            <p className="feeding-description">
              Você sente o sangue
              entrando em seu corpo.

              A fome diminui.

              Você pode tentar parar,
              mas uma fome intensa pode
              exigir que domine a Besta.
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
                Tentar parar
              </button>
            </div>
          </>
        )}

        {!stopFeedingRoll &&
          playerFull &&
          !victimDead && (
          <div className="feeding-message">
            <strong>
              Você está saciado.
            </strong>

            <p>
              Sua reserva de sangue
              está cheia. A fome já
              não força você a continuar.
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

        {!stopFeedingRoll &&
          victimDead && (
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