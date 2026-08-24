import {
  rollDicePool,
} from '../dice/rollTest'

const HEALTH_LEVELS = [
  {
    id: 'bruised',
    label: 'Escoriado',
    penalty: 0,
  },
  {
    id: 'hurt',
    label: 'Machucado',
    penalty: -1,
  },
  {
    id: 'injured',
    label: 'Ferido',
    penalty: -1,
  },
  {
    id: 'wounded',
    label: 'Ferido Gravemente',
    penalty: -2,
  },
  {
    id: 'mauled',
    label: 'Espancado',
    penalty: -2,
  },
  {
    id: 'crippled',
    label: 'Aleijado',
    penalty: -5,
  },
  {
    id: 'incapacitated',
    label: 'Incapacitado',
    penalty: null,
  },
]

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value)

  return Number.isNaN(number)
    ? fallback
    : number
}

function getPlayerAttribute(
  game,
  group,
  key
) {
  const base =
    safeNumber(
      game?.attributes
        ?.[group]
        ?.[key],
      0
    )

  const boost =
    safeNumber(
      game?.combatBoosts
        ?.[key],
      0
    )

  return base + boost
}

function getPlayerAbility(
  game,
  key
) {
  return safeNumber(
    game?.abilities
      ?.[key],
    0
  )
}

export function getHealthInfo(
  damage
) {
  const safeDamage =
    Math.max(
      0,
      safeNumber(
        damage,
        0
      )
    )

  if (
    safeDamage <= 0
  ) {
    return {
      damage: 0,
      label: 'Saudável',
      penalty: 0,
      incapacitated: false,
    }
  }

  const index =
    Math.min(
      safeDamage - 1,
      HEALTH_LEVELS.length - 1
    )

  const level =
    HEALTH_LEVELS[index]

  return {
    damage:
      safeDamage,

    label:
      level.label,

    penalty:
      level.penalty,

    incapacitated:
      safeDamage >=
      HEALTH_LEVELS.length,
  }
}

export function getPlayerHealthPenalty(
  game
) {
  const damage =
    game?.health
      ?.currentLevel ?? 0

  const info =
    getHealthInfo(
      damage
    )

  return (
    info.penalty ?? 0
  )
}

export function rollInitiative(
  dexterity,
  wits
) {
  const die =
    rollD10()

  const base =
    Math.max(
      0,
      safeNumber(
        dexterity,
        0
      )
    ) +
    Math.max(
      0,
      safeNumber(
        wits,
        0
      )
    )

  return {
    die,
    base,
    total:
      base + die,
  }
}

function rollDamage({
  pool,
  soakPool = 0,
}) {
  const damageRoll =
    rollDicePool({
      pool:
        Math.max(
          1,
          pool
        ),

      difficulty: 6,
    })

  const soakRoll =
    soakPool > 0
      ? rollDicePool({
          pool:
            Math.max(
              1,
              soakPool
            ),

          difficulty: 6,
        })
      : {
          dice: [],
          successes: 0,
          result: 'failure',
        }

  const inflicted =
    Math.max(
      0,
      damageRoll.successes -
        soakRoll.successes
    )

  return {
    damageRoll,
    soakRoll,
    inflicted,
  }
}

export function createCombatState(
  game,
  encounter
) {
  const playerDexterity =
    getPlayerAttribute(
      game,
      'physical',
      'dexterity'
    )

  const playerWits =
    getPlayerAttribute(
      game,
      'mental',
      'wits'
    )

  const enemyDexterity =
    safeNumber(
      encounter.enemy
        ?.attributes
        ?.dexterity,
      2
    )

  const enemyWits =
    safeNumber(
      encounter.enemy
        ?.attributes
        ?.wits,
      2
    )

  const playerInitiative =
    rollInitiative(
      playerDexterity,
      playerWits
    )

  const enemyInitiative =
    rollInitiative(
      enemyDexterity,
      enemyWits
    )

  return {
    encounterId:
      encounter.id,

    round: 1,

    status:
      'active',

    winner: null,

    playerInitiative,

    enemyInitiative,

    playerActsFirst:
      playerInitiative.total >=
      enemyInitiative.total,

    grapple: {
      active: false,
      controller: null,
    },

    enemy: {
      id:
        encounter.enemy.id,

      name:
        encounter.enemy.name,

      type:
        encounter.enemy.type ??
        'human',

      attributes: {
        dexterity:
          enemyDexterity,

        strength:
          safeNumber(
            encounter.enemy
              ?.attributes
              ?.strength,
            2
          ),

        stamina:
          safeNumber(
            encounter.enemy
              ?.attributes
              ?.stamina,
            2
          ),

        wits:
          enemyWits,
      },

      abilities: {
        brawl:
          safeNumber(
            encounter.enemy
              ?.abilities
              ?.brawl,
            2
          ),

        dodge:
          safeNumber(
            encounter.enemy
              ?.abilities
              ?.dodge,
            1
          ),

        athletics:
          safeNumber(
            encounter.enemy
              ?.abilities
              ?.athletics,
            1
          ),
      },

      health: {
        damage: 0,

        maximum:
          safeNumber(
            encounter.enemy
              ?.health,
            7
          ),
      },

      attack: {
        name:
          encounter.enemy
            ?.attack
            ?.name ??
          'Soco',

        difficulty:
          safeNumber(
            encounter.enemy
              ?.attack
              ?.difficulty,
            6
          ),

        damageBonus:
          safeNumber(
            encounter.enemy
              ?.attack
              ?.damageBonus,
            0
          ),
      },
    },

    log: [
      {
        type:
          'initiative',

        text:
          `Iniciativa: você ${playerInitiative.total} | ${encounter.enemy.name} ${enemyInitiative.total}.`,
      },

      {
        type:
          'system',

        text:
          playerInitiative.total >=
          enemyInitiative.total
            ? 'Você age primeiro.'
            : `${encounter.enemy.name} age primeiro.`,
      },
    ],
  }
}

function applyPlayerDamage(
  game,
  amount
) {
  if (
    amount <= 0
  ) {
    return {
      game,
      incapacitated: false,
      healthInfo:
        getHealthInfo(
          game?.health
            ?.currentLevel ?? 0
        ),
    }
  }

  const oldDamage =
    game?.health
      ?.currentLevel ?? 0

  const newDamage =
    Math.min(
      7,
      oldDamage +
        amount
    )

  const healthInfo =
    getHealthInfo(
      newDamage
    )

  return {
    game: {
      ...game,

      health: {
        ...(game.health ?? {}),

        currentLevel:
          newDamage,
      },
    },

    incapacitated:
      healthInfo.incapacitated,

    healthInfo,
  }
}

function performEnemyAttack(
  game,
  combat,
  dodgeSuccesses = 0
) {
  if (
    combat.status !==
    'active'
  ) {
    return {
      game,
      combat,
      log: [],
    }
  }

  const enemy =
    combat.enemy

  const attackPool =
    Math.max(
      1,
      enemy.attributes
        .dexterity +
        enemy.abilities
          .brawl
    )

  const attackRoll =
    rollDicePool({
      pool:
        attackPool,

      difficulty:
        enemy.attack
          .difficulty,
    })

  const log = [
    {
      type:
        'enemy-attack',

      text:
        `${enemy.name} ataca com ${enemy.attack.name}.`,
    },

    {
      type:
        'dice',

      text:
        `Ataque inimigo: [${attackRoll.dice.join(', ')}] → ${attackRoll.successes} sucesso(s).`,
    },
  ]

  let netSuccesses =
    attackRoll.result ===
    'success'
      ? attackRoll.successes
      : 0

  if (
    dodgeSuccesses > 0
  ) {
    const cancelled =
      Math.min(
        dodgeSuccesses,
        netSuccesses
      )

    netSuccesses =
      Math.max(
        0,
        netSuccesses -
          dodgeSuccesses
      )

    log.push({
      type:
        'dodge',

      text:
        `Sua esquiva cancela ${cancelled} sucesso(s).`,
    })
  }

  if (
    netSuccesses <= 0
  ) {
    log.push({
      type:
        'miss',

      text:
        dodgeSuccesses > 0
          ? 'Você evita o ataque.'
          : `${enemy.name} erra.`,
    })

    return {
      game,
      combat,
      log,
    }
  }

  const extraSuccesses =
    Math.max(
      0,
      netSuccesses - 1
    )

  const damagePool =
    Math.max(
      1,
      enemy.attributes
        .strength +
        enemy.attack
          .damageBonus +
        extraSuccesses
    )

  const playerStamina =
    getPlayerAttribute(
      game,
      'physical',
      'stamina'
    )

  const damage =
    rollDamage({
      pool:
        damagePool,

      soakPool:
        playerStamina,
    })

  log.push({
    type:
      'damage',

    text:
      `Dano inimigo: ${damage.damageRoll.successes} sucesso(s).`,
  })

  log.push({
    type:
      'soak',

    text:
      `Absorção com Vigor ${playerStamina}: ${damage.soakRoll.successes} sucesso(s).`,
  })

  if (
    damage.inflicted <= 0
  ) {
    log.push({
      type:
        'soaked',

      text:
        'Você absorve todo o dano.',
    })

    return {
      game,
      combat,
      log,
    }
  }

  const damageResult =
    applyPlayerDamage(
      game,
      damage.inflicted
    )

  let updatedCombat =
    combat

  log.push({
    type:
      'player-damage',

    text:
      `Você sofre ${damage.inflicted} nível(is). Estado: ${damageResult.healthInfo.label}.`,
  })

  if (
    damageResult.incapacitated
  ) {
    updatedCombat = {
      ...combat,

      status:
        'finished',

      winner:
        'enemy',
    }

    log.push({
      type:
        'defeat',

      text:
        'Você está incapacitado.',
    })
  }

  return {
    game:
      damageResult.game,

    combat:
      updatedCombat,

    log,
  }
}

function performPlayerAttack(
  game,
  combat,
  action
) {
  const dexterity =
    getPlayerAttribute(
      game,
      'physical',
      'dexterity'
    )

  const strength =
    getPlayerAttribute(
      game,
      'physical',
      'strength'
    )

  const ability =
    getPlayerAbility(
      game,
      action.ability ??
      'brawl'
    )

  const healthPenalty =
    getPlayerHealthPenalty(
      game
    )

  const attackPool =
    Math.max(
      1,
      dexterity +
        ability +
        healthPenalty
    )

  const attackRoll =
    rollDicePool({
      pool:
        attackPool,

      difficulty:
        action.difficulty,
    })

  const log = [
    {
      type:
        'player-attack',

      text:
        `${action.label}: ${attackPool} dados, dificuldade ${action.difficulty}.`,
    },

    {
      type:
        'dice',

      text:
        `Ataque: [${attackRoll.dice.join(', ')}] → ${attackRoll.successes} sucesso(s).`,
    },
  ]

  if (
    attackRoll.result !==
    'success'
  ) {
    log.push({
      type:
        attackRoll.result ===
        'botch'
          ? 'botch'
          : 'miss',

      text:
        attackRoll.result ===
        'botch'
          ? 'Falha crítica no ataque.'
          : 'O ataque não acerta.',
    })

    return {
      combat,
      log,
      hit: false,
    }
  }

  const extraSuccesses =
    Math.max(
      0,
      attackRoll.successes -
        1
    )

  const damagePool =
    Math.max(
      1,
      strength +
        action.damageBonus +
        extraSuccesses
    )

  const soakPool =
    combat.enemy
      .attributes
      .stamina

  const damage =
    rollDamage({
      pool:
        damagePool,

      soakPool,
    })

  log.push({
    type:
      'damage',

    text:
      `Dano: ${damage.damageRoll.successes} sucesso(s).`,
  })

  log.push({
    type:
      'soak',

    text:
      `${combat.enemy.name} absorve ${damage.soakRoll.successes} sucesso(s).`,
  })

  const enemyDamage =
    combat.enemy
      .health
      .damage +
    damage.inflicted

  const enemyDefeated =
    enemyDamage >=
    combat.enemy
      .health
      .maximum

  const updatedCombat = {
    ...combat,

    enemy: {
      ...combat.enemy,

      health: {
        ...combat.enemy
          .health,

        damage:
          enemyDamage,
      },
    },

    ...(enemyDefeated
      ? {
          status:
            'finished',

          winner:
            'player',
        }
      : {}),
  }

  log.push({
    type:
      damage.inflicted > 0
        ? 'hit'
        : 'soaked',

    text:
      damage.inflicted > 0
        ? `${combat.enemy.name} sofre ${damage.inflicted} nível(is) de dano.`
        : `${combat.enemy.name} absorve todo o dano.`,
  })

  if (
    enemyDefeated
  ) {
    log.push({
      type:
        'victory',

      text:
        `${combat.enemy.name} não consegue continuar lutando.`,
    })
  }

  return {
    combat:
      updatedCombat,

    log,

    hit: true,
  }
}

function performGrapple(
  game,
  combat
) {
  const strength =
    getPlayerAttribute(
      game,
      'physical',
      'strength'
    )

  const brawl =
    getPlayerAbility(
      game,
      'brawl'
    )

  const enemyStrength =
    combat.enemy
      .attributes
      .strength

  const enemyBrawl =
    combat.enemy
      .abilities
      .brawl

  const playerRoll =
    rollDicePool({
      pool:
        Math.max(
          1,
          strength + brawl
        ),

      difficulty: 6,
    })

  const enemyRoll =
    rollDicePool({
      pool:
        Math.max(
          1,
          enemyStrength +
            enemyBrawl
        ),

      difficulty: 6,
    })

  const playerSuccesses =
    playerRoll.result ===
    'success'
      ? playerRoll.successes
      : 0

  const enemySuccesses =
    enemyRoll.result ===
    'success'
      ? enemyRoll.successes
      : 0

  const log = [
    {
      type: 'grapple',

      text:
        `Agarrar: você ${playerSuccesses} sucesso(s) | inimigo ${enemySuccesses}.`,
    },
  ]

  if (
    playerSuccesses >
    enemySuccesses
  ) {
    log.push({
      type:
        'grapple-success',

      text:
        `Você imobiliza ${combat.enemy.name}.`,
    })

    return {
      combat: {
        ...combat,

        grapple: {
          active: true,
          controller:
            'player',
        },
      },

      log,
    }
  }

  log.push({
    type:
      'grapple-failure',

    text:
      `${combat.enemy.name} impede a imobilização.`,
  })

  return {
    combat,
    log,
  }
}

function performBite(
  game,
  combat
) {
  if (
    !combat.grapple
      ?.active ||
    combat.grapple
      ?.controller !==
      'player'
  ) {
    return {
      game,
      combat,

      log: [
        {
          type:
            'bite-failure',

          text:
            'Você precisa primeiro controlar o alvo para morder com segurança.',
        },
      ],
    }
  }

  const strength =
    getPlayerAttribute(
      game,
      'physical',
      'strength'
    )

  const damage =
    rollDamage({
      pool:
        Math.max(
          1,
          strength + 1
        ),

      soakPool:
        combat.enemy
          .attributes
          .stamina,
    })

  const enemyDamage =
    combat.enemy
      .health
      .damage +
    Math.max(
      1,
      damage.inflicted
    )

  const defeated =
    enemyDamage >=
    combat.enemy
      .health
      .maximum

  const updatedCombat = {
    ...combat,

    enemy: {
      ...combat.enemy,

      health: {
        ...combat.enemy
          .health,

        damage:
          enemyDamage,
      },
    },

    ...(defeated
      ? {
          status:
            'finished',

          winner:
            'player',
        }
      : {}),
  }

  const log = [
    {
      type:
        'bite',

      text:
        `Você crava os caninos em ${combat.enemy.name}.`,
    },

    {
      type:
        'damage',

      text:
        `A mordida causa ${Math.max(
          1,
          damage.inflicted
        )} nível(is) de dano.`,
    },
  ]

  if (
    defeated
  ) {
    log.push({
      type:
        'victory',

      text:
        `${combat.enemy.name} deixa de oferecer resistência.`,
    })
  }

  return {
    game,
    combat:
      updatedCombat,
    log,
  }
}

function performDodge(
  game
) {
  const dexterity =
    getPlayerAttribute(
      game,
      'physical',
      'dexterity'
    )

  const dodge =
    getPlayerAbility(
      game,
      'dodge'
    )

  const healthPenalty =
    getPlayerHealthPenalty(
      game
    )

  const pool =
    Math.max(
      1,
      dexterity +
        dodge +
        healthPenalty
    )

  const roll =
    rollDicePool({
      pool,
      difficulty: 6,
    })

  return {
    successes:
      roll.result ===
      'success'
        ? roll.successes
        : 0,

    log: [
      {
        type:
          'dodge',

        text:
          `Esquiva: [${roll.dice.join(', ')}] → ${roll.successes} sucesso(s).`,
      },
    ],
  }
}

function performEscape(
  game,
  combat
) {
  const dexterity =
    getPlayerAttribute(
      game,
      'physical',
      'dexterity'
    )

  const athletics =
    getPlayerAbility(
      game,
      'athletics'
    )

  const healthPenalty =
    getPlayerHealthPenalty(
      game
    )

  const roll =
    rollDicePool({
      pool:
        Math.max(
          1,
          dexterity +
            athletics +
            healthPenalty
        ),

      difficulty: 6,
    })

  if (
    roll.result ===
    'success'
  ) {
    return {
      combat: {
        ...combat,

        status:
          'finished',

        winner:
          'escaped',
      },

      success: true,

      log: [
        {
          type:
            'escape-success',

          text:
            'Você consegue fugir.',
        },
      ],
    }
  }

  return {
    combat,
    success: false,

    log: [
      {
        type:
          'escape-failure',

        text:
          'Você não consegue escapar.',
      },
    ],
  }
}

function executePlayerAction({
  game,
  combat,
  actionId,
}) {
  if (
    actionId ===
    'dodge'
  ) {
    const dodge =
      performDodge(
        game
      )

    return {
      game,
      combat,

      log:
        dodge.log,

      dodgeSuccesses:
        dodge.successes,

      skipEnemyAttack:
        false,
    }
  }

  if (
    actionId ===
    'escape'
  ) {
    const escape =
      performEscape(
        game,
        combat
      )

    return {
      game,

      combat:
        escape.combat,

      log:
        escape.log,

      skipEnemyAttack:
        escape.success,
    }
  }

  if (
    actionId ===
    'grapple'
  ) {
    const result =
      performGrapple(
        game,
        combat
      )

    return {
      game,

      combat:
        result.combat,

      log:
        result.log,

      skipEnemyAttack:
        false,
    }
  }

  if (
    actionId ===
    'bite'
  ) {
    const result =
      performBite(
        game,
        combat
      )

    return {
      game:
        result.game,

      combat:
        result.combat,

      log:
        result.log,

      skipEnemyAttack:
        result.combat.status !==
        'active',
    }
  }

  const actions = {
    punch: {
      label: 'Soco',
      difficulty: 6,
      damageBonus: 0,
      ability: 'brawl',
    },

    kick: {
      label: 'Chute',
      difficulty: 7,
      damageBonus: 1,
      ability: 'brawl',
    },
  }

  const action =
    actions[actionId] ??
    actions.punch

  const result =
    performPlayerAttack(
      game,
      combat,
      action
    )

  return {
    game,

    combat:
      result.combat,

    log:
      result.log,

    skipEnemyAttack:
      result.combat.status !==
      'active',
  }
}

export function performCombatAction({
  game,
  combat,
  actionId,
}) {
  if (
    !game ||
    !combat ||
    combat.status !==
      'active'
  ) {
    return {
      game,
      combat,
    }
  }

  let updatedGame =
    game

  let updatedCombat =
    combat

  const roundLog = [
    {
      type:
        'round',

      text:
        `— TURNO ${combat.round} —`,
    },
  ]

  /*
    ========================================
    INIMIGO PRIMEIRO
    ========================================
  */

  if (
    !combat.playerActsFirst
  ) {
    const enemyResult =
      performEnemyAttack(
        updatedGame,
        updatedCombat
      )

    updatedGame =
      enemyResult.game

    updatedCombat =
      enemyResult.combat

    roundLog.push(
      ...enemyResult.log
    )

    if (
      updatedCombat.status !==
      'active'
    ) {
      return {
        game:
          updatedGame,

        combat: {
          ...updatedCombat,

          log: [
            ...(combat.log ?? []),
            ...roundLog,
          ],
        },
      }
    }
  }

  /*
    ========================================
    AÇÃO DO JOGADOR
    ========================================
  */

  const playerResult =
    executePlayerAction({
      game:
        updatedGame,

      combat:
        updatedCombat,

      actionId,
    })

  updatedGame =
    playerResult.game

  updatedCombat =
    playerResult.combat

  roundLog.push(
    ...playerResult.log
  )

  if (
    updatedCombat.status !==
    'active'
  ) {
    return {
      game:
        updatedGame,

      combat: {
        ...updatedCombat,

        log: [
          ...(combat.log ?? []),
          ...roundLog,
        ],
      },
    }
  }

  /*
    ========================================
    INIMIGO DEPOIS
    ========================================
  */

  if (
    combat.playerActsFirst &&
    !playerResult
      .skipEnemyAttack
  ) {
    const enemyResult =
      performEnemyAttack(
        updatedGame,
        updatedCombat,
        playerResult
          .dodgeSuccesses ??
          0
      )

    updatedGame =
      enemyResult.game

    updatedCombat =
      enemyResult.combat

    roundLog.push(
      ...enemyResult.log
    )
  }

  /*
    Nova iniciativa a cada turno.
  */

  if (
    updatedCombat.status ===
    'active'
  ) {
    const playerDexterity =
      getPlayerAttribute(
        updatedGame,
        'physical',
        'dexterity'
      )

    const playerWits =
      getPlayerAttribute(
        updatedGame,
        'mental',
        'wits'
      )

    const playerInitiative =
      rollInitiative(
        playerDexterity,
        playerWits
      )

    const enemyInitiative =
      rollInitiative(
        updatedCombat.enemy
          .attributes
          .dexterity,

        updatedCombat.enemy
          .attributes
          .wits
      )

    updatedCombat = {
      ...updatedCombat,

      round:
        combat.round + 1,

      playerInitiative,

      enemyInitiative,

      playerActsFirst:
        playerInitiative.total >=
        enemyInitiative.total,
    }

    roundLog.push({
      type:
        'initiative',

      text:
        `Nova iniciativa: você ${playerInitiative.total} | ${updatedCombat.enemy.name} ${enemyInitiative.total}.`,
    })
  }

  updatedCombat = {
    ...updatedCombat,

    log: [
      ...(combat.log ?? []),
      ...roundLog,
    ],
  }

  return {
    game:
      updatedGame,

    combat:
      updatedCombat,
  }
}

export function spendBloodForPhysicalBoost({
  game,
  attribute,
}) {
  const allowed = [
    'strength',
    'dexterity',
    'stamina',
  ]

  if (
    !allowed.includes(
      attribute
    )
  ) {
    return {
      success: false,
      game,
    }
  }

  const currentBlood =
    game?.blood
      ?.current ?? 0

  if (
    currentBlood <= 0
  ) {
    return {
      success: false,
      game,
    }
  }

  const currentBoost =
    game?.combatBoosts
      ?.[attribute] ?? 0

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        currentBlood - 1,
    },

    combatBoosts: {
      ...(game.combatBoosts ??
        {}),

      [attribute]:
        currentBoost + 1,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'blood-physical-boost',

        attribute,

        amount: 1,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,

    game:
      updatedGame,
  }
}

export function clearCombatBoosts(
  game
) {
  return {
    ...game,

    combatBoosts: {
      strength: 0,
      dexterity: 0,
      stamina: 0,
    },
  }
}

export function getCombatActions(
  combat
) {
  const grappled =
    combat?.grapple
      ?.active &&
    combat?.grapple
      ?.controller ===
      'player'

  return [
    {
      id: 'punch',
      label: 'Soco',
      description:
        'Destreza + Briga · dificuldade 6 · dano Força.',
    },

    {
      id: 'kick',
      label: 'Chute',
      description:
        'Destreza + Briga · dificuldade 7 · dano Força + 1.',
    },

    {
      id: 'grapple',
      label:
        grappled
          ? 'Manter Agarrão'
          : 'Agarrar',

      description:
        'Força + Briga contra Força + Briga do alvo.',
    },

    {
      id: 'bite',
      label: 'Morder',
      description:
        grappled
          ? 'Usar os caninos contra o alvo imobilizado.'
          : 'É preciso controlar o alvo primeiro.',

      disabled:
        !grappled,
    },

    {
      id: 'dodge',
      label: 'Esquivar',
      description:
        'Destreza + Esquiva para reduzir os sucessos do ataque inimigo.',
    },

    {
      id: 'escape',
      label: 'Fugir',
      description:
        'Destreza + Esportes · dificuldade 6.',
    },
  ]
}