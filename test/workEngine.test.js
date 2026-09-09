import assert from 'node:assert/strict'
import test from 'node:test'
import { performWorkAction, jobRequirements } from '../src/engine/work/workEngine.js'
import { absoluteMinutes, reconcileSchedule } from '../src/engine/work/scheduleEngine.js'
import { advanceGameTime } from '../src/engine/time/timeEngine.js'
import { needsDegenerationCheck, createDegenerationTrigger } from '../src/engine/vampire/humanityEngine.js'
import { JOBS } from '../src/data/activities/jobs.js'
const success = () => ({ result: 'success', successes: 2, dice: [8, 9] })
const failure = () => ({ result: 'failure', successes: 0, dice: [3] })
const botch = () => ({ result: 'botch', successes: 0, dice: [1] })
function createGame(location = 'asylum') {
  return { world: { day: 1, hour: 19, minute: 0, sunriseHour: 6, sunriseMinute: 30, sunsetHour: 18, sunsetMinute: 30, location: { id: location } }, attributes: { physical: { strength: 3, dexterity: 3 }, social: { charisma: 3, manipulation: 3 } }, abilities: { computer: 4, academics: 4, etiquette: 3, expression: 2, brawl: 2, firearms: 2, stealth: 2, intimidation: 2, streetwise: 2 }, humanity: { current: 8 }, virtues: { conscience: 4 }, history: [], flags: {}, inventory: [] }
}
const act = (g, a, dice = success) => performWorkAction(g, a, dice, () => 1)
const apply = (g, jobId) => act(g, { type: 'apply', jobId })
function at(g, time) { return advanceGameTime(g, time - absoluteMinutes(g.world)) }

test('old saves initialize without replacing character fields; reconciliation is idempotent', () => {
  const original = createGame()
  const g = reconcileSchedule(original)
  assert.equal(g.livelihood.money, 0)
  assert.equal(g.attributes, original.attributes)
  assert.equal(reconcileSchedule(g), g)
  assert.equal(original.livelihood, undefined)
})
test('security requires full overnight shift and pays exactly R$180 without further rolls', () => {
  let g = apply(createGame(), 'security')
  const a = g.livelihood.appointments[0]
  g = at(g, a.start)
  g = act(g, { type: 'start', id: a.id }, () => { throw Error('No routine roll') })
  assert.equal(g.livelihood.active, a.id)
  assert.throws(() => act(g, { type: 'wait', minutes: 60 }), /em andamento/)
  for (let i = 0; i < 5; i++) g = act(g, { type: 'continue', id: a.id })
  assert.equal(g.livelihood.money, 180)
  assert.equal(g.world.day, 2)
  assert.equal(g.world.hour, 4)
  assert.equal(g.livelihood.active, null)
  assert.equal(g.livelihood.appointments[0].status, 'completed')
  assert.throws(() => act(g, { type: 'continue', id: a.id }), /não está em andamento/)
})
test('abandoning pays only worked hours and creates a persistent warning', () => {
  let g = apply(createGame(), 'security'); const a = g.livelihood.appointments[0]
  g = act(at(g, a.start), { type: 'start', id: a.id })
  g = act(g, { type: 'abandon', id: a.id })
  assert.equal(g.livelihood.money, 30)
  assert.equal(g.livelihood.contracts.security.strikes, 1)
  assert.equal(g.livelihood.active, null)
  assert.equal(g.livelihood.appointments[0].status, 'abandoned')
})
test('requirements and armed security use actual inventory', () => {
  const g = createGame(); g.abilities.etiquette = 2
  assert.throws(() => act({ ...g, world: { ...g.world, location: { id: 'pinheiros' } } }, { type: 'flexWork', jobId: 'barista', minutes: 60 }), /Etiqueta 3/)
  const job = JOBS.find(j => j.id === 'armed')
  assert.deepEqual(jobRequirements(g, job), ['arma de fogo no inventário'])
  g.inventory = [{ id: 'revolver38', quantity: 1 }]
  assert.deepEqual(jobRequirements(g, job), [])
})
test('failed interview has cooldown and no scheduled shifts', () => {
  const g = act(createGame(), { type: 'apply', jobId: 'security' }, failure)
  assert.equal(g.livelihood.appointments.length, 0)
  assert.throws(() => apply(g, 'security'), /próxima noite/)
})
test('sleep-style multi-day jump records each absence once, fires after three, cancels later shifts', () => {
  let g = apply(createGame('liberdade'), 'teacher')
  g = reconcileSchedule({ ...g, world: { ...g.world, day: 15, hour: 19 } })
  assert.equal(g.livelihood.contracts.teacher.strikes, 3)
  assert.equal(g.livelihood.contracts.teacher.status, 'fired')
  assert.equal(g.livelihood.phone.filter(m => m.kind === 'call').length, 3)
  assert.equal(reconcileSchedule(g), g)
  assert.equal(g.livelihood.appointments.filter(a => a.status === 'scheduled').length, 0)
})
test('remote flexible jobs pay proportionally, can repeat and never schedule shifts', () => {
  for (const job of JOBS.filter(job => job.flexible && !job.minimumMinutes)) {
    let g = createGame(job.location)
    for (const minutes of [15, 30, 60, 60]) {
      g = act(g, { type: 'flexWork', jobId: job.id, minutes })
      assert.equal(g.livelihood.active, null)
      assert.equal(g.livelihood.appointments.length, 0)
    }
    assert.equal(g.livelihood.money, job.rate * 2.75)
    assert.equal(g.livelihood.contracts[job.id].worked, 165)
    g = reconcileSchedule({ ...g, world: { ...g.world, day: 30 } })
    assert.equal(g.livelihood.contracts[job.id].status, 'available')
    assert.equal(g.livelihood.phone.length, 0)
    assert.equal(g.livelihood.appointments.length, 0)
  }
})
test('remote work requires home, skills and a safe duration', () => {
  assert.throws(() => act(createGame(), { type: 'flexWork', jobId: 'developer', minutes: 60 }), /Apartamento/)
  const home = createGame('livia_apartment')
  assert.throws(() => act({ ...home, abilities: {} }, { type: 'flexWork', jobId: 'developer', minutes: 60 }), /Computação/)
  for (const minutes of [0, -60, 999, NaN]) assert.throws(() => act(home, { type: 'flexWork', jobId: 'developer', minutes }), /Escolha/)
  assert.throws(() => act({ ...home, world: { ...home.world, hour: 6 } }, { type: 'flexWork', jobId: 'developer', minutes: 60 }), /amanhecer/)
  assert.throws(() => act({ ...home, world: { ...home.world, hour: 12 } }, { type: 'flexWork', jobId: 'developer', minutes: 15 }), /noite/)
  assert.throws(() => act(home, { type: 'flexWork', jobId: 'security', minutes: 60 }), /agendado/)
})
test('old flexible schedules migrate without penalties or losing earned money', () => {
  const old = { ...createGame('livia_apartment'), livelihood: { version: 1, money: 90, checkedAt: 1140, contracts: { support: { status: 'fired', strikes: 3 } }, appointments: [{ id: 'old', jobId: 'support', status: 'working', start: 1000, end: 1100 }], active: 'old', workEvent: { appointmentId: 'old' }, phone: [] } }
  const g = reconcileSchedule(old)
  assert.equal(g.livelihood.money, 90)
  assert.equal(g.livelihood.active, null)
  assert.equal(g.livelihood.workEvent, null)
  assert.equal(g.livelihood.appointments[0].status, 'cancelled')
  assert.equal(g.livelihood.contracts.support.strikes, 0)
  assert.equal(g.livelihood.contracts.support.status, 'available')
  assert.equal(reconcileSchedule(g), g)
  assert.equal(old.livelihood.active, 'old')
  assert.equal(act(g, { type: 'flexWork', jobId: 'support', minutes: 30 }).livelihood.money, 95)
})
test('classes require preparation and university requires validated credentials', () => {
  let g = createGame('liberdade')
  assert.throws(() => apply(g, 'professor'), /formação/)
  g = act(g, { type: 'credentials' })
  assert.equal(g.livelihood.credentials, true)
  g = apply(g, 'teacher'); const a = g.livelihood.appointments[0]
  assert.throws(() => act(at(g, a.start), { type: 'start', id: a.id }), /Prepare/)
  g = act(g, { type: 'prepare', id: a.id })
  assert.equal(g.livelihood.appointments[0].prepared, 60)
  assert.equal(g.livelihood.money, 0)
})
test('advance time creates reminder and approved leave does not count as absence', () => {
  let g = apply(createGame('liberdade'), 'teacher'); const a = g.livelihood.appointments[0]
  g = act(g, { type: 'excuse', id: a.id })
  g = at(g, a.end)
  assert.equal(g.livelihood.contracts.teacher.strikes, 0)
  const next = g.livelihood.appointments.find(a => a.status === 'scheduled')
  g = at(g, next.start - 30)
  assert.ok(g.livelihood.phone.some(m => m.id === `${next.id}:reminder`))
  const read = act(g, { type: 'read' })
  assert.ok(read.livelihood.phone.every(m => m.read))
})
test('crime retreat has no consequences; failed armed threat raises active police search', () => {
  let g = act(createGame(), { type: 'crime', crimeId: 'robbery' })
  const original = absoluteMinutes(g.world)
  const retreated = act(g, { type: 'resolveCrime', retreat: true })
  assert.equal(retreated.policeWanted, undefined)
  assert.equal(absoluteMinutes(retreated.world), original)
  g = act(g, { type: 'resolveCrime' }, botch)
  assert.equal(g.policeWanted.level, 4)
  assert.equal(g.livelihood.money, 0)
  assert.equal(needsDegenerationCheck(g), true)
  assert.equal(createDegenerationTrigger(g).violationId, 'intentionalHarm')
})
test('drug profits trigger conscience for high Humanity; low Humanity avoids automatic loss', () => {
  let g = act(createGame(), { type: 'crime', crimeId: 'drugs' })
  g = act(g, { type: 'resolveCrime' })
  assert.equal(g.livelihood.money, 130)
  assert.match(g.livelihood.lastResult, /remorso/)
  assert.equal(needsDegenerationCheck(g), true)
  assert.equal(g.humanity.current, 8)
  let low = createGame(); low.humanity.current = 4
  low = act(act(low, { type: 'crime', crimeId: 'drugs' }), { type: 'resolveCrime' })
  assert.equal(needsDegenerationCheck(low), false)
})
test('activities cannot cross sunrise or be performed in torpor', () => {
  const g = createGame(); g.world.hour = 6
  assert.throws(() => act(g, { type: 'crime', crimeId: 'drugs' }), /amanhecer/)
  assert.throws(() => act({ ...createGame(), flags: { inTorpor: true } }, { type: 'apply', jobId: 'security' }), /condições/)
})


test('work events interrupt a shift once and never remove earned wages', () => {
  let g = apply(createGame(), 'security'); const a = g.livelihood.appointments[0]
  g = performWorkAction(at(g, a.start), { type: 'start', id: a.id }, success, () => 0)
  assert.ok(g.livelihood.workEvent)
  assert.throws(() => act(g, { type: 'continue', id: a.id }), /acontecimento/)
  g = act(g, { type: 'workEvent' }, failure)
  assert.equal(g.livelihood.money, 30)
  assert.equal(g.livelihood.workEvent, null)
  g = performWorkAction(g, { type: 'continue', id: a.id }, success, () => 0)
  assert.equal(g.livelihood.workEvent, null)
})
test('late arrival creates one warning and proportional pay; full shift cannot cross dawn', () => {
  let g = apply(createGame(), 'security'); const a = g.livelihood.appointments[0]
  g = act(at(g, a.start + 10), { type: 'start', id: a.id })
  assert.equal(g.livelihood.contracts.security.strikes, 1)
  while (g.livelihood.active) g = act(g, { type: 'continue', id: a.id })
  assert.equal(g.livelihood.money, 175)
  let early = apply(createGame(), 'security')
  early = at(early, early.livelihood.appointments[0].start)
  early.world.sunriseHour = 0
  early.world.sunriseMinute = 30
  assert.throws(() => act(early, { type: 'start', id: early.livelihood.appointments[0].id }), /amanhecer/)
})
test('time jumps during an active shift mark it missed and clear activity, rather than locking the save', () => {
  let g = apply(createGame(), 'security'); const a = g.livelihood.appointments[0]
  g = act(at(g, a.start), { type: 'start', id: a.id })
  g = at(g, a.end + 60)
  assert.equal(g.livelihood.active, null)
  assert.equal(g.livelihood.appointments[0].status, 'missed')
  assert.equal(g.livelihood.contracts.security.strikes, 1)
})

test('diner and barista require at least six continuous hours and pay the full period', () => {
  for (const jobId of ['diner', 'barista']) {
    const job = JOBS.find(job => job.id === jobId)
    for (const minutes of [15, 30, 60, 359]) {
      assert.throws(() => act(createGame(job.location), { type: 'flexWork', jobId, minutes }), /mínimo 6 horas/)
    }
    for (const minutes of [360, 420, 480]) {
      const original = createGame(job.location)
      original.world.minute = 17
      const g = act(original, { type: 'flexWork', jobId, minutes })
      assert.equal(absoluteMinutes(g.world) - absoluteMinutes(original.world), minutes)
      assert.equal(g.livelihood.money, job.rate * minutes / 60)
      assert.equal(g.livelihood.contracts[jobId].worked, minutes)
      assert.equal(g.livelihood.active, null)
      assert.equal(g.livelihood.appointments.length, 0)
      assert.equal(original.livelihood, undefined)
    }
    const late = createGame(job.location)
    late.world.hour = 2
    assert.throws(() => act(late, { type: 'flexWork', jobId, minutes: 360 }), /amanhecer/)
    assert.throws(() => act(createGame('livia_apartment'), { type: 'flexWork', jobId, minutes: 360 }), /precisa estar/)
  }
})
