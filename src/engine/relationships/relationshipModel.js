import { RELATIONSHIP_NPCS } from '../../data/npcs/relationships/index.js'

export const RELATIONSHIP_STATUS = {
  unknown: 'Desconhecido',
  acquaintance: 'Conhecido',
  friendship: 'Amizade',
  intimate: 'Íntimo',
  dating: 'Namoro',
  distant: 'Afastado',
  ex: 'Ex',
  hostile: 'Hostil',
  enemy: 'Inimigo',
}

export const RELATIONSHIP_METRIC_CONFIG = {
  affection: {
    label: 'Afeto',
    min: -100,
    max: 100,
  },
  trust: {
    label: 'Confiança',
    min: -100,
    max: 100,
  },
  happiness: {
    label: 'Felicidade',
    min: -100,
    max: 100,
  },
  anger: {
    label: 'Raiva',
    min: 0,
    max: 100,
  },
  fear: {
    label: 'Medo',
    min: 0,
    max: 100,
  },
  safety: {
    label: 'Segurança',
    min: -100,
    max: 100,
  },
  attraction: {
    label: 'Atração',
    min: -100,
    max: 100,
  },
  dependency: {
    label: 'Dependência',
    min: 0,
    max: 100,
  },
}

export const DOMINATION_STATES = {
  none: 'Nenhuma',
  influenced: 'Influenciada',
  conditioned: 'Condicionada',
}

export const PRESENCE_STATES = {
  none: 'Nenhuma',
  enchanted: 'Encantada',
  obsessed: 'Obcecada',
}

export const DEFAULT_RELATIONSHIP_METRICS = {
  affection: 0,
  trust: 0,
  happiness: 0,
  anger: 0,
  fear: 0,
  safety: 0,
  attraction: 0,
  dependency: 0,
}

export const DEFAULT_INFLUENCE = {
  bloodBond: 0,
  domination: 'none',
  presence: 'none',
}

export const DEFAULT_CONTACT = {
  known: false,
  number: null,
  blocked: false,
}

function clamp(value, min, max) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return min <= 0 && max >= 0 ? 0 : min
  }

  return Math.max(min, Math.min(max, parsed))
}

export function clampRelationshipMetric(key, value) {
  const config = RELATIONSHIP_METRIC_CONFIG[key]

  if (!config) {
    return Number(value) || 0
  }

  return clamp(value, config.min, config.max)
}

function inferredStatus(state) {
  if (state?.status && RELATIONSHIP_STATUS[state.status]) {
    return state.status
  }

  if (state?.flags?.romance) {
    return 'dating'
  }

  if (state?.flags?.friendship) {
    return 'friendship'
  }

  if (state?.flags?.hostile || state?.flags?.enemy) {
    return state.flags.enemy ? 'enemy' : 'hostile'
  }

  if ((state?.journal?.length ?? 0) > 0) {
    return 'acquaintance'
  }

  return 'unknown'
}

function legacyContactKnown(state, npcId) {
  const flags = state?.flags ?? {}
  const id = String(npcId ?? '').toLowerCase()

  if (
    state?.contact?.known ||
    flags.hasContact ||
    flags.hasPhone ||
    flags.hasNumber ||
    flags.phoneNumber ||
    flags.contactNumber
  ) {
    return true
  }

  return Object.entries(flags).some(([key, value]) => {
    if (!value) {
      return false
    }

    const lower = key.toLowerCase()

    return (
      lower.includes('contact') ||
      lower.includes('phone') ||
      lower.includes('number') ||
      lower === `has${id}contact`
    )
  })
}

function modernFromLegacy(state) {
  const legacy = {
    trust: 0,
    affinity: 0,
    respect: 0,
    bond: 0,
    ...(state?.metrics ?? {}),
  }

  return {
    affection: clampRelationshipMetric(
      'affection',
      legacy.affinity * 10
    ),
    trust: clampRelationshipMetric(
      'trust',
      legacy.trust * 10
    ),
    happiness: clampRelationshipMetric(
      'happiness',
      Math.round(
        legacy.affinity * 3 +
        legacy.respect * 2
      )
    ),
    anger: 0,
    fear: 0,
    safety: clampRelationshipMetric(
      'safety',
      legacy.respect * 10
    ),
    attraction: clampRelationshipMetric(
      'attraction',
      legacy.affinity * 7
    ),
    dependency: 0,
  }
}

export function createRelationshipState(npcId) {
  const npc = RELATIONSHIP_NPCS[npcId]

  if (!npc) {
    return null
  }

  return {
    node: npc.start,
    readyAt: 0,

    // Compatibilidade com todas as cenas existentes.
    metrics: {
      trust: 0,
      affinity: 0,
      respect: 0,
      bond: 0,
    },

    // Novo modelo.
    status: 'unknown',
    relationshipMetrics: {
      ...DEFAULT_RELATIONSHIP_METRICS,
    },
    influence: {
      ...DEFAULT_INFLUENCE,
    },
    contact: {
      ...DEFAULT_CONTACT,
    },
    memories: [],

    flags: {},
    journal: [],
    completed: false,
    ending: null,
    deadlineAt: null,
  }
}

export function normalizeRelationshipState(state, npcId) {
  const base = createRelationshipState(npcId)

  if (!base) {
    return state ?? null
  }

  const source = state ?? {}
  const legacy = {
    ...base.metrics,
    ...(source.metrics ?? {}),
  }

  const migratedMetrics =
    source.relationshipMetrics ??
    modernFromLegacy({
      ...source,
      metrics: legacy,
    })

  const contactKnown =
    source.contact?.known ??
    legacyContactKnown(source, npcId)

  return {
    ...base,
    ...source,

    metrics: legacy,

    status:
      source.status ??
      inferredStatus(source),

    relationshipMetrics: {
      ...DEFAULT_RELATIONSHIP_METRICS,
      ...migratedMetrics,
    },

    influence: {
      ...DEFAULT_INFLUENCE,
      ...(source.influence ?? {}),
      bloodBond:
        source.influence?.bloodBond ??
        legacy.bond ??
        0,
    },

    contact: {
      ...DEFAULT_CONTACT,
      ...(source.contact ?? {}),
      known: Boolean(contactKnown),
      number:
        source.contact?.number ??
        source.flags?.phoneNumber ??
        source.flags?.contactNumber ??
        null,
    },

    memories:
      Array.isArray(source.memories)
        ? source.memories
        : [],

    flags: {
      ...(source.flags ?? {}),
    },

    journal:
      Array.isArray(source.journal)
        ? source.journal
        : [],
  }
}

export function normalizeRelationships(game) {
  if (!game) {
    return game
  }

  const relationships = {
    ...(game.relationships ?? {}),
  }

  for (const npcId of Object.keys(RELATIONSHIP_NPCS)) {
    if (relationships[npcId]) {
      relationships[npcId] =
        normalizeRelationshipState(
          relationships[npcId],
          npcId
        )
    }
  }

  return {
    ...game,
    relationships,
  }
}

export function getRelationshipState(game, npcId) {
  return normalizeRelationshipState(
    game?.relationships?.[npcId],
    npcId
  )
}

function addModernMetric(metrics, key, amount) {
  if (!RELATIONSHIP_METRIC_CONFIG[key]) {
    return metrics
  }

  return {
    ...metrics,
    [key]: clampRelationshipMetric(
      key,
      (metrics[key] ?? 0) + Number(amount ?? 0)
    ),
  }
}

export function applyRelationshipEffects(
  inputState,
  {
    legacy = {},
    relationshipMetrics = {},
    emotions = {},
    status,
    influence = {},
    contact = {},
    memory,
    memories = [],
    flags = {},
  } = {}
) {
  let state = normalizeRelationshipState(
    inputState,
    inputState?.id
  ) ?? inputState

  // Quando o npcId não está dentro do estado, não recriamos a base;
  // apenas trabalhamos com o estado já normalizado pelo engine.
  const modern = {
    ...DEFAULT_RELATIONSHIP_METRICS,
    ...(state?.relationshipMetrics ?? {}),
  }

  let updatedModern = {
    ...modern,
  }

  const legacyTrust = Number(legacy.trust ?? 0)
  const legacyAffinity = Number(legacy.affinity ?? 0)
  const legacyRespect = Number(legacy.respect ?? 0)

  if (legacyTrust) {
    updatedModern = addModernMetric(
      updatedModern,
      'trust',
      legacyTrust * 10
    )

    updatedModern = addModernMetric(
      updatedModern,
      'happiness',
      legacyTrust > 0
        ? legacyTrust * 2
        : legacyTrust * 4
    )
  }

  if (legacyAffinity) {
    updatedModern = addModernMetric(
      updatedModern,
      'affection',
      legacyAffinity * 10
    )

    updatedModern = addModernMetric(
      updatedModern,
      'attraction',
      legacyAffinity * 7
    )

    updatedModern = addModernMetric(
      updatedModern,
      'happiness',
      legacyAffinity * 2
    )
  }

  if (legacyRespect) {
    updatedModern = addModernMetric(
      updatedModern,
      'safety',
      legacyRespect * 10
    )

    updatedModern = addModernMetric(
      updatedModern,
      'happiness',
      legacyRespect > 0
        ? legacyRespect * 3
        : legacyRespect * 5
    )

    if (legacyRespect < 0) {
      updatedModern = addModernMetric(
        updatedModern,
        'anger',
        Math.abs(legacyRespect) * 5
      )
    }
  }

  for (const [key, amount] of Object.entries({
    ...relationshipMetrics,
    ...emotions,
  })) {
    updatedModern = addModernMetric(
      updatedModern,
      key,
      amount
    )
  }

  const nextInfluence = {
    ...DEFAULT_INFLUENCE,
    ...(state?.influence ?? {}),
    ...influence,
  }

  if (legacy.bond !== undefined) {
    nextInfluence.bloodBond = clamp(
      Number(
        state?.influence?.bloodBond ??
        state?.metrics?.bond ??
        0
      ) + Number(legacy.bond ?? 0),
      0,
      3
    )
  }

  const mergedFlags = {
    ...(state?.flags ?? {}),
    ...flags,
  }

  const shouldKnowContact =
    contact.known === true ||
    legacyContactKnown(
      {
        ...state,
        flags: mergedFlags,
        contact: {
          ...(state?.contact ?? {}),
          ...contact,
        },
      },
      ''
    )

  const nextMemories = [
    ...(state?.memories ?? []),
    ...(
      memory
        ? [memory]
        : []
    ),
    ...(
      Array.isArray(memories)
        ? memories
        : []
    ),
  ]

  let nextStatus =
    status ??
    state?.status ??
    'unknown'

  if (
    mergedFlags.romance &&
    !status
  ) {
    nextStatus = 'dating'
  } else if (
    mergedFlags.friendship &&
    !status &&
    !mergedFlags.romance
  ) {
    nextStatus = 'friendship'
  }

  return {
    ...state,

    status: nextStatus,

    relationshipMetrics:
      updatedModern,

    influence:
      nextInfluence,

    contact: {
      ...DEFAULT_CONTACT,
      ...(state?.contact ?? {}),
      ...contact,
      known: Boolean(
        shouldKnowContact ||
        state?.contact?.known
      ),
    },

    memories:
      nextMemories,

    flags:
      mergedFlags,
  }
}

export function relationshipMood(state) {
  const metrics =
    state?.relationshipMetrics ??
    DEFAULT_RELATIONSHIP_METRICS

  const anger = metrics.anger ?? 0
  const fear = metrics.fear ?? 0
  const happiness = metrics.happiness ?? 0
  const affection = metrics.affection ?? 0

  if (fear >= 70) {
    return 'Assustada'
  }

  if (anger >= 75) {
    return 'Com muita raiva'
  }

  if (
    happiness <= -55 &&
    affection >= 40
  ) {
    return 'Magoada'
  }

  if (happiness <= -45) {
    return 'Infeliz'
  }

  if (anger >= 45) {
    return 'Irritada'
  }

  if (
    affection >= 70 &&
    happiness >= 35
  ) {
    return 'Muito ligada a você'
  }

  if (happiness >= 55) {
    return 'Feliz'
  }

  if (happiness >= 20) {
    return 'Bem'
  }

  if (happiness <= -20) {
    return 'Abalada'
  }

  return 'Neutra'
}

export function describeMetric(key, value) {
  const number = Number(value ?? 0)

  if (
    key === 'anger' ||
    key === 'fear' ||
    key === 'dependency'
  ) {
    if (number >= 80) return 'Extrema'
    if (number >= 60) return 'Alta'
    if (number >= 35) return 'Moderada'
    if (number >= 15) return 'Baixa'
    return 'Nenhuma'
  }

  if (number >= 75) return 'Muito alta'
  if (number >= 40) return 'Alta'
  if (number >= 15) return 'Positiva'
  if (number > -15) return 'Neutra'
  if (number > -40) return 'Baixa'
  if (number > -75) return 'Muito baixa'
  return 'Rompida'
}

export function relationshipPresentation(state) {
  const normalized = {
    ...state,
    relationshipMetrics: {
      ...DEFAULT_RELATIONSHIP_METRICS,
      ...(state?.relationshipMetrics ?? {}),
    },
    influence: {
      ...DEFAULT_INFLUENCE,
      ...(state?.influence ?? {}),
    },
  }

  return {
    status:
      RELATIONSHIP_STATUS[
        normalized.status
      ] ??
      'Desconhecido',

    mood:
      relationshipMood(
        normalized
      ),

    affection:
      describeMetric(
        'affection',
        normalized.relationshipMetrics.affection
      ),

    trust:
      describeMetric(
        'trust',
        normalized.relationshipMetrics.trust
      ),

    safety:
      describeMetric(
        'safety',
        normalized.relationshipMetrics.safety
      ),

    bloodBond:
      normalized.influence.bloodBond ?? 0,
  }
}

export function updateRelationshipMetric(
  game,
  npcId,
  key,
  value
) {
  if (!RELATIONSHIP_METRIC_CONFIG[key]) {
    return game
  }

  const state =
    getRelationshipState(
      game,
      npcId
    )

  if (!state) {
    return game
  }

  return {
    ...game,
    relationships: {
      ...(game.relationships ?? {}),
      [npcId]: {
        ...state,
        relationshipMetrics: {
          ...state.relationshipMetrics,
          [key]:
            clampRelationshipMetric(
              key,
              value
            ),
        },
      },
    },
  }
}

export function adjustRelationshipMetric(
  game,
  npcId,
  key,
  amount
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  if (!state) {
    return game
  }

  return updateRelationshipMetric(
    game,
    npcId,
    key,
    (state.relationshipMetrics?.[key] ?? 0) +
      Number(amount ?? 0)
  )
}

export function setRelationshipStatus(
  game,
  npcId,
  status
) {
  if (!RELATIONSHIP_STATUS[status]) {
    return game
  }

  const state =
    getRelationshipState(
      game,
      npcId
    )

  if (!state) {
    return game
  }

  return {
    ...game,
    relationships: {
      ...(game.relationships ?? {}),
      [npcId]: {
        ...state,
        status,
      },
    },
  }
}

export function setRelationshipInfluence(
  game,
  npcId,
  patch
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  if (!state) {
    return game
  }

  return {
    ...game,
    relationships: {
      ...(game.relationships ?? {}),
      [npcId]: {
        ...state,

        influence: {
          ...state.influence,
          ...patch,

          ...(patch.bloodBond !== undefined
            ? {
                bloodBond:
                  clamp(
                    patch.bloodBond,
                    0,
                    3
                  ),
              }
            : {}),
        },

        metrics: {
          ...(state.metrics ?? {}),
          ...(patch.bloodBond !== undefined
            ? {
                bond:
                  clamp(
                    patch.bloodBond,
                    0,
                    3
                  ),
              }
            : {}),
        },
      },
    },
  }
}

export function setRelationshipContact(
  game,
  npcId,
  patch
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  if (!state) {
    return game
  }

  return {
    ...game,
    relationships: {
      ...(game.relationships ?? {}),
      [npcId]: {
        ...state,

        contact: {
          ...state.contact,
          ...patch,
        },
      },
    },
  }
}

export function resetRelationship(
  game,
  npcId
) {
  const clean =
    createRelationshipState(
      npcId
    )

  if (!clean) {
    return game
  }

  return {
    ...game,

    relationships: {
      ...(game.relationships ?? {}),
      [npcId]: clean,
    },

    history: [
      ...(game.history ?? []),
      {
        type:
          'dev-relationship-reset',
        npcId,
        timestamp:
          new Date().toISOString(),
      },
    ],
  }
}

export function resetAllRelationships(
  game
) {
  const relationships = {
    ...(game.relationships ?? {}),
  }

  for (const npcId of Object.keys(
    RELATIONSHIP_NPCS
  )) {
    relationships[npcId] =
      createRelationshipState(
        npcId
      )
  }

  return {
    ...game,
    relationships,

    history: [
      ...(game.history ?? []),
      {
        type:
          'dev-relationships-reset-all',
        timestamp:
          new Date().toISOString(),
      },
    ],
  }
}
