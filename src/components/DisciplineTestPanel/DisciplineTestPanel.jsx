import {
  runWithDiceSound,
} from '../../engine/audio/audioCues'

import './DisciplineTestPanel.css'

export default function DisciplineTestPanel({
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

  const discipline =
    evaluation.discipline

  return (
    <div className="discipline-test-overlay">
      <section className="discipline-test-panel">
        <header className="discipline-test-header">
          <span>
            DISCIPLINA
          </span>

          <h2>
            {power?.label ??
              'Poder'}
          </h2>

          <p>
            {discipline?.label ??
              power?.discipline ??
              'Disciplina'}
          </p>
        </header>

        <div className="discipline-test-command">
          <span>
            AÇÃO
          </span>

          <strong>
            {evaluation.choice?.text}
          </strong>
        </div>

        {test.requiresTest ? (
          <>
            <div className="discipline-test-pool">
              <div>
                <span>
                  {test.attribute}
                </span>

                <strong>
                  {test.attributeValue}
                </strong>
              </div>

              <div className="discipline-test-symbol">
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

              <div className="discipline-test-symbol">
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

            <div className="discipline-test-difficulty">
              Dificuldade
              {' '}
              <strong>
                {test.difficulty}
              </strong>
            </div>

            {!roll && (
              <button
                type="button"
                className="discipline-test-roll"
                onClick={() =>
                  runWithDiceSound(
                    onRoll
                  )
                }
              >
                Rolar Dados
              </button>
            )}

            {roll && (
              <>
                <div className="discipline-test-dice">
                  {roll.dice.map(
                    (
                      die,
                      index
                    ) => (
                      <span
                        key={`discipline-die-${index}`}
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
                    `discipline-test-result discipline-test-result-${roll.result}`
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

                <button
                  type="button"
                  className="discipline-test-continue"
                  onClick={onContinue}
                >
                  Continuar
                </button>
              </>
            )}
          </>
        ) : (
          <div className="discipline-test-automatic">
            <strong>
              Uso direto
            </strong>

            <p>
              Este poder não exige uma
              rolagem nesta situação.
            </p>

            <button
              type="button"
              onClick={onContinue}
            >
              Usar Poder
            </button>
          </div>
        )}

        {!roll &&
          test.requiresTest && (
          <button
            type="button"
            className="discipline-test-cancel"
            onClick={onCancel}
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
      'discipline-test-die discipline-test-die-one'
    )
  }

  if (
    die >= difficulty
  ) {
    return (
      'discipline-test-die discipline-test-die-success'
    )
  }

  return 'discipline-test-die'
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
