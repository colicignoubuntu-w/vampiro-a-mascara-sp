import {
  useMemo,
  useState,
} from 'react'

import {
  getAllLocations,
} from '../../data/world/locations'

import transports from '../../data/world/transports'

import {
  calculateTravel,
} from '../../engine/travel/travelEngine'

import './CityMap.css'

function formatLevel(value) {
  const numericValue = Number(value ?? 0)

  return Math.round(
    (numericValue <= 1
      ? numericValue * 10
      : numericValue)
  )
}

export default function CityMap({
  game,
  onClose,
  onTravel,
}) {
  const [
    selectedLocationId,
    setSelectedLocationId,
  ] = useState(null)

  const [
    selectedTransport,
    setSelectedTransport,
  ] = useState(
    'walking'
  )

 const locations =
  getAllLocations(
    game
  ).filter(
    (location) =>
      location.showOnMap !==
      false
  )

  const currentLocationId =
    game.world
      ?.location
      ?.id

  const selectedLocation =
    locations.find(
      (location) =>
        location.id ===
        selectedLocationId
    )

  const travel =
    useMemo(() => {
      if (
        !selectedLocationId
      ) {
        return null
      }

      return calculateTravel(
        game,
        selectedLocationId,
        selectedTransport
      )
    }, [
      game,
      selectedLocationId,
      selectedTransport,
    ])

  return (
    <div className="city-map-overlay">
      <section className="city-map-modal">
        <header className="city-map-header">
          <div>
            <span>
              SÃO PAULO
            </span>

            <h2>
              Mapa da Cidade
            </h2>

            <p>
              Selecione um destino para planejar a viagem
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            Fechar
          </button>
        </header>

        <div className="city-map-layout">
          <div className="city-map-board">
            {locations.map(
              (location) => {
                const current =
                  location.id ===
                  currentLocationId

                const selected =
                  location.id ===
                  selectedLocationId

                return (
                  <button
                    key={
                      location.id
                    }
                    type="button"
                    className={[
                      'city-map-marker',

                      current
                        ? 'current'
                        : '',

                      selected
                        ? 'selected'
                        : '',
                    ]
                      .filter(
                        Boolean
                      )
                      .join(' ')}
                    style={{
                      left:
                        `${location.coordinates.x}%`,

                      top:
                        `${location.coordinates.y}%`,
                    }}
                    onClick={() =>
                      setSelectedLocationId(
                        location.id
                      )
                    }
                  >
                    <span />

                    <strong>
                      {
                        location.name
                      }
                    </strong>
                  </button>
                )
              }
            )}
          </div>

          <aside className="city-map-sidebar">
            {!selectedLocation && (
              <div className="city-map-empty">
                <p>
                  Selecione um local no mapa.
                </p>
              </div>
            )}

            {selectedLocation && (
              <>
                <div className="city-map-location-info">
                  <span>
                    {
                      selectedLocation
                        .district
                    }
                  </span>

                  <h3>
                    {
                      selectedLocation
                        .name
                    }
                  </h3>

                  <p>
                    {
                      selectedLocation
                        .description
                    }
                  </p>

                  <div className="city-map-tags">
                    <span>
                      Perigo:{' '}
                      {
                        formatLevel(
                          selectedLocation
                            .danger
                        )
                      }
                      /10
                    </span>

                    <span>
                      Polícia:{' '}
                      {
                        formatLevel(
                          selectedLocation
                            .policePresence
                        )
                      }
                      /10
                    </span>
                  </div>
                </div>

                {selectedLocation.id !==
                  currentLocationId && (
                  <>
                    <div className="city-map-transports">
                      <h4>
                        Transporte
                      </h4>

                      {Object.values(
                        transports
                      ).map(
                        (
                          transport
                        ) => (
                          <button
                            key={
                              transport.id
                            }
                            type="button"
                            className={
                              selectedTransport ===
                              transport.id
                                ? 'selected'
                                : ''
                            }
                            onClick={() =>
                              setSelectedTransport(
                                transport.id
                              )
                            }
                          >
                            <strong>
                              {
                                transport.name
                              }
                            </strong>

                            <span>
                              R${' '}
                              {
                                transport.moneyCost
                                  .toFixed(
                                    2
                                  )
                                  .replace(
                                    '.',
                                    ','
                                  )
                              }
                            </span>
                          </button>
                        )
                      )}
                    </div>

                    {travel && (
                      <div className="city-map-trip">
                        {travel.allowed ? (
                          <>
                            <div>
                              <span>
                                Tempo
                              </span>

                              <strong>
                                {
                                  travel.minutes
                                }{' '}
                                min
                              </strong>
                            </div>

                            <div>
                              <span>
                                Distância
                              </span>

                              <strong>
                                {
                                  travel.distance.toFixed(
                                    1
                                  )
                                }{' '}
                                km
                              </strong>
                            </div>

                            <div>
                              <span>
                                Custo
                              </span>

                              <strong>
                                R${' '}
                                {
                                  travel.moneyCost
                                    .toFixed(
                                      2
                                    )
                                    .replace(
                                      '.',
                                      ','
                                    )
                                }
                              </strong>
                            </div>

                            <button
                              type="button"
                              className="primary-button"
                              onClick={() =>
                                onTravel(
                                  travel
                                )
                              }
                            >
                              Viajar
                            </button>
                          </>
                        ) : (
                          <p className="city-map-error">
                            {
                              travel.reason
                            }
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}
