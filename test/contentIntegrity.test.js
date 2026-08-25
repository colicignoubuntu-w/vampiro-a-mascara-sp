import assert from 'node:assert/strict'
import test from 'node:test'

import scenes from '../src/data/scenes/index.js'
import {
  getChoiceTest,
} from '../src/data/tests/index.js'
import {
  getAllQuestDefinitions,
} from '../src/data/quests/quests.js'
import {
  AUDIO_CATALOG,
  SCENE_AUDIO,
} from '../src/data/audio/audioCatalog.js'

function assertSceneExists(
  target,
  source
) {
  if (!target) {
    return
  }

  assert.ok(
    scenes[target],
    `${source} aponta para a cena inexistente "${target}".`
  )
}

test(
  'IDs e transições de cenas são válidos',
  () => {
    for (const [
      sceneId,
      scene,
    ] of Object.entries(scenes)) {
      assert.equal(
        scene.id,
        sceneId,
        `A chave "${sceneId}" não corresponde ao id da cena.`
      )

      for (const choice of
        scene.choices ?? []) {
        assertSceneExists(
          choice.nextScene,
          `${sceneId}.${choice.id}`
        )

        const choiceTest =
          getChoiceTest(
            sceneId,
            choice.id
          )

        for (const [
          result,
          outcome,
        ] of Object.entries(
          choiceTest?.outcomes ?? {}
        )) {
          assertSceneExists(
            outcome.nextScene,
            `${sceneId}.${choice.id}.${result}`
          )
        }
      }

      for (const choice of
        scene.disciplineChoices ?? []) {
        for (const field of [
          'successScene',
          'failureScene',
          'botchScene',
        ]) {
          assertSceneExists(
            choice[field],
            `${sceneId}.${choice.id}.${field}`
          )
        }
      }
    }
  }
)

test(
  'Definições de quests possuem IDs consistentes',
  () => {
    const definitions =
      getAllQuestDefinitions()
    const questIds = new Set(
      definitions.map(
        (quest) => quest.id
      )
    )

    assert.equal(
      questIds.size,
      definitions.length,
      'Existem IDs de quests duplicados.'
    )

    for (const quest of definitions) {
      const objectiveIds =
        quest.objectives.map(
          (objective) =>
            objective.id
        )

      assert.equal(
        new Set(objectiveIds).size,
        objectiveIds.length,
        `A quest "${quest.id}" possui objetivos duplicados.`
      )

      if (quest.nextQuest) {
        assert.ok(
          questIds.has(
            quest.nextQuest
          ),
          `A quest "${quest.id}" aponta para a quest inexistente "${quest.nextQuest}".`
        )
      }
    }
  }
)

test(
  'o julgamento acontece antes do apartamento de Lívia',
  () => {
    assert.equal(
      scenes.door.choices.find(
        (choice) =>
          choice.id === 'ask_livia'
      )?.nextScene,
      'jack_intro',
      'Perguntar por Lívia não pode pular o julgamento.'
    )

    assert.equal(
      scenes.prologue_end.choices.find(
        (choice) =>
          choice.id ===
            'follow_jack_after_trial'
      )?.nextScene,
      'jack_after_trial'
    )

    assert.equal(
      scenes.jack_after_trial_livia
        .choices.find(
          (choice) =>
            choice.id ===
              'go_livia_apartment_after_trial'
        )?.nextScene,
      'livia_apartment_arrival'
    )
  }
)

test(
  'catálogo de áudio referencia cenas e arquivos públicos',
  () => {
    for (const [
      channel,
      entries,
    ] of Object.entries(
      AUDIO_CATALOG
    )) {
      for (const [key, entry] of
        Object.entries(entries)) {
        assert.match(
          entry.src,
          /^\/audio\/.+\.mp3$/,
          `${channel}.${key} possui caminho inválido.`
        )
      }
    }

    for (const sceneId of
      Object.keys(SCENE_AUDIO)) {
      if (sceneId === 'main_menu') {
        continue
      }

      assert.ok(
        scenes[sceneId],
        `O áudio referencia a cena inexistente "${sceneId}".`
      )
    }
  }
)
