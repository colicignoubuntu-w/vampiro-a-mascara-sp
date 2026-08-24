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

function normalizeClock(
  hour,
  minute
) {
  let totalMinutes =
    safeNumber(
      hour,
      0
    ) *
      60 +
    safeNumber(
      minute,
      0
    )

  let dayChange = 0

  while (
    totalMinutes >=
    24 * 60
  ) {
    totalMinutes -=
      24 * 60

    dayChange += 1
  }

  while (
    totalMinutes < 0
  ) {
    totalMinutes +=
      24 * 60

    dayChange -= 1
  }

  return {
    hour:
      Math.floor(
        totalMinutes / 60
      ),

    minute:
      totalMinutes % 60,

    dayChange,
  }
}

export function worldToMinutes(
  world
) {
  if (!world) {
    return 0
  }

  return (
    safeNumber(
      world.hour,
      0
    ) *
      60 +
    safeNumber(
      world.minute,
      0
    )
  )
}

export function formatClock(
  world
) {
  const hour =
    safeNumber(
      world?.hour,
      0
    )

  const minute =
    safeNumber(
      world?.minute,
      0
    )

  return (
    `${String(hour).padStart(
      2,
      '0'
    )}:${String(minute).padStart(
      2,
      '0'
    )}`
  )
}

export function getSunriseMinutes(
  world
) {
  return (
    safeNumber(
      world?.sunriseHour,
      6
    ) *
      60 +
    safeNumber(
      world?.sunriseMinute,
      30
    )
  )
}

export function getSunsetMinutes(
  world
) {
  return (
    safeNumber(
      world?.sunsetHour,
      18
    ) *
      60 +
    safeNumber(
      world?.sunsetMinute,
      30
    )
  )
}

export function isDaytime(
  world
) {
  const current =
    worldToMinutes(
      world
    )

  const sunrise =
    getSunriseMinutes(
      world
    )

  const sunset =
    getSunsetMinutes(
      world
    )

  return (
    current >= sunrise &&
    current < sunset
  )
}

export function isNighttime(
  world
) {
  return !isDaytime(
    world
  )
}

/*
  Retorna quantos minutos faltam
  para o amanhecer.

  Exemplo:

  23:30 -> 420 minutos até 06:30
  05:30 -> 60 minutos
  06:40 -> 0 porque já é dia
*/

export function minutesUntilSunrise(
  world
) {
  if (
    isDaytime(
      world
    )
  ) {
    return 0
  }

  const current =
    worldToMinutes(
      world
    )

  const sunrise =
    getSunriseMinutes(
      world
    )

  if (
    current <
    sunrise
  ) {
    return (
      sunrise -
      current
    )
  }

  return (
    24 * 60 -
      current +
      sunrise
  )
}

/*
  Detecta se uma ação atravessou
  o amanhecer.

  Importante porque:

  06:20 + 20 minutos
  termina às 06:40.

  Nesse caso o personagem estava
  executando uma ação quando o sol
  nasceu.
*/

export function crossesSunrise({
  world,
  minutes,
}) {
  const amount =
    Math.max(
      0,
      safeNumber(
        minutes,
        0
      )
    )

  if (
    amount <= 0
  ) {
    return false
  }

  if (
    isDaytime(
      world
    )
  ) {
    return true
  }

  const untilSunrise =
    minutesUntilSunrise(
      world
    )

  return (
    amount >=
    untilSunrise
  )
}

/*
  ========================================
  AVANÇAR RELÓGIO
  ========================================
*/

export function advanceWorldTime(
  world,
  minutes
) {
  const amount =
    Math.max(
      0,
      safeNumber(
        minutes,
        0
      )
    )

  if (
    amount <= 0
  ) {
    return {
      ...(world ?? {}),
    }
  }

  const startingHour =
    safeNumber(
      world?.hour,
      0
    )

  const startingMinute =
    safeNumber(
      world?.minute,
      0
    )

  const normalized =
    normalizeClock(
      startingHour,
      startingMinute +
        amount
    )

  return {
    ...(world ?? {}),

    hour:
      normalized.hour,

    minute:
      normalized.minute,
  }
}

/*
  ========================================
  AVANÇAR TEMPO DO SAVE
  ========================================
*/

export function advanceGameTime(
  game,
  minutes,
  options = {}
) {
  if (!game) {
    return game
  }

  const amount =
    Math.max(
      0,
      safeNumber(
        minutes,
        0
      )
    )

  if (
    amount <= 0
  ) {
    return game
  }

  const oldWorld = {
    ...(game.world ?? {}),
  }

  const crossedSunrise =
    crossesSunrise({
      world:
        oldWorld,

      minutes:
        amount,
    })

  const newWorld =
    advanceWorldTime(
      oldWorld,
      amount
    )

  const reason =
    options.reason ??
    'Passagem do tempo'

  return {
    ...game,

    world:
      newWorld,

    flags: {
      ...(game.flags ?? {}),

      ...(crossedSunrise
        ? {
            sunriseCrossed:
              true,
          }
        : {}),
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'time-advance',

        minutes:
          amount,

        reason,

        from: {
          hour:
            oldWorld.hour,

          minute:
            oldWorld.minute,
        },

        to: {
          hour:
            newWorld.hour,

          minute:
            newWorld.minute,
        },

        crossedSunrise,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

/*
  ========================================
  TEMPOS PADRÃO
  ========================================

  Usaremos estes valores como base,
  mas cada cena poderá sobrescrever.
*/

export const TIME_COSTS = {
  quickAction: 1,

  shortConversation: 5,

  longConversation: 15,

  investigation: 15,

  feeding: 10,

  combatRound: 1,

  shortWalk: 10,

  mediumWalk: 25,

  longWalk: 45,

  busShort: 15,

  busMedium: 30,

  busLong: 50,

  subwayShort: 10,

  subwayMedium: 20,

  subwayLong: 35,

  carShort: 10,

  carMedium: 20,

  carLong: 35,
}

export function getTimeCost(
  key,
  fallback = 0
) {
  return (
    TIME_COSTS[key] ??
    fallback
  )
}