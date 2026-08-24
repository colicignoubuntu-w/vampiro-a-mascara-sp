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

import DiceRoll from '../components/DiceRoll/DiceRoll'

import TravelPanel from '../components/TravelPanel/TravelPanel'

import TravelEventPanel from '../components/TravelEventPanel/TravelEventPanel'

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
    ATUALIZA LOCAL DA CENA
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
      Quando existe evento de viagem aberto,
      não queremos que a cena narrativa
      sobrescreva a localização para a qual
      acabamos de viajar.
    */

    if (
      travelEvent
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
    travelEvent,
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

  /*
    ========================================
    CENA INVÁLIDA
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
    LOCAL ATUAL
    ========================================
  */

  const currentLocationId =
    game.world?.location?.id ??
    scene.location?.id ??
    'prologue'

  const currentLocation =
    getLocation(
      currentLocationId
    )

  /*
    ========================================
    UTILITÁRIOS
    ========================================
  */

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

  function goToTop() {
    window.scrollTo({
      top: 0,

      behavior:
        'smooth',
    })
  }

  /*
    ========================================
    ESCOLHA SEM TESTE
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

    goToTop()
  }

  /*
    ========================================
    CLICAR EM ESCOLHA
    ========================================
  */

  function handleChoice(
    choice
  ) {
    /*
      Enquanto viagem ou evento estiverem
      abertos, escolhas narrativas ficam
      bloqueadas.
    */

    if (
      travelOpen ||
      travelEvent
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
    ROLAR TESTE NORMAL
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

  /*
    ========================================
    CONTINUAR APÓS TESTE
    ========================================
  */

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

  /*
    ========================================
    ABRIR VIAGEM
    ========================================
  */

  function handleOpenTravel() {
    if (
      pendingTest ||
      travelEvent
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

    Agora quem controla:
    - tempo
    - risco
    - evento
    - histórico
    - localização

    é o travelEngine.
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

    const originName =
      currentLocation?.name ??
      game.world
        ?.location
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

          /*
            O TravelPanel usa "minutes".

            O travelEngine aceita tanto
            minutes quanto timeMinutes,
            mas deixamos ambos para não
            haver ambiguidade.
          */

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

    /*
      Marcamos o destino como visitado.
    */

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        [`visited_${destination.id}`]:
          true,
      },
    }

    /*
      Adicionamos uma entrada narrativa
      mais fácil de ler no histórico.
    */

    const narrativeHistory = {
      type:
        'travel-arrival',

      from:
        currentLocationId,

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
    }

    updatedGame = {
      ...updatedGame,

      history: [
        ...(updatedGame.history ??
          []),

        narrativeHistory,
      ],
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

    /*
      Guarda informações da viagem
      para mostrar dentro do evento.
    */

    setTravelEventInfo({
      fromId:
        currentLocationId,

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

    /*
      Se houve evento, interrompemos
      visualmente a viagem.

      Se não houve evento, apenas
      mostramos o destino normalmente.
    */

    if (
      result.event
    ) {
      setTravelEvent(
        result.event
      )
    } else {
      setTravelEvent(
        null
      )

      setTravelEventInfo(
        null
      )

      goToTop()
    }
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

    const historyItem = {
      type:
        'travel-event-seen',

      eventId:
        travelEvent.id,

      eventType:
        travelEvent.type ??
        'none',

      title:
        travelEvent.title ??
        '',

      from:
        travelEventInfo
          ?.fromId ??
        null,

      to:
        travelEventInfo
          ?.toId ??
        null,

      transport:
        travelEventInfo
          ?.transport ??
        null,

      timestamp:
        new Date()
          .toISOString(),
    }

    const updatedGame = {
      ...game,

      history: [
        ...(game.history ??
          []),

        historyItem,
      ],

      flags: {
        ...(game.flags ??
          {}),

        [`travel_event_${travelEvent.id}`]:
          true,
      },
    }

    saveGame(
      updatedGame
    )

    setGame(
      updatedGame
    )

    /*
      Por enquanto o teste dos eventos
      será implementado na próxima etapa.

      Nesta etapa garantimos que:
      - evento aparece;
      - viagem acontece;
      - tempo passa;
      - local muda;
      - histórico é salvo.
    */

    setTravelEvent(
      null
    )

    setTravelEventInfo(
      null
    )

    goToTop()
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

      {/* =================================
          TOPBAR
      ================================= */}

      <header className="game-topbar">
        <div className="game-location">
          <span className="game-small-label">
            LOCAL
          </span>

          <strong>
            {currentLocation?.name ??
              game.world?.location?.name ??
              scene.location?.name ??
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
            onClick={
              handleOpenTravel
            }
            disabled={
              Boolean(
                pendingTest ||
                travelEvent
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

      {/* =================================
          HISTÓRIA
      ================================= */}

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

        {/* =================================
            ESCOLHAS
        ================================= */}

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
                      Boolean(
                        travelOpen ||
                        travelEvent
                      )
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
              onClick={
                onMenu
              }
            >
              Voltar ao Menu
            </button>
          </div>
        )}
      </section>

      {/* =================================
          HUD
      ================================= */}

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
            {game.world?.night ??
              1}
          </strong>
        </div>
      </aside>

      {/* =================================
          TESTES NORMAIS
      ================================= */}

      {pendingTest &&
        !travelOpen &&
        !travelEvent && (
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

      {/* =================================
          PAINEL DE VIAGEM
      ================================= */}

      {travelOpen &&
        !travelEvent &&
        !pendingTest && (
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

      {/* =================================
          EVENTO DE VIAGEM
      ================================= */}

      {travelEvent && (
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
    </main>
  )
}