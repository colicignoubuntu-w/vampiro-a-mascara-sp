const DISTANCE_ORDER = {
  close: 0,
  medium: 1,
  far: 2,
}

const DISTANCE_LABELS = {
  close:
    'Curta',

  medium:
    'Média',

  far:
    'Longa',
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

export function normalizeCombatDistance(
  value
) {
  if (
    value === 'close' ||
    value === 'medium' ||
    value === 'far'
  ) {
    return value
  }

  return 'close'
}

export function getCombatDistance(
  combat
) {
  return normalizeCombatDistance(
    combat?.distance ??
    combat?.environment
      ?.distance ??
    'close'
  )
}

export function getCombatDistanceLabel(
  combatOrDistance
) {
  const distance =
    typeof combatOrDistance ===
      'string'
      ? normalizeCombatDistance(
          combatOrDistance
        )
      : getCombatDistance(
          combatOrDistance
        )

  return (
    DISTANCE_LABELS[
      distance
    ] ??
    distance
  )
}

export function setCombatDistance(
  combat,
  distance
) {
  if (!combat) {
    return combat
  }

  const normalized =
    normalizeCombatDistance(
      distance
    )

  return {
    ...combat,

    distance:
      normalized,

    environment: {
      ...(combat.environment ??
        {}),

      distance:
        normalized,
    },
  }
}

export function moveCombatDistance(
  combat,
  direction
) {
  if (!combat) {
    return combat
  }

  const current =
    getCombatDistance(
      combat
    )

  const currentIndex =
    DISTANCE_ORDER[
      current
    ]

  let nextIndex =
    currentIndex

  if (
    direction ===
    'closer'
  ) {
    nextIndex =
      Math.max(
        0,
        currentIndex - 1
      )
  }

  if (
    direction ===
    'farther'
  ) {
    nextIndex =
      Math.min(
        2,
        currentIndex + 1
      )
  }

  const nextDistance =
    Object.keys(
      DISTANCE_ORDER
    ).find(
      (key) =>
        DISTANCE_ORDER[
          key
        ] ===
        nextIndex
    ) ??
    current

  return setCombatDistance(
    combat,
    nextDistance
  )
}

export function canMoveCloser(
  combat
) {
  return (
    getCombatDistance(
      combat
    ) !==
    'close'
  )
}

export function canMoveFarther(
  combat
) {
  return (
    getCombatDistance(
      combat
    ) !==
    'far'
  )
}

/*
  ========================================
  CLASSIFICAÇÃO DAS ARMAS
  ========================================
*/

export function getWeaponRangeCategory(
  weapon
) {
  if (!weapon) {
    return 'melee'
  }

  if (
    weapon.category ===
    'firearm'
  ) {
    return 'firearm'
  }

  if (
    weapon.category ===
    'thrown'
  ) {
    return 'thrown'
  }

  if (
    weapon.id ===
      'bite' ||
    weapon.id ===
      'feralClaws' ||
    weapon.category ===
      'natural'
  ) {
    return 'natural'
  }

  return 'melee'
}

/*
  ========================================
  ALCANCE

  Corpo a corpo:
  apenas curta distância.

  Arremesso:
  curta ou média.

  Armas de fogo:
  curta, média e longa.
  ========================================
*/

export function canWeaponAttackAtDistance({
  weapon,
  combat,
  distance,
}) {
  const currentDistance =
    distance ??
    getCombatDistance(
      combat
    )

  const category =
    getWeaponRangeCategory(
      weapon
    )

  if (
    category ===
      'firearm'
  ) {
    return true
  }

  if (
    category ===
      'thrown'
  ) {
    return (
      currentDistance ===
        'close' ||
      currentDistance ===
        'medium'
    )
  }

  return (
    currentDistance ===
    'close'
  )
}

/*
  ========================================
  DIFICULDADE POR DISTÂNCIA

  Valor retornado é MODIFICADOR, não a
  dificuldade final.

  Exemplo:

  arma dificuldade base 6

  pistola média
  +0

  pistola longa
  +2

  = dificuldade 8
  ========================================
*/

export function getWeaponRangeDifficultyModifier({
  weapon,
  combat,
  distance,
}) {
  const currentDistance =
    distance ??
    getCombatDistance(
      combat
    )

  const category =
    getWeaponRangeCategory(
      weapon
    )

  if (
    category ===
    'firearm'
  ) {
    if (
      currentDistance ===
      'close'
    ) {
      /*
        Muito perto facilita atingir,
        mas pode haver outras penalidades
        posteriormente por agarrão etc.
      */

      return -1
    }

    if (
      currentDistance ===
      'medium'
    ) {
      return 0
    }

    return 2
  }

  if (
    category ===
      'thrown'
  ) {
    if (
      currentDistance ===
      'close'
    ) {
      return 0
    }

    if (
      currentDistance ===
      'medium'
    ) {
      return 2
    }

    return 99
  }

  if (
    currentDistance !==
    'close'
  ) {
    return 99
  }

  return 0
}

export function getWeaponAttackDifficulty({
  weapon,
  combat,
  baseDifficulty,
}) {
  const base =
    Math.max(
      2,
      safeNumber(
        baseDifficulty ??
        weapon?.difficulty,
        6
      )
    )

  const modifier =
    getWeaponRangeDifficultyModifier({
      weapon,
      combat,
    })

  if (
    modifier >= 99
  ) {
    return null
  }

  return Math.max(
    2,
    Math.min(
      10,
      base +
        modifier
    )
  )
}

/*
  ========================================
  AÇÕES FÍSICAS
  ========================================
*/

export function canGrappleAtDistance(
  combat
) {
  return (
    getCombatDistance(
      combat
    ) ===
    'close'
  )
}

export function canBiteAtDistance(
  combat
) {
  return (
    getCombatDistance(
      combat
    ) ===
    'close'
  )
}

export function canKickAtDistance(
  combat
) {
  return (
    getCombatDistance(
      combat
    ) ===
    'close'
  )
}

export function canUseMeleeAtDistance(
  combat
) {
  return (
    getCombatDistance(
      combat
    ) ===
    'close'
  )
}

/*
  ========================================
  ALTERAÇÃO DA DISTÂNCIA POR MOVIMENTO
  ========================================
*/

export function advanceTowardEnemy(
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
      before !==
      after,

    from:
      before,

    to:
      after,

    log: before ===
      after
      ? [
          {
            type:
              'movement',

            text:
              'Você já está em curta distância.',
          },
        ]
      : [
          {
            type:
              'movement',

            text:
              `Você avança: ${getCombatDistanceLabel(
                before
              )} → ${getCombatDistanceLabel(
                after
              )}.`,
          },
        ],
  }
}

export function retreatFromEnemy(
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
      before !==
      after,

    from:
      before,

    to:
      after,

    log: before ===
      after
      ? [
          {
            type:
              'movement',

            text:
              'Você já está na maior distância possível.',
          },
        ]
      : [
          {
            type:
              'movement',

            text:
              `Você recua: ${getCombatDistanceLabel(
                before
              )} → ${getCombatDistanceLabel(
                after
              )}.`,
          },
        ],
  }
}

/*
  ========================================
  DISTÂNCIA + AGARRÃO

  Se existe agarrão, ambos estão
  obrigatoriamente em curta distância.
  ========================================
*/

export function normalizeDistanceForGrapple(
  combat
) {
  if (
    !combat?.grapple
      ?.active
  ) {
    return combat
  }

  return setCombatDistance(
    combat,
    'close'
  )
}

/*
  ========================================
  RESUMO PARA UI / DEBUG
  ========================================
*/

export function getCombatRangeState(
  combat
) {
  const distance =
    getCombatDistance(
      combat
    )

  return {
    distance,

    label:
      getCombatDistanceLabel(
        distance
      ),

    canAdvance:
      canMoveCloser(
        combat
      ),

    canRetreat:
      canMoveFarther(
        combat
      ),

    meleeAvailable:
      canUseMeleeAtDistance(
        combat
      ),

    grappleAvailable:
      canGrappleAtDistance(
        combat
      ),

    biteAvailable:
      canBiteAtDistance(
        combat
      ),
  }
}

export default {
  normalizeCombatDistance,

  getCombatDistance,
  getCombatDistanceLabel,

  setCombatDistance,
  moveCombatDistance,

  canMoveCloser,
  canMoveFarther,

  getWeaponRangeCategory,

  canWeaponAttackAtDistance,
  getWeaponRangeDifficultyModifier,
  getWeaponAttackDifficulty,

  canGrappleAtDistance,
  canBiteAtDistance,
  canKickAtDistance,
  canUseMeleeAtDistance,

  advanceTowardEnemy,
  retreatFromEnemy,

  normalizeDistanceForGrapple,

  getCombatRangeState,
}