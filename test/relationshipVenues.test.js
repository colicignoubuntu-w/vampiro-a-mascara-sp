import test from 'node:test'
import assert from 'node:assert/strict'
import { RELATIONSHIP_NPCS } from '../src/data/npcs/relationships/index.js'
import { RELATIONSHIP_VENUES, venuesAt } from '../src/data/npcs/relationships/venues.js'
import { encountersAtVenue, performVenueChoice } from '../src/engine/relationships/venueEngine.js'
import { relationshipState } from '../src/engine/relationships/relationshipEngine.js'
const game = location => ({ world: { day: 1, hour: 20, minute: 0, location: { id: location } }, blood: { current: 10 }, history: [], flags: {} })

test('every scene is assigned to a venue in its actual district', () => {
  for (const npc of Object.values(RELATIONSHIP_NPCS)) {
    for (const scene of Object.values(npc.scenes)) {
      const venue = RELATIONSHIP_VENUES[scene.venueId]
      assert.ok(venue, `${npc.id}: ${scene.title}`)
      assert.ok(scene.locations.includes(venue.location))
    }
  }
})
test('first meetings appear only inside the correct venue', () => {
  for (const npc of Object.values(RELATIONSHIP_NPCS)) {
    const scene = npc.scenes[npc.start]
    const g = game(scene.locations[0])
    assert.ok(encountersAtVenue(g, scene.venueId).some(p => p.id === npc.id))
    assert.deepEqual(encountersAtVenue(game('livia_apartment'), scene.venueId), [])
  }
  assert.ok(venuesAt('pinheiros').some(v => v.name === 'Último Gole'))
  assert.throws(() => performVenueChoice(game('pinheiros'), 'pinheiros_streets', 'clara', 'arrival', 'observe'), /neste local/)
  const next = performVenueChoice(game('pinheiros'), 'ultimo_gole', 'clara', 'arrival', 'observe')
  assert.equal(next.relationships.clara.node, 'arrival_observe')
})
test('moving to another sublocation does not expose the next scene in the previous venue', () => {
  const g = game('liberdade')
  g.relationships = { mara: { ...relationshipState(g, 'mara'), node: 'book' } }
  assert.equal(encountersAtVenue(g, 'ritual_alley').length, 0)
  assert.equal(encountersAtVenue(g, 'sueli_books')[0].id, 'mara')
  g.relationships.mara.readyAt = 99999
  assert.equal(encountersAtVenue(g, 'sueli_books').length, 0)
  g.relationships.mara.readyAt = 0
  g.relationships.mara.completed = true
  assert.equal(encountersAtVenue(g, 'sueli_books').length, 0)
})
test('later meetings in the Centro remain distinct and never reset saved progress', () => {
  const g = game('centro')
  g.relationships = { elisa: { ...relationshipState(g, 'elisa'), node: 'reunion' }, helena: { ...relationshipState(g, 'helena'), node: 'private' } }
  assert.deepEqual(encountersAtVenue(g, 'central_streets').map(n => n.id), ['elisa'])
  assert.deepEqual(encountersAtVenue(g, 'central_cafe').map(n => n.id), ['helena'])
  assert.equal(g.relationships.elisa.node, 'reunion')
})
