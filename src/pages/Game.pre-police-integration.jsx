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

import DiceRoll from '../components/DiceRoll/DiceRoll'
import TravelPanel from '../components/TravelPanel/TravelPanel'
import TravelEventPanel from '../components/TravelEventPanel/TravelEventPanel'
import TravelEventTest from '../components/TravelEventTest/TravelEventTest'

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
    TESTE DO EVENTO DE VIAGEM
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
    LOCALIZAÇÃO DA CENA

    Não deixa a cena sobrescrever
    o local enquanto existe viagem
    ou evento de viagem acontecendo.
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
      travelEventTesting
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
            onClick={
              onMenu
            }
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
            onClick={
              onMenu
            }
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

  /*
    ========================================
    LOCAL ATUAL
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
    UTILITÁRIOS
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
    goToTop()
  }

  function handleChoice(
    choice
  ) {
    if (
      travelOpen ||
      travelEvent ||
      travelEventTesting
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
    TESTE NARRATIVO NORMAL
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
      travelEventTesting
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
    } else {
      clearTravelEvent()
      goToTop()
    }
  }

  /*
    ========================================
    EFEITOS DE EVENTO SEM TESTE
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

    /*
      Alguns eventos antigos usam
      effects.hunger.

      Nosso personagem atual trabalha
      principalmente com blood.current,
      então transformamos fome em
      perda de sangue.

      1 ponto = menos 1 sangue.
    */

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
    CONTINUAR EVENTO

    Se houver teste:
      abre TravelEventTest.

    Se não houver:
      aplica efeito e termina.
    ========================================
  */

  function handleTravelEventContinue() {
    if (
      !travelEvent
    ) {
      return
    }

    /*
      EVENTO COM TESTE
    */

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
          'Não foi possível criar o teste deste evento.'
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

    /*
      EVENTO SEM TESTE
    */

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
    ROLAR TESTE DE EVENTO
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

    const updatedGame = {
      ...game,

      lastTravelEventRoll: {
        ...roll,

        eventId:
          travelEvent.id,

        timestamp:
          new Date()
            .toISOString(),
      },
    }

    persist(
      updatedGame
    )
  }

  /*
    ========================================
    CONTINUAR APÓS RESULTADO
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
            'unknown',

          result:
            travelEventRoll.result,

          outcome:
            travelEventOutcome.title,

          from:
            travelEventInfo
              ?.fromId ??
            null,

          to:
            travelEventInfo
              ?.toId ??
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

    clearTravelEvent()

    goToTop()
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
      travelEventTesting
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
          TOPO
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
          <button
            type="button"
            onClick={
              handleOpenTravel
            }
            disabled={
              Boolean(
                pendingTest ||
                travelEvent ||
                travelEventTesting
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
          CENA
      ================================ */}

      <section
        className="game-story"
        key={
          scene.id
        }
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
              disabled={
                interactionBlocked
              }
            >
              Voltar ao Menu
            </button>
          </div>
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
            game={
              game
            }

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

      {/* ================================
          EVENTO DA VIAGEM

          Só mostramos essa tela enquanto
          ainda NÃO começamos o teste.
      ================================ */}

      {travelEvent &&
        !travelEventTesting && (
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
          TESTE DO EVENTO
      ================================ */}

      {travelEvent &&
        travelEventTesting &&
        travelEventTest && (
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
    </main>
  )
}