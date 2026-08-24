import './TravelEventPanel.css'

export default function TravelEventPanel({
  event,
  travel,
  onContinue,
}) {
  if (!event) {
    return null
  }

  const narration =
    Array.isArray(
      event.narration
    )
      ? event.narration
      : []

  const hasTest =
    Boolean(
      event.test
    )

  return (
    <div className="travel-event-overlay">
      <section
        className="travel-event-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Evento durante a viagem"
      >
        <header className="travel-event-header">
          <span className="travel-event-kicker">
            DURANTE O DESLOCAMENTO
          </span>

          <h1>
            {event.title ??
              'Algo acontece'}
          </h1>

          {travel && (
            <p className="travel-event-route">
              {travel.fromName ??
                'Local desconhecido'}

              <span>
                →
              </span>

              {travel.toName ??
                'Destino'}
            </p>
          )}
        </header>

        <div className="travel-event-body">
          {event.type &&
            event.type !==
              'none' && (
              <span
                className={
                  `travel-event-type travel-event-type-${event.type}`
                }
              >
                {getEventTypeLabel(
                  event.type
                )}
              </span>
            )}

          <div className="travel-event-narration">
            {narration.map(
              (
                paragraph,
                index
              ) => (
                <p
                  key={
                    `${event.id ?? 'travel-event'}-${index}`
                  }
                >
                  {paragraph}
                </p>
              )
            )}
          </div>

          {hasTest && (
            <div className="travel-event-test-preview">
              <span>
                TESTE
              </span>

              <strong>
                {event.test.label ??
                  'Teste necessário'}
              </strong>

              <p>
                {event.test.attribute}

                {event.test.ability
                  ? ` + ${event.test.ability}`
                  : ''}

                {event.test.difficulty
                  ? ` · Dificuldade ${event.test.difficulty}`
                  : ''}
              </p>
            </div>
          )}

          {event.effects?.hunger && (
            <div className="travel-event-warning">
              A Besta reage à situação.
            </div>
          )}
        </div>

        <footer className="travel-event-footer">
          <button
            type="button"
            className="travel-event-continue"
            onClick={
              onContinue
            }
          >
            {hasTest
              ? 'Enfrentar situação'
              : 'Continuar viagem'}
          </button>
        </footer>
      </section>
    </div>
  )
}

function getEventTypeLabel(
  type
) {
  const labels = {
    police:
      'Polícia',

    hunger:
      'Fome',

    encounter:
      'Encontro',

    danger:
      'Perigo',

    supernatural:
      'Sobrenatural',

    none:
      'Viagem',
  }

  return (
    labels[
      type
    ] ??
    'Evento'
  )
}