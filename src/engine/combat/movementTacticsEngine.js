import {
  getCombatDistance,
  getCombatDistanceLabel,
  moveCombatDistance,
} from './rangeEngine'

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

function getPlayerAttribute(
  game,
  key
) {
  return Math.max(
    0,
    safeNumber(
      game?.attributes
        ?.physical
        ?.[key],
      0
    )
  )
}

function getPlayerAbility(
  game,
  key
) {
  return Math.max(
    0,
    safeNumber(
      game?.abilities
        ?.[key] ??
      game?.abilities
        ?.talents
        ?.[key] ??
      game?.abilities
        ?.skills
        ?.[key],
      0
    )
  )
}

function getEnemyAttribute(
  combat,
  key
) {
  return Math.max(
    0,
    safeNumber(
      combat?.enemy
        ?.attributes
        ?.[key],
      0
    )
  )
}

function getEnemyAbility(
  combat,
  key
) {
  return Math.max(
    0,
    safeNumber(
      combat?.enemy
        ?.abilities
        ?.[key],
      0
    )
  )
}

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function rollPool(
  pool,
  difficulty = 6
) {
  const amount =
    Math.max(
      1,
      safeNumber(
        pool,
        1
      )
    )

  const dice =
    Array.from(
      {
        length:
          amount,
      },
      () => rollD10()
    )

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
  }

  const net =
    successes -
    ones

  return {
    dice,

    successes:
      Math.max(
        0,
        net
      ),

    botch:
      successes === 0 &&
      ones > 0,
  }
}

/*
  ========================================
  AGARRÃO
  ========================================
*/

export function isCombatantGrappled(
  combat,
  side
) {
  if (
    !combat?.grapple
      ?.active
  ) {
    return false
  }

  if (
    side === 'player'
  ) {
    return (
      combat.grapple
        .controller ===
      'enemy'
    )
  }

  if (
    side === 'enemy'
  ) {
    return (
      combat.grapple
        .controller ===
      'player'
    )
  }

  return false
}

export function canCombatantRetreat(
  combat,
  side
) {
  if (
    !combat ||
    combat.status !==
      'active'
  ) {
    return false
  }

  if (
    isCombatantGrappled(
      combat,
      side
    )
  ) {
    return false
  }

  return (
    getCombatDistance(
      combat
    ) !==
    'far'
  )
}

/*
  ========================================
  MOVIMENTO SIMPLES

  close → medium
  medium → far

  ou o inverso.
  ========================================
*/

export function moveCloser(
  combat
) {
  const before =
    getCombatDistance(
      combat
    )

  const updatedCombat =
    moveCombatDistance(
      combat,
      'closer'
    )

  const after =
    getCombatDistance(
      updatedCombat
    )

  return {
    combat:
      updatedCombat,

    changed:
      before !== after,

    from:
      before,

    to:
      after,
  }
}

export function moveFarther(
  combat
) {
  const before =
    getCombatDistance(
      combat
    )

  const updatedCombat =
    moveCombatDistance(
      combat,
      'farther'
    )

  const after =
    getCombatDistance(
      updatedCombat
    )

  return {
    combat:
      updatedCombat,

    changed:
      before !== after,

    from:
      before,

    to:
      after,
  }
}

/*
  ========================================
  PERSEGUIÇÃO

  Usado quando alguém tenta recuar de
  curta distância enquanto o adversário
  tenta impedir a separação.

  Destreza + Esportes.
  ========================================
*/

export function resolvePlayerRetreat(
  game,
  combat
) {
  if (
    !canCombatantRetreat(
      combat,
      'player'
    )
  ) {
    return {
      success: false,

      game,

      combat,

      log: [
        {
          type:
            'movement',

          text:
            combat?.grapple
              ?.active
              ? 'Você não consegue recuar enquanto está agarrado.'
              : 'Você não pode aumentar mais a distância.',
        },
      ],
    }
  }

  const distance =
    getCombatDistance(
      combat
    )

  /*
    Em média distância não há oposição
    física imediata: o recuo é automático.
  */

  if (
    distance !==
    'close'
  ) {
    const movement =
      moveFarther(
        combat
      )

    return {
      success:
        movement.changed,

      game,

      combat:
        movement.combat,

      log: [
        {
          type:
            'movement',

          text:
            `Você recua: ${getCombatDistanceLabel(
              movement.from
            )} → ${getCombatDistanceLabel(
              movement.to
            )}.`,
        },
      ],
    }
  }

  const playerPool =
    getPlayerAttribute(
      game,
      'dexterity'
    ) +
    getPlayerAbility(
      game,
      'athletics'
    )

  const enemyPool =
    getEnemyAttribute(
      combat,
      'dexterity'
    ) +
    getEnemyAbility(
      combat,
      'athletics'
    )

  const playerRoll =
    rollPool(
      playerPool,
      6
    )

  const enemyRoll =
    rollPool(
      enemyPool,
      6
    )

  const escaped =
    playerRoll.successes >
    enemyRoll.successes

  if (!escaped) {
    return {
      success: false,

      game,

      combat,

      log: [
        {
          type:
            'movement',

          text:
            `${combat.enemy.name} acompanha seu movimento e impede que você abra distância.`,
        },

        {
          type:
            'dice',

          text:
            `Recuo: você ${playerRoll.successes} sucesso(s) · ${combat.enemy.name} ${enemyRoll.successes}.`,
        },
      ],
    }
  }

  const movement =
    moveFarther(
      combat
    )

  return {
    success: true,

    game,

    combat:
      movement.combat,

    log: [
      {
        type:
          'movement',

        text:
          `Você consegue se afastar de ${combat.enemy.name}.`,
      },

      {
        type:
          'dice',

        text:
          `Recuo: você ${playerRoll.successes} sucesso(s) · ${combat.enemy.name} ${enemyRoll.successes}.`,
      },

      {
        type:
          'movement',

        text:
          `Distância: ${getCombatDistanceLabel(
            movement.from
          )} → ${getCombatDistanceLabel(
            movement.to
          )}.`,
      },
    ],
  }
}

export function resolveEnemyRetreat(
  game,
  combat
) {
  if (
    !canCombatantRetreat(
      combat,
      'enemy'
    )
  ) {
    return {
      success: false,

      game,

      combat,

      log: [
        {
          type:
            'movement',

          text:
            combat?.grapple
              ?.active
              ? `${combat.enemy.name} não consegue recuar enquanto está agarrado.`
              : `${combat.enemy.name} já está na maior distância possível.`,
        },
      ],
    }
  }

  const distance =
    getCombatDistance(
      combat
    )

  if (
    distance !==
    'close'
  ) {
    const movement =
      moveFarther(
        combat
      )

    return {
      success:
        movement.changed,

      game,

      combat:
        movement.combat,

      log: [
        {
          type:
            'movement',

          text:
            `${combat.enemy.name} recua: ${getCombatDistanceLabel(
              movement.from
            )} → ${getCombatDistanceLabel(
              movement.to
            )}.`,
        },
      ],
    }
  }

  const enemyPool =
    getEnemyAttribute(
      combat,
      'dexterity'
    ) +
    getEnemyAbility(
      combat,
      'athletics'
    )

  const playerPool =
    getPlayerAttribute(
      game,
      'dexterity'
    ) +
    getPlayerAbility(
      game,
      'athletics'
    )

  const enemyRoll =
    rollPool(
      enemyPool,
      6
    )

  const playerRoll =
    rollPool(
      playerPool,
      6
    )

  const escaped =
    enemyRoll.successes >
    playerRoll.successes

  if (!escaped) {
    return {
      success: false,

      game,

      combat,

      log: [
        {
          type:
            'movement',

          text:
            `Você acompanha ${combat.enemy.name} e impede que ele abra distância.`,
        },

        {
          type:
            'dice',

          text:
            `Recuo inimigo: ${combat.enemy.name} ${enemyRoll.successes} sucesso(s) · você ${playerRoll.successes}.`,
        },
      ],
    }
  }

  const movement =
    moveFarther(
      combat
    )

  return {
    success: true,

    game,

    combat:
      movement.combat,

    log: [
      {
        type:
          'movement',

        text:
          `${combat.enemy.name} consegue abrir distância.`,
      },

      {
        type:
          'dice',

        text:
          `Recuo inimigo: ${combat.enemy.name} ${enemyRoll.successes} sucesso(s) · você ${playerRoll.successes}.`,
      },

      {
        type:
          'movement',

        text:
          `Distância: ${getCombatDistanceLabel(
            movement.from
          )} → ${getCombatDistanceLabel(
            movement.to
          )}.`,
      },
    ],
  }
}

/*
  ========================================
  PREFERÊNCIA DE DISTÂNCIA DA IA
  ========================================
*/

export function getEnemyPreferredDistance(
  combat
) {
  const enemy =
    combat?.enemy

  if (!enemy) {
    return 'close'
  }

  const personality =
    enemy.combatPersonality ??
    'balanced'

  if (
    personality ===
    'ranged'
  ) {
    return 'far'
  }

  if (
    personality ===
    'predator' ||
    personality ===
    'aggressive'
  ) {
    return 'close'
  }

  const weaponId =
    enemy.weaponId ??
    'fists'

  const firearm =
    ![
      'fists',
      'kick',
      'bite',
      'knife',
      'baseball_bat',
    ].includes(
      weaponId
    )

  if (firearm) {
    return 'medium'
  }

  return 'close'
}

export function shouldEnemyAdvance(
  combat
) {
  const current =
    getCombatDistance(
      combat
    )

  const preferred =
    getEnemyPreferredDistance(
      combat
    )

  const order = {
    close: 0,
    medium: 1,
    far: 2,
  }

  return (
    order[current] >
    order[preferred]
  )
}

export function shouldEnemyRetreat(
  combat
) {
  const current =
    getCombatDistance(
      combat
    )

  const preferred =
    getEnemyPreferredDistance(
      combat
    )

  const order = {
    close: 0,
    medium: 1,
    far: 2,
  }

  return (
    order[current] <
    order[preferred]
  )
}

/*
  ========================================
  PONTUAÇÃO PARA IA
  ========================================
*/

export function getEnemyMovementScores(
  combat
) {
  if (
    !combat ||
    combat.status !==
      'active'
  ) {
    return {
      advance: 0,
      retreat: 0,
    }
  }

  let advance = 0
  let retreat = 0

  const current =
    getCombatDistance(
      combat
    )

  const preferred =
    getEnemyPreferredDistance(
      combat
    )

  const personality =
    combat.enemy
      ?.combatPersonality ??
    'balanced'

  if (
    shouldEnemyAdvance(
      combat
    )
  ) {
    advance += 45
  }

  if (
    shouldEnemyRetreat(
      combat
    )
  ) {
    retreat += 45
  }

  if (
    personality ===
    'ranged'
  ) {
    if (
      current ===
      'close'
    ) {
      retreat += 40
    }

    if (
      current ===
      'medium'
    ) {
      retreat += 15
    }
  }

  if (
    personality ===
    'predator'
  ) {
    if (
      current !==
      'close'
    ) {
      advance += 35
    }

    retreat -= 25
  }

  if (
    personality ===
    'aggressive'
  ) {
    if (
      current !==
      'close'
    ) {
      advance += 25
    }

    retreat -= 20
  }

  if (
    personality ===
    'coward'
  ) {
    retreat += 30
  }

  if (
    combat?.grapple
      ?.active
  ) {
    retreat = 0
  }

  return {
    current,

    preferred,

    advance:
      Math.max(
        0,
        advance
      ),

    retreat:
      Math.max(
        0,
        retreat
      ),
  }
}

export function getMovementDebug(
  combat
) {
  const scores =
    getEnemyMovementScores(
      combat
    )

  return {
    distance:
      getCombatDistance(
        combat
      ),

    preferredDistance:
      getEnemyPreferredDistance(
        combat
      ),

    shouldAdvance:
      shouldEnemyAdvance(
        combat
      ),

    shouldRetreat:
      shouldEnemyRetreat(
        combat
      ),

    canEnemyRetreat:
      canCombatantRetreat(
        combat,
        'enemy'
      ),

    canPlayerRetreat:
      canCombatantRetreat(
        combat,
        'player'
      ),

    scores,
  }
}

export default {
  isCombatantGrappled,
  canCombatantRetreat,

  moveCloser,
  moveFarther,

  resolvePlayerRetreat,
  resolveEnemyRetreat,

  getEnemyPreferredDistance,
  shouldEnemyAdvance,
  shouldEnemyRetreat,

  getEnemyMovementScores,
  getMovementDebug,
}