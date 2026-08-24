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

import {
  payDisciplineCost,
} from '../engine/vampire/disciplines/disciplineEngine'

import {
  getAvailableSceneDisciplineChoices,
  getDisciplineChoiceFlags,
  getDisciplineChoiceNextScene,
  validateDisciplineChoiceExecution,
} from '../engine/vampire/disciplines/disciplineChoiceEngine'

import {
  buildDisciplineTest,
  executeDisciplineTest,
} from '../engine/vampire/disciplines/disciplineTestEngine'

import {
  applyDisciplineEffect,
  applyDisciplineMasqueradeRisk,
} from '../engine/vampire/disciplines/disciplineEffectEngine'

import DiceRoll from '../components/DiceRoll/DiceRoll'
import TravelPanel from '../components/TravelPanel/TravelPanel'
import TravelEventPanel from '../components/TravelEventPanel/TravelEventPanel'
import TravelEventTest from '../components/TravelEventTest/TravelEventTest'
import PoliceSearchPanel from '../components/PoliceSearchPanel/PoliceSearchPanel'
import PoliceForcePanel from '../components/PoliceForcePanel/PoliceForcePanel'
import MasqueradePanel from '../components/MasqueradePanel/MasqueradePanel'
import DisciplineChoicePanel from '../components/DisciplineChoicePanel/DisciplineChoicePanel'
import DisciplineTestPanel from '../components/DisciplineTestPanel/DisciplineTestPanel'

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

  const [
    masqueradeOpen,
    setMasqueradeOpen,
  ] = useState(false)

  const [
    disciplineOpen,
    setDisciplineOpen,
  ] = useState(false)

  const [
    disciplineEvaluation,
    setDisciplineEvaluation,
  ] = useState(null)

  const [
    disciplineTest,
    setDisciplineTest,
  ] = useState(null)

  const [
    disciplineRoll,
    setDisciplineRoll,
  ] = useState(null)

  const [
    devOpen,
    setDevOpen,
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

    if (
      travelOpen ||
      travelEvent ||
      travelEventTesting ||
      policeSearch ||
      policeForceOpen ||
      masqueradeOpen ||
      disciplineOpen ||
      disciplineEvaluation
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
    disciplineOpen,
    disciplineEvaluation,
  ])

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
      masqueradeOpen ||
      disciplineOpen ||
      disciplineEvaluation
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

      policeSearch:
        search,

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
    disciplineOpen,
    disciplineEvaluation,
    policeSearchCheckedScene,
    travelOpen,
    travelEvent,
    travelEventTesting,
    pendingTest,
  ])

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
      masqueradeOpen ||
      disciplineOpen ||
      disciplineEvaluation
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
    disciplineOpen,
    disciplineEvaluation,
    policeSearch,
    travelOpen,
    travelEvent,
    travelEventTesting,
    pendingTest,
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

  const availableDisciplineChoices =
    getAvailableSceneDisciplineChoices(
      game,
      scene
    )

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

  const interactionBlocked =
    Boolean(
      travelOpen ||
      travelEvent ||
      travelEventTesting ||
      policeSearch ||
      policeForceOpen ||
      masqueradeOpen ||
      disciplineOpen ||
      disciplineEvaluation
    )

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

  function resetSceneTriggers() {
    setPoliceSearchCheckedScene(
      null
    )

    setPoliceForceCheckedScene(
      null
    )
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

  function clearDiscipline() {
    setDisciplineOpen(
      false
    )

    setDisciplineEvaluation(
      null
    )

    setDisciplineTest(
      null
    )

    setDisciplineRoll(
      null
    )
  }

  function transitionToScene(
    currentGame,
    nextScene,
    {
      flags = {},
      timeMinutes = 0,
      historyItem = null,
    } = {}
  ) {
    if (
      !nextScene ||
      !scenes[nextScene]
    ) {
      window.alert(
        `Cena não encontrada: ${nextScene}`
      )

      return currentGame
    }

    const target =
      scenes[nextScene]

    const currentHour =
      Number(
        currentGame.world
          ?.hour ??
        0
      )

    const currentMinute =
      Number(
        currentGame.world
          ?.minute ??
        0
      )

    const totalMinutes =
      (
        currentHour * 60 +
        currentMinute +
        Number(
          timeMinutes ??
          0
        )
      ) %
      (24 * 60)

    return {
      ...currentGame,

      flags: {
        ...(currentGame.flags ??
          {}),

        ...flags,
      },

      story: {
        ...(currentGame.story ??
          {}),

        previousScene:
          scene.id,

        scene:
          nextScene,
      },

      world: {
        ...(currentGame.world ??
          {}),

        hour:
          Math.floor(
            totalMinutes / 60
          ),

        minute:
          totalMinutes % 60,

        location:
          target.location ??
          currentGame.world
            ?.location,
      },

      history: [
        ...(currentGame.history ??
          []),

        ...(historyItem
          ? [historyItem]
          : []),
      ],
    }
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
    resetSceneTriggers()
    goToTop()
  }

  function handleChoice(
    choice
  ) {
    if (
      interactionBlocked
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

  function handleRoll() {
    if (!pendingTest) {
      return
    }

    const roll =
      executeTest(
        game,
        pendingTest
      )

    persist({
      ...game,

      lastRoll: {
        ...roll,

        testId:
          pendingTest.id,

        label:
          pendingTest.label,
      },
    })

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
    resetSceneTriggers()
    goToTop()
  }

  function handleOpenDisciplines() {
    if (
      availableDisciplineChoices
        .length === 0
    ) {
      return
    }

    setDisciplineOpen(
      true
    )
  }

  function handleChooseDiscipline(
    evaluation
  ) {
    const validation =
      validateDisciplineChoiceExecution(
        game,
        scene,
        evaluation.choice.id
      )

    if (
      !validation.allowed ||
      !validation.evaluation
    ) {
      window.alert(
        validation.reason ??
        'Esta Disciplina não pode ser usada.'
      )

      return
    }

    const validatedEvaluation =
      validation.evaluation

    const paidGame =
      payDisciplineCost(
        game,
        validatedEvaluation.power.id
      )

    persist(
      paidGame
    )

    const test =
      buildDisciplineTest(
        paidGame,
        validatedEvaluation
      )

    if (!test) {
      window.alert(
        'Não foi possível preparar o poder.'
      )

      return
    }

    setDisciplineOpen(
      false
    )

    setDisciplineEvaluation(
      validatedEvaluation
    )

    setDisciplineTest(
      test
    )

    setDisciplineRoll(
      null
    )
  }

  function handleDisciplineRoll() {
    if (
      !disciplineEvaluation ||
      !disciplineTest
    ) {
      return
    }

    const roll =
      executeDisciplineTest(
        game,
        disciplineEvaluation
      )

    if (!roll) {
      return
    }

    setDisciplineRoll(
      roll
    )

    persist({
      ...game,

      lastDisciplineRoll: {
        ...roll,

        choiceId:
          disciplineEvaluation
            .choice.id,

        powerId:
          disciplineEvaluation
            .power.id,

        discipline:
          disciplineEvaluation
            .power.discipline,

        timestamp:
          new Date()
            .toISOString(),
      },
    })
  }

  function buildMasqueradeWitnesses(
    evaluation
  ) {
    const context =
      evaluation?.choice
        ?.context ??
      {}

    if (
      Array.isArray(
        context.witnesses
      )
    ) {
      return context.witnesses
    }

    const target =
      evaluation?.choice
        ?.target

    if (
      target?.type ===
        'human' &&
      target?.id
    ) {
      return [
        {
          id:
            target.id,

          name:
            target.name ??
            'Testemunha',

          type:
            target.type,

          sawDiscipline:
            true,

          knowsSupernatural:
            false,

          credibility: 2,
        },
      ]
    }

    return []
  }

  function resolveDiscipline(
    result
  ) {
    if (
      !disciplineEvaluation
    ) {
      return
    }

    const nextScene =
      getDisciplineChoiceNextScene(
        disciplineEvaluation,
        result
      )

    const flags =
      getDisciplineChoiceFlags(
        disciplineEvaluation,
        result
      )

    /*
      ======================================
      1. APLICAR EFEITO REAL
      ======================================
    */

    const effectResult =
      applyDisciplineEffect(
        game,
        disciplineEvaluation,
        disciplineRoll ?? {
          result,
          successes:
            result ===
              'success'
              ? 1
              : 0,
          dice: [],
        }
      )

    let updatedGame =
      effectResult.game

    /*
      ======================================
      2. RISCO DA MÁSCARA

      Por padrão, consideramos o uso
      perceptível quando a cena declara
      context.visible = true.

      Se não declarar, usamos false para
      não criar exposição automática.
      ======================================
    */

    const context =
      disciplineEvaluation
        .choice
        ?.context ??
      {}

    const visible =
      Boolean(
        context.visible
      )

    if (
      result === 'success' &&
      visible
    ) {
      updatedGame =
        applyDisciplineMasqueradeRisk(
          updatedGame,
          disciplineEvaluation,
          {
            visible: true,

            witnesses:
              buildMasqueradeWitnesses(
                disciplineEvaluation
              ),
          }
        )
    }

    /*
      ======================================
      3. FLAGS DA ESCOLHA
      ======================================
    */

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        ...flags,

        [`discipline_${disciplineEvaluation.power.id}_used`]:
          true,

        [`discipline_${disciplineEvaluation.power.id}_${result}`]:
          true,
      },

      history: [
        ...(updatedGame.history ??
          []),

        {
          type:
            'discipline-use',

          scene:
            scene.id,

          choiceId:
            disciplineEvaluation
              .choice.id,

          powerId:
            disciplineEvaluation
              .power.id,

          discipline:
            disciplineEvaluation
              .power.discipline,

          result,

          dice:
            disciplineRoll
              ?.dice ??
            [],

          successes:
            disciplineRoll
              ?.successes ??
            (
              result ===
                'success'
                ? 1
                : 0
            ),

          effect:
            effectResult.effect ??
            null,

          visible,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    /*
      ======================================
      4. TRANSIÇÃO
      ======================================
    */

    if (
      nextScene
    ) {
      updatedGame =
        transitionToScene(
          updatedGame,
          nextScene,
          {
            flags,

            timeMinutes:
              disciplineEvaluation
                .choice
                .timeMinutes ??
              0,
          }
        )
    }

    persist(
      updatedGame
    )

    clearDiscipline()
    resetSceneTriggers()
    goToTop()
  }

  function handleDisciplineContinue() {
    if (
      !disciplineEvaluation ||
      !disciplineTest
    ) {
      return
    }

    if (
      !disciplineTest
        .requiresTest
    ) {
      resolveDiscipline(
        'success'
      )

      return
    }

    if (!disciplineRoll) {
      return
    }

    resolveDiscipline(
      disciplineRoll.result
    )
  }

  function handleOpenTravel() {
    if (
      pendingTest ||
      interactionBlocked
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
    const destination =
      getLocation(
        travel?.destinationId
      )

    if (!destination) {
      return
    }

    const result =
      performTravel(
        game,
        {
          ...travel,

          destinationId:
            destination.id,

          destination,

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
    }

    persist(
      updatedGame
    )

    setTravelOpen(
      false
    )

    setTravelEventInfo({
      fromId:
        currentLocationId,

      fromName:
        game.world
          ?.location
          ?.name ??
        'Local atual',

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
    })

    if (
      result.event
    ) {
      setTravelEvent(
        result.event
      )
    }
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

      setTravelEventTest(
        test
      )

      setTravelEventTesting(
        true
      )

      return
    }

    clearTravelEvent()
  }

  function handleTravelEventRoll() {
    const roll =
      executeTravelEventTest(
        game,
        travelEvent
      )

    if (!roll) {
      return
    }

    setTravelEventRoll(
      roll
    )

    setTravelEventOutcome(
      getTravelEventOutcome(
        travelEvent,
        roll
      )
    )
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
      updatedGame =
        transitionToScene(
          updatedGame,
          'police_stop',
          {
            flags: {
              policeTrouble:
                true,

              policeStopActive:
                true,

              possibleMasqueradeRisk:
                true,
            },
          }
        )
    }

    persist(
      updatedGame
    )

    clearTravelEvent()
    resetSceneTriggers()
  }

  function handlePoliceSearch() {
    if (!policeSearch) {
      return
    }

    const result =
      resolvePoliceSearch(
        game,
        policeSearch
      )

    if (!result?.search) {
      return
    }

    const updatedGame = {
      ...result.game,

      policeSearch:
        result.search,
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

    let updatedGame = {
      ...game,

      policeSearch:
        null,
    }

    updatedGame =
      transitionToScene(
        updatedGame,
        nextScene
      )

    persist(
      updatedGame
    )

    setPoliceSearch(
      null
    )

    resetSceneTriggers()
    goToTop()
  }

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

    const updatedGame =
      transitionToScene(
        result.game,
        result.result
          .nextScene,
        {
          historyItem: {
            type:
              'police-force-resolution',

            action:
              actionId,

            masquerade:
              Boolean(
                result.result
                  .masquerade
              ),

            timestamp:
              new Date()
                .toISOString(),
          },
        }
      )

    persist(
      updatedGame
    )

    setPoliceForceOpen(
      false
    )

    resetSceneTriggers()
    goToTop()
  }

  function devGoToPolice() {
    const updatedGame =
      transitionToScene(
        game,
        'police_stop',
        {
          flags: {
            policeTrouble:
              true,
          },
        }
      )

    persist(
      updatedGame
    )

    setDevOpen(
      false
    )

    resetSceneTriggers()
  }

  function devShowDisciplines() {
    console.log(
      'DISCIPLINAS',
      game.disciplines
    )

    console.log(
      'EFEITOS ATIVOS',
      game.disciplineEffects
    )

    console.log(
      'OPÇÕES DESTA CENA',
      availableDisciplineChoices
    )

    window.alert(
      'Informações enviadas para o console.'
    )
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

          {availableDisciplineChoices
            .length > 0 && (
            <button
              type="button"
              onClick={
                handleOpenDisciplines
              }
              disabled={
                interactionBlocked
              }
            >
              Poderes
              {' '}
              (
              {
                availableDisciplineChoices
                  .length
              }
              )
            </button>
          )}

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
            onClick={onOpenSheet}
            disabled={
              interactionBlocked
            }
          >
            Ficha
          </button>

          <button
            type="button"
            onClick={onMenu}
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
              <strong>
                DEV
              </strong>

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
                  devShowDisciplines
                }
              >
                Ver Disciplinas
              </button>
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

        {availableDisciplineChoices
          .length > 0 && (
          <button
            type="button"
            className="game-discipline-button"
            onClick={
              handleOpenDisciplines
            }
            disabled={
              interactionBlocked
            }
          >
            PODERES VAMPÍRICOS
            {' · '}
            {
              availableDisciplineChoices
                .length
            }
            {' '}
            disponível(is)
          </button>
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
                    key={choice.id}
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
            Noite
          </span>

          <strong>
            {game.world?.night ??
              1}
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
            onCancel={clearTest}
          />
        )}

      {availableDisciplineChoices
          .length > 0 &&
        disciplineOpen && (
          <DisciplineChoicePanel
            choices={
              availableDisciplineChoices
            }
            onChoose={
              handleChooseDiscipline
            }
            onClose={() =>
              setDisciplineOpen(
                false
              )
            }
          />
        )}

      {disciplineEvaluation &&
        disciplineTest && (
          <DisciplineTestPanel
            evaluation={
              disciplineEvaluation
            }
            test={
              disciplineTest
            }
            roll={
              disciplineRoll
            }
            onRoll={
              handleDisciplineRoll
            }
            onContinue={
              handleDisciplineContinue
            }
            onCancel={
              clearDiscipline
            }
          />
        )}

      {travelOpen &&
        !travelEvent && (
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
        !travelEventTesting && (
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
        travelEventTest && (
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

      {policeSearch && (
        <PoliceSearchPanel
          search={policeSearch}
          onSearch={
            handlePoliceSearch
          }
          onContinue={
            handlePoliceSearchContinue
          }
        />
      )}

      {policeForceOpen &&
        !policeSearch && (
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