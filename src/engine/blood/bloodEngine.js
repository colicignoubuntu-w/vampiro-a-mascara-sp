import {
  applyStatus,
} from '../status/statusEngine'

import {
  determineBloodEffects,
} from '../hunting/huntingEngine'

export function addBlood(
  game,
  amount
) {
  const current =
    game.blood
      ?.current ?? 0

  const maximum =
    game.blood
      ?.maximum ?? 10

  const newCurrent =
    Math.min(
      maximum,
      current +
        Math.max(
          0,
          amount
        )
    )

  return {
    ...game,

    blood: {
      ...game.blood,

      current:
        newCurrent,
    },
  }
}

export function spendBlood(
  game,
  amount = 1
) {
  const current =
    game.blood
      ?.current ?? 0

  if (
    current <
    amount
  ) {
    return {
      success: false,

      game,

      reason:
        'Você não possui sangue suficiente.',
    }
  }

  return {
    success: true,

    game: {
      ...game,

      blood: {
        ...game.blood,

        current:
          current -
          amount,
      },
    },
  }
}

export function feedFromPrey(
  game,
  prey,
  amount
) {
  const safeAmount =
    Math.max(
      1,
      Math.min(
        amount,
        prey.bloodAvailable
      )
    )

  let updated =
    addBlood(
      game,
      safeAmount
    )

  const effects =
    determineBloodEffects(
      prey
    )

  effects.forEach(
    (statusId) => {
      updated =
        applyStatus(
          updated,
          statusId
        )
    }
  )

  const feedingHistory = {
    type: 'feeding',

    prey:
      prey.id,

    preyName:
      prey.name,

    blood:
      safeAmount,

    effects,

    gameTime: {
      night:
        updated.world
          ?.night ?? 1,

      hour:
        updated.world
          ?.hour ?? 0,

      minute:
        updated.world
          ?.minute ?? 0,
    },

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    game: {
      ...updated,

      history: [
        ...(updated.history ??
          []),

        feedingHistory,
      ],
    },

    bloodGained:
      safeAmount,

    effects,
  }
}