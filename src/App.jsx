import {
  useEffect,
  useState,
} from 'react'

import MainMenu from './pages/MainMenu'
import Game from './pages/Game'
import CharacterCreation from './pages/CharacterCreation'

import CharacterSheetView from './components/CharacterSheet/CharacterSheetView'
import {
  audioEngine,
} from './engine/audio/audioEngine'

function App() {
  const [
    screen,
    setScreen,
  ] = useState(
    'menu'
  )

  useEffect(() => {
    const unlockAudio = () => {
      audioEngine.unlock()
    }

    window.addEventListener(
      'pointerdown',
      unlockAudio,
      {
        once: true,
      }
    )
    window.addEventListener(
      'keydown',
      unlockAudio,
      {
        once: true,
      }
    )

    return () => {
      window.removeEventListener(
        'pointerdown',
        unlockAudio
      )
      window.removeEventListener(
        'keydown',
        unlockAudio
      )
    }
  }, [])

  function goToMenu() {
    setScreen(
      'menu'
    )
  }

  function startNewGame() {
    setScreen(
      'creation'
    )
  }

  function continueGame() {
    setScreen(
      'game'
    )
  }

  function openSheet() {
    setScreen(
      'sheet'
    )
  }

  if (
    screen === 'creation'
  ) {
    return (
      <CharacterCreation
        onOpenSheet={
          openSheet
        }
      />
    )
  }

  if (
    screen === 'sheet'
  ) {
    return (
      <CharacterSheetView
        onBack={
          goToMenu
        }
      />
    )
  }

  if (
    screen === 'game'
  ) {
    return (
      <Game
        onMenu={
          goToMenu
        }

        onOpenSheet={
          openSheet
        }
      />
    )
  }

  return (
    <MainMenu
      onNewGame={
        startNewGame
      }

      onContinue={
        continueGame
      }

      onOpenSheet={
        openSheet
      }
    />
  )
}

export default App
