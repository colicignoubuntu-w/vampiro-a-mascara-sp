import './HumanityCheck.css'

function getResultTitle(
  roll
) {
  if (
    roll.result ===
    'remorse'
  ) {
    return 'REMORSO'
  }

  if (
    roll.result ===
    'automaticLoss'
  ) {
    return 'DEGENERAÇÃO'
  }

  if (
    roll.result ===
    'botch'
  ) {
    return 'ENDURECIMENTO'
  }

  return 'DEGENERAÇÃO'
}

function getResultText(
  roll
) {
  if (
    roll.result ===
    'remorse'
  ) {
    return (
      'O peso do que aconteceu ainda consegue atravessar a Besta. A culpa dói, mas essa dor prova que alguma parte humana continua viva em você.'
    )
  }

  if (
    roll.result ===
    'automaticLoss'
  ) {
    return (
      'A escolha ultrapassou uma fronteira que você não consegue atravessar sem perder parte de si mesmo.'
    )
  }

  if (
    roll.result ===
    'botch'
  ) {
    return (
      'Por um instante, o mais assustador não é o que você fez. É perceber como sua mente encontra maneiras de aceitar aquilo.'
    )
  }

  return (
    'Você procura uma justificativa. Necessidade. Fome. Acidente. Aos poucos, a justificativa pesa mais que a culpa.'
  )
}

export default function HumanityCheck({
  roll,
  preview,
  onRoll,
  onContinue,
}) {
  return (
    <div className="humanity-overlay">
      <section className="humanity-modal">
        <span className="humanity-kicker">
          HUMANIDADE
        </span>

        <h2>
          Degeneração
        </h2>

        <p className="humanity-event">
          {
            preview.label
          }
        </p>

        <div className="humanity-stats">
          <div>
            <span>
              Humanidade
            </span>

            <strong>
              {
                preview.humanity
              }
            </strong>
          </div>

          <div>
            <span>
              Consciência
            </span>

            <strong>
              {
                preview.conscience
              }
            </strong>
          </div>

          <div>
            <span>
              Dificuldade
            </span>

            <strong>
              {
                preview.difficulty
              }
            </strong>
          </div>
        </div>

        {!roll && (
          <>
            <p className="humanity-description">
              O personagem precisa
              encarar moralmente o que
              aconteceu.
            </p>

            <div className="humanity-actions">
              <button
                type="button"
                className="primary-button"
                onClick={
                  onRoll
                }
              >
                Testar Consciência
              </button>
            </div>
          </>
        )}

        {roll && (
          <>
            {roll.dice.length >
              0 && (
              <div className="humanity-dice">
                {roll.dice.map(
                  (
                    die,
                    index
                  ) => (
                    <span
                      key={
                        index
                      }
                      className={
                        die >=
                        roll.difficulty
                          ? 'success'
                          : die ===
                              1
                            ? 'one'
                            : ''
                      }
                    >
                      {die}
                    </span>
                  )
                )}
              </div>
            )}

            <div className="humanity-result">
              <strong>
                {
                  getResultTitle(
                    roll
                  )
                }
              </strong>

              <p>
                {
                  getResultText(
                    roll
                  )
                }
              </p>

              {roll.humanityLost >
                0 && (
                <span>
                  Humanidade -{
                    roll.humanityLost
                  }
                </span>
              )}

              {roll.humanityLost ===
                0 && (
                <span>
                  Humanidade preservada
                </span>
              )}
            </div>

            <div className="humanity-actions">
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