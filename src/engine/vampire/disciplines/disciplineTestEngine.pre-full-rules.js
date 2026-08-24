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

function rollDie() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function rollDice(
  amount
) {
  const pool =
    Math.max(
      1,
      safeNumber(
        amount,
        1
      )
    )

  return Array.from(
    {
      length: pool,
    },
    () => rollDie()
  )
}

function resolveRoll(
  dice,
  difficulty
) {
  const diff =
    Math.max(
      2,
      Math.min(
        10,
        safeNumber(
          difficulty,
          6
        )
      )
    )

  let rawSuccesses = 0
  let ones = 0

  for (
    const die of dice
  ) {
    if (
      die >= diff
    ) {
      rawSuccesses += 1
    }

    if (
      die === 1
    ) {
      ones += 1
    }
  }

  const net =
    rawSuccesses -
    ones

  if (
    net > 0
  ) {
    return {
      result:
        'success',

      successes:
        net,

      rawSuccesses,

      ones,
    }
  }

  if (
    rawSuccesses === 0 &&
    ones > 0
  ) {
    return {
      result:
        'botch',

      successes: 0,

      rawSuccesses: 0,

      ones,
    }
  }

  return {
    result:
      'failure',

    successes: 0,

    rawSuccesses,

    ones,
  }
}

function getAttribute(
  game,
  group,
  name
) {
  return safeNumber(
    game?.attributes
      ?.[group]
      ?.[name],
    0
  )
}

function getAbility(
  game,
  name
) {
  return safeNumber(
    game?.abilities
      ?.[name],
    0
  )
}

/*
  ========================================
  TESTES BASE POR PODER

  Depois refinamos individualmente
  segundo as regras de cada nível.
  ========================================
*/

export function buildDisciplineTest(
  game,
  evaluation
) {
  const power =
    evaluation?.power

  if (!power) {
    return null
  }

  if (
    !power.requiresTest
  ) {
    return {
      requiresTest:
        false,

      powerId:
        power.id,

      label:
        power.label,

      pool: 0,

      difficulty: 0,
    }
  }

  /*
    DOMINAÇÃO
    Manipulação + Liderança
  */

  if (
    power.discipline ===
    'dominate'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const leadership =
      getAbility(
        game,
        'leadership'
      )

    return {
      requiresTest:
        true,

      powerId:
        power.id,

      label:
        power.label,

      attribute:
        'Manipulação',

      ability:
        'Liderança',

      attributeValue:
        manipulation,

      abilityValue:
        leadership,

      pool:
        Math.max(
          1,
          manipulation +
            leadership
        ),

      difficulty: 6,
    }
  }

  /*
    PRESENÇA
    Carisma + Performance
  */

  if (
    power.discipline ===
    'presence'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const performance =
      getAbility(
        game,
        'performance'
      )

    return {
      requiresTest:
        true,

      powerId:
        power.id,

      label:
        power.label,

      attribute:
        'Carisma',

      ability:
        'Performance',

      attributeValue:
        charisma,

      abilityValue:
        performance,

      pool:
        Math.max(
          1,
          charisma +
            performance
        ),

      difficulty: 6,
    }
  }

  /*
    DEMÊNCIA
    Manipulação + Empatia
  */

  if (
    power.discipline ===
    'dementia'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const empathy =
      getAbility(
        game,
        'empathy'
      )

    return {
      requiresTest:
        true,

      powerId:
        power.id,

      label:
        power.label,

      attribute:
        'Manipulação',

      ability:
        'Empatia',

      attributeValue:
        manipulation,

      abilityValue:
        empathy,

      pool:
        Math.max(
          1,
          manipulation +
            empathy
        ),

      difficulty: 6,
    }
  }

  /*
    ANIMALISMO
    Carisma + Empatia com Animais
  */

  if (
    power.discipline ===
    'animalism'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const animalKen =
      getAbility(
        game,
        'animalKen'
      )

    return {
      requiresTest:
        true,

      powerId:
        power.id,

      label:
        power.label,

      attribute:
        'Carisma',

      ability:
        'Empatia com Animais',

      attributeValue:
        charisma,

      abilityValue:
        animalKen,

      pool:
        Math.max(
          1,
          charisma +
            animalKen
        ),

      difficulty: 6,
    }
  }

  /*
    AUSPÍCIOS quando exige teste
    Percepção + Empatia
  */

  if (
    power.discipline ===
    'auspex'
  ) {
    const perception =
      getAttribute(
        game,
        'mental',
        'perception'
      )

    const empathy =
      getAbility(
        game,
        'empathy'
      )

    return {
      requiresTest:
        true,

      powerId:
        power.id,

      label:
        power.label,

      attribute:
        'Percepção',

      ability:
        'Empatia',

      attributeValue:
        perception,

      abilityValue:
        empathy,

      pool:
        Math.max(
          1,
          perception +
            empathy
        ),

      difficulty: 6,
    }
  }

  /*
    TAUMATURGIA provisória
    Inteligência + Ocultismo

    Depois teremos caminhos separados.
  */

  if (
    power.discipline ===
    'thaumaturgy'
  ) {
    const intelligence =
      getAttribute(
        game,
        'mental',
        'intelligence'
      )

    const occult =
      getAbility(
        game,
        'occult'
      )

    return {
      requiresTest:
        true,

      powerId:
        power.id,

      label:
        power.label,

      attribute:
        'Inteligência',

      ability:
        'Ocultismo',

      attributeValue:
        intelligence,

      abilityValue:
        occult,

      pool:
        Math.max(
          1,
          intelligence +
            occult
        ),

      difficulty: 6,
    }
  }

  return {
    requiresTest:
      true,

    powerId:
      power.id,

    label:
      power.label,

    attribute:
      'Atributo',

    ability:
      'Habilidade',

    attributeValue: 1,

    abilityValue: 0,

    pool: 1,

    difficulty: 6,
  }
}

export function executeDisciplineTest(
  game,
  evaluation
) {
  const test =
    buildDisciplineTest(
      game,
      evaluation
    )

  if (!test) {
    return null
  }

  if (
    !test.requiresTest
  ) {
    return {
      ...test,

      dice: [],

      result:
        'success',

      successes: 1,

      automatic:
        true,
    }
  }

  const dice =
    rollDice(
      test.pool
    )

  const resolution =
    resolveRoll(
      dice,
      test.difficulty
    )

  return {
    ...test,

    dice,

    ...resolution,

    automatic:
      false,
  }
}

export default {
  buildDisciplineTest,
  executeDisciplineTest,
}