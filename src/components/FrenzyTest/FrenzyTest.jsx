import {
  runWithDiceSound,
} from '../../engine/audio/audioCues'

import './FrenzyTest.css'

function getTypeName(
  type
) {
  if (
    type === 'hunger'
  ) {
    return 'Frenesi de Fome'
  }

  if (
    type === 'fear'
  ) {
    return 'Rötschreck'
  }

  return 'Frenesi de Raiva'
}

function getResultTitle(
  result
) {
  if (
    result.result ===
    'success'
  ) {
    return 'A BESTA RECUA'
  }

  if (
    result.result ===
    'botch'
  ) {
    return 'VOCÊ PERDE O CONTROLE'
  }

  return 'A BESTA ASSUME'
}

export default function FrenzyTest({
  game,
  trigger,
  result,
  onRoll,
  onContinue,
}) {
  const type =
    trigger?.type ??
    'rage'

  const traitValue =
    type === 'fear'
      ? game?.virtues
          ?.courage ?? 1
      : game?.virtues
          ?.selfControl ?? 1

  const traitLabel =
    type === 'fear'
      ? 'Coragem'
      : 'Autocontrole'

  return (
    <div className="frenzy-overlay">
      <section className="frenzy-modal">
        <header className="frenzy-header">
          <span>
            A BESTA
          </span>

          <h2>
            {getTypeName(
              type
            )}
          </h2>

          <p>
            {
              trigger.description
            }
          </p>
        </header>

        {!result && (
          <>
            <div className="frenzy-warning">
              <strong>
                {
                  trigger.title
                }
              </strong>

              <p>
                Você precisa resistir
                antes que a Besta
                assuma o controle.
              </p>
            </div>

            <div className="frenzy-stats">
              <div>
                <span>
                  {traitLabel}
                </span>

                <strong>
                  {traitValue}
                </strong>
              </div>

              <div>
                <span>
                  Dificuldade
                </span>

                <strong>
                  {
                    trigger.difficulty ??
                    6
                  }
                </strong>
              </div>

              <div>
                <span>
                  Tipo
                </span>

                <strong className="frenzy-type-value">
                  {type ===
                  'fear'
                    ? 'MEDO'
                    : type ===
                        'hunger'
                      ? 'FOME'
                      : 'RAIVA'}
                </strong>
              </div>
            </div>

            <p className="frenzy-explanation">
              Em caso de falha,
              você perde o controle
              temporariamente.

              Em uma falha crítica,
              a Besta assume de forma
              muito mais violenta e
              as consequências podem
              ser graves.
            </p>

            <button
              type="button"
              className="frenzy-roll-button"
              onClick={() =>
                runWithDiceSound(
                  onRoll
                )
              }
            >
              Resistir à Besta
            </button>
          </>
        )}

        {result && (
          <>
            <div className="frenzy-dice">
              {result.dice.map(
                (
                  die,
                  index
                ) => {
                  let className =
                    'frenzy-die'

                  if (
                    die >=
                    result.difficulty
                  ) {
                    className +=
                      ' success'
                  }

                  if (
                    die === 1
                  ) {
                    className +=
                      ' one'
                  }

                  return (
                    <span
                      key={
                        `${die}-${index}`
                      }
                      className={
                        className
                      }
                    >
                      {die}
                    </span>
                  )
                }
              )}
            </div>

            <div
              className={
                `frenzy-result ${result.result}`
              }
            >
              <span>
                RESULTADO
              </span>

              <strong>
                {
                  getResultTitle(
                    result
                  )
                }
              </strong>

              {result.result ===
                'success' && (
                <p>
                  A Besta continua
                  dentro de você,
                  mas sua vontade
                  permanece no controle.
                </p>
              )}

              {result.result ===
                'failure' && (
                <p>
                  Seu pensamento é
                  empurrado para o fundo.

                  A partir daqui,
                  você não decide
                  o que acontece.

                  Quando recuperar
                  o controle, terá
                  de lidar com o
                  que fez.
                </p>
              )}

              {result.result ===
                'botch' && (
                <p>
                  Algo dentro de você
                  se rompe.

                  Não existe hesitação.
                  Não existe escolha.

                  A Besta assume
                  completamente.

                  Quando você voltar,
                  as consequências
                  serão piores.
                </p>
              )}
            </div>

            <button
              type="button"
              className="frenzy-continue-button"
              onClick={
                onContinue
              }
            >
              {result.result ===
              'success'
                ? 'Continuar'
                : 'Perder o Controle'}
            </button>
          </>
        )}
      </section>
    </div>
  )
}
