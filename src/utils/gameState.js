import {
  GAME_SAVE_KEY,
  loadFinalCharacter,
} from './characterFinalizer'

import {
  advanceGameTime,
  advanceWorldTime,
  crossesSunrise,
  formatCalendarDate,
  formatClock,
  isDaytime,
  minutesUntilSunrise,
} from '../engine/time/timeEngine'

import {
  applyQuestEvents,
} from '../engine/quests/questEventEngine'

import {
  addInventoryItem,
  hasInventoryItem,
} from '../engine/inventoryEngine'

/*
  ========================================
  SAVE
  ========================================
*/

export function saveGame(
  game
) {
  try {
    localStorage.setItem(
      GAME_SAVE_KEY,
      JSON.stringify(
        game
      )
    )

    return true
  } catch (error) {
    console.error(
      'Erro ao salvar jogo:',
      error
    )

    return false
  }
}

/*
  ========================================
  LOAD
  ========================================
*/

export function loadGame() {
  const game =
    loadFinalCharacter()

  if (!game) {
    return null
  }

  /*
    Mantém compatibilidade com
    saves antigos.

    DAY:
    dia do calendário.

    NIGHT:
    noite vampírica.

    Saves antigos que não possuem
    day começam no Dia 1.
  */

  return {
    ...game,

    world: {
      ...(game.world ?? {}),

      day:
        game.world
          ?.day ?? 1,

      night:
        game.world
          ?.night ?? 1,

      hour:
        game.world
          ?.hour ?? 23,

      minute:
        game.world
          ?.minute ?? 30,

      sunriseHour:
        game.world
          ?.sunriseHour ?? 6,

      sunriseMinute:
        game.world
          ?.sunriseMinute ?? 30,

      sunsetHour:
        game.world
          ?.sunsetHour ?? 18,

      sunsetMinute:
        game.world
          ?.sunsetMinute ?? 30,
    },

    flags: {
      ...(game.flags ?? {}),
    },

    history:
      Array.isArray(
        game.history
      )
        ? game.history
        : [],
  }
}

/*
  ========================================
  COMPATIBILIDADE
  ========================================

  Alguns arquivos antigos podem ainda
  importar addMinutes().

  Agora ela usa o timeEngine.
*/

export function addMinutes(
  world,
  minutes
) {
  return advanceWorldTime(
    world,
    minutes
  )
}

/*
  ========================================
  FORMATAR HORÁRIO
  ========================================
*/

export function formatGameTime(
  world
) {
  return formatClock(
    world
  )
}

export function formatGameDate(
  world
) {
  return formatCalendarDate(
    world
  )
}

/*
  ========================================
  INFORMAÇÕES SOBRE O TEMPO
  ========================================
*/

export function getTimeInfo(
  world
) {
  return {
    time:
      formatGameTime(
        world
      ),

    daytime:
      isDaytime(
        world
      ),

    day:
      world?.day ??
      1,

    night:
      world?.night ??
      1,

    minutesUntilSunrise:
      minutesUntilSunrise(
        world
      ),
  }
}

/*
  ========================================
  VERIFICAR SE UMA AÇÃO ATRAVESSA
  O AMANHECER
  ========================================
*/

export function actionCrossesSunrise(
  game,
  minutes
) {
  return crossesSunrise({
    world:
      game?.world,

    minutes,
  })
}

/*
  ========================================
  AVANÇAR TEMPO MANUALMENTE
  ========================================

  Pode ser usado por:

  - combate
  - alimentação
  - viagem
  - espera
  - investigação
  - uso de disciplinas
*/

export function advanceTime(
  game,
  minutes,
  reason = 'Passagem do tempo'
) {
  if (!game) {
    return game
  }

  const updatedGame =
    advanceGameTime(
      game,
      minutes,
      {
        reason,
      }
    )

  saveGame(
    updatedGame
  )

  return updatedGame
}

/*
  ========================================
  ESCOLHA NORMAL
  ========================================
*/

export function applyChoice(
  game,
  scene,
  choice
) {
  return applyNarrativeTransition(
    game,
    scene,
    {
      nextScene:
        choice.nextScene,

      timeMinutes:
        choice.timeMinutes ??
        0,

      flags:
        choice.flags ??
        {},

      questEvents:
        choice.questEvents ??
        [],

      inventoryItems:
        choice.inventoryItems ??
        [],

      historyType:
        'choice',

      choiceId:
        choice.id,

      text:
        choice.text,

      timeReason:
        choice.timeReason ??
        choice.text ??
        'Escolha narrativa',
    }
  )
}

/*
  ========================================
  RESULTADO DE TESTE
  ========================================
*/

export function applyTestOutcome(
  game,
  scene,
  choice,
  test,
  roll
) {
  const outcome =
    test?.outcomes?.[
      roll.result
    ]

  /*
    Se o teste não tiver um resultado
    específico, usa o comportamento
    normal da escolha.
  */

  if (!outcome) {
    return applyChoice(
      game,
      scene,
      choice
    )
  }

  return applyNarrativeTransition(
    game,
    scene,
    {
      nextScene:
        outcome.nextScene ??
        choice.nextScene,

      timeMinutes:
        outcome.timeMinutes ??
        choice.timeMinutes ??
        0,

      flags: {
        ...(choice.flags ??
          {}),

        ...(outcome.flags ??
          {}),
      },

      questEvents: [
        ...(choice.questEvents ??
          []),

        ...(outcome.questEvents ??
          []),
      ],

      inventoryItems: [
        ...(choice.inventoryItems ??
          []),

        ...(outcome.inventoryItems ??
          []),
      ],

      historyType:
        'test-choice',

      choiceId:
        choice.id,

      text:
        choice.text,

      timeReason:
        outcome.timeReason ??
        choice.timeReason ??
        choice.text ??
        test.label ??
        'Teste',

      test: {
        id:
          test.id,

        label:
          test.label,

        result:
          roll.result,

        successes:
          roll.successes,

        dice:
          roll.dice,
      },
    }
  )
}

/*
  ========================================
  TRANSIÇÃO NARRATIVA CENTRAL
  ========================================

  Toda escolha normal e todo resultado
  de teste passam por aqui.

  Isso garante:

  - tempo avance;
  - calendário avance;
  - amanhecer seja detectado;
  - flags sejam preservadas;
  - histórico seja salvo;
  - próxima cena seja registrada.
*/

function applyNarrativeTransition(
  game,
  scene,
  transition
) {
  if (
    !game
  ) {
    throw new Error(
      'Transição sem jogo.'
    )
  }

  if (
    !scene
  ) {
    throw new Error(
      'Transição sem cena atual.'
    )
  }

  if (
    !transition.nextScene
  ) {
    throw new Error(
      'Transição sem nextScene.'
    )
  }

  const timeMinutes =
    Math.max(
      0,
      Number(
        transition.timeMinutes ??
        0
      ) || 0
    )

  /*
    ========================================
    SITUAÇÃO ANTES DA AÇÃO
    ========================================
  */

  const timeBefore =
    formatGameTime(
      game.world
    )

  const dayBefore =
    game.world
      ?.day ??
    1

  const sunriseWasCrossed =
    timeMinutes > 0
      ? crossesSunrise({
          world:
            game.world,

          minutes:
            timeMinutes,
        })
      : false

  const minutesToSunrise =
    minutesUntilSunrise(
      game.world
    )

  /*
    ========================================
    LOCAL DA CENA ATUAL
    ========================================

    Durante a ação o personagem ainda
    está no local da cena atual.

    Quando a próxima cena for carregada,
    updateSceneLocation() colocará o
    local novo.
  */

  const gameWithLocation = {
    ...game,

    world: {
      ...(game.world ?? {}),

      location:
        scene.location ??
        game.world
          ?.location ??
        null,
    },
  }

  /*
    ========================================
    AVANÇA TEMPO
    ========================================
  */

  const timedGame =
    timeMinutes > 0
      ? advanceGameTime(
          gameWithLocation,
          timeMinutes,
          {
            reason:
              transition.timeReason ??
              transition.text ??
              'Ação narrativa',
          }
        )
      : gameWithLocation

  const timeAfter =
    formatGameTime(
      timedGame.world
    )

  const dayAfter =
    timedGame.world
      ?.day ??
    dayBefore

  const calendarDayChange =
    dayAfter -
    dayBefore

  /*
    ========================================
    HISTÓRICO DA ESCOLHA
    ========================================
  */

  const historyItem = {
    type:
      transition.historyType ??
      'choice',

    scene:
      scene.id,

    nextScene:
      transition.nextScene,

    choice:
      transition.choiceId ??
      null,

    text:
      transition.text ??
      '',

    minutes:
      timeMinutes,

    dayBefore,

    dayAfter,

    calendarDayChange,

    timeBefore,

    timeAfter,

    minutesToSunriseBefore:
      minutesToSunrise,

    crossedSunrise:
      sunriseWasCrossed,

    test:
      transition.test ??
      null,

    gameTime:
      timeAfter,

    timestamp:
      new Date()
        .toISOString(),
  }

  /*
    ========================================
    SAVE ATUALIZADO
    ========================================
  */

  let transitionedGame = {
    ...timedGame,

    flags: {
      ...(timedGame.flags ??
        {}),

      ...(transition.flags ??
        {}),

      /*
        Esta flag indica que uma ação
        específica atravessou o amanhecer.
      */

      ...(sunriseWasCrossed
        ? {
            sunriseCrossed:
              true,

            sunriseCrossedDuringAction:
              true,

            sunriseCrossedScene:
              scene.id,

            sunriseCrossedChoice:
              transition.choiceId ??
              null,
          }
        : {}),

      /*
        Marca mudança de dia do
        calendário quando ocorreu.
      */

      ...(calendarDayChange > 0
        ? {
            calendarDayAdvanced:
              true,

            lastCalendarDayChange:
              calendarDayChange,
          }
        : {}),
    },

    history: [
      ...(timedGame.history ??
        []),

      historyItem,
    ],

    story: {
      ...(timedGame.story ??
        {}),

      previousScene:
        scene.id,

      scene:
        transition.nextScene,
    },

    lastRoll:
      transition.test ??
      timedGame.lastRoll ??
      null,
  }

  for (const item of
    transition.inventoryItems ??
    []) {
    if (
      !hasInventoryItem(
        transitionedGame,
        item.id
      )
    ) {
      transitionedGame =
        addInventoryItem(
          transitionedGame,
          item
        )
    }
  }

  const updatedGame =
    applyQuestEvents(
      transitionedGame,
      transition.questEvents
    )

  saveGame(
    updatedGame
  )

  return updatedGame
}

/*
  ========================================
  ATUALIZAR LOCALIZAÇÃO DA CENA
  ========================================

  Executado pelo Game.jsx quando a
  próxima cena entra em tela.
*/

export function updateSceneLocation(
  game,
  scene
) {
  if (
    !game ||
    !scene?.location
  ) {
    return game
  }

  const currentId =
    game.world
      ?.location
      ?.id

  if (
    currentId ===
    scene.location.id
  ) {
    return game
  }

  const updatedGame = {
    ...game,

    world: {
      ...(game.world ?? {}),

      location: {
        ...scene.location,
      },
    },
  }

  saveGame(
    updatedGame
  )

  return updatedGame
}
