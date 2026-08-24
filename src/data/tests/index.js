import {
  getChoiceTest as getPrologueChoiceTest,
} from './prologueTests'

import {
  getSecurityChoiceTest,
} from './securityTests'

import {
  getHuntingChoiceTest,
} from './huntingTests'

export function getChoiceTest(
  sceneId,
  choiceId
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
    null
  )
}