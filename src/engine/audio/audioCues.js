import {
  audioEngine,
} from './audioEngine'

export function runWithDiceSound(
  action
) {
  audioEngine.playSfx(
    'dice_roll'
  )

  return action?.()
}

