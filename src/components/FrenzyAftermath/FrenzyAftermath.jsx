import './FrenzyAftermath.css'

function getTypeLabel(
  type
) {
  if (
    type === 'hunger'
  ) {
    return 'FOME'
  }

  if (
    type === 'fear'
  ) {
    return 'RÖTSCHRECK'
  }

  return 'RAIVA'
}

export default function FrenzyAftermath({
  aftermath,
  onContinue,
}) {
  if (!aftermath) {
    return null
  }

  const critical =
    aftermath.severity ===
    'critical'

  return (
    <div className="aftermath-overlay">
      <section
        className={
          critical
            ? 'aftermath-modal critical'
            : 'aftermath-modal'
        }
      >
        <header className="aftermath-header">
          <span>
            {
              getTypeLabel(
                aftermath.frenzyType
              )
            }
          </span>

          <h2>
            {
              aftermath.title
            }
          </h2>

          <p>
            {critical
              ? 'Você perdeu completamente o controle.'
              : 'A Besta assumiu por algum tempo.'}
          </p>
        </header>

        <div className="aftermath-blackout">
          <span>
            {
              aftermath.startTime
            }
          </span>

          <div className="aftermath-line" />

          <strong>
            {critical
              ? '...'
              : 'A BESTA'}
          </strong>

          <div className="aftermath-line" />

          <span>
            {
              aftermath.endTime
            }
          </span>
        </div>

        <div className="aftermath-time">
          <span>
            Tempo perdido
          </span>

          <strong>
            {
              aftermath.durationMinutes
            }
            {' '}
            minutos
          </strong>
        </div>

        <div className="aftermath-narration">
          {aftermath.narration.map(
            (
              paragraph,
              index
            ) => (
              <p
                key={
                  `aftermath-${index}`
                }
              >
                {
                  paragraph
                }
              </p>
            )
          )}
        </div>

        {aftermath.remembered &&
          aftermath.memories
            ?.length > 0 && (
            <section className="aftermath-memories">
              <span>
                VOCÊ SE LEMBRA
              </span>

              {aftermath.memories.map(
                (
                  memory,
                  index
                ) => (
                  <div
                    key={
                      `memory-${index}`
                    }
                  >
                    <small>
                      MEMÓRIA{' '}
                      {
                        index + 1
                      }
                    </small>

                    <p>
                      {memory}
                    </p>
                  </div>
                )
              )}
            </section>
          )}

        <div className="aftermath-location">
          <span>
            QUANDO VOCÊ VOLTA
          </span>

          <strong>
            {
              aftermath
                .location
                ?.name ??
              'Local desconhecido'
            }
          </strong>

          {aftermath
            .location
            ?.district && (
            <small>
              {
                aftermath
                  .location
                  .district
              }
            </small>
          )}
        </div>

        <button
          type="button"
          className="aftermath-continue"
          onClick={
            onContinue
          }
        >
          Recuperar o Controle
        </button>
      </section>
    </div>
  )
}