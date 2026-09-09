import test from 'node:test'
import assert from 'node:assert/strict'
import { getLocation, getMapDistricts, getDistrictPlaces } from '../src/data/world/locations.js'
import { PLACE_DISTRICTS } from '../src/data/world/districtLayout.js'
import { calculateTravel } from '../src/engine/travel/travelEngine.js'
import { getTravelArrivalScene } from '../src/engine/travel/arrivalScene.js'

test('city map contains only districts and no nested establishment markers', () => {
  const districts = getMapDistricts({ flags: { hospitalVictorDiscovered: true, oceanHouseUnlocked: true } })
  assert.ok(districts.some(d => d.id === 'vila_mariana'))
  for (const d of districts) {
    assert.equal(d.type, 'district')
    assert.equal(d.parentDistrictId, undefined)
  }
  for (const [id, parent] of Object.entries(PLACE_DISTRICTS)) {
    assert.ok(getLocation(parent), id)
    assert.equal(getLocation(id).showOnMap, false)
    assert.ok(!districts.some(d => d.id === id))
  }
})
test('clubs occupy distinct districts and separated coordinates', () => {
  assert.ok(getDistrictPlaces({}, 'consolacao').some(p => p.id === 'asylum'))
  assert.ok(!getDistrictPlaces({}, 'consolacao').some(p => p.id === 'vesuvius'))
  assert.ok(getDistrictPlaces({}, 'bela_vista').some(p => p.id === 'vesuvius'))
  const a = getLocation('asylum').coordinates, v = getLocation('vesuvius').coordinates
  assert.ok(Math.hypot(a.x - v.x, a.y - v.y) > 8)
})
test('district menus preserve discoveries and lead to the correct arrival scene', () => {
  assert.ok(!getDistrictPlaces({ flags: {} }, 'vila_mariana').some(p => p.id === 'hospital_victor'))
  const game = { flags: { hospitalVictorDiscovered: true }, world: { day: 1, hour: 20, minute: 0, location: getLocation('vila_mariana') } }
  assert.ok(getDistrictPlaces(game, 'vila_mariana').some(p => p.id === 'hospital_victor'))
  const trip = calculateTravel(game, 'hospital_victor', 'walking')
  assert.equal(trip.allowed, true)
  assert.ok(trip.minutes > 0)
  assert.equal(getTravelArrivalScene(game, trip.destination), 'hospital_victor_arrival')
  assert.ok(getDistrictPlaces({}, 'barra_funda').some(p => p.id === 'mercurio_apartment'))
  assert.ok(getDistrictPlaces({ flags: { liviaApartmentUnlocked: true } }, 'centro').some(p => p.id === 'livia_apartment'))
  assert.ok(!getDistrictPlaces({ flags: {} }, 'centro').some(p => p.id === 'lucky_star_motel'))
  assert.ok(getDistrictPlaces({ flags: { luckyStarUnlocked: true } }, 'centro').some(p => p.id === 'lucky_star_motel'))
  assert.ok(getDistrictPlaces({ flags: { oceanHouseUnlocked: true } }, 'santos').some(p => p.id === 'ocean_house_sp'))
})
