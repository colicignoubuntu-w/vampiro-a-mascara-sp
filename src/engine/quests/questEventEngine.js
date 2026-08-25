import {
  completeQuest,
  completeQuestObjective,
  failQuestObjective,
  revealQuestObjective,
  startQuest,
} from './questEngine'

function applyQuestEvent(
  game,
  event
) {
  if (!event?.type) {
    return game
  }

  switch (event.type) {
    case 'quest-start': {
      const result = startQuest(
        game,
        event.questId
      )

      return result.success
        ? result.game
        : game
    }

    case 'quest-objective-reveal':
      return revealQuestObjective(
        game,
        event.questId,
        event.objectiveId
      )

    case 'quest-objective-complete': {
      const result =
        completeQuestObjective(
          game,
          event.questId,
          event.objectiveId
        )

      return result.success
        ? result.game
        : game
    }

    case 'quest-objective-fail':
      return failQuestObjective(
        game,
        event.questId,
        event.objectiveId
      )

    case 'quest-complete': {
      const result = completeQuest(
        game,
        event.questId,
        {
          force:
            event.force === true,
        }
      )

      return result.success
        ? result.game
        : game
    }

    default:
      return game
  }
}

export function applyQuestEvents(
  game,
  events = []
) {
  const normalizedEvents =
    Array.isArray(events)
      ? events
      : [events]

  return normalizedEvents.reduce(
    applyQuestEvent,
    game
  )
}

