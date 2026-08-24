import {
  rollDicePool,
} from '../dice/rollTest'

import {
  addDamage,
  getTotalDamage,
  isIncapacitated,
  normalizeHealth,
} from '../combat/damageEngine'

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

function getAttribute(
  game,
  group,
  key
) {
  return Math.max(
    0,
    safeNumber(
      game?.attributes
        ?.[group]
        ?.[key],
      0
    )
  )
}

function getAbility(
  game,
  key
) {
  return Math.max(
    0,
    safeNumber(
      game?.abilities
        ?.[key],
      0
    )
  )
}

function getHealthPenalty(
  game
) {
  const damage =
    getTotalDamage(
      game?.health
    )

  if (
    damage <= 1
  ) {
    return 0
  }

  if (
    damage <= 3
  ) {
    return -1
  }

  if (
    damage <= 5
  ) {
    return -2
  }

  if (
    damage === 6
  ) {
    return -5
  }

  return -10
}

export function createHazardState(
  config
) {
  return {
    id:
      config.id,

    type:
      config.type,

    title:
      config.title,

    description:
      config.description,

    round: 1,

    status:
      'active',

    escaped: false,

    destroyed: false,

    damagePerTurn:
      safeNumber(
        config.damagePerTurn,
        1
      ),

    escapeDifficulty:
      safeNumber(
        config.escapeDifficulty,
        6
      ),

    coverDifficulty:
      safeNumber(
        config.coverDifficulty,
        7
      ),

    successScene:
      config.successScene ??
      null,

    destructionScene:
      config.destructionScene ??
      null,

    log: [
      {
        type:
          'hazard',

        text:
          config.description,
      },
    ],
  }
}

function applyAggravatedDamage({
  game,
  amount,
  source,
}) {
  const health =
    normalizeHealth(
      game.health
    )

  const updatedHealth =
    addDamage({
      health,

      damageType:
        'aggravated',

      amount,
    })

  const destroyed =
    isIncapacitated(
      updatedHealth
    )

  return {
    game: {
      ...game,

      health:
        updatedHealth,

      flags: {
        ...(game.flags ??
          {}),

        ...(destroyed
          ? {
              vampireDestroyed:
                true,

              destroyedBy:
                source,
            }
          : {}),
      },

      history: [
        ...(game.history ??
          []),

        {
          type:
            'aggravated-environmental-damage',

          source,

          amount,

          totalDamage:
            getTotalDamage(
              updatedHealth
            ),

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    },

    destroyed,
  }
}

function performEscapeTest(
  game,
  hazard
) {
  const dexterity =
    getAttribute(
      game,
      'physical',
      'dexterity'
    )

  const athletics =
    getAbility(
      game,
      'athletics'
    )

  const penalty =
    getHealthPenalty(
      game
    )

  const pool =
    Math.max(
      1,
      dexterity +
        athletics +
        penalty
    )

  const roll =
    rollDicePool({
      pool,

      difficulty:
        hazard.escapeDifficulty,
    })

  return {
    roll,

    success:
      roll.result ===
        'success' &&
      roll.successes > 0,

    log: [
      {
        type:
          'escape',

        text:
          `Fuga: Destreza + Esportes = ${pool} dados, dificuldade ${hazard.escapeDifficulty}.`,
      },

      {
        type:
          'dice',

        text:
          `[${roll.dice.join(', ')}] → ${roll.successes} sucesso(s).`,
      },
    ],
  }
}

function performCoverTest(
  game,
  hazard
) {
  const wits =
    getAttribute(
      game,
      'mental',
      'wits'
    )

  const survival =
    getAbility(
      game,
      'survival'
    )

  const penalty =
    getHealthPenalty(
      game
    )

  const pool =
    Math.max(
      1,
      wits +
        survival +
        penalty
    )

  const roll =
    rollDicePool({
      pool,

      difficulty:
        hazard.coverDifficulty,
    })

  return {
    roll,

    success:
      roll.result ===
        'success' &&
      roll.successes > 0,

    log: [
      {
        type:
          'cover',

        text:
          `Abrigo: Raciocínio + Sobrevivência = ${pool} dados, dificuldade ${hazard.coverDifficulty}.`,
      },

      {
        type:
          'dice',

        text:
          `[${roll.dice.join(', ')}] → ${roll.successes} sucesso(s).`,
      },
    ],
  }
}

export function performHazardAction({
  game,
  hazard,
  actionId,
}) {
  if (
    !game ||
    !hazard ||
    hazard.status !==
      'active'
  ) {
    return {
      game,
      hazard,
    }
  }

  let updatedGame =
    game

  let updatedHazard =
    hazard

  const roundLog = [
    {
      type:
        'round',

      text:
        `— EXPOSIÇÃO ${hazard.round} —`,
    },
  ]

  /*
    ========================================
    FUGIR
    ========================================
  */

  if (
    actionId ===
    'escape'
  ) {
    const result =
      performEscapeTest(
        game,
        hazard
      )

    roundLog.push(
      ...result.log
    )

    if (
      result.success
    ) {
      updatedHazard = {
        ...hazard,

        status:
          'finished',

        escaped:
          true,

        log: [
          ...(hazard.log ??
            []),

          ...roundLog,

          {
            type:
              'success',

            text:
              'Você consegue sair da área de exposição.',
          },
        ],
      }

      return {
        game:
          updatedGame,

        hazard:
          updatedHazard,
      }
    }

    roundLog.push({
      type:
        'failure',

      text:
        'Você não consegue escapar antes de sofrer nova exposição.',
    })
  }

  /*
    ========================================
    PROCURAR COBERTURA
    ========================================
  */

  if (
    actionId ===
    'cover'
  ) {
    const result =
      performCoverTest(
        game,
        hazard
      )

    roundLog.push(
      ...result.log
    )

    if (
      result.success
    ) {
      updatedHazard = {
        ...hazard,

        status:
          'finished',

        escaped:
          true,

        log: [
          ...(hazard.log ??
            []),

          ...roundLog,

          {
            type:
              'success',

            text:
              hazard.type ===
              'sunlight'
                ? 'Você alcança um local protegido da luz solar.'
                : 'Você consegue se proteger das chamas.',
          },
        ],
      }

      return {
        game:
          updatedGame,

        hazard:
          updatedHazard,
      }
    }

    roundLog.push({
      type:
        'failure',

      text:
        'Você não encontra proteção suficiente a tempo.',
    })
  }

  /*
    ========================================
    SUPORTAR / SEM AÇÃO EFETIVA
    ========================================
  */

  if (
    actionId ===
    'endure'
  ) {
    roundLog.push({
      type:
        'warning',

      text:
        'Você permanece exposto.',
    })
  }

  /*
    ========================================
    DANO
    ========================================
  */

  const damageResult =
    applyAggravatedDamage({
      game:
        updatedGame,

      amount:
        hazard.damagePerTurn,

      source:
        hazard.type,
    })

  updatedGame =
    damageResult.game

  roundLog.push({
    type:
      'aggravated',

    text:
      `Você sofre ${hazard.damagePerTurn} nível(is) de dano agravado.`,
  })

  if (
    damageResult.destroyed
  ) {
    updatedHazard = {
      ...hazard,

      status:
        'finished',

      destroyed:
        true,

      log: [
        ...(hazard.log ??
          []),

        ...roundLog,

        {
          type:
            'destroyed',

          text:
            hazard.type ===
            'sunlight'
              ? 'A luz solar destrói seu corpo vampírico.'
              : 'As chamas consomem seu corpo além da capacidade de recuperação.',
        },
      ],
    }

    return {
      game:
        updatedGame,

      hazard:
        updatedHazard,
    }
  }

  updatedHazard = {
    ...hazard,

    round:
      hazard.round + 1,

    log: [
      ...(hazard.log ??
        []),

      ...roundLog,
    ],
  }

  return {
    game:
      updatedGame,

    hazard:
      updatedHazard,
  }
}

export function getHazardActions(
  hazard
) {
  if (
    hazard?.type ===
    'sunlight'
  ) {
    return [
      {
        id:
          'escape',

        label:
          'Correr para Dentro',

        description:
          'Destreza + Esportes para escapar da luz.',
      },

      {
        id:
          'cover',

        label:
          'Procurar Sombra',

        description:
          'Raciocínio + Sobrevivência para encontrar proteção imediata.',
      },

      {
        id:
          'endure',

        label:
          'Continuar Exposto',

        description:
          'Você não tenta escapar e sofre a exposição.',
      },
    ]
  }

  return [
    {
      id:
        'escape',

      label:
        'Fugir das Chamas',

      description:
        'Destreza + Esportes.',
    },

    {
      id:
        'cover',

      label:
        'Procurar Proteção',

      description:
        'Raciocínio + Sobrevivência.',
    },

    {
      id:
        'endure',

      label:
        'Permanecer',

      description:
        'Você continua na área em chamas.',
    },
  ]
}