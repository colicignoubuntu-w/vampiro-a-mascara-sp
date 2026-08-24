import {
  resolveDayHealing,
} from './healingEngine'

function safeNumber(
  value,
  fallback = 0
) {
  const valueNumber =
    Number(value)

  return Number.isNaN(
    valueNumber
  )
    ? fallback
    : valueNumber
}

function toMinutes(
  hour,
  minute
) {
  return (
    safeNumber(
      hour,
      0
    ) *
      60 +
    safeNumber(
      minute,
      0
    )
  )
}

export function isSunriseReached(
  world
) {
  if (!world) {
    return false
  }

  const current =
    toMinutes(
      world.hour,
      world.minute
    )

  const sunrise =
    toMinutes(
      world.sunriseHour ??
        6,
      world.sunriseMinute ??
        30
    )

  /*
    Consideramos amanhecer apenas
    no período da manhã.

    Isso evita que 23h seja
    interpretado como "depois das 6h".
  */

  const daytime =
    current >= sunrise &&
    current < 18 * 60

  return daytime
}

export function isSafeDayShelter(
  scene
) {
  if (!scene) {
    return false
  }

  /*
    Cenas podem declarar explicitamente:

    daySafe: true

    Exemplo:
    apartamento sem janelas,
    porão,
    refúgio,
    quarto protegido.
  */

  return Boolean(
    scene.daySafe
  )
}

export function needsDaySleep({
  game,
  scene,
}) {
  if (
    !game ||
    !scene
  ) {
    return false
  }

  if (
    game?.daySleep
      ?.sleeping
  ) {
    return false
  }

  return isSunriseReached(
    game.world
  )
}

export function createDaySleepState(
  game,
  scene
) {
  const safe =
    isSafeDayShelter(
      scene
    )

  return {
    active: true,

    safe,

    sceneId:
      scene.id,

    location:
      scene.location
        ?.name ??
      'Local desconhecido',

    startedAt: {
      night:
        game.world
          ?.night ?? 1,

      hour:
        game.world
          ?.hour ?? 6,

      minute:
        game.world
          ?.minute ?? 30,
    },
  }
}

export function sleepThroughDay(
  game
) {
  let updatedGame =
    resolveDayHealing(
      game
    )

  const currentNight =
    updatedGame.world
      ?.night ?? 1

  updatedGame = {
    ...updatedGame,

    daySleep: {
      active: false,

      sleeping: false,

      lastSleepNight:
        currentNight,
    },

    world: {
      ...(updatedGame.world ??
        {}),

      night:
        currentNight + 1,

      /*
        Acordamos no início da noite.

        Depois podemos criar horário
        variável por estação do ano.
      */

      hour: 19,

      minute: 0,
    },

    flags: {
      ...(updatedGame.flags ??
        {}),

      wokeFromDaySleep:
        true,
    },

    history: [
      ...(updatedGame.history ??
        []),

      {
        type:
          'day-sleep',

        night:
          currentNight,

        nextNight:
          currentNight + 1,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return updatedGame
}

export function createSunriseHazard(
  scene
) {
  return {
    id:
      `sunrise-${scene.id}`,

    type:
      'sunlight',

    title:
      'O Sol Está Nascendo',

    description:
      'Você permaneceu em um local sem proteção adequada quando o dia começou.',

    damagePerTurn: 2,

    escapeDifficulty: 7,

    coverDifficulty: 7,

    successScene:
      scene.id,

    destructionScene:
      'vampire_destroyed_sunlight',
  }
}