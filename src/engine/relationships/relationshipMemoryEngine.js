import {
  adjustRelationshipMetric,
  getRelationshipState,
  setRelationshipContact,
  setRelationshipStatus,
} from './relationshipModel'

import {
  getRelationshipPersonality,
} from './relationshipPersonality'

const DAY = 1440

export const RELATIONSHIP_EVENT_LABELS = {
  cheatingSeen: 'Viu uma traição',
  lieDiscovered: 'Descobriu uma mentira',
  aggression: 'Sofreu agressão',
  abandonment: 'Foi abandonada',
  boundaryRespected: 'Limite respeitado',
  apology: 'Pedido de desculpas',
  protected: 'Foi protegida',
  thoughtfulGesture: 'Gesto de cuidado',
}

export function relationshipAbsoluteMinutes(world) {
  return (
    ((world?.day ?? 1) - 1) * DAY +
    (world?.hour ?? 0) * 60 +
    (world?.minute ?? 0)
  )
}

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(
      max,
      Number(value ?? 0)
    )
  )
}

function applyPatch(
  game,
  npcId,
  patch
) {
  let next = game

  for (
    const [key, amount]
    of Object.entries(patch)
  ) {
    next =
      adjustRelationshipMetric(
        next,
        npcId,
        key,
        amount
      )
  }

  return next
}

function memoryId(
  eventType,
  npcId,
  at
) {
  return (
    `${npcId}:${eventType}:${at}`
  )
}

function memoryText(
  eventType,
  context = {}
) {
  const subject =
    context.person ??
    context.with ??
    'outra pessoa'

  return {
    cheatingSeen:
      `Viu o personagem traindo a relação com ${subject}.`,

    lieDiscovered:
      context.about
        ? `Descobriu uma mentira sobre ${context.about}.`
        : 'Descobriu que o personagem mentiu para ela.',

    aggression:
      'O personagem a agrediu ou a ameaçou diretamente.',

    abandonment:
      context.reason
        ? `Foi abandonada quando precisava dele: ${context.reason}.`
        : 'Sentiu que o personagem a abandonou quando precisava dele.',

    boundaryRespected:
      'O personagem aceitou um limite sem insistir.',

    apology:
      context.about
        ? `O personagem pediu desculpas por ${context.about}.`
        : 'O personagem pediu desculpas por algo que a feriu.',

    protected:
      'O personagem a protegeu em uma situação de perigo.',

    thoughtfulGesture:
      'O personagem demonstrou cuidado sem exigir nada em troca.',
  }[eventType] ??
  eventType
}

function eventProfile(
  eventType,
  personality,
  state
) {
  const m =
    state.relationshipMetrics ??
    {}

  const affection =
    m.affection ?? 0

  const dependency =
    m.dependency ?? 0

  const bond =
    state.influence
      ?.bloodBond ??
    0

  switch (eventType) {
    case 'cheatingSeen': {
      const jealousy =
        personality.jealousy /
        100

      const attachment =
        personality.attachment /
        100

      const relationshipWeight =
        ['dating', 'intimate'].includes(
          state.status
        )
          ? 1
          : 0.55

      return {
        type: 'betrayal',
        intensity:
          clamp(
            55 +
            jealousy * 30 +
            attachment * 15,
            0,
            100
          ),

        permanent:
          false,

        patch: {
          trust:
            Math.round(
              -35 *
              relationshipWeight
            ),

          happiness:
            Math.round(
              -42 *
              relationshipWeight
            ),

          anger:
            Math.round(
              38 +
              jealousy * 28
            ),

          safety:
            Math.round(
              -18 *
              relationshipWeight
            ),

          affection:
            Math.round(
              -8 -
              attachment * 8
            ),

          fear:
            0,
        },
      }
    }

    case 'lieDiscovered': {
      const sensitivity =
        personality.lieSensitivity /
        100

      return {
        type: 'betrayal',
        intensity:
          clamp(
            40 +
            sensitivity * 45,
            0,
            100
          ),

        permanent:
          false,

        patch: {
          trust:
            Math.round(
              -18 -
              sensitivity * 22
            ),

          happiness:
            Math.round(
              -12 -
              sensitivity * 12
            ),

          anger:
            Math.round(
              12 +
              sensitivity * 22
            ),

          safety:
            Math.round(
              -7 -
              sensitivity * 8
            ),
        },
      }
    }

    case 'aggression': {
      const boundary =
        personality.boundarySensitivity /
        100

      const fearResponse =
        personality.fearResponse /
        100

      return {
        type: 'trauma',
        intensity:
          clamp(
            82 +
            boundary * 18,
            0,
            100
          ),

        permanent:
          true,

        patch: {
          trust: -55,
          happiness: -60,
          anger:
            Math.round(
              30 +
              boundary * 35
            ),

          fear:
            Math.round(
              35 +
              fearResponse * 45
            ),

          safety: -70,
          affection: -20,
          dependency:
            bond >= 2 ||
            dependency >= 65
              ? 8
              : 0,
        },
      }
    }

    case 'abandonment': {
      const sensitivity =
        personality
          .abandonmentSensitivity /
        100

      return {
        type: 'abandonment',
        intensity:
          clamp(
            45 +
            sensitivity * 45,
            0,
            100
          ),

        permanent:
          false,

        patch: {
          trust:
            Math.round(
              -12 -
              sensitivity * 20
            ),

          happiness:
            Math.round(
              -20 -
              sensitivity * 25
            ),

          anger:
            Math.round(
              10 +
              sensitivity * 20
            ),

          safety:
            Math.round(
              -8 -
              sensitivity * 14
            ),

          affection:
            affection >= 60
              ? -4
              : -8,
        },
      }
    }

    case 'boundaryRespected': {
      const sensitivity =
        personality.boundarySensitivity /
        100

      return {
        type: 'positive',
        intensity:
          clamp(
            28 +
            sensitivity * 32,
            0,
            100
          ),

        permanent:
          false,

        patch: {
          trust:
            Math.round(
              5 +
              sensitivity * 6
            ),

          happiness: 5,
          safety:
            Math.round(
              8 +
              sensitivity * 8
            ),

          anger: -4,
        },
      }
    }

    case 'apology': {
      const forgiveness =
        personality.forgiveness /
        100

      return {
        type: 'repair',
        intensity:
          clamp(
            20 +
            forgiveness * 40,
            0,
            100
          ),

        permanent:
          false,

        patch: {
          trust:
            Math.round(
              2 +
              forgiveness * 6
            ),

          happiness:
            Math.round(
              3 +
              forgiveness * 8
            ),

          anger:
            Math.round(
              -8 -
              forgiveness * 18
            ),

          safety:
            Math.round(
              1 +
              forgiveness * 4
            ),
        },
      }
    }

    case 'protected': {
      return {
        type: 'positive',
        intensity: 60,
        permanent: false,

        patch: {
          trust: 10,
          happiness: 8,
          safety: 14,
          affection: 5,
          fear: -5,
        },
      }
    }

    case 'thoughtfulGesture': {
      return {
        type: 'positive',
        intensity: 35,
        permanent: false,

        patch: {
          happiness: 7,
          affection: 5,
          trust: 3,
          anger: -3,
        },
      }
    }

    default:
      return {
        type: 'event',
        intensity: 20,
        permanent: false,
        patch: {},
      }
  }
}

function addMemory(
  game,
  npcId,
  memory
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

        memories: [
          ...(state.memories ?? []),
          memory,
        ],
      },
    },
  }
}

function latestNegativeMemory(
  state
) {
  return [
    ...(state?.memories ?? []),
  ]
    .filter(
      memory =>
        [
          'betrayal',
          'trauma',
          'abandonment',
        ].includes(
          memory.type
        ) &&
        !memory.resolved
    )
    .sort(
      (a, b) =>
        (b.at ?? 0) -
        (a.at ?? 0)
    )[0] ??
    null
}

function markMemoryResolved(
  game,
  npcId,
  memoryIdValue,
  resolution
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

        memories: (
          state.memories ??
          []
        ).map(
          memory =>
            memory.id ===
            memoryIdValue
              ? {
                  ...memory,
                  resolved: true,
                  resolution,
                }
              : memory
        ),
      },
    },
  }
}

function maybeChangeStatus(
  game,
  npcId,
  eventType
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  const m =
    state?.relationshipMetrics ??
    {}

  if (!state) {
    return game
  }

  if (
    eventType === 'aggression' &&
    [
      'dating',
      'intimate',
      'friendship',
    ].includes(
      state.status
    )
  ) {
    return setRelationshipStatus(
      game,
      npcId,
      'distant'
    )
  }

  if (
    eventType === 'cheatingSeen' &&
    state.status ===
      'dating' &&
    (
      (m.trust ?? 0) <= -20 ||
      (m.anger ?? 0) >= 75
    )
  ) {
    return setRelationshipStatus(
      game,
      npcId,
      'ex'
    )
  }

  return game
}

function maybeBlockContact(
  game,
  npcId,
  eventType
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  if (!state) {
    return game
  }

  const p =
    getRelationshipPersonality(
      npcId
    )

  const m =
    state.relationshipMetrics ??
    {}

  const shouldBlock =
    (
      eventType ===
        'aggression' &&
      (m.fear ?? 0) >= 55 &&
      p.independence >= 55
    ) ||
    (
      eventType ===
        'cheatingSeen' &&
      (m.anger ?? 0) >= 85 &&
      p.confrontation < 55
    )

  if (!shouldBlock) {
    return game
  }

  return setRelationshipContact(
    game,
    npcId,
    {
      blocked: true,
    }
  )
}

export function recordRelationshipEvent(
  input,
  npcId,
  eventType,
  context = {}
) {
  const state =
    getRelationshipState(
      input,
      npcId
    )

  if (!state) {
    throw new Error(
      'Relacionamento desconhecido.'
    )
  }

  const personality =
    getRelationshipPersonality(
      npcId
    )

  const profile =
    eventProfile(
      eventType,
      personality,
      state
    )

  const at =
    relationshipAbsoluteMinutes(
      input.world
    )

  const memory = {
    id:
      memoryId(
        eventType,
        npcId,
        at
      ),

    eventType,
    type:
      profile.type,

    text:
      memoryText(
        eventType,
        context
      ),

    intensity:
      Math.round(
        profile.intensity
      ),

    originalIntensity:
      Math.round(
        profile.intensity
      ),

    permanent:
      Boolean(
        profile.permanent
      ),

    resolved:
      false,

    at,

    context: {
      ...context,
    },
  }

  let game =
    applyPatch(
      input,
      npcId,
      profile.patch
    )

  game =
    addMemory(
      game,
      npcId,
      memory
    )

  game =
    maybeChangeStatus(
      game,
      npcId,
      eventType
    )

  game =
    maybeBlockContact(
      game,
      npcId,
      eventType
    )

  return {
    ...game,

    history: [
      ...(game.history ?? []),

      {
        type:
          'relationship-memory',

        npcId,
        eventType,
        memoryId:
          memory.id,
        at,
      },
    ],
  }
}

export function apologizeForLatestRelationshipHarm(
  input,
  npcId
) {
  const state =
    getRelationshipState(
      input,
      npcId
    )

  if (!state) {
    return input
  }

  const negative =
    latestNegativeMemory(
      state
    )

  let game =
    recordRelationshipEvent(
      input,
      npcId,
      'apology',
      {
        about:
          negative?.text ??
          'o que aconteceu',
      }
    )

  if (!negative) {
    return game
  }

  const personality =
    getRelationshipPersonality(
      npcId
    )

  const m =
    getRelationshipState(
      game,
      npcId
    )?.relationshipMetrics ??
    {}

  const canResolve =
    personality.forgiveness >= 55 &&
    (m.anger ?? 0) < 55 &&
    negative.type !== 'trauma'

  if (canResolve) {
    game =
      markMemoryResolved(
        game,
        npcId,
        negative.id,
        'apology-accepted'
      )
  }

  return game
}

export function relationshipMemorySummary(
  game,
  npcId
) {
  const state =
    getRelationshipState(
      game,
      npcId
    )

  const memories =
    state?.memories ??
    []

  const unresolved =
    memories.filter(
      memory =>
        !memory.resolved &&
        [
          'betrayal',
          'trauma',
          'abandonment',
        ].includes(
          memory.type
        )
    )

  const strongest =
    [...unresolved]
      .sort(
        (a, b) =>
          (b.intensity ?? 0) -
          (a.intensity ?? 0)
      )[0] ??
    null

  return {
    total:
      memories.length,

    unresolved:
      unresolved.length,

    strongest,

    latest:
      [...memories]
        .sort(
          (a, b) =>
            (b.at ?? 0) -
            (a.at ?? 0)
        )[0] ??
      null,
  }
}

export function relationshipMemoryDialogueHint(
  game,
  npcId
) {
  const summary =
    relationshipMemorySummary(
      game,
      npcId
    )

  const memory =
    summary.strongest

  if (!memory) {
    return null
  }

  if (
    memory.eventType ===
      'cheatingSeen'
  ) {
    return 'Você pode dizer que não significou nada. Eu vi.'
  }

  if (
    memory.eventType ===
      'lieDiscovered'
  ) {
    return 'O problema não é só o que aconteceu. É que você mentiu olhando para mim.'
  }

  if (
    memory.eventType ===
      'aggression'
  ) {
    return 'Depois do que você fez, eu não consigo simplesmente agir como antes.'
  }

  if (
    memory.eventType ===
      'abandonment'
  ) {
    return 'Quando eu precisei de você, você não estava lá.'
  }

  return memory.text
}

function decayTowardZero(
  value,
  amount
) {
  const current =
    Number(value ?? 0)

  if (current > 0) {
    return Math.max(
      0,
      current - amount
    )
  }

  if (current < 0) {
    return Math.min(
      0,
      current + amount
    )
  }

  return 0
}

function reconcileNpcMemory(
  game,
  npcId,
  elapsedDays
) {
  if (elapsedDays <= 0) {
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

  const personality =
    getRelationshipPersonality(
      npcId
    )

  const m =
    state.relationshipMetrics ??
    {}

  const forgivenessFactor =
    personality.forgiveness /
    100

  const independenceFactor =
    personality.independence /
    100

  const angerDecay =
    Math.max(
      1,
      Math.round(
        elapsedDays *
        (
          2 +
          forgivenessFactor * 4
        )
      )
    )

  const fearDecay =
    Math.max(
      0,
      Math.round(
        elapsedDays *
        (
          0.5 +
          independenceFactor
        )
      )
    )

  const happinessRecovery =
    Math.max(
      0,
      Math.round(
        elapsedDays * 1
      )
    )

  const nextMetrics = {
    ...m,

    anger:
      decayTowardZero(
        m.anger,
        angerDecay
      ),

    fear:
      decayTowardZero(
        m.fear,
        fearDecay
      ),

    happiness:
      decayTowardZero(
        m.happiness,
        happinessRecovery
      ),
  }

  const memories =
    (state.memories ?? [])
      .map(
        memory => {
          if (
            memory.permanent ||
            memory.resolved
          ) {
            return memory
          }

          const baseDecay =
            memory.type ===
              'positive'
              ? 2.5
              : memory.type ===
                  'repair'
                ? 3
                : 1

          const forgivenessBoost =
            memory.type ===
              'betrayal'
              ? forgivenessFactor *
                1.5
              : 0

          return {
            ...memory,

            intensity:
              Math.max(
                0,
                Math.round(
                  (
                    memory.intensity ??
                    0
                  ) -
                  elapsedDays *
                    (
                      baseDecay +
                      forgivenessBoost
                    )
                )
              ),
          }
        }
      )

  return {
    ...game,

    relationships: {
      ...(game.relationships ?? {}),

      [npcId]: {
        ...state,
        relationshipMetrics:
          nextMetrics,
        memories,
      },
    },
  }
}

export function reconcileRelationshipMemories(
  input
) {
  if (!input) {
    return input
  }

  const now =
    relationshipAbsoluteMinutes(
      input.world
    )

  const last =
    Number(
      input
        .relationshipMemoryClock ??
      now
    )

  const elapsed =
    Math.max(
      0,
      now - last
    )

  const elapsedDays =
    elapsed / DAY

  if (
    elapsedDays < 0.25
  ) {
    return {
      ...input,
      relationshipMemoryClock:
        input.relationshipMemoryClock ??
        now,
    }
  }

  let game =
    input

  for (
    const npcId
    of Object.keys(
      game.relationships ??
      {}
    )
  ) {
    game =
      reconcileNpcMemory(
        game,
        npcId,
        elapsedDays
      )
  }

  return {
    ...game,
    relationshipMemoryClock:
      now,
  }
}
