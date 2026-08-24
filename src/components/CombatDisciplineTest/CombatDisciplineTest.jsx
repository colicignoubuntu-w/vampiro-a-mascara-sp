import './CombatDisciplineTest.css'

export default function CombatDisciplineTest({
  evaluation,
  test,
  roll,
  onRoll,
  onContinue,
  onCancel,
}) {
  if (
    !evaluation ||
    !test
  ) {
    return null
  }

  const power =
    evaluation.power

  return (
    <div className="combat-discipline-test-overlay">
      <section className="combat-discipline-test-panel">
        <header className="combat-discipline-test-header">
          <span>
            PODER VAMPÍRICO
          </span>

          <h2>
            {power?.label ??
              'Disciplina'}
          </h2>

          <p>
            {
              evaluation.choice
                ?.text
            }
          </p>
        </header>

        <section className="combat-discipline-test-info">
          {test.requiresTest ? (
            <>
              <div className="combat-discipline-test-pool">
                <div>
                  <span>
                    {test.attribute ??
                      'Atributo'}
                  </span>

                  <strong>
                    {
                      test.attributeValue ??
                      0
                    }
                  </strong>
                </div>

                <b>
                  +
                </b>

                <div>
                  <span>
                    {test.ability ??
                      'Habilidade'}
                  </span>

                  <strong>
                    {
                      test.abilityValue ??
                      0
                    }
                  </strong>
                </div>

                <b>
                  =
                </b>

                <div>
                  <span>
                    DADOS
                  </span>

                  <strong>
                    {test.pool}
                  </strong>
                </div>
              </div>

              <div className="combat-discipline-test-difficulty">
                Dificuldade
                {' '}
                <strong>
                  {test.difficulty}
                </strong>
              </div>
            </>
          ) : (
            <div className="combat-discipline-test-automatic">
              USO AUTOMÁTICO
            </div>
          )}
        </section>

        {!roll &&
          test.requiresTest && (
          <button
            type="button"
            className="combat-discipline-roll-button"
            onClick={onRoll}
          >
            Rolar Dados
          </button>
        )}

        {roll && (
          <>
            <div className="combat-discipline-dice">
              {roll.dice.map(
                (
                  die,
                  index
                ) => (
                  <span
                    key={
                      `combat-discipline-die-${index}`
                    }
                    className={
                      getDieClass(
                        die,
                        test.difficulty
                      )
                    }
                  >
                    {die}
                  </span>
                )
              )}
            </div>

            <div
              className={
                `combat-discipline-result ${roll.result}`
              }
            >
              <strong>
                {getResultLabel(
                  roll.result
                )}
              </strong>

              <span>
                {roll.successes}
                {' '}
                sucesso(s)
              </span>
            </div>

            <button
              type="button"
              className="combat-discipline-continue-button"
              onClick={
                onContinue
              }
            >
              Continuar
            </button>
          </>
        )}

        {!test.requiresTest && (
          <button
            type="button"
            className="combat-discipline-continue-button"
            onClick={
              onContinue
            }
          >
            Usar Poder
          </button>
        )}

        {!roll && (
          <button
            type="button"
            className="combat-discipline-cancel-button"
            onClick={
              onCancel
            }
          >
            Cancelar
          </button>
        )}
      </section>
    </div>
  )
}

function getDieClass(
  die,
  difficulty
) {
  if (
    die === 1
  ) {
    return (
      'combat-discipline-die one'
    )
  }

  if (
    die >= difficulty
  ) {
    return (
      'combat-discipline-die success'
    )
  }

  return 'combat-discipline-die'
}

function getResultLabel(
  result
) {
  if (
    result === 'success'
  ) {
    return 'SUCESSO'
  }

  if (
    result === 'botch'
  ) {
    return 'FALHA CRÍTICA'
  }

  return 'FALHA'
}