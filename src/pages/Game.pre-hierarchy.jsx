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
  createDegenerationTrigger,
  executeDegenerationTest,
  needsDegenerationCheck,
} from '../engine/vampire/humanityEngine'

import DiceRoll from '../components/DiceRoll/DiceRoll'

import FrenzyTest from '../components/FrenzyTest/FrenzyTest'

import FrenzyAftermath from '../components/FrenzyAftermath/FrenzyAftermath'

import FeedingPanel from '../components/FeedingPanel/FeedingPanel'

import HumanityTest from '../components/HumanityTest/HumanityTest'

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
    DEV
    ========================================
  */

  const [
    devOpen,
    setDevOpen,
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

  /*
    ========================================
    ATUALIZA SELETOR DEV
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
    ATUALIZA LOCALIZAÇÃO
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
    DETECTA FRENESI
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      !scene ||
      !scene.frenzyTrigger ||
      pendingAftermath ||
      humanityOpen
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

    /*
      Alguns testes de fome
      só acontecem se o vampiro
      realmente estiver faminto.
    */

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
      humanityOpen
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
  ])

  /*
    ========================================
    DETECTA DEGENERAÇÃO / HUMANIDADE

    Só abre quando:
    - existe humanityCheckRequired
    - não estamos no meio de Frenesi
    - não estamos mostrando consequências
    - não estamos alimentando
    ========================================
  */

  useEffect(() => {
    if (
      !game ||
      humanityOpen ||
      frenzyOpen ||
      feedingOpen ||
      pendingAftermath
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
  ])

  /*
    ========================================
    SEM SAVE
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
            Crie e finalize um
            personagem antes de
            continuar.
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
    CENA NÃO ENCONTRADA
    ========================================
  */

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

  /*
    ========================================
    FUNÇÕES GERAIS
    ========================================
  */

  function goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
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

    setSpendWillpower(
      false
    )
  }

  function clearFeeding() {
    setFeedingOpen(
      false
    )

    setFeedingVictim(
      null
    )

    setFeedingTotal(
      0
    )
  }

  function clearFrenzy() {
    setFrenzyOpen(
      false
    )

    setFrenzyResult(
      null
    )
  }

  function clearHumanity() {
    setHumanityOpen(
      false
    )

    setHumanityTrigger(
      null
    )

    setHumanityResult(
      null
    )
  }

  function resetSceneSystems() {
    setFrenzyCheckedScene(
      null
    )

    setFeedingSceneChecked(
      null
    )

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
    /*
      Nenhuma escolha deve funcionar
      enquanto alguma janela de
      sistema estiver aberta.
    */

    if (
      frenzyOpen ||
      feedingOpen ||
      humanityOpen ||
      pendingAftermath
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
    if (
      currentRoll
    ) {
      return
    }

    const available =
      game.willpower
        ?.current ?? 0

    if (
      available <= 0
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
    ROLAGEM NORMAL
    ========================================
  */

  function handleRoll() {
    if (
      !pendingTest
    ) {
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

    const newWillpower =
      roll.willpowerSpent
        ? Math.max(
            0,
            currentWillpower -
              1
          )
        : currentWillpower

    const updatedGame = {
      ...game,

      willpower: {
        ...(game.willpower ??
          {}),

        current:
          newWillpower,
      },

      lastRoll: {
        ...roll,

        testId:
          pendingTest.id,

        label:
          pendingTest.label,
      },

      history: [
        ...(game.history ??
          []),

        {
          type:
            'roll',

          scene:
            scene.id,

          testId:
            pendingTest.id,

          label:
            pendingTest.label,

          dice:
            roll.dice,

          difficulty:
            roll.difficulty,

          rawSuccesses:
            roll.rawSuccesses,

          ones:
            roll.ones,

          automaticSuccesses:
            roll.automaticSuccesses,

          successes:
            roll.successes,

          result:
            roll.result,

          willpowerSpent:
            roll.willpowerSpent,

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
    ALIMENTAÇÃO
    ========================================
  */

  function handleDrink(
    amount
  ) {
    if (
      !feedingVictim
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

    const actualAmount =
      result.amountDrunk

    const newTotal =
      feedingTotal +
      actualAmount

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
          game.world?.location,
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
    FRENESI
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

    /*
      SUCESSO

      O personagem resistiu.
      Continua no controle.
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
          `Cena de sucesso de Frenesi não encontrada: ${nextScene}`
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

    /*
      FALHA / FALHA CRÍTICA

      O jogador perde o controle.

      Nenhuma decisão é tomada
      pelo jogador durante esse
      período.
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

    clearFrenzy()
  }

  /*
    ========================================
    VOLTA DO FRENESI
    ========================================
  */

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
    if (
      !humanityTrigger
    ) {
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

    /*
      Primeiro aplicamos o resultado.

      Sucesso:
      mantém Humanidade.

      Falha:
      -1 Humanidade.

      Falha crítica:
      -1 Humanidade
      + marca consequência severa.
    */

    const withResult =
      applyDegenerationResult(
        game,
        humanityTrigger,
        humanityResult
      )

    /*
      Depois limpamos as flags que
      provocaram ESTE teste.

      Isso impede que o mesmo crime
      seja testado novamente depois.
    */

    const updatedGame =
      clearHumanityTriggerFlags(
        withResult
      )

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    clearHumanity()

    goToTop()
  }

  /*
    ========================================
    DEV
    ========================================
  */

  function devGoToScene(
    targetScene
  ) {
    if (
      !targetScene ||
      !scenes[targetScene]
    ) {
      window.alert(
        'Cena DEV não encontrada.'
      )

      return
    }

    const target =
      scenes[targetScene]

    const updatedGame = {
      ...game,

      story: {
        ...(game.story ?? {}),

        previousScene:
          sceneId,

        scene:
          targetScene,
      },

      world: {
        ...(game.world ?? {}),

        location:
          target.location ??
          game.world?.location,
      },

      beast: {
        ...(game.beast ?? {}),

        pendingAftermath:
          null,

        frenzy: false,
      },

      activeFeeding:
        null,
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

  function devResetPrologue() {
    const firstScene =
      scenes.awakening

    const updatedGame = {
      ...game,

      story: {
        ...(game.story ?? {}),

        chapter:
          'prologue',

        previousScene:
          null,

        scene:
          'awakening',
      },

      world: {
        ...(game.world ?? {}),

        night: 1,

        hour: 23,

        minute: 30,

        location:
          firstScene?.location ??
          game.world?.location,
      },

      flags: {},

      history: [],

      morality: {
        ...(game.morality ??
          {}),

        degenerationHistory:
          [],
      },

      beast: {
        ...(game.beast ??
          {}),

        frenzy: false,

        pendingAftermath:
          null,
      },

      activeFeeding:
        null,

      lastRoll:
        null,

      lastFrenzyRoll:
        null,
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

  function devFillBlood() {
    const updatedGame = {
      ...game,

      blood: {
        ...(game.blood ??
          {}),

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
        ...(game.blood ??
          {}),

        current: 2,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setFrenzyCheckedScene(
      null
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

  function devRestoreHumanity() {
    const maximum =
      game.humanity
        ?.maximum ?? 7

    const updatedGame = {
      ...game,

      humanity: {
        ...(game.humanity ??
          {}),

        current:
          maximum,
      },

      flags: {
        ...(game.flags ??
          {}),

        humanityCheckRequired:
          false,

        killedHumanByFeeding:
          false,

        possibleVictimDeath:
          false,

        violentAssault:
          false,

        humanityLost:
          false,

        severeDegeneration:
          false,

        psychologicalScarPending:
          false,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    clearHumanity()
  }

  /*
    Botão de teste rápido.

    Simula um ato que exige
    degeneração sem precisar
    matar Marina repetidamente.
  */

  function devForceHumanityCheck() {
    const updatedGame = {
      ...game,

      flags: {
        ...(game.flags ??
          {}),

        humanityCheckRequired:
          true,

        killedHumanByFeeding:
          true,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    setDevOpen(
      false
    )
  }

  function devShowSave() {
    console.log(
      '============================'
    )

    console.log(
      'VAMPIRO SP - SAVE'
    )

    console.log(
      game
    )

    console.log(
      'Humanidade:',
      game.humanity
    )

    console.log(
      'Moralidade:',
      game.morality
    )

    console.log(
      'Flags:',
      game.flags
    )

    console.log(
      '============================'
    )

    window.alert(
      'Save enviado para o Console do navegador.'
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

      {/* ===================================
          BARRA SUPERIOR
      =================================== */}

      <header className="game-topbar">
        <div className="game-location">
          <span className="game-small-label">
            LOCAL
          </span>

          <strong>
            {scene.location
              ?.name ??
              game.world
                ?.location
                ?.name ??
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

      {/* ===================================
          PAINEL DEV
      =================================== */}

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

            {/* CENAS */}

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

            {/* SISTEMAS */}

            <div className="game-dev-section">
              <span className="game-dev-label">
                Sistemas
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
                      'security_approaches'
                    )
                  }
                >
                  Segurança
                </button>

                <button
                  type="button"
                  onClick={() =>
                    devGoToScene(
                      'frenzy_rage_demo'
                    )
                  }
                >
                  Frenesi Raiva
                </button>

                <button
                  type="button"
                  onClick={() => {
                    devLowBlood()

                    devGoToScene(
                      'frenzy_hunger_demo'
                    )
                  }}
                >
                  Frenesi Fome
                </button>

                <button
                  type="button"
                  onClick={() =>
                    devGoToScene(
                      'frenzy_fear_demo'
                    )
                  }
                >
                  Rötschreck
                </button>

                <button
                  type="button"
                  onClick={
                    devForceHumanityCheck
                  }
                >
                  Testar Humanidade
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

                <button
                  type="button"
                  onClick={
                    devRestoreHumanity
                  }
                >
                  Restaurar Humanidade
                </button>
              </div>
            </div>

            {/* SAVE */}

            <div className="game-dev-section">
              <button
                type="button"
                onClick={
                  devShowSave
                }
              >
                Mostrar Save no Console
              </button>
            </div>

            {/* RESET */}

            <div className="game-dev-section">
              <button
                type="button"
                onClick={
                  devResetPrologue
                }
              >
                Início do Prólogo
              </button>
            </div>
          </aside>
        )}

      {/* ===================================
          HISTÓRIA
      =================================== */}

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

        {/* NARRAÇÃO */}

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

        {/* DIÁLOGO */}

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

        {/* ESCOLHAS */}

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
          !pendingAftermath &&
          !humanityOpen && (
            <div className="game-scene-end">
              <span>
                FIM DA CENA
              </span>

              <p>
                O progresso foi salvo.
              </p>

              <button
                type="button"
                className="main-menu-button"
                onClick={onMenu}
              >
                Voltar ao Menu
              </button>
            </div>
          )
        )}
      </section>

      {/* ===================================
          HUD
      =================================== */}

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

          <small
            className={
              `game-hunger ${bloodState?.hungerLevel ?? 'sated'}`
            }
          >
            {bloodState
              ?.hungerLevel ===
              'sated' &&
              'Saciado'}

            {bloodState
              ?.hungerLevel ===
              'uneasy' &&
              'Fome leve'}

            {bloodState
              ?.hungerLevel ===
              'hungry' &&
              'Faminto'}

            {bloodState
              ?.hungerLevel ===
              'critical' &&
              'Fome crítica'}
          </small>
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
            {
              game.world
                ?.night ?? 1
            }
          </strong>
        </div>
      </aside>

      {/* ===================================
          TESTE NORMAL
      =================================== */}

      {pendingTest &&
        !humanityOpen &&
        !frenzyOpen &&
        !pendingAftermath && (
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

      {/* ===================================
          FRENESI
      =================================== */}

      {frenzyOpen &&
        scene.frenzyTrigger &&
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

      {/* ===================================
          CONSEQUÊNCIA DO FRENESI
      =================================== */}

      {pendingAftermath &&
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

      {/* ===================================
          ALIMENTAÇÃO
      =================================== */}

      {feedingOpen &&
        feedingVictim &&
        !humanityOpen &&
        !frenzyOpen &&
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

      {/* ===================================
          HUMANIDADE / DEGENERAÇÃO
      =================================== */}

      {humanityOpen &&
        humanityTrigger && (
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