function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value)

  return Number.isNaN(
    number
  )
    ? fallback
    : number
}

/*
  ========================================
  IDENTIFICA O TURNO ATUAL

  O contador de sangue pertence ao
  encounter + rodada atual.

  Quando combat.round muda, o marcador
  muda automaticamente e o gasto volta
  a ser considerado 0.
  ========================================
*/

function getCombatTurnMarker(
  game
) {
  const encounterId =
    game?.combat
      ?.encounterId ??
    'outside-combat'

  const round =
    Math.max(
      1,
      safeNumber(
        game?.combat
          ?.round,
        1
      )
    )

  return (
    `${encounterId}:${round}`
  )
}

/*
  ========================================
  LIMITE DE SANGUE POR TURNO

  O valor já vem da geração:

  13ª = 1
  12ª = 1
  11ª = 1
  10ª = 1
   9ª = 2
   8ª = 3
  ========================================
*/

export function getBloodPerTurnLimit(
  game
) {
  return Math.max(
    1,
    safeNumber(
      game?.blood
        ?.perTurn,
      1
    )
  )
}

/*
  ========================================
  QUANTO JÁ FOI GASTO NESTE TURNO
  ========================================
*/

export function getBloodSpentThisTurn(
  game
) {
  const currentMarker =
    getCombatTurnMarker(
      game
    )

  const savedMarker =
    game?.blood
      ?.turnMarker

  /*
    Se mudou encounter ou rodada,
    começa um novo contador.
  */

  if (
    savedMarker !==
    currentMarker
  ) {
    return 0
  }

  return Math.max(
    0,
    safeNumber(
      game?.blood
        ?.spentThisTurn,
      0
    )
  )
}

/*
  ========================================
  QUANTO AINDA PODE GASTAR
  ========================================
*/

export function getBloodRemainingThisTurn(
  game
) {
  const limit =
    getBloodPerTurnLimit(
      game
    )

  const spent =
    getBloodSpentThisTurn(
      game
    )

  return Math.max(
    0,
    limit - spent
  )
}

/*
  ========================================
  VERIFICA SE PODE GASTAR
  ========================================
*/

export function canSpendBloodThisTurn({
  game,
  amount = 1,
}) {
  if (!game) {
    return {
      allowed: false,

      reason:
        'invalid-game',

      message:
        'Estado do jogo inválido.',

      limit: 0,

      spent: 0,

      remaining: 0,
    }
  }

  const requested =
    Math.max(
      0,
      safeNumber(
        amount,
        0
      )
    )

  const currentBlood =
    Math.max(
      0,
      safeNumber(
        game?.blood
          ?.current,
        0
      )
    )

  const limit =
    getBloodPerTurnLimit(
      game
    )

  const spent =
    getBloodSpentThisTurn(
      game
    )

  const remaining =
    Math.max(
      0,
      limit - spent
    )

  /*
    Gasto zero é permitido.
  */

  if (
    requested <= 0
  ) {
    return {
      allowed: true,

      reason: null,

      message: null,

      requested,

      limit,

      spent,

      remaining,
    }
  }

  /*
    Não possui vitae suficiente.
  */

  if (
    currentBlood <
    requested
  ) {
    return {
      allowed: false,

      reason:
        'not-enough-blood',

      message:
        'Você não possui sangue suficiente.',

      requested,

      limit,

      spent,

      remaining,
    }
  }

  /*
    Ultrapassaria o limite da geração.
  */

  if (
    requested >
    remaining
  ) {
    return {
      allowed: false,

      reason:
        'blood-per-turn-limit',

      message:
        `Limite de sangue por turno atingido: ${spent}/${limit}.`,

      requested,

      limit,

      spent,

      remaining,
    }
  }

  return {
    allowed: true,

    reason: null,

    message: null,

    requested,

    limit,

    spent,

    remaining,
  }
}

/*
  ========================================
  GASTA SANGUE

  Essa deve ser a função central para
  gastos de vitae durante combate.

  Cura, aumento físico e posteriormente
  Disciplinas devem passar por aqui.
  ========================================
*/

export function spendBloodThisTurn({
  game,
  amount = 1,
  reason = 'blood-spend',
}) {
  if (!game) {
    return {
      success: false,

      reason:
        'invalid-game',

      message:
        'Estado do jogo inválido.',

      game,
    }
  }

  const validation =
    canSpendBloodThisTurn({
      game,
      amount,
    })

  if (
    !validation.allowed
  ) {
    return {
      success: false,

      reason:
        validation.reason,

      message:
        validation.message,

      game,

      amount: 0,

      limit:
        validation.limit,

      spentThisTurn:
        validation.spent,

      remainingThisTurn:
        validation.remaining,
    }
  }

  const requested =
    validation.requested

  const marker =
    getCombatTurnMarker(
      game
    )

  const newSpent =
    validation.spent +
    requested

  const newCurrentBlood =
    Math.max(
      0,
      safeNumber(
        game?.blood
          ?.current,
        0
      ) -
      requested
    )

  const updatedGame = {
    ...game,

    blood: {
      ...(game.blood ??
        {}),

      current:
        newCurrentBlood,

      turnMarker:
        marker,

      spentThisTurn:
        newSpent,
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'blood-spend',

        reason,

        amount:
          requested,

        encounterId:
          game?.combat
            ?.encounterId ??
          null,

        round:
          game?.combat
            ?.round ??
          null,

        spentThisTurn:
          newSpent,

        perTurn:
          validation.limit,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,

    reason: null,

    message: null,

    game:
      updatedGame,

    amount:
      requested,

    limit:
      validation.limit,

    spentThisTurn:
      newSpent,

    remainingThisTurn:
      Math.max(
        0,
        validation.limit -
        newSpent
      ),
  }
}

/*
  ========================================
  INFORMAÇÕES PARA A INTERFACE
  ========================================
*/

export function getBloodTurnState(
  game
) {
  const limit =
    getBloodPerTurnLimit(
      game
    )

  const spent =
    getBloodSpentThisTurn(
      game
    )

  return {
    limit,

    spent,

    remaining:
      Math.max(
        0,
        limit - spent
      ),

    current:
      Math.max(
        0,
        safeNumber(
          game?.blood
            ?.current,
          0
        )
      ),

    maximum:
      Math.max(
        0,
        safeNumber(
          game?.blood
            ?.maximum,
          0
        )
      ),
  }
}

export default {
  getBloodPerTurnLimit,
  getBloodSpentThisTurn,
  getBloodRemainingThisTurn,
  canSpendBloodThisTurn,
  spendBloodThisTurn,
  getBloodTurnState,
}