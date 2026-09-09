import test from 'node:test'
import assert from 'node:assert/strict'
import { getTravelArrivalScene } from '../src/engine/travel/arrivalScene.js'
import { getLocation } from '../src/data/world/locations.js'
import { updateSceneLocation } from '../src/utils/gameState.js'
import scenes from '../src/data/scenes/index.js'

// A district arrival must leave the old haven scene before scene-location
// synchronization runs again when the travel panel/event closes.
test('leaving the haven for a district preserves the destination on scene synchronization', () => {
  for (const oldScene of ['livia_apartment_haven', 'livia_apartment_inside', 'free_roam']) {
    for (const destinationId of ['liberdade', 'centro', 'pinheiros', 'bela_vista']) {
      const destination = getLocation(destinationId)
      const arrived = { story: { scene: oldScene }, world: { day: 2, hour: 21, minute: 35, location: destination } }
      const nextScene = getTravelArrivalScene(arrived, destination)
      assert.equal(nextScene, 'free_roam')
      const next = { ...arrived, story: { previousScene: oldScene, scene: nextScene } }
      assert.equal(updateSceneLocation(next, scenes[nextScene]), next)
      assert.equal(next.world.location.id, destinationId)
      assert.equal(next.world.minute, 35)
      const loaded = JSON.parse(JSON.stringify(next))
      assert.equal(updateSceneLocation(loaded, scenes[loaded.story.scene]).world.location.id, destinationId)
    }
  }
})

test('special destinations keep their story arrivals and quest-dependent returns', () => {
  for (const [id, flags, expected] of [
    ['hospital_victor', {}, 'hospital_victor_arrival'],
    ['mercurio_apartment', { astroliteRecovered: true }, 'mercurio_return'],
    ['asylum', { jeanetteAgreedToMeet: true }, 'asylum_lobby'],
    ['asylum', { oceanSpiritObjectRecovered: true }, 'asylum_lobby'],
    ['asylum', { gallerySabotageResolved: true }, 'asylum_lobby'],
    ['vesuvius', { adderIdentified: true }, 'vesuvius_hatter_return'],
    ['livia_apartment', {}, 'livia_apartment_arrival'],
    ['livia_apartment', { visitedLiviaApartment: true }, 'livia_apartment_inside'],
    ['livia_apartment', { discoveredHospitalConnection: true }, 'free_roam'],
  ]) {
    const result = getTravelArrivalScene({ flags }, getLocation(id))
    assert.equal(result, expected)
    assert.ok(scenes[result], result)
  }
})
