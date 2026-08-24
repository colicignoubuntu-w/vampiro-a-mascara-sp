const TRAVEL_EVENTS = [
  {
    id: 'quiet_trip',
    type: 'none',
    weight: 55,

    conditions: {
      minRisk: 'low',
    },

    title: 'Uma viagem tranquila',

    narration: [
      'A cidade continua seu movimento indiferente.',
      'Por alguns minutos, nada parece fora do lugar.',
      'Você chega ao destino sem chamar atenção.',
    ],
  },

  {
    id: 'police_patrol',
    type: 'police',
    weight: 15,

    conditions: {
      minRisk: 'medium',
      afterHour: 22,
    },

    title: 'Viatura',

    narration: [
      'Uma viatura passa lentamente pela rua.',
      'Os policiais observam o movimento ao redor.',
      'Por alguns segundos, você tem a sensação de que está sendo observado.',
    ],

    test: {
      attribute: 'Manipulação',
      ability: 'Subterfúgio',
      difficulty: 6,

      label:
        'Evitar chamar a atenção da polícia',
    },
  },

  {
    id: 'blood_smell',
    type: 'hunger',
    weight: 12,

    conditions: {
      minHunger: 2,
      afterHour: 20,
    },

    title: 'O cheiro',

    narration: [
      'Você sente algo no ar.',
      'É sutil no começo.',
      'Então o cheiro de sangue humano chega até você.',
      'Seu corpo reage antes mesmo que sua mente consiga racionalizar.',
    ],

    effects: {
      hunger: 1,
    },
  },

  {
    id: 'suspicious_person',
    type: 'encounter',
    weight: 8,

    conditions: {
      minRisk: 'medium',
      afterHour: 21,
    },

    title: 'Alguém observa',

    narration: [
      'Uma pessoa parada na calçada acompanha seus movimentos.',
      'Quando você olha diretamente para ela, ela desvia o olhar.',
      'Talvez seja apenas paranoia.',
      'Talvez não.',
    ],
  },

  {
    id: 'dangerous_alley',
    type: 'danger',
    weight: 6,

    conditions: {
      minRisk: 'high',
      afterHour: 23,
    },

    title: 'A rua escura',

    narration: [
      'O caminho escolhido parece mais vazio do que deveria.',
      'As luzes de alguns postes estão apagadas.',
      'Você percebe passos atrás de você.',
    ],

    test: {
      attribute: 'Percepção',
      ability: 'Prontidão',
      difficulty: 7,

      label:
        'Perceber o perigo antes que seja tarde',
    },
  },

  {
    id: 'supernatural_presence',
    type: 'supernatural',
    weight: 3,

    conditions: {
      afterHour: 23,
    },

    title: 'Algo não humano',

    narration: [
      'O ambiente muda.',
      'Não há uma explicação racional para a sensação.',
      'Por um instante, todos os sons da rua parecem desaparecer.',
      'Você sente que alguma coisa está perto.',
    ],
  },
]

const RISK_ORDER = {
  low: 0,
  medium: 1,
  high: 2,
}

function meetsConditions(
  event,
  context
) {
  const conditions =
    event.conditions ??
    {}

  const risk =
    context.risk ??
    'low'

  const hunger =
    Number(
      context.hunger ??
      0
    )

  const hour =
    Number(
      context.hour ??
      0
    )

  if (
    conditions.minRisk &&
    RISK_ORDER[risk] <
      RISK_ORDER[
        conditions.minRisk
      ]
  ) {
    return false
  }

  if (
    conditions.minHunger &&
    hunger <
      conditions.minHunger
  ) {
    return false
  }

  if (
    conditions.afterHour !==
      undefined &&
    hour <
      conditions.afterHour
  ) {
    return false
  }

  if (
    conditions.beforeHour !==
      undefined &&
    hour >
      conditions.beforeHour
  ) {
    return false
  }

  return true
}

function weightedRandom(
  events
) {
  const totalWeight =
    events.reduce(
      (
        total,
        event
      ) =>
        total +
        Number(
          event.weight ??
          1
        ),
      0
    )

  if (
    totalWeight <=
    0
  ) {
    return null
  }

  let random =
    Math.random() *
    totalWeight

  for (
    const event of events
  ) {
    random -=
      Number(
        event.weight ??
        1
      )

    if (
      random <=
      0
    ) {
      return event
    }
  }

  return events[
    events.length - 1
  ]
}

export function rollTravelEvent(
  context = {}
) {
  const available =
    TRAVEL_EVENTS.filter(
      (event) =>
        meetsConditions(
          event,
          context
        )
    )

  if (
    available.length ===
    0
  ) {
    return null
  }

  return weightedRandom(
    available
  )
}

export function getTravelEvents() {
  return [
    ...TRAVEL_EVENTS,
  ]
}

export default {
  rollTravelEvent,
  getTravelEvents,
}