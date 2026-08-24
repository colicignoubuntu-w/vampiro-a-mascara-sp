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

  armasdefogo:
    'firearms',

  armfogo:
    'firearms',

  armasbrancas:
    'melee',

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

function safeNumber(
  value,
  fallback = 0
) {
  const parsed =
    Number(value)

  return Number.isNaN(
    parsed
  )
    ? fallback
    : parsed
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

  return Math.max(
    0,
    safeNumber(
      game?.attributes
        ?.[group]
        ?.[attribute],
      0
    )
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

  return Math.max(
    0,
    safeNumber(
      game?.abilities
        ?.[ability],
      0
    )
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
      safeNumber(
        pool,
        1
      )
    )

  return Array.from(
    {
      length:
        amount,
    },
    () => rollDie()
  )
}

function resolveDice(
  dice,
  difficulty
) {
  const diff =
    Math.max(
      2,
      Math.min(
        10,
        safeNumber(
          difficulty,
          6
        )
      )
    )

  let successes = 0
  let ones = 0

  for (
    const die of dice
  ) {
    if (
      die >= diff
    ) {
      successes += 1
    }

    if (
      die === 1
    ) {
      ones += 1
    }
  }

  const netSuccesses =
    successes -
    ones

  if (
    netSuccesses > 0
  ) {
    return {
      result:
        'success',

      successes:
        netSuccesses,

      rawSuccesses:
        successes,

      ones,
    }
  }

  if (
    successes === 0 &&
    ones > 0
  ) {
    return {
      result:
        'botch',

      successes: 0,

      rawSuccesses: 0,

      ones,
    }
  }

  return {
    result:
      'failure',

    successes: 0,

    rawSuccesses:
      successes,

    ones,
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

  const difficulty =
    Math.max(
      2,
      Math.min(
        10,
        safeNumber(
          event.test
            .difficulty,
          6
        )
      )
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
      event.test.attribute ??
      'Atributo',

    ability:
      event.test.ability ??
      '',

    attributeValue,

    abilityValue,

    pool,

    difficulty,
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
    ========================================
    VIATURA
    ========================================
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
          'A viatura passa lentamente por você.',
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
    ========================================
    RUA ESCURA / EMBOSCADA
    ========================================
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
          'Você entrou diretamente em uma emboscada.',
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
        'Você consegue se afastar, mas a viagem deixa de ser tranquila.',
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
    ========================================
    RESULTADO GENÉRICO
    ========================================
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

function addMinutesToWorld(
  world,
  minutes
) {
  const amount =
    Math.max(
      0,
      safeNumber(
        minutes,
        0
      )
    )

  const hour =
    safeNumber(
      world?.hour,
      0
    )

  const minute =
    safeNumber(
      world?.minute,
      0
    )

  const dayMinutes =
    24 * 60

  const total =
    (
      hour * 60 +
      minute +
      amount
    ) %
    dayMinutes

  return {
    ...(world ?? {}),

    hour:
      Math.floor(
        total / 60
      ),

    minute:
      total % 60,
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
    !event ||
    !roll ||
    !outcome
  ) {
    return game
  }

  const effects =
    outcome.effects ??
    {}

  const delay =
    Math.max(
      0,
      safeNumber(
        effects.travelDelay,
        0
      )
    )

  let updatedGame = {
    ...game,

    world:
      delay > 0
        ? addMinutesToWorld(
            game.world,
            delay
          )
        : {
            ...(game.world ??
              {}),
          },

    flags: {
      ...(game.flags ??
        {}),

      ...(effects.policeTrouble
        ? {
            policeTrouble:
              true,
          }
        : {}),

      ...(effects.possibleMasqueradeRisk
        ? {
            possibleMasqueradeRisk:
              true,
          }
        : {}),

      ...(effects.ambushed
        ? {
            travelAmbushed:
              true,
          }
        : {}),

      ...(effects.danger
        ? {
            travelDanger:
              true,
          }
        : {}),
    },

    lastTravelEventRoll: {
      eventId:
        event.id,

      testId:
        roll.id,

      label:
        roll.label,

      result:
        roll.result,

      successes:
        roll.successes,

      rawSuccesses:
        roll.rawSuccesses,

      ones:
        roll.ones,

      dice:
        roll.dice,

      pool:
        roll.pool,

      difficulty:
        roll.difficulty,

      timestamp:
        new Date()
          .toISOString(),
    },
  }

  updatedGame = {
    ...updatedGame,

    history: [
      ...(updatedGame.history ??
        []),

      {
        type:
          'travel-event-test',

        eventId:
          event.id,

        eventType:
          event.type ??
          'unknown',

        test:
          roll.label,

        attribute:
          roll.attribute,

        ability:
          roll.ability,

        pool:
          roll.pool,

        difficulty:
          roll.difficulty,

        dice:
          roll.dice,

        rawSuccesses:
          roll.rawSuccesses,

        ones:
          roll.ones,

        successes:
          roll.successes,

        result:
          roll.result,

        outcome:
          outcome.title,

        delay,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return updatedGame
}