import assert from 'node:assert/strict'
import test from 'node:test'

import {
  applyQuestEvents,
} from '../src/engine/quests/questEventEngine.js'
import {
  applyQuestStoryProgress,
} from '../src/engine/quests/questStoryBridge.js'

function createGame() {
  return {
    flags: {},
    history: [],
    quests: {},
    experience: {
      current: 0,
      earned: 0,
      spent: 0,
    },
  }
}

test(
  'eventos iniciam e avançam uma quest',
  () => {
    const game = applyQuestEvents(
      createGame(),
      [
        {
          type: 'quest-start',
          questId: 'first_hunt',
        },
        {
          type:
            'quest-objective-complete',
          questId: 'first_hunt',
          objectiveId:
            'find_first_victim',
        },
      ]
    )

    assert.equal(
      game.quests.first_hunt.status,
      'active'
    )
    assert.equal(
      game.quests.first_hunt
        .objectives.find_first_victim
        .completed,
      true
    )
  }
)

test(
  'conclusão concede XP somente uma vez',
  () => {
    const events = [
      {
        type: 'quest-start',
        questId: 'vicente_information',
      },
      {
        type: 'quest-objective-complete',
        questId: 'vicente_information',
        objectiveId: 'find_vicente',
      },
      {
        type: 'quest-objective-complete',
        questId: 'vicente_information',
        objectiveId:
          'get_information_from_vicente',
      },
      {
        type: 'quest-complete',
        questId: 'vicente_information',
      },
    ]

    const completed =
      applyQuestEvents(
        createGame(),
        events
      )
    const repeated =
      applyQuestEvents(
        completed,
        events.slice(-1)
      )

    assert.equal(
      completed.experience.current,
      2
    )
    assert.equal(
      repeated.experience.current,
      2
    )
    assert.equal(
      repeated.flags
        .vicenteInformation,
      true
    )
  }
)

test(
  'progressão automática estabiliza após revelar objetivos ocultos',
  () => {
    let game = {
      ...createGame(),
      story: {
        scene:
          'hospital_connection_discovered',
      },
      flags: {
        liviaApartmentUnlocked: true,
        visitedLiviaApartment: true,
        searchedLiviaApartment: true,
        foundLiviaDiary: true,
        inspectedLiviaComputer: true,
        discoveredHospitalConnection: true,
      },
    }

    for (let index = 0; index < 5; index += 1) {
      game =
        applyQuestStoryProgress(
          game
        )
    }

    assert.strictEqual(
      applyQuestStoryProgress(game),
      game,
      'A ponte não deve criar outro objeto sem progresso real.'
    )
  }
)
