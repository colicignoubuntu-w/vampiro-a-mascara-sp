const preyProfiles = {
  soberPerson: {
    id: 'soberPerson',

    name:
      'Pessoa sozinha',

    description:
      'Uma pessoa aparentemente sóbria e sem sinais evidentes de intoxicação.',

    bloodAvailable: 4,

    danger: 3,

    effects: [],
  },

  drinkingPerson: {
    id: 'drinkingPerson',

    name:
      'Pessoa alcoolizada',

    description:
      'Alguém que claramente bebeu, mas ainda está relativamente consciente.',

    bloodAvailable: 4,

    danger: 2,

    effects: [
      {
        statusId:
          'alcoholLight',

        chance: 65,
      },
    ],
  },

  veryDrunkPerson: {
    id: 'veryDrunkPerson',

    name:
      'Pessoa muito bêbada',

    description:
      'Uma presa vulnerável, mas seu sangue está carregado de álcool.',

    bloodAvailable: 4,

    danger: 2,

    effects: [
      {
        statusId:
          'alcoholHeavy',

        chance: 85,
      },
    ],
  },

  stimulantUser: {
    id: 'stimulantUser',

    name:
      'Pessoa agitada',

    description:
      'A pessoa parece excessivamente desperta e inquieta.',

    bloodAvailable: 4,

    danger: 4,

    effects: [
      {
        statusId:
          'stimulantBlood',

        chance: 55,
      },
    ],
  },

  sedatedPerson: {
    id: 'sedatedPerson',

    name:
      'Pessoa sonolenta',

    description:
      'A pessoa demonstra sinais de sedação.',

    bloodAvailable: 4,

    danger: 2,

    effects: [
      {
        statusId:
          'sedativeBlood',

        chance: 50,
      },
    ],
  },

  homelessPerson: {
    id: 'homelessPerson',

    name:
      'Pessoa em situação de rua',

    description:
      'Uma pessoa vulnerável nas ruas. Alimentar-se dela envolve riscos e consequências morais.',

    bloodAvailable: 3,

    danger: 4,

    effects: [
      {
        statusId:
          'alcoholLight',

        chance: 25,
      },

      {
        statusId:
          'bloodbornePathogen',

        chance: 8,
      },
    ],
  },

  dog: {
    id: 'dog',

    name:
      'Cachorro',

    description:
      'Sangue animal sustenta, mas é menos satisfatório.',

    bloodAvailable: 2,

    danger: 3,

    animal: true,

    effects: [],
  },

  cat: {
    id: 'cat',

    name:
      'Gato',

    description:
      'Pouco sangue e uma presa difícil de capturar.',

    bloodAvailable: 1,

    danger: 4,

    animal: true,

    effects: [],
  },
}

const locationPrey = {
  rock_bar: [
    'soberPerson',
    'drinkingPerson',
    'veryDrunkPerson',
    'stimulantUser',
  ],

  luxury_bar: [
    'soberPerson',
    'drinkingPerson',
    'veryDrunkPerson',
  ],

  vesuvius: [
    'soberPerson',
    'drinkingPerson',
    'veryDrunkPerson',
    'stimulantUser',
  ],

  centro_street: [
    'soberPerson',
    'drinkingPerson',
    'homelessPerson',
    'dog',
    'cat',
  ],

  dangerous_alley: [
    'drinkingPerson',
    'veryDrunkPerson',
    'homelessPerson',
    'dog',
    'cat',
  ],
}

function randomItem(
  values
) {
  if (
    !values ||
    values.length === 0
  ) {
    return null
  }

  const index =
    Math.floor(
      Math.random() *
        values.length
    )

  return values[index]
}

function randomPercent() {
  return (
    Math.random() *
    100
  )
}

function getAppearancePenalty(
  game,
  method
) {
  const socialMethods = [
    'seduction',
    'street',
    'deception',
  ]

  if (
    !socialMethods.includes(
      method
    )
  ) {
    return 0
  }

  const body =
    game.appearance
      ?.bodyBlood ?? 0

  const clothes =
    game.appearance
      ?.clothesBlood ?? 0

  const severity =
    Math.max(
      body,
      clothes
    )

  if (severity === 1) {
    return -1
  }

  if (severity === 2) {
    return -2
  }

  if (severity >= 3) {
    return -3
  }

  return 0
}

export function generatePrey(
  locationId
) {
  const possible =
    locationPrey[
      locationId
    ]

  if (
    !possible ||
    possible.length === 0
  ) {
    return null
  }

  const preyId =
    randomItem(
      possible
    )

  const prey =
    preyProfiles[
      preyId
    ]

  if (!prey) {
    return null
  }

  return {
    ...prey,

    generatedId:
      `${prey.id}-${Date.now()}`,
  }
}

export function getPossiblePrey(
  locationId
) {
  const ids =
    locationPrey[
      locationId
    ] ?? []

  return ids
    .map(
      (id) =>
        preyProfiles[id]
    )
    .filter(Boolean)
}

export function calculateHuntingPool(
  game,
  method
) {
  let attributeLabel =
    'Carisma'

  let abilityLabel =
    'Lábia'

  let attributeValue = 1

  let abilityValue = 0

  let difficulty = 6

  if (
    method ===
    'seduction'
  ) {
    attributeLabel =
      'Carisma'

    abilityLabel =
      'Lábia'

    attributeValue =
      game.attributes
        ?.social
        ?.charisma ?? 1

    abilityValue =
      game.abilities
        ?.subterfuge ?? 0
  }

  if (
    method ===
    'street'
  ) {
    attributeLabel =
      'Carisma'

    abilityLabel =
      'Manha'

    attributeValue =
      game.attributes
        ?.social
        ?.charisma ?? 1

    abilityValue =
      game.abilities
        ?.streetwise ?? 0
  }

  if (
    method ===
    'deception'
  ) {
    attributeLabel =
      'Manipulação'

    abilityLabel =
      'Lábia'

    attributeValue =
      game.attributes
        ?.social
        ?.manipulation ?? 1

    abilityValue =
      game.abilities
        ?.subterfuge ?? 0
  }

  if (
    method ===
    'stealth'
  ) {
    attributeLabel =
      'Destreza'

    abilityLabel =
      'Furtividade'

    attributeValue =
      game.attributes
        ?.physical
        ?.dexterity ?? 1

    abilityValue =
      game.abilities
        ?.stealth ?? 0
  }

  const appearancePenalty =
    getAppearancePenalty(
      game,
      method
    )

  /*
    Em vez de reduzir diretamente
    os dados, aumentamos a dificuldade
    por estar ensanguentado.
  */

  difficulty =
    Math.max(
      2,
      Math.min(
        10,
        difficulty -
          appearancePenalty
      )
    )

  return {
    attributeLabel,

    abilityLabel,

    attributeValue,

    abilityValue,

    pool:
      Math.max(
        1,
        attributeValue +
          abilityValue
      ),

    difficulty,

    appearancePenalty,
  }
}

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

export function rollHuntingAttempt(
  game,
  method
) {
  const test =
    calculateHuntingPool(
      game,
      method
    )

  const dice =
    Array.from({
      length:
        test.pool,
    }).map(
      () => rollD10()
    )

  const successes =
    dice.filter(
      (die) =>
        die >=
        test.difficulty
    ).length

  const ones =
    dice.filter(
      (die) =>
        die === 1
    ).length

  const finalSuccesses =
    Math.max(
      0,
      successes -
        ones
    )

  let result =
    'failure'

  if (
    finalSuccesses > 0
  ) {
    result =
      'success'
  } else if (
    ones > 0 &&
    successes === 0
  ) {
    result =
      'botch'
  }

  return {
    ...test,

    dice,

    rawSuccesses:
      successes,

    ones,

    successes:
      finalSuccesses,

    result,
  }
}

export function determineBloodEffects(
  prey
) {
  if (
    !prey?.effects
  ) {
    return []
  }

  return prey.effects
    .filter(
      (effect) =>
        randomPercent() <
        effect.chance
    )
    .map(
      (effect) =>
        effect.statusId
    )
}

export {
  preyProfiles,
  locationPrey,
}