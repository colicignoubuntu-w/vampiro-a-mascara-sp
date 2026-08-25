import {
  canSpendBloodThisTurn,
  spendBloodThisTurn,
} from './bloodTurnEngine'

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

function normalizeHealth(
  health
) {
  return {
    bashing:
      Math.max(
        0,
        safeNumber(
          health?.bashing,
          0
        )
      ),

    lethal:
      Math.max(
        0,
        safeNumber(
          health?.lethal,
          0
        )
      ),

    aggravated:
      Math.max(
        0,
        safeNumber(
          health?.aggravated,
          0
        )
      ),

    currentLevel:
      Math.max(
        0,
        safeNumber(
          health?.currentLevel,
          0
        )
      ),

    maximum:
      Math.max(
        1,
        safeNumber(
          health?.maximum,
          7
        )
      ),
  }
}

export function getHealableDamage(
  health
) {
  const normalized =
    normalizeHealth(
      health
    )

  return (
    normalized.bashing +
    normalized.lethal
  )
}

export function canHealWithBlood(
  game
) {
  const health =
    normalizeHealth(
      game?.health
    )

  if (
    health.lethal <= 0 &&
    health.bashing <= 0
  ) {
    if (
      health.aggravated > 0
    ) {
      return {
        allowed: false,

        reason:
          'Esta cura não remove dano agravado.',
      }
    }

    return {
      allowed: false,

      reason:
        'Você não possui ferimentos para curar.',
    }
  }

  const bloodCheck =
    canSpendBloodThisTurn({
      game,
      amount: 1,
    })

  if (
    !bloodCheck.allowed
  ) {
    return {
      allowed: false,

      reason:
        bloodCheck.message ??
        'Você não pode gastar mais sangue neste turno.',
    }
  }

  return {
    allowed: true,

    reason: null,
  }
}

export function healWithBlood(
  game
) {
  if (!game) {
    return {
      success: false,

      game,

      healed: 0,

      reason:
        'invalid-game',

      log: [],
    }
  }

  const permission =
    canHealWithBlood(
      game
    )

  if (
    !permission.allowed
  ) {
    return {
      success: false,

      game,

      healed: 0,

      reason:
        permission.reason,

      log: [
        {
          type:
            'blood-healing-failed',

          text:
            permission.reason,
        },
      ],
    }
  }

  const spendResult =
    spendBloodThisTurn({
      game,

      amount: 1,

      reason:
        'blood-healing',
    })

  if (
    !spendResult.success
  ) {
    return {
      success: false,

      game,

      healed: 0,

      reason:
        spendResult.message ??
        spendResult.reason,

      log: [
        {
          type:
            'blood-healing-failed',

          text:
            spendResult.message ??
            'Você não pode gastar mais sangue neste turno.',
        },
      ],
    }
  }

  const health =
    normalizeHealth(
      spendResult.game
        .health
    )

  let damageType =
    null

  if (
    health.lethal > 0
  ) {
    health.lethal -=
      1

    damageType =
      'letal'
  } else {
    health.bashing -=
      1

    damageType =
      'contusivo'
  }

  health.currentLevel =
    health.bashing +
    health.lethal +
    health.aggravated

  const updatedGame = {
    ...spendResult.game,

    health,

    history: [
      ...(spendResult.game
        .history ??
        []),

      {
        type:
          'blood-healing',

        bloodSpent: 1,

        healed: 1,

        damageType,

        bloodSpentThisTurn:
          spendResult.spentThisTurn,

        bloodPerTurn:
          spendResult.limit,

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

    healed: 1,

    damageType,

    reason: null,

    spentThisTurn:
      spendResult.spentThisTurn,

    remainingThisTurn:
      spendResult.remainingThisTurn,

    log: [
      {
        type:
          'blood-healing',

        text:
          `Você gasta 1 ponto de sangue e cura 1 nível de dano ${damageType}. Sangue usado neste turno: ${spendResult.spentThisTurn}/${spendResult.limit}.`,
      },
    ],
  }
}

export default {
  getHealableDamage,
  canHealWithBlood,
  healWithBlood,
}