import test from 'node:test'
import assert from 'node:assert/strict'
import scenes from '../src/data/scenes/index.js'
import { getTravelArrivalScene } from '../src/engine/travel/arrivalScene.js'
import { getAsylumConversation, rememberAsylumConversation, leaveAsylum, getAsylumScene } from '../src/engine/travel/asylumVisit.js'
import { getLocation } from '../src/data/world/locations.js'
import { updateSceneLocation } from '../src/utils/gameState.js'
const game = scene => ({ world: { day: 1, hour: 20, minute: 0, location: getLocation('asylum') }, story: { scene }, flags: {}, history: [] })

test('every visit arrives in the lobby without forcing Jeanette or mission conversations', () => {
  for (const flags of [{}, { metJanette: true }, { oceanSpiritObjectRecovered: true }, { jeanetteAgreedToMeet: true }, { gallerySabotageResolved: true }]) {
    const g = { ...game('free_roam'), flags }
    assert.equal(getTravelArrivalScene(g, getLocation('asylum')), 'asylum_lobby')
  }
  assert.equal(scenes.asylum_lobby.dialogue, null)
})
test('leaving a conversation saves its exact stage and actually reaches the streets', () => {
  const g = game('janette_therese')
  const left = leaveAsylum(g)
  assert.equal(left.flags.asylumResumeScene, 'janette_therese')
  assert.equal(left.world.location.id, 'consolacao')
  assert.equal(left.world.minute, 5)
  assert.equal(left.story.scene, 'free_roam')
  assert.equal(updateSceneLocation(left, scenes.free_roam), left)
  assert.equal(getAsylumConversation(JSON.parse(JSON.stringify(left))), 'janette_therese')
  assert.equal(g.world.location.id, 'asylum')
})
test('wandering does not overwrite a saved conversation with the lobby or free roam', () => {
  const saved = rememberAsylumConversation(game('janette_tung'))
  for (const scene of ['free_roam', 'asylum_lobby']) {
    const next = rememberAsylumConversation({ ...saved, story: { scene } })
    assert.equal(next.flags.asylumResumeScene, 'janette_tung')
  }
})
test('mission conversations remain opt-in and resolved quests do not restart the introduction', () => {
  assert.equal(getAsylumConversation({ flags: { oceanSpiritObjectRecovered: true } }), 'voerman_ocean_return')
  assert.equal(getAsylumConversation({ flags: { jeanetteAgreedToMeet: true } }), 'therese_reconciliation_return')
  assert.equal(getAsylumConversation({ flags: { gallerySabotageResolved: true } }), 'therese_gallery_confrontation')
  assert.equal(getAsylumConversation({ flags: { metJanette: true } }), 'janette_identity')
  assert.equal(getAsylumConversation({ flags: { jeanetteAgreedToMeet: true, voermanConflictResolved: true } }), null)
  assert.equal(getAsylumConversation({ flags: { asylumResumeScene: 'livia_bedroom' } }), 'asylum_entrance')
})

test('Asylum actions are ordinary scene choices: exit first, followed by the available speaker', () => {
  const g = game('asylum_lobby')
  const lobby = getAsylumScene(g, scenes.asylum_lobby)
  assert.equal(lobby.choices[0].asylumAction, 'leave')
  assert.equal(lobby.choices[1].text, 'Conversar com Jeanette.')
  const therese = getAsylumScene({ ...g, flags: { gallerySabotageResolved: true } }, scenes.asylum_lobby)
  assert.equal(therese.choices[1].text, 'Conversar com Therese.')
  assert.equal(getAsylumScene(game('free_roam'), scenes.free_roam).id, 'asylum_lobby')
  assert.equal(getAsylumScene(game('janette_therese'), scenes.janette_therese).choices[0].asylumAction, 'leave')
  assert.ok(lobby.choices.every(c => !/Circular|bastidores/.test(c.text)))
  assert.equal(scenes.asylum_lobby.choices.length, 0)
})
