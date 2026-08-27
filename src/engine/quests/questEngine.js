import {
  getQuestDefinition,
} from '../../data/quests/quests'

function safeNumber(
  value,
  fallback = 0
) {
  const parsed = Number(value)

  return Number.isNaN(parsed)
    ? fallback
    : parsed
}

function getQuestStateMap(
  game
) {
  return {
    ...(game?.quests ?? {}),
  }
}

function createObjectiveState(
  objective
) {
  return {
    id: objective.id,
    completed: false,
    failed: false,
    revealed: !objective.hidden,
    completedAt: null,
  }
}

function getLatestCompletedObjectiveId(
  definition,
  quest
) {
  if (
    !definition ||
    !quest
  ) {
    return null
  }

  let latest = null

  for (
    const objective of
    definition.objectives
  ) {
    if (
      quest.objectives
        ?.[objective.id]
        ?.completed
    ) {
      latest =
        objective.id
    }
  }

  return latest
}

export function createQuestState(
  questId
) {
  const definition =
    getQuestDefinition(
      questId
    )

  if (!definition) {
    return null
  }

  return {
    id: definition.id,
    status:
      definition.initialStatus ??
      'locked',
    startedAt: null,
    completedAt: null,
    failedAt: null,
    objectives:
      definition.objectives.reduce(
        (
          result,
          objective
        ) => ({
          ...result,

          [objective.id]:
            createObjectiveState(
              objective
            ),
        }),
        {}
      ),
  }
}

export function initializeQuestSystem(
  game
) {
  if (!game) {
    return game
  }

  return {
    ...game,

    quests: {
      ...(game.quests ?? {}),
    },

    experience: {
      current:
        safeNumber(
          game?.experience
            ?.current,
          0
        ),

      spent:
        safeNumber(
          game?.experience
            ?.spent,
          0
        ),

      earned:
        safeNumber(
          game?.experience
            ?.earned,
          safeNumber(
            game?.experience
              ?.current,
            0
          ) +
          safeNumber(
            game?.experience
              ?.spent,
            0
          )
        ),
    },
  }
}

export function getQuestState(
  game,
  questId
) {
  return (
    game?.quests
      ?.[questId] ??
    null
  )
}

export function getQuestNarrativeText(
  game,
  questId
) {
  const definition =
    getQuestDefinition(
      questId
    )

  if (!definition) {
    return ''
  }

  const quest =
    getQuestState(
      game,
      questId
    )

  if (!quest) {
    return (
      definition.descriptions
        ?.default ??
      definition.description ??
      ''
    )
  }

  if (
    quest.status ===
      'completed'
  ) {
    return (
      definition.descriptions
        ?.completed ??
      definition.descriptions
        ?.[
          getLatestCompletedObjectiveId(
            definition,
            quest
          )
        ] ??
      definition.descriptions
        ?.default ??
      definition.description ??
      ''
    )
  }

  const latestObjectiveId =
    getLatestCompletedObjectiveId(
      definition,
      quest
    )

  if (
    latestObjectiveId &&
    definition.descriptions
      ?.[latestObjectiveId]
  ) {
    return (
      definition.descriptions[
        latestObjectiveId
      ]
    )
  }

  return (
    definition.descriptions
      ?.default ??
    definition.description ??
    ''
  )
}

export function startQuest(
  game,
  questId
) {
  const definition =
    getQuestDefinition(
      questId
    )

  if (
    !game ||
    !definition
  ) {
    return {
      success: false,
      game,
      reason:
        'quest-not-found',
    }
  }

  const quests =
    getQuestStateMap(
      game
    )

  const existing =
    quests[questId]

  if (
    existing?.status ===
      'active' ||
    existing?.status ===
      'completed'
  ) {
    return {
      success: false,
      game,
      reason:
        'quest-already-started',
    }
  }

  const state =
    createQuestState(
      questId
    )

  state.status =
    'active'

  state.startedAt =
    new Date()
      .toISOString()

  const updatedGame = {
    ...game,

    quests: {
      ...quests,

      [questId]:
        state,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'quest-start',

        questId,

        title:
          definition.title,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,
    game: updatedGame,
    quest: state,
  }
}

export function revealQuestObjective(
  game,
  questId,
  objectiveId
) {
  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !quest ||
    !quest.objectives
      ?.[objectiveId]
  ) {
    return game
  }

  if (
    quest.objectives[
      objectiveId
    ].revealed
  ) {
    return game
  }

  return {
    ...game,

    quests: {
      ...(game.quests ?? {}),

      [questId]: {
        ...quest,

        objectives: {
          ...quest.objectives,

          [objectiveId]: {
            ...quest
              .objectives[
                objectiveId
              ],

            revealed: true,
          },
        },
      },
    },
  }
}

function revealNextObjective(
  game,
  questId,
  completedObjectiveId
) {
  const definition =
    getQuestDefinition(
      questId
    )

  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !definition ||
    !quest
  ) {
    return game
  }

  const index =
    definition.objectives
      .findIndex(
        (objective) =>
          objective.id ===
          completedObjectiveId
      )

  if (
    index < 0 ||
    index >=
      definition.objectives.length -
        1
  ) {
    return game
  }

  const nextObjective =
    definition.objectives[
      index + 1
    ]

  if (!nextObjective) {
    return game
  }

  return revealQuestObjective(
    game,
    questId,
    nextObjective.id
  )
}

export function completeQuestObjective(
  game,
  questId,
  objectiveId
) {
  const definition =
    getQuestDefinition(
      questId
    )

  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !definition ||
    !quest ||
    quest.status !==
      'active'
  ) {
    return {
      success: false,
      game,
      reason:
        'quest-not-active',
    }
  }

  const objective =
    quest.objectives
      ?.[objectiveId]

  if (!objective) {
    return {
      success: false,
      game,
      reason:
        'objective-not-found',
    }
  }

  if (
    objective.completed
  ) {
    return {
      success: false,
      game,
      reason:
        'objective-already-completed',
    }
  }

  const updatedQuest = {
    ...quest,

    objectives: {
      ...quest.objectives,

      [objectiveId]: {
        ...objective,

        completed: true,
        revealed: true,

        completedAt:
          new Date()
            .toISOString(),
      },
    },
  }

  let updatedGame = {
    ...game,

    quests: {
      ...(game.quests ?? {}),

      [questId]:
        updatedQuest,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'quest-objective-complete',

        questId,
        objectiveId,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  updatedGame =
    revealNextObjective(
      updatedGame,
      questId,
      objectiveId
    )

  return {
    success: true,
    game: updatedGame,
    quest:
      updatedGame.quests[
        questId
      ],
  }
}

export function failQuestObjective(
  game,
  questId,
  objectiveId
) {
  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !quest ||
    quest.status !==
      'active' ||
    !quest.objectives
      ?.[objectiveId]
  ) {
    return game
  }

  return {
    ...game,

    quests: {
      ...(game.quests ?? {}),

      [questId]: {
        ...quest,

        objectives: {
          ...quest.objectives,

          [objectiveId]: {
            ...quest
              .objectives[
                objectiveId
              ],

            failed: true,
            revealed: true,
          },
        },
      },
    },
  }
}

export function isQuestReadyToComplete(
  game,
  questId
) {
  const definition =
    getQuestDefinition(
      questId
    )

  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !definition ||
    !quest ||
    quest.status !==
      'active'
  ) {
    return false
  }

  const requiredObjectives =
    definition.objectives
      .filter(
        (objective) =>
          objective.required
      )

  return requiredObjectives.every(
    (objective) =>
      Boolean(
        quest.objectives
          ?.[objective.id]
          ?.completed
      )
  )
}

export function addExperience(
  game,
  amount,
  reason =
    'experience'
) {
  const xp =
    Math.max(
      0,
      safeNumber(
        amount,
        0
      )
    )

  if (
    !game ||
    xp <= 0
  ) {
    return game
  }

  const current =
    safeNumber(
      game?.experience
        ?.current,
      0
    )

  const spent =
    safeNumber(
      game?.experience
        ?.spent,
      0
    )

  const earned =
    safeNumber(
      game?.experience
        ?.earned,
      current + spent
    )

  return {
    ...game,

    experience: {
      ...(game.experience ?? {}),

      current:
        current + xp,

      spent,

      earned:
        earned + xp,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'experience-gained',

        amount:
          xp,

        reason,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

function applyQuestRewardFlags(
  game,
  definition
) {
  if (
    !definition?.rewards
      ?.flags
  ) {
    return game
  }

  return {
    ...game,

    flags: {
      ...(game.flags ?? {}),

      ...definition.rewards
        .flags,
    },
  }
}

function unlockNextQuest(
  game,
  definition
) {
  const nextQuestId =
    definition?.nextQuest

  if (!nextQuestId) {
    return game
  }

  const nextDefinition =
    getQuestDefinition(
      nextQuestId
    )

  if (!nextDefinition) {
    return game
  }

  const existing =
    game?.quests
      ?.[nextQuestId]

  if (
    existing?.status ===
      'active' ||
    existing?.status ===
      'completed'
  ) {
    return game
  }

  const nextState =
    createQuestState(
      nextQuestId
    )

  if (!nextState) {
    return game
  }

  nextState.status =
    'active'

  nextState.startedAt =
    new Date()
      .toISOString()

  return {
    ...game,

    quests: {
      ...(game.quests ?? {}),

      [nextQuestId]:
        nextState,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'quest-unlocked',

        questId:
          nextQuestId,

        title:
          nextDefinition.title,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function completeQuest(
  game,
  questId,
  {
    force = false,
  } = {}
) {
  const definition =
    getQuestDefinition(
      questId
    )

  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !definition ||
    !quest ||
    quest.status !==
      'active'
  ) {
    return {
      success: false,
      game,
      reason:
        'quest-not-active',
    }
  }

  if (
    !force &&
    !isQuestReadyToComplete(
      game,
      questId
    )
  ) {
    return {
      success: false,
      game,
      reason:
        'required-objectives-incomplete',
    }
  }

  const completedQuest = {
    ...quest,

    status:
      'completed',

    completedAt:
      new Date()
        .toISOString(),
  }

  let updatedGame = {
    ...game,

    quests: {
      ...(game.quests ?? {}),

      [questId]:
        completedQuest,
    },
  }

  const rewardXp =
    safeNumber(
      definition.rewards
        ?.experience,
      0
    )

  if (
    rewardXp > 0
  ) {
    updatedGame =
      addExperience(
        updatedGame,
        rewardXp,
        `quest:${questId}`
      )
  }

  updatedGame =
    applyQuestRewardFlags(
      updatedGame,
      definition
    )

  updatedGame =
    unlockNextQuest(
      updatedGame,
      definition
    )

  updatedGame = {
    ...updatedGame,

    history: [
      ...(updatedGame.history ?? []),

      {
        type:
          'quest-complete',

        questId,

        title:
          definition.title,

        experience:
          rewardXp,

        nextQuest:
          definition.nextQuest ??
          null,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,
    game: updatedGame,
    quest: completedQuest,
    experience: rewardXp,
    nextQuest:
      definition.nextQuest ??
      null,
  }
}

export function failQuest(
  game,
  questId
) {
  const definition =
    getQuestDefinition(
      questId
    )

  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !definition ||
    !quest ||
    quest.status !==
      'active'
  ) {
    return {
      success: false,
      game,
      reason:
        'quest-not-active',
    }
  }

  const updatedQuest = {
    ...quest,

    status:
      'failed',

    failedAt:
      new Date()
        .toISOString(),
  }

  const updatedGame = {
    ...game,

    quests: {
      ...(game.quests ?? {}),

      [questId]:
        updatedQuest,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'quest-failed',

        questId,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,
    game: updatedGame,
  }
}

export function getQuestProgress(
  game,
  questId
) {
  const definition =
    getQuestDefinition(
      questId
    )

  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !definition ||
    !quest
  ) {
    return {
      completed: 0,
      total: 0,
      percent: 0,
    }
  }

  const visible =
    definition.objectives
      .filter(
        (objective) =>
          quest.objectives
            ?.[objective.id]
            ?.revealed
      )

  const completed =
    visible.filter(
      (objective) =>
        quest.objectives
          ?.[objective.id]
          ?.completed
    ).length

  const total =
    visible.length

  return {
    completed,
    total,

    percent:
      total > 0
        ? Math.round(
            (
              completed /
              total
            ) * 100
          )
        : 0,
  }
}

export function getQuestsByStatus(
  game,
  status
) {
  const quests =
    getQuestStateMap(
      game
    )

  return Object.values(
    quests
  ).filter(
    (quest) =>
      quest.status ===
      status
  )
}

export default {
  createQuestState,
  initializeQuestSystem,
  getQuestState,
  getQuestNarrativeText,
  startQuest,
  revealQuestObjective,
  completeQuestObjective,
  failQuestObjective,
  isQuestReadyToComplete,
  addExperience,
  completeQuest,
  failQuest,
  getQuestProgress,
  getQuestsByStatus,
}
