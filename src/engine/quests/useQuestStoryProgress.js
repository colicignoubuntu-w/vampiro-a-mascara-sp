import {
  useEffect,
} from 'react'

import {
  saveGame,
} from '../../utils/gameState'
import {
  applyQuestStoryProgress,
} from './questStoryBridge'

export function useQuestStoryProgress(
  game,
  setGame
) {
  useEffect(() => {
    if (!game) {
      return
    }

    const updatedGame =
      applyQuestStoryProgress(
        game
      )

    if (updatedGame === game) {
      return
    }

    saveGame(updatedGame)
    setGame(updatedGame)
  }, [
    game,
    setGame,
  ])
}

