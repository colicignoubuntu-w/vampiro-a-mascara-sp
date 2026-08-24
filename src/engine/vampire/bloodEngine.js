export function getBloodState(
  game
) {
  const current =
    game?.blood?.current ?? 0

  const maximum =
    game?.blood?.maximum ?? 10

  const ratio =
    maximum > 0
      ? current / maximum
      : 0

  let hungerLevel =
    'sated'

  if (ratio <= 0.2) {
    hungerLevel =
      'critical'
  } else if (
    ratio <= 0.4
  ) {
    hungerLevel =
      'hungry'
  } else if (
    ratio <= 0.7
  ) {
    hungerLevel =
      'uneasy'
  }

  return {
    current,
    maximum,
    ratio,
    hungerLevel,
  }
}

export function spendBlood(
  game,
  amount = 1
) {
  const current =
    game?.blood?.current ?? 0

  const safeAmount =
    Math.max(
      0,
      Number(amount) || 0
    )

  if (
    safeAmount >
    current
  ) {
    return {
      success: false,
      game,
      spent: 0,
    }
  }

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        current -
        safeAmount,
    },
  }

  return {
    success: true,
    game:
      updatedGame,
    spent:
      safeAmount,
  }
}

export function restoreBlood(
  game,
  amount = 1
) {
  const current =
    game?.blood?.current ?? 0

  const maximum =
    game?.blood?.maximum ?? 10

  const safeAmount =
    Math.max(
      0,
      Number(amount) || 0
    )

  const restored =
    Math.min(
      safeAmount,
      maximum -
        current
    )

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        current +
        restored,
    },
  }

  return {
    game:
      updatedGame,

    restored,
  }
}

export function shouldTestFrenzy(
  game
) {
  const state =
    getBloodState(
      game
    )

  return (
    state.hungerLevel ===
      'hungry' ||
    state.hungerLevel ===
      'critical'
  )
}

export function getFrenzyDifficulty(
  game
) {
  const state =
    getBloodState(
      game
    )

  if (
    state.hungerLevel ===
    'critical'
  ) {
    return 8
  }

  if (
    state.hungerLevel ===
    'hungry'
  ) {
    return 6
  }

  return null
}