import {
  useEffect,
  useState,
} from 'react'

import scenes from '../data/scenes'

import {
  getCombatEncounter,
} from '../data/npcs/combatEncounters'

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

import {
  getCombatDisciplineActions,
  prepareCombatDisciplineAction,
  resolveCombatDisciplineAction,
} from '../engine/vampire/disciplines/combatDisciplineEngine'

import {
  getBloodState,
} from '../engine/vampire/bloodEngine'

import {
  createFrenzyAftermath,
  executeFrenzyTest,
  finishFrenzyAftermath,
} from '../engine/vampire/frenzyEngine'

import {
  buildFeedingHistory,
  createVictim,
  drinkBlood,
  sealBiteWound,
} from '../engine/vampire/feedingEngine'

import {
  applyDegenerationResult,
  clearHumanityTriggerFlags,
  clearIrrelevantDegeneration,
  createDegenerationTrigger,
  executeDegenerationTest,
  needsDegenerationCheck,
} from '../engine/vampire/humanityEngine'

import {
  createHazardState,
  performHazardAction,
} from '../engine/vampire/hazardEngine'

import {
  clearCombatBoosts,
  createCombatState,
  performCombatAction,
  spendBloodForPhysicalBoost,
} from '../engine/combat/combatEngine'

import {
  clearAllDamage,
} from '../engine/combat/damageEngine'

import {
  reloadWeapon,
} from '../engine/combat/ammoEngine'

import {
  equipArmor,
  equipWeapon,
  giveCombatTestItems,
  normalizeInventory,
} from '../engine/inventoryEngine'

import DiceRoll from '../components/DiceRoll/DiceRoll'
import FrenzyTest from '../components/FrenzyTest/FrenzyTest'
import FrenzyAftermath from '../components/FrenzyAftermath/FrenzyAftermath'
import FeedingPanel from '../components/FeedingPanel/FeedingPanel'
import HumanityTest from '../components/HumanityTest/HumanityTest'
import CombatPanel from '../components/CombatPanel/CombatPanel'
import CombatDisciplineTest from '../components/CombatDisciplineTest/CombatDisciplineTest'
import DevCombatArena from '../components/DevCombatArena/DevCombatArena'
import HazardPanel from '../components/HazardPanel/HazardPanel'
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
  /*
    ========================================
    SAVE PRINCIPAL
    ========================================
  */

  const [
    game,
    setGame,
  ] = useState(
    () => {
      const loaded =
        loadGame()

      if (!loaded) {
        return null
      }

      return normalizeInventory(
        loaded
      )
    }
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

  const [
    spendWillpower,
    setSpendWillpower,
  ] = useState(false)

  /*
    ========================================
    FRENESI
    ========================================
  */

  const [
    frenzyOpen,
    setFrenzyOpen,
  ] = useState(false)

  const [
    frenzyResult,
    setFrenzyResult,
  ] = useState(null)

  const [
    frenzyCheckedScene,
    setFrenzyCheckedScene,
  ] = useState(null)

  /*
    ========================================
    ALIMENTAÇÃO
    ========================================
  */

  const [
    feedingOpen,
    setFeedingOpen,
  ] = useState(false)

  const [
    feedingVictim,
    setFeedingVictim,
  ] = useState(null)

  const [
    feedingSceneChecked,
    setFeedingSceneChecked,
  ] = useState(null)

  const [
    feedingTotal,
    setFeedingTotal,
  ] = useState(0)

  /*
    ========================================
    HUMANIDADE
    ========================================
  */

  const [
    humanityOpen,
    setHumanityOpen,
  ] = useState(false)

  const [
    humanityTrigger,
    setHumanityTrigger,
  ] = useState(null)

  const [
    humanityResult,
    setHumanityResult,
  ] = useState(null)

  /*
    ========================================
    COMBATE
    ========================================
  */

  const [
    combatCheckedScene,
    setCombatCheckedScene,
  ] = useState(null)

  const [
    combatDisciplineAction,
    setCombatDisciplineAction,
  ] = useState(null)

  const [
    combatDisciplineEvaluation,
    setCombatDisciplineEvaluation,
  ] = useState(null)

  const [
    combatDisciplineTest,
    setCombatDisciplineTest,
  ] = useState(null)

  const [
    combatDisciplineRoll,
    setCombatDisciplineRoll,
  ] = useState(null)

  /*
    ========================================
    RISCOS
    FOGO / SOL
    ========================================
  */

  const [
    hazardCheckedScene,
    setHazardCheckedScene,
  ] = useState(null)

  /*
    ========================================
    VIAGEM
    ========================================
  */

  const [travelOpen, setTravelOpen] = useState(false)
  const [travelEvent, setTravelEvent] = useState(null)
  const [travelEventInfo, setTravelEventInfo] = useState(null)
  const [travelEventTest, setTravelEventTest] = useState(null)
  const [travelEventRoll, setTravelEventRoll] = useState(null)
  const [travelEventOutcome, setTravelEventOutcome] = useState(null)
  const [travelEventTesting, setTravelEventTesting] = useState(false)

  /*
    ========================================
    POLÍCIA
    ========================================
  */

  const [policeSearch, setPoliceSearch] = useState(null)
  const [policeSearchCheckedScene, setPoliceSearchCheckedScene] = useState(null)
  const [policeForceOpen, setPoliceForceOpen] = useState(false)
  const [policeForceCheckedScene, setPoliceForceCheckedScene] = useState(null)

  /*
    ========================================
    MÁSCARA / DISCIPLINAS
    ========================================
  */

  const [masqueradeOpen, setMasqueradeOpen] = useState(false)
  const [disciplineOpen, setDisciplineOpen] = useState(false)
  const [disciplineEvaluation, setDisciplineEvaluation] = useState(null)
  const [disciplineTest, setDisciplineTest] = useState(null)
  const [disciplineRoll, setDisciplineRoll] = useState(null)

  /*
    ========================================
    DEV
    ========================================
  */

  const [
    devOpen,
    setDevOpen,
  ] = useState(false)

  const [
    devCombatArenaOpen,
    setDevCombatArenaOpen,
  ] = useState(false)


  const [
    devScene,
    setDevScene,
  ] = useState('')

  /*
    ========================================
    CENA ATUAL
    ========================================
  */

  const sceneId =
    game?.story?.scene ??
    'awakening'

  const scene =
    scenes[sceneId]

  const bloodState =
    game
      ? getBloodState(game)
      : null

  const pendingAftermath =
    game?.beast
      ?.pendingAftermath ??
    null

  const combat =
    game?.combat ??
    null

  const hazard =
    game?.hazard ??
    null

  const currentLocationId =
    game?.world
      ?.location
      ?.id ??
    scene?.location
      ?.id ??
    'prologue'

  const currentLocation =
    getLocation(
      currentLocationId
    )

  /*
    ========================================
    ATUALIZA SELECT DEV
    ========================================
  */

  useEffect(() => {
    setDevScene(
      sceneId
    )
  }, [
    sceneId,
  ])

  /*
    ========================================
    LOCALIZAÇÃO
    ========================================
  */

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

  /*
    ========================================
    REVISTA POLICIAL AUTOMÁTICA
    ========================================
  */

  useEffect(() => {
    if (!game || !scene || !scene.policeSearchEncounter) return

    if (
      combat || hazard || frenzyOpen || feedingOpen || humanityOpen ||
      pendingAftermath || pendingTest || policeSearch || policeForceOpen ||
      masqueradeOpen || disciplineOpen || disciplineEvaluation ||
      travelOpen || travelEvent || travelEventTesting
    ) return

    if (policeSearchCheckedScene === scene.id) return

    const search = createPoliceSearch(game)
    const updatedGame = {
      ...game,
      policeSearch: search,
      history: [
        ...(game.history ?? []),
        {
          type: 'police-search-start',
          scene: scene.id,
          timestamp: new Date().toISOString(),
        },
      ],
    }

    setPoliceSearchCheckedScene(scene.id)
    setPoliceSearch(search)
    saveGame(updatedGame)
    setGame(updatedGame)
  }, [
    game, sceneId, combat, hazard, frenzyOpen, feedingOpen, humanityOpen,
    pendingAftermath, pendingTest, policeSearch, policeForceOpen, masqueradeOpen,
    disciplineOpen, disciplineEvaluation, travelOpen, travelEvent, travelEventTesting,
    policeSearchCheckedScene,
  ])

  /*
    ========================================
    FORÇA POLICIAL AUTOMÁTICA
    ========================================
  */

  useEffect(() => {
    if (!game || !scene || !scene.policeForceEncounter) return

    if (
      combat || hazard || frenzyOpen || feedingOpen || humanityOpen ||
      pendingAftermath || pendingTest || policeSearch || policeForceOpen ||
      masqueradeOpen || disciplineOpen || disciplineEvaluation ||
      travelOpen || travelEvent || travelEventTesting
    ) return

    if (policeForceCheckedScene === scene.id) return

    setPoliceForceCheckedScene(scene.id)
    setPoliceForceOpen(true)
  }, [
    game, sceneId, combat, hazard, frenzyOpen, feedingOpen, humanityOpen,
    pendingAftermath, pendingTest, policeSearch, policeForceOpen, masqueradeOpen,
    disciplineOpen, disciplineEvaluation, travelOpen, travelEvent, travelEventTesting,
    policeForceCheckedScene,
  ])

  /*
    ========================================
    HUMANIDADE IRRELEVANTE
    ========================================
  */

  useEffect(() => {
    if (!game) {
      return
    }

    if (
      !game.flags
        ?.humanityCheckRequired
    ) {
      return
    }

    if (
      needsDegenerationCheck(
        game
      )
    ) {
      return
    }

    const updatedGame =
      clearIrrelevantDegeneration(
        game
      )

    if (
      updatedGame === game
    ) {
      return
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }, [
    game,
  ])

  /*
    ========================================
    DETECTA RISCO AMBIENTAL

    Exemplo:
    sunlight_demo
    fire_exposure_demo
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene ||
      !scene.hazardEncounter
    ) {
      return
    }

    /*
      Não inicia risco enquanto
      outro sistema estiver aberto.
    */

    if (
      combat ||
      frenzyOpen ||
      feedingOpen ||
      humanityOpen ||
      pendingAftermath ||
      pendingTest
    ) {
      return
    }

    /*
      Já existe esse risco ativo.
    */

    if (
      game.hazard &&
      game.hazard.id ===
        scene.hazardEncounter.id
    ) {
      return
    }

    /*
      Já verificamos essa cena.
    */

    if (
      hazardCheckedScene ===
      scene.id
    ) {
      return
    }

    const newHazard =
      createHazardState(
        scene.hazardEncounter
      )

    const updatedGame = {
      ...game,

      hazard:
        newHazard,

      history: [
        ...(game.history ?? []),

        {
          type:
            'hazard-start',

          scene:
            scene.id,

          hazardId:
            newHazard.id,

          hazardType:
            newHazard.type,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    setHazardCheckedScene(
      scene.id
    )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }, [
    sceneId,
    game,
    combat,
    frenzyOpen,
    feedingOpen,
    humanityOpen,
    pendingAftermath,
    pendingTest,
    hazardCheckedScene,
  ])

  /*
    ========================================
    DETECTA COMBATE
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene ||
      !scene.combatEncounter
    ) {
      return
    }

    if (
      hazard ||
      frenzyOpen ||
      feedingOpen ||
      humanityOpen ||
      pendingAftermath ||
      pendingTest
    ) {
      return
    }

    if (
      game.combat &&
      game.combat.encounterId ===
        scene.combatEncounter.id
    ) {
      return
    }

    if (
      combatCheckedScene ===
      scene.id
    ) {
      return
    }

    const newCombat =
      createCombatState(
        game,
        scene.combatEncounter
      )

    const updatedGame = {
      ...game,

      combat:
        newCombat,

      history: [
        ...(game.history ?? []),

        {
          type:
            'combat-start',

          scene:
            scene.id,

          encounter:
            scene.combatEncounter.id,

          enemy:
            scene.combatEncounter
              .enemy
              .name,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    setCombatCheckedScene(
      scene.id
    )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }, [
    sceneId,
    game,
    hazard,
    frenzyOpen,
    feedingOpen,
    humanityOpen,
    pendingAftermath,
    pendingTest,
    combatCheckedScene,
  ])

  /*
    ========================================
    DETECTA FRENESI
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene ||
      !scene.frenzyTrigger ||
      pendingAftermath ||
      humanityOpen ||
      combat ||
      hazard
    ) {
      return
    }

    if (
      frenzyCheckedScene ===
      scene.id
    ) {
      return
    }

    const trigger =
      scene.frenzyTrigger

    if (
      trigger.onlyWhenHungry
    ) {
      const hungry =
        bloodState
          ?.hungerLevel ===
          'hungry'

      const critical =
        bloodState
          ?.hungerLevel ===
          'critical'

      if (
        !hungry &&
        !critical
      ) {
        setFrenzyCheckedScene(
          scene.id
        )

        return
      }
    }

    setFrenzyCheckedScene(
      scene.id
    )

    setFrenzyResult(
      null
    )

    setFrenzyOpen(
      true
    )
  }, [
    sceneId,
    game,
    pendingAftermath,
    humanityOpen,
    combat,
    hazard,
  ])

  /*
    ========================================
    DETECTA ALIMENTAÇÃO
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene ||
      !scene.feedingEncounter ||
      pendingAftermath ||
      frenzyOpen ||
      humanityOpen ||
      combat ||
      hazard
    ) {
      return
    }

    if (
      feedingSceneChecked ===
      scene.id
    ) {
      return
    }

    const config =
      scene.feedingEncounter

    const victim =
      createVictim({
        id:
          config.victim.id,

        name:
          config.victim.name,

        blood:
          config.victim.blood ??
          10,
      })

    setFeedingVictim(
      victim
    )

    setFeedingTotal(
      0
    )

    setFeedingSceneChecked(
      scene.id
    )

    setFeedingOpen(
      true
    )
  }, [
    sceneId,
    game,
    pendingAftermath,
    frenzyOpen,
    humanityOpen,
    combat,
    hazard,
  ])

  /*
    ========================================
    DETECTA DEGENERAÇÃO
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      humanityOpen ||
      frenzyOpen ||
      feedingOpen ||
      pendingAftermath ||
      combat ||
      hazard
    ) {
      return
    }

    if (
      !needsDegenerationCheck(
        game
      )
    ) {
      return
    }

    const trigger =
      createDegenerationTrigger(
        game
      )

    setHumanityTrigger(
      trigger
    )

    setHumanityResult(
      null
    )

    setHumanityOpen(
      true
    )
  }, [
    game,
    humanityOpen,
    frenzyOpen,
    feedingOpen,
    pendingAftermath,
    combat,
    hazard,
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
            Crie e finalize um personagem
            antes de continuar.
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
            {sceneId}
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
    DADOS DO PERSONAGEM
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
    bloodState?.current ??
    0

  const bloodMaximum =
    bloodState?.maximum ??
    0

  const humanity =
    game.humanity
      ?.current ?? 0

  const willpower =
    game.willpower
      ?.current ?? 0

  const masquerade =
    getMasqueradeState(game)

  const availableDisciplineChoices =
    getAvailableSceneDisciplineChoices(
      game,
      scene
    )

  const combatDisciplineActions =
    combat
      ? getCombatDisciplineActions(
          game,
          combat
        )
      : []

  const displayLocationName =
    game.world?.location?.name ??
    currentLocation?.name ??
    scene.location?.name ??
    'São Paulo'

  const interactionBlocked = Boolean(
    combat || hazard || frenzyOpen || feedingOpen || humanityOpen || pendingAftermath ||
    travelOpen || travelEvent || travelEventTesting || policeSearch || policeForceOpen ||
    masqueradeOpen || disciplineOpen || disciplineEvaluation
  )

  /*
    ========================================
    UTILITÁRIOS
    ========================================
  */

  function goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function persist(updatedGame) {
    saveGame(updatedGame)
    setGame(updatedGame)
  }

  function resetSceneTriggers() {
    setPoliceSearchCheckedScene(null)
    setPoliceForceCheckedScene(null)
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
    setDisciplineOpen(false)
    setDisciplineEvaluation(null)
    setDisciplineTest(null)
    setDisciplineRoll(null)
  }

  function transitionToScene(currentGame, nextScene, { flags = {}, timeMinutes = 0, historyItem = null } = {}) {
    if (!nextScene || !scenes[nextScene]) {
      window.alert(`Cena não encontrada: ${nextScene}`)
      return currentGame
    }

    const target = scenes[nextScene]
    const currentHour = Number(currentGame.world?.hour ?? 0)
    const currentMinute = Number(currentGame.world?.minute ?? 0)
    const day = 24 * 60
    const total = currentHour * 60 + currentMinute + Number(timeMinutes ?? 0)
    const normalizedMinutes = ((total % day) + day) % day

    return {
      ...currentGame,
      flags: { ...(currentGame.flags ?? {}), ...flags },
      story: { ...(currentGame.story ?? {}), previousScene: scene.id, scene: nextScene },
      world: {
        ...(currentGame.world ?? {}),
        hour: Math.floor(normalizedMinutes / 60),
        minute: normalizedMinutes % 60,
        location: target.location ?? currentGame.world?.location,
      },
      history: [ ...(currentGame.history ?? []), ...(historyItem ? [historyItem] : []) ],
    }
  }

  function clearTest() {
    setPendingChoice(null)
    setPendingTest(null)
    setCurrentRoll(null)
    setSpendWillpower(false)
  }

  function clearFeeding() {
    setFeedingOpen(false)
    setFeedingVictim(null)
    setFeedingTotal(0)
  }

  function clearFrenzy() {
    setFrenzyOpen(false)
    setFrenzyResult(null)
  }

  function clearHumanity() {
    setHumanityOpen(false)
    setHumanityTrigger(null)
    setHumanityResult(null)
  }

  function resetSceneSystems() {
    setFrenzyCheckedScene(null)
    setFeedingSceneChecked(null)
    setCombatCheckedScene(null)
    setHazardCheckedScene(null)
    resetSceneTriggers()

    clearFeeding()
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

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    resetSceneSystems()
    clearTest()
    goToTop()
  }

  function handleChoice(
    choice
  ) {
    if (
      frenzyOpen ||
      feedingOpen ||
      humanityOpen ||
      pendingAftermath ||
      combat ||
      hazard ||
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

    setSpendWillpower(
      false
    )
  }

  /*
    ========================================
    FORÇA DE VONTADE
    ========================================
  */

  function toggleWillpower() {
    if (currentRoll) {
      return
    }

    if (
      (
        game.willpower
          ?.current ?? 0
      ) <= 0
    ) {
      return
    }

    if (
      pendingTest
        ?.allowWillpower ===
      false
    ) {
      return
    }

    setSpendWillpower(
      (current) =>
        !current
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
        pendingTest,
        {
          spendWillpower,
        }
      )

    const currentWillpower =
      game.willpower
        ?.current ?? 0

    const updatedGame = {
      ...game,

      willpower: {
        ...(game.willpower ??
          {}),

        current:
          roll.willpowerSpent
            ? Math.max(
                0,
                currentWillpower -
                  1
              )
            : currentWillpower,
      },

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

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    resetSceneSystems()
    clearTest()
    goToTop()
  }

  /*
    ========================================
    DISCIPLINAS NARRATIVAS
    ========================================
  */

  function handleOpenDisciplines() {
    if (availableDisciplineChoices.length === 0 || interactionBlocked) return
    setDisciplineOpen(true)
  }

  function handleChooseDiscipline(evaluation) {
    const validation = validateDisciplineChoiceExecution(game, scene, evaluation.choice.id)
    if (!validation.allowed || !validation.evaluation) {
      window.alert(validation.reason ?? 'Esta Disciplina não pode ser usada.')
      return
    }
    const validatedEvaluation = validation.evaluation
    const paidGame = payDisciplineCost(game, validatedEvaluation.power.id)
    persist(paidGame)
    const test = buildDisciplineTest(paidGame, validatedEvaluation)
    if (!test) {
      window.alert('Não foi possível preparar o poder.')
      return
    }
    setDisciplineOpen(false)
    setDisciplineEvaluation(validatedEvaluation)
    setDisciplineTest(test)
    setDisciplineRoll(null)
  }

  function handleDisciplineRoll() {
    if (!disciplineEvaluation || !disciplineTest) return
    const roll = executeDisciplineTest(game, disciplineEvaluation)
    if (!roll) return
    setDisciplineRoll(roll)
    persist({
      ...game,
      lastDisciplineRoll: {
        ...roll,
        choiceId: disciplineEvaluation.choice.id,
        powerId: disciplineEvaluation.power.id,
        discipline: disciplineEvaluation.power.discipline,
        timestamp: new Date().toISOString(),
      },
    })
  }

  function buildMasqueradeWitnesses(evaluation) {
    const context = evaluation?.choice?.context ?? {}
    if (Array.isArray(context.witnesses)) return context.witnesses
    const target = evaluation?.choice?.target
    if (target?.type === 'human' && target?.id) {
      return [{ id: target.id, name: target.name ?? 'Testemunha', type: target.type, sawDiscipline: true, knowsSupernatural: false, credibility: 2 }]
    }
    return []
  }

  function resolveDiscipline(result) {
    if (!disciplineEvaluation) return
    const nextScene = getDisciplineChoiceNextScene(disciplineEvaluation, result)
    const flags = getDisciplineChoiceFlags(disciplineEvaluation, result)
    const effectiveRoll = disciplineRoll ?? { result, successes: result === 'success' ? 1 : 0, dice: [] }
    const effectResult = applyDisciplineEffect(game, disciplineEvaluation, effectiveRoll)
    let updatedGame = effectResult.game
    const context = disciplineEvaluation.choice?.context ?? {}
    const visible = Boolean(context.visible)
    if (result === 'success' && visible) {
      updatedGame = applyDisciplineMasqueradeRisk(updatedGame, disciplineEvaluation, { visible: true, witnesses: buildMasqueradeWitnesses(disciplineEvaluation) })
    }
    updatedGame = {
      ...updatedGame,
      flags: {
        ...(updatedGame.flags ?? {}),
        ...flags,
        [`discipline_${disciplineEvaluation.power.id}_used`]: true,
        [`discipline_${disciplineEvaluation.power.id}_${result}`]: true,
      },
      history: [
        ...(updatedGame.history ?? []),
        { type: 'discipline-use', scene: scene.id, choiceId: disciplineEvaluation.choice.id, powerId: disciplineEvaluation.power.id, discipline: disciplineEvaluation.power.discipline, result, dice: effectiveRoll.dice ?? [], successes: effectiveRoll.successes ?? 0, effect: effectResult.effect ?? null, visible, timestamp: new Date().toISOString() },
      ],
    }
    if (nextScene) {
      updatedGame = transitionToScene(updatedGame, nextScene, { flags, timeMinutes: disciplineEvaluation.choice.timeMinutes ?? 0 })
    }
    persist(updatedGame)
    clearDiscipline()
    resetSceneSystems()
    goToTop()
  }

  function handleDisciplineContinue() {
    if (!disciplineEvaluation || !disciplineTest) return
    if (!disciplineTest.requiresTest) { resolveDiscipline('success'); return }
    if (!disciplineRoll) return
    resolveDiscipline(disciplineRoll.result)
  }

  /*
    ========================================
    VIAGEM
    ========================================
  */

  function handleOpenTravel() {
    if (pendingTest || interactionBlocked) return
    setTravelOpen(true)
  }

  function handleTravel(travel) {
    const destination = getLocation(travel?.destinationId)
    if (!destination) return
    const result = performTravel(game, { ...travel, destinationId: destination.id, destination, timeMinutes: Number(travel.minutes ?? 0) })
    if (result.error) { window.alert(result.error); return }
    const updatedGame = { ...result.game, flags: { ...(result.game.flags ?? {}), [`visited_${destination.id}`]: true } }
    persist(updatedGame)
    setTravelOpen(false)
    setTravelEventInfo({ fromId: currentLocationId, fromName: game.world?.location?.name ?? 'Local atual', toId: destination.id, toName: destination.name, transport: travel.transport, transportLabel: getTransportLabel(travel.transport) })
    if (result.event) setTravelEvent(result.event)
  }

  function handleTravelEventContinue() {
    if (!travelEvent) return
    if (travelEvent.test) {
      const test = buildTravelEventTest(game, travelEvent)
      setTravelEventTest(test)
      setTravelEventTesting(true)
      return
    }
    clearTravelEvent()
  }

  function handleTravelEventRoll() {
    const roll = executeTravelEventTest(game, travelEvent)
    if (!roll) return
    setTravelEventRoll(roll)
    setTravelEventOutcome(getTravelEventOutcome(travelEvent, roll))
  }

  function handleTravelEventTestContinue() {
    if (!travelEvent || !travelEventRoll || !travelEventOutcome) return
    let updatedGame = applyTravelEventOutcome(game, travelEvent, travelEventRoll, travelEventOutcome)
    const policeBotch = travelEvent.id === 'police_patrol' && travelEventRoll.result === 'botch'
    if (policeBotch) {
      updatedGame = transitionToScene(updatedGame, 'police_stop', { flags: { policeTrouble: true, policeStopActive: true, possibleMasqueradeRisk: true } })
    }
    persist(updatedGame)
    clearTravelEvent()
    resetSceneSystems()
  }

  /*
    ========================================
    POLÍCIA
    ========================================
  */

  function handlePoliceSearch() {
    if (!policeSearch) return
    const result = resolvePoliceSearch(game, policeSearch)
    if (!result?.search) return
    const updatedGame = { ...result.game, policeSearch: result.search }
    persist(updatedGame)
    setPoliceSearch(result.search)
  }

  function handlePoliceSearchContinue() {
    if (!policeSearch || policeSearch.status !== 'finished') return
    const nextScene = getPoliceSearchNextScene(policeSearch)
    let updatedGame = { ...game, policeSearch: null }
    updatedGame = transitionToScene(updatedGame, nextScene)
    persist(updatedGame)
    setPoliceSearch(null)
    resetSceneSystems()
    goToTop()
  }

  function handlePoliceForceChoice(actionId) {
    const result = resolvePoliceForceAction(game, actionId)
    if (!result.success || !result.result) return
    const updatedGame = transitionToScene(result.game, result.result.nextScene, { historyItem: { type: 'police-force-resolution', action: actionId, masquerade: Boolean(result.result.masquerade), timestamp: new Date().toISOString() } })
    persist(updatedGame)
    setPoliceForceOpen(false)
    resetSceneSystems()
    goToTop()
  }

  /*
    ========================================
    RISCO AMBIENTAL
    ========================================
  */

  function handleHazardAction(
    actionId
  ) {
    if (
      !hazard ||
      hazard.status !==
        'active'
    ) {
      return
    }

    const result =
      performHazardAction({
        game,
        hazard,
        actionId,
      })

    const updatedGame = {
      ...result.game,

      hazard:
        result.hazard,
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function handleHazardFinish() {
    if (
      !hazard ||
      !scene.hazardEncounter
    ) {
      return
    }

    const config =
      scene.hazardEncounter

    let nextScene =
      null

    if (
      hazard.destroyed
    ) {
      nextScene =
        config.destructionScene
    } else if (
      hazard.escaped
    ) {
      nextScene =
        config.successScene
    }

    if (
      !nextScene ||
      !scenes[nextScene]
    ) {
      window.alert(
        `Cena após risco não encontrada: ${nextScene}`
      )

      return
    }

    const target =
      scenes[nextScene]

    let updatedGame =
      clearCombatBoosts(
        game
      )

    updatedGame = {
      ...updatedGame,

      hazard:
        null,

      story: {
        ...(updatedGame.story ??
          {}),

        previousScene:
          scene.id,

        scene:
          nextScene,
      },

      world: {
        ...(updatedGame.world ??
          {}),

        location:
          target.location ??
          updatedGame.world
            ?.location,
      },

      history: [
        ...(updatedGame.history ??
          []),

        {
          type:
            'hazard-end',

          hazardId:
            hazard.id,

          hazardType:
            hazard.type,

          escaped:
            hazard.escaped,

          destroyed:
            hazard.destroyed,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setHazardCheckedScene(
      null
    )

    goToTop()
  }

  /*
    ========================================
    COMBATE
    ========================================
  */

  function handleCombatAction(
    actionId
  ) {
    if (
      !combat ||
      combat.status !==
        'active'
    ) {
      return
    }

    const result =
      performCombatAction({
        game,
        combat,
        actionId,
      })

    const updatedGame = {
      ...result.game,

      combat:
        result.combat,

      history: [
        ...(result.game
          ?.history ??
          game.history ??
          []),

        {
          type:
            'combat-action',

          scene:
            scene.id,

          encounter:
            combat.encounterId,

          round:
            combat.round,

          action:
            actionId,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function clearCombatDisciplineTest() {
    setCombatDisciplineAction(
      null
    )

    setCombatDisciplineEvaluation(
      null
    )

    setCombatDisciplineTest(
      null
    )

    setCombatDisciplineRoll(
      null
    )
  }

  function persistCombatDisciplineResult(
    result,
    actionId
  ) {
    if (
      !result?.success
    ) {
      if (
        result?.log?.[0]?.text
      ) {
        window.alert(
          result.log[0].text
        )
      }

      return
    }

    /*
      Primeiro incorporamos ao combate
      o resultado e o log da Disciplina.
    */

    let nextCombat = {
      ...(result.combat ??
        combat),

      log: [
        ...(result.combat
          ?.log ??
          combat?.log ??
          []),

        ...(result.log ??
          []),
      ],
    }

    let nextGame = {
      ...result.game,

      combat:
        nextCombat,
    }

    /*
      ======================================
      DISCIPLINA QUE CONSOME AÇÃO

      Em vez de criar um segundo motor de
      turnos, usamos performCombatAction()
      com uma ação interna sem ataque.

      executePlayerAction() ignora esse ID,
      mas performCombatAction() ainda:

      - consome a ação do jogador;
      - faz o inimigo agir quando devido;
      - respeita Celeridade;
      - avança a rodada;
      - rola nova iniciativa.

      Assim Dominação, Presença, Demência,
      Animalismo e Taumaturgia obedecem ao
      MESMO sistema de turnos das armas.
      ======================================
    */

    if (
      result.consumesAction &&
      nextCombat.status ===
        'active'
    ) {
      const turnResult =
        performCombatAction({
          game:
            nextGame,

          combat:
            nextCombat,

          actionId:
            '__discipline_action__',
        })

      nextGame =
        turnResult.game

      nextCombat =
        turnResult.combat
    }

    const updatedGame = {
      ...nextGame,

      combat:
        nextCombat,

      history: [
        ...(nextGame
          ?.history ??
          game.history ??
          []),

        {
          type:
            'combat-discipline-action',

          scene:
            scene.id,

          encounter:
            combat?.encounterId ??
            null,

          round:
            combat?.round ??
            null,

          action:
            actionId,

          result:
            result.result ??
            'success',

          consumesAction:
            Boolean(
              result.consumesAction
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
  }

  function handleCombatDiscipline(
    actionId
  ) {
    if (
      !combat ||
      combat.status !==
        'active'
    ) {
      return
    }

    const prepared =
      prepareCombatDisciplineAction({
        game,
        combat,
        actionId,
      })

    if (
      !prepared.success
    ) {
      window.alert(
        prepared.reason ??
        'Não foi possível usar esta Disciplina.'
      )

      return
    }

    /*
      Poder sem teste:
      resolve imediatamente.
    */

    if (
      !prepared.test
        ?.requiresTest
    ) {
      const result =
        resolveCombatDisciplineAction({
          game,
          combat,

          action:
            prepared.action,

          evaluation:
            prepared.evaluation,

          roll: {
            result:
              'success',

            successes: 1,

            dice: [],

            automatic:
              true,
          },
        })

      persistCombatDisciplineResult(
        result,
        actionId
      )

      return
    }

    /*
      Poder com teste:
      abre o painel de rolagem.
    */

    setCombatDisciplineAction(
      prepared.action
    )

    setCombatDisciplineEvaluation(
      prepared.evaluation
    )

    setCombatDisciplineTest(
      prepared.test
    )

    setCombatDisciplineRoll(
      null
    )
  }

  function handleCombatDisciplineRoll() {
    if (
      !combatDisciplineEvaluation ||
      !combatDisciplineTest
    ) {
      return
    }

    const roll =
      executeDisciplineTest(
        game,
        combatDisciplineEvaluation
      )

    if (!roll) {
      return
    }

    setCombatDisciplineRoll(
      roll
    )
  }

  function handleCombatDisciplineContinue() {
    if (
      !combat ||
      !combatDisciplineAction ||
      !combatDisciplineEvaluation ||
      !combatDisciplineTest
    ) {
      return
    }

    const roll =
      combatDisciplineTest
        .requiresTest
        ? combatDisciplineRoll
        : {
            result:
              'success',

            successes: 1,

            dice: [],

            automatic:
              true,
          }

    if (!roll) {
      return
    }

    const result =
      resolveCombatDisciplineAction({
        game,
        combat,

        action:
          combatDisciplineAction,

        evaluation:
          combatDisciplineEvaluation,

        roll,
      })

    persistCombatDisciplineResult(
      result,
      combatDisciplineAction.id
    )

    clearCombatDisciplineTest()
  }

  function handleCombatBoost(
    attribute
  ) {
    if (
      !combat ||
      combat.status !==
        'active'
    ) {
      return
    }

    const result =
      spendBloodForPhysicalBoost({
        game,
        attribute,
      })

    if (!result.success) {
      return
    }

    const updatedGame = {
      ...result.game,

      combat:
        game.combat,
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function handleEquipWeapon(
    weaponId
  ) {
    const result =
      equipWeapon(
        game,
        weaponId
      )

    if (!result.success) {
      window.alert(
        'Essa arma não está no inventário.'
      )

      return
    }

    const updatedGame = {
      ...result.game,

      combat:
        game.combat,
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function handleEquipArmor(
    armorId
  ) {
    const result =
      equipArmor(
        game,
        armorId
      )

    if (!result.success) {
      window.alert(
        'Essa armadura não está no inventário.'
      )

      return
    }

    const updatedGame = {
      ...result.game,

      combat:
        game.combat,
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function handleReload() {
    if (
      !combat ||
      combat.status !==
        'active'
    ) {
      return
    }

    const weaponId =
      game?.equipment
        ?.weapon

    if (!weaponId) {
      return
    }

    const result =
      reloadWeapon(
        game,
        weaponId
      )

    if (!result.success) {
      if (
        result.reason ===
        'already-full'
      ) {
        window.alert(
          'A arma já está carregada.'
        )

        return
      }

      if (
        result.reason ===
        'no-reserve'
      ) {
        window.alert(
          'Você não possui munição reserva.'
        )

        return
      }

      window.alert(
        'Não foi possível recarregar.'
      )

      return
    }

    const updatedGame = {
      ...result.game,

      combat:
        game.combat,
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function handleCombatFinish() {
    if (
      !combat ||
      !scene.combatEncounter
    ) {
      return
    }

    const encounter =
      scene.combatEncounter

    let nextScene =
      null

    if (
      combat.endingReason ===
        'staked' &&
      scenes
        .combat_vampire_staked
    ) {
      nextScene =
        'combat_vampire_staked'
    } else if (
      combat.winner ===
      'player'
    ) {
      nextScene =
        encounter.victoryScene
    } else if (
      combat.winner ===
      'enemy'
    ) {
      nextScene =
        encounter.defeatScene
    } else if (
      combat.winner ===
      'escaped'
    ) {
      nextScene =
        encounter.escapeScene
    }

    if (
      !nextScene ||
      !scenes[nextScene]
    ) {
      window.alert(
        `Cena após combate não encontrada: ${nextScene}`
      )

      return
    }

    const target =
      scenes[nextScene]

    let updatedGame =
      clearCombatBoosts(
        game
      )

    updatedGame = {
      ...updatedGame,

      combat:
        null,

      story: {
        ...(updatedGame.story ??
          {}),

        previousScene:
          scene.id,

        scene:
          nextScene,
      },

      world: {
        ...(updatedGame.world ??
          {}),

        location:
          target.location ??
          updatedGame.world
            ?.location,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setCombatCheckedScene(
      null
    )

    goToTop()
  }

  /*
    ========================================
    ALIMENTAÇÃO
    ========================================
  */

  function handleDrink(
    amount
  ) {
    if (!feedingVictim) {
      return
    }

    const result =
      drinkBlood({
        game,

        victim:
          feedingVictim,

        amount,
      })

    const newTotal =
      feedingTotal +
      result.amountDrunk

    const updatedGame = {
      ...result.game,

      activeFeeding: {
        sceneId:
          scene.id,

        victim:
          result.victim,

        totalDrunk:
          newTotal,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setFeedingVictim(
      result.victim
    )

    setFeedingTotal(
      newTotal
    )
  }

  function handleStopFeeding() {
    if (
      !feedingVictim ||
      !scene.feedingEncounter
    ) {
      return
    }

    const config =
      scene.feedingEncounter

    const victim =
      sealBiteWound(
        feedingVictim
      )

    const victimDead =
      !victim.alive ||
      victim.blood.current <=
        0

    const nextScene =
      victimDead
        ? config.deathScene
        : config.exitScene

    if (
      !scenes[nextScene]
    ) {
      window.alert(
        `Cena após alimentação não encontrada: ${nextScene}`
      )

      return
    }

    const historyEntry =
      buildFeedingHistory({
        victim,

        amount:
          feedingTotal,

        gameTime:
          formatGameTime(
            game.world
          ),
      })

    const updatedGame = {
      ...game,

      activeFeeding:
        null,

      flags: {
        ...(game.flags ?? {}),

        fedFromHuman:
          feedingTotal > 0,

        ...(victimDead
          ? {
              killedHumanByFeeding:
                true,

              humanityCheckRequired:
                true,
            }
          : {}),
      },

      history: [
        ...(game.history ??
          []),

        historyEntry,
      ],

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
          scenes[nextScene]
            ?.location ??
          game.world
            ?.location,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    clearFeeding()

    setFeedingSceneChecked(
      null
    )

    goToTop()
  }

  /*
    ========================================
    FRENESI / RÖTSCHRECK
    ========================================
  */

  function handleFrenzyRoll() {
    if (
      !scene.frenzyTrigger
    ) {
      return
    }

    const roll =
      executeFrenzyTest(
        game,
        scene.frenzyTrigger
      )

    const updatedGame = {
      ...game,

      lastFrenzyRoll:
        roll,
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setFrenzyResult(
      roll
    )
  }

  function handleFrenzyResultContinue() {
    if (
      !frenzyResult ||
      !scene.frenzyTrigger
    ) {
      return
    }

    const trigger =
      scene.frenzyTrigger

    if (
      frenzyResult.result ===
      'success'
    ) {
      const nextScene =
        trigger.successScene

      if (
        !nextScene ||
        !scenes[nextScene]
      ) {
        window.alert(
          `Cena de sucesso não encontrada: ${nextScene}`
        )

        return
      }

      const target =
        scenes[nextScene]

      const updatedGame = {
        ...game,

        flags: {
          ...(game.flags ?? {}),

          resistedFrenzy:
            true,
        },

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
      }

      saveGame(
        updatedGame
      )

      setGame(
        updatedGame
      )

      clearFrenzy()
      resetSceneSystems()
      goToTop()

      return
    }

    const updatedGame =
      createFrenzyAftermath(
        game,
        trigger,
        frenzyResult
      )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    clearFrenzy()
  }

  function handleAftermathContinue() {
    const updatedGame =
      finishFrenzyAftermath(
        game
      )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    resetSceneSystems()

    goToTop()
  }

  /*
    ========================================
    HUMANIDADE
    ========================================
  */

  function handleHumanityRoll() {
    if (!humanityTrigger) {
      return
    }

    const roll =
      executeDegenerationTest(
        game,
        humanityTrigger
      )

    setHumanityResult(
      roll
    )
  }

  function handleHumanityContinue() {
    if (
      !humanityTrigger ||
      !humanityResult
    ) {
      return
    }

    const result =
      applyDegenerationResult(
        game,
        humanityTrigger,
        humanityResult
      )

    const updatedGame =
      clearHumanityTriggerFlags(
        result
      )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    clearHumanity()
  }

  /*
    ========================================
    DEV
    ========================================
  */

  function handleOpenDevCombatArena() {
    setDevCombatArenaOpen(
      true
    )
  }

  function handleCloseDevCombatArena() {
    setDevCombatArenaOpen(
      false
    )
  }

  function handleStartDevCombat(
    encounterId
  ) {
    const encounter =
      getCombatEncounter(
        encounterId
      )

    if (!encounter) {
      window.alert(
        `Encontro DEV não encontrado: ${encounterId}`
      )

      return
    }

    const newCombat =
      createCombatState(
        game,
        encounter
      )

    const updatedGame = {
      ...game,

      combat:
        newCombat,

      history: [
        ...(game.history ?? []),

        {
          type:
            'dev-combat-start',

          scene:
            scene?.id ??
            null,

          encounterId:
            encounter.id,

          enemy:
            encounter.enemy
              ?.name ??
            null,

          clan:
            encounter.enemy
              ?.clan ??
            null,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    persist(
      updatedGame
    )

    setDevCombatArenaOpen(
      false
    )

    setDevOpen(
      false
    )

    clearCombatDisciplineTest()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function devGoToPolice() {
    const updatedGame = transitionToScene(game, 'police_stop', { flags: { policeTrouble: true } })
    persist(updatedGame)
    setDevOpen(false)
    resetSceneSystems()
  }

  function devShowDisciplines() {
    console.log('DISCIPLINAS', game.disciplines)
    console.log('EFEITOS ATIVOS', game.disciplineEffects)
    console.log('OPÇÕES NARRATIVAS', availableDisciplineChoices)
    console.log('OPÇÕES DE COMBATE', combatDisciplineActions)
    window.alert('Informações enviadas para o console.')
  }

  function devGoToScene(
    targetScene
  ) {
    if (
      !targetScene ||
      !scenes[targetScene]
    ) {
      window.alert(
        'Cena não encontrada.'
      )

      return
    }

    let updatedGame =
      clearCombatBoosts(
        game
      )

    updatedGame = {
      ...updatedGame,

      combat:
        null,

      hazard:
        null,

      activeFeeding:
        null,

      beast: {
        ...(updatedGame.beast ??
          {}),

        pendingAftermath:
          null,

        frenzy:
          false,
      },

      story: {
        ...(updatedGame.story ??
          {}),

        previousScene:
          sceneId,

        scene:
          targetScene,
      },

      world: {
        ...(updatedGame.world ??
          {}),

        location:
          scenes[targetScene]
            .location ??
          updatedGame.world
            ?.location,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    clearTest()
    clearFeeding()
    clearFrenzy()
    clearHumanity()

    setCombatCheckedScene(
      null
    )

    setHazardCheckedScene(
      null
    )

    setFrenzyCheckedScene(
      null
    )

    setFeedingSceneChecked(
      null
    )

    setDevOpen(
      false
    )

    goToTop()
  }

  function devGiveArsenal() {
    const updatedGame =
      giveCombatTestItems(
        game
      )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    window.alert(
      'Arsenal e munição adicionados.'
    )
  }

  function devHeal() {
    const updatedGame = {
      ...game,

      health:
        clearAllDamage(
          game.health
        ),

      flags: {
        ...(game.flags ?? {}),

        vampireDestroyed:
          false,

        destroyedBy:
          null,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function devFillBlood() {
    const updatedGame = {
      ...game,

      blood: {
        ...(game.blood ?? {}),

        current:
          game.blood
            ?.maximum ??
          10,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function devLowBlood() {
    const updatedGame = {
      ...game,

      blood: {
        ...(game.blood ?? {}),

        current: 2,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function devFillWillpower() {
    const updatedGame = {
      ...game,

      willpower: {
        ...(game.willpower ??
          {}),

        current:
          game.willpower
            ?.maximum ??
          1,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }

  function devShowSave() {
    console.log(
      '============================'
    )

    console.log(
      'VAMPIRO SP SAVE'
    )

    console.log(
      game
    )

    console.log(
      'HAZARD',
      game.hazard
    )

    console.log(
      'VITALIDADE',
      game.health
    )

    console.log(
      'INVENTÁRIO',
      game.inventory
    )

    console.log(
      'EQUIPAMENTO',
      game.equipment
    )

    console.log(
      '============================'
    )

    window.alert(
      'Save enviado para o Console.'
    )
  }

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

          <button type="button" onClick={handleOpenTravel} disabled={Boolean(pendingTest || interactionBlocked)}>
            Viajar
          </button>

          {availableDisciplineChoices.length > 0 && (
            <button type="button" onClick={handleOpenDisciplines} disabled={interactionBlocked}>
              Poderes ({availableDisciplineChoices.length})
            </button>
          )}

          <button type="button" onClick={() => setMasqueradeOpen(true)} disabled={interactionBlocked}>
            Máscara
          </button>

          <button
            type="button"
            onClick={onOpenSheet}
            disabled={interactionBlocked}
          >
            Ficha
          </button>

          <button type="button" onClick={onMenu} disabled={interactionBlocked}>
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
                  DEV
                </strong>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDevOpen(false)
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

            {/* IR PARA CENA */}

            <div className="game-dev-section">
              <label>
                Ir para cena
              </label>

              <select
                value={
                  devScene
                }
                onChange={(
                  event
                ) =>
                  setDevScene(
                    event.target
                      .value
                  )
                }
              >
                {Object.entries(
                  scenes
                )
                  .sort(
                    (
                      [, a],
                      [, b]
                    ) =>
                      (
                        a.title ??
                        ''
                      ).localeCompare(
                        b.title ??
                          ''
                      )
                  )
                  .map(
                    ([
                      id,
                      sceneData,
                    ]) => (
                      <option
                        key={id}
                        value={id}
                      >
                        {sceneData.title}
                        {' — '}
                        {id}
                      </option>
                    )
                  )}
              </select>

              <button
                type="button"
                className="game-dev-primary"
                onClick={() =>
                  devGoToScene(
                    devScene
                  )
                }
              >
                Ir para cena
              </button>
            </div>

            <div className="game-dev-section">
              <span className="game-dev-label">Polícia / Disciplinas</span>
              <div className="game-dev-grid">
                <button type="button" onClick={devGoToPolice}>Forçar Abordagem</button>
                <button type="button" onClick={devShowDisciplines}>Ver Disciplinas</button>
                <button type="button" onClick={handleOpenDevCombatArena}>Arena de Combate</button>
              </div>
            </div>

            {/* COMBATE */}

            <div className="game-dev-section">
              <span className="game-dev-label">
                Combate
              </span>

              <div className="game-dev-grid">
                <button
                  type="button"
                  onClick={
                    devGiveArsenal
                  }
                >
                  Dar Arsenal
                </button>

                <button
                  type="button"
                  onClick={() =>
                    devGoToScene(
                      'combat_demo'
                    )
                  }
                >
                  Combate Humano
                </button>

                <button
                  type="button"
                  onClick={() =>
                    devGoToScene(
                      'combat_vampire_demo'
                    )
                  }
                >
                  Combate Vampiro
                </button>
              </div>
            </div>

            {/* RISCOS */}

            <div className="game-dev-section">
              <span className="game-dev-label">
                Riscos
              </span>

              <div className="game-dev-grid">
                <button
                  type="button"
                  onClick={() =>
                    devGoToScene(
                      'fire_hazard_demo'
                    )
                  }
                >
                  Incêndio
                </button>

                <button
                  type="button"
                  onClick={() =>
                    devGoToScene(
                      'sunlight_demo'
                    )
                  }
                >
                  Luz Solar
                </button>

                <button
                  type="button"
                  onClick={
                    devHeal
                  }
                >
                  Curar Vitalidade
                </button>
              </div>
            </div>

            {/* OUTROS */}

            <div className="game-dev-section">
              <span className="game-dev-label">
                Outros Sistemas
              </span>

              <div className="game-dev-grid">
                <button
                  type="button"
                  onClick={() =>
                    devGoToScene(
                      'hunting_bar'
                    )
                  }
                >
                  Caça
                </button>

                <button
                  type="button"
                  onClick={() =>
                    devGoToScene(
                      'frenzy_rage_demo'
                    )
                  }
                >
                  Frenesi
                </button>
              </div>
            </div>

            {/* RECURSOS */}

            <div className="game-dev-section">
              <span className="game-dev-label">
                Recursos
              </span>

              <div className="game-dev-grid">
                <button
                  type="button"
                  onClick={
                    devLowBlood
                  }
                >
                  Sangue 2
                </button>

                <button
                  type="button"
                  onClick={
                    devFillBlood
                  }
                >
                  Encher Sangue
                </button>

                <button
                  type="button"
                  onClick={
                    devFillWillpower
                  }
                >
                  Encher Vontade
                </button>
              </div>
            </div>

            <div className="game-dev-section">
              <button
                type="button"
                onClick={
                  devShowSave
                }
              >
                Mostrar Save
              </button>
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
          {scene.narration.map(
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

        {availableDisciplineChoices.length > 0 && !interactionBlocked && (
          <button type="button" className="game-discipline-button" onClick={handleOpenDisciplines}>
            PODERES VAMPÍRICOS · {availableDisciplineChoices.length} disponível(is)
          </button>
        )}

        {scene.choices?.length >
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
                    disabled={interactionBlocked}
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
                          {
                            test.label
                          }
                          ]
                        </small>
                      )}

                      {
                        choice.text
                      }
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
          !scene.frenzyTrigger &&
          !scene.feedingEncounter &&
          !scene.combatEncounter &&
          !scene.hazardEncounter &&
          !scene.policeSearchEncounter &&
          !scene.policeForceEncounter &&
          !combat &&
          !hazard &&
          !pendingAftermath &&
          !humanityOpen && (
            <div className="game-scene-end">
              <span>
                FIM DA CENA
              </span>

              <p>
                Progresso salvo.
              </p>
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
          <span>Exposição</span>
          <strong>{masquerade.exposure}</strong>
        </div>

        <div className="game-hud-item">
          <span>
            Noite
          </span>

          <strong>
            {
              game.world
                ?.night ?? 1
            }
          </strong>
        </div>
      </aside>

      {/* ================================
          TESTE NORMAL
      ================================ */}

      {pendingTest && !interactionBlocked && (
          <DiceRoll
            game={game}

            test={
              pendingTest
            }

            roll={
              currentRoll
            }

            spendWillpower={
              spendWillpower
            }

            onToggleWillpower={
              toggleWillpower
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
          DISCIPLINAS / VIAGEM / POLÍCIA
      ================================ */}

      {availableDisciplineChoices.length > 0 && disciplineOpen && !combat && !hazard && !frenzyOpen && !feedingOpen && !humanityOpen && !pendingAftermath && (
        <DisciplineChoicePanel choices={availableDisciplineChoices} onChoose={handleChooseDiscipline} onClose={() => setDisciplineOpen(false)} />
      )}

      {disciplineEvaluation && disciplineTest && !combat && !hazard && !frenzyOpen && !feedingOpen && !humanityOpen && !pendingAftermath && (
        <DisciplineTestPanel evaluation={disciplineEvaluation} test={disciplineTest} roll={disciplineRoll} onRoll={handleDisciplineRoll} onContinue={handleDisciplineContinue} onCancel={clearDiscipline} />
      )}

      {travelOpen && !travelEvent && !combat && !hazard && !frenzyOpen && !feedingOpen && !humanityOpen && !pendingAftermath && (
        <TravelPanel currentLocationId={currentLocationId} game={game} onTravel={handleTravel} onCancel={() => setTravelOpen(false)} />
      )}

      {travelEvent && !travelEventTesting && (
        <TravelEventPanel event={travelEvent} travel={travelEventInfo} onContinue={handleTravelEventContinue} />
      )}

      {travelEvent && travelEventTesting && travelEventTest && (
        <TravelEventTest event={travelEvent} test={travelEventTest} roll={travelEventRoll} outcome={travelEventOutcome} onRoll={handleTravelEventRoll} onContinue={handleTravelEventTestContinue} />
      )}

      {policeSearch && (
        <PoliceSearchPanel search={policeSearch} onSearch={handlePoliceSearch} onContinue={handlePoliceSearchContinue} />
      )}

      {policeForceOpen && !policeSearch && (
        <PoliceForcePanel onChoose={handlePoliceForceChoice} />
      )}

      {masqueradeOpen && (
        <MasqueradePanel game={game} onClose={() => setMasqueradeOpen(false)} />
      )}

      {/* ================================
          RISCO AMBIENTAL
      ================================ */}

      {hazard &&
        scene.hazardEncounter &&
        !combat &&
        !frenzyOpen &&
        !feedingOpen &&
        !humanityOpen &&
        !pendingAftermath && (
          <HazardPanel
            game={game}

            hazard={
              hazard
            }

            onAction={
              handleHazardAction
            }

            onFinish={
              handleHazardFinish
            }
          />
        )}

      {devCombatArenaOpen && (
        <DevCombatArena
          onStart={
            handleStartDevCombat
          }

          onClose={
            handleCloseDevCombatArena
          }
        />
      )}

      {/* ================================
          COMBATE
      ================================ */}

      {combat &&
        scene.combatEncounter &&
        !hazard &&
        !frenzyOpen &&
        !feedingOpen &&
        !humanityOpen &&
        !pendingAftermath && (
          <CombatPanel
            game={game}

            combat={
              combat
            }

            onAction={
              handleCombatAction
            }

            onFinish={
              handleCombatFinish
            }

            onBoost={
              handleCombatBoost
            }

            onEquipWeapon={
              handleEquipWeapon
            }

            onEquipArmor={
              handleEquipArmor
            }

            onReload={
              handleReload
            }

            disciplineActions={combatDisciplineActions}
            onDisciplineAction={handleCombatDiscipline}
          />
        )}

      {combat &&
        combatDisciplineEvaluation &&
        combatDisciplineTest && (
          <CombatDisciplineTest
            evaluation={
              combatDisciplineEvaluation
            }

            test={
              combatDisciplineTest
            }

            roll={
              combatDisciplineRoll
            }

            onRoll={
              handleCombatDisciplineRoll
            }

            onContinue={
              handleCombatDisciplineContinue
            }

            onCancel={
              clearCombatDisciplineTest
            }
          />
        )}

      {/* ================================
          FRENESI
      ================================ */}

      {frenzyOpen &&
        scene.frenzyTrigger &&
        !combat &&
        !hazard &&
        !pendingAftermath &&
        !humanityOpen && (
          <FrenzyTest
            game={game}

            trigger={
              scene.frenzyTrigger
            }

            result={
              frenzyResult
            }

            onRoll={
              handleFrenzyRoll
            }

            onContinue={
              handleFrenzyResultContinue
            }
          />
        )}

      {/* ================================
          PÓS-FRENESI
      ================================ */}

      {pendingAftermath &&
        !combat &&
        !hazard &&
        !humanityOpen && (
          <FrenzyAftermath
            aftermath={
              pendingAftermath
            }

            onContinue={
              handleAftermathContinue
            }
          />
        )}

      {/* ================================
          ALIMENTAÇÃO
      ================================ */}

      {feedingOpen &&
        feedingVictim &&
        !combat &&
        !hazard &&
        !frenzyOpen &&
        !humanityOpen &&
        !pendingAftermath && (
          <FeedingPanel
            game={game}

            victim={
              feedingVictim
            }

            onDrink={
              handleDrink
            }

            onStop={
              handleStopFeeding
            }
          />
        )}

      {/* ================================
          HUMANIDADE
      ================================ */}

      {humanityOpen &&
        humanityTrigger &&
        !combat &&
        !hazard && (
          <HumanityTest
            game={game}

            trigger={
              humanityTrigger
            }

            result={
              humanityResult
            }

            onRoll={
              handleHumanityRoll
            }

            onContinue={
              handleHumanityContinue
            }
          />
        )}
    </main>
  )
}