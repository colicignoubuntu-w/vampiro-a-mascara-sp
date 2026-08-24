import {
  getPoliceDangerLabel,
} from '../../engine/world/police/policeSearchEngine'

import './PoliceSearchPanel.css'

export default function PoliceSearchPanel({
  search,
  onSearch,
  onContinue,
}) {
  if (!search) {
    return null
  }

  const finished =
    search.status ===
    'finished'

  return (
    <div className="police-search-overlay">
      <section className="police-search-panel">
        <header className="police-search-header">
          <span>
            ABORDAGEM POLICIAL
          </span>

          <h2>
            Revista
          </h2>

          <p>
            O policial verifica o que
            você está carregando.
          </p>
        </header>

        {!finished && (
          <>
            <div className="police-search-description">
              <p>
                O policial começa pelos
                bolsos e pela cintura.
              </p>

              <p>
                Objetos encontrados podem
                mudar completamente a
                situação.
              </p>
            </div>

            <button
              type="button"
              className="police-search-main-button"
              onClick={
                onSearch
              }
            >
              Prosseguir com a Revista
            </button>
          </>
        )}

        {finished && (
          <>
            <div
              className={
                `police-search-danger police-search-danger-${search.dangerLevel}`
              }
            >
              <span>
                RESULTADO
              </span>

              <strong>
                {getPoliceDangerLabel(
                  search.dangerLevel
                )}
              </strong>
            </div>

            <div className="police-search-items">
              <span className="police-search-section-title">
                OBJETOS ENCONTRADOS
              </span>

              {search.items.length ===
              0 ? (
                <p className="police-search-empty">
                  Você não está carregando
                  nenhum item.
                </p>
              ) : (
                search.items.map(
                  (item) => (
                    <div
                      key={
                        item.inventoryId
                      }
                      className={
                        item.severity > 0
                          ? 'police-search-item police-search-item-suspicious'
                          : 'police-search-item'
                      }
                    >
                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        {item.quantity >
                          1 && (
                          <small>
                            ×
                            {
                              item.quantity
                            }
                          </small>
                        )}
                      </div>

                      <div className="police-search-item-classification">
                        {
                          item.classificationLabel
                        }
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {search.suspiciousItems
              .length > 0 && (
              <div className="police-search-suspicious">
                <span>
                  ATENÇÃO DO POLICIAL
                </span>

                {search.suspiciousItems.map(
                  (item) => (
                    <div
                      key={
                        `suspicious-${item.inventoryId}`
                      }
                    >
                      <strong>
                        {item.name}
                      </strong>

                      <p>
                        {
                          item.description
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="police-search-log">
              {(search.log ?? []).map(
                (
                  entry,
                  index
                ) => (
                  <p
                    key={
                      `police-log-${index}`
                    }
                    className={
                      `police-search-log-${entry.type}`
                    }
                  >
                    {entry.text}
                  </p>
                )
              )}
            </div>

            <button
              type="button"
              className="police-search-main-button"
              onClick={
                onContinue
              }
            >
              Continuar
            </button>
          </>
        )}
      </section>
    </div>
  )
}