import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getAvailableDestinations,
  getLocation,
  getRiskLabel,
  getTransportLabel,
  getTravelOptions,
  getTravelRisk,
} from '../../engine/world/travelEngine'

import './TravelPanel.css'

export default function TravelPanel({
  currentLocationId,
  game,
  onTravel,
  onCancel,
}) {
  const [
    destinationId,
    setDestinationId,
  ] = useState(null)

  const [
    selectedTransport,
    setSelectedTransport,
  ] = useState(null)

  const [
    error,
    setError,
  ] = useState('')

  /*
    ========================================
    LOCAL REAL DA CENA
    ========================================

    O jogo pode estar em locais específicos:

    hotel_room
    apartment
    asylum
    bar
    hospital

    Esses locais não precisam existir
    diretamente na tabela de transporte.

    Quando isso acontecer, usamos o Centro
    como ponto de saída padrão.

    Depois criaremos "zonas" para cada cena.
    ========================================
  */

  const knownCurrentLocation =
    getLocation(
      currentLocationId
    )

  const routeOriginId =
    knownCurrentLocation
      ? currentLocationId
      : 'centro'

  /*
    Nome mostrado ao jogador.

    Mesmo usando "centro" para calcular
    a rota, mantemos o nome verdadeiro
    da localização narrativa.
  */

  const currentLocation = {
    id:
      currentLocationId ??
      routeOriginId,

    name:
      knownCurrentLocation
        ?.name ??
      game?.world
        ?.location
        ?.name ??
      'Local atual',

    district:
      knownCurrentLocation
        ?.district ??
      game?.world
        ?.location
        ?.district ??
      'São Paulo',
  }

  /*
    ========================================
    DESTINOS
    ========================================
  */

  const destinations =
    useMemo(
      () =>
        getAvailableDestinations(
          routeOriginId
        ).filter(
          (location) =>
            location.id !==
            'prologue'
        ),
      [
        routeOriginId,
      ]
    )

  const destination =
    destinationId
      ? getLocation(
          destinationId
        )
      : null

  const options =
    destination
      ? getTravelOptions(
          routeOriginId,
          destinationId
        )
      : []

  /*
    ========================================
    TROCA DE DESTINO
    ========================================
  */

  useEffect(() => {
    setSelectedTransport(
      null
    )

    setError('')
  }, [
    destinationId,
  ])

  function chooseDestination(
    id
  ) {
    setDestinationId(
      id
    )

    setSelectedTransport(
      null
    )

    setError('')
  }

  /*
    ========================================
    VIAJAR
    ========================================
  */

  function handleTravel() {
    if (!destination) {
      setError(
        'Escolha um destino.'
      )

      return
    }

    const option =
      options.find(
        (item) =>
          item.transport ===
          selectedTransport
      )

    if (!option) {
      setError(
        'Escolha uma forma de transporte.'
      )

      return
    }

    setError('')

    onTravel({
      ...option,

      destinationId:
        destination.id,

      destination: {
        ...destination,
      },

      originId:
        routeOriginId,

      actualOriginId:
        currentLocationId,

      actualOriginName:
        currentLocation.name,

      risk:
        getTravelRisk(
          option,
          game
        ),
    })
  }

  /*
    ========================================
    RENDER
    ========================================
  */

  return (
    <div className="travel-panel-overlay">
      <section
        className="travel-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Viajar"
      >
        {/* ================================
            CABEÇALHO
        ================================ */}

        <header className="travel-panel-header">
          <div>
            <span className="travel-panel-kicker">
              DESLOCAMENTO
            </span>

            <h1>
              Viajar
            </h1>

            <p>
              Local atual:
              {' '}

              <strong>
                {currentLocation.name}
              </strong>
            </p>

            {currentLocation.district && (
              <small>
                {currentLocation.district}
              </small>
            )}
          </div>

          <button
            type="button"
            className="travel-close-button"
            onClick={
              onCancel
            }
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        {/* ================================
            ESCOLHER DESTINO
        ================================ */}

        {!destination && (
          <div className="travel-options">
            <div className="travel-section-title">
              Escolha o destino
            </div>

            {destinations.length ===
            0 ? (
              <div className="travel-panel-error">
                <p>
                  Nenhum destino disponível
                  a partir deste local.
                </p>
              </div>
            ) : (
              destinations.map(
                (
                  location
                ) => (
                  <button
                    key={
                      location.id
                    }
                    type="button"
                    className="travel-option"
                    onClick={() =>
                      chooseDestination(
                        location.id
                      )
                    }
                  >
                    <div className="travel-option-icon">
                      📍
                    </div>

                    <div className="travel-option-main">
                      <strong>
                        {
                          location.name
                        }
                      </strong>

                      <span>
                        {
                          location.district
                        }
                      </span>
                    </div>

                    <div className="travel-option-info">
                      <strong>
                        →
                      </strong>
                    </div>
                  </button>
                )
              )
            )}
          </div>
        )}

        {/* ================================
            ESCOLHER TRANSPORTE
        ================================ */}

        {destination && (
          <>
            <div className="travel-route">
              <div className="travel-route-location">
                <span>
                  ORIGEM
                </span>

                <strong>
                  {currentLocation.name}
                </strong>
              </div>

              <div className="travel-route-line">
                <span>
                  →
                </span>
              </div>

              <div className="travel-route-location">
                <span>
                  DESTINO
                </span>

                <strong>
                  {destination.name}
                </strong>
              </div>
            </div>

            <div className="travel-options">
              <button
                type="button"
                className="travel-back-destination"
                onClick={() => {
                  setDestinationId(
                    null
                  )

                  setSelectedTransport(
                    null
                  )

                  setError('')
                }}
              >
                ← Escolher outro destino
              </button>

              <div className="travel-section-title">
                Como você vai viajar?
              </div>

              {options.length ===
              0 ? (
                <div className="travel-panel-error">
                  <p>
                    Não existe uma rota
                    disponível entre
                    estes locais.
                  </p>

                  <button
                    type="button"
                    className="travel-button travel-button-secondary"
                    onClick={() => {
                      setDestinationId(
                        null
                      )

                      setSelectedTransport(
                        null
                      )
                    }}
                  >
                    Escolher outro destino
                  </button>
                </div>
              ) : (
                options.map(
                  (
                    option
                  ) => {
                    const isSelected =
                      selectedTransport ===
                      option.transport

                    const risk =
                      getTravelRisk(
                        option,
                        game
                      )

                    return (
                      <button
                        key={
                          option.transport
                        }
                        type="button"
                        className={
                          isSelected
                            ? 'travel-option travel-option-selected'
                            : 'travel-option'
                        }
                        onClick={() =>
                          setSelectedTransport(
                            option.transport
                          )
                        }
                      >
                        <div className="travel-option-icon">
                          {getTransportIcon(
                            option.transport
                          )}
                        </div>

                        <div className="travel-option-main">
                          <strong>
                            {getTransportLabel(
                              option.transport
                            )}
                          </strong>

                          <span>
                            {
                              option.minutes
                            }
                            {' '}
                            minutos
                          </span>
                        </div>

                        <div className="travel-option-info">
                          <strong>
                            {formatCost(
                              option.cost
                            )}
                          </strong>

                          <span
                            className={
                              `travel-risk travel-risk-${risk}`
                            }
                          >
                            Risco:
                            {' '}

                            {getRiskLabel(
                              risk
                            )}
                          </span>
                        </div>
                      </button>
                    )
                  }
                )
              )}
            </div>

            {/* ============================
                RESUMO
            ============================ */}

            {selectedTransport &&
              options.length >
                0 && (
              <TravelSummary
                game={
                  game
                }
                options={
                  options
                }
                selectedTransport={
                  selectedTransport
                }
              />
            )}
          </>
        )}

        {/* ================================
            ERRO
        ================================ */}

        {error && (
          <div className="travel-error">
            {error}
          </div>
        )}

        {/* ================================
            BOTÕES
        ================================ */}

        <footer className="travel-panel-footer">
          <button
            type="button"
            className="travel-button travel-button-secondary"
            onClick={
              onCancel
            }
          >
            Cancelar
          </button>

          {destination &&
            options.length >
              0 && (
            <button
              type="button"
              className="travel-button travel-button-primary"
              onClick={
                handleTravel
              }
              disabled={
                !selectedTransport
              }
            >
              Viajar
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}

/*
  ========================================
  RESUMO DA VIAGEM
  ========================================
*/

function TravelSummary({
  game,
  options,
  selectedTransport,
}) {
  const option =
    options.find(
      (item) =>
        item.transport ===
        selectedTransport
    )

  if (!option) {
    return null
  }

  const risk =
    getTravelRisk(
      option,
      game
    )

  return (
    <div className="travel-summary">
      <div>
        <span>
          TEMPO
        </span>

        <strong>
          {option.minutes}
          {' '}
          min
        </strong>
      </div>

      <div>
        <span>
          CUSTO
        </span>

        <strong>
          {formatCost(
            option.cost
          )}
        </strong>
      </div>

      <div>
        <span>
          RISCO
        </span>

        <strong
          className={
            `travel-risk travel-risk-${risk}`
          }
        >
          {getRiskLabel(
            risk
          )}
        </strong>
      </div>
    </div>
  )
}

/*
  ========================================
  ÍCONES
  ========================================
*/

function getTransportIcon(
  transport
) {
  const icons = {
    walking:
      '🚶',

    bus:
      '🚌',

    subway:
      '🚇',

    car:
      '🚗',
  }

  return (
    icons[
      transport
    ] ??
    '•'
  )
}

/*
  ========================================
  PREÇO
  ========================================
*/

function formatCost(
  cost
) {
  const value =
    Number(
      cost ??
      0
    )

  if (
    value <= 0
  ) {
    return 'Grátis'
  }

  return (
    `R$ ${value
      .toFixed(2)
      .replace(
        '.',
        ','
      )}`
  )
}