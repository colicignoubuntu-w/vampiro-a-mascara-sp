import test from 'node:test'
import assert from 'node:assert/strict'
import { transferFridgeItem } from '../src/engine/haven/storageEngine.js'

test('blood can be stored, saved and retrieved without loss or duplication', () => {
  const original = { inventory: [{ id: 'bloodBag', name: 'Bolsa de sangue', quantity: 2, potency: 3 }], haven: { other: true } }
  const stored = transferFridgeItem(original, 'bloodBag', 'store')
  assert.equal(original.inventory[0].quantity, 2)
  assert.equal(stored.inventory[0].quantity, 1)
  assert.equal(stored.haven.fridge[0].quantity, 1)
  const saved = JSON.parse(JSON.stringify(transferFridgeItem(stored, 'bloodBag', 'store')))
  assert.equal(saved.inventory.length, 0)
  assert.equal(saved.haven.fridge[0].quantity, 2)
  const taken = transferFridgeItem(transferFridgeItem(saved, 'bloodBag', 'take'), 'bloodBag', 'take')
  assert.deepEqual(taken.inventory, original.inventory)
  assert.deepEqual(taken.haven, { other: true, fridge: [] })
})

test('old saves, missing items and equipped items cannot create transfers', () => {
  const old = {}
  assert.equal(transferFridgeItem(old, 'bloodBag', 'take'), old)
  const equipped = { inventory: [{ id: 'knife' }], equipment: { weapon: 'knife' } }
  assert.equal(transferFridgeItem(equipped, 'knife', 'store'), equipped)
  assert.equal(transferFridgeItem(equipped, 'knife', 'invalid'), equipped)
  const zero = { inventory: [{ id: 'bloodBag', quantity: 0 }] }
  assert.equal(transferFridgeItem(zero, 'bloodBag', 'store'), zero)
})
