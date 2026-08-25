import {
  getLocation as getWorldLocation,
  getAllLocations as getWorldLocations,
} from '../../data/world/locations'
import {
  addMinutes,
  saveGame,
} from '../../utils/gameState'

import {
  rollTravelEvent,
} from './events/travelEvents'

const RISK_ORDER = {
  low: 0,
  medium: 1,
  high: 2,
}

const TRANSPORT_LABELS = {
  walking: 'A pé',
  bus: 'Ônibus',

  /*
    metro é o ID atual.

    subway fica por compatibilidade
    com saves/rotas antigas.
  */

  metro: 'Metrô',
  subway: 'Metrô',

  car: 'Carro',
}

const RISK_LABELS = {
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
}

function clamp(
  value,
  min,
  max
) {
  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  )
}

function normalizeRisk(
  value
) {
  if (
    value === 'high' ||
    value === 'medium' ||
    value === 'low'
  ) {
    return value
  }

  return 'low'
}

export function getTransportLabel(
  transport
) {
  return (
    TRANSPORT_LABELS[
      transport
    ] ??
    transport ??
    'Desconhecido'
  )
}

export function getRiskLabel(
  risk
) {
  return (
    RISK_LABELS[
      normalizeRisk(
        risk
      )
    ] ??
    'Desconhecido'
  )
}

export function getLocation(
  locationId
) {
  return getWorldLocation(
    locationId
  )
}

export function getAllLocations(
  game = null
) {
  return getWorldLocations(
    game
  )
}

const TRAVEL_ROUTES = {
  /*
    REFÚGIO DO JOGADOR

    A rota inversa também funciona porque
    getTravelOptions procura directKey e reverseKey.
  */

  'centro:livia_apartment': [
    {
      transport: 'walking',
      minutes: 15,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 10,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 8,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 6,
      cost: 14,
      risk: 'low',
    },
  ],

  'prologue:centro': [
    {
      transport: 'walking',
      minutes: 25,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 12,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 10,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 8,
      cost: 18,
      risk: 'low',
    },
  ],

  'centro:paulista': [
    {
      transport: 'walking',
      minutes: 35,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 20,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 12,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 15,
      cost: 22,
      risk: 'low',
    },
  ],

  'centro:liberdade': [
    {
      transport: 'walking',
      minutes: 20,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 12,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 8,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 10,
      cost: 16,
      risk: 'low',
    },
  ],

  'centro:santaCecilia': [
    {
      transport: 'walking',
      minutes: 25,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 15,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 10,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 12,
      cost: 18,
      risk: 'low',
    },
  ],

  'centro:pinheiros': [
    {
      transport: 'walking',
      minutes: 75,
      cost: 0,
      risk: 'high',
    },

    {
      transport: 'bus',
      minutes: 35,
      cost: 4.5,
      risk: 'medium',
    },

    {
      transport: 'subway',
      minutes: 25,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 25,
      cost: 30,
      risk: 'low',
    },
  ],

  'centro:vilaMadAlena': [
    {
      transport: 'walking',
      minutes: 90,
      cost: 0,
      risk: 'high',
    },

    {
      transport: 'bus',
      minutes: 45,
      cost: 4.5,
      risk: 'medium',
    },

    {
      transport: 'subway',
      minutes: 30,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 30,
      cost: 35,
      risk: 'low',
    },
  ],

  'centro:tatuape': [
    {
      transport: 'walking',
      minutes: 90,
      cost: 0,
      risk: 'high',
    },

    {
      transport: 'bus',
      minutes: 45,
      cost: 4.5,
      risk: 'medium',
    },

    {
      transport: 'subway',
      minutes: 30,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 30,
      cost: 30,
      risk: 'low',
    },
  ],

  'centro:santana': [
    {
      transport: 'walking',
      minutes: 75,
      cost: 0,
      risk: 'high',
    },

    {
      transport: 'bus',
      minutes: 40,
      cost: 4.5,
      risk: 'medium',
    },

    {
      transport: 'subway',
      minutes: 25,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 25,
      cost: 28,
      risk: 'low',
    },
  ],

  'paulista:centro': [
    {
      transport: 'walking',
      minutes: 35,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 20,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 12,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 15,
      cost: 22,
      risk: 'low',
    },
  ],

  'paulista:liberdade': [
    {
      transport: 'walking',
      minutes: 30,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 18,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 12,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 15,
      cost: 18,
      risk: 'low',
    },
  ],

  'paulista:pinheiros': [
    {
      transport: 'walking',
      minutes: 50,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 30,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 20,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 20,
      cost: 25,
      risk: 'low',
    },
  ],

  'paulista:vilaMadAlena': [
    {
      transport: 'walking',
      minutes: 65,
      cost: 0,
      risk: 'high',
    },

    {
      transport: 'bus',
      minutes: 35,
      cost: 4.5,
      risk: 'medium',
    },

    {
      transport: 'subway',
      minutes: 25,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 25,
      cost: 30,
      risk: 'low',
    },
  ],

  'liberdade:centro': [
    {
      transport: 'walking',
      minutes: 20,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 12,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 8,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 10,
      cost: 16,
      risk: 'low',
    },
  ],

  'liberdade:paulista': [
    {
      transport: 'walking',
      minutes: 30,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 18,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 12,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 15,
      cost: 18,
      risk: 'low',
    },
  ],

  'santaCecilia:centro': [
    {
      transport: 'walking',
      minutes: 25,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 15,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 10,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 12,
      cost: 18,
      risk: 'low',
    },
  ],

  'pinheiros:centro': [
    {
      transport: 'walking',
      minutes: 75,
      cost: 0,
      risk: 'high',
    },

    {
      transport: 'bus',
      minutes: 35,
      cost: 4.5,
      risk: 'medium',
    },

    {
      transport: 'subway',
      minutes: 25,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 25,
      cost: 30,
      risk: 'low',
    },
  ],

  'pinheiros:paulista': [
    {
      transport: 'walking',
      minutes: 50,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 30,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 20,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 20,
      cost: 25,
      risk: 'low',
    },
  ],

  'vilaMadAlena:pinheiros': [
    {
      transport: 'walking',
      minutes: 20,
      cost: 0,
      risk: 'medium',
    },

    {
      transport: 'bus',
      minutes: 15,
      cost: 4.5,
      risk: 'low',
    },

    {
      transport: 'subway',
      minutes: 10,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 10,
      cost: 15,
      risk: 'low',
    },
  ],

  'tatuape:centro': [
    {
      transport: 'walking',
      minutes: 90,
      cost: 0,
      risk: 'high',
    },

    {
      transport: 'bus',
      minutes: 45,
      cost: 4.5,
      risk: 'medium',
    },

    {
      transport: 'subway',
      minutes: 30,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 30,
      cost: 30,
      risk: 'low',
    },
  ],

  'santana:centro': [
    {
      transport: 'walking',
      minutes: 75,
      cost: 0,
      risk: 'high',
    },

    {
      transport: 'bus',
      minutes: 40,
      cost: 4.5,
      risk: 'medium',
    },

    {
      transport: 'subway',
      minutes: 25,
      cost: 5.2,
      risk: 'low',
    },

    {
      transport: 'car',
      minutes: 25,
      cost: 28,
      risk: 'low',
    },
  ],
}
function calculateMapDistance(
  origin,
  destination
) {
  if (
    !origin?.coordinates ||
    !destination?.coordinates
  ) {
    return null
  }

  const dx =
    destination.coordinates.x -
    origin.coordinates.x

  const dy =
    destination.coordinates.y -
    origin.coordinates.y

  const mapDistance =
    Math.sqrt(
      dx * dx +
      dy * dy
    )

  /*
    Aproximação usada pelo mapa.

    Cada unidade visual corresponde
    aproximadamente a 0,65 km.
  */

  const distanceKm =
    mapDistance * 0.65

  return Math.max(
    0.8,
    distanceKm
  )
}

function calculateAutomaticRisk(
  origin,
  destination,
  transport
) {
  const averageDanger =
    (
      Number(
        origin?.danger ?? 0.3
      ) +
      Number(
        destination?.danger ?? 0.3
      )
    ) / 2

  if (
    transport === 'walking'
  ) {
    if (
      averageDanger >= 0.6
    ) {
      return 'high'
    }

    if (
      averageDanger >= 0.35
    ) {
      return 'medium'
    }

    return 'low'
  }

  if (
    transport === 'bus'
  ) {
    return averageDanger >= 0.6
      ? 'medium'
      : 'low'
  }

  return 'low'
}

function createAutomaticTravelOptions(
  origin,
  destination
) {
  const distance =
    calculateMapDistance(
      origin,
      destination
    )

  if (distance === null) {
    return []
  }

  /*
    ========================================
    A PÉ
    ========================================
  */

  const walkingMinutes =
    Math.max(
      5,
      Math.ceil(
        distance /
          4.5 *
          60
      )
    )

  /*
    ========================================
    ÔNIBUS
    ========================================

    Velocidade média menor por causa
    das paradas e espera.
  */

  const busMinutes =
    Math.max(
      10,
      Math.ceil(
        distance /
          18 *
          60 +
        8
      )
    )

  /*
    ========================================
    METRÔ
    ========================================

    Incluímos alguns minutos para
    acesso, espera e caminhada.
  */

  const subwayMinutes =
    Math.max(
      10,
      Math.ceil(
        distance /
          28 *
          60 +
        10
      )
    )

  /*
    ========================================
    CARRO
    ========================================

    Tempo urbano aproximado.
    O valor aumenta conforme a distância.
  */

  const carMinutes =
    Math.max(
      5,
      Math.ceil(
        distance /
          24 *
          60 +
        4
      )
    )

  const carCost =
    Math.max(
      8,
      Math.round(
        (
          6 +
          distance * 2.2
        ) *
        100
      ) / 100
    )

  return [
    {
      transport:
        'walking',

      minutes:
        walkingMinutes,

      cost:
        0,

      risk:
        calculateAutomaticRisk(
          origin,
          destination,
          'walking'
        ),

      distanceKm:
        distance,
    },

    {
      transport:
        'bus',

      minutes:
        busMinutes,

      cost:
        4.5,

      risk:
        calculateAutomaticRisk(
          origin,
          destination,
          'bus'
        ),

      distanceKm:
        distance,
    },

    {
      transport:
        'subway',

      minutes:
        subwayMinutes,

      cost:
        5.2,

      risk:
        calculateAutomaticRisk(
          origin,
          destination,
          'subway'
        ),

      distanceKm:
        distance,
    },

    {
      transport:
        'car',

      minutes:
        carMinutes,

      cost:
        carCost,

      risk:
        calculateAutomaticRisk(
          origin,
          destination,
          'car'
        ),

      distanceKm:
        distance,
    },
  ]
}
export function getTravelOptions(
  currentLocationId,
  destinationId
) {
  if (
    !currentLocationId ||
    !destinationId ||
    currentLocationId ===
      destinationId
  ) {
    return []
  }

  const origin =
    getLocation(
      currentLocationId
    )

  const destination =
    getLocation(
      destinationId
    )

  if (
    !origin ||
    !destination
  ) {
    return []
  }

  /*
    Primeiro procuramos uma rota
    especial cadastrada manualmente.

    Isso continua útil futuramente
    para túneis, atalhos, bloqueios,
    viagens especiais etc.
  */

  const directKey =
    `${currentLocationId}:${destinationId}`

  const reverseKey =
    `${destinationId}:${currentLocationId}`

  const specialRoute =
    TRAVEL_ROUTES[
      directKey
    ] ??
    TRAVEL_ROUTES[
      reverseKey
    ]

  if (
    specialRoute &&
    specialRoute.length > 0
  ) {
    return specialRoute
  }

  /*
    Caso não exista uma rota especial,
    calculamos automaticamente.
  */

  return createAutomaticTravelOptions(
    origin,
    destination
  )
}

export function getAvailableDestinations(
  currentLocationId,
  game = null
) {
  const havenUnlocked =
    Boolean(
      game?.flags
        ?.liviaApartmentUnlocked ||
      game?.flags
        ?.inheritedLiviaApartment ||
      game?.flags
        ?.hasHaven
    )

  return getAllLocations().filter(
    (location) => {
      /*
        Não mostra o local atual.
      */

      if (
        location.id ===
        currentLocationId
      ) {
        return false
      }

      /*
        O apartamento só aparece
        depois de ser herdado.
      */

      if (
        location.id ===
          'livia_apartment' &&
        !havenUnlocked
      ) {
        return false
      }

      /*
        Só mostramos destinos para
        os quais realmente existe
        uma rota cadastrada.
      */

      const options =
        getTravelOptions(
          currentLocationId,
          location.id
        )

      return (
        options.length >
        0
      )
    }
  )
}

export function getTravelRisk(
  option,
  game
) {
  if (!option) {
    return 'low'
  }

  let risk =
    normalizeRisk(
      option.risk
    )

  const hunger =
    Number(
      game?.hunger
        ?.current ??
      game?.blood
        ?.hunger ??
      0
    )

  const humanity =
    Number(
      game?.humanity
        ?.current ??
      7
    )

  if (
    hunger >= 4 &&
    risk === 'low'
  ) {
    risk = 'medium'
  }

  if (
    hunger >= 6 &&
    risk === 'medium'
  ) {
    risk = 'high'
  }

  if (
    humanity <= 3 &&
    risk === 'low'
  ) {
    risk = 'medium'
  }

  return risk
}

export function calculateTravelRisk(
  game,
  travel = {}
) {
  let score = 0

  const hour =
    Number(
      game?.world?.hour ??
      23
    )

  const hunger =
    Number(
      game?.hunger
        ?.current ??
      game?.blood
        ?.hunger ??
      0
    )

  const baseRisk =
    travel.risk

  if (
    baseRisk ===
    'high'
  ) {
    score += 3
  } else if (
    baseRisk ===
    'medium'
  ) {
    score += 2
  }

  if (
    hour >= 0 &&
    hour < 5
  ) {
    score += 2
  } else if (
    hour >= 22
  ) {
    score += 1
  }

  if (
    hunger >= 4
  ) {
    score += 2
  } else if (
    hunger >= 2
  ) {
    score += 1
  }

  if (
    score >= 5
  ) {
    return 'high'
  }

  if (
    score >= 3
  ) {
    return 'medium'
  }

  return 'low'
}

export function calculateTravelTime(
  travel = {}
) {
  const baseTime =
    Number(
      travel.timeMinutes ??
      travel.minutes ??
      10
    )

  return Math.max(
    1,
    baseTime
  )
}

export function calculateTravelCost(
  game,
  travel = {}
) {
  const cost =
    Number(
      travel.cost ??
      0
    )

  const resources =
    Number(
      game?.backgrounds
        ?.resources ??
      0
    )

  if (
    cost <= 0
  ) {
    return {
      cost: 0,
      canPay: true,
    }
  }

  /*
   * Neste momento Resources
   * representa a capacidade
   * financeira do personagem.
   *
   * O sistema ainda não trata
   * dinheiro como valor monetário.
   */
  return {
    cost,
    canPay:
      resources >= 0,
  }
}

export function createTravelContext(
  game,
  travel = {}
) {
  const risk =
    calculateTravelRisk(
      game,
      travel
    )

  const timeMinutes =
    calculateTravelTime(
      travel
    )

  const hour =
    Number(
      game?.world?.hour ??
      23
    )

  const hunger =
    Number(
      game?.hunger
        ?.current ??
      game?.blood
        ?.hunger ??
      0
    )

  return {
    risk,
    timeMinutes,
    hour,
    hunger,

    locationId:
      game?.world
        ?.location
        ?.id ??
      null,

    locationName:
      game?.world
        ?.location
        ?.name ??
      'São Paulo',
  }
}

export function performTravel(
  game,
  travel = {}
) {
  if (!game) {
    return {
      game: null,
      event: null,
      error:
        'Nenhum jogo carregado.',
    }
  }

  const context =
    createTravelContext(
      game,
      travel
    )

  const cost =
    calculateTravelCost(
      game,
      travel
    )

  if (
    !cost.canPay
  ) {
    return {
      game,
      event: null,
      error:
        'Você não possui recursos suficientes para realizar esta viagem.',
    }
  }

  const updatedWorld =
    addMinutes(
      {
        ...(game.world ??
          {}),
      },
      context.timeMinutes
    )

  const event =
    rollTravelEvent(
      context
    )

  const travelHistory = {
    type:
      'travel',

    from:
      game.world
        ?.location
        ?.id ??
      null,

    to:
      travel.destinationId ??
      null,

    transport:
      travel.transport ??
      'unknown',

    minutes:
      context.timeMinutes,

    risk:
      context.risk,

    event:
      event?.id ??
      null,

    timestamp:
      new Date().toISOString(),
  }

  const updatedGame = {
    ...game,

    world:
      updatedWorld,

    history: [
      ...(game.history ??
        []),

      travelHistory,
    ],

    flags: {
      ...(game.flags ??
        {}),
    },
  }

  const resolvedDestination =
    travel.destination ??
    getLocation(
      travel.destinationId
    )

  if (
    resolvedDestination
  ) {
    updatedGame.world = {
      ...updatedGame.world,

      location: {
        ...resolvedDestination,
      },
    }
  }


  saveGame(
    updatedGame
  )

  return {
    game:
      updatedGame,

    event:
      event ??
      null,

    context,

    error:
      null,
  }
}

export function getTravelRiskLabel(
  risk
) {
  return (
    RISK_LABELS[
      normalizeRisk(
        risk
      )
    ] ??
    'Desconhecido'
  )
}

export function getTravelRiskDescription(
  risk
) {
  switch (
    normalizeRisk(
      risk
    )
  ) {
    case 'high':
      return 'O deslocamento apresenta riscos consideráveis.'

    case 'medium':
      return 'Há alguma possibilidade de acontecimentos inesperados.'

    default:
      return 'O deslocamento parece relativamente tranquilo.'
  }
}

export function getTravelSummary(
  game,
  travel = {}
) {
  const context =
    createTravelContext(
      game,
      travel
    )

  return {
    timeMinutes:
      context.timeMinutes,

    risk:
      context.risk,

    riskLabel:
      getTravelRiskLabel(
        context.risk
      ),

    description:
      getTravelRiskDescription(
        context.risk
      ),

    hour:
      context.hour,

    hunger:
      context.hunger,
  }
}

export function applyTravelHunger(
  game,
  amount = 0
) {
  if (!game) {
    return game
  }

  const current =
    Number(
      game?.hunger
        ?.current ??
      0
    )

  const maximum =
    Number(
      game?.hunger
        ?.maximum ??
      5
    )

  const next =
    clamp(
      current +
        Number(amount),
      0,
      maximum
    )

  return {
    ...game,

    hunger: {
      ...(game.hunger ??
        {}),

      current:
        next,

      maximum,
    },
  }
}

export default {
  getTransportLabel,
  getRiskLabel,
  getLocation,
  getAllLocations,
  getTravelOptions,
  getAvailableDestinations,
  getTravelRisk,
  calculateTravelRisk,
  calculateTravelTime,
  calculateTravelCost,
  createTravelContext,
  performTravel,
  getTravelRiskLabel,
  getTravelRiskDescription,
  getTravelSummary,
  applyTravelHunger,
}