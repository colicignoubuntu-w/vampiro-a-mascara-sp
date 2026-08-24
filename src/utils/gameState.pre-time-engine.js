import {
  GAME_SAVE_KEY,
  loadFinalCharacter,
} from './characterFinalizer'

export function saveGame(
  game
) {
  try {
    localStorage.setItem(
      GAME_SAVE_KEY,
      JSON.stringify(game)
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

export function loadGame() {
  const game =
    loadFinalCharacter()

  if (!game) {
    return null
  }

  return game
}

export function addMinutes(
  world,
  minutes
) {
  const currentHour =
    world?.hour ?? 23

  const currentMinute =
    world?.minute ?? 0

  const total =
    currentHour * 60 +
    currentMinute +
    Number(
      minutes ?? 0
    )

  const day =
    24 * 60

  const normalized =
    ((total % day) + day) %
    day

  return {
    ...world,

    hour:
      Math.floor(
        normalized / 60
      ),

    minute:
      normalized % 60,
  }
}

export function formatGameTime(
  world
) {
  const hour =
    String(
      world?.hour ?? 0
    ).padStart(
      2,
      '0'
    )

  const minute =
    String(
      world?.minute ?? 0
    ).padStart(
      2,
      '0'
    )

  return `${hour}:${minute}`
}

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

      historyType:
        'choice',

      choiceId:
        choice.id,

      text:
        choice.text,
    }
  )
}

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

      historyType:
        'test-choice',

      choiceId:
        choice.id,

      text:
        choice.text,

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

function applyNarrativeTransition(
  game,
  scene,
  transition
) {
  if (
    !transition.nextScene
  ) {
    throw new Error(
      'Transição sem nextScene.'
    )
  }

  const updatedWorld =
    addMinutes(
      {
        ...(game.world ??
          {}),

        location:
          scene.location ??
          game.world?.location ??
          null,
      },

      transition.timeMinutes ??
        0
    )

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
      transition.timeMinutes ??
      0,

    test:
      transition.test ??
      null,

    gameTime:
      formatGameTime(
        updatedWorld
      ),

    timestamp:
      new Date().toISOString(),
  }

  const updatedGame = {
    ...game,

    world:
      updatedWorld,

    flags: {
      ...(game.flags ??
        {}),

      ...(transition.flags ??
        {}),
    },

    history: [
      ...(game.history ??
        []),

      historyItem,
    ],

    story: {
      ...(game.story ??
        {}),

      previousScene:
        scene.id,

      scene:
        transition.nextScene,
    },

    lastRoll:
      transition.test ??
      game.lastRoll ??
      null,
  }

  saveGame(
    updatedGame
  )

  return updatedGame
}

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
      ...(game.world ??
        {}),

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