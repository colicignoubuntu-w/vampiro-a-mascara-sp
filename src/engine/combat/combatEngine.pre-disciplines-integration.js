import {
  rollDicePool,
} from '../dice/rollTest'

import {
  getArmor,
  getWeapon,
} from '../../data/items'

import {
  addDamage,
  convertDamageForTarget,
  getDamageSlots,
  getSoakPool,
  getTotalDamage,
  isIncapacitated,
  normalizeHealth,
} from './damageEngine'

const HEALTH_LEVELS = [
  {
    id: 'healthy',
    label: 'Saudável',
    penalty: 0,
  },

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

function safeNumber(
  value,
  fallback = 0
) {
  const result =
    Number(value)

  return Number.isNaN(
    result
  )
    ? fallback
    : result
}

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function getPlayerArmor(
  game
) {
  return getArmor(
    game?.equipment
      ?.armor ??
      'none'
  )
}

function getPlayerWeapon(
  game
) {
  return getWeapon(
    game?.equipment
      ?.weapon ??
      'fists'
  ) ?? getWeapon('fists')
}

function getEnemyArmor(
  combat
) {
  return getArmor(
    combat?.enemy
      ?.armorId ??
      'none'
  )
}

function getEnemyWeapon(
  combat
) {
  return getWeapon(
    combat?.enemy
      ?.weaponId ??
      'fists'
  ) ?? getWeapon('fists')
}

function getPhysicalBoost(
  game,
  key
) {
  return safeNumber(
    game?.combatBoosts
      ?.[key],
    0
  )
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
    group === 'physical'
      ? getPhysicalBoost(
          game,
          key
        )
      : 0

  let value =
    base + boost

  /*
    Armadura pesada reduz Destreza.
  */

  if (
    group === 'physical' &&
    key === 'dexterity'
  ) {
    const armor =
      getPlayerArmor(
        game
      )

    value -=
      safeNumber(
        armor
          ?.dexterityPenalty,
        0
      )
  }

  return Math.max(
    0,
    value
  )
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

function getEnemyAttribute(
  combat,
  key
) {
  let value =
    safeNumber(
      combat?.enemy
        ?.attributes
        ?.[key],
      0
    )

  if (
    key === 'dexterity'
  ) {
    const armor =
      getEnemyArmor(
        combat
      )

    value -=
      safeNumber(
        armor
          ?.dexterityPenalty,
        0
      )
  }

  return Math.max(
    0,
    value
  )
}

function getEnemyAbility(
  combat,
  key
) {
  return safeNumber(
    combat?.enemy
      ?.abilities
      ?.[key],
    0
  )
}

export function getHealthInfo(
  healthOrDamage
) {
  let damage = 0

  if (
    typeof healthOrDamage ===
    'number'
  ) {
    damage =
      healthOrDamage
  } else {
    damage =
      getTotalDamage(
        healthOrDamage
      )
  }

  const safeDamage =
    Math.max(
      0,
      damage
    )

  if (
    safeDamage <= 0
  ) {
    return {
      damage: 0,

      label:
        'Saudável',

      penalty: 0,

      incapacitated:
        false,
    }
  }

  const index =
    Math.min(
      safeDamage,
      7
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
      safeDamage >= 7,
  }
}

export function getPlayerHealthPenalty(
  game
) {
  const health =
    normalizeHealth(
      game?.health
    )

  const info =
    getHealthInfo(
      health
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

function createEnemyHealth(
  maximum = 7
) {
  return {
    bashing: 0,

    lethal: 0,

    aggravated: 0,

    currentLevel: 0,

    maximum:
      safeNumber(
        maximum,
        7
      ),
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
    Math.max(
      0,
      safeNumber(
        encounter.enemy
          ?.attributes
          ?.dexterity,
        2
      ) -
        safeNumber(
          getArmor(
            encounter.enemy
              ?.armorId ??
              'none'
          )
            ?.dexterityPenalty,
          0
        )
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

    endingReason:
      null,

    playerInitiative,

    enemyInitiative,

    playerActsFirst:
      playerInitiative.total >=
      enemyInitiative.total,

    grapple: {
      active: false,

      controller:
        null,
    },

    enemy: {
      id:
        encounter.enemy.id,

      name:
        encounter.enemy.name,

      type:
        encounter.enemy.type ??
        'human',

      armorId:
        encounter.enemy
          ?.armorId ??
        'none',

      weaponId:
        encounter.enemy
          ?.weaponId ??
        'fists',

      status: {
        staked: false,

        paralyzed: false,
      },

      attributes: {
        dexterity:
          safeNumber(
            encounter.enemy
              ?.attributes
              ?.dexterity,
            2
          ),

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

        melee:
          safeNumber(
            encounter.enemy
              ?.abilities
              ?.melee,
            encounter.enemy
              ?.abilities
              ?.brawl ??
              2
          ),

        firearms:
          safeNumber(
            encounter.enemy
              ?.abilities
              ?.firearms,
            0
          ),
      },

      health:
        createEnemyHealth(
          encounter.enemy
            ?.health ??
            7
        ),
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

function rollDamage({
  damagePool,
  soakPool,
}) {
  const damageRoll =
    rollDicePool({
      pool:
        Math.max(
          1,
          damagePool
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

          result:
            'failure',
        }

  const damageSuccesses =
    damageRoll.result ===
    'success'
      ? damageRoll.successes
      : 0

  const soakSuccesses =
    soakRoll.result ===
    'success'
      ? soakRoll.successes
      : 0

  return {
    damageRoll,

    soakRoll,

    damageSuccesses,

    soakSuccesses,

    inflicted:
      Math.max(
        0,
        damageSuccesses -
          soakSuccesses
      ),
  }
}

function getWeaponDamagePool({
  weapon,
  strength,
  attackSuccesses,
}) {
  const extraSuccesses =
    Math.max(
      0,
      attackSuccesses - 1
    )

  if (
    weapon.damageMode ===
    'fixed'
  ) {
    return Math.max(
      1,
      safeNumber(
        weapon.damagePool,
        1
      ) +
        extraSuccesses
    )
  }

  return Math.max(
    1,
    strength +
      safeNumber(
        weapon.damageBonus,
        0
      ) +
      extraSuccesses
  )
}

function getPlayerAmmo(
  game,
  weapon
) {
  if (
    weapon.category !==
    'firearm'
  ) {
    return null
  }

  const stored =
    game?.weaponState
      ?.[weapon.id]
      ?.ammo

  if (
    typeof stored ===
    'number'
  ) {
    return stored
  }

  return (
    weapon.ammunition
      ?.current ??
    weapon.ammunition
      ?.magazine ??
    0
  )
}

function consumePlayerAmmo(
  game,
  weapon
) {
  if (
    weapon.category !==
    'firearm'
  ) {
    return game
  }

  const current =
    getPlayerAmmo(
      game,
      weapon
    )

  return {
    ...game,

    weaponState: {
      ...(game.weaponState ??
        {}),

      [weapon.id]: {
        ...(game.weaponState
          ?.[weapon.id] ??
          {}),

        ammo:
          Math.max(
            0,
            current - 1
          ),
      },
    },
  }
}

function performPlayerWeaponAttack(
  game,
  combat
) {
  const weapon =
    getPlayerWeapon(
      game
    )

  const currentAmmo =
    getPlayerAmmo(
      game,
      weapon
    )

  if (
    weapon.category ===
      'firearm' &&
    currentAmmo <= 0
  ) {
    return {
      game,

      combat,

      log: [
        {
          type:
            'empty',

          text:
            `${weapon.name}: sem munição no carregador.`,
        },
      ],
    }
  }

  const dexterity =
    getPlayerAttribute(
      game,
      'physical',
      weapon.attackAttribute ??
        'dexterity'
    )

  const ability =
    getPlayerAbility(
      game,
      weapon.attackAbility ??
        'brawl'
    )

  const healthPenalty =
    getPlayerHealthPenalty(
      game
    )

  let difficulty =
    safeNumber(
      weapon.difficulty,
      6
    )

  /*
    Estaca contra coração.
  */

  if (
    weapon.stakeRules
      ?.enabled &&
    combat.enemy.type ===
      'vampire'
  ) {
    difficulty =
      weapon.stakeRules
        .heartDifficulty ??
      9
  }

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

      difficulty,
    })

  let updatedGame =
    consumePlayerAmmo(
      game,
      weapon
    )

  const log = [
    {
      type:
        'player-attack',

      text:
        `${weapon.name}: ${attackPool} dados, dificuldade ${difficulty}.`,
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
          ? `Falha crítica usando ${weapon.name}.`
          : 'O ataque não acerta.',
    })

    return {
      game:
        updatedGame,

      combat,

      log,
    }
  }

  /*
    ESTACA.

    Se acertar o coração com sucessos
    suficientes contra um vampiro,
    ele é paralisado.
  */

  if (
    weapon.stakeRules
      ?.enabled &&
    combat.enemy.type ===
      'vampire' &&
    attackRoll.successes >=
      (
        weapon.stakeRules
          .requiredAttackSuccesses ??
        3
      )
  ) {
    const updatedCombat = {
      ...combat,

      status:
        'finished',

      winner:
        'player',

      endingReason:
        'staked',

      enemy: {
        ...combat.enemy,

        status: {
          ...(combat.enemy
            .status ?? {}),

          staked: true,

          paralyzed: true,
        },
      },
    }

    log.push({
      type:
        'stake',

      text:
        `A estaca atravessa o peito de ${combat.enemy.name} e atinge o coração.`,
    })

    log.push({
      type:
        'victory',

      text:
        `${combat.enemy.name} fica completamente paralisado.`,
    })

    return {
      game:
        updatedGame,

      combat:
        updatedCombat,

      log,
    }
  }

  const strength =
    getPlayerAttribute(
      game,
      'physical',
      'strength'
    )

  const damagePool =
    getWeaponDamagePool({
      weapon,

      strength,

      attackSuccesses:
        attackRoll.successes,
    })

  const actualDamageType =
    convertDamageForTarget({
      targetType:
        combat.enemy.type,

      damageType:
        weapon.damageType,

      sourceType:
        weapon.sourceType,
    })

  const soak =
    getSoakPool({
      targetType:
        combat.enemy.type,

      stamina:
        combat.enemy
          .attributes
          .stamina,

      armorId:
        combat.enemy
          .armorId,

      damageType:
        actualDamageType,

      sourceType:
        weapon.sourceType,
    })

  const damage =
    rollDamage({
      damagePool,

      soakPool:
        soak.total,
    })

  let enemyHealth =
    combat.enemy.health

  if (
    damage.inflicted > 0
  ) {
    enemyHealth =
      addDamage({
        health:
          enemyHealth,

        damageType:
          actualDamageType,

        amount:
          damage.inflicted,
      })
  }

  const totalEnemyDamage =
    getTotalDamage(
      enemyHealth
    )

  const defeated =
    totalEnemyDamage >=
    (
      combat.enemy
        .health
        .maximum ??
      7
    )

  const updatedCombat = {
    ...combat,

    enemy: {
      ...combat.enemy,

      health: {
        ...enemyHealth,

        maximum:
          combat.enemy
            .health
            .maximum ??
          7,
      },
    },

    ...(defeated
      ? {
          status:
            'finished',

          winner:
            'player',

          endingReason:
            'incapacitated',
        }
      : {}),
  }

  log.push({
    type:
      'damage',

    text:
      `Dano ${actualDamageType}: ${damage.damageSuccesses} sucesso(s).`,
  })

  log.push({
    type:
      'soak',

    text:
      `${combat.enemy.name} absorve ${damage.soakSuccesses} sucesso(s) (${soak.total} dados de absorção).`,
  })

  if (
    damage.inflicted > 0
  ) {
    log.push({
      type:
        actualDamageType ===
        'aggravated'
          ? 'aggravated'
          : actualDamageType ===
              'lethal'
            ? 'lethal'
            : 'bashing',

      text:
        `${combat.enemy.name} sofre ${damage.inflicted} nível(is) de dano.`,
    })
  } else {
    log.push({
      type:
        'soaked',

      text:
        `${combat.enemy.name} absorve todo o dano.`,
    })
  }

  if (
    defeated
  ) {
    log.push({
      type:
        'victory',

      text:
        `${combat.enemy.name} não consegue continuar lutando.`,
    })
  }

  return {
    game:
      updatedGame,

    combat:
      updatedCombat,

    log,
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

  const weapon =
    getEnemyWeapon(
      combat
    )

  const dexterity =
    getEnemyAttribute(
      combat,
      'dexterity'
    )

  const ability =
    getEnemyAbility(
      combat,
      weapon.attackAbility ??
        'brawl'
    )

  const attackPool =
    Math.max(
      1,
      dexterity +
        ability
    )

  const attackRoll =
    rollDicePool({
      pool:
        attackPool,

      difficulty:
        weapon.difficulty ??
        6,
    })

  const log = [
    {
      type:
        'enemy-attack',

      text:
        `${enemy.name} ataca com ${weapon.name}.`,
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
        'O ataque não atinge você.',
    })

    return {
      game,

      combat,

      log,
    }
  }

  const strength =
    enemy.attributes
      .strength

  const damagePool =
    getWeaponDamagePool({
      weapon,

      strength,

      attackSuccesses:
        netSuccesses,
    })

  /*
    O jogador é vampiro.
  */

  const actualDamageType =
    convertDamageForTarget({
      targetType:
        'vampire',

      damageType:
        weapon.damageType,

      sourceType:
        weapon.sourceType,
    })

  const stamina =
    getPlayerAttribute(
      game,
      'physical',
      'stamina'
    )

  const armorId =
    game?.equipment
      ?.armor ??
    'none'

  const soak =
    getSoakPool({
      targetType:
        'vampire',

      stamina,

      armorId,

      damageType:
        actualDamageType,

      sourceType:
        weapon.sourceType,
    })

  const damage =
    rollDamage({
      damagePool,

      soakPool:
        soak.total,
    })

  if (
    damage.inflicted <= 0
  ) {
    log.push({
      type:
        'soaked',

      text:
        `Você absorve todo o dano com ${soak.total} dado(s).`,
    })

    return {
      game,

      combat,

      log,
    }
  }

  const currentHealth =
    normalizeHealth(
      game.health
    )

  const updatedHealth =
    addDamage({
      health:
        currentHealth,

      damageType:
        actualDamageType,

      amount:
        damage.inflicted,
    })

  const updatedGame = {
    ...game,

    health:
      updatedHealth,
  }

  let updatedCombat =
    combat

  log.push({
    type:
      actualDamageType ===
      'aggravated'
        ? 'aggravated'
        : actualDamageType ===
            'lethal'
          ? 'lethal'
          : 'bashing',

    text:
      `Você sofre ${damage.inflicted} nível(is) de dano ${actualDamageType}.`,
  })

  /*
    Mostra a armadura utilizada.
  */

  if (
    soak.armor &&
    soak.armor.id !==
      'none'
  ) {
    log.push({
      type:
        'armor',

      text:
        `${soak.armor.name}: ${soak.armorSoak} dado(s) de proteção.`,
    })
  }

  if (
    isIncapacitated(
      updatedHealth
    )
  ) {
    updatedCombat = {
      ...combat,

      status:
        'finished',

      winner:
        'enemy',

      endingReason:
        'incapacitated',
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
      updatedGame,

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

  const pool =
    Math.max(
      1,
      dexterity +
        athletics +
        healthPenalty
    )

  const roll =
    rollDicePool({
      pool,

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

        endingReason:
          'escaped',
      },

      success: true,

      log: [
        {
          type:
            'escape-success',

          text:
            'Você consegue fugir do combate.',
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
          combat.enemy
            .attributes
            .strength +
            combat.enemy
              .abilities
              .brawl
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

  if (
    playerSuccesses >
    enemySuccesses
  ) {
    return {
      combat: {
        ...combat,

        grapple: {
          active: true,

          controller:
            'player',
        },
      },

      log: [
        {
          type:
            'grapple',

          text:
            `Você imobiliza ${combat.enemy.name}.`,
        },
      ],
    }
  }

  return {
    combat,

    log: [
      {
        type:
          'grapple-failure',

        text:
          `${combat.enemy.name} consegue impedir o agarrão.`,
      },
    ],
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
            'Você precisa controlar o alvo antes de usar a mordida em combate.',
        },
      ],
    }
  }

  const weapon =
    getWeapon(
      'vampireBite'
    )

  const strength =
    getPlayerAttribute(
      game,
      'physical',
      'strength'
    )

  const damagePool =
    Math.max(
      1,
      strength +
        safeNumber(
          weapon.damageBonus,
          1
        )
    )

  const damageType =
    weapon.damageType

  const soak =
    getSoakPool({
      targetType:
        combat.enemy.type,

      stamina:
        combat.enemy
          .attributes
          .stamina,

      armorId:
        combat.enemy
          .armorId,

      damageType,

      sourceType:
        weapon.sourceType,
    })

  const damage =
    rollDamage({
      damagePool,

      soakPool:
        soak.total,
    })

  /*
    Mordida causa no mínimo um nível
    quando já existe agarrão bem sucedido.
  */

  const inflicted =
    Math.max(
      1,
      damage.inflicted
    )

  const enemyHealth =
    addDamage({
      health:
        combat.enemy
          .health,

      damageType:
        'aggravated',

      amount:
        inflicted,
    })

  const defeated =
    getTotalDamage(
      enemyHealth
    ) >=
    combat.enemy
      .health
      .maximum

  return {
    game,

    combat: {
      ...combat,

      enemy: {
        ...combat.enemy,

        health: {
          ...enemyHealth,

          maximum:
            combat.enemy
              .health
              .maximum,
        },
      },

      ...(defeated
        ? {
            status:
              'finished',

            winner:
              'player',

            endingReason:
              'bite',
          }
        : {}),
    },

    log: [
      {
        type:
          'aggravated',

        text:
          `Você crava os caninos em ${combat.enemy.name}: ${inflicted} dano agravado.`,
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
    'weaponAttack'
  ) {
    const result =
      performPlayerWeaponAttack(
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

      dodgeSuccesses: 0,

      skipEnemyAttack:
        result.combat
          .status !==
        'active',
    }
  }

  if (
    actionId ===
    'kick'
  ) {
    const originalWeapon =
      game?.equipment
        ?.weapon

    const temporaryGame = {
      ...game,

      equipment: {
        ...(game.equipment ??
          {}),

        weapon:
          'kick',
      },
    }

    const result =
      performPlayerWeaponAttack(
        temporaryGame,
        combat
      )

    return {
      game: {
        ...result.game,

        equipment: {
          ...(result.game
            .equipment ?? {}),

          weapon:
            originalWeapon ??
            'fists',
        },
      },

      combat:
        result.combat,

      log:
        result.log,

      dodgeSuccesses: 0,

      skipEnemyAttack:
        result.combat
          .status !==
        'active',
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

      dodgeSuccesses: 0,

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

      dodgeSuccesses: 0,

      skipEnemyAttack:
        result.combat
          .status !==
        'active',
    }
  }

  if (
    actionId ===
    'dodge'
  ) {
    const result =
      performDodge(
        game
      )

    return {
      game,

      combat,

      log:
        result.log,

      dodgeSuccesses:
        result.successes,

      skipEnemyAttack:
        false,
    }
  }

  if (
    actionId ===
    'escape'
  ) {
    const result =
      performEscape(
        game,
        combat
      )

    return {
      game,

      combat:
        result.combat,

      log:
        result.log,

      dodgeSuccesses: 0,

      skipEnemyAttack:
        result.success,
    }
  }

  return {
    game,

    combat,

    log: [],

    dodgeSuccesses: 0,

    skipEnemyAttack:
      false,
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
    INIMIGO GANHOU A INICIATIVA.
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
            ...(combat.log ??
              []),

            ...roundLog,
          ],
        },
      }
    }
  }

  /*
    AÇÃO DO JOGADOR.
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
          ...(combat.log ??
            []),

          ...roundLog,
        ],
      },
    }
  }

  /*
    JOGADOR GANHOU A INICIATIVA:
    inimigo age depois.
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
    NOVA INICIATIVA.
  */

  if (
    updatedCombat.status ===
    'active'
  ) {
    const playerInitiative =
      rollInitiative(
        getPlayerAttribute(
          updatedGame,
          'physical',
          'dexterity'
        ),

        getPlayerAttribute(
          updatedGame,
          'mental',
          'wits'
        )
      )

    const enemyInitiative =
      rollInitiative(
        getEnemyAttribute(
          updatedCombat,
          'dexterity'
        ),

        getEnemyAttribute(
          updatedCombat,
          'wits'
        )
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

  return {
    game:
      updatedGame,

    combat: {
      ...updatedCombat,

      log: [
        ...(combat.log ??
          []),

        ...roundLog,
      ],
    },
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

  const blood =
    game?.blood
      ?.current ?? 0

  if (
    blood <= 0
  ) {
    return {
      success: false,

      game,
    }
  }

  const currentBoost =
    game?.combatBoosts
      ?.[attribute] ??
    0

  return {
    success: true,

    game: {
      ...game,

      blood: {
        ...(game.blood ??
          {}),

        current:
          blood - 1,
      },

      combatBoosts: {
        ...(game.combatBoosts ??
          {}),

        [attribute]:
          currentBoost + 1,
      },

      history: [
        ...(game.history ??
          []),

        {
          type:
            'blood-physical-boost',

          attribute,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    },
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
  game,
  combat
) {
  const weapon =
    getPlayerWeapon(
      game
    )

  const grappled =
    combat?.grapple
      ?.active &&
    combat?.grapple
      ?.controller ===
      'player'

  const ammo =
    getPlayerAmmo(
      game,
      weapon
    )

  return [
    {
      id:
        'weaponAttack',

      label:
        weapon.name,

      description:
        weapon.category ===
        'firearm'
          ? `${weapon.damageType} · munição ${ammo}/${weapon.ammunition?.magazine ?? 0}`
          : `${weapon.damageType} · ${weapon.attackAbility}`,

      disabled:
        weapon.category ===
          'firearm' &&
        ammo <= 0,
    },

    {
      id:
        'kick',

      label:
        'Chute',

      description:
        'Destreza + Briga · contusão · Força + 1.',
    },

    {
      id:
        'grapple',

      label:
        grappled
          ? 'Manter Agarrão'
          : 'Agarrar',

      description:
        'Força + Briga contra o alvo.',
    },

    {
      id:
        'bite',

      label:
        'Mordida',

      description:
        grappled
          ? 'Ataque vampírico agravado.'
          : 'Você precisa controlar o alvo primeiro.',

      disabled:
        !grappled,
    },

    {
      id:
        'dodge',

      label:
        'Esquivar',

      description:
        'Destreza + Esquiva.',
    },

    {
      id:
        'escape',

      label:
        'Fugir',

      description:
        'Destreza + Esportes.',
    },
  ]
}

export function getCombatHealthSlots(
  health
) {
  return getDamageSlots(
    health,
    7
  )
}