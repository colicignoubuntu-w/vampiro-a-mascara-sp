import {
  getTotalDamage,
  normalizeHealth,
} from '../combat/damageEngine'

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

function rebuildHealth(
  health
) {
  const normalized =
    normalizeHealth(
      health
    )

  return {
    ...normalized,

    currentLevel:
      getTotalDamage(
        normalized
      ),
  }
}

export function getHealingState(
  game
) {
  const health =
    normalizeHealth(
      game?.health
    )

  const blood =
    Math.max(
      0,
      safeNumber(
        game?.blood
          ?.current,
        0
      )
    )

  return {
    blood,

    bashing:
      health.bashing,

    lethal:
      health.lethal,

    aggravated:
      health.aggravated,

    total:
      getTotalDamage(
        health
      ),

    canHealBashing:
      blood > 0 &&
      health.bashing > 0,

    canHealLethal:
      blood > 0 &&
      health.lethal > 0,

    canHealAggravated:
      blood >= 5 &&
      health.aggravated > 0,
  }
}

/*
  =========================================
  CURA CONTUSÃO

  1 sangue
  cura 1 nível.
  =========================================
*/

export function healBashing(
  game
) {
  const state =
    getHealingState(
      game
    )

  if (
    !state.canHealBashing
  ) {
    return {
      success: false,

      reason:
        state.blood <= 0
          ? 'no-blood'
          : 'no-damage',

      game,
    }
  }

  const health =
    normalizeHealth(
      game.health
    )

  const updatedHealth =
    rebuildHealth({
      ...health,

      bashing:
        Math.max(
          0,
          health.bashing - 1
        ),
    })

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        state.blood - 1,
    },

    health:
      updatedHealth,

    history: [
      ...(game.history ?? []),

      {
        type:
          'healing',

        damageType:
          'bashing',

        healed: 1,

        bloodSpent: 1,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,

    healed: 1,

    bloodSpent: 1,

    game:
      updatedGame,
  }
}

/*
  =========================================
  CURA LETAL

  Nesta implementação:
  1 sangue
  cura 1 nível letal.

  Podemos alterar depois caso você queira
  uma regra mais lenta.
  =========================================
*/

export function healLethal(
  game
) {
  const state =
    getHealingState(
      game
    )

  if (
    !state.canHealLethal
  ) {
    return {
      success: false,

      reason:
        state.blood <= 0
          ? 'no-blood'
          : 'no-damage',

      game,
    }
  }

  const health =
    normalizeHealth(
      game.health
    )

  const updatedHealth =
    rebuildHealth({
      ...health,

      lethal:
        Math.max(
          0,
          health.lethal - 1
        ),
    })

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        state.blood - 1,
    },

    health:
      updatedHealth,

    history: [
      ...(game.history ?? []),

      {
        type:
          'healing',

        damageType:
          'lethal',

        healed: 1,

        bloodSpent: 1,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,

    healed: 1,

    bloodSpent: 1,

    game:
      updatedGame,
  }
}

/*
  =========================================
  CURA AGRAVADO

  Muito mais difícil.

  Nesta implementação:

  5 pontos de sangue
  + repouso diurno
  = cura 1 agravado.

  Por isso a função apenas agenda
  a cura.

  Ela NÃO remove o dano imediatamente.
  =========================================
*/

export function prepareAggravatedHealing(
  game
) {
  const state =
    getHealingState(
      game
    )

  if (
    state.aggravated <= 0
  ) {
    return {
      success: false,

      reason:
        'no-damage',

      game,
    }
  }

  if (
    state.blood < 5
  ) {
    return {
      success: false,

      reason:
        'not-enough-blood',

      game,
    }
  }

  if (
    game?.healing
      ?.aggravatedPrepared
  ) {
    return {
      success: false,

      reason:
        'already-prepared',

      game,
    }
  }

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        state.blood - 5,
    },

    healing: {
      ...(game.healing ?? {}),

      aggravatedPrepared:
        true,

      aggravatedBloodSpent:
        5,

      preparedAt:
        new Date()
          .toISOString(),
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'aggravated-healing-prepared',

        bloodSpent: 5,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,

    bloodSpent: 5,

    game:
      updatedGame,
  }
}

/*
  =========================================
  CURA AGRAVADO DURANTE TORPOR DIURNO
  =========================================
*/

export function resolveDayHealing(
  game
) {
  if (
    !game?.healing
      ?.aggravatedPrepared
  ) {
    return game
  }

  const health =
    normalizeHealth(
      game.health
    )

  if (
    health.aggravated <= 0
  ) {
    return {
      ...game,

      healing: {
        ...(game.healing ?? {}),

        aggravatedPrepared:
          false,

        aggravatedBloodSpent:
          0,

        preparedAt:
          null,
      },
    }
  }

  const updatedHealth =
    rebuildHealth({
      ...health,

      aggravated:
        Math.max(
          0,
          health.aggravated - 1
        ),
    })

  return {
    ...game,

    health:
      updatedHealth,

    healing: {
      ...(game.healing ?? {}),

      aggravatedPrepared:
        false,

      aggravatedBloodSpent:
        0,

      preparedAt:
        null,

      lastAggravatedHealing:
        new Date()
          .toISOString(),
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'aggravated-healing',

        healed: 1,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}