function normalizeKey(
  value
) {
  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^a-z0-9]/g,
      ''
    )
}

const ATTRIBUTE_MAP = {
  forca: [
    'physical',
    'strength',
  ],

  destreza: [
    'physical',
    'dexterity',
  ],

  vigor: [
    'physical',
    'stamina',
  ],

  carisma: [
    'social',
    'charisma',
  ],

  manipulacao: [
    'social',
    'manipulation',
  ],

  aparencia: [
    'social',
    'appearance',
  ],

  percepcao: [
    'mental',
    'perception',
  ],

  inteligencia: [
    'mental',
    'intelligence',
  ],

  raciocinio: [
    'mental',
    'wits',
  ],
}

const ABILITY_MAP = {
  prontidao:
    'alertness',

  esportes:
    'athletics',

  briga:
    'brawl',

  esquiva:
    'dodge',

  empatia:
    'empathy',

  expressao:
    'expression',

  intimidacao:
    'intimidation',

  lideranca:
    'leadership',

  manha:
    'streetwise',

  labia:
    'subterfuge',

  subterfugio:
    'subterfuge',

  empanimal:
    'animalKen',

  oficios:
    'crafts',

  conducao:
    'drive',

  etiqueta:
    'etiquette',

  armfogo:
    'firearms',

  armabranca:
    'melee',

  performance:
    'performance',

  seguranca:
    'security',

  furtividade:
    'stealth',

  sobrevivencia:
    'survival',

  academicos:
    'academics',

  computador:
    'computer',

  financas:
    'finance',

  investigacao:
    'investigation',

  direito:
    'law',

  linguistica:
    'linguistics',

  medicina:
    'medicine',

  ocultismo:
    'occult',

  politica:
    'politics',

  ciencia:
    'science',
}

function getAttributeValue(
  game,
  attributeLabel
) {
  const key =
    normalizeKey(
      attributeLabel
    )

  const mapping =
    ATTRIBUTE_MAP[
      key
    ]

  if (!mapping) {
    return 0
  }

  const [
    group,
    attribute,
  ] = mapping

  return Number(
    game?.attributes
      ?.[group]
      ?.[attribute] ??
    0
  )
}

function getAbilityValue(
  game,
  abilityLabel
) {
  if (!abilityLabel) {
    return 0
  }

  const key =
    normalizeKey(
      abilityLabel
    )

  const ability =
    ABILITY_MAP[
      key
    ]

  if (!ability) {
    return 0
  }

  return Number(
    game?.abilities
      ?.[ability] ??
    0
  )
}

function rollDie() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function rollPool(
  pool
) {
  const amount =
    Math.max(
      1,
      Number(pool) || 1
    )

  return Array.from(
    {
      length:
        amount,
    },
    rollDie
  )
}

function resolveDice(
  dice,
  difficulty
) {
  let successes = 0
  let ones = 0

  for (
    const die of dice
  ) {
    if (
      die >= difficulty
    ) {
      successes += 1
    }

    if (
      die === 1
    ) {
      ones += 1
  }

  successes -=
    ones

  if (
    successes > 0
  ) {
    return {
      result:
        'success',

      successes,
    }
  }

  if (
    successes < 0
  ) {
    return {
      result:
        'botch',

      successes: 0,
    }
  }

  return {
    result:
      'failure',

    successes: 0,
  }
}

export function buildTravelEventTest(
  game,
  event
) {
  if (
    !event?.test
  ) {
    return null
  }

  const attributeValue =
    getAttributeValue(
      game,
      event.test.attribute
    )

  const abilityValue =
    getAbilityValue(
      game,
      event.test.ability
    )

  const pool =
    Math.max(
      1,
      attributeValue +
        abilityValue
    )

  return {
    id:
      `travel-${event.id}`,

    eventId:
      event.id,

    label:
      event.test.label ??
      'Teste',

    attribute:
      event.test.attribute,

    ability:
      event.test.ability,

    attributeValue,

    abilityValue,

    pool,

    difficulty:
      Number(
        event.test.difficulty ??
        6
      ),
  }
}

export function executeTravelEventTest(
  game,
  event
) {
  const test =
    buildTravelEventTest(
      game,
      event
    )

  if (!test) {
    return null
  }

  const dice =
    rollPool(
      test.pool
    )

  const resolution =
    resolveDice(
      dice,
      test.difficulty
    )

  return {
    ...test,

    dice,

    ...resolution,
  }
}

export function getTravelEventOutcome(
  event,
  roll
) {
  if (
    !event ||
    !roll
  ) {
    return null
  }

  /*
    =====================================
    VIATURA
    =====================================
  */

  if (
    event.id ===
    'police_patrol'
  ) {
    if (
      roll.result ===
      'success'
    ) {
      return {
        title:
          'Nada para ver aqui',

        narration: [
          'Você controla a postura e continua agindo como se não houvesse nada de estranho.',
          'A viatura passa.',
          'Os policiais seguem adiante sem demonstrar interesse.',
        ],

        effects: {},
      }
    }

    if (
      roll.result ===
      'botch'
    ) {
      return {
        title:
          'Você chama atenção demais',

        narration: [
          'Sua tentativa de parecer natural produz exatamente o efeito contrário.',
          'A viatura reduz a velocidade.',
          'Um dos policiais olha diretamente para você.',
          'A porta do passageiro se abre.',
          'A situação ficou muito mais séria.',
        ],

        effects: {
          policeTrouble:
            true,

          travelDelay:
            15,

          possibleMasqueradeRisk:
            true,
        },
      }
    }

    return {
      title:
        'Atenção indesejada',

      narration: [
        'A viatura reduz a velocidade.',
        'Os policiais observam você por alguns segundos.',
        'Você consegue continuar, mas perde tempo evitando parecer suspeito.',
      ],

      effects: {
        travelDelay:
          5,
      },
    }
  }

  /*
    =====================================
    RUA ESCURA
    =====================================
  */

  if (
    event.id ===
    'dangerous_alley'
  ) {
    if (
      roll.result ===
      'success'
    ) {
      return {
        title:
          'Você percebe a tempo',

        narration: [
          'Os passos atrás de você não são coincidência.',
          'Você muda de direção antes que quem o segue consiga fechar a distância.',
          'O perigo passa sem confronto.',
        ],

        effects: {},
      }
    }

    if (
      roll.result ===
      'botch'
    ) {
      return {
        title:
          'Tarde demais',

        narration: [
          'Você percebe o movimento somente quando alguém já está perto demais.',
          'Uma mão agarra sua roupa por trás.',
          'Outra pessoa surge na sua frente.',
          'Você entrou direto em uma emboscada.',
        ],

        effects: {
          ambushed:
            true,

          travelDelay:
            10,

          danger:
            true,
        },
      }
    }

    return {
      title:
        'Alguém está seguindo você',

      narration: [
        'Você demora para perceber.',
        'Quando finalmente olha para trás, há alguém perto demais.',
        'Você consegue se afastar, mas o encontro deixa claro que a viagem não foi tranquila.',
      ],

      effects: {
        travelDelay:
          5,

        danger:
          true,
      },
    }
  }

  /*
    =====================================
    RESULTADO GENÉRICO
    =====================================
  */

  if (
    roll.result ===
    'success'
  ) {
    return {
      title:
        'Sucesso',

      narration: [
        'Você reage corretamente à situação.',
        'O problema passa sem maiores consequências.',
      ],

      effects: {},
    }
  }

  if (
    roll.result ===
    'botch'
  ) {
    return {
      title:
        'Falha crítica',

      narration: [
        'A situação sai completamente do seu controle.',
        'O que deveria ser apenas um inconveniente se transforma em um problema sério.',
      ],

      effects: {
        travelDelay:
          10,

        danger:
          true,
      },
    }
  }

  return {
    title:
      'Falha',

    narration: [
      'Você não consegue lidar com a situação como pretendia.',
      'Ainda assim, consegue continuar a viagem.',
    ],

    effects: {
      travelDelay:
        5,
    },
  }
}

export function applyTravelEventOutcome(
  game,
  event,
  roll,
  outcome
) {
  if (
    !game ||
    !outcome
  ) {
    return game
  }

  const delay =
    Number(
      outcome.effects
        ?.travelDelay ??
      0
    )

  let hour =
    Number(
      game.world?.hour ??
      0
    )

  let minute =
    Number(
      game.world?.minute ??
      0
    )

  if (
    delay > 0
  ) {
    const total =
      hour * 60 +
      minute +
      delay

    hour =
      Math.floor(
        (
          total %
          1440
        ) /
          60
      )

    minute =
      total %
      60
  }

  return {
    ...game,

    world: {
      ...(game.world ??
        {}),

      hour,

      minute,
    },

    flags: {
      ...(game.flags ??
        {}),

      ...(outcome.effects
        ?.policeTrouble
        ? {
            policeTrouble:
              true,
          }
        : {}),

      ...(outcome.effects
        ?.possibleMasqueradeRisk
        ? {
            possibleMasqueradeRisk:
              true,
          }
        : {}),

      ...(outcome.effects
        ?.ambushed
        ? {
            travelAmbushed:
              true,
          }
        : {}),

      ...(outcome.effects
        ?.danger
        ? {
            travelDanger:
              true,
          }
        : {}),
    },

    lastTravelEventRoll: {
      eventId:
        event?.id ??
        null,

      result:
        roll?.result ??
        null,

      successes:
        roll?.successes ??
        0,

      dice:
        roll?.dice ??
        [],

      timestamp:
        new Date()
          .toISOString(),
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'travel-event-test',

        eventId:
          event?.id ??
          null,

        test:
          roll?.label ??
          null,

        pool:
          roll?.pool ??
          0,

        difficulty:
          roll?.difficulty ??
          6,

        dice:
          roll?.dice ??
          [],

        result:
          roll?.result ??
          null,

        successes:
          roll?.successes ??
          0,

        outcome:
          outcome.title,

        delay,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}}