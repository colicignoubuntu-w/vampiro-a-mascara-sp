import './DisciplineChoicePanel.css'

export default function DisciplineChoicePanel({
  choices,
  onChoose,
  onClose,
}) {
  if (
    !Array.isArray(choices) ||
    choices.length === 0
  ) {
    return null
  }

  return (
    <div className="discipline-choice-overlay">
      <section className="discipline-choice-panel">
        <header className="discipline-choice-header">
          <div>
            <span>
              DISCIPLINAS
            </span>

            <h2>
              Poderes disponíveis
            </h2>

            <p>
              Apenas poderes que seu personagem
              pode usar nesta situação aparecem aqui.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="discipline-choice-list">
          {choices.map(
            (entry) => {
              const choice =
                entry.choice

              const power =
                entry.power

              const discipline =
                entry.discipline

              const dots =
                '●'.repeat(
                  Number(
                    power?.level ??
                    1
                  )
                )

              return (
                <button
                  key={choice.id}
                  type="button"
                  className="discipline-choice-button"
                  onClick={() =>
                    onChoose(entry)
                  }
                >
                  <div className="discipline-choice-top">
                    <span className="discipline-choice-discipline">
                      {discipline?.label ??
                        power?.discipline ??
                        'Disciplina'}
                      {' '}
                      {dots}
                    </span>

                    <span className="discipline-choice-power">
                      {power?.label ??
                        'Poder'}
                    </span>
                  </div>

                  <strong>
                    {choice.text}
                  </strong>

                  {choice.description && (
                    <p>
                      {choice.description}
                    </p>
                  )}

                  <div className="discipline-choice-meta">
                    {Number(
                      power?.bloodCost ??
                      0
                    ) > 0 && (
                      <span>
                        Sangue:
                        {' '}
                        {power.bloodCost}
                      </span>
                    )}

                    <span>
                      {power?.requiresTest
                        ? 'Exige teste'
                        : 'Uso direto'}
                    </span>

                    {power?.masqueradeRisk &&
                      power.masqueradeRisk !==
                        'none' && (
                      <span>
                        Máscara:
                        {' '}
                        {formatRisk(
                          power.masqueradeRisk
                        )}
                      </span>
                    )}
                  </div>
                </button>
              )
            }
          )}
        </div>

        <button
          type="button"
          className="discipline-choice-cancel"
          onClick={onClose}
        >
          Cancelar
        </button>
      </section>
    </div>
  )
}

function formatRisk(
  risk
) {
  const labels = {
    low:
      'baixo',

    medium:
      'médio',

    high:
      'alto',
  }

  return (
    labels[risk] ??
    risk
  )
}