import {
  resolveDayHealing,
  healBashing,
  healLethal,
  getHealingState,
} from './healingEngine'

import {
  spendBlood,
} from './bloodEngine'

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
export function getAwakeningHungerState(
  game
) {
  const blood =
    Math.max(
      0,
      Number(
        game?.blood
          ?.current ?? 0
      )
    )

  /*
    ========================================
    TORPOR
    ========================================
  */

  if (blood <= 0) {
    return {
      state:
        'torpor',

      blood,

      requiresFrenzyTest:
        false,

      frenzyDifficulty:
        null,
    }
  }

  /*
    ========================================
    FOME CRÍTICA
    ========================================

    Quanto menos sangue,
    maior a dificuldade para
    controlar a Besta.
  */

  if (blood === 1) {
    return {
      state:
        'critical_hunger',

      blood,

      requiresFrenzyTest:
        true,

      frenzyDifficulty:
        8,
    }
  }

  if (blood === 2) {
    return {
      state:
        'severe_hunger',

      blood,

      requiresFrenzyTest:
        true,

      frenzyDifficulty:
        7,
    }
  }

  if (blood === 3) {
    return {
      state:
        'hunger',

      blood,

      requiresFrenzyTest:
        true,

      frenzyDifficulty:
        6,
    }
  }

  /*
    ========================================
    DESPERTAR NORMAL
    ========================================
  */

  return {
    state:
      'normal',

    blood,

    requiresFrenzyTest:
      false,

    frenzyDifficulty:
      null,
  }
}
export function sleepThroughDay(
  game
) {
  /*
    ========================================
    CURA DURANTE O DIA
    ========================================
  */

  let updatedGame =
    resolveDayHealing(
      game
    )

  // Tentativa automática de curar ferimentos leves/letais usando vitae
  // durante o sono. Se não for possível curar tudo, o personagem entra
  // em Torpor por ferimentos (salvo exceção de Humanidade 10).
  try {
    let healState = getHealingState(updatedGame)

    // apenas se havia dano ao começar o sono
    const hadDamage = healState.total > 0

    // tenta curar enquanto houver sangue e ferimentos curáveis
    while ((healState.canHealLethal || healState.canHealBashing) && healState.blood > 0) {
      if (healState.canHealLethal) {
        const res = healLethal(updatedGame)

        if (res?.success) {
          updatedGame = res.game
        } else {
          break
        }
      } else if (healState.canHealBashing) {
        const res = healBashing(updatedGame)

        if (res?.success) {
          updatedGame = res.game
        } else {
          break
        }
      }

      healState = getHealingState(updatedGame)
    }

    // se começou ferido e ainda resta dano após usar sangue, entra em Torpor
    const stillDamaged = healState.total > 0

    if (hadDamage && stillDamaged) {
      const humanityLevel = Number(game?.humanity?.current ?? game?.humanity ?? 0)

      // Para Humanidade 10 permitimos tentar gastar sangue extra para curar
      // durante o despertar (já tentamos acima). Para Humanidade < 10,
      // o personagem entra em Torpor por ferimentos.
      // Marcamos também o período mínimo de repouso em noites.
      const restNights = Math.max(0, 10 - humanityLevel)

      updatedGame = {
        ...updatedGame,

        vampireState: {
          ...(updatedGame.vampireState ?? {}),

          torpor: true,

          torporReason: 'wounds',

          torporStartedNight:
            (updatedGame.world?.night ?? 1) + 1,

          torporRestRequiredNights: restNights,
        },

        flags: {
          ...(updatedGame.flags ?? {}),

          inTorpor: true,
        },
      }
    }
  } catch (err) {
    // não falhar o sono por causa de um erro de cura
    console.error('Erro ao aplicar cura automática durante o sono:', err)
  }

  const currentNight =
    updatedGame.world
      ?.night ?? 1

  /*
    ========================================
    CUSTO PARA DESPERTAR
    ========================================

    Todo vampiro gasta 1 ponto de sangue
    para despertar em uma nova noite.

    Esse gasto NÃO conta para o limite
    de sangue por turno de combate.
  */

  const awakeningCost =
    spendBlood(
      updatedGame,
      1
    )

  const paidAwakeningBlood =
    awakeningCost.success

  if (
    paidAwakeningBlood
  ) {
    updatedGame =
      awakeningCost.game
  }

  /*
    ========================================
    ESTADO DE FOME AO DESPERTAR
    ========================================
  */

  const hungerState =
    getAwakeningHungerState(
      updatedGame
    )

  const enteredTorpor =
    hungerState.state ===
      'torpor'

  const requiresFrenzyTest =
    hungerState
      .requiresFrenzyTest

  /*
    ========================================
    NOVA NOITE
    ========================================
  */

  updatedGame = {
    ...updatedGame,

    daySleep: {
      active: false,

      sleeping: false,

      lastSleepNight:
        currentNight,

      awakeningBloodSpent:
        paidAwakeningBlood
          ? 1
          : 0,

      awakeningFailed:
        enteredTorpor,

      awakeningState:
        hungerState.state,

      awakeningBlood:
        hungerState.blood,

      awakeningFrenzyRequired:
        requiresFrenzyTest,

      awakeningFrenzyDifficulty:
        hungerState
          .frenzyDifficulty,

      torpor:
        enteredTorpor,
    },

    /*
      ========================================
      ESTADO VAMPÍRICO
      ========================================

      O Torpor fica salvo separadamente
      para futuramente também poder ocorrer
      por dano, estaca, efeitos sobrenaturais,
      etc.
    */

    vampireState: {
      ...(updatedGame.vampireState ?? {}),

      // combina torpor por fome e por ferimentos tratados anteriormente
      torpor:
        Boolean(
          (updatedGame.vampireState && updatedGame.vampireState.torpor) ||
            enteredTorpor
        ),

      torporReason:
        (updatedGame.vampireState && updatedGame.vampireState.torporReason) ||
        (enteredTorpor ? 'blood_depletion' : null),

      torporStartedNight:
        (updatedGame.vampireState && updatedGame.vampireState.torporStartedNight) ||
        (enteredTorpor ? currentNight + 1 : null),
    },

    world: {
      ...(updatedGame.world ??
        {}),

      night:
        currentNight + 1,

      hour: 19,

      minute: 0,
    },

    flags: {
      ...(updatedGame.flags ??
        {}),

      /*
        Só despertou de verdade
        se não entrou em Torpor.
      */

      wokeFromDaySleep:
        !enteredTorpor,

      awakeningBloodSpent:
        paidAwakeningBlood,

      awakeningWithoutBlood:
        !paidAwakeningBlood,

      awakeningHungerCheck:
        true,

      awakeningFrenzyRequired:
        requiresFrenzyTest,

      awakeningFrenzyDifficulty:
        hungerState
          .frenzyDifficulty,

      awakeningTorpor:
        enteredTorpor,

      inTorpor:
        enteredTorpor,
    },

    history: [
      ...(updatedGame.history ??
        []),

      {
        type:
          enteredTorpor
            ? 'day-sleep-torpor'
            : 'day-sleep',

        night:
          currentNight,

        nextNight:
          currentNight + 1,

        bloodAfterSleep:
          hungerState.blood,

        awakeningBloodSpent:
          paidAwakeningBlood
            ? 1
            : 0,

        awakeningState:
          hungerState.state,

        frenzyRequired:
          requiresFrenzyTest,

        frenzyDifficulty:
          hungerState
            .frenzyDifficulty,

        enteredTorpor,

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