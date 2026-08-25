import {
  runWithDiceSound,
} from '../../engine/audio/audioCues'

import './InstinctCheck.css'

function resultTitle(
  roll
) {
  if (
    roll.result ===
    'success'
  ) {
    return 'VOCÊ SE CONTROLA'
  }

  if (
    roll.result ===
    'botch'
  ) {
    return 'FRENESI'
  }

  if (
    roll.type ===
    'rotschreck'
  ) {
    return 'RÖTSCHRECK'
  }

  return 'A BESTA ASSUME O CONTROLE'
}

function resultDescription(
  roll
) {
  if (
    roll.result ===
    'success'
  ) {
    if (
      roll.type ===
      'hunger'
    ) {
      return (
        'A fome continua presente, mas você consegue impedir a Besta de assumir o controle.'
      )
    }

    return (
      'O medo ancestral do fogo rasga seus instintos, mas você permanece no controle.'
    )
  }

  if (
    roll.type ===
    'rotschreck'
  ) {
    return (
      'O fogo deixa de ser apenas uma ameaça. Seu corpo morto reage antes da sua mente: fugir se torna a única coisa que importa.'
    )
  }

  return (
    'O cheiro e a presença do sangue esmagam seu raciocínio. Por alguns instantes, não existe moral, estratégia ou consequência. Existe apenas fome.'
  )
}

export default function InstinctCheck({
  roll,
  onRoll,
  onContinue,
  onCancel,
  preview,
}) {
  return (
    <div className="instinct-overlay">
      <section className="instinct-modal">
        <span className="instinct-kicker">
          A BESTA
        </span>

        <h2>
          {preview.type ===
          'hunger'
            ? 'Fome'
            : 'Medo do Fogo'}
        </h2>

        <div className="instinct-info">
          <div>
            <span>
              Estímulo
            </span>

            <strong>
              {
                preview.stimulusLabel
              }
            </strong>
          </div>

          {preview.hungerLabel && (
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
          )}

          <div>
            <span>
              Virtude
            </span>

            <strong>
              {
                preview.virtue
              }
              {' '}
              {
                preview.virtueValue
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
            <p className="instinct-description">
              Seus instintos reagem antes
              da razão. Você precisa
              resistir.
            </p>

            <div className="instinct-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={onCancel}
              >
                Voltar
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  runWithDiceSound(
                    onRoll
                  )
                }
              >
                Resistir
              </button>
            </div>
          </>
        )}

        {roll && (
          <>
            <div className="instinct-dice">
              {roll.dice.map(
                (
                  die,
                  index
                ) => {
                  let className =
                    'instinct-die'

                  if (
                    die >=
                    roll.difficulty
                  ) {
                    className +=
                      ' success'
                  }

                  if (die === 1) {
                    className +=
                      ' one'
                  }

                  return (
                    <span
                      key={index}
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
                `instinct-result ${roll.result}`
              }
            >
              <strong>
                {
                  resultTitle(
                    roll
                  )
                }
              </strong>

              <p>
                {
                  resultDescription(
                    roll
                  )
                }
              </p>
            </div>

            <div className="instinct-actions">
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
