import './FeedingControl.css'

function getTitle(
  roll
) {
  if (
    roll.result ===
    'success'
  ) {
    return 'VOCÊ CONSEGUE PARAR'
  }

  if (
    roll.result ===
    'botch'
  ) {
    return 'FRENESI DE FOME'
  }

  return 'A BESTA NÃO DEIXA'
}

function getDescription(
  roll
) {
  if (
    roll.result ===
    'success'
  ) {
    return (
      'Você força os dentes para longe da ferida. Cada instinto manda continuar, mas sua vontade ainda é sua.'
    )
  }

  if (
    roll.result ===
    'botch'
  ) {
    return (
      'Sua mente perde o controle. O sangue, o cheiro e a fome engolem qualquer pensamento racional. A Besta assume.'
    )
  }

  return (
    'Você tenta se afastar, mas o corpo não obedece. Seus dentes permanecem na vítima e você continua bebendo.'
  )
}

export default function FeedingControl({
  preview,
  roll,
  onRoll,
  onContinue,
}) {
  return (
    <div className="feeding-control-overlay">
      <section className="feeding-control-modal">
        <span className="feeding-control-kicker">
          A BESTA
        </span>

        <h2>
          Parar de beber
        </h2>

        <p className="feeding-control-text">
          O sangue ainda está quente.
          Seu corpo quer continuar.
        </p>

        <div className="feeding-control-stats">
          <div>
            <span>
              Sangue
            </span>

            <strong>
              {
                preview.bloodCurrent
              }
              /
              {
                preview.bloodMaximum
              }
            </strong>
          </div>

          <div>
            <span>
              Fome
            </span>

            <strong>
              {
                preview.hungerLabel
              }
            </strong>
          </div>

          <div>
            <span>
              Autocontrole
            </span>

            <strong>
              {
                preview.selfControl
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
            <p className="feeding-control-warning">
              Você precisa vencer a
              Besta para interromper
              a alimentação.
            </p>

            <div className="feeding-control-actions">
              <button
                type="button"
                className="primary-button"
                onClick={
                  onRoll
                }
              >
                Resistir
              </button>
            </div>
          </>
        )}

        {roll && (
          <>
            <div className="feeding-control-dice">
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

            <div
              className={
                `feeding-control-result ${roll.result}`
              }
            >
              <strong>
                {
                  getTitle(
                    roll
                  )
                }
              </strong>

              <p>
                {
                  getDescription(
                    roll
                  )
                }
              </p>
            </div>

            <div className="feeding-control-actions">
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