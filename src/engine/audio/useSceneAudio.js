import {
  useEffect,
} from 'react'

import {
  getSceneAudio,
} from '../../data/audio/audioCatalog'
import {
  audioEngine,
} from './audioEngine'

export function useSceneAudio(
  sceneId,
  scene
) {
  useEffect(() => {
    audioEngine.applySceneAudio(
      getSceneAudio(
        sceneId,
        scene
      )
    )
  }, [
    sceneId,
    scene,
  ])
}

