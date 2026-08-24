import {
  useState,
} from 'react'

import MainMenu from './pages/MainMenu'
import Game from './pages/Game'
import CharacterCreation from './pages/CharacterCreation'

import CharacterSheetView from './components/CharacterSheet/CharacterSheetView'

function App() {
  const [
    screen,
    setScreen,
  ] = useState(
    'menu'
  )

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