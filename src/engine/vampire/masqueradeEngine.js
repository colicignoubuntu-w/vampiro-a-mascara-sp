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

function clamp(
  value,
  min,
  max
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  )
}

/*
  ========================================
  NÍVEIS GERAIS DA MÁSCARA

  Mantemos score/level por compatibilidade
  com o HUD e sistemas já existentes.

  Mas agora existem três componentes:

  exposure
  evidence
  breach
  ========================================
*/

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

/*
  ========================================
  TIPOS DE EVIDÊNCIA
  ========================================
*/

export const EVIDENCE_TYPES = {
  witness: {
    id: 'witness',
    label: 'Testemunha',
  },

  camera: {
    id: 'camera',
    label: 'Câmera',
  },

  video: {
    id: 'video',
    label: 'Vídeo',
  },

  photo: {
    id: 'photo',
    label: 'Fotografia',
  },

  policeReport: {
    id: 'policeReport',
    label: 'Relatório policial',
  },

  medicalReport: {
    id: 'medicalReport',
    label: 'Relatório médico',
  },

  corpse: {
    id: 'corpse',
    label: 'Corpo',
  },

  digitalRecord: {
    id: 'digitalRecord',
    label: 'Registro digital',
  },

  physicalEvidence: {
    id: 'physicalEvidence',
    label: 'Evidência física',
  },
}

function getLevelByScore(
  score
) {
  const normalized =
    clamp(
      safeNumber(
        score,
        0
      ),
      0,
      4
    )

  return (
    Object.values(
      MASQUERADE_LEVELS
    ).find(
      (level) =>
        level.score ===
        normalized
    ) ??
    MASQUERADE_LEVELS.clean
  )
}

function normalizeArray(
  value
) {
  return Array.isArray(
    value
  )
    ? value
    : []
}

/*
  ========================================
  NORMALIZA SAVE ANTIGO
  ========================================
*/

export function normalizeMasquerade(
  game
) {
  const oldScore =
    safeNumber(
      game?.masquerade
        ?.score,
      0
    )

  const exposure =
    clamp(
      safeNumber(
        game?.masquerade
          ?.exposure,
        oldScore
      ),
      0,
      10
    )

  const evidence =
    normalizeArray(
      game?.masquerade
        ?.evidence
    )

  const witnesses =
    normalizeArray(
      game?.masquerade
        ?.witnesses
    )

  const incidents =
    normalizeArray(
      game?.masquerade
        ?.incidents
    )

  const breach =
    clamp(
      safeNumber(
        game?.masquerade
          ?.breach,
        oldScore >= 3
          ? oldScore - 2
          : 0
      ),
      0,
      4
    )

  /*
    O score geral é derivado dos
    componentes, mas limitado a 4
    para manter nosso HUD atual.
  */

  let score = 0

  if (
    exposure > 0
  ) {
    score = 1
  }

  if (
    exposure >= 2 ||
    evidence.length > 0
  ) {
    score = 2
  }

  if (
    breach > 0
  ) {
    score = 3
  }

  if (
    breach >= 2
  ) {
    score = 4
  }

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

    exposure,

    breach,

    witnesses,

    evidence,

    incidents,
  }
}

export function getMasqueradeState(
  game
) {
  return normalizeMasquerade(
    game
  )
}

/*
  ========================================
  TESTEMUNHAS
  ========================================
*/

export function addMasqueradeWitness(
  game,
  witness = {}
) {
  const state =
    normalizeMasquerade(
      game
    )

  const witnessId =
    witness.id ??
    `witness-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

  const existing =
    state.witnesses.find(
      (entry) =>
        entry.id ===
        witnessId
    )

  if (existing) {
    return game
  }

  const newWitness = {
    id:
      witnessId,

    name:
      witness.name ??
      'Testemunha',

    type:
      witness.type ??
      'human',

    status:
      witness.status ??
      'active',

    identifiedPlayer:
      Boolean(
        witness
          .identifiedPlayer
      ),

    knowsSupernatural:
      Boolean(
        witness
          .knowsSupernatural
      ),

    sawViolence:
      Boolean(
        witness
          .sawViolence
      ),

    sawDiscipline:
      Boolean(
        witness
          .sawDiscipline
      ),

    sawFeeding:
      Boolean(
        witness
          .sawFeeding
      ),

    sawUnnaturalStrength:
      Boolean(
        witness
          .sawUnnaturalStrength
      ),

    memoryAltered:
      Boolean(
        witness
          .memoryAltered
      ),

    credibility:
      clamp(
        safeNumber(
          witness.credibility,
          1
        ),
        0,
        3
      ),

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    ...game,

    masquerade: {
      ...state,

      witnesses: [
        ...state.witnesses,

        newWitness,
      ],
    },
  }
}

/*
  ========================================
  EVIDÊNCIAS
  ========================================
*/

export function addMasqueradeEvidence(
  game,
  evidence = {}
) {
  const state =
    normalizeMasquerade(
      game
    )

  const evidenceId =
    evidence.id ??
    `evidence-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

  const existing =
    state.evidence.find(
      (entry) =>
        entry.id ===
        evidenceId
    )

  if (existing) {
    return game
  }

  const newEvidence = {
    id:
      evidenceId,

    type:
      evidence.type ??
      'physicalEvidence',

    label:
      evidence.label ??
      EVIDENCE_TYPES[
        evidence.type
      ]?.label ??
      'Evidência',

    description:
      evidence.description ??
      '',

    severity:
      clamp(
        safeNumber(
          evidence.severity,
          1
        ),
        1,
        4
      ),

    status:
      evidence.status ??
      'active',

    location:
      evidence.location ??
      game.world
        ?.location ??
      null,

    sceneId:
      evidence.sceneId ??
      game.story
        ?.scene ??
      null,

    canBeRemoved:
      evidence.canBeRemoved ??
      true,

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    ...game,

    masquerade: {
      ...state,

      evidence: [
        ...state.evidence,

        newEvidence,
      ],
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'masquerade-evidence-created',

        evidenceId,

        evidenceType:
          newEvidence.type,

        severity:
          newEvidence.severity,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function removeMasqueradeEvidence(
  game,
  evidenceId,
  reason = 'Evidência removida'
) {
  const state =
    normalizeMasquerade(
      game
    )

  const evidence =
    state.evidence.find(
      (entry) =>
        entry.id ===
        evidenceId
    )

  if (
    !evidence ||
    evidence.status !==
      'active'
  ) {
    return game
  }

  const updatedEvidence =
    state.evidence.map(
      (entry) => {
        if (
          entry.id !==
          evidenceId
        ) {
          return entry
        }

        return {
          ...entry,

          status:
            'removed',

          removedReason:
            reason,

          removedAt:
            new Date()
              .toISOString(),
        }
      }
    )

  return {
    ...game,

    masquerade: {
      ...state,

      evidence:
        updatedEvidence,
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'masquerade-evidence-removed',

        evidenceId,

        reason,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

/*
  ========================================
  EXPOSIÇÃO

  Exposição significa:
  alguém viu algo estranho.

  Isso ainda NÃO significa
  quebra da Máscara.
  ========================================
*/

export function raiseMasqueradeExposure(
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

  const newExposure =
    clamp(
      state.exposure +
        Math.max(
          0,
          safeNumber(
            amount,
            1
          )
        ),
      0,
      10
    )

  const incident = {
    id:
      `masquerade-incident-${Date.now()}`,

    category:
      'exposure',

    reason,

    amount,

    sceneId,

    timestamp:
      new Date()
        .toISOString(),
  }

  const nextGame = {
    ...updatedGame,

    masquerade: {
      ...state,

      exposure:
        newExposure,

      incidents: [
        ...state.incidents,

        incident,
      ],
    },

    flags: {
      ...(updatedGame.flags ??
        {}),

      possibleMasqueradeRisk:
        newExposure > 0,
    },

    history: [
      ...(updatedGame.history ??
        []),

      {
        type:
          'masquerade-exposure',

        reason,

        amount,

        exposure:
          newExposure,

        sceneId,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return refreshMasqueradeScore(
    nextGame
  )
}

/*
  ========================================
  QUEBRA REAL DA MÁSCARA
  ========================================
*/

export function registerMasqueradeBreach(
  game,
  {
    amount = 1,
    reason = 'Violação da Máscara',
    sceneId = null,
  } = {}
) {
  const state =
    normalizeMasquerade(
      game
    )

  const newBreach =
    clamp(
      state.breach +
        Math.max(
          1,
          safeNumber(
            amount,
            1
          )
        ),
      0,
      4
    )

  const incident = {
    id:
      `masquerade-breach-${Date.now()}`,

    category:
      'breach',

    reason,

    amount,

    sceneId,

    timestamp:
      new Date()
        .toISOString(),
  }

  const updatedGame = {
    ...game,

    masquerade: {
      ...state,

      breach:
        newBreach,

      incidents: [
        ...state.incidents,

        incident,
      ],
    },

    flags: {
      ...(game.flags ??
        {}),

      possibleMasqueradeRisk:
        true,

      masqueradeBreach:
        true,

      severeMasqueradeBreach:
        newBreach >= 2,
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'masquerade-breach',

        reason,

        breach:
          newBreach,

        sceneId,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return refreshMasqueradeScore(
    updatedGame
  )
}

/*
  ========================================
  COMPATIBILIDADE

  Sistemas anteriores chamavam
  raiseMasqueradeRisk().

  Agora isso gera EXPOSIÇÃO,
  não uma quebra automática.
  ========================================
*/

export function raiseMasqueradeRisk(
  game,
  options = {}
) {
  return raiseMasqueradeExposure(
    game,
    options
  )
}

/*
  ========================================
  REDUZIR EXPOSIÇÃO
  ========================================
*/

export function reduceMasqueradeRisk(
  game,
  {
    amount = 1,
    reason = 'Exposição reduzida',
  } = {}
) {
  const state =
    normalizeMasquerade(
      game
    )

  const newExposure =
    Math.max(
      0,
      state.exposure -
        Math.max(
          0,
          safeNumber(
            amount,
            1
          )
        )
    )

  const updatedGame = {
    ...game,

    masquerade: {
      ...state,

      exposure:
        newExposure,
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'masquerade-exposure-reduced',

        reason,

        amount,

        exposure:
          newExposure,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return refreshMasqueradeScore(
    updatedGame
  )
}

/*
  ========================================
  INCIDENTES PADRÃO
  ========================================
*/

export function registerMasqueradeIncident(
  game,
  incidentType,
  context = {}
) {
  /*
    FORÇA SOBRENATURAL

    Alguém viu algo impossível,
    portanto gera exposição.

    Não gera quebra automaticamente.
  */

  if (
    incidentType ===
    'unnaturalStrength'
  ) {
    let updatedGame =
      raiseMasqueradeExposure(
        game,
        {
          amount: 1,

          reason:
            'Força claramente sobrenatural foi observada.',

          witnesses:
            context.witnesses ??
            [],

          sceneId:
            context.sceneId ??
            null,
        }
      )

    /*
      Testemunhas policiais também podem
      gerar um relatório posteriormente.

      Ainda não criamos o relatório aqui:
      isso acontecerá quando a cena tiver
      consequência policial real.
    */

    return updatedGame
  }

  /*
    DISCIPLINA PRESENCIADA
  */

  if (
    incidentType ===
    'disciplineSeen'
  ) {
    return raiseMasqueradeExposure(
      game,
      {
        amount: 2,

        reason:
          'Uma manifestação sobrenatural foi presenciada.',

        witnesses:
          context.witnesses ??
          [],

        sceneId:
          context.sceneId ??
          null,
      }
    )
  }

  /*
    ALIMENTAÇÃO PRESENCIADA
  */

  if (
    incidentType ===
    'feedingSeen'
  ) {
    let updatedGame =
      raiseMasqueradeExposure(
        game,
        {
          amount: 2,

          reason:
            'Alimentação vampírica foi presenciada.',

          witnesses:
            context.witnesses ??
            [],

          sceneId:
            context.sceneId ??
            null,
        }
      )

    updatedGame =
      addMasqueradeEvidence(
        updatedGame,
        {
          type:
            'witness',

          label:
            'Testemunha de alimentação',

          description:
            'Uma pessoa viu diretamente o vampiro se alimentar.',

          severity: 2,

          sceneId:
            context.sceneId ??
            null,
        }
      )

    return updatedGame
  }

  /*
    CORPO COM SINAIS INCOMUNS
  */

  if (
    incidentType ===
    'corpseWithBite'
  ) {
    let updatedGame =
      raiseMasqueradeExposure(
        game,
        {
          amount: 1,

          reason:
            'Um corpo apresenta sinais incomuns.',

          sceneId:
            context.sceneId ??
            null,
        }
      )

    updatedGame =
      addMasqueradeEvidence(
        updatedGame,
        {
          type:
            'corpse',

          label:
            'Corpo suspeito',

          description:
            'Um corpo apresenta ferimentos que podem levantar perguntas sobre a causa da morte.',

          severity: 2,

          sceneId:
            context.sceneId ??
            null,
        }
      )

    return updatedGame
  }

  /*
    NATUREZA VAMPÍRICA REVELADA
  */

  if (
    incidentType ===
    'obviousVampire'
  ) {
    let updatedGame =
      raiseMasqueradeExposure(
        game,
        {
          amount: 3,

          reason:
            'A natureza sobrenatural do vampiro foi revelada diretamente.',

          witnesses:
            context.witnesses ??
            [],

          sceneId:
            context.sceneId ??
            null,
        }
      )

    /*
      Ainda não chamamos isso automaticamente
      de quebra. Se não houver evidência
      duradoura e as testemunhas forem
      controladas, a situação pode ser contida.
    */

    return updatedGame
  }

  /*
    MUITAS TESTEMUNHAS + REGISTRO
  */

  if (
    incidentType ===
    'supernaturalMassWitness'
  ) {
    let updatedGame =
      raiseMasqueradeExposure(
        game,
        {
          amount: 4,

          reason:
            'Uma manifestação sobrenatural foi observada por várias pessoas.',

          witnesses:
            context.witnesses ??
            [],

          sceneId:
            context.sceneId ??
            null,
        }
      )

    updatedGame =
      addMasqueradeEvidence(
        updatedGame,
        {
          type:
            context.evidenceType ??
            'video',

          label:
            'Registro de manifestação sobrenatural',

          description:
            'Existe um registro potencialmente comprometedor do ocorrido.',

          severity: 4,

          sceneId:
            context.sceneId ??
            null,
        }
      )

    return updatedGame
  }

  return game
}

/*
  ========================================
  RELATÓRIO POLICIAL

  Será usado depois de uma abordagem
  em que os agentes presenciaram algo.
  ========================================
*/

export function createPoliceMasqueradeEvidence(
  game,
  {
    description =
      'Relatório policial descrevendo comportamento ou ocorrência incomum.',
    severity = 2,
    sceneId = null,
  } = {}
) {
  return addMasqueradeEvidence(
    game,
    {
      type:
        'policeReport',

      label:
        'Relatório policial',

      description,

      severity,

      sceneId,

      canBeRemoved:
        true,
    }
  )
}

/*
  ========================================
  AVALIAR SE A EXPOSIÇÃO VIROU QUEBRA
  ========================================
*/

export function evaluateMasqueradeBreach(
  game
) {
  const state =
    normalizeMasquerade(
      game
    )

  const activeEvidence =
    state.evidence.filter(
      (item) =>
        item.status ===
        'active'
    )

  const seriousEvidence =
    activeEvidence.filter(
      (item) =>
        safeNumber(
          item.severity,
          0
        ) >= 3
    )

  const activeWitnesses =
    state.witnesses.filter(
      (witness) =>
        witness.status ===
          'active' &&
        !witness.memoryAltered
    )

  /*
    Situação 1:
    evidência muito grave.
  */

  if (
    seriousEvidence.length >
    0
  ) {
    return {
      breach:
        true,

      severity: 1,

      reason:
        'Existe evidência sobrenatural grave ainda ativa.',
    }
  }

  /*
    Situação 2:
    muita exposição + evidência.
  */

  if (
    state.exposure >= 3 &&
    activeEvidence.length >
      0
  ) {
    return {
      breach:
        true,

      severity: 1,

      reason:
        'Exposição elevada combinada com evidência persistente.',
    }
  }

  /*
    Situação 3:
    muitas testemunhas confiáveis.
  */

  const credibleWitnesses =
    activeWitnesses.filter(
      (witness) =>
        safeNumber(
          witness.credibility,
          1
        ) >= 2
    )

  if (
    state.exposure >= 3 &&
    credibleWitnesses.length >=
      3
  ) {
    return {
      breach:
        true,

      severity: 1,

      reason:
        'Múltiplas testemunhas confiáveis presenciaram eventos sobrenaturais.',
    }
  }

  return {
    breach:
      false,

    severity: 0,

    reason:
      'A exposição ainda pode ser contida.',
  }
}

/*
  ========================================
  PROCESSAR AVALIAÇÃO
  ========================================
*/

export function processMasqueradeBreach(
  game
) {
  const assessment =
    evaluateMasqueradeBreach(
      game
    )

  if (
    !assessment.breach
  ) {
    return game
  }

  const state =
    normalizeMasquerade(
      game
    )

  /*
    Não duplica uma quebra já registrada
    para o mesmo estado.
  */

  if (
    state.breach > 0
  ) {
    return game
  }

  return registerMasqueradeBreach(
    game,
    {
      amount:
        assessment.severity,

      reason:
        assessment.reason,

      sceneId:
        game.story
          ?.scene ??
        null,
    }
  )
}

/*
  ========================================
  ALTERAR MEMÓRIA DE TESTEMUNHA

  Estamos criando a função AGORA,
  mas isso não significa que qualquer
  personagem pode usá-la.

  Mais tarde Dominação chamará esta
  função somente após um uso válido
  da Disciplina.
  ========================================
*/

export function markWitnessMemoryAltered(
  game,
  witnessId,
  reason =
    'Memória da testemunha alterada'
) {
  const state =
    normalizeMasquerade(
      game
    )

  const exists =
    state.witnesses.some(
      (witness) =>
        witness.id ===
        witnessId
    )

  if (!exists) {
    return game
  }

  const witnesses =
    state.witnesses.map(
      (witness) => {
        if (
          witness.id !==
          witnessId
        ) {
          return witness
        }

        return {
          ...witness,

          memoryAltered:
            true,

          status:
            'contained',

          memoryAlteredAt:
            new Date()
              .toISOString(),
        }
      }
    )

  const updatedGame = {
    ...game,

    masquerade: {
      ...state,

      witnesses,
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'masquerade-witness-contained',

        witnessId,

        reason,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return refreshMasqueradeScore(
    updatedGame
  )
}

/*
  ========================================
  SCORE DERIVADO
  ========================================
*/

export function refreshMasqueradeScore(
  game
) {
  const state =
    normalizeMasquerade(
      game
    )

  let score = 0

  const activeEvidence =
    state.evidence.filter(
      (item) =>
        item.status ===
        'active'
    )

  const activeWitnesses =
    state.witnesses.filter(
      (witness) =>
        witness.status ===
          'active' &&
        !witness.memoryAltered
    )

  if (
    state.exposure > 0 ||
    activeWitnesses.length >
      0
  ) {
    score = 1
  }

  if (
    state.exposure >= 2 ||
    activeEvidence.length >
      0
  ) {
    score = 2
  }

  if (
    state.breach > 0
  ) {
    score = 3
  }

  if (
    state.breach >= 2
  ) {
    score = 4
  }

  const level =
    getLevelByScore(
      score
    )

  return {
    ...game,

    masquerade: {
      ...state,

      score:
        level.score,

      level:
        level.id,

      label:
        level.label,
    },

    flags: {
      ...(game.flags ??
        {}),

      possibleMasqueradeRisk:
        state.exposure > 0 ||
        activeEvidence.length >
          0,

      masqueradeBreach:
        state.breach > 0,

      severeMasqueradeBreach:
        state.breach >= 2,
    },
  }
}

/*
  ========================================
  COMPATIBILIDADE
  ========================================
*/

export function shouldTriggerMasqueradeScene(
  game
) {
  const assessment =
    evaluateMasqueradeBreach(
      game
    )

  return (
    assessment.breach ||
    normalizeMasquerade(
      game
    ).breach > 0
  )
}