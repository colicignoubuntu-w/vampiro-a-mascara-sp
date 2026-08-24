const transports = {
  walking: {
    id: 'walking',

    name: 'A pé',

    speed: 4.5,

    moneyCost: 0,

    streetExposure: 1.4,

    policeExposure: 0.8,

    requiresVehicle: false,
  },

  bus: {
    id: 'bus',

    name: 'Ônibus',

    speed: 18,

    /*
      Valor do nosso jogo.
      Podemos alterar facilmente depois.
    */

    moneyCost: 4.5,

    streetExposure: 0.8,

    policeExposure: 0.5,

    requiresVehicle: false,
  },

  metro: {
    id: 'metro',

    name: 'Metrô',

    speed: 28,

    moneyCost: 4.5,

    streetExposure: 0.35,

    policeExposure: 0.5,

    requiresVehicle: false,
  },

  car: {
    id: 'car',

    name: 'Carro',

    speed: 30,

    moneyCost: 0,

    streetExposure: 0.25,

    policeExposure: 1,

    requiresVehicle: true,
  },
}

export function getTransport(
  id
) {
  return (
    transports[id] ??
    null
  )
}

export default transports