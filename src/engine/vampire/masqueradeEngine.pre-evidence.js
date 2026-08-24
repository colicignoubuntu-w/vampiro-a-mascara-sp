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

export const MASQUERADE_LEVELS = {
  clean: {
    id: 'clean',
    label: 'Sem exposição',
    score: 0,
  },

  suspicious: {
    id: 'suspicious',
    label: 'Suspeita',
    score: 1,
  },

  exposed: {
    id: 'exposed',
    label: 'Exposição',
    score: 2,
  },

  breach: {
    id: 'breach',
    label: 'Quebra da Máscara',
    score: 3,
  },

  severe: {
    id: 'severe',
    label: 'Quebra Grave',
    score: 4,
  },
}

function getLevelByScore(
  score
) {
  const value =
    Math.max(
      0,
      Math.min(
        4,
        safeNumber(
          score,
          0
        )
      )
    )

  return (
    Object.values(
      MASQUERADE_LEVELS
    ).find(
      (level) =>
        level.score ===
        value
    ) ??
    MASQUERADE_LEVELS.clean
  )
}

export function normalizeMasquerade(
  game
) {
  const score =
    safeNumber(
      game?.masquerade
        ?.score,
      0
    )

  const level =
    getLevelByScore(
      score
    )

  return {
    score:
      level.score,

    level:
      level.id,

    label:
      level.label,

    witnesses:
      Array.isArray(
        game?.masquerade
          ?.witnesses
      )
        ? game.masquerade
            .witnesses
        : [],

    incidents:
      Array.isArray(
        game?.masquerade
          ?.incidents
      )
        ? game.masquerade
            .incidents
        : [],
  }
}

export function getMasqueradeState(
  game
) {
  return normalizeMasquerade(
    game
  )
}

export function addMasqueradeWitness(
  game,
  witness
) {
  const state =
    normalizeMasquerade(
      game
    )

  const witnessId =
    witness?.id ??
    `witness-${Date.now()}`

  const alreadyExists =
    state.witnesses.some(
      (entry) =>
        entry.id ===
        witnessId
    )

  if (
    alreadyExists
  ) {
    return game
  }

  return {
    ...game,

    masquerade: {
      ...state,

      witnesses: [
        ...state.witnesses,

        {
          id:
            witnessId,

          name:
            witness?.name ??
            'Testemunha',

          type:
            witness?.type ??
            'human',

          knowsSupernatural:
            Boolean(
              witness
                ?.knowsSupernatural
            ),

          sawViolence:
            Boolean(
              witness
                ?.sawViolence
            ),

          sawDiscipline:
            Boolean(
              witness
                ?.sawDiscipline
            ),

          sawFeeding:
            Boolean(
              witness
                ?.sawFeeding
            ),

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    },
  }
}

export function raiseMasqueradeRisk(
  game,
  {
    amount = 1,
    reason = 'Exposição sobrenatural',
    witnesses = [],
    sceneId = null,
  } = {}
) {
  let updatedGame =
    game

  for (
    const witness of witnesses
  ) {
    updatedGame =
      addMasqueradeWitness(
        updatedGame,
        witness
      )
  }

  const state =
    normalizeMasquerade(
      updatedGame
    )

  const newScore =
    Math.min(
      4,
      state.score +
        Math.max(
          0,
          safeNumber(
            amount,
            1
          )
        )
    )

  const newLevel =
    getLevelByScore(
      newScore
    )

  const incident = {
    id:
      `masquerade-${Date.now()}`,

    reason,

    amount,

    sceneId,

    levelBefore:
      state.level,

    levelAfter:
      newLevel.id,

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    ...updatedGame,

    masquerade: {
      ...normalizeMasquerade(
        updatedGame
      ),

      score:
        newScore,

      level:
        newLevel.id,

      label:
        newLevel.label,

      incidents: [
        ...normalizeMasquerade(
          updatedGame
        ).incidents,

        incident,
      ],
    },

    flags: {
      ...(updatedGame.flags ??
        {}),

      possibleMasqueradeRisk:
        newScore > 0,

      masqueradeBreach:
        newScore >= 3,

      severeMasqueradeBreach:
        newScore >= 4,
    },

    history: [
      ...(updatedGame.history ??
        []),

      {
        type:
          'masquerade-risk',

        reason,

        amount,

        score:
          newScore,

        level:
          newLevel.id,

        sceneId,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function reduceMasqueradeRisk(
  game,
  {
    amount = 1,
    reason = 'Risco reduzido',
  } = {}
) {
  const state =
    normalizeMasquerade(
      game
    )

  const newScore =
    Math.max(
      0,
      state.score -
        Math.max(
          0,
          safeNumber(
            amount,
            1
          )
        )
    )

  const newLevel =
    getLevelByScore(
      newScore
    )

  return {
    ...game,

    masquerade: {
      ...state,

      score:
        newScore,

      level:
        newLevel.id,

      label:
        newLevel.label,
    },

    flags: {
      ...(game.flags ??
        {}),

      possibleMasqueradeRisk:
        newScore > 0,

      masqueradeBreach:
        newScore >= 3,

      severeMasqueradeBreach:
        newScore >= 4,
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'masquerade-risk-reduced',

        reason,

        amount,

        score:
          newScore,

        level:
          newLevel.id,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function registerMasqueradeIncident(
  game,
  incidentType,
  context = {}
) {
  const configs = {
    suspiciousBehavior: {
      amount: 1,

      reason:
        'Comportamento suspeito diante de humanos.',
    },

    unnaturalStrength: {
      amount: 1,

      reason:
        'Uso visível de força claramente sobrenatural.',
    },

    disciplineSeen: {
      amount: 2,

      reason:
        'Uso de Disciplina presenciado por humanos.',
    },

    feedingSeen: {
      amount: 2,

      reason:
        'Alimentação vampírica presenciada.',
    },

    corpseWithBite: {
      amount: 2,

      reason:
        'Corpo encontrado com sinais incomuns de alimentação.',
    },

    obviousVampire: {
      amount: 3,

      reason:
        'Natureza vampírica revelada diretamente.',
    },

    supernaturalMassWitness: {
      amount: 4,

      reason:
        'Manifestação sobrenatural presenciada por várias pessoas.',
    },
  }

  const config =
    configs[
      incidentType
    ]

  if (!config) {
    return game
  }

  return raiseMasqueradeRisk(
    game,
    {
      amount:
        config.amount,

      reason:
        config.reason,

      witnesses:
        context.witnesses ??
        [],

      sceneId:
        context.sceneId ??
        null,
    }
  )
}

export function shouldTriggerMasqueradeScene(
  game
) {
  const state =
    normalizeMasquerade(
      game
    )

  return (
    state.score >= 3
  )
}