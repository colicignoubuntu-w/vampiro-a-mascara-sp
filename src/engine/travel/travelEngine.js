import {
  getLocation,
} from '../../data/world/locations'

import {
  getTransport,
} from '../../data/world/transports'

function distanceBetween(
  a,
  b
) {
  const dx =
    b.coordinates.x -
    a.coordinates.x

  const dy =
    b.coordinates.y -
    a.coordinates.y

  return Math.sqrt(
    dx * dx +
    dy * dy
  ) * 0.45
}

export function calculateTravel(
  game,
  destinationId,
  transportId
) {
  const currentId =
    game.world
      ?.location
      ?.id

  const origin =
    getLocation(
      currentId
    )

  const destination =
    getLocation(
      destinationId
    )

  const transport =
    getTransport(
      transportId
    )

  if (!origin) {
    return {
      allowed: false,

      reason:
        'Local atual não existe no mapa.',
    }
  }

  if (!destination) {
    return {
      allowed: false,

      reason:
        'Destino inválido.',
    }
  }

  if (!transport) {
    return {
      allowed: false,

      reason:
        'Transporte inválido.',
    }
  }

  if (
    destination.id ===
    origin.id
  ) {
    return {
      allowed: false,

      reason:
        'Você já está nesse local.',
    }
  }

  if (
    transport.requiresVehicle &&
    !game.inventory?.some(
      (item) =>
        item.type ===
        'vehicle'
    )
  ) {
    return {
      allowed: false,

      reason:
        'Você não possui um veículo.',
    }
  }

  const money =
    Number(
      game.money ?? 0
    )

  if (
    money <
    transport.moneyCost
  ) {
    return {
      allowed: false,

      reason:
        'Dinheiro insuficiente.',
    }
  }

  const distance =
    distanceBetween(
      origin,
      destination
    )

  const hours =
    distance /
    transport.speed

  const minutes =
    Math.max(
      5,
      Math.ceil(
        hours * 60
      )
    )

  return {
    allowed: true,

    origin,

    destination,

    transport,

    distance,

    minutes,

    moneyCost:
      transport.moneyCost,

    risk:
      calculateTravelRisk(
        destination,
        transport
      ),
  }
}

function calculateTravelRisk(
  destination,
  transport
) {
  return {
    street:
      destination.danger *
      transport.streetExposure,

    police:
      destination
        .policePresence *
      transport.policeExposure,
  }
}