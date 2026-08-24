export const VICTIM_STATES = {
  healthy: {
    label: 'Estável',
    description:
      'A vítima ainda está em boas condições.',
  },

  weak: {
    label: 'Fraca',
    description:
      'A perda de sangue começa a provocar fraqueza.',
  },

  veryWeak: {
    label: 'Muito Fraca',
    description:
      'A vítima está claramente debilitada.',
  },

  critical: {
    label: 'Estado Grave',
    description:
      'A perda de sangue é perigosa.',
  },

  dying: {
    label: 'Risco Extremo',
    description:
      'A vítima está próxima da morte.',
  },

  dead: {
    label: 'Morta',
    description:
      'A vítima morreu pela perda de sangue.',
  },
}

export function getVictimState(
  victim
) {
  const blood =
    victim?.blood?.current ??
    10

  if (blood <= 0) {
    return {
      key: 'dead',
      ...VICTIM_STATES.dead,
    }
  }

  if (blood === 1) {
    return {
      key: 'dying',
      ...VICTIM_STATES.dying,
    }
  }

  if (blood <= 3) {
    return {
      key: 'critical',
      ...VICTIM_STATES.critical,
    }
  }

  if (blood <= 5) {
    return {
      key: 'veryWeak',
      ...VICTIM_STATES.veryWeak,
    }
  }

  if (blood <= 7) {
    return {
      key: 'weak',
      ...VICTIM_STATES.weak,
    }
  }

  return {
    key: 'healthy',
    ...VICTIM_STATES.healthy,
  }
}

export function createVictim({
  id,
  name,
  blood = 10,
}) {
  return {
    id,

    name,

    alive: true,

    blood: {
      current: blood,
      maximum: blood,
    },

    woundsClosed: false,
  }
}

export function canPlayerDrink(
  game
) {
  const current =
    game?.blood?.current ?? 0

  const maximum =
    game?.blood?.maximum ?? 10

  return current < maximum
}

export function drinkBlood({
  game,
  victim,
  amount = 1,
}) {
  const requested =
    Math.max(
      1,
      Number(amount) || 1
    )

  const vampireCurrent =
    game?.blood?.current ?? 0

  const vampireMaximum =
    game?.blood?.maximum ?? 10

  const victimCurrent =
    victim?.blood?.current ?? 0

  /*
    Não podemos beber além da
    capacidade do vampiro nem além
    do sangue restante da vítima.
  */

  const vampireSpace =
    Math.max(
      0,
      vampireMaximum -
        vampireCurrent
    )

  const actualAmount =
    Math.min(
      requested,
      vampireSpace,
      victimCurrent
    )

  if (
    actualAmount <= 0
  ) {
    return {
      game,
      victim,

      amountDrunk: 0,

      victimState:
        getVictimState(
          victim
        ),
    }
  }

  const newVictimBlood =
    victimCurrent -
    actualAmount

  const updatedVictim = {
    ...victim,

    alive:
      newVictimBlood > 0,

    blood: {
      ...(victim.blood ??
        {}),

      current:
        newVictimBlood,
    },
  }

  const victimState =
    getVictimState(
      updatedVictim
    )

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        vampireCurrent +
        actualAmount,
    },

    flags: {
      ...(game.flags ?? {}),

      fedFromHuman:
        true,

      ...(victimState.key ===
      'weak'
        ? {
            leftVictimWeak:
              true,
          }
        : {}),

      ...(victimState.key ===
        'veryWeak' ||
      victimState.key ===
        'critical'
        ? {
            seriouslyDrainedVictim:
              true,
          }
        : {}),

      ...(victimState.key ===
      'dying'
        ? {
            endangeredHumanByFeeding:
              true,
          }
        : {}),

      ...(victimState.key ===
      'dead'
        ? {
            killedHumanByFeeding:
              true,

            humanityCheckRequired:
              true,
          }
        : {}),
    },
  }

  return {
    game:
      updatedGame,

    victim:
      updatedVictim,

    amountDrunk:
      actualAmount,

    victimState,
  }
}

export function sealBiteWound(
  victim
) {
  if (!victim) {
    return victim
  }

  if (!victim.alive) {
    return victim
  }

  return {
    ...victim,

    woundsClosed: true,
  }
}

export function buildFeedingHistory({
  victim,
  amount,
  gameTime,
}) {
  return {
    type: 'feeding',

    victimId:
      victim.id,

    victimName:
      victim.name,

    amount,

    victimBloodRemaining:
      victim.blood.current,

    victimAlive:
      victim.alive,

    gameTime,

    timestamp:
      new Date()
        .toISOString(),
  }
}