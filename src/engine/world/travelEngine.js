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
  const locations = {
    prologue: {
      id: 'prologue',
      name: 'Prólogo',
      district: 'São Paulo',
    },

    centro: {
      id: 'centro',
      name: 'Centro de São Paulo',
      district: 'Centro',
    },

    paulista: {
      id: 'paulista',
      name: 'Avenida Paulista',
      district: 'Bela Vista',
    },

    liberdade: {
      id: 'liberdade',
      name: 'Liberdade',
      district: 'Liberdade',
    },

    santaCecilia: {
      id: 'santaCecilia',
      name: 'Santa Cecília',
      district: 'Santa Cecília',
    },

    pinheiros: {
      id: 'pinheiros',
      name: 'Pinheiros',
      district: 'Pinheiros',
    },

    vilaMadAlena: {
      id: 'vilaMadAlena',
      name: 'Vila Madalena',
      district: 'Vila Madalena',
    },

    tatuape: {
      id: 'tatuape',
      name: 'Tatuapé',
      district: 'Zona Leste',
    },

    santana: {
      id: 'santana',
      name: 'Santana',
      district: 'Zona Norte',
    },
  }

  return (
    locations[
      locationId
    ] ??
    null
  )
}

export function getAllLocations() {
  const ids = [
    'prologue',
    'centro',
    'paulista',
    'liberdade',
    'santaCecilia',
    'pinheiros',
    'vilaMadAlena',
    'tatuape',
    'santana',
  ]

  return ids
    .map(
      getLocation
    )
    .filter(
      Boolean
    )
}

const TRAVEL_ROUTES = {
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

export function getTravelOptions(
  currentLocationId,
  destinationId
) {
  if (
    !currentLocationId ||
    !destinationId
  ) {
    return []
  }

  const directKey =
    `${currentLocationId}:${destinationId}`

  const reverseKey =
    `${destinationId}:${currentLocationId}`

  return (
    TRAVEL_ROUTES[
      directKey
    ] ??
    TRAVEL_ROUTES[
      reverseKey
    ] ??
    []
  )
}

export function getAvailableDestinations(
  currentLocationId
) {
  return getAllLocations().filter(
    (location) =>
      location.id !==
      currentLocationId
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

  if (
    travel.destination
  ) {
    updatedGame.world = {
      ...updatedGame.world,

      location: {
        ...travel.destination,
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