import {
  useEffect,
  useState,
} from 'react'

import MainMenu from './pages/MainMenu'
import Game from './pages/Game'
import CharacterCreation from './pages/CharacterCreation'

import CharacterSheetView from './components/CharacterSheet/CharacterSheetView'
import AuthScreen from './components/Auth/AuthScreen.jsx'

import OnlinePlayers from './components/Multiplayer/OnlinePlayers.jsx'

import {
  MultiplayerProvider,
} from './multiplayer/MultiplayerProvider.jsx'

import {
  audioEngine,
} from './engine/audio/audioEngine'

import {
  getCurrentSession,
  onAuthStateChange,
  signOut,
} from './engine/auth/authEngine.js'

function AuthenticatedApp({
  session,
}) {
  const [
    screen,
    setScreen,
  ] = useState('menu')

  const [
    signingOut,
    setSigningOut,
  ] = useState(false)

    /*
   * Mantém o desbloqueio de áudio
   * que o jogo já utilizava.
   */
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
    setScreen('menu')
  }

  function startNewGame() {
    setScreen('creation')
  }

  function continueGame() {
    setScreen('game')
  }

  function openSheet() {
    setScreen('sheet')
  }

  async function handleSignOut() {
    if (signingOut) {
      return
    }

    try {
      setSigningOut(true)

      await signOut()
    } catch (error) {
      console.error(
        'Erro ao sair da conta:',
        error
      )

      window.alert(
        'Não foi possível sair. Tente novamente.'
      )

      setSigningOut(false)
    }
  }

  /*
   * A partir daqui o usuário
   * já está autenticado.
   */

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

      onSignOut={
        handleSignOut
      }

      signingOut={
        signingOut
      }

      user={
        session.user
      }
    />
  )
}

function App() {
  const [
    session,
    setSession,
  ] = useState(null)

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      try {
        const currentSession =
          await getCurrentSession()

        if (mounted) {
          setSession(
            currentSession
          )
        }
      } catch (error) {
        console.error(
          'Erro ao recuperar sessão:',
          error
        )

        if (mounted) {
          setSession(null)
        }
      } finally {
        if (mounted) {
          setAuthLoading(false)
        }
      }
    }

    loadSession()

    const unsubscribe =
      onAuthStateChange(
        ({
          session:
            nextSession,
        }) => {
          if (!mounted) {
            return
          }

          setSession(
            nextSession
          )

          setAuthLoading(
            false
          )
        }
      )

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  if (authLoading) {
    return (
      <main
        style={{
          minHeight:
            '100vh',
          display:
            'flex',
          alignItems:
            'center',
          justifyContent:
            'center',
          background:
            '#050505',
          color:
            '#8f8585',
          fontFamily:
            'Georgia, serif',
          letterSpacing:
            '0.12em',
        }}
      >
        CARREGANDO...
      </main>
    )
  }

  if (!session) {
    return (
      <AuthScreen
        onAuthenticated={
          (
            authenticatedSession
          ) => {
            setSession(
              authenticatedSession
            )
          }
        }
      />
    )
  }

  return (
    <MultiplayerProvider
      user={session.user}
    >
      <AuthenticatedApp
        session={session}
      />

      <OnlinePlayers
        user={session.user}
      />
    </MultiplayerProvider>
  )
}

export default App