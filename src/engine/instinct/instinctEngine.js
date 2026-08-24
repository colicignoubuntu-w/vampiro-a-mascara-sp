function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  )
}

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function rollPool(
  pool,
  difficulty
) {
  const safePool =
    Math.max(
      1,
      Number(pool) || 1
    )

  const safeDifficulty =
    clamp(
      Number(difficulty) || 6,
      2,
      10
    )

  const dice =
    Array.from({
      length: safePool,
    }).map(() =>
      rollD10()
    )

  const rawSuccesses =
    dice.filter(
      (die) =>
        die >= safeDifficulty
    ).length

  const ones =
    dice.filter(
      (die) =>
        die === 1
    ).length

  const successes =
    Math.max(
      0,
      rawSuccesses - ones
    )

  let result =
    'failure'

  if (
    successes > 0
  ) {
    result =
      'success'
  } else if (
    ones > 0 &&
    rawSuccesses === 0
  ) {
    result =
      'botch'
  }

  return {
    pool:
      safePool,

    difficulty:
      safeDifficulty,

    dice,

    rawSuccesses,

    ones,

    successes,

    result,
  }
}

/* ==========================================
   FOME
========================================== */

export function getHungerLevel(
  game
) {
  const current =
    Number(
      game?.blood?.current ??
      0
    )

  const maximum =
    Number(
      game?.blood?.maximum ??
      10
    )

  if (
    maximum <= 0
  ) {
    return 4
  }

  const ratio =
    current / maximum

  if (
    ratio >= 0.75
  ) {
    return 0
  }

  if (
    ratio >= 0.5
  ) {
    return 1
  }

  if (
    ratio >= 0.3
  ) {
    return 2
  }

  if (
    ratio >= 0.15
  ) {
    return 3
  }

  return 4
}

export function getHungerLabel(
  level
) {
  const labels = {
    0:
      'Saciado',

    1:
      'Inquieto',

    2:
      'Faminto',

    3:
      'Fome intensa',

    4:
      'À beira do frenesi',
  }

  return (
    labels[level] ??
    labels[0]
  )
}

/* ==========================================
   ESTÍMULOS DE SANGUE
========================================== */

const bloodStimuli = {
  trace: {
    label:
      'Vestígio de sangue',

    modifier: -1,
  },

  smell: {
    label:
      'Cheiro de sangue',

    modifier: 0,
  },

  visible: {
    label:
      'Sangue visível',

    modifier: 1,
  },

  bleedingHuman: {
    label:
      'Humano sangrando',

    modifier: 2,
  },

  severeBleeding: {
    label:
      'Hemorragia próxima',

    modifier: 3,
  },

  freshBloodTouch: {
    label:
      'Sangue fresco em contato',

    modifier: 4,
  },

  feeding: {
    label:
      'Você já está bebendo sangue',

    modifier: 3,
  },
}

/* ==========================================
   ESTÍMULOS DE FOGO
========================================== */

const fireStimuli = {
  cigarette: {
    label:
      'Cigarro aceso',

    difficulty: 3,
  },

  lighter: {
    label:
      'Isqueiro',

    difficulty: 4,
  },

  candle: {
    label:
      'Vela',

    difficulty: 4,
  },

  torch: {
    label:
      'Tocha',

    difficulty: 5,
  },

  bonfire: {
    label:
      'Fogueira',

    difficulty: 6,
  },

  roomFire: {
    label:
      'Incêndio em um cômodo',

    difficulty: 8,
  },

  burningBuilding: {
    label:
      'Prédio em chamas',

    difficulty: 9,
  },

  trappedInFire: {
    label:
      'Preso entre as chamas',

    difficulty: 10,
  },
}

/* ==========================================
   VIRTUDES
========================================== */

function getSelfControl(
  game
) {
  return (
    game?.virtues
      ?.selfControl ??
    1
  )
}

function getCourage(
  game
) {
  return (
    game?.virtues
      ?.courage ??
    1
  )
}

/* ==========================================
   DIFICULDADE DA FOME
========================================== */

export function calculateHungerDifficulty(
  game,
  stimulus = 'smell'
) {
  const hunger =
    getHungerLevel(
      game
    )

  const stimulusData =
    bloodStimuli[
      stimulus
    ] ??
    bloodStimuli.smell

  const base =
    3 + hunger

  return clamp(
    base +
      stimulusData.modifier,
    2,
    10
  )
}

/* ==========================================
   TESTE NORMAL DE FOME
========================================== */

export function rollHungerResistance(
  game,
  stimulus
) {
  const hungerLevel =
    getHungerLevel(
      game
    )

  const difficulty =
    calculateHungerDifficulty(
      game,
      stimulus
    )

  const pool =
    getSelfControl(
      game
    )

  const roll =
    rollPool(
      pool,
      difficulty
    )

  return {
    ...roll,

    type:
      'hunger',

    hungerLevel,

    hungerLabel:
      getHungerLabel(
        hungerLevel
      ),

    stimulus,

    stimulusLabel:
      bloodStimuli[
        stimulus
      ]?.label ??
      'Sangue',

    virtue:
      'Autocontrole',

    virtueValue:
      pool,
  }
}

/* ==========================================
   PRECISA TESTAR PARA PARAR?
========================================== */

export function mustRollToStopFeeding(
  game
) {
  const current =
    Number(
      game?.blood?.current ??
      0
    )

  /*
    4 pontos ou mais:
    normalmente consegue parar.

    Depois podemos permitir que
    estímulos especiais obriguem
    testes mesmo aqui.
  */

  return (
    current <= 3
  )
}

/* ==========================================
   DIFICULDADE PARA PARAR DE BEBER
========================================== */

export function calculateStopFeedingDifficulty(
  game,
  prey = null
) {
  const current =
    Number(
      game?.blood?.current ??
      0
    )

  let difficulty = 6

  if (
    current === 3
  ) {
    difficulty = 6
  }

  if (
    current === 2
  ) {
    difficulty = 7
  }

  if (
    current === 1
  ) {
    difficulty = 9
  }

  if (
    current <= 0
  ) {
    difficulty = 10
  }

  /*
    Uma vítima viva e já mordida
    é um estímulo especialmente
    forte.
  */

  if (
    prey &&
    !prey.animal
  ) {
    difficulty += 1
  }

  return clamp(
    difficulty,
    2,
    10
  )
}

/* ==========================================
   TESTE PARA PARAR DE BEBER
========================================== */

export function rollStopFeeding(
  game,
  prey = null
) {
  const pool =
    getSelfControl(
      game
    )

  const difficulty =
    calculateStopFeedingDifficulty(
      game,
      prey
    )

  const roll =
    rollPool(
      pool,
      difficulty
    )

  return {
    ...roll,

    type:
      'stopFeeding',

    stimulus:
      'feeding',

    stimulusLabel:
      'Sangue fresco durante a alimentação',

    virtue:
      'Autocontrole',

    virtueValue:
      pool,

    hungerLevel:
      getHungerLevel(
        game
      ),

    hungerLabel:
      getHungerLabel(
        getHungerLevel(
          game
        )
      ),
  }
}

/* ==========================================
   RÖTSCHRECK
========================================== */

export function rollFireResistance(
  game,
  stimulus
) {
  const fire =
    fireStimuli[
      stimulus
    ] ??
    fireStimuli.torch

  const pool =
    getCourage(
      game
    )

  const roll =
    rollPool(
      pool,
      fire.difficulty
    )

  return {
    ...roll,

    type:
      'rotschreck',

    stimulus,

    stimulusLabel:
      fire.label,

    virtue:
      'Coragem',

    virtueValue:
      pool,
  }
}

/* ==========================================
   TESTE GENÉRICO
========================================== */

export function executeInstinctCheck(
  game,
  check
) {
  if (
    check.type ===
    'hunger'
  ) {
    return (
      rollHungerResistance(
        game,
        check.stimulus
      )
    )
  }

  if (
    check.type ===
    'fire'
  ) {
    return (
      rollFireResistance(
        game,
        check.stimulus
      )
    )
  }

  if (
    check.type ===
    'stopFeeding'
  ) {
    return (
      rollStopFeeding(
        game,
        check.prey ??
        null
      )
    )
  }

  throw new Error(
    `Tipo de instinto inválido: ${check.type}`
  )
}

export {
  bloodStimuli,
  fireStimuli,
}