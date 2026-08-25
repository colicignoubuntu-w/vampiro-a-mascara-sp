import {
  runWithDiceSound,
} from '../../engine/audio/audioCues'

import './HumanityTest.css'

function getResultTitle(
  result
) {
  if (!result) {
    return ''
  }

  if (
    result.result ===
    'success'
  ) {
    return 'REMORSO'
  }

  if (
    result.result ===
    'botch'
  ) {
    return 'A BESTA ENCONTRA ESPAÇO'
  }

  return 'DEGENERAÇÃO'
}

export default function HumanityTest({
  game,
  trigger,
  result,
  onRoll,
  onContinue,
}) {
  const conscience =
    game?.virtues
      ?.conscience ?? 1

  const humanity =
    game?.humanity
      ?.current ?? 0

  return (
    <div className="humanity-overlay">
      <section className="humanity-modal">
        <header className="humanity-header">
          <span>
            HUMANIDADE
          </span>

          <h2>
            Degeneração
          </h2>

          <p>
            Há coisas que nem a
            existência vampírica
            consegue transformar
            imediatamente em algo
            normal.
          </p>
        </header>

        {!result && (
          <>
            <div className="humanity-event">
              <span>
                O QUE ACONTECEU
              </span>

              <strong>
                {
                  trigger.title
                }
              </strong>

              <p>
                {
                  trigger.description
                }
              </p>
            </div>

            <div className="humanity-memory">
              <span>
                PENSAMENTO
              </span>

              <p>
                “
                {
                  trigger.memory
                }
                ”
              </p>
            </div>

            <div className="humanity-stats">
              <div>
                <span>
                  Humanidade
                </span>

                <strong>
                  {humanity}
                </strong>
              </div>

              <div>
                <span>
                  Consciência
                </span>

                <strong>
                  {conscience}
                </strong>
              </div>

              <div>
                <span>
                  Dificuldade
                </span>

                <strong>
                  {
                    trigger.difficulty ??
                    8
                  }
                </strong>
              </div>
            </div>

            <p className="humanity-explanation">
              O teste de Consciência
              determina se o personagem
              ainda reconhece moralmente
              aquilo que fez.

              Se falhar, perde
              1 ponto de Humanidade.
            </p>

            <button
              type="button"
              className="humanity-roll-button"
              onClick={() =>
                runWithDiceSound(
                  onRoll
                )
              }
            >
              Testar Consciência
            </button>
          </>
        )}

        {result && (
          <>
            <div className="humanity-dice">
              {result.dice.map(
                (
                  die,
                  index
                ) => {
                  let className =
                    'humanity-die'

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
                `humanity-result ${result.result}`
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
                <>
                  <p>
                    Você não consegue
                    simplesmente fingir
                    que aquilo não
                    aconteceu.
                  </p>

                  <p>
                    Culpa, horror ou
                    remorso permanecem.
                  </p>

                  <div className="humanity-change safe">
                    Humanidade mantida:
                    {' '}
                    {
                      result.humanityBefore
                    }
                  </div>
                </>
              )}

              {result.result ===
                'failure' && (
                <>
                  <p>
                    Sua mente começa
                    a encontrar maneiras
                    de justificar aquilo.
                  </p>

                  <p>
                    Talvez fosse
                    inevitável.

                    Talvez fosse
                    necessário.

                    Talvez aquela vida
                    simplesmente não
                    importe tanto agora.
                  </p>

                  <div className="humanity-change lost">
                    Humanidade:
                    {' '}
                    {
                      result.humanityBefore
                    }
                    {' → '}
                    {
                      Math.max(
                        0,
                        result.humanityBefore -
                          1
                      )
                    }
                  </div>
                </>
              )}

              {result.result ===
                'botch' && (
                <>
                  <p>
                    Não é apenas
                    ausência de remorso.
                  </p>

                  <p>
                    Alguma coisa dentro
                    de você aceita o
                    acontecimento com
                    facilidade demais.
                  </p>

                  <p>
                    A Besta encontrou
                    mais espaço.
                  </p>

                  <div className="humanity-change critical">
                    Humanidade:
                    {' '}
                    {
                      result.humanityBefore
                    }
                    {' → '}
                    {
                      Math.max(
                        0,
                        result.humanityBefore -
                          1
                      )
                    }
                  </div>

                  <small className="humanity-scar-warning">
                    Uma consequência
                    psicológica também
                    foi registrada.
                  </small>
                </>
              )}
            </div>

            <button
              type="button"
              className="humanity-continue-button"
              onClick={
                onContinue
              }
            >
              Continuar
            </button>
          </>
        )}
      </section>
    </div>
  )
}
