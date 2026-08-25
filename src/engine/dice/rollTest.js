import {
  notifyDiceRoll,
} from './diceRollEvents'

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

export function rollDicePool({
  pool,
  difficulty = 6,
  automaticSuccesses = 0,
}) {
  notifyDiceRoll('dice-pool')

  const safePool =
    Math.max(
      1,
      Number(pool) || 1
    )

  const safeDifficulty =
    Math.max(
      2,
      Math.min(
        10,
        Number(difficulty) || 6
      )
    )

  const safeAutomaticSuccesses =
    Math.max(
      0,
      Number(
        automaticSuccesses
      ) || 0
    )

  const dice =
    Array.from({
      length: safePool,
    }).map(
      () => rollD10()
    )

  const rawSuccesses =
    dice.filter(
      (die) =>
        die >=
        safeDifficulty
    ).length

  const ones =
    dice.filter(
      (die) =>
        die === 1
    ).length

  /*
    Os resultados 1 cancelam
    sucessos obtidos NOS DADOS.

    Sucessos automáticos de
    Força de Vontade não são
    cancelados pelos resultados 1.
  */

  const diceSuccesses =
    Math.max(
      0,
      rawSuccesses - ones
    )

  const successes =
    diceSuccesses +
    safeAutomaticSuccesses

  /*
    Falha crítica só acontece
    se não houve nenhum sucesso
    nos dados e também não existe
    sucesso automático.
  */

  const isBotch =
    rawSuccesses === 0 &&
    ones > 0 &&
    safeAutomaticSuccesses === 0

  let result =
    'failure'

  if (successes > 0) {
    result =
      'success'
  } else if (isBotch) {
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

    diceSuccesses,

    automaticSuccesses:
      safeAutomaticSuccesses,

    successes,

    result,
  }
}
