import {
  useState,
} from 'react'

import CityMap from '../CityMap/CityMap'

import HumanityCheck from '../HumanityCheck/HumanityCheck'

import FeedingControl from '../FeedingControl/FeedingControl'

import MasqueradeEvent from '../MasqueradeEvent/MasqueradeEvent'

import {
  getLocation,
} from '../../data/world/locations'

import {
  generatePrey,
  rollHuntingAttempt,
} from '../../engine/hunting/huntingEngine'

import {
  feedFromPrey,
  getBloodMessLabel,
  isVisiblyBloody,
} from '../../engine/feeding/feedingEngine'

import {
  calculateDegenerationDifficulty,
  humanityTransgressions,
  rollDegeneration,
  applyDegenerationResult,
} from '../../engine/humanity/humanityEngine'

import {
  calculateStopFeedingDifficulty,
  getHungerLabel,
  getHungerLevel,
  mustRollToStopFeeding,
  rollStopFeeding,
} from '../../engine/instinct/instinctEngine'

import {
  getStatusTimeRemaining,
} from '../../engine/status/statusEngine'

import {
  getMasqueradeState,
  getSuspicionLabel,
  rollPublicReaction,
} from '../../engine/masquerade/masqueradeEngine'

import {
  addMinutes,
} from '../../utils/gameState'

import './FreeRoam.css'

const huntingMethods = [
  {
    id:
      'seduction',

    name:
      'Seduzir',

    description:
      'Carisma + Lábia',
  },

  {
    id:
      'street',

    name:
      'Abordagem de rua',

    description:
      'Carisma + Manha',
  },

  {
    id:
      'deception',

    name:
      'Enganar',

    description:
      'Manipulação + Lábia',
  },

  {
    id:
      'stealth',

    name:
      'Aproximação furtiva',

    description:
      'Destreza + Furtividade',
  },
]

export default function FreeRoam({
  game,
  onGameChange,
  onTravel,
  onOpenSheet,
  onMenu,
}) {
  const [
    mapOpen,
    setMapOpen,
  ] = useState(false)

  const [
    prey,
    setPrey,
  ] = useState(null)

  const [
    huntingRoll,
    setHuntingRoll,
  ] = useState(null)

  const [
    selectedMethod,
    setSelectedMethod,
  ] = useState(null)

  const [
    message,
    setMessage,
  ] = useState(null)

  const [
    victimBloodDrunk,
    setVictimBloodDrunk,
  ] = useState(0)

  const [
    victimCondition,
    setVictimCondition,
  ] = useState(null)

  const [
    pendingHumanity,
    setPendingHumanity,
  ] = useState(null)

  const [
    humanityRoll,
    setHumanityRoll,
  ] = useState(null)

  const [
    stoppingFeeding,
    setStoppingFeeding,
  ] = useState(false)

  const [
    stopFeedingRoll,
    setStopFeedingRoll,
  ] = useState(null)

  const [
    frenzyActive,
    setFrenzyActive,
  ] = useState(false)

  const [
    masqueradeEvent,
    setMasqueradeEvent,
  ] = useState(null)

  const locationId =
    game.world
      ?.location
      ?.id

  const location =
    getLocation(
      locationId
    )

  const hunger =
    getHungerLabel(
      getHungerLevel(
        game
      )
    )

  const canHunt =
    Boolean(
      location?.hunting
    )

  const visiblyBloody =
    isVisiblyBloody(
      game
    )

  const bloodMess =
    getBloodMessLabel(
      game
    )

  const statuses =
    game.statuses ?? []

  const masquerade =
    getMasqueradeState(
      game
    )

  function advanceTime(
    updatedGame,
    minutes
  ) {
    return {
      ...updatedGame,

      world:
        addMinutes(
          updatedGame.world,
          minutes
        ),
    }
  }

  function resetFeedingState() {
    setPrey(null)

    setHuntingRoll(null)

    setSelectedMethod(null)

    setVictimBloodDrunk(0)

    setVictimCondition(null)

    setStoppingFeeding(false)

    setStopFeedingRoll(null)

    setFrenzyActive(false)
  }

  function maybeTriggerPublicReaction(
    gameState
  ) {
    if (
      !location
    ) {
      return
    }

    const event =
      rollPublicReaction(
        gameState,
        location
      )

    if (event) {
      setMasqueradeEvent(
        event
      )
    }
  }

  function searchForPrey() {
    const found =
      generatePrey(
        locationId
      )

    const updatedGame =
      advanceTime(
        game,
        10
      )

    onGameChange(
      updatedGame
    )

    setPrey(
      found
    )

    setHuntingRoll(null)

    setSelectedMethod(null)

    setVictimBloodDrunk(0)

    setVictimCondition(null)

    setFrenzyActive(false)

    if (!found) {
      setMessage(
        'Você passa alguns minutos procurando, mas não encontra uma presa adequada.'
      )

      return
    }

    setMessage(
      'Você observa o ambiente até encontrar uma oportunidade.'
    )
  }

  function attemptHunt(
    method
  ) {
    const roll =
      rollHuntingAttempt(
        game,
        method.id
      )

    const updatedGame =
      advanceTime(
        game,
        5
      )

    onGameChange(
      updatedGame
    )

    setSelectedMethod(
      method
    )

    setHuntingRoll(
      roll
    )
  }

  function startHumanityCheck(
    transgressionId,
    gameState = game
  ) {
    const transgression =
      humanityTransgressions[
        transgressionId
      ]

    if (!transgression) {
      return
    }

    const preview = {
      id:
        transgressionId,

      label:
        transgression.label,

      humanity:
        gameState.humanity
          ?.current ?? 7,

      conscience:
        gameState.virtues
          ?.conscience ?? 1,

      difficulty:
        calculateDegenerationDifficulty(
          gameState,
          transgression
        ),
    }

    setPendingHumanity(
      preview
    )

    setHumanityRoll(null)
  }

  function processFeeding(
    amount,
    options = {}
  ) {
    if (!prey) {
      return null
    }

    let result =
      feedFromPrey(
        game,
        prey,
        amount,
        {
          previousVictimBlood:
            victimBloodDrunk,

          continuedKnowingly:
            Boolean(
              options.continuedKnowingly
            ),
        }
      )

    result.game =
      advanceTime(
        result.game,
        2
      )

    onGameChange(
      result.game
    )

    setVictimBloodDrunk(
      result.totalVictimBlood
    )

    setVictimCondition(
      result.victimCondition
    )

    let text =
      `Você bebe ${result.bloodDrunk} ponto(s) de sangue.`

    if (
      result.bloodStored >
      0
    ) {
      text +=
        ` ${result.bloodStored} ponto(s) entram na sua reserva.`
    }

    if (
      result.overflow >
      0
    ) {
      text +=
        ` ${result.overflow} ponto(s) excedem sua capacidade. O excesso começa a ser expelido pelo corpo, manchando sua pele e suas roupas.`
    }

    if (
      result.effects.length >
      0
    ) {
      text +=
        ' Algo presente no sangue começa a afetá-lo.'
    }

    if (
      result.victimDied
    ) {
      text +=
        ' A vítima deixa de responder.'

      setMessage(
        text
      )

      if (
        options.frenzy
      ) {
        startHumanityCheck(
          'accidentalKilling',
          result.game
        )
      } else if (
        options.continuedKnowingly
      ) {
        startHumanityCheck(
          'recklessKilling',
          result.game
        )
      } else {
        startHumanityCheck(
          'accidentalKilling',
          result.game
        )
      }

      return result
    }

    text +=
      ` Estado da vítima: ${result.victimCondition.label}.`

    setMessage(
      text
    )

    return result
  }

  function drinkBlood(
    amount,
    continuedKnowingly = false
  ) {
    processFeeding(
      amount,
      {
        continuedKnowingly,
      }
    )
  }

  function requestStopFeeding() {
    if (
      victimBloodDrunk <= 0
    ) {
      resetFeedingState()

      setMessage(
        'Você decide não se alimentar.'
      )

      return
    }

    if (
      !mustRollToStopFeeding(
        game
      )
    ) {
      const currentGame =
        game

      resetFeedingState()

      setMessage(
        'Você interrompe a alimentação e se afasta da vítima.'
      )

      maybeTriggerPublicReaction(
        currentGame
      )

      return
    }

    setStoppingFeeding(
      true
    )

    setStopFeedingRoll(
      null
    )
  }

  function rollStop() {
    if (!prey) {
      return
    }

    const roll =
      rollStopFeeding(
        game,
        prey
      )

    setStopFeedingRoll(
      roll
    )
  }

  function finishStopTest() {
    if (!stopFeedingRoll) {
      return
    }

    if (
      stopFeedingRoll.result ===
      'success'
    ) {
      const currentGame =
        game

      resetFeedingState()

      setMessage(
        'Você força os dentes para longe da vítima e recupera o controle.'
      )

      maybeTriggerPublicReaction(
        currentGame
      )

      return
    }

    if (
      stopFeedingRoll.result ===
      'failure'
    ) {
      setStoppingFeeding(
        false
      )

      setStopFeedingRoll(
        null
      )

      const result =
        processFeeding(
          1,
          {
            continuedKnowingly:
              false,

            frenzy:
              false,
          }
        )

      if (
        result &&
        !result.victimDied
      ) {
        setMessage(
          `Você tenta parar, mas a Besta força você a beber mais. Estado da vítima: ${result.victimCondition.label}.`
        )
      }

      return
    }

    setStoppingFeeding(
      false
    )

    setStopFeedingRoll(
      null
    )

    setFrenzyActive(
      true
    )

    setMessage(
      'A última decisão consciente é tentar parar. Depois disso, a Besta assume.'
    )
  }

  function continueFrenzy() {
    if (!prey) {
      setFrenzyActive(
        false
      )

      return
    }

    const result =
      processFeeding(
        1,
        {
          continuedKnowingly:
            false,

          frenzy:
            true,
        }
      )

    if (!result) {
      return
    }

    if (
      result.victimDied
    ) {
      setFrenzyActive(
        false
      )

      return
    }

    if (
      (
        result.game
          .blood
          ?.current ?? 0
      ) >= 4
    ) {
      setFrenzyActive(
        false
      )

      setMessage(
        'A urgência brutal da fome diminui. Aos poucos, sua consciência retorna.'
      )

      maybeTriggerPublicReaction(
        result.game
      )

      return
    }

    setMessage(
      `A Besta continua bebendo. Estado da vítima: ${result.victimCondition.label}.`
    )
  }

  function rollHumanity() {
    if (
      !pendingHumanity
    ) {
      return
    }

    const roll =
      rollDegeneration(
        game,
        pendingHumanity.id
      )

    setHumanityRoll(
      roll
    )
  }

  function finishHumanityCheck() {
    if (
      !humanityRoll
    ) {
      return
    }

    const updatedGame =
      applyDegenerationResult(
        game,
        humanityRoll
      )

    onGameChange(
      updatedGame
    )

    const oldHumanity =
      game.humanity
        ?.current ?? 7

    const newHumanity =
      updatedGame.humanity
        ?.current ?? 0

    setPendingHumanity(null)

    setHumanityRoll(null)

    resetFeedingState()

    if (
      humanityRoll
        .humanityLost >
      0
    ) {
      setMessage(
        `Alguma coisa dentro de você mudou. Humanidade ${oldHumanity} → ${newHumanity}.`
      )
    } else {
      setMessage(
        'A culpa permanece. Por enquanto, essa dor ainda mantém uma parte de você humana.'
      )
    }

    maybeTriggerPublicReaction(
      updatedGame
    )
  }

  function closeMasqueradeEvent(
    resolution
  ) {
    setMasqueradeEvent(
      null
    )

    if (
      !resolution
    ) {
      return
    }

    if (
      resolution.result ===
      'botch'
    ) {
      setMessage(
        'A situação deixou consequências. Talvez aquilo volte para assombrá-lo.'
      )
    }

    if (
      resolution.result ===
      'failure'
    ) {
      setMessage(
        'A atenção sobre você não desapareceu completamente.'
      )
    }

    if (
      resolution.result ===
      'success'
    ) {
      setMessage(
        'Por enquanto, você consegue evitar que a situação cresça.'
      )
    }
  }

  const stopPreview = {
    bloodCurrent:
      game.blood
        ?.current ?? 0,

    bloodMaximum:
      game.blood
        ?.maximum ?? 0,

    hungerLabel:
      hunger,

    selfControl:
      game.virtues
        ?.selfControl ?? 1,

    difficulty:
      calculateStopFeedingDifficulty(
        game,
        prey
      ),
  }

  return (
    <main className="free-roam-screen">
      <div className="free-roam-background" />

      <header className="free-roam-header">
        <div>
          <span>
            NOITE LIVRE
          </span>

          <h1>
            {
              location?.name ??
              'São Paulo'
            }
          </h1>

          <small>
            {
              location?.district ??
              ''
            }
          </small>
        </div>

        <div className="free-roam-header-actions">
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

      <section className="free-roam-layout">
        <div className="free-roam-main">
          <section className="free-roam-description">
            <p>
              {
                location?.description ??
                'A cidade continua viva ao seu redor.'
              }
            </p>

            {visiblyBloody && (
              <blockquote>
                Você está visivelmente
                ensanguentado.
                {' '}
                {bloodMess}.
                {' '}
                Continuar circulando
                assim pode colocar a
                Máscara em risco.
              </blockquote>
            )}

            {message && (
              <blockquote>
                {message}
              </blockquote>
            )}
          </section>

          <section className="free-roam-actions">
            <button
              type="button"
              onClick={() =>
                setMapOpen(
                  true
                )
              }
            >
              <strong>
                Mapa
              </strong>

              <span>
                Escolher outro local
              </span>
            </button>

            {canHunt && (
              <button
                type="button"
                onClick={
                  searchForPrey
                }
              >
                <strong>
                  Caçar
                </strong>

                <span>
                  Procurar uma presa
                </span>
              </button>
            )}
          </section>

          {prey && (
            <section className="hunting-panel">
              <span className="hunting-kicker">
                PRESA
              </span>

              <h2>
                {prey.name}
              </h2>

              <p>
                {
                  prey.description
                }
              </p>

              {victimCondition && (
                <p>
                  Estado atual:
                  {' '}
                  <strong>
                    {
                      victimCondition.label
                    }
                  </strong>
                </p>
              )}

              {!huntingRoll && (
                <>
                  <h3>
                    Como se aproximar?
                  </h3>

                  <div className="hunting-methods">
                    {huntingMethods.map(
                      (
                        method
                      ) => (
                        <button
                          key={
                            method.id
                          }
                          type="button"
                          onClick={() =>
                            attemptHunt(
                              method
                            )
                          }
                        >
                          <strong>
                            {
                              method.name
                            }
                          </strong>

                          <span>
                            {
                              method.description
                            }
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </>
              )}

              {huntingRoll &&
                huntingRoll
                  .result ===
                  'success' && (
                <div className="hunting-result">
                  <h3>
                    A presa está ao seu alcance.
                  </h3>

                  {!victimCondition
                    ?.dead &&
                    !frenzyActive && (
                    <>
                      <p>
                        Sangue retirado:
                        {' '}
                        <strong>
                          {
                            victimBloodDrunk
                          }
                        </strong>
                      </p>

                      <div className="feeding-options">
                        <button
                          type="button"
                          onClick={() =>
                            drinkBlood(
                              1,
                              false
                            )
                          }
                        >
                          Beber 1 ponto
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            drinkBlood(
                              2,
                              false
                            )
                          }
                        >
                          Beber 2 pontos
                        </button>

                        <button
                          type="button"
                          onClick={
                            requestStopFeeding
                          }
                        >
                          Parar
                        </button>
                      </div>

                      {victimCondition
                        ?.danger && (
                        <div className="feeding-danger">
                          <strong>
                            A vítima está em perigo.
                          </strong>

                          <p>
                            Continuar agora
                            é uma decisão
                            consciente.
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              drinkBlood(
                                1,
                                true
                              )
                            }
                          >
                            Continuar bebendo
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {frenzyActive && (
                    <div className="feeding-frenzy">
                      <span>
                        FRENESI DE FOME
                      </span>

                      <h3>
                        A Besta está no controle.
                      </h3>

                      <p>
                        Você não consegue
                        escolher parar.
                      </p>

                      <button
                        type="button"
                        onClick={
                          continueFrenzy
                        }
                      >
                        Continuar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {huntingRoll &&
                huntingRoll
                  .result ===
                  'failure' && (
                <div className="hunting-result">
                  <h3>
                    Falha
                  </h3>

                  <p>
                    A oportunidade se
                    perde.
                  </p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={
                      resetFeedingState
                    }
                  >
                    Continuar
                  </button>
                </div>
              )}

              {huntingRoll &&
                huntingRoll
                  .result ===
                  'botch' && (
                <div className="hunting-result">
                  <h3>
                    Falha crítica
                  </h3>

                  <p>
                    Sua abordagem chama
                    atenção indesejada.
                  </p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      resetFeedingState()

                      setMessage(
                        'A presa se afasta rapidamente. Algumas pessoas parecem ter reparado em você.'
                      )
                    }}
                  >
                    Continuar
                  </button>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="free-roam-sidebar">
          <section>
            <span>
              HORÁRIO
            </span>

            <strong>
              {
                String(
                  game.world
                    ?.hour ?? 0
                ).padStart(
                  2,
                  '0'
                )
              }
              :
              {
                String(
                  game.world
                    ?.minute ?? 0
                ).padStart(
                  2,
                  '0'
                )
              }
            </strong>
          </section>

          <section>
            <span>
              SANGUE
            </span>

            <strong>
              {
                game.blood
                  ?.current ?? 0
              }
              /
              {
                game.blood
                  ?.maximum ?? 0
              }
            </strong>
          </section>

          <section>
            <span>
              FOME
            </span>

            <strong>
              {hunger}
            </strong>
          </section>

          <section>
            <span>
              HUMANIDADE
            </span>

            <strong>
              {
                game.humanity
                  ?.current ?? 0
              }
            </strong>
          </section>

          <section>
            <span>
              MÁSCARA
            </span>

            <strong>
              {
                getSuspicionLabel(
                  masquerade
                    .suspicion
                )
              }
            </strong>
          </section>

          <section>
            <span>
              SUSPEITA
            </span>

            <strong>
              {
                masquerade
                  .suspicion
              }
              /10
            </strong>
          </section>

          <section>
            <span>
              POLÍCIA
            </span>

            <strong>
              {
                masquerade
                  .policeAttention
              }
              /10
            </strong>
          </section>

          <section>
            <span>
              APARÊNCIA
            </span>

            <strong>
              {bloodMess}
            </strong>
          </section>

          <section>
            <span>
              DINHEIRO
            </span>

            <strong>
              R${' '}
              {Number(
                game.money ?? 0
              )
                .toFixed(2)
                .replace(
                  '.',
                  ','
                )}
            </strong>
          </section>

          <div className="free-roam-statuses">
            <h3>
              Efeitos
            </h3>

            {statuses.length ===
              0 && (
              <p>
                Nenhum efeito ativo.
              </p>
            )}

            {statuses.map(
              (
                status
              ) => {
                const remaining =
                  getStatusTimeRemaining(
                    game,
                    status
                  )

                return (
                  <div
                    key={
                      status.id
                    }
                    className="free-roam-status"
                  >
                    <strong>
                      {
                        status.name
                      }
                    </strong>

                    {remaining !==
                      null && (
                      <span>
                        {
                          remaining
                        }
                        {' '}
                        min
                      </span>
                    )}
                  </div>
                )
              }
            )}
          </div>
        </aside>
      </section>

      {mapOpen && (
        <CityMap
          game={game}

          onClose={() =>
            setMapOpen(
              false
            )
          }

          onTravel={(
            travel
          ) => {
            setMapOpen(
              false
            )

            onTravel(
              travel
            )
          }}
        />
      )}

      {stoppingFeeding && (
        <FeedingControl
          preview={
            stopPreview
          }

          roll={
            stopFeedingRoll
          }

          onRoll={
            rollStop
          }

          onContinue={
            finishStopTest
          }
        />
      )}

      {pendingHumanity && (
        <HumanityCheck
          preview={
            pendingHumanity
          }

          roll={
            humanityRoll
          }

          onRoll={
            rollHumanity
          }

          onContinue={
            finishHumanityCheck
          }
        />
      )}

      {masqueradeEvent && (
        <MasqueradeEvent
          game={game}

          event={
            masqueradeEvent
          }

          onGameChange={
            onGameChange
          }

          onClose={
            closeMasqueradeEvent
          }
        />
      )}
    </main>
  )
}