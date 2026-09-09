import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { RELATIONSHIP_NPCS } from '../src/data/npcs/relationships/index.js'
import { performRelationshipChoice, relationshipState, relationshipAvailability, relationshipChoiceReason } from '../src/engine/relationships/relationshipEngine.js'
import { reconcileRelationships, relationshipMinutes } from '../src/engine/relationships/relationshipClock.js'
import { advanceGameTime } from '../src/engine/time/timeEngine.js'
import { sleepThroughDay } from '../src/engine/vampire/daySleepEngine.js'

function game(location = 'pinheiros') {
  return { world: { day: 1, hour: 19, minute: 0, sunriseHour: 6, sunriseMinute: 30, sunsetHour: 18, sunsetMinute: 30, location: { id: location } }, blood: { current: 10, maximum: 10 }, abilities: { brawl: 3, streetwise: 3 }, history: [], flags: {} }
}
function ready(g, id) {
  const state = relationshipState(g, id)
  const scene = RELATIONSHIP_NPCS[id].scenes[state.node]
  const time = Math.max(relationshipMinutes(g.world), state.readyAt)
  const day = Math.floor(time / 1440) + 1
  const hour = Math.floor(time / 60) % 24
  return { ...g, world: { ...g.world, day, hour, minute: time % 60, location: { id: scene.locations[0] } } }
}
function choose(g, id, choice) {
  const at = ready(g, id)
  return performRelationshipChoice(at, id, relationshipState(at, id).node, choice)
}
function claraWarning() {
  const g = game()
  g.relationships = { clara: { ...relationshipState(g, 'clara'), node: 'warning' } }
  return choose(g, 'clara', 'plan')
}

test('all five authored graphs, portraits and cross-NPC conditions are valid', () => {
  assert.equal(Object.keys(RELATIONSHIP_NPCS).length, 5)
  for (const npc of Object.values(RELATIONSHIP_NPCS)) {
    assert.ok(npc.age >= 18)
    assert.ok(existsSync(`public${npc.portrait}`))
    assert.ok(npc.scenes[npc.start])
    for (const [id, scene] of Object.entries(npc.scenes)) {
      assert.ok(scene.text.length >= 2, `${npc.id}:${id}`)
      assert.ok(scene.choices.length)
      assert.equal(new Set(scene.choices.map(c => c.id)).size, scene.choices.length)
      for (const c of scene.choices) {
        assert.ok(c.test ? ['success', 'failure', 'botch'].every(result => npc.scenes[c.test[result]?.next]) : c.next ? npc.scenes[c.next] : c.ending, `${npc.id}:${id}:${c.id}`)
        if (c.requires?.npc) assert.ok(RELATIONSHIP_NPCS[c.requires.npc])
      }
    }
  }
})
test('new saves are unchanged by clock reads; choices persist and cannot be replayed', () => {
  const original = game('liberdade')
  assert.equal(reconcileRelationships(original), original)
  const next = choose(original, 'mara', 'honest')
  assert.equal(original.relationships, undefined)
  assert.equal(next.relationships.mara.metrics.trust, 2)
  assert.throws(() => performRelationshipChoice(next, 'mara', 'arrival', 'honest'), /mudou/)
  const loaded = JSON.parse(JSON.stringify(next))
  assert.deepEqual(loaded.relationships, next.relationships)
  assert.match(relationshipAvailability(loaded, 'mara'), /ainda/)
})
test('encounters validate location, night, player condition, pending activities and dawn', () => {
  const g = game('centro')
  assert.throws(() => performRelationshipChoice(g, 'clara', 'arrival', 'observe'), /Pinheiros/)
  for (const patch of [{ flags: { inTorpor: true } }, { livelihood: { active: 'shift' } }, { flags: { humanityCheckRequired: true } }, { health: { currentLevel: 7 } }]) {
    assert.throws(() => performRelationshipChoice({ ...game(), ...patch }, 'clara', 'arrival', 'observe'))
  }
  assert.throws(() => performRelationshipChoice({ ...game(), world: { ...game().world, hour: 12 } }, 'clara', 'arrival', 'observe'), /noite/)
  assert.throws(() => performRelationshipChoice({ ...game(), world: { ...game().world, hour: 6, minute: 28 } }, 'clara', 'arrival', 'observe'), /amanhecer/)
  assert.throws(() => performRelationshipChoice(game(), 'unknown', 'arrival', 'music'), /mudou/)
})
test('hospital blood costs a real point; the reunion waits 21 full days', () => {
  const original = game('hospital_victor')
  const g = choose(original, 'elisa', 'blood')
  assert.equal(g.blood.current, 9)
  assert.equal(g.relationships.elisa.metrics.bond, 1)
  assert.equal(g.relationships.elisa.metrics.trust, 0)
  assert.equal(g.relationships.elisa.readyAt - relationshipMinutes(g.world), 21 * 1440)
  assert.throws(() => performRelationshipChoice(g, 'elisa', 'reunion', 'truth'), /ainda/)
  assert.equal(relationshipAvailability(ready(g, 'elisa'), 'elisa'), null)
  assert.throws(() => choose({ ...original, blood: { current: 1 } }, 'elisa', 'blood'), /sangue/)
  assert.equal(original.blood.current, 10)
})
test('blood bond stays separate from affection, caps at three, and excludes a romance ending', () => {
  let g = game('hospital_victor')
  for (const c of ['blood', 'feed', 'control']) g = choose(g, 'elisa', c)
  assert.equal(g.relationships.elisa.metrics.bond, 3)
  assert.equal(g.relationships.elisa.metrics.affinity, 0)
  for (const c of ['release', 'respect']) g = choose(g, 'elisa', c)
  const date = RELATIONSHIP_NPCS.elisa.scenes.future.choices.find(c => c.id === 'date')
  assert.ok(relationshipChoiceReason(g, 'elisa', date))
})
test('helping without blood allows a distinct recovery and consensual date', () => {
  let g = game('hospital_victor')
  for (const c of ['staff', 'coffee', 'date']) g = choose(g, 'elisa', c)
  assert.equal(g.relationships.elisa.completed, true)
  assert.equal(g.relationships.elisa.metrics.bond, 0)
  assert.equal(g.blood.current, 10)
})
test('ignoring an explicit deadline creates one fatal consequence across time jumps and reloads', () => {
  const original = claraWarning()
  assert.equal(original.relationships.clara.deadlineAt - relationshipMinutes(original.world), 3 * 1440)
  const expired = advanceGameTime(original, 4 * 1440)
  assert.equal(expired.relationships.clara.node, 'loss')
  assert.equal(expired.relationships.clara.flags.dead, true)
  assert.equal(expired.relationships.clara.journal.filter(e => e.id === 'clara:deadline').length, 1)
  assert.equal(reconcileRelationships(expired), expired)
  const loaded = JSON.parse(JSON.stringify(expired))
  assert.equal(reconcileRelationships(loaded), loaded)
  const end = choose(expired, 'clara', 'cover')
  assert.equal(end.health.lethal, 2)
  assert.equal(end.relationships.clara.completed, true)
})
test('sleep deadlines reconcile even when the sleep engine changes world directly', () => {
  let g = claraWarning()
  g = { ...g, world: { ...g.world, day: g.world.day + 1, hour: 7, minute: 0 } }
  g.relationships.clara.deadlineAt = relationshipMinutes(g.world) + 100
  const slept = reconcileRelationships(sleepThroughDay(g))
  assert.equal(slept.relationships.clara.flags.dead, true)
})
test('protection stops the deadline without romance and remains effective after long absences', () => {
  let g = claraWarning()
  g = choose(g, 'clara', 'network')
  assert.equal(g.relationships.clara.flags.protected, true)
  assert.equal(g.relationships.clara.deadlineAt, null)
  g = advanceGameTime(g, 30 * 1440)
  assert.equal(g.relationships.clara.flags.dead, undefined)
  assert.equal(g.relationships.clara.node, 'aftermath')
})
test('confronting the stalker carries through to an attack with damage and protection', () => {
  let g = claraWarning()
  for (const c of ['confront', 'escape']) g = choose(g, 'clara', c)
  assert.equal(g.health.lethal, 1)
  assert.equal(g.relationships.clara.flags.protected, true)
})
test('cross-NPC help requires earned trust, and every other arc has a reachable conclusion', () => {
  const g = claraWarning()
  const help = RELATIONSHIP_NPCS.clara.scenes.protection.choices.find(c => c.id === 'iris')
  assert.ok(relationshipChoiceReason(g, 'clara', help))
  const trusted = { ...g, relationships: { ...g.relationships, iris: { ...relationshipState(g, 'iris'), metrics: { trust: 3 } } } }
  assert.equal(relationshipChoiceReason(trusted, 'clara', help), null)
  for (const [id, path] of [['mara', ['honest', 'records', 'copy', 'boundary', 'support', 'romance']], ['iris', ['music', 'records', 'support', 'listen', 'limits', 'romance']], ['helena', ['art', 'copy', 'document', 'honest', 'share', 'romance']]]) {
    let next = game()
    for (const c of path) next = choose(next, id, c)
    assert.equal(next.relationships[id].completed, true, id)
  }
})

test('clara encounter scenes explicitly name the current speaker in the first and second meetings', () => {
  assert.equal(RELATIONSHIP_NPCS.clara.scenes.first_opener_band.dialogue.speaker, 'Clara')
  assert.equal(RELATIONSHIP_NPCS.clara.scenes.first_livia_recognition.dialogue.speaker, 'Clara')
  assert.equal(RELATIONSHIP_NPCS.clara.scenes.second2_show_rafael_question.dialogue.speaker, 'Rafael')
  assert.equal(RELATIONSHIP_NPCS.clara.scenes.second2_touch_scene.dialogue.speaker, 'Clara')
})
