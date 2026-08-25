import {
  getChoiceTest as getPrologueChoiceTest,
} from './prologueTests'

import {
  getSecurityChoiceTest,
} from './securityTests'

import {
  getHuntingChoiceTest,
} from './huntingTests'

import {
  getPoliceChoiceTest,
} from './policeTests'

export function getChoiceTest(
  sceneId,
  choiceId,
  game = null
) {
  return (
    getPrologueChoiceTest(
      sceneId,
      choiceId
    ) ??
    getSecurityChoiceTest(
      sceneId,
      choiceId
    ) ??
    getHuntingChoiceTest(
      sceneId,
      choiceId
    ) ??
    getPoliceChoiceTest(
      sceneId,
      choiceId,
      game
    ) ??
    null
  )
}