import './PoliceForcePanel.css'

export default function PoliceForcePanel({
  onChoose,
}) {
  return (
    <div className="police-force-overlay">
      <section className="police-force-panel">
        <header className="police-force-header">
          <span>
            TESTEMUNHAS HUMANAS
          </span>

          <h2>
            Quanto você vai mostrar?
          </h2>

          <p>
            Dois policiais estão diante de você.
          </p>
        </header>

        <div className="police-force-warning">
          <strong>
            A Máscara
          </strong>

          <p>
            Violência não é automaticamente uma
            violação da Máscara.
          </p>

          <p>
            Demonstrar capacidades claramente
            sobrenaturais diante de humanos é
            outra coisa.
          </p>
        </div>

        <div className="police-force-actions">
          <button
            type="button"
            onClick={() =>
              onChoose(
                'surrender'
              )
            }
          >
            <span>
              01
            </span>

            <div>
              <strong>
                Obedecer
              </strong>

              <p>
                Evitar que a situação fique ainda pior.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              onChoose(
                'normal_resistance'
              )
            }
          >
            <span>
              02
            </span>

            <div>
              <strong>
                Resistir sem revelar sua natureza
              </strong>

              <p>
                Usar apenas força que ainda poderia
                parecer humana.
              </p>

              <small>
                Não aumenta automaticamente o risco
                da Máscara.
              </small>
            </div>
          </button>

          <button
            type="button"
            className="police-force-supernatural"
            onClick={() =>
              onChoose(
                'vampiric_strength'
              )
            }
          >
            <span>
              03
            </span>

            <div>
              <strong>
                Usar sua força vampírica
              </strong>

              <p>
                Parar de se limitar e afastar o
                policial com força claramente
                sobrenatural.
              </p>

              <small>
                ⚠ Testemunhas humanas · Risco à Máscara
              </small>
            </div>
          </button>
        </div>
      </section>
    </div>
  )
}