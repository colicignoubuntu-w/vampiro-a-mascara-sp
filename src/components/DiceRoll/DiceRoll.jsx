import {
  calculateTestPool,
  canSpendWillpower,
} from '../../engine/tests/testEngine'

import './DiceRoll.css'

function getResultLabel(
  roll
) {
  if (
    roll.result ===
    'success'
  ) {
    if (
      roll.successes === 1
    ) {
      return '1 SUCESSO'
    }

    return `${roll.successes} SUCESSOS`
  }

  if (
    roll.result ===
    'botch'
  ) {
    return 'FALHA CRÍTICA'
  }

  return 'FALHA'
}

function getResultText(
  roll,
  test
) {
  if (
    roll.result ===
    'success'
  ) {
    return (
      test.successText ??
      'A ação foi bem-sucedida.'
    )
  }

  if (
    roll.result ===
    'botch'
  ) {
    return (
      test.botchText ??
      'Algo deu muito errado.'
    )
  }

  return (
    test.failureText ??
    'A ação falhou.'
  )
}

export default function DiceRoll({
  game,
  test,
  roll,

  spendWillpower,
  onToggleWillpower,

  onRoll,
  onContinue,
  onCancel,
}) {
  const poolData =
    calculateTestPool(
      game,
      test
    )

  const willpowerCurrent =
    game?.willpower
      ?.current ?? 0

  const willpowerMaximum =
    game?.willpower
      ?.maximum ?? 0

  const canUseWillpower =
    canSpendWillpower(
      game,
      test
    )

  return (
    <div className="dice-modal-overlay">
      <section className="dice-modal">
        <header className="dice-modal-header">
          <span>
            TESTE
          </span>

          <h2>
            {test.label}
          </h2>
        </header>

        {/* =========================
            COMPOSIÇÃO DA PARADA
        ========================= */}

        <div className="dice-test-breakdown">
          <div>
            <span>
              {
                test.attributeLabel
              }
            </span>

            <strong>
              {
                poolData.attributeValue
              }
            </strong>
          </div>

          <span className="dice-plus">
            +
          </span>

          <div>
            <span>
              {
                test.abilityLabel
              }
            </span>

            <strong>
              {
                poolData.abilityValue
              }
            </strong>
          </div>

          {poolData.modifier !==
            0 && (
            <>
              <span className="dice-plus">
                {poolData.modifier >
                0
                  ? '+'
                  : ''}
              </span>

              <div>
                <span>
                  Modificador
                </span>

                <strong>
                  {
                    poolData.modifier
                  }
                </strong>
              </div>
            </>
          )}

          {poolData.healthPenalty !==
            0 && (
            <>
              <span className="dice-plus">
                +
              </span>

              <div>
                <span>
                  Vitalidade
                </span>

                <strong>
                  {
                    poolData.healthPenalty
                  }
                </strong>
              </div>
            </>
          )}
        </div>

        {/* =========================
            PARADA / DIFICULDADE
        ========================= */}

        <div className="dice-test-summary">
          <div>
            <span>
              Parada
            </span>

            <strong>
              {poolData.pool}
            </strong>

            <small>
              dados
            </small>
          </div>

          <div>
            <span>
              Dificuldade
            </span>

            <strong>
              {
                test.difficulty ??
                6
              }
            </strong>
          </div>
        </div>

        {/* =========================
            FORÇA DE VONTADE
        ========================= */}

        {!roll && (
          <section className="dice-willpower">
            <div className="dice-willpower-header">
              <div>
                <span>
                  FORÇA DE VONTADE
                </span>

                <strong>
                  {willpowerCurrent}
                  /
                  {willpowerMaximum}
                </strong>
              </div>

              <span className="dice-willpower-cost">
                Custo: 1
              </span>
            </div>

            <p>
              Gaste 1 ponto temporário
              para receber 1 sucesso
              automático neste teste.
            </p>

            {canUseWillpower ? (
              <button
                type="button"
                className={
                  spendWillpower
                    ? 'dice-willpower-button selected'
                    : 'dice-willpower-button'
                }
                onClick={
                  onToggleWillpower
                }
              >
                <span className="dice-willpower-check">
                  {spendWillpower
                    ? '✓'
                    : ''}
                </span>

                <span>
                  {spendWillpower
                    ? 'Força de Vontade será usada'
                    : 'Usar Força de Vontade'}
                </span>
              </button>
            ) : (
              <div className="dice-willpower-disabled">
                {test.allowWillpower ===
                false
                  ? 'Força de Vontade não pode ser usada neste teste.'
                  : 'Você não possui Força de Vontade temporária disponível.'}
              </div>
            )}
          </section>
        )}

        {/* =========================
            ANTES DA ROLAGEM
        ========================= */}

        {!roll && (
          <div className="dice-before-roll">
            <p>
              Cada resultado igual ou
              superior à dificuldade
              conta como sucesso.
              Resultados 1 cancelam
              sucessos obtidos nos
              dados.
            </p>

            {spendWillpower && (
              <div className="dice-willpower-confirmation">
                +1 sucesso automático
                pela Força de Vontade
              </div>
            )}

            <div className="dice-modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={
                  onCancel
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={
                  onRoll
                }
              >
                Rolar Dados
              </button>
            </div>
          </div>
        )}

        {/* =========================
            RESULTADO
        ========================= */}

        {roll && (
          <>
            <div className="dice-results">
              {roll.dice.map(
                (
                  die,
                  index
                ) => {
                  const success =
                    die >=
                    roll.difficulty

                  const one =
                    die === 1

                  let className =
                    'dice-result'

                  if (success) {
                    className +=
                      ' success'
                  }

                  if (one) {
                    className +=
                      ' one'
                  }

                  return (
                    <div
                      className={
                        className
                      }
                      key={
                        `${die}-${index}`
                      }
                    >
                      {die}
                    </div>
                  )
                }
              )}
            </div>

            <div className="dice-result-details">
              <span>
                Sucessos nos dados:{' '}
                <strong>
                  {
                    roll.rawSuccesses
                  }
                </strong>
              </span>

              <span>
                Resultados 1:{' '}
                <strong>
                  {
                    roll.ones
                  }
                </strong>
              </span>

              {roll.automaticSuccesses >
                0 && (
                <span>
                  Sucessos automáticos:{' '}
                  <strong>
                    {
                      roll.automaticSuccesses
                    }
                  </strong>
                </span>
              )}
            </div>

            {roll.willpowerSpent && (
              <div className="dice-willpower-used">
                Força de Vontade utilizada:
                +1 sucesso automático
              </div>
            )}

            <div
              className={
                `dice-final-result ${roll.result}`
              }
            >
              <span>
                RESULTADO
              </span>

              <strong>
                {
                  getResultLabel(
                    roll
                  )
                }
              </strong>

              <p>
                {
                  getResultText(
                    roll,
                    test
                  )
                }
              </p>
            </div>

            <div className="dice-modal-actions">
              <button
                type="button"
                className="primary-button"
                onClick={
                  onContinue
                }
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}