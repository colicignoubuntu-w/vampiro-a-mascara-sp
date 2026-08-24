import './DaySleepPanel.css'

export default function DaySleepPanel({
  game,
  daySleep,
  onSleep,
}) {
  if (
    !game ||
    !daySleep
  ) {
    return null
  }

  const blood =
    game?.blood?.current ??
    0

  const aggravatedPrepared =
    Boolean(
      game?.healing
        ?.aggravatedPrepared
    )

  return (
    <div className="day-sleep-overlay">
      <section className="day-sleep-panel">
        <header className="day-sleep-header">
          <span>
            AMANHECER
          </span>

          <h2>
            O Dia Chegou
          </h2>

          <p>
            {
              daySleep.location
            }
          </p>
        </header>

        <div className="day-sleep-description">
          <p>
            O peso do dia começa a
            tomar seu corpo.
          </p>

          <p>
            Você está em um local
            protegido da luz solar.
          </p>

          <p>
            Sua consciência começa
            a desaparecer conforme
            o torpor diurno se
            aproxima.
          </p>
        </div>

        <div className="day-sleep-info">
          <div>
            <span>
              NOITE ATUAL
            </span>

            <strong>
              {
                game?.world
                  ?.night ?? 1
              }
            </strong>
          </div>

          <div>
            <span>
              SANGUE
            </span>

            <strong>
              {blood}
            </strong>
          </div>
        </div>

        {aggravatedPrepared && (
          <div className="day-sleep-healing">
            <span>
              CURA AGRAVADA PREPARADA
            </span>

            <p>
              Durante o repouso,
              1 nível de dano
              agravado será curado.
            </p>
          </div>
        )}

        <div className="day-sleep-warning">
          <p>
            Enquanto estiver dormindo,
            você não poderá realizar
            ações normais.
          </p>
        </div>

        <button
          type="button"
          className="day-sleep-button"
          onClick={
            onSleep
          }
        >
          Dormir Até Anoitecer
        </button>
      </section>
    </div>
  )
}