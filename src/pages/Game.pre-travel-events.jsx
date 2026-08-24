import {
  useEffect,
  useState,
} from 'react'

import scenes from '../data/scenes'

import {
  getChoiceTest,
} from '../data/tests'

import {
  applyChoice,
  applyTestOutcome,
  formatGameTime,
  loadGame,
  saveGame,
  updateSceneLocation,
} from '../utils/gameState'

import {
  executeTest,
} from '../engine/tests/testEngine'

import {
  addMinutes,
} from '../utils/gameState'

import {
  getLocation,
} from '../engine/world/travelEngine'

import DiceRoll from '../components/DiceRoll/DiceRoll'

import TravelPanel from '../components/TravelPanel/TravelPanel'

import './Game.css'

export default function Game({
  onMenu,
  onOpenSheet,
}) {
  const [
    game,
    setGame,
  ] = useState(
    () => loadGame()
  )

  const [
    pendingChoice,
    setPendingChoice,
  ] = useState(null)

  const [
    pendingTest,
    setPendingTest,
  ] = useState(null)

  const [
    currentRoll,
    setCurrentRoll,
  ] = useState(null)

  const [
    travelOpen,
    setTravelOpen,
  ] = useState(false)

  const sceneId =
    game?.story?.scene ??
    'awakening'

  const scene =
    scenes[sceneId]

  useEffect(() => {
    if (
      !game ||
      !scene
    ) {
      return
    }

    const updatedGame =
      updateSceneLocation(
        game,
        scene
      )

    if (
      updatedGame !== game
    ) {
      setGame(
        updatedGame
      )
    }
  }, [
    sceneId,
  ])

  if (!game) {
    return (
      <main className="game-screen">
        <section className="game-error">
          <h1>
            Nenhum jogo encontrado
          </h1>

          <p>
            Crie e finalize um personagem antes de continuar.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={onMenu}
          >
            Voltar ao Menu
          </button>
        </section>
      </main>
    )
  }

  if (!scene) {
    return (
      <main className="game-screen">
        <section className="game-error">
          <h1>
            Cena não encontrada
          </h1>

          <p>
            ID:
            {' '}
            <strong>
              {sceneId}
            </strong>
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={onMenu}
          >
            Voltar ao Menu
          </button>
        </section>
      </main>
    )
  }

  const characterName =
    game.identity?.name ||
    'Neófito'

  const clan =
    game.identity?.clan ||
    'Malkavian'

  const generation =
    game.identity?.generation ||
    '13ª'

  const time =
    formatGameTime(
      game.world
    )

  const bloodCurrent =
    game.blood?.current ??
    0

  const bloodMaximum =
    game.blood?.maximum ??
    0

  const humanity =
    game.humanity?.current ??
    0

  const willpower =
    game.willpower?.current ??
    0

  const currentLocationId =
    game.world?.location?.id ??
    scene.location?.id ??
    'prologue'

  const currentLocation =
    getLocation(
      currentLocationId
    )

  function clearTest() {
    setPendingChoice(null)
    setPendingTest(null)
    setCurrentRoll(null)
  }

  function goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function performNormalChoice(
    choice
  ) {
    const updatedGame =
      applyChoice(
        game,
        scene,
        choice
      )

    setGame(
      updatedGame
    )

    clearTest()
    goToTop()
  }

  function handleChoice(
    choice
  ) {
    const test =
      getChoiceTest(
        scene.id,
        choice.id
      )

    if (!test) {
      performNormalChoice(
        choice
      )

      return
    }

    setPendingChoice(
      choice
    )

    setPendingTest(
      test
    )

    setCurrentRoll(
      null
    )
  }

  function handleRoll() {
    if (!pendingTest) {
      return
    }

    const roll =
      executeTest(
        game,
        pendingTest
      )

    const updatedGame = {
      ...game,

      lastRoll: {
        ...roll,

        testId:
          pendingTest.id,

        label:
          pendingTest.label,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setCurrentRoll(
      roll
    )
  }

  function handleTestContinue() {
    if (
      !pendingChoice ||
      !pendingTest ||
      !currentRoll
    ) {
      return
    }

    const updatedGame =
      applyTestOutcome(
        game,
        scene,
        pendingChoice,
        pendingTest,
        currentRoll
      )

    setGame(
      updatedGame
    )

    clearTest()
    goToTop()
  }

  function handleTravel(
    travel
  ) {
    if (
      !travel?.destinationId
    ) {
      return
    }

    const destination =
      getLocation(
        travel.destinationId
      )

    if (!destination) {
      return
    }

    const minutes =
      Number(
        travel.minutes ??
        0
      )

    const cost =
      Number(
        travel.cost ??
        0
      )

    const currentResources =
      Number(
        game.backgrounds
          ?.resources ??
        0
      )

    /*
      Resources representa a capacidade
      financeira do personagem.

      Não transformamos Resources diretamente
      em dinheiro. O custo só é aplicado
      quando existe pagamento.
    */

    let updatedResources =
      currentResources

    if (
      cost > 0 &&
      currentResources > 0
    ) {
      updatedResources =
        Math.max(
          0,
          currentResources - 1
        )
    }

    const updatedWorld =
      addMinutes(
        {
          ...(game.world ??
            {}),

          location: {
            ...destination,
          },
        },
        minutes
      )

    const historyItem = {
      type:
        'travel',

      scene:
        scene.id,

      nextScene:
        scene.id,

      choice:
        null,

      text:
        `Viajou de ${currentLocation?.name ?? 'local desconhecido'} para ${destination.name} usando ${getTravelTransportLabel(travel.transport)}.`,

      minutes,

      cost,

      transport:
        travel.transport,

      risk:
        travel.risk,

      gameTime:
        formatGameTime(
          updatedWorld
        ),

      timestamp:
        new Date().toISOString(),
    }

    const updatedGame = {
      ...game,

      backgrounds: {
        ...(game.backgrounds ??
          {}),

        resources:
          updatedResources,
      },

      world:
        updatedWorld,

      history: [
        ...(game.history ??
          []),

        historyItem,
      ],

      flags: {
        ...(game.flags ??
          {}),

        [`visited_${destination.id}`]:
          true,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setTravelOpen(
      false
    )

    goToTop()
  }

  return (
    <main className="game-screen">
      <div className="game-background" />

      <div className="game-dark-overlay" />

      <header className="game-topbar">
        <div className="game-location">
          <span className="game-small-label">
            LOCAL
          </span>

          <strong>
            {currentLocation?.name ??
              scene.location?.name ??
              game.world?.location?.name ??
              'São Paulo'}
          </strong>
        </div>

        <div className="game-clock">
          <span className="game-small-label">
            HORÁRIO
          </span>

          <strong>
            {time}
          </strong>
        </div>

        <div className="game-topbar-actions">
          <button
            type="button"
            onClick={() =>
              setTravelOpen(
                true
              )
            }
          >
            Viajar
          </button>

          <button
            type="button"
            onClick={
              onOpenSheet
            }
          >
            Ficha
          </button>

          <button
            type="button"
            onClick={
              onMenu
            }
          >
            Menu
          </button>
        </div>
      </header>

      <section
        className="game-story"
        key={scene.id}
      >
        <div className="game-scene-header">
          <span className="game-chapter">
            {scene.chapter}
          </span>

          <h1>
            {scene.title}
          </h1>

          <div className="game-character-mini">
            <span>
              {characterName}
            </span>

            <small>
              {clan}
              {' · '}
              {generation}
            </small>
          </div>
        </div>

        <div className="game-narration">
          {scene.narration.map(
            (
              paragraph,
              index
            ) => (
              <p
                key={`${scene.id}-${index}`}
              >
                {paragraph}
              </p>
            )
          )}
        </div>

        {scene.dialogue && (
          <div className="game-dialogue">
            <span className="game-dialogue-speaker">
              {scene.dialogue.speaker}
            </span>

            <p>
              {scene.dialogue.text}
            </p>
          </div>
        )}

        {scene.choices &&
        scene.choices.length > 0 ? (
          <div className="game-choice-list">
            {scene.choices.map(
              (
                choice,
                index
              ) => {
                const test =
                  getChoiceTest(
                    scene.id,
                    choice.id
                  )

                return (
                  <button
                    key={choice.id}
                    type="button"
                    className="game-choice-button"
                    onClick={() =>
                      handleChoice(
                        choice
                      )
                    }
                  >
                    <span className="game-choice-number">
                      {index + 1}
                    </span>

                    <span className="game-choice-text">
                      {test && (
                        <small className="game-choice-test-label">
                          [
                          {test.label}
                          ]
                        </small>
                      )}

                      {choice.text}
                    </span>

                    {choice.timeMinutes > 0 && (
                      <span className="game-choice-time">
                        +{choice.timeMinutes} min
                      </span>
                    )}
                  </button>
                )
              }
            )}
          </div>
        ) : (
          <div className="game-scene-end">
            <span>
              FIM DA CENA
            </span>

            <p>
              Seu progresso foi salvo automaticamente.
            </p>

            <button
              type="button"
              className="main-menu-button"
              onClick={onMenu}
            >
              Voltar ao Menu
            </button>
          </div>
        )}
      </section>

      <aside className="game-hud">
        <div className="game-hud-item">
          <span>
            Sangue
          </span>

          <strong>
            {bloodCurrent}/{bloodMaximum}
          </strong>
        </div>

        <div className="game-hud-item">
          <span>
            Humanidade
          </span>

          <strong>
            {humanity}
          </strong>
        </div>

        <div className="game-hud-item">
          <span>
            Vontade
          </span>

          <strong>
            {willpower}
          </strong>
        </div>

        <div className="game-hud-item">
          <span>
            Noite
          </span>

          <strong>
            {game.world?.night ?? 1}
          </strong>
        </div>
      </aside>

      {pendingTest && (
        <DiceRoll
          game={game}
          test={pendingTest}
          roll={currentRoll}
          onRoll={
            handleRoll
          }
          onContinue={
            handleTestContinue
          }
          onCancel={
            clearTest
          }
        />
      )}

      {travelOpen && (
        <TravelPanel
          currentLocationId={
            currentLocationId
          }
          game={
            game
          }
          onTravel={
            handleTravel
          }
          onCancel={() =>
            setTravelOpen(
              false
            )
          }
        />
      )}
    </main>
  )
}

function getTravelTransportLabel(
  transport
) {
  const labels = {
    walking:
      'a pé',

    bus:
      'ônibus',

    subway:
      'metrô',

    car:
      'carro',
  }

  return (
    labels[
      transport
    ] ??
    transport ??
    'desconhecido'
  )
}