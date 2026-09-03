import assert from 'node:assert/strict'
import test from 'node:test'

import {
  sleepThroughDay,
} from '../src/engine/vampire/daySleepEngine.js'
import {
  describeDayShelter,
} from '../src/data/world/dayShelters.js'

function createGame(blood) {
  return {
    blood: {
      current: blood,
      maximum: 10,
    },
    world: {
      night: 2,
      hour: 7,
      minute: 0,
    },
    history: [],
  }
}

test('despertar para uma nova noite consome um ponto de sangue', () => {
  const result = sleepThroughDay(createGame(5))

  assert.equal(result.blood.current, 4)
  assert.equal(result.world.night, 3)
  assert.equal(result.daySleep.awakeningBloodSpent, 1)
  assert.equal(result.vampireState.torpor, false)
})

test('sangue insuficiente mantém o vampiro em Torpor', () => {
  const result = sleepThroughDay(createGame(1))

  assert.equal(result.blood.current, 0)
  assert.equal(result.vampireState.torpor, true)
  assert.equal(result.flags.inTorpor, true)
})

test('mais sucessos produzem abrigo melhor e regional', () => {
  const precarious = describeDayShelter('paulista', 1)
  const secure = describeDayShelter('paulista', 4)

  assert.match(precarious, /edifício comercial/)
  assert.match(secure, /Paulista/)
  assert.match(secure, /hotel/)
  assert.notEqual(precarious, secure)
})
