import assert from 'node:assert/strict'
import test from 'node:test'

import {
  isTransientPoliceLocation,
  recoverPoliceLocation,
  resolveNarrativeLocation,
} from '../src/utils/worldLocation.js'

const paulista = {
  id: 'paulista',
  name: 'Avenida Paulista',
  district: 'Bela Vista',
}

test('identifica somente localizações policiais transitórias', () => {
  assert.equal(isTransientPoliceLocation('street_police_stop'), true)
  assert.equal(isTransientPoliceLocation('street_after_police'), true)
  assert.equal(isTransientPoliceLocation('paulista'), false)
})

test('cena policial não substitui a localização geográfica', () => {
  const result = resolveNarrativeLocation(
    paulista,
    {
      id: 'street_police_stop',
      name: 'Rua',
    }
  )

  assert.equal(result.id, 'paulista')
  assert.equal(result, paulista)
})

test('save antigo preso em rua policial recupera o distrito', () => {
  const result = recoverPoliceLocation(
    {
      id: 'street_after_police',
      name: 'Rua',
    },
    paulista
  )

  assert.equal(result.id, 'paulista')
})

test('save antigo sem retorno policial usa o Centro', () => {
  const result = recoverPoliceLocation({
    id: 'street_police_chase',
  })

  assert.equal(result.id, 'centro')
})
