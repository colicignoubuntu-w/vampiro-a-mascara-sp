import {
  getLocation,
} from '../../data/world/locations'

import {
  getTransport,
} from '../../data/world/transports'

/*
  ========================================
  DISTÂNCIA
  ========================================

  As coordenadas do mapa são abstratas.

  O multiplicador converte a distância
  visual em uma aproximação em km.
*/

function distanceBetween(
  a,
  b
) {
  if (
    !a?.coordinates ||
    !b?.coordinates
  ) {
    return null
  }

  const dx =
    b.coordinates.x -
    a.coordinates.x

  const dy =
    b.coordinates.y -
    a.coordinates.y

  const mapDistance =
    Math.sqrt(
      dx * dx +
      dy * dy
    )

  return Math.max(
    0.8,
    mapDistance * 0.65
  )
}

/*
  ========================================
  CUSTO
  ========================================
*/

function calculateMoneyCost(
  transport,
  distance
) {
  if (!transport) {
    return 0
  }

  if (
    transport.id ===
    'walking'
  ) {
    return 0
  }

  /*
    Ônibus e metrô:
    tarifa fixa.
  */

  if (
    transport.id === 'bus' ||
    transport.id === 'metro'
  ) {
    return Number(
      transport.moneyCost ??
      0
    )
  }

  /*
    Carro próprio:
    custo aproximado de combustível.

    O valor aumenta conforme
    a distância percorrida.
  */

  if (
    transport.id ===
    'car'
  ) {
    return Math.max(
      2,
      Math.round(
        distance *
        0.7 *
        100
      ) / 100
    )
  }

  return Number(
    transport.moneyCost ??
    0
  )
}

/*
  ========================================
  RISCO NUMÉRICO
  ========================================
*/

function calculateRiskDetails(
  origin,
  destination,
  transport
) {
  const originDanger =
    Number(
      origin?.danger ??
      0.3
    )

  const destinationDanger =
    Number(
      destination?.danger ??
      0.3
    )

  const destinationPolice =
    Number(
      destination
        ?.policePresence ??
      0.3
    )

  const averageDanger =
    (
      originDanger +
      destinationDanger
    ) / 2

  return {
    street:
      averageDanger *
      Number(
        transport
          ?.streetExposure ??
        1
      ),

    police:
      destinationPolice *
      Number(
        transport
          ?.policeExposure ??
        1
      ),
  }
}

/*
  ========================================
  RISCO PARA O MOTOR PRINCIPAL
  ========================================

  O world/travelEngine trabalha com:

  low
  medium
  high
*/

function getRiskLevel(
  riskDetails
) {
  const street =
    Number(
      riskDetails
        ?.street ??
      0
    )

  const police =
    Number(
      riskDetails
        ?.police ??
      0
    )

  const highest =
    Math.max(
      street,
      police
    )

  if (
    highest >=
    0.75
  ) {
    return 'high'
  }

  if (
    highest >=
    0.4
  ) {
    return 'medium'
  }

  return 'low'
}

/*
  ========================================
  TEMPO
  ========================================
*/

function calculateMinutes(
  distance,
  transport
) {
  const speed =
    Math.max(
      1,
      Number(
        transport?.speed ??
        4.5
      )
    )

  /*
    Tempo básico pela velocidade.
  */

  let minutes =
    distance /
    speed *
    60

  /*
    Transporte público possui
    espera, acesso e pequenas
    caminhadas adicionais.
  */

  if (
    transport.id ===
    'bus'
  ) {
    minutes += 8
  }

  if (
    transport.id ===
    'metro'
  ) {
    minutes += 10
  }

  /*
    Carro sofre uma pequena
    penalidade urbana.
  */

  if (
    transport.id ===
    'car'
  ) {
    minutes += 4
  }

  return Math.max(
    5,
    Math.ceil(
      minutes
    )
  )
}

/*
  ========================================
  CALCULAR VIAGEM
  ========================================
*/

export function calculateTravel(
  game,
  destinationId,
  transportId
) {
  const currentId =
    game?.world
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

  /*
    ========================================
    VALIDAÇÕES
    ========================================
  */

  if (!origin) {
    return {
      allowed:
        false,

      reason:
        'Local atual não existe no mapa.',
    }
  }

  if (!destination) {
    return {
      allowed:
        false,

      reason:
        'Destino inválido.',
    }
  }

  if (!transport) {
    return {
      allowed:
        false,

      reason:
        'Transporte inválido.',
    }
  }

  if (
    destination.id ===
    origin.id
  ) {
    return {
      allowed:
        false,

      reason:
        'Você já está nesse local.',
    }
  }

  /*
    Carro exige um veículo.
  */

  if (
    transport.requiresVehicle &&
    !game.inventory?.some(
      (item) =>
        item.type ===
        'vehicle'
    )
  ) {
    return {
      allowed:
        false,

      reason:
        'Você não possui um veículo.',
    }
  }

  /*
    ========================================
    DISTÂNCIA
    ========================================
  */

  const distance =
    distanceBetween(
      origin,
      destination
    )

  if (
    distance === null
  ) {
    return {
      allowed:
        false,

      reason:
        'Não foi possível calcular a distância.',
    }
  }

  /*
    ========================================
    TEMPO
    ========================================
  */

  const minutes =
    calculateMinutes(
      distance,
      transport
    )

  /*
    ========================================
    CUSTO
    ========================================
  */

  const moneyCost =
    calculateMoneyCost(
      transport,
      distance
    )

  /*
    ========================================
    RISCO
    ========================================
  */

  const riskDetails =
    calculateRiskDetails(
      origin,
      destination,
      transport
    )

  const risk =
    getRiskLevel(
      riskDetails
    )

  /*
    ========================================
    OBJETO PADRONIZADO
    ========================================

    Este formato pode ser enviado
    diretamente para handleTravel()
    e depois para performTravel().
  */

  return {
    allowed:
      true,

    originId:
      origin.id,

    destinationId:
      destination.id,

    /*
      IMPORTANTE:

      O motor principal trabalha
      melhor com o ID do transporte,
      e não com o objeto inteiro.
    */

    transport:
      transport.id,

    transportId:
      transport.id,

    /*
      Objetos completos ainda ficam
      disponíveis para interfaces.
    */

    origin,

    destination,

    transportData:
      transport,

    distance,

    distanceKm:
      distance,

    minutes,

    timeMinutes:
      minutes,

    /*
      Mantemos os dois nomes.

      moneyCost é usado pela interface.

      cost é usado pelo motor principal.
    */

    moneyCost,

    cost:
      moneyCost,

    /*
      risk é usado pelo sistema oficial
      de eventos.

      riskDetails pode ser usado depois
      para distinguir polícia de assalto.
    */

    risk,

    riskDetails,
  }
}

export default {
  calculateTravel,
}