import {
  applyStatus,
} from '../status/statusEngine'

import {
  determineBloodEffects,
} from '../hunting/huntingEngine'

function worldToMinutes(world) {
  const night =
    Number(
      world?.night ?? 1
    )

  const hour =
    Number(
      world?.hour ?? 0
    )

  const minute =
    Number(
      world?.minute ?? 0
    )

  return (
    (night - 1) *
      24 *
      60 +
    hour * 60 +
    minute
  )
}

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  )
}

function getOverflowSeverity(
  amount
) {
  if (amount <= 0) {
    return 0
  }

  if (amount === 1) {
    return 1
  }

  if (amount === 2) {
    return 2
  }

  return 3
}

/* ==========================================
   ESTADO VISUAL
========================================== */

export function getBloodMessLabel(
  game
) {
  const body =
    game.appearance
      ?.bodyBlood ?? 0

  const clothes =
    game.appearance
      ?.clothesBlood ?? 0

  const severity =
    Math.max(
      body,
      clothes
    )

  if (severity <= 0) {
    return 'Limpo'
  }

  if (severity === 1) {
    return 'Pequenas manchas de sangue'
  }

  if (severity === 2) {
    return 'Visivelmente ensanguentado'
  }

  return 'Coberto de sangue'
}

export function getBloodMessSocialPenalty(
  game
) {
  const body =
    game.appearance
      ?.bodyBlood ?? 0

  const clothes =
    game.appearance
      ?.clothesBlood ?? 0

  const severity =
    Math.max(
      body,
      clothes
    )

  if (severity <= 0) {
    return 0
  }

  if (severity === 1) {
    return -1
  }

  if (severity === 2) {
    return -2
  }

  return -3
}

export function isVisiblyBloody(
  game
) {
  return (
    (
      game.appearance
        ?.bodyBlood ?? 0
    ) > 0 ||
    (
      game.appearance
        ?.clothesBlood ?? 0
    ) > 0
  )
}

/* ==========================================
   ESTADO DA VÍTIMA

   O bloodAvailable do perfil representa
   quanto sangue podemos tratar como
   acessível naquela cena.

   victimBloodDrunk guarda quanto o
   jogador já retirou da vítima.
========================================== */

export function getVictimCondition(
  prey,
  bloodDrunk
) {
  const available =
    prey?.bloodAvailable ?? 4

  const ratio =
    bloodDrunk /
    Math.max(
      1,
      available
    )

  if (
    bloodDrunk <= 0
  ) {
    return {
      id: 'normal',

      label:
        'Normal',

      danger: false,

      unconscious:
        false,

      dead: false,
    }
  }

  if (
    ratio <= 0.25
  ) {
    return {
      id: 'weak',

      label:
        'Enfraquecida',

      danger: false,

      unconscious:
        false,

      dead: false,
    }
  }

  if (
    ratio <= 0.5
  ) {
    return {
      id: 'dizzy',

      label:
        'Tonta e debilitada',

      danger: false,

      unconscious:
        false,

      dead: false,
    }
  }

  if (
    ratio < 1
  ) {
    return {
      id: 'unconscious',

      label:
        'Inconsciente',

      danger: true,

      unconscious:
        true,

      dead: false,
    }
  }

  return {
    id: 'critical',

    label:
      'Em estado crítico',

    danger: true,

    unconscious:
      true,

    dead: false,
  }
}

/* ==========================================
   RISCO DE MORTE

   Aqui não tratamos "4 pontos" como
   uma medida médica real.

   É uma abstração de RPG.
========================================== */

export function calculateVictimDeathRisk(
  prey,
  bloodDrunk,
  continuedKnowingly = false
) {
  const available =
    prey?.bloodAvailable ?? 4

  const ratio =
    bloodDrunk /
    Math.max(
      1,
      available
    )

  if (
    ratio < 0.75
  ) {
    return 0
  }

  let chance = 20

  if (
    ratio >= 1
  ) {
    chance = 65
  }

  if (
    bloodDrunk >
    available
  ) {
    chance = 90
  }

  if (
    prey?.animal
  ) {
    chance += 10
  }

  if (
    continuedKnowingly
  ) {
    chance += 10
  }

  return clamp(
    chance,
    0,
    100
  )
}

export function rollVictimDeath(
  prey,
  bloodDrunk,
  continuedKnowingly = false
) {
  const chance =
    calculateVictimDeathRisk(
      prey,
      bloodDrunk,
      continuedKnowingly
    )

  if (
    chance <= 0
  ) {
    return {
      died: false,
      chance,
      roll: null,
    }
  }

  const roll =
    Math.random() *
    100

  return {
    died:
      roll < chance,

    chance,

    roll,
  }
}

/* ==========================================
   ALIMENTAÇÃO
========================================== */

export function feedFromPrey(
  game,
  prey,
  amount,
  options = {}
) {
  const requestedAmount =
    Math.max(
      1,
      Number(amount) || 1
    )

  const current =
    game.blood
      ?.current ?? 0

  const maximum =
    game.blood
      ?.maximum ?? 10

  const freeCapacity =
    Math.max(
      0,
      maximum - current
    )

  const storedBlood =
    Math.min(
      requestedAmount,
      freeCapacity
    )

  const overflow =
    Math.max(
      0,
      requestedAmount -
        storedBlood
    )

  const now =
    worldToMinutes(
      game.world
    )

  const severity =
    getOverflowSeverity(
      overflow
    )

  const previousBodyBlood =
    game.appearance
      ?.bodyBlood ?? 0

  const previousClothesBlood =
    game.appearance
      ?.clothesBlood ?? 0

  const previousVictimBlood =
    Number(
      options.previousVictimBlood ??
      0
    )

  const totalVictimBlood =
    previousVictimBlood +
    requestedAmount

  const victimCondition =
    getVictimCondition(
      prey,
      totalVictimBlood
    )

  const deathResult =
    rollVictimDeath(
      prey,
      totalVictimBlood,
      Boolean(
        options.continuedKnowingly
      )
    )

  let updatedGame = {
    ...game,

    blood: {
      ...game.blood,

      current:
        Math.min(
          maximum,
          current +
            storedBlood
        ),

      overflow,

      overflowExpiresAt:
        overflow > 0
          ? now +
            10 +
            overflow * 5
          : null,
    },

    appearance: {
      ...(game.appearance ??
        {}),

      bodyBlood:
        Math.max(
          previousBodyBlood,
          severity
        ),

      clothesBlood:
        Math.max(
          previousClothesBlood,
          severity
        ),

      clean:
        severity === 0 &&
        previousBodyBlood === 0 &&
        previousClothesBlood === 0,

      visiblyBloody:
        severity > 0 ||
        previousBodyBlood > 0 ||
        previousClothesBlood > 0,
    },
  }

  const effects =
    determineBloodEffects(
      prey
    )

  effects.forEach(
    (statusId) => {
      updatedGame =
        applyStatus(
          updatedGame,
          statusId
        )
    }
  )

  const feedingHistory = {
    type:
      'feeding',

    prey:
      prey.id,

    preyName:
      prey.name,

    requestedBlood:
      requestedAmount,

    totalVictimBlood,

    storedBlood,

    overflow,

    victimCondition:
      deathResult.died
        ? 'dead'
        : victimCondition.id,

    victimDied:
      deathResult.died,

    continuedKnowingly:
      Boolean(
        options.continuedKnowingly
      ),

    effects,

    timestamp:
      new Date()
        .toISOString(),
  }

  updatedGame = {
    ...updatedGame,

    history: [
      ...(updatedGame.history ??
        []),

      feedingHistory,
    ],
  }

  return {
    game:
      updatedGame,

    bloodDrunk:
      requestedAmount,

    totalVictimBlood,

    bloodStored:
      storedBlood,

    overflow,

    effects,

    victimCondition:
      deathResult.died
        ? {
            id: 'dead',
            label: 'Morta',
            danger: true,
            unconscious: true,
            dead: true,
          }
        : victimCondition,

    victimDied:
      deathResult.died,

    deathChance:
      deathResult.chance,

    becameBloody:
      overflow > 0,
  }
}

/* ==========================================
   FIM DO VAZAMENTO
========================================== */

export function updateBloodOverflow(
  game
) {
  const overflow =
    game.blood
      ?.overflow ?? 0

  const expiresAt =
    game.blood
      ?.overflowExpiresAt

  if (
    overflow <= 0 ||
    expiresAt === null ||
    expiresAt === undefined
  ) {
    return game
  }

  const now =
    worldToMinutes(
      game.world
    )

  if (
    now <
    expiresAt
  ) {
    return game
  }

  return {
    ...game,

    blood: {
      ...game.blood,

      overflow: 0,

      overflowExpiresAt:
        null,
    },
  }
}

/* ==========================================
   LIMPEZA
========================================== */

export function shower(
  game
) {
  return {
    ...game,

    appearance: {
      ...(game.appearance ??
        {}),

      bodyBlood: 0,

      clean:
        (
          game.appearance
            ?.clothesBlood ?? 0
        ) === 0,

      visiblyBloody:
        (
          game.appearance
            ?.clothesBlood ?? 0
        ) > 0,
    },

    blood: {
      ...game.blood,

      overflow: 0,

      overflowExpiresAt:
        null,
    },
  }
}

export function changeClothes(
  game
) {
  return {
    ...game,

    appearance: {
      ...(game.appearance ??
        {}),

      clothesBlood: 0,

      clean:
        (
          game.appearance
            ?.bodyBlood ?? 0
        ) === 0,

      visiblyBloody:
        (
          game.appearance
            ?.bodyBlood ?? 0
        ) > 0,
    },
  }
}