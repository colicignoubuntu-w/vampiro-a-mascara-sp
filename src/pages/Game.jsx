import {
  createPoliceResponse,
  updatePoliceResponse,
} from '../engine/police/policeResponseEngine'
import {
  clearPoliceWanted,
  createPoliceWantedState,
  getPoliceRecognitionChance,
  getPoliceWantedState,
  increasePoliceWantedLevel,
  registerPoliceRecognition,
  rollPoliceRecognition,
  rollPoliceWantedEncounter,
  updatePoliceWantedDecay,
} from '../engine/police/policeWantedEngine'
import Haven from '../components/Haven/Haven'
import FreeRoam from '../components/FreeRoam/FreeRoam'
import {
  useQuestStoryProgress,
} from '../engine/quests/useQuestStoryProgress'

import QuestPanel from '../components/QuestPanel/QuestPanel'

import {
  completeQuest,
  completeQuestObjective,
  initializeQuestSystem,
  startQuest,
} from '../engine/quests/questEngine'

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

} from '../engine/masquerade/masqueradeEngine'

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
  createSunriseHazard,
  isSunriseReached,
  sleepThroughDay,
} from '../engine/vampire/daySleepEngine'
import {
  healWithBlood,
} from '../engine/vampire/bloodHealingEngine'

import {
  grantDevAmmo,
  grantDevCombatArsenal,
} from '../engine/combat/devCombatKitEngine'

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
  mustRollToStopFeeding,
  rollStopFeeding,
} from '../engine/instinct/instinctEngine'

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
import CombatDebugPanel from '../components/CombatDebugPanel/CombatDebugPanel'
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
  questOpen,
  setQuestOpen,
] = useState(false)

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
const [
  awakeningFrenzyTrigger,
  setAwakeningFrenzyTrigger,
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

  const [
    stopFeedingRoll,
    setStopFeedingRoll,
  ] = useState(null)


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
    MISSÕES
    ========================================
  */

  function devStartLiviaQuest() {
    const preparedGame =
      initializeQuestSystem(
        game
      )

    const result =
      startQuest(
        preparedGame,
        'livia_legacy'
      )

    if (
      !result.success
    ) {
      window.alert(
        `Não foi possível iniciar a missão: ${result.reason}`
      )

      return
    }

    saveGame(
      result.game
    )

    setGame(
      result.game
    )

    window.alert(
      'Missão iniciada: O Legado de Lívia'
    )
  }

  function devCompleteLiviaObjective() {
    const quest =
      game?.quests
        ?.livia_legacy

    if (
      !quest ||
      quest.status !==
        'active'
    ) {
      window.alert(
        'A missão O Legado de Lívia não está ativa.'
      )

      return
    }

    const objectiveOrder = [
      'reach_livia_apartment',
      'search_livia_apartment',
      'find_livia_diary',
      'inspect_livia_computer',
      'discover_hospital_connection',
    ]

    const nextObjective =
      objectiveOrder.find(
        (objectiveId) =>
          !quest.objectives
            ?.[objectiveId]
            ?.completed
      )

    if (!nextObjective) {
      window.alert(
        'Todos os objetivos já foram concluídos.'
      )

      return
    }

    const result =
      completeQuestObjective(
        game,
        'livia_legacy',
        nextObjective
      )

    if (
      !result.success
    ) {
      window.alert(
        `Erro ao concluir objetivo: ${result.reason}`
      )

      return
    }

    saveGame(
      result.game
    )

    setGame(
      result.game
    )

    window.alert(
      `Objetivo concluído: ${nextObjective}`
    )
  }

  function devCompleteLiviaQuest() {
    const result =
      completeQuest(
        game,
        'livia_legacy'
      )

    if (
      !result.success
    ) {
      window.alert(
        `Não foi possível concluir a missão: ${result.reason}`
      )

      return
    }

    saveGame(
      result.game
    )

    setGame(
      result.game
    )

    window.alert(
      `Missão concluída! +${result.experience} XP`
    )
  }

  /*
    ========================================
    DEV
    ===========================  =============
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
    combatDebugOpen,
    setCombatDebugOpen,
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
     /*
    ========================================
    EXPOSIÇÃO GLOBAL À LUZ DO DIA
    ========================================
  */

  function isOutdoorWorldLocation(
    currentGame
  ) {
    const locationId =
      currentGame?.world
        ?.location
        ?.id

    if (!locationId) {
      return false
    }

    const location =
      getLocation(
        locationId
      )

    if (!location) {
      return false
    }

    /*
      Distritos representam áreas
      abertas da cidade.
    */

    return (
      location.type ===
      'district'
    )
  }

useEffect(() => {
  if (!game) {
    return
  }


  const required =
    Boolean(
      game?.flags
        ?.awakeningFrenzyRequired
    )

  const difficulty =
    Number(
      game?.flags
        ?.awakeningFrenzyDifficulty ??
      0
    )

  if (
    !required ||
    difficulty <= 0
  ) {
    return
  }

  /*
    Evita abrir o mesmo teste
    repetidamente a cada render.
  */

  if (
    awakeningFrenzyTrigger
  ) {
    return
  }
const awakeningReturnScene =
  scene?.id ??
  'free_roam'
  const trigger = {
    id:
      'awakening_hunger_frenzy',

    type:
      'hunger',

    title:
      'A Besta Desperta',

    description:
      'Você desperta com tão pouco sangue que a fome ameaça assumir o controle.',

    difficulty,

    successScene:
      'livia_apartment_wakeup',

    failureOutcomes: [
      {
        id:
          'awakening_hunger_hunt',

        title:
          'Fome Incontrolável',

        durationMinutes:
          10,

        remembered:
          true,

  endScene:
    awakeningReturnScene,
        flags: {
          awakeningHungerFrenzy:
            true,
        },

        memories: [
          'A fome domina seus pensamentos.',

          'Por alguns instantes, tudo o que importa é sangue.',
        ],
      },
    ],

    criticalOutcomes: [
      {
        id:
          'awakening_hunger_critical',

        title:
          'A Besta Assume',

        durationMinutes:
          20,

        remembered:
          false,
 endScene:
    awakeningReturnScene,

        flags: {
          awakeningHungerFrenzy:
            true,

          violentFrenzyOccurred:
            true,
        },

        memories: [
          'Você desperta com a sensação de que alguma coisa dentro de você assumiu o controle.',
        ],
      },
    ],
  }

  setAwakeningFrenzyTrigger(
    trigger
  )

  setFrenzyResult(
    null
  )

  setFrenzyOpen(
    true
  )
}, [
  game?.flags
    ?.awakeningFrenzyRequired,

  game?.flags
    ?.awakeningFrenzyDifficulty,

  awakeningFrenzyTrigger,
])

  useQuestStoryProgress(
    game,
    setGame
  )

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
    SOL GLOBAL NO FREE ROAM
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene
    ) {
      return
    }

    /*
      Só existe risco solar durante o dia.
    */

    if (
      !isSunriseReached(
        game.world
      )
    ) {
      return
    }

    /*
      Se já existe um risco ativo,
      não criamos outro.
    */

    if (hazard) {
      return
    }

    /*
      Se encontrou abrigo neste mesmo
      local, continua protegido.
    */

  const sunlightSheltered =
  Boolean(
    game?.flags
      ?.sunlightSheltered
  )

if (sunlightSheltered) {
  return
}

    /*
      Não abre o Sol por cima de outros
      sistemas importantes.
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
      O risco global do Sol só acontece
      no Free Roam e em locais externos.
    */

    const exposed =
      scene.id ===
        'free_roam' &&
      isOutdoorWorldLocation(
        game
      )

    if (!exposed) {
      return
    }

    /*
      Cria o risco solar.
    */

    const sunlightHazard =
      createSunriseHazard({
        id:
          scene.id,

        location:
          game.world
            ?.location,

        daySafe:
          false,
      })

    const newHazard =
      createHazardState(
        sunlightHazard
      )

    const updatedGame = {
      ...game,

      hazard:
        newHazard,
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
  }, [
    game,
    scene,
    hazard,
    combat,
    frenzyOpen,
    feedingOpen,
    humanityOpen,
    pendingAftermath,
    pendingTest,
    currentLocationId,
  ])
  /*
    ========================================
    ATUALIZA SELECT DEV
    ========================================
  */

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

  function transitionToScene(
    currentGame,
    nextScene,
    {
      flags = {},
      timeMinutes = 0,
      historyItem = null,
    } = {}
  ) {
    if (!nextScene || !scenes[nextScene]) {
      window.alert(`Cena não encontrada: ${nextScene}`)
      return currentGame
    }

    const target = scenes[nextScene]
    const currentHour = Number(currentGame.world?.hour ?? 0)
    const currentMinute = Number(currentGame.world?.minute ?? 0)
    const day = 24 * 60
    const total =
      currentHour * 60 +
      currentMinute +
      Number(timeMinutes ?? 0)
    const normalizedMinutes =
      ((total % day) + day) % day

    return {
      ...currentGame,
      flags: {
        ...(currentGame.flags ?? {}),
        ...flags,
      },
      story: {
        ...(currentGame.story ?? {}),
        previousScene: scene.id,
        scene: nextScene,
      },
      world: {
        ...(currentGame.world ?? {}),
        hour: Math.floor(normalizedMinutes / 60),
        minute: normalizedMinutes % 60,
        location:
          target.location ??
          currentGame.world?.location,
      },
      history: [
        ...(currentGame.history ?? []),
        ...(historyItem ? [historyItem] : []),
      ],
    }
  }

  function processPoliceResponse(
    currentGame
  ) {
    const responseResult =
      updatePoliceResponse(
        currentGame
      )

    let updatedGame =
      responseResult.game

    const event =
      responseResult.event

    if (!event) {
      return {
        game:
          updatedGame,

        event:
          null,

        interrupted:
          false,
      }
    }

    if (
      event.type ===
        'police-arrival' &&
      event.playerPresent
    ) {
      updatedGame =
        transitionToScene(
          updatedGame,
          'police_stop',
          {
            flags: {
              policeArrived:
                true,

              policeArrivalReason:
                event.reason ??
                'unknown',

              policeArrivalSeverity:
                event.severity ??
                'medium',

              policeArrivalLocationId:
                event.locationId ??
                null,

              policeTrouble:
                true,

              policeStopActive:
                true,

              policeChase:
                false,

              escapedPolice:
                false,

              policeEscapeMethod:
                null,

              policeWantedRegistered:
                false,

              possibleMasqueradeRisk:
                true,
            },

            historyItem: {
              type:
                'police-encounter-started',

              locationId:
                event.locationId ??
                null,

              reason:
                event.reason ??
                null,

              timestamp:
                new Date()
                  .toISOString(),
            },
          }
        )

      return {
        game:
          updatedGame,

        event,

        interrupted:
          true,
      }
    }

    return {
      game:
        updatedGame,

      event,

      interrupted:
        false,
    }
  }

  /*
    ========================================
    PROCURA POLICIAL
    ========================================

    Integra policeWantedEngine com o fluxo
    principal do jogo.

    Responsabilidades:
    - registrar uma fuga policial;
    - aumentar o nível se o personagem
      fugir novamente;
    - reduzir procura com o tempo;
    - sortear nova abordagem quando houver
      procura ativa;
    - impedir que a mesma fuga seja
      registrada repetidamente.
  */

  function getGameMinuteStamp(
    currentGame
  ) {
    const day =
      Math.max(
        1,
        Number(
          currentGame?.world
            ?.day ??
          1
        ) || 1
      )

    const hour =
      Math.max(
        0,
        Number(
          currentGame?.world
            ?.hour ??
          0
        ) || 0
      )

    const minute =
      Math.max(
        0,
        Number(
          currentGame?.world
            ?.minute ??
          0
        ) || 0
      )

    return (
      ((day - 1) * 24 * 60) +
      (hour * 60) +
      minute
    )
  }

  function processPoliceWanted(
    currentGame,
    {
      allowEncounter = false,
      policePresence = null,
    } = {}
  ) {
    if (!currentGame) {
      return {
        game:
          currentGame,

        interrupted:
          false,

        encounter:
          null,
      }
    }

    let updatedGame =
      updatePoliceWantedDecay(
        currentGame
      )

    const escapedPolice =
      Boolean(
        updatedGame?.flags
          ?.escapedPolice
      )

    const alreadyRegistered =
      Boolean(
        updatedGame?.flags
          ?.policeWantedRegistered
      )

    let registeredNow =
      false

    /*
      ======================================
      REGISTRAR NOVA FUGA
      ======================================
    */

    if (
      escapedPolice &&
      !alreadyRegistered
    ) {
      const currentWanted =
        getPoliceWantedState(
          updatedGame
        )

      const supernaturalSeen =
        Boolean(
          updatedGame?.flags
            ?.policeWitnessedSupernatural
        )

      const violenceAgainstPolice =
        Boolean(
          updatedGame?.flags
            ?.policeViolence
        )

      const escapeMethod =
        updatedGame?.flags
          ?.policeEscapeMethod ??
        null

      /*
        Se já estava sendo procurado,
        uma nova fuga aumenta a prioridade.

        Caso contrário criamos o primeiro
        registro de procura.
      */

      if (
        currentWanted.active &&
        currentWanted.level > 0
      ) {
        updatedGame =
          increasePoliceWantedLevel(
            updatedGame,
            {
              amount:
                supernaturalSeen ||
                violenceAgainstPolice
                  ? 2
                  : 1,

              reason:
                supernaturalSeen
                  ? 'escaped-again-supernatural'
                  : violenceAgainstPolice
                    ? 'escaped-again-after-violence'
                    : 'escaped-police-again',
            }
          )
      } else {
        updatedGame =
          createPoliceWantedState(
            updatedGame,
            {
              escapedPolice:
                true,

              violenceAgainstPolice,

              supernaturalSeen,

              /*
                Ofuscação deixa testemunhos
                muito pouco confiáveis.

                Nas demais fugas assumimos
                que os policiais ao menos
                conseguem dar uma descrição.
              */

              witnessEvidence:
                escapeMethod !==
                'obfuscation',

              cameraEvidence:
                Boolean(
                  updatedGame?.flags
                    ?.policeCameraEvidence
                ),

              escapeMethod,

              reason:
                supernaturalSeen
                  ? 'escaped-with-supernatural-power'
                  : violenceAgainstPolice
                    ? 'escaped-after-police-violence'
                    : 'escaped-police',
            }
          )
      }

      registeredNow =
        true

      updatedGame = {
        ...updatedGame,

        flags: {
          ...(updatedGame.flags ??
            {}),

          policeWantedRegistered:
            true,

          policeLookingForPlayer:
            Boolean(
              updatedGame
                ?.policeWanted
                ?.active
            ),
        },
      }
    }

    /*
      Mantém a flag antiga sincronizada com
      o novo estado autoritativo.
    */

    const wanted =
      getPoliceWantedState(
        updatedGame
      )

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        policeLookingForPlayer:
          wanted.active,
      },
    }

    /*
      Não sorteamos uma nova abordagem no
      mesmo instante em que a fuga acabou.
    */

    if (
      !allowEncounter ||
      registeredNow ||
      !wanted.active ||
      wanted.level <= 0 ||
      updatedGame?.flags
        ?.policeStopActive ||
      updatedGame?.flags
        ?.policeChase
    ) {
      return {
        game:
          updatedGame,

        interrupted:
          false,

        encounter:
          null,
      }
    }

    const locationId =
      updatedGame?.world
        ?.location
        ?.id ??
      null

    const locationDefinition =
      locationId
        ? getLocation(
            locationId
          )
        : null

    const resolvedPolicePresence =
      policePresence !==
        null &&
      policePresence !==
        undefined
        ? Number(
            policePresence
          )
        : Number(
            locationDefinition
              ?.policePresence ??
            updatedGame?.world
              ?.location
              ?.policePresence ??
            0
          )

    /*
      Lugares sem presença policial
      configurada nunca geram abordagem.

      Exemplo:
      - esconderijo Sabbat;
      - subterrâneo secreto;
      - túnel isolado.
    */

    if (
      !Number.isFinite(
        resolvedPolicePresence
      ) ||
      resolvedPolicePresence <= 0
    ) {
      return {
        game:
          updatedGame,

        interrupted:
          false,

        encounter:
          null,
      }
    }

    const encounter =
      rollPoliceWantedEncounter(
        updatedGame,
        {
          policePresence:
            resolvedPolicePresence,
        }
      )

    if (
      !encounter.triggered
    ) {
      return {
        game:
          updatedGame,

        interrupted:
          false,

        encounter,
      }
    }

    /*
      ======================================
      NOVA ABORDAGEM
      ======================================

      Primeiro a viatura encontra o
      personagem.

      Depois fazemos uma segunda rolagem
      para descobrir se os policiais
      reconhecem o personagem como sendo
      o suspeito procurado.

      Esta rolagem é separada da chance
      de encontro policial.
    */

    const recognition =
      rollPoliceRecognition(
        updatedGame,
        {
          /*
            Neste primeiro contato os
            policiais ainda estão apenas
            observando o personagem.

            Quando ele entregar documento
            posteriormente podemos usar
            closeInspection: true em uma
            nova verificação, se desejarmos.
          */

          closeInspection:
            false,

          knownIdentity:
            Boolean(
              updatedGame?.flags
                ?.policeKnownIdentity
            ),

          changedClothes:
            Boolean(
              updatedGame?.flags
                ?.changedClothesAfterPolice
            ),

          disguise:
            Boolean(
              updatedGame?.flags
                ?.policeDisguise
            ),

          poorLighting:
            Boolean(
              updatedGame?.flags
                ?.policePoorLighting
            ),
        }
      )

    updatedGame =
      registerPoliceRecognition(
        updatedGame,
        recognition
      )

    /*
      Se futuramente existir uma cena
      específica de reconhecimento,
      podemos usá-la.

      Enquanto ela ainda não existir,
      continuamos usando police_stop.

      Dessa forma esta alteração NÃO
      quebra o jogo durante esta etapa.
    */

    const recognitionScene =
      recognition.recognized &&
      scenes.police_recognized
        ? 'police_recognized'
        : 'police_stop'

    updatedGame =
      transitionToScene(
        updatedGame,
        recognitionScene,
        {
          flags: {
            policeTrouble:
              true,

            policeStopActive:
              true,

            policeChase:
              false,

            escapedPolice:
              false,

            policeEscapeMethod:
              null,

            policeWantedRegistered:
              false,

            policeWantedEncounter:
              true,

            policeWantedLevel:
              wanted.level,

            policeRecognitionChecked:
              true,

            policeRecognizedPlayer:
              Boolean(
                recognition.recognized
              ),

            policeRecognitionChance:
              recognition.chance,

            policeRecognitionRoll:
              recognition.roll ??
              null,
          },

          historyItem: {
            type:
              recognition.recognized
                ? 'police-wanted-recognized'
                : 'police-wanted-not-recognized',

            wantedLevel:
              wanted.level,

            wantedLabel:
              wanted.label,

            encounterChance:
              encounter.chance,

            recognitionChance:
              recognition.chance,

            recognized:
              Boolean(
                recognition.recognized
              ),

            locationId,

            timestamp:
              new Date()
                .toISOString(),
          },
        }
      )

    return {
      game:
        updatedGame,

      interrupted:
        true,

      encounter: {
        ...encounter,

        recognition,
      },
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
    setStopFeedingRoll(null)
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
function handleFreeRoamGameChange(
  updatedGame
) {
  const timeAdvanced =
    getGameMinuteStamp(
      updatedGame
    ) >
    getGameMinuteStamp(
      game
    )

  const policeResult =
    processPoliceResponse(
      updatedGame
    )

  let processedGame =
    policeResult.game

  if (
    policeResult.interrupted
  ) {
    saveGame(
      processedGame
    )

    setGame(
      processedGame
    )

    resetSceneSystems()
    clearTest()
    goToTop()

    return
  }

  const wantedResult =
    processPoliceWanted(
      processedGame,
      {
        allowEncounter:
          timeAdvanced,
      }
    )

  processedGame =
    wantedResult.game

  saveGame(
    processedGame
  )

  setGame(
    processedGame
  )

  if (
    wantedResult.interrupted
  ) {
    resetSceneSystems()
    clearTest()
    goToTop()
  }
}

function handleHavenComputer() {
  const updatedGame =
    transitionToScene(
      game,
      'livia_computer',
      {
        timeMinutes: 1,

        historyItem: {
          type:
            'haven-computer',

          locationId:
            'livia_apartment',

          timestamp:
            new Date()
              .toISOString(),
        },
      }
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
  INVESTIGAÇÃO DOS DESAPARECIMENTOS
  ========================================
*/

function handleHavenInvestigation() {
  const updatedGame =
    transitionToScene(
      game,
      'strange_hospitals_records',
      {
        timeMinutes: 1,

        historyItem: {
          type:
            'haven-hospital-investigation',

          locationId:
            'livia_apartment',

          timestamp:
            new Date()
              .toISOString(),
        },
      }
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
    ESCOLHAS NORMAIS
    ========================================
  */

 function performNormalChoice(
  choice
) {
  let updatedGame =
    applyChoice(
      game,
      scene,
      choice
    )

  const policeResult =
    processPoliceResponse(
      updatedGame
    )

  updatedGame =
    policeResult.game

  if (
    policeResult.interrupted
  ) {
    persist(
      updatedGame
    )

    resetSceneSystems()
    clearTest()
    goToTop()

    return
  }

  const wantedResult =
    processPoliceWanted(
      updatedGame,
      {
        allowEncounter:
          false,
      }
    )

  updatedGame =
    wantedResult.game

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

function handleHavenDaySleep() {
  let updatedGame =
    sleepThroughDay(
      game
    )

  const enteredTorpor =
    Boolean(
      updatedGame
        ?.vampireState
        ?.torpor
    )

  /*
    ========================================
    TORPOR
    ========================================
  */

  if (
    enteredTorpor
  ) {
    updatedGame =
      transitionToScene(
        updatedGame,
        'livia_apartment_torpor',
        {
          flags: {
            wokeInLiviaHaven:
              false,

            hasHaven:
              true,

            inheritedLiviaApartment:
              true,

            liviaApartmentUnlocked:
              true,

            inTorpor:
              true,

            awakeningTorpor:
              true,
          },

          historyItem: {
            type:
              'entered-torpor',

            reason:
              'blood_depletion',

            locationId:
              'livia_apartment',

            timestamp:
              new Date()
                .toISOString(),
          },
        }
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

    return
  }

  /*
    ========================================
    DESPERTAR NORMAL / FOME
    ========================================
  */

  updatedGame =
    transitionToScene(
      updatedGame,
      'livia_apartment_wakeup',
      {
        flags: {
          wokeInLiviaHaven:
            true,

          hasHaven:
            true,

          inheritedLiviaApartment:
            true,

          liviaApartmentUnlocked:
            true,
        },

        historyItem: {
          type:
            'haven-day-sleep',

          locationId:
            'livia_apartment',

          timestamp:
            new Date()
              .toISOString(),
        },
      }
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
  function handleRecognizedDocument() {
    if (!game) {
      return
    }

    /*
      O personagem entrega o documento.
      A inspeção próxima torna o reconhecimento
      mais confiável do que uma observação casual.
    */

    const recognition =
      rollPoliceRecognition(
        game,
        {
          closeInspection:
            true,

          knownIdentity:
            Boolean(
              game?.flags
                ?.policeKnownIdentity
            ),
        }
      )

    let updatedGame =
      registerPoliceRecognition(
        game,
        recognition
      )

    const identityConfirmed =
      Boolean(
        game?.flags
          ?.policeKnownIdentity
      ) ||
      Boolean(
        recognition.recognized
      )

    updatedGame =
      transitionToScene(
        updatedGame,
        identityConfirmed
          ? 'police_identity_confirmed'
          : 'police_identity_uncertain',
        {
          timeMinutes:
            2,

          flags: {
            policeStopActive:
              true,

            policeTrouble:
              true,

            policeDocumentChecked:
              true,

            policeCloseInspection:
              true,

            policeIdentityConfirmed:
              identityConfirmed,

            policeRecognizedPlayer:
              identityConfirmed,

            policeRecognitionChecked:
              true,

            policeRecognitionChance:
              recognition.chance,

            policeRecognitionRoll:
              recognition.roll ??
              null,
          },

          historyItem: {
            type:
              'police-document-check',

            recognized:
              Boolean(
                recognition.recognized
              ),

            identityConfirmed,

            chance:
              recognition.chance,

            roll:
              recognition.roll ??
              null,

            timestamp:
              new Date()
                .toISOString(),
          },
        }
      )

    persist(
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
  game?.vampireState
    ?.torpor
) {
  return
}
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
if (
  scene.id ===
    'livia_apartment_rest' &&
  choice.id ===
    'haven_sleep_until_night'
) {
  handleHavenDaySleep()

  return
}
    if (
      scene.id ===
        'police_recognized' &&
      choice.id ===
        'recognized_show_document'
    ) {
      handleRecognizedDocument()

      return
    }

    const test =
      getChoiceTest(
        scene.id,
        choice.id,
        game
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

    let updatedGame =
      applyTestOutcome(
        game,
        scene,
        pendingChoice,
        pendingTest,
        currentRoll
      )

    const wantedResult =
      processPoliceWanted(
        updatedGame,
        {
          allowEncounter:
            false,
        }
      )

    updatedGame =
      wantedResult.game

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

    const wantedResult =
      processPoliceWanted(
        updatedGame,
        {
          allowEncounter:
            false,
        }
      )

    updatedGame =
      wantedResult.game

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
  if (
    game?.flags
      ?.policeChase
  ) {
    return
  }

  if (
    game?.vampireState
      ?.torpor
  ) {
    return
  }

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
function getLiviaApartmentScene(
  currentGame
) {
  const questStatus =
    currentGame?.quests
      ?.livia_legacy
      ?.status

  const hospitalDiscovered =
    Boolean(
      currentGame?.flags
        ?.discoveredHospitalConnection ||
      currentGame?.flags
        ?.liviaHospitalConnection
    )

  const alreadyVisited =
    Boolean(
      currentGame?.flags
        ?.visitedLiviaApartment
    )

  /*
    ========================================
    REFÚGIO JÁ ESTABELECIDO
    ========================================

    Depois que a investigação principal
    avançou, não usamos mais a cena
    narrativa livia_apartment_haven.

    Vamos direto para free_roam mantendo
    a localização no apartamento.

    O Game.jsx então renderiza o componente
    Haven automaticamente.
  */

  if (
    questStatus ===
      'completed' ||
    hospitalDiscovered
  ) {
    return 'free_roam'
  }

  /*
    O jogador já entrou anteriormente,
    mas ainda não terminou a investigação.
  */

  if (
    alreadyVisited
  ) {
    return 'livia_apartment_inside'
  }

  /*
    Primeira visita.
  */

  return 'livia_apartment_arrival'
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

  /*
    ========================================
    REALIZAR VIAGEM
    ========================================
  */

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

  /*
    ========================================
    MARCAR LOCAL COMO VISITADO
    ========================================
  */

  updatedGame = {
    ...updatedGame,

    flags: {
      ...(updatedGame.flags ??
        {}),

      [`visited_${destination.id}`]:
        true,

      pendingPublicReactionCheck:
        true,

      publicReactionLocationId:
        destination.id,

      publicReactionReason:
        'travel-arrival',
    },
  }

  /*
    ========================================
    RESPOSTA POLICIAL DURANTE A VIAGEM
    ========================================

    performTravel() já:

    1. avança o relógio;
    2. muda world.location para o destino.

    Portanto agora o policeResponseEngine
    consegue determinar corretamente se:

    - a polícia ainda está a caminho;
    - ela chegou enquanto o jogador viajava;
    - o jogador já deixou o local da ocorrência.

    IMPORTANTE:

    A polícia não segue magicamente
    o personagem até o destino.

    A ocorrência continua vinculada ao
    local onde foi chamada.
  */

  const policeResult =
    processPoliceResponse(
      updatedGame
    )

  updatedGame =
    policeResult.game

  /*
    ========================================
    POLÍCIA INTERROMPEU A VIAGEM
    ========================================

    É um caso raro, mas mantemos o sistema
    preparado caso o personagem esteja no
    próprio local associado à ocorrência
    quando a chegada for processada.
  */

  if (
    policeResult.interrupted
  ) {
    persist(
      updatedGame
    )

    setTravelOpen(
      false
    )

    clearTravelEvent()

    resetSceneSystems()

    clearTest()

    goToTop()

    return
  }

  /*
    ========================================
    PROCURA POLICIAL DURANTE A VIAGEM
    ========================================

    Se o personagem estiver sendo procurado,
    cada viagem que realmente avança o tempo
    pode gerar uma nova abordagem.

    O cálculo considera a presença policial
    do destino. Locais secretos com presença
    zero continuam seguros desse sistema.
  */

  const wantedResult =
    processPoliceWanted(
      updatedGame,
      {
        allowEncounter:
          true,

        policePresence:
          destination
            ?.policePresence ??
          null,
      }
    )

  updatedGame =
    wantedResult.game

  if (
    wantedResult.interrupted
  ) {
    persist(
      updatedGame
    )

    setTravelOpen(
      false
    )

    clearTravelEvent()

    resetSceneSystems()

    clearTest()

    goToTop()

    return
  }

  /*
    ========================================
    CHEGADA AO REFÚGIO
    ========================================
  */

  if (
    destination.id ===
      'livia_apartment' &&
    !result.event
  ) {
    updatedGame =
      transitionToScene(
        updatedGame,
        getLiviaApartmentScene(
          updatedGame
        ),
        {
          flags: {
            visitedLiviaApartment:
              true,

            hasHaven:
              true,

            inheritedLiviaApartment:
              true,

            liviaApartmentUnlocked:
              true,
          },

          historyItem: {
            type:
              'haven-arrival',

            locationId:
              'livia_apartment',

            timestamp:
              new Date()
                .toISOString(),
          },
        }
      )
  }

  /*
    ========================================
    SALVAR VIAGEM
    ========================================
  */

  persist(
    updatedGame
  )

  setTravelOpen(
    false
  )

  /*
    ========================================
    INFORMAÇÕES DA VIAGEM
    ========================================
  */

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

  /*
    ========================================
    EVENTO DE VIAGEM
    ========================================
  */

  if (
    result.event
  ) {
    setTravelEvent(
      result.event
    )

    return
  }

  resetSceneTriggers()

  goToTop()
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

  let updatedGame =
    game

  /*
    Depois de um evento simples de viagem,
    finalmente entramos no refúgio.
  */

  if (
    travelEventInfo
      ?.toId ===
      'livia_apartment'
  ) {
    updatedGame =
      transitionToScene(
        updatedGame,
        getLiviaApartmentScene(
  updatedGame
),
        {
          flags: {
            visitedLiviaApartment:
              true,

            hasHaven:
              true,

            inheritedLiviaApartment:
              true,

            liviaApartmentUnlocked:
              true,
          },
        }
      )

    persist(
      updatedGame
    )
  }

  clearTravelEvent()
  resetSceneTriggers()
  goToTop()
}

  function handleTravelEventRoll() {
    const roll = executeTravelEventTest(game, travelEvent)
    if (!roll) return
    setTravelEventRoll(roll)
    setTravelEventOutcome(getTravelEventOutcome(travelEvent, roll))
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
  } else if (
    travelEventInfo
      ?.toId ===
      'livia_apartment'
  ) {
    updatedGame =
      transitionToScene(
        updatedGame,
        getLiviaApartmentScene(
  updatedGame
),
        {
          flags: {
            visitedLiviaApartment:
              true,

            hasHaven:
              true,

            inheritedLiviaApartment:
              true,

            liviaApartmentUnlocked:
              true,
          },

          historyItem: {
            type:
              'haven-arrival-after-event',

            timestamp:
              new Date()
                .toISOString(),
          },
        }
      )
  }

  persist(
    updatedGame
  )

  clearTravelEvent()
  resetSceneTriggers()
  goToTop()
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
  if (!hazard) {
    return
  }

  const globalSunlight =
    hazard?.type ===
    'sunlight'

  /*
    ========================================
    SOL GLOBAL — ENCONTROU ABRIGO
    ========================================

    Não mudamos de cena.

    O personagem continua no mesmo
    distrito, mas agora está protegido
    dentro de algum prédio, cobertura,
    estação, garagem etc.
  */

  if (
    globalSunlight &&
    hazard.escaped
  ) {
    const updatedGame = {
      ...game,

      hazard:
        null,

      flags: {
        ...(game.flags ?? {}),

        sunlightSheltered:
          true,

        sunlightShelterLocationId:
          game?.world
            ?.location
            ?.id ??
          null,
      },

      history: [
        ...(game.history ?? []),

        {
          type:
            'sunlight-shelter',

          locationId:
            game?.world
              ?.location
              ?.id ??
            null,

          hour:
            game?.world
              ?.hour ??
            null,

          minute:
            game?.world
              ?.minute ??
            null,

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

    return
  }

  /*
    ========================================
    CONFIGURAÇÃO NORMAL DO RISCO
    ========================================
  */

  const config =
    globalSunlight
      ? {
          successScene:
            scene.id,

          destructionScene:
            'vampire_destroyed_sunlight',
        }
      : (
          hazard.config ??
          hazard.hazard ??
          scene?.hazardEncounter ??
          hazard
        )

  if (!config) {
    return
  }

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

  function handleCombatHeal() {
    if (
      !game ||
      !combat ||
      combat.status !==
        'active'
    ) {
      return
    }

    const result =
      healWithBlood(
        game
      )

    if (
      !result.success
    ) {
      const reason =
        result.reason ??
        result.log?.[0]?.text ??
        'Não foi possível curar o ferimento.'

      window.alert(
        reason
      )

      return
    }

    const updatedCombat = {
      ...combat,

      log: [
        ...(combat.log ??
          []),

        ...(result.log ??
          []),
      ],
    }

    const updatedGame = {
      ...result.game,

      combat:
        updatedCombat,
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )
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
  if (!combat) {
    return
  }

  /*
    ========================================
    IDENTIFICA COMBATE DEV
    ========================================

    A Arena DEV cria combates que não
    pertencem necessariamente ao
    combatEncounter da cena atual.

    Por isso eles não devem tentar usar
    victoryScene / defeatScene da cena.
  */

  const isDevCombat =
    String(
      combat.encounterId ??
      ''
    ).startsWith(
      'dev_'
    ) ||
    Boolean(
      game?.history?.some(
        (entry) =>
          entry.type ===
            'dev-combat-start' &&
          entry.encounterId ===
            combat.encounterId
      )
    )

  /*
    ========================================
    FINALIZA COMBATE DEV
    ========================================
  */

  if (isDevCombat) {
    let updatedGame =
      clearCombatBoosts(
        game
      )

    updatedGame = {
      ...updatedGame,

      combat:
        null,

      history: [
        ...(updatedGame.history ??
          []),

        {
          type:
            'dev-combat-finish',

          scene:
            scene?.id ??
            null,

          encounterId:
            combat.encounterId ??
            null,

          enemy:
            combat.enemy
              ?.name ??
            null,

          winner:
            combat.winner ??
            null,

          endingReason:
            combat.endingReason ??
            null,

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

    /*
      Muito importante:

      marcamos a cena atual como já
      verificada para impedir que o
      useEffect de DETECTA COMBATE crie
      imediatamente o combatEncounter
      da cena e abra outra luta.
    */

    if (
      scene?.id
    ) {
      setCombatCheckedScene(
        scene.id
      )
    }

    setCombatDebugOpen(
      false
    )

    clearCombatDisciplineTest()

    goToTop()

    return
  }

  /*
    ========================================
    COMBATE NORMAL DA HISTÓRIA
    ========================================
  */

  if (
    !scene?.combatEncounter
  ) {
    /*
      Segurança.

      Se por algum motivo existir um
      combate fora de uma cena de combate,
      ainda conseguimos fechá-lo.
    */

    let updatedGame =
      clearCombatBoosts(
        game
      )

    updatedGame = {
      ...updatedGame,

      combat:
        null,

      history: [
        ...(updatedGame.history ??
          []),

        {
          type:
            'combat-finish',

          scene:
            scene?.id ??
            null,

          encounterId:
            combat.encounterId ??
            null,

          enemy:
            combat.enemy
              ?.name ??
            null,

          winner:
            combat.winner ??
            null,

          endingReason:
            combat.endingReason ??
            null,

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

    if (
      scene?.id
    ) {
      setCombatCheckedScene(
        scene.id
      )
    }

    setCombatDebugOpen(
      false
    )

    clearCombatDisciplineTest()

    goToTop()

    return
  }

  const encounter =
    scene.combatEncounter

  let nextScene =
    null

  /*
    Vampiro estacado possui uma
    resolução especial.
  */

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

  /*
    ========================================
    SEM CENA DE DESTINO

    Antes isso travava o jogador.

    Agora, se o encontro não possuir uma
    cena válida após o combate, fechamos
    o combate normalmente e permanecemos
    na cena atual.
    ========================================
  */

  if (
    !nextScene ||
    !scenes[
      nextScene
    ]
  ) {
    let updatedGame =
      clearCombatBoosts(
        game
      )

    updatedGame = {
      ...updatedGame,

      combat:
        null,

      history: [
        ...(updatedGame.history ??
          []),

        {
          type:
            'combat-finish-no-target',

          scene:
            scene?.id ??
            null,

          encounterId:
            combat.encounterId ??
            null,

          enemy:
            combat.enemy
              ?.name ??
            null,

          winner:
            combat.winner ??
            null,

          endingReason:
            combat.endingReason ??
            null,

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

    if (
      scene?.id
    ) {
      setCombatCheckedScene(
        scene.id
      )
    }

    setCombatDebugOpen(
      false
    )

    clearCombatDisciplineTest()

    goToTop()

    return
  }

  /*
    ========================================
    TRANSIÇÃO NORMAL
    ========================================
  */

  const target =
    scenes[
      nextScene
    ]

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

    history: [
      ...(updatedGame.history ??
        []),

      {
        type:
          'combat-finish',

        scene:
          scene.id,

        nextScene,

        encounterId:
          combat.encounterId ??
          encounter.id ??
          null,

        enemy:
          combat.enemy
            ?.name ??
          null,

        winner:
          combat.winner ??
          null,

        endingReason:
          combat.endingReason ??
          null,

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

  setCombatCheckedScene(
    null
  )

  setCombatDebugOpen(
    false
  )

  clearCombatDisciplineTest()

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
    if (
      !feedingVictim ||
      stopFeedingRoll
    ) {
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

  function finalizeFeeding(
    sourceGame = game,
    sourceVictim = feedingVictim,
    sourceTotal = feedingTotal
  ) {
    if (
      !sourceVictim ||
      !scene.feedingEncounter
    ) {
      return
    }

    const config =
      scene.feedingEncounter

    const victim =
      sealBiteWound(
        sourceVictim
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
          sourceTotal,

        gameTime:
          formatGameTime(
            sourceGame.world
          ),
      })

    const updatedGame = {
      ...sourceGame,

      activeFeeding:
        null,

      flags: {
        ...(sourceGame.flags ??
          {}),

        fedFromHuman:
          sourceTotal > 0,

        ...(victimDead
          ? {
              killedHumanByFeeding:
                true,

              humanityCheckRequired:
                true,

              feedingFrenzyKilledVictim:
                Boolean(
                  stopFeedingRoll &&
                  stopFeedingRoll
                    .result !==
                    'success'
                ),
            }
          : {}),
      },

      history: [
        ...(sourceGame.history ??
          []),

        historyEntry,

        ...(stopFeedingRoll
          ? [
              {
                type:
                  'stop-feeding-test',

                result:
                  stopFeedingRoll
                    .result,

                successes:
                  stopFeedingRoll
                    .successes ??
                  0,

                difficulty:
                  stopFeedingRoll
                    .difficulty ??
                  null,

                dice:
                  stopFeedingRoll
                    .dice ??
                  [],

                timestamp:
                  new Date()
                    .toISOString(),
              },
            ]
          : []),
      ],

      story: {
        ...(sourceGame.story ??
          {}),

        previousScene:
          scene.id,

        scene:
          nextScene,
      },

      world: {
        ...(sourceGame.world ??
          {}),

        location:
          scenes[nextScene]
            ?.location ??
          sourceGame.world
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

  function handleStopFeeding() {
    if (
      !feedingVictim ||
      !scene.feedingEncounter ||
      stopFeedingRoll
    ) {
      return
    }

    const victimDead =
      !feedingVictim.alive ||
      feedingVictim.blood
        .current <= 0

    /*
      Vítima morta ou nenhum sangue
      ingerido: não existe disputa
      para interromper o Beijo.
    */

    if (
      victimDead ||
      feedingTotal <= 0
    ) {
      finalizeFeeding()

      return
    }

    /*
      Com reserva de sangue suficiente,
      o personagem consegue se afastar
      sem teste.
    */

    if (
      !mustRollToStopFeeding(
        game
      )
    ) {
      finalizeFeeding()

      return
    }

    /*
      Fome intensa: Autocontrole para
      conseguir abandonar sangue fresco.
    */

    const roll =
      rollStopFeeding(
        game,
        {
          ...feedingVictim,

          animal:
            Boolean(
              scene.feedingEncounter
                ?.victim?.animal
            ),
        }
      )

    const updatedGame = {
      ...game,

      lastStopFeedingRoll: {
        ...roll,

        victimId:
          feedingVictim.id,

        victimName:
          feedingVictim.name,

        timestamp:
          new Date()
            .toISOString(),
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setStopFeedingRoll(
      roll
    )
  }

  function handleResolveStopFeeding() {
    if (
      !stopFeedingRoll ||
      !feedingVictim
    ) {
      return
    }

    /*
      SUCESSO:
      o personagem recupera o controle
      e encerra a alimentação.
    */

    if (
      stopFeedingRoll.result ===
      'success'
    ) {
      finalizeFeeding()

      return
    }

    /*
      FALHA:
      a Besta força mais 1 ponto.

      FALHA CRÍTICA:
      a perda de controle é mais severa
      e tenta beber 2 pontos.
    */

    const forcedAmount =
      stopFeedingRoll.result ===
        'botch'
        ? 2
        : 1

    const result =
      drinkBlood({
        game,

        victim:
          feedingVictim,

        amount:
          forcedAmount,
      })

    const newTotal =
      feedingTotal +
      result.amountDrunk

    const forcedHistory = {
      type:
        'feeding-control-failure',

      result:
        stopFeedingRoll.result,

      forcedAmount:
        result.amountDrunk,

      victimId:
        result.victim?.id ??
        feedingVictim.id,

      victimBloodRemaining:
        result.victim?.blood
          ?.current ??
        null,

      timestamp:
        new Date()
          .toISOString(),
    }

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

      flags: {
        ...(result.game.flags ??
          {}),

        lostControlWhileFeeding:
          true,

        ...(stopFeedingRoll
          .result ===
          'botch'
          ? {
              botchedStopFeeding:
                true,
            }
          : {}),
      },

      history: [
        ...(result.game.history ??
          []),

        forcedHistory,
      ],
    }

    const victimDead =
      !result.victim.alive ||
      result.victim.blood.current <=
        0

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

    /*
      Se a Besta matou a vítima, encerra
      imediatamente e deixa Humanidade
      assumir em seguida.
    */

    if (
      victimDead
    ) {
      finalizeFeeding(
        updatedGame,
        result.victim,
        newTotal
      )

      return
    }

    /*
      A vítima sobreviveu.

      O jogador volta ao painel e pode
      tentar parar novamente. Como agora
      possui mais sangue, a dificuldade
      pode diminuir naturalmente.
    */

    setStopFeedingRoll(
      null
    )
  }

  /*
    ========================================
    FRENESI / RÖTSCHRECK
    ========================================
  */

function handleFrenzyRoll() {
  const trigger =
    awakeningFrenzyTrigger ??
    scene.frenzyTrigger

  if (!trigger) {
    return
  }

  const roll =
    executeFrenzyTest(
      game,
      trigger
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
  const trigger =
    awakeningFrenzyTrigger ??
    scene.frenzyTrigger

  if (
    !frenzyResult ||
    !trigger
  ) {
    return
  }

  /*
    ========================================
    SUCESSO
    ========================================
  */

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

    const awakeningFrenzy =
      trigger.id ===
      'awakening_hunger_frenzy'

    const updatedGame = {
      ...game,

      flags: {
        ...(game.flags ?? {}),

        resistedFrenzy:
          true,

        /*
          Se esse teste veio do despertar,
          removemos as flags que fariam
          o teste abrir novamente.
        */

        ...(awakeningFrenzy
          ? {
              awakeningFrenzyRequired:
                false,

              awakeningFrenzyDifficulty:
                null,

              awakeningHungerCheck:
                false,

              awakeningHungerFrenzy:
                false,
            }
          : {}),
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

    /*
      Remove também o trigger temporário
      do despertar.
    */

    if (
      awakeningFrenzy
    ) {
      setAwakeningFrenzyTrigger(
        null
      )
    }

    clearFrenzy()
    resetSceneSystems()
    goToTop()

    return
  }

  /*
    ========================================
    FALHA / FALHA CRÍTICA
    ========================================
  */

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

  /*
    Não apagamos ainda todas as
    consequências do frenesi.

    O FrenzyAftermath vai cuidar
    da continuação.
  */

  if (
    trigger.id ===
    'awakening_hunger_frenzy'
  ) {
    setAwakeningFrenzyTrigger(
      null
    )
  }

  clearFrenzy()
}

 function handleAftermathContinue() {console.log(
  '===== RECUPERAR CONTROLE ====='
)

console.log(
  'SCENE ATUAL:',
  game?.story?.scene
)

console.log(
  'BEAST:',
  game?.beast
)

console.log(
  'PENDING AFTERMATH:',
  game?.beast?.pendingAftermath
)

console.log(
  'END SCENE:',
  game?.beast
    ?.pendingAftermath
    ?.endScene
)

window.alert(
  `Recuperar controle\nCena atual: ${
    game?.story?.scene
  }\nEndScene: ${
    game?.beast
      ?.pendingAftermath
      ?.endScene
  }`
)
  let updatedGame =
    finishFrenzyAftermath(
      game
    )

  const awakeningFrenzy =
    game?.beast
      ?.cause ===
    'awakening_hunger_frenzy'

  if (
    awakeningFrenzy
  ) {
    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        awakeningFrenzyRequired:
          false,

        awakeningFrenzyDifficulty:
          null,

        awakeningHungerCheck:
          false,

        awakeningHungerFrenzy:
          false,
      },
    }

    setAwakeningFrenzyTrigger(
      null
    )
  }

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
    encounter
  ) {
    if (
      !encounter ||
      !encounter.enemy
    ) {
      window.alert(
        'Encontro DEV inválido.'
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
            encounter.id ??
            'custom-dev-combat',

          enemy:
            encounter.enemy
              ?.name ??
            null,

          clan:
            encounter.enemy
              ?.clan ??
            null,

          generation:
            encounter.enemy
              ?.generation ??
            null,

          distance:
            encounter.distance ??
            encounter.environment
              ?.distance ??
            'close',

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

    setCombatDebugOpen(
      false
    )

    clearCombatDisciplineTest()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
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

            policeStopActive:
              true,

            policeChase:
              false,

            escapedPolice:
              false,

            policeEscapeMethod:
              null,

            policeWantedRegistered:
              false,
          },
        }
      )

    persist(updatedGame)
    setDevOpen(false)
    resetSceneSystems()
  }

  const DEV_DISCIPLINES = [
    { id: 'auspex', label: 'Auspex' },
    { id: 'celerity', label: 'Celeridade' },
    { id: 'dementia', label: 'Demência' },
    { id: 'dominate', label: 'Dominação' },
    { id: 'fortitude', label: 'Fortitude' },
    { id: 'obfuscate', label: 'Ofuscação' },
    { id: 'potence', label: 'Potência' },
    { id: 'presence', label: 'Presença' },
    { id: 'protean', label: 'Metamorfose' },
    { id: 'thaumaturgy', label: 'Taumaturgia' },
  ]

  function getDevDisciplineLevel(id) {
    return Number(game?.disciplines?.[id] ?? 0)
  }

  function devSetDiscipline(id, level) {
    const normalizedLevel = Math.max(0, Math.min(5, Number(level) || 0))

    const originalDisciplines =
      game?.devOriginalDisciplines ??
      { ...(game?.disciplines ?? {}) }

    const updatedGame = {
      ...game,
      devOriginalDisciplines: originalDisciplines,
      disciplines: {
        ...(game?.disciplines ?? {}),
        [id]: normalizedLevel,
      },
    }

    persist(updatedGame)
  }

  function devSetAllDisciplines(level) {
    const normalizedLevel = Math.max(0, Math.min(5, Number(level) || 0))
    const originalDisciplines =
      game?.devOriginalDisciplines ??
      { ...(game?.disciplines ?? {}) }

    const disciplines = { ...(game?.disciplines ?? {}) }

    DEV_DISCIPLINES.forEach(({ id }) => {
      disciplines[id] = normalizedLevel
    })

    persist({
      ...game,
      devOriginalDisciplines: originalDisciplines,
      disciplines,
    })
  }

  function devRestoreDisciplines() {
    if (!game?.devOriginalDisciplines) {
      window.alert('Ainda não existe uma cópia das disciplinas originais.')
      return
    }

    const updatedGame = {
      ...game,
      disciplines: { ...game.devOriginalDisciplines },
    }

    delete updatedGame.devOriginalDisciplines
    persist(updatedGame)
    window.alert('Disciplinas originais restauradas.')
  }

  function devCreatePoliceWanted() {
    let updatedGame =
      createPoliceWantedState(
        game,
        {
          level: 2,

          escapedPolice:
            true,

          witnessEvidence:
            true,

          cameraEvidence:
            false,

          supernaturalSeen:
            false,

          violenceAgainstPolice:
            false,

          reason:
            'dev-test',
        }
      )

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        escapedPolice:
          true,

        policeWantedRegistered:
          true,

        policeLookingForPlayer:
          true,

        policeEscapeMethod:
          'dev',
      },
    }

    persist(
      updatedGame
    )

    window.alert(
      'Procura policial DEV criada no nível 2.'
    )
  }

  function devClearPoliceWanted() {
    let updatedGame =
      clearPoliceWanted(
        game,
        {
          reason:
            'dev-clear',
        }
      )

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        escapedPolice:
          false,

        policeWantedRegistered:
          false,

        policeLookingForPlayer:
          false,

        policeWantedEncounter:
          false,

        policeWantedLevel:
          0,

        policeEscapeMethod:
          null,
      },
    }

    persist(
      updatedGame
    )

    window.alert(
      'Procura policial removida.'
    )
  }

  function devShowPoliceWanted() {
    const wanted =
      getPoliceWantedState(
        game
      )

    console.log(
      'PROCURA POLICIAL',
      wanted
    )

    window.alert(
      `Procura policial: ${wanted.label} (nível ${wanted.level}).`
    )
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
      grantDevCombatArsenal(
        game,
        60
      )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    window.alert(
      'Arsenal de teste e munição adicionados.'
    )
  }

  function devGiveAmmo() {
    const updatedGame =
      grantDevAmmo(
        game,
        60
      )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    window.alert(
      'Munição de teste adicionada.'
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

  function devCreatePoliceResponse() {
    if (!game) {
      return
    }

    const updatedGame =
      createPoliceResponse(
        game,
        {
          reason: 'dev-combat-exposure',
          severity: 'high',
          policePresence: Math.max(
            0.75,
            Number(
              game?.world
                ?.location
                ?.policePresence ??
              0
            )
          ),
        }
      )

    if (updatedGame === game) {
      window.alert(
        'Não foi possível criar a resposta policial. Pode já existir uma ocorrência ativa.'
      )
      return
    }

    saveGame(updatedGame)
    setGame(updatedGame)

    window.alert(
      `Polícia acionada. Previsão: ${updatedGame.policeResponse?.responseMinutes ?? '?'} minuto(s).`
    )
  }

  function devProcessPoliceResponse() {
    if (!game) {
      return
    }

    const result =
      processPoliceResponse(
        game
      )

    saveGame(result.game)
    setGame(result.game)

    if (result.interrupted) {
      resetSceneSystems()
      clearTest()
      goToTop()
      return
    }

    window.alert(
      result.event
        ? `Evento policial: ${result.event.type}`
        : 'A polícia ainda não chegou.'
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


  function devForcePoliceRecognition() {
    if (!game) {
      return
    }

    let updatedGame =
      createPoliceWantedState(
        game,
        {
          level: 4,

          escapedPolice:
            true,

          witnessEvidence:
            true,

          cameraEvidence:
            true,

          violenceAgainstPolice:
            false,

          supernaturalSeen:
            false,

          escapeMethod:
            'running',

          reason:
            'dev-force-recognition',
        }
      )

    const recognition =
      rollPoliceRecognition(
        updatedGame,
        {
          closeInspection:
            true,

          knownIdentity:
            true,
        }
      )

    updatedGame =
      registerPoliceRecognition(
        updatedGame,
        recognition
      )

    const nextScene =
      recognition.recognized
        ? 'police_recognized'
        : 'police_stop'

    updatedGame =
      transitionToScene(
        updatedGame,
        nextScene,
        {
          flags: {
            policeTrouble:
              true,

            policeStopActive:
              true,

            policeWantedEncounter:
              true,

            policeWantedLevel:
              4,

            policeRecognitionChecked:
              true,

            policeRecognizedPlayer:
              Boolean(
                recognition.recognized
              ),

            policeRecognitionChance:
              recognition.chance,

            policeRecognitionRoll:
              recognition.roll ??
              null,
          },

          historyItem: {
            type:
              'dev-police-recognition',

            recognized:
              Boolean(
                recognition.recognized
              ),

            chance:
              recognition.chance,

            roll:
              recognition.roll ??
              null,

            timestamp:
              new Date()
                .toISOString(),
          },
        }
      )

    persist(
      updatedGame
    )

    resetSceneSystems()
    clearTest()
    goToTop()

    window.alert(
      [
        'Reconhecimento policial DEV',
        '',
        `Chance: ${Math.round(
          recognition.chance *
          100
        )}%`,
        `Rolagem: ${
          typeof recognition.roll ===
          'number'
            ? recognition.roll.toFixed(
                3
              )
            : '—'
        }`,
        `Resultado: ${
          recognition.recognized
            ? 'RECONHECIDO'
            : 'NÃO RECONHECIDO'
        }`,
      ].join('\n')
    )
  }

  function devShowPoliceRecognition() {
    if (!game) {
      return
    }

    const wanted =
      getPoliceWantedState(
        game
      )

    const chance =
      getPoliceRecognitionChance(
        game,
        {
          closeInspection:
            true,

          knownIdentity:
            Boolean(
              game?.flags
                ?.policeKnownIdentity
            ),
        }
      )

    const lastChance =
      Number(
        game?.flags
          ?.policeRecognitionChance
      )

    const lastRoll =
      game?.flags
        ?.policeRecognitionRoll

    const recognized =
      game?.flags
        ?.policeRecognizedPlayer

    window.alert(
      [
        `Procura: Nível ${wanted.level} — ${wanted.label}`,
        `Descrição: ${Math.round(
          wanted.descriptionQuality *
          100
        )}%`,
        `Câmera: ${
          wanted.cameraEvidence
            ? 'SIM'
            : 'NÃO'
        }`,
        `Testemunhas: ${
          wanted.witnessEvidence
            ? 'SIM'
            : 'NÃO'
        }`,
        '',
        `Chance atual de reconhecimento: ${Math.round(
          chance *
          100
        )}%`,
        `Última chance registrada: ${
          Number.isFinite(
            lastChance
          )
            ? `${Math.round(
                lastChance *
                100
              )}%`
            : '—'
        }`,
        `Última rolagem: ${
          typeof lastRoll ===
          'number'
            ? lastRoll.toFixed(
                3
              )
            : '—'
        }`,
        `Último resultado: ${
          recognized === true
            ? 'RECONHECIDO'
            : recognized === false
              ? 'NÃO RECONHECIDO'
              : '—'
        }`,
      ].join('\n')
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

          <button
              type="button"
              onClick={handleOpenTravel}
              disabled={Boolean(
                pendingTest ||
                interactionBlocked ||
                game?.flags
                  ?.policeChase
              )}
            >
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
  onClick={() =>
    setQuestOpen(true)
  }
  disabled={
    interactionBlocked
  }
>
  Missões
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

                <button
                  type="button"
                  onClick={
                    devForcePoliceRecognition
                  }
                >
                  Forçar Reconhecimento
                </button>

                <button
                  type="button"
                  onClick={
                    devShowPoliceRecognition
                  }
                >
                  Ver Reconhecimento
                </button>

                <button
                  type="button"
                  onClick={devCreatePoliceResponse}
                >
                  Criar Resposta Policial
                </button>

                <button
                  type="button"
                  onClick={devProcessPoliceResponse}
                >
                  Processar Resposta Policial
                </button>

                <button
                  type="button"
                  onClick={devCreatePoliceWanted}
                >
                  Criar Procura Nível 2
                </button>

                <button
                  type="button"
                  onClick={devShowPoliceWanted}
                >
                  Ver Procura Policial
                </button>

                <button
                  type="button"
                  onClick={devClearPoliceWanted}
                >
                  Limpar Procura Policial
                </button>

                <button type="button" onClick={devShowDisciplines}>Ver Disciplinas</button>
                <button type="button" onClick={handleOpenDevCombatArena}>Arena de Combate</button>
                <button
                  type="button"
                  disabled={
                    !combat
                  }
                  onClick={() =>
                    setCombatDebugOpen(
                      true
                    )
                  }
                >
                  Debug do Combate
                </button>
              </div>

              <div style={{ marginTop: '14px', display: 'grid', gap: '8px' }}>
                {DEV_DISCIPLINES.map(({ id, label }) => {
                  const level = getDevDisciplineLevel(id)

                  return (
                    <div
                      key={id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto auto',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={() => devSetDiscipline(id, level - 1)}
                        disabled={level <= 0}
                      >
                        −
                      </button>
                      <strong style={{ minWidth: '24px', textAlign: 'center' }}>
                        {level}
                      </strong>
                      <button
                        type="button"
                        onClick={() => devSetDiscipline(id, level + 1)}
                        disabled={level >= 5}
                      >
                        +
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="game-dev-grid" style={{ marginTop: '14px' }}>
                <button type="button" onClick={() => devSetAllDisciplines(5)}>
                  Todas nível 5
                </button>
                <button type="button" onClick={() => devSetAllDisciplines(0)}>
                  Zerar disciplinas
                </button>
                <button type="button" onClick={devRestoreDisciplines}>
                  Restaurar disciplinas da ficha
                </button>
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
                    devStartLiviaQuest
                  }
                >
                  DEV · Iniciar missão Lívia
                </button>

                <button
                  type="button"
                  onClick={
                    devCompleteLiviaObjective
                  }
                >
                  DEV · Completar objetivo
                </button>

                <button
                  type="button"
                  onClick={
                    devCompleteLiviaQuest
                  }
                >
                  DEV · Concluir missão
                </button>

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
                  onClick={
                    devGiveAmmo
                  }
                >
                  Dar Munição
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
{scene.id === 'free_roam' &&
game.world?.location?.id ===
  'livia_apartment' ? (
  <Haven
  game={game}

  onGameChange={
    handleFreeRoamGameChange
  }

  onTravel={
    handleTravel
  }

  onComputer={
    handleHavenComputer
  }

  onInvestigateDisappearances={
    handleHavenInvestigation
  }
/>
) : scene.id === 'free_roam' ? (
  <FreeRoam
    game={game}

    onGameChange={
      handleFreeRoamGameChange
    }

    onTravel={
      handleTravel
    }

    onOpenSheet={
      onOpenSheet
    }

    onMenu={
      onMenu
    }
  />
) : (
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
)}
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
  (
    scene.hazardEncounter ||
    hazard?.type === 'sunlight'
  ) &&
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

      {questOpen && (
  <QuestPanel
    game={game}

    onClose={() =>
      setQuestOpen(false)
    }
  />
)}

      {combatDebugOpen &&
        combat && (
          <CombatDebugPanel
            game={
              game
            }

            combat={
              combat
            }

            onClose={() =>
              setCombatDebugOpen(
                false
              )
            }
          />
        )}

      {/* ================================
          COMBATE
      ================================ */}

      {combat &&
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

            onHeal={
              handleCombatHeal
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
  (
    awakeningFrenzyTrigger ||
    scene.frenzyTrigger
  ) &&
        !combat &&
        !hazard &&
        !pendingAftermath &&
        !humanityOpen && (
          <FrenzyTest
            game={game}

           trigger={
  awakeningFrenzyTrigger ??
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

            stopFeedingRoll={
              stopFeedingRoll
            }

            onDrink={
              handleDrink
            }

            onStop={
              handleStopFeeding
            }

            onResolveStopFeeding={
              handleResolveStopFeeding
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
