import {
  rollDicePool,
} from '../dice/rollTest'

function getAttribute(
  game,
  group,
  attribute
) {
  if (group === 'virtues') {
    return (
      game?.virtues
        ?.[attribute] ??
      0
    )
  }

  return (
    game?.attributes
      ?.[group]
      ?.[attribute] ??
    0
  )
}

function getAbility(
  game,
  ability
) {
  return (
    game?.abilities
      ?.[ability] ??
    0
  )
}

export function getHealthPenalty(
  game
) {
  const health =
    game?.health

  if (!health) {
    return 0
  }

  const currentLevel =
    health.currentLevel ?? 0

  if (
    currentLevel <= 0
  ) {
    return 0
  }

  const levels =
    health.levels ?? []

  if (
    levels.length === 0
  ) {
    return 0
  }

  const index =
    Math.min(
      currentLevel - 1,
      levels.length - 1
    )

  const level =
    levels[index]

  if (!level) {
    return 0
  }

  if (
    level.penalty === null ||
    level.penalty === undefined
  ) {
    return 0
  }

  return (
    Number(
      level.penalty
    ) || 0
  )
}

export function calculateTestPool(
  game,
  test
) {
  const attributeValue =
    getAttribute(
      game,
      test.attributeGroup,
      test.attribute
    )

  const abilityValue =
    getAbility(
      game,
      test.ability
    )

  const modifier =
    Number(
      test.modifier ?? 0
    )

  const healthPenalty =
    test.ignoreHealthPenalty
      ? 0
      : getHealthPenalty(
          game
        )

  const calculatedPool =
    attributeValue +
    abilityValue +
    modifier +
    healthPenalty

  /*
    Por enquanto sempre rolamos
    no mínimo 1 dado.

    Depois podemos implementar
    testes impossíveis quando a
    parada cair a zero.
  */

  const pool =
    Math.max(
      1,
      calculatedPool
    )

  return {
    pool,

    calculatedPool,

    attributeValue,

    abilityValue,

    modifier,

    healthPenalty,
  }
}

export function canSpendWillpower(
  game,
  test
) {
  /*
    Por padrão testes permitem
    gasto de Força de Vontade.

    Uma cena específica poderá
    definir:

    allowWillpower: false
  */

  if (
    test?.allowWillpower ===
    false
  ) {
    return false
  }

  const current =
    game?.willpower
      ?.current ?? 0

  return current > 0
}

export function executeTest(
  game,
  test,
  options = {}
) {
  const {
    spendWillpower = false,
  } = options

  const poolData =
    calculateTestPool(
      game,
      test
    )

  const willpowerAllowed =
    canSpendWillpower(
      game,
      test
    )

  const willpowerSpent =
    Boolean(
      spendWillpower &&
      willpowerAllowed
    )

  const automaticSuccesses =
    willpowerSpent
      ? 1
      : 0

  const roll =
    rollDicePool({
      pool:
        poolData.pool,

      difficulty:
        test.difficulty ??
        6,

      automaticSuccesses,
    })

  return {
    ...roll,

    testId:
      test.id,

    label:
      test.label,

    attribute:
      test.attribute,

    ability:
      test.ability,

    attributeValue:
      poolData.attributeValue,

    abilityValue:
      poolData.abilityValue,

    modifier:
      poolData.modifier,

    healthPenalty:
      poolData.healthPenalty,

    willpowerSpent,

    automaticSuccesses,

    timestamp:
      new Date().toISOString(),
  }
}
