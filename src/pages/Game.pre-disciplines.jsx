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

import {
  resolvePoliceForceAction,
} from '../engine/world/police/policeForceEngine'

import {
  getMasqueradeState,
} from '../engine/vampire/masqueradeEngine'

import DiceRoll from '../components/DiceRoll/DiceRoll'
import TravelPanel from '../components/TravelPanel/TravelPanel'
import TravelEventPanel from '../components/TravelEventPanel/TravelEventPanel'
import TravelEventTest from '../components/TravelEventTest/TravelEventTest'
import PoliceSearchPanel from '../components/PoliceSearchPanel/PoliceSearchPanel'
import PoliceForcePanel from '../components/PoliceForcePanel/PoliceForcePanel'
import MasqueradePanel from '../components/MasqueradePanel/MasqueradePanel'

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
    POLÍCIA
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

  const [
    policeForceOpen,
    setPoliceForceOpen,
  ] = useState(false)

  const [
    policeForceCheckedScene,
    setPoliceForceCheckedScene,
  ] = useState(null)

  /*
    ========================================
    MÁSCARA
    ========================================
  */

  const [
    masqueradeOpen,
    setMasqueradeOpen,
  ] = useState(false)

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
    ATUALIZAR LOCAL
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
      policeSearch ||
      policeForceOpen ||
      masqueradeOpen
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
    policeForceOpen,
    masqueradeOpen,
  ])

  /*
    ========================================
    DETECTAR REVISTA
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene ||
      !scene.policeSearchEncounter
    ) {
      return
    }

    if (
      policeSearch ||
      policeForceOpen ||
      masqueradeOpen
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
    policeForceOpen,
    masqueradeOpen,
    policeSearchCheckedScene,
    travelOpen,
    travelEvent,
    travelEventTesting,
    pendingTest,
  ])

  /*
    ========================================
    DETECTAR CENA DE FORÇA
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene ||
      !scene.policeForceEncounter
    ) {
      return
    }

    if (
      policeForceOpen ||
      masqueradeOpen
    ) {
      return
    }

    if (
      policeForceCheckedScene ===
      scene.id
    ) {
      return
    }

    if (
      policeSearch ||
      travelOpen ||
      travelEvent ||
      travelEventTesting ||
      pendingTest
    ) {
      return
    }

    setPoliceForceCheckedScene(
      scene.id
    )

    setPoliceForceOpen(
      true
    )
  }, [
    game,
    sceneId,
    policeForceOpen,
    policeForceCheckedScene,
    masqueradeOpen,
    policeSearch,
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
    DADOS
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

  const masquerade =
    getMasqueradeState(
      game
    )

  const activeMasqueradeEvidence =
    masquerade.evidence.filter(
      (item) =>
        item.status ===
        'active'
    ).length

  const activeMasqueradeWitnesses =
    masquerade.witnesses.filter(
      (witness) =>
        witness.status ===
          'active' &&
        !witness.memoryAltered
    ).length

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
      behavior: 'smooth',
    })
  }

  function clearTest() {
    setPendingChoice(null)
    setPendingTest(null)
    setCurrentRoll(null)
  }

  function clearTravelEventTest() {
    setTravelEventTest(null)
    setTravelEventRoll(null)
    setTravelEventOutcome(null)
    setTravelEventTesting(false)
  }

  function clearTravelEvent() {
    setTravelEvent(null)
    setTravelEventInfo(null)

    clearTravelEventTest()
  }

  /*
    ========================================
    ESCOLHAS
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

    setPoliceForceCheckedScene(
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
      policeSearch ||
      policeForceOpen ||
      masqueradeOpen
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
    TESTES
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

    setPoliceForceCheckedScene(
      null
    )

    goToTop()
  }

  /*
    ========================================
    VIAGEM
    ========================================
  */

  function handleOpenTravel() {
    if (
      pendingTest ||
      travelEvent ||
      travelEventTesting ||
      policeSearch ||
      policeForceOpen ||
      masqueradeOpen
    ) {
      return
    }

    setTravelOpen(
      true
    )
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
      }
    }

    return updatedGame
  }

  function handleTravelEventContinue() {
    if (!travelEvent) {
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
    }

    persist(
      updatedGame
    )

    clearTravelEvent()

    goToTop()
  }

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

    const policeBotch =
      travelEvent.id ===
        'police_patrol' &&
      travelEventRoll.result ===
        'botch'

    if (
      policeBotch
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

      setPoliceForceCheckedScene(
        null
      )

      return
    }

    persist(
      updatedGame
    )

    clearTravelEvent()
  }

  /*
    ========================================
    REVISTA
    ========================================
  */

  function handlePoliceSearch() {
    if (!policeSearch) {
      return
    }

    const result =
      resolvePoliceSearch(
        game,
        policeSearch
      )

    if (
      !result?.search
    ) {
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
        `Cena não encontrada: ${nextScene}`
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
          game.world?.location,
      },
    }

    persist(
      updatedGame
    )

    setPoliceSearch(
      null
    )

    setPoliceSearchCheckedScene(
      null
    )

    setPoliceForceCheckedScene(
      null
    )

    goToTop()
  }

  /*
    ========================================
    FORÇA / MÁSCARA
    ========================================
  */

  function handlePoliceForceChoice(
    actionId
  ) {
    const result =
      resolvePoliceForceAction(
        game,
        actionId
      )

    if (
      !result.success ||
      !result.result
    ) {
      return
    }

    const nextScene =
      result.result
        .nextScene

    if (
      !nextScene ||
      !scenes[nextScene]
    ) {
      window.alert(
        `Cena não encontrada: ${nextScene}`
      )

      return
    }

    const target =
      scenes[nextScene]

    const updatedGame = {
      ...result.game,

      story: {
        ...(result.game.story ??
          {}),

        previousScene:
          scene.id,

        scene:
          nextScene,
      },

      world: {
        ...(result.game.world ??
          {}),

        location:
          target.location ??
          result.game.world
            ?.location,
      },

      history: [
        ...(result.game.history ??
          []),

        {
          type:
            'police-force-resolution',

          action:
            actionId,

          result:
            result.result.id,

          masquerade:
            Boolean(
              result.result
                .masquerade
            ),

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

    setPoliceForceOpen(
      false
    )

    setPoliceForceCheckedScene(
      null
    )

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
    const target =
      scenes.police_detained

    if (!target) {
      return
    }

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
    }

    persist(
      updatedGame
    )

    setPoliceSearch(
      null
    )

    setPoliceForceOpen(
      false
    )

    setPoliceSearchCheckedScene(
      null
    )

    setPoliceForceCheckedScene(
      null
    )

    setDevOpen(
      false
    )
  }

  function devGoToPoliceForce() {
    const target =
      scenes.police_force

    if (!target) {
      return
    }

    const updatedGame = {
      ...game,

      policeSearch:
        null,

      story: {
        ...(game.story ?? {}),

        previousScene:
          scene.id,

        scene:
          'police_force',
      },

      world: {
        ...(game.world ?? {}),

        location: {
          ...target.location,
        },
      },
    }

    persist(
      updatedGame
    )

    setPoliceSearch(
      null
    )

    setPoliceForceOpen(
      false
    )

    setPoliceSearchCheckedScene(
      null
    )

    setPoliceForceCheckedScene(
      null
    )

    setDevOpen(
      false
    )
  }

  function devShowSave() {
    console.log(
      'SAVE',
      game
    )

    console.log(
      'MÁSCARA',
      masquerade
    )

    window.alert(
      'Save enviado para o console.'
    )
  }

  /*
    ========================================
    BLOQUEIO
    ========================================
  */

  const interactionBlocked =
    Boolean(
      travelOpen ||
      travelEvent ||
      travelEventTesting ||
      policeSearch ||
      policeForceOpen ||
      masqueradeOpen
    )

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
                  (value) =>
                    !value
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
            onClick={() =>
              setMasqueradeOpen(
                true
              )
            }
            disabled={
              interactionBlocked
            }
          >
            Máscara
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

      {import.meta.env.DEV &&
        devOpen && (
          <aside className="game-dev-panel">
            <div className="game-dev-header">
              <div>
                <span>
                  DEVELOPMENT TOOLS
                </span>

                <strong>
                  POLÍCIA / MÁSCARA
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
              <div className="game-dev-grid">
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
                    devGoToPoliceForce
                  }
                >
                  Forçar Força
                </button>

                <button
                  type="button"
                  onClick={
                    devShowSave
                  }
                >
                  Mostrar Save
                </button>
              </div>
            </div>
          </aside>
        )}

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
          !scene.policeSearchEncounter &&
          !scene.policeForceEncounter && (
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
            Exposição
          </span>

          <strong>
            {masquerade.exposure}
          </strong>
        </div>

        <div className="game-hud-item">
          <span>
            Evidências
          </span>

          <strong>
            {activeMasqueradeEvidence}
          </strong>
        </div>

        <div className="game-hud-item">
          <span>
            Testemunhas
          </span>

          <strong>
            {activeMasqueradeWitnesses}
          </strong>
        </div>

        <div className="game-hud-item">
          <span>
            Violação
          </span>

          <strong>
            {masquerade.breach}
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

      {pendingTest &&
        !interactionBlocked && (
          <DiceRoll
            game={game}
            test={pendingTest}
            roll={currentRoll}
            onRoll={handleRoll}
            onContinue={
              handleTestContinue
            }
            onCancel={
              clearTest
            }
          />
        )}

      {travelOpen &&
        !travelEvent &&
        !travelEventTesting &&
        !policeSearch &&
        !policeForceOpen &&
        !masqueradeOpen &&
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

      {travelEvent &&
        !travelEventTesting &&
        !policeSearch &&
        !policeForceOpen &&
        !masqueradeOpen && (
          <TravelEventPanel
            event={travelEvent}
            travel={
              travelEventInfo
            }
            onContinue={
              handleTravelEventContinue
            }
          />
        )}

      {travelEvent &&
        travelEventTesting &&
        travelEventTest &&
        !policeSearch &&
        !policeForceOpen &&
        !masqueradeOpen && (
          <TravelEventTest
            event={travelEvent}
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

      {policeSearch &&
        !masqueradeOpen && (
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

      {policeForceOpen &&
        !policeSearch &&
        !masqueradeOpen && (
          <PoliceForcePanel
            onChoose={
              handlePoliceForceChoice
            }
          />
        )}

      {masqueradeOpen && (
        <MasqueradePanel
          game={game}
          onClose={() =>
            setMasqueradeOpen(
              false
            )
          }
        />
      )}
    </main>
  )
}