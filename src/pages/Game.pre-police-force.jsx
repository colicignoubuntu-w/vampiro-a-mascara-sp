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
  getLocation,
  getTransportLabel,
  performTravel,
} from '../engine/world/travelEngine'

import {
  applyTravelEventOutcome,
  buildTravelEventTest,
  executeTravelEventTest,
  getTravelEventOutcome,
} from '../engine/world/events/travelEventEngine'

import {
  createPoliceSearch,
  getPoliceSearchNextScene,
  resolvePoliceSearch,
} from '../engine/world/police/policeSearchEngine'

import DiceRoll from '../components/DiceRoll/DiceRoll'

import TravelPanel from '../components/TravelPanel/TravelPanel'

import TravelEventPanel from '../components/TravelEventPanel/TravelEventPanel'

import TravelEventTest from '../components/TravelEventTest/TravelEventTest'

import PoliceSearchPanel from '../components/PoliceSearchPanel/PoliceSearchPanel'

import './Game.css'

export default function Game({
  onMenu,
  onOpenSheet,
}) {
  /*
    ========================================
    SAVE
    ========================================
  */

  const [
    game,
    setGame,
  ] = useState(
    () => loadGame()
  )

  /*
    ========================================
    TESTES NORMAIS
    ========================================
  */

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

  /*
    ========================================
    VIAGEM
    ========================================
  */

  const [
    travelOpen,
    setTravelOpen,
  ] = useState(false)

  const [
    travelEvent,
    setTravelEvent,
  ] = useState(null)

  const [
    travelEventInfo,
    setTravelEventInfo,
  ] = useState(null)

  /*
    ========================================
    TESTE DE EVENTO DE VIAGEM
    ========================================
  */

  const [
    travelEventTest,
    setTravelEventTest,
  ] = useState(null)

  const [
    travelEventRoll,
    setTravelEventRoll,
  ] = useState(null)

  const [
    travelEventOutcome,
    setTravelEventOutcome,
  ] = useState(null)

  const [
    travelEventTesting,
    setTravelEventTesting,
  ] = useState(false)

  /*
    ========================================
    REVISTA POLICIAL
    ========================================
  */

  const [
    policeSearch,
    setPoliceSearch,
  ] = useState(null)

  const [
    policeSearchCheckedScene,
    setPoliceSearchCheckedScene,
  ] = useState(null)

  /*
    ========================================
    DEV
    ========================================
  */

  const [
    devOpen,
    setDevOpen,
  ] = useState(false)

  /*
    ========================================
    CENA
    ========================================
  */

  const sceneId =
    game?.story?.scene ??
    'awakening'

  const scene =
    scenes[sceneId]

  /*
    ========================================
    ATUALIZAR LOCALIZAÇÃO
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene
    ) {
      return
    }

    if (
      travelOpen ||
      travelEvent ||
      travelEventTesting ||
      policeSearch
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
    travelOpen,
    travelEvent,
    travelEventTesting,
    policeSearch,
  ])

  /*
    ========================================
    DETECTA REVISTA POLICIAL
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene
    ) {
      return
    }

    if (
      !scene.policeSearchEncounter
    ) {
      return
    }

    if (
      policeSearch
    ) {
      return
    }

    if (
      policeSearchCheckedScene ===
      scene.id
    ) {
      return
    }

    if (
      travelOpen ||
      travelEvent ||
      travelEventTesting ||
      pendingTest
    ) {
      return
    }

    const search =
      createPoliceSearch(
        game
      )

    const updatedGame = {
      ...game,

      policeSearch: {
        ...search,
      },

      history: [
        ...(game.history ?? []),

        {
          type:
            'police-search-start',

          scene:
            scene.id,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    setPoliceSearchCheckedScene(
      scene.id
    )

    setPoliceSearch(
      search
    )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }, [
    game,
    sceneId,
    policeSearch,
    policeSearchCheckedScene,
    travelOpen,
    travelEvent,
    travelEventTesting,
    pendingTest,
  ])

  /*
    ========================================
    ERROS
    ========================================
  */

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

  /*
    ========================================
    PERSONAGEM
    ========================================
  */

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

  /*
    ========================================
    LOCAL
    ========================================
  */

  const currentLocationId =
    game.world
      ?.location
      ?.id ??
    scene.location
      ?.id ??
    'prologue'

  const currentLocation =
    getLocation(
      currentLocationId
    )

  const displayLocationName =
    game.world
      ?.location
      ?.name ??
    currentLocation
      ?.name ??
    scene.location
      ?.name ??
    'São Paulo'

  /*
    ========================================
    HELPERS
    ========================================
  */

  function persist(
    updatedGame
  ) {
    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function goToTop() {
    window.scrollTo({
      top: 0,

      behavior:
        'smooth',
    })
  }

  function clearTest() {
    setPendingChoice(
      null
    )

    setPendingTest(
      null
    )

    setCurrentRoll(
      null
    )
  }

  function clearTravelEventTest() {
    setTravelEventTest(
      null
    )

    setTravelEventRoll(
      null
    )

    setTravelEventOutcome(
      null
    )

    setTravelEventTesting(
      false
    )
  }

  function clearTravelEvent() {
    setTravelEvent(
      null
    )

    setTravelEventInfo(
      null
    )

    clearTravelEventTest()
  }

  function clearPoliceSearch() {
    setPoliceSearch(
      null
    )
  }

  /*
    ========================================
    ESCOLHAS NORMAIS
    ========================================
  */

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

    setPoliceSearchCheckedScene(
      null
    )

    goToTop()
  }

  function handleChoice(
    choice
  ) {
    if (
      travelOpen ||
      travelEvent ||
      travelEventTesting ||
      policeSearch
    ) {
      return
    }

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

  /*
    ========================================
    TESTES NORMAIS
    ========================================
  */

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

    persist(
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

    setPoliceSearchCheckedScene(
      null
    )

    goToTop()
  }

  /*
    ========================================
    ABRIR VIAGEM
    ========================================
  */

  function handleOpenTravel() {
    if (
      pendingTest ||
      travelEvent ||
      travelEventTesting ||
      policeSearch
    ) {
      return
    }

    setTravelOpen(
      true
    )
  }

  /*
    ========================================
    REALIZAR VIAGEM
    ========================================
  */

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
      window.alert(
        'Destino não encontrado.'
      )

      return
    }

    const originId =
      currentLocationId

    const originName =
      travel.actualOriginName ??
      game.world
        ?.location
        ?.name ??
      currentLocation
        ?.name ??
      'Local desconhecido'

    const result =
      performTravel(
        game,
        {
          ...travel,

          destinationId:
            destination.id,

          destination: {
            ...destination,
          },

          minutes:
            Number(
              travel.minutes ??
              0
            ),

          timeMinutes:
            Number(
              travel.minutes ??
              0
            ),
        }
      )

    if (
      result.error
    ) {
      window.alert(
        result.error
      )

      return
    }

    let updatedGame =
      result.game

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        [`visited_${destination.id}`]:
          true,
      },

      history: [
        ...(updatedGame.history ??
          []),

        {
          type:
            'travel-arrival',

          from:
            originId,

          fromName:
            originName,

          to:
            destination.id,

          toName:
            destination.name,

          transport:
            travel.transport,

          transportLabel:
            getTransportLabel(
              travel.transport
            ),

          minutes:
            Number(
              travel.minutes ??
              0
            ),

          cost:
            Number(
              travel.cost ??
              0
            ),

          risk:
            result.context
              ?.risk ??
            travel.risk ??
            'low',

          event:
            result.event
              ?.id ??
            null,

          gameTime:
            formatGameTime(
              updatedGame.world
            ),

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    persist(
      updatedGame
    )

    setTravelOpen(
      false
    )

    setTravelEventInfo({
      fromId:
        originId,

      fromName:
        originName,

      toId:
        destination.id,

      toName:
        destination.name,

      transport:
        travel.transport,

      transportLabel:
        getTransportLabel(
          travel.transport
        ),

      minutes:
        Number(
          travel.minutes ??
          0
        ),

      risk:
        result.context
          ?.risk ??
        travel.risk ??
        'low',
    })

    if (
      result.event
    ) {
      setTravelEvent(
        result.event
      )

      return
    }

    clearTravelEvent()

    goToTop()
  }

  /*
    ========================================
    EVENTOS AUTOMÁTICOS DA VIAGEM
    ========================================
  */

  function applyAutomaticTravelEventEffects(
    currentGame,
    event
  ) {
    if (!event) {
      return currentGame
    }

    let updatedGame = {
      ...currentGame,
    }

    const hungerEffect =
      Number(
        event.effects
          ?.hunger ??
        0
      )

    if (
      hungerEffect > 0
    ) {
      const currentBlood =
        Number(
          updatedGame.blood
            ?.current ??
          0
        )

      updatedGame = {
        ...updatedGame,

        blood: {
          ...(updatedGame.blood ??
            {}),

          current:
            Math.max(
              0,
              currentBlood -
                hungerEffect
            ),
        },

        history: [
          ...(updatedGame.history ??
            []),

          {
            type:
              'travel-event-effect',

            eventId:
              event.id,

            effect:
              'hunger',

            bloodLost:
              hungerEffect,

            timestamp:
              new Date()
                .toISOString(),
          },
        ],
      }
    }

    return updatedGame
  }

  /*
    ========================================
    CONTINUAR EVENTO DE VIAGEM
    ========================================
  */

  function handleTravelEventContinue() {
    if (
      !travelEvent
    ) {
      return
    }

    if (
      travelEvent.test
    ) {
      const test =
        buildTravelEventTest(
          game,
          travelEvent
        )

      if (!test) {
        window.alert(
          'Não foi possível criar o teste.'
        )

        return
      }

      setTravelEventTest(
        test
      )

      setTravelEventRoll(
        null
      )

      setTravelEventOutcome(
        null
      )

      setTravelEventTesting(
        true
      )

      return
    }

    let updatedGame =
      applyAutomaticTravelEventEffects(
        game,
        travelEvent
      )

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        [`travel_event_${travelEvent.id}`]:
          true,
      },

      history: [
        ...(updatedGame.history ??
          []),

        {
          type:
            'travel-event-complete',

          eventId:
            travelEvent.id,

          eventType:
            travelEvent.type ??
            'none',

          result:
            'automatic',

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    persist(
      updatedGame
    )

    clearTravelEvent()

    goToTop()
  }

  /*
    ========================================
    ROLAR EVENTO
    ========================================
  */

  function handleTravelEventRoll() {
    if (
      !travelEvent ||
      !travelEventTest
    ) {
      return
    }

    const roll =
      executeTravelEventTest(
        game,
        travelEvent
      )

    if (!roll) {
      window.alert(
        'Não foi possível executar o teste.'
      )

      return
    }

    const outcome =
      getTravelEventOutcome(
        travelEvent,
        roll
      )

    setTravelEventRoll(
      roll
    )

    setTravelEventOutcome(
      outcome
    )

    persist({
      ...game,

      lastTravelEventRoll: {
        ...roll,

        eventId:
          travelEvent.id,

        timestamp:
          new Date()
            .toISOString(),
      },
    })
  }

  /*
    ========================================
    RESULTADO DO EVENTO
    ========================================
  */

  function handleTravelEventTestContinue() {
    if (
      !travelEvent ||
      !travelEventRoll ||
      !travelEventOutcome
    ) {
      return
    }

    let updatedGame =
      applyTravelEventOutcome(
        game,
        travelEvent,
        travelEventRoll,
        travelEventOutcome
      )

    const isPoliceCriticalFailure =
      travelEvent.id ===
        'police_patrol' &&
      travelEventRoll.result ===
        'botch'

    if (
      isPoliceCriticalFailure
    ) {
      updatedGame = {
        ...updatedGame,

        flags: {
          ...(updatedGame.flags ??
            {}),

          policeTrouble:
            true,

          possibleMasqueradeRisk:
            true,

          policeStopActive:
            true,
        },

        story: {
          ...(updatedGame.story ??
            {}),

          previousScene:
            scene.id,

          scene:
            'police_stop',
        },

        world: {
          ...(updatedGame.world ??
            {}),

          location: {
            id:
              'street_police_stop',

            name:
              'Rua',

            district:
              updatedGame.world
                ?.location
                ?.district ??
              'São Paulo',
          },
        },
      }

      persist(
        updatedGame
      )

      clearTravelEvent()

      setPoliceSearchCheckedScene(
        null
      )

      goToTop()

      return
    }

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        [`travel_event_${travelEvent.id}`]:
          true,

        [`travel_event_${travelEvent.id}_${travelEventRoll.result}`]:
          true,
      },
    }

    persist(
      updatedGame
    )

    clearTravelEvent()

    goToTop()
  }

  /*
    ========================================
    EXECUTAR REVISTA
    ========================================
  */

  function handlePoliceSearch() {
    if (
      !policeSearch
    ) {
      return
    }

    const result =
      resolvePoliceSearch(
        game,
        policeSearch
      )

    if (
      !result ||
      !result.search
    ) {
      window.alert(
        'Não foi possível realizar a revista.'
      )

      return
    }

    const updatedGame = {
      ...result.game,

      policeSearch: {
        ...result.search,
      },
    }

    persist(
      updatedGame
    )

    setPoliceSearch(
      result.search
    )
  }

  /*
    ========================================
    FINALIZAR REVISTA
    ========================================
  */

  function handlePoliceSearchContinue() {
    if (
      !policeSearch ||
      policeSearch.status !==
        'finished'
    ) {
      return
    }

    const nextScene =
      getPoliceSearchNextScene(
        policeSearch
      )

    if (
      !nextScene ||
      !scenes[nextScene]
    ) {
      window.alert(
        `Cena após revista não encontrada: ${nextScene}`
      )

      return
    }

    const target =
      scenes[nextScene]

    const updatedGame = {
      ...game,

      policeSearch:
        null,

      story: {
        ...(game.story ?? {}),

        previousScene:
          scene.id,

        scene:
          nextScene,
      },

      world: {
        ...(game.world ?? {}),

        location:
          target.location ??
          game.world
            ?.location,
      },

      history: [
        ...(game.history ?? []),

        {
          type:
            'police-search-finished',

          result:
            policeSearch.result,

          nextScene,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    persist(
      updatedGame
    )

    clearPoliceSearch()

    setPoliceSearchCheckedScene(
      null
    )

    goToTop()
  }

  /*
    ========================================
    DEV
    ========================================
  */

  function devGoToPoliceSearch() {
    if (
      !scenes.police_detained
    ) {
      window.alert(
        'Cena police_detained não encontrada.'
      )

      return
    }

    const target =
      scenes.police_detained

    const updatedGame = {
      ...game,

      policeSearch:
        null,

      story: {
        ...(game.story ?? {}),

        previousScene:
          scene.id,

        scene:
          'police_detained',
      },

      world: {
        ...(game.world ?? {}),

        location: {
          ...target.location,
        },
      },

      flags: {
        ...(game.flags ?? {}),

        policeTrouble:
          true,

        policeStopActive:
          true,
      },
    }

    persist(
      updatedGame
    )

    clearTravelEvent()

    clearPoliceSearch()

    setPoliceSearchCheckedScene(
      null
    )

    setTravelOpen(
      false
    )

    setDevOpen(
      false
    )

    goToTop()
  }

  function devGoToPolice() {
    if (
      !scenes.police_stop
    ) {
      return
    }

    const target =
      scenes.police_stop

    const updatedGame = {
      ...game,

      policeSearch:
        null,

      story: {
        ...(game.story ?? {}),

        previousScene:
          scene.id,

        scene:
          'police_stop',
      },

      world: {
        ...(game.world ?? {}),

        location: {
          ...target.location,
        },
      },

      flags: {
        ...(game.flags ?? {}),

        policeTrouble:
          true,

        policeStopActive:
          true,
      },
    }

    persist(
      updatedGame
    )

    clearPoliceSearch()

    setPoliceSearchCheckedScene(
      null
    )

    setDevOpen(
      false
    )
  }

  function devShowInventory() {
    console.log(
      'INVENTÁRIO',
      game.inventory
    )

    console.log(
      'EQUIPAMENTO',
      game.equipment
    )

    window.alert(
      'Inventário enviado para o console.'
    )
  }

  /*
    ========================================
    BLOQUEIOS
    ========================================
  */

  const interactionBlocked =
    Boolean(
      travelOpen ||
      travelEvent ||
      travelEventTesting ||
      policeSearch
    )

  /*
    ========================================
    RENDER
    ========================================
  */

  return (
    <main className="game-screen">
      <div className="game-background" />

      <div className="game-dark-overlay" />

      {/* ================================
          TOPBAR
      ================================ */}

      <header className="game-topbar">
        <div className="game-location">
          <span className="game-small-label">
            LOCAL
          </span>

          <strong>
            {displayLocationName}
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
          {import.meta.env.DEV && (
            <button
              type="button"
              className="game-dev-button"
              onClick={() =>
                setDevOpen(
                  (current) =>
                    !current
                )
              }
            >
              DEV
            </button>
          )}

          <button
            type="button"
            onClick={
              handleOpenTravel
            }
            disabled={
              Boolean(
                pendingTest ||
                interactionBlocked
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
            disabled={
              interactionBlocked
            }
          >
            Ficha
          </button>

          <button
            type="button"
            onClick={
              onMenu
            }
            disabled={
              interactionBlocked
            }
          >
            Menu
          </button>
        </div>
      </header>

      {/* ================================
          DEV
      ================================ */}

      {import.meta.env.DEV &&
        devOpen && (
          <aside className="game-dev-panel">
            <div className="game-dev-header">
              <div>
                <span>
                  DEVELOPMENT TOOLS
                </span>

                <strong>
                  POLÍCIA
                </strong>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDevOpen(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <div className="game-dev-current">
              <span>
                Cena atual
              </span>

              <strong>
                {sceneId}
              </strong>

              <small>
                {scene.title}
              </small>
            </div>

            <div className="game-dev-section">
              <span className="game-dev-label">
                Polícia
              </span>

              <div className="game-dev-grid">
                <button
                  type="button"
                  onClick={
                    devGoToPolice
                  }
                >
                  Forçar Abordagem
                </button>

                <button
                  type="button"
                  onClick={
                    devGoToPoliceSearch
                  }
                >
                  Forçar Revista
                </button>

                <button
                  type="button"
                  onClick={
                    devShowInventory
                  }
                >
                  Ver Inventário
                </button>
              </div>
            </div>
          </aside>
        )}

      {/* ================================
          HISTÓRIA
      ================================ */}

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
          {Array.isArray(
            scene.narration
          ) &&
            scene.narration.map(
              (
                paragraph,
                index
              ) => (
                <p
                  key={
                    `${scene.id}-${index}`
                  }
                >
                  {paragraph}
                </p>
              )
            )}
        </div>

        {scene.dialogue && (
          <div className="game-dialogue">
            <span className="game-dialogue-speaker">
              {
                scene.dialogue
                  .speaker
              }
            </span>

            <p>
              {
                scene.dialogue
                  .text
              }
            </p>
          </div>
        )}

        {scene.choices &&
        scene.choices.length >
          0 ? (
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
                    key={
                      choice.id
                    }
                    type="button"
                    className="game-choice-button"
                    disabled={
                      interactionBlocked
                    }
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

                    {choice.timeMinutes >
                      0 && (
                      <span className="game-choice-time">
                        +
                        {
                          choice.timeMinutes
                        }
                        {' '}
                        min
                      </span>
                    )}
                  </button>
                )
              }
            )}
          </div>
        ) : (
          !scene.policeSearchEncounter && (
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
                disabled={
                  interactionBlocked
                }
              >
                Voltar ao Menu
              </button>
            </div>
          )
        )}
      </section>

      {/* ================================
          HUD
      ================================ */}

      <aside className="game-hud">
        <div className="game-hud-item">
          <span>
            Sangue
          </span>

          <strong>
            {bloodCurrent}
            /
            {bloodMaximum}
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
            {game.world
              ?.night ?? 1}
          </strong>
        </div>
      </aside>

      {/* ================================
          TESTE NORMAL
      ================================ */}

      {pendingTest &&
        !interactionBlocked && (
          <DiceRoll
            game={game}

            test={
              pendingTest
            }

            roll={
              currentRoll
            }

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

      {/* ================================
          VIAGEM
      ================================ */}

      {travelOpen &&
        !travelEvent &&
        !travelEventTesting &&
        !policeSearch &&
        !pendingTest && (
          <TravelPanel
            currentLocationId={
              currentLocationId
            }

            game={game}

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

      {/* ================================
          EVENTO DE VIAGEM
      ================================ */}

      {travelEvent &&
        !travelEventTesting &&
        !policeSearch && (
          <TravelEventPanel
            event={
              travelEvent
            }

            travel={
              travelEventInfo
            }

            onContinue={
              handleTravelEventContinue
            }
          />
        )}

      {/* ================================
          TESTE DE EVENTO
      ================================ */}

      {travelEvent &&
        travelEventTesting &&
        travelEventTest &&
        !policeSearch && (
          <TravelEventTest
            event={
              travelEvent
            }

            test={
              travelEventTest
            }

            roll={
              travelEventRoll
            }

            outcome={
              travelEventOutcome
            }

            onRoll={
              handleTravelEventRoll
            }

            onContinue={
              handleTravelEventTestContinue
            }
          />
        )}

      {/* ================================
          REVISTA POLICIAL
      ================================ */}

      {policeSearch && (
        <PoliceSearchPanel
          search={
            policeSearch
          }

          onSearch={
            handlePoliceSearch
          }

          onContinue={
            handlePoliceSearchContinue
          }
        />
      )}
    </main>
  )
}