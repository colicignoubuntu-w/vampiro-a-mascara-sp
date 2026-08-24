import './TravelEventTest.css'

export default function TravelEventTest({
  event,
  test,
  roll,
  outcome,
  onRoll,
  onContinue,
}) {
  if (
    !event ||
    !test
  ) {
    return null
  }

  return (
    <div className="travel-test-overlay">
      <section className="travel-test-panel">
        <header className="travel-test-header">
          <span>
            EVENTO DE VIAGEM
          </span>

          <h2>
            {event.title}
          </h2>

          <p>
            {test.label}
          </p>
        </header>

        <div className="travel-test-pool">
          <div>
            <span>
              {test.attribute}
            </span>

            <strong>
              {test.attributeValue}
            </strong>
          </div>

          <div className="travel-test-plus">
            +
          </div>

          <div>
            <span>
              {test.ability}
            </span>

            <strong>
              {test.abilityValue}
            </strong>
          </div>

          <div className="travel-test-equals">
            =
          </div>

          <div>
            <span>
              DADOS
            </span>

            <strong>
              {test.pool}
            </strong>
          </div>
        </div>

        <div className="travel-test-difficulty">
          Dificuldade
          {' '}
          <strong>
            {test.difficulty}
          </strong>
        </div>

        {!roll && (
          <button
            type="button"
            className="travel-test-roll-button"
            onClick={
              onRoll
            }
          >
            Rolar Dados
          </button>
        )}

        {roll && (
          <>
            <div className="travel-test-dice">
              {roll.dice.map(
                (
                  die,
                  index
                ) => (
                  <span
                    key={
                      `travel-die-${index}`
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
                `travel-test-result travel-test-result-${roll.result}`
              }
            >
              <span>
                {getResultLabel(
                  roll.result
                )}
              </span>

              <strong>
                {roll.successes}
                {' '}
                sucesso(s)
              </strong>
            </div>
          </>
        )}

        {roll &&
          outcome && (
          <div className="travel-test-outcome">
            <h3>
              {outcome.title}
            </h3>

            {outcome.narration.map(
              (
                paragraph,
                index
              ) => (
                <p
                  key={
                    `outcome-${index}`
                  }
                >
                  {paragraph}
                </p>
              )
            )}
          </div>
        )}

        {roll &&
          outcome && (
          <button
            type="button"
            className="travel-test-continue"
            onClick={
              onContinue
            }
          >
            Continuar
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
      'travel-die travel-die-one'
    )
  }

  if (
    die >=
    difficulty
  ) {
    return (
      'travel-die travel-die-success'
    )
  }

  return 'travel-die'
}

function getResultLabel(
  result
) {
  if (
    result ===
    'success'
  ) {
    return 'SUCESSO'
  }

  if (
    result ===
    'botch'
  ) {
    return 'FALHA CRÍTICA'
  }

  return 'FALHA'
}