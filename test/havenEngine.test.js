import assert from 'node:assert/strict'
import test from 'node:test'
import { getHavenInvestigations, getHavenDestination, HAVEN_DESTINATIONS } from '../src/engine/haven/havenEngine.js'
import { applyQuestStoryProgress } from '../src/engine/quests/questStoryBridge.js'
import scenes from '../src/data/scenes/index.js'

function game(flags = {}, scene = 'livia_apartment_inside') {
  return applyQuestStoryProgress({ flags: { visitedLiviaApartment: true, liviaApartmentUnlocked: true, ...flags }, story: { scene }, quests: {}, experience: { current: 0, earned: 0, spent: 0 }, history: [] })
}

test('refuge next step follows discovered evidence without revealing the hospital early', () => {
  const cards = getHavenInvestigations(game())
  assert.equal(cards.length, 1)
  assert.equal(cards[0].next.sceneId, 'livia_apartment_search')
  assert.equal(cards[0].steps.length, 3)
  assert.doesNotMatch(JSON.stringify(cards), /Hospital Victor/)
  const searched = game({ searchedLiviaApartment: true })
  assert.equal(getHavenInvestigations(searched)[0].next.sceneId, 'livia_bedroom')
  const diary = game({ searchedLiviaApartment: true, foundLiviaDiary: true })
  assert.equal(getHavenInvestigations(diary)[0].next.sceneId, 'livia_computer')
  const computer = game({ searchedLiviaApartment: true, foundLiviaDiary: true, unlockedLiviaComputer: true })
  assert.equal(getHavenInvestigations(computer)[0].next.sceneId, 'livia_hospital_clue')
})
test('looking at login does not complete computer investigation; unlocking files does', () => {
  const locked = game({}, 'livia_computer')
  assert.equal(locked.quests.livia_legacy.objectives.inspect_livia_computer.completed, false)
  const unlocked = applyQuestStoryProgress({ ...locked, flags: { ...locked.flags, unlockedLiviaComputer: true }, story: { scene: 'livia_computer_unlocked' } })
  assert.equal(unlocked.quests.livia_legacy.objectives.inspect_livia_computer.completed, true)
})
test('computer remains unlocked on return and protected files cannot be opened early', () => {
  assert.equal(getHavenDestination(game(), 'livia_computer').sceneId, 'livia_computer')
  assert.equal(getHavenDestination(game(), 'livia_hospital_clue'), null)
  assert.equal(getHavenDestination(game(), 'livia_computer_unlocked'), null)
  assert.equal(getHavenDestination(game({ unlockedLiviaComputer: true }), 'livia_computer').sceneId, 'livia_computer_unlocked')
  assert.equal(getHavenDestination(game(), 'judgment_mission'), null)
})
test('hospital research resumes the saved stage and then directs the player to travel', () => {
  assert.equal(getHavenDestination(game(), 'strange_hospitals_records'), null)
  const discovered = game({ discoveredHospitalConnection: true })
  assert.equal(getHavenDestination(discovered, 'strange_hospitals_records').sceneId, 'strange_hospitals_records')
  const pattern = game({ discoveredHospitalConnection: true, hospitalDisappearancesInvestigated: true })
  assert.equal(getHavenDestination(pattern, 'strange_hospitals_records').sceneId, 'strange_hospitals_pattern')
  const address = game({ hospitalDisappearancePatternFound: true })
  assert.equal(getHavenDestination(address, 'strange_hospitals_records').sceneId, 'strange_hospitals_identified')
  const identified = game({ hospitalVictorDiscovered: true })
  assert.equal(getHavenInvestigations(identified).find(q => q.id === 'strange_hospitals').next.map, true)
  assert.equal(getHavenDestination(identified, 'strange_hospitals_records'), null)
})
test('completed investigations have no outstanding action', () => {
  const g = game({ searchedLiviaApartment: true, foundLiviaDiary: true, unlockedLiviaComputer: true, discoveredHospitalConnection: true, hospitalVictorIdentified: true, investigatedHospitalVictor: true, suspiciousAmbulanceDiscovered: true })
  const cards = getHavenInvestigations(g)
  assert.equal(cards.length, 2)
  assert.ok(cards.every(q => q.completed && q.next === null))
})
test('every refuge destination and return path points to an existing scene', () => {
  for (const id of Object.keys(HAVEN_DESTINATIONS)) assert.ok(scenes[id], id)
  for (const [scene, choice] of [['livia_apartment_search', 'return_livia_main_room'], ['livia_bedroom', 'bedroom_return'], ['livia_diary', 'diary_return_room'], ['livia_computer', 'computer_return_room'], ['livia_computer_unlocked', 'computer_return_room_unlocked']]) {
    assert.equal(scenes[scene].choices.find(c => c.id === choice).nextScene, 'free_roam')
  }
})
