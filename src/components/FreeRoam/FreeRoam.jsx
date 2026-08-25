import {
  useEffect,
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
  advanceGameTime,
  isDaytime,
} from '../../engine/time/timeEngine'
import {
  audioEngine,
} from '../../engine/audio/audioEngine'

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

  /*
    ========================================
    LOCALIZAÇÃO
    ========================================
  */

  const locationId =
    game.world
      ?.location
      ?.id

  const location =
    getLocation(
      locationId
    )

  /*
    ========================================
    ESTADO DO DIA
    ========================================
  */

  const daytime =
    isDaytime(
      game.world
    )

  const shelterLocationId =
    game.flags
      ?.sunlightShelterLocationId ??
    null

  const shelteredHere =
    Boolean(
      game.flags
        ?.sunlightSheltered
    ) &&
    shelterLocationId ===
      locationId

  const shelteredDuringDay =
    daytime &&
    shelteredHere

  /*
    ========================================
    ESTADOS DO PERSONAGEM
    ========================================
  */

  const hunger =
    getHungerLabel(
      getHungerLevel(
        game
      )
    )

  const canHunt =
    Boolean(
      location?.hunting
        ?.enabled
    ) &&
    !shelteredDuringDay

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

  /*
    ========================================
    REAÇÃO PÚBLICA AO CHEGAR DE VIAGEM
    ========================================

    O Game.jsx marca uma checagem pendente
    quando a viagem termina.

    Aqui consumimos essa flag UMA vez.
    Assim não existe loop de renderização.
  */

  useEffect(() => {
    const pending =
      Boolean(
        game?.flags
          ?.pendingPublicReactionCheck
      )

    if (!pending) {
      return
    }

    if (!location) {
      return
    }

    const expectedLocationId =
      game?.flags
        ?.publicReactionLocationId ??
      null

    if (
      expectedLocationId &&
      expectedLocationId !==
        location.id
    ) {
      return
    }

    /*
      Primeiro apagamos a checagem pendente.

      Isso é importante para impedir que
      uma mesma chegada gere várias reações
      por causa de novos renders do React.
    */

    const clearedGame = {
      ...game,

      flags: {
        ...(game.flags ?? {}),

        pendingPublicReactionCheck:
          false,

        publicReactionLocationId:
          null,

        publicReactionReason:
          null,
      },
    }

    onGameChange(
      clearedGame
    )

    /*
      Se o personagem não estiver
      visivelmente ensanguentado,
      não existe reação pública por sangue.
    */

    if (
      !isVisiblyBloody(
        clearedGame
      )
    ) {
      return
    }

    const event =
      rollPublicReaction(
        clearedGame,
        location
      )

    if (event) {
      setMasqueradeEvent(
        event
      )
    }
  }, [
    game?.flags
      ?.pendingPublicReactionCheck,

    game?.flags
      ?.publicReactionLocationId,

    location?.id,
  ])

  /*
    ========================================
    TEMPO
    ========================================
  */

  function advanceTime(
    updatedGame,
    minutes,
    reason =
      'Passagem do tempo'
  ) {
    return advanceGameTime(
      updatedGame,
      minutes,
      {
        reason,
      }
    )
  }

  /*
    ========================================
    ESPERAR ATÉ ANOITECER
    ========================================
  */

  function waitUntilSunset() {
    if (
      !shelteredDuringDay
    ) {
      return
    }

    const currentHour =
      Number(
        game.world
          ?.hour ?? 0
      )

    const currentMinute =
      Number(
        game.world
          ?.minute ?? 0
      )

    const sunsetHour =
      Number(
        game.world
          ?.sunsetHour ?? 18
      )

    const sunsetMinute =
      Number(
        game.world
          ?.sunsetMinute ?? 30
      )

    const currentTotal =
      currentHour *
        60 +
      currentMinute

    const sunsetTotal =
      sunsetHour *
        60 +
      sunsetMinute

    let minutesToSunset =
      sunsetTotal -
      currentTotal

    /*
      Em situação normal isso sempre
      será positivo, porque esta função
      só aparece durante o dia.

      Mantemos a proteção para saves
      antigos ou horários inconsistentes.
    */

    if (
      minutesToSunset <= 0
    ) {
      minutesToSunset =
        1
    }

    let updatedGame =
      advanceTime(
        game,
        minutesToSunset,
        'Esperando protegido até o anoitecer'
      )

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ??
          {}),

        sunlightSheltered:
          false,

        sunlightShelterLocationId:
          null,

        sunriseCrossed:
          false,
      },

      history: [
        ...(updatedGame.history ??
          []),

        {
          type:
            'wait-until-sunset',

          locationId,

          minutes:
            minutesToSunset,

          day:
            updatedGame.world
              ?.day ?? 1,

          hour:
            updatedGame.world
              ?.hour ?? 0,

          minute:
            updatedGame.world
              ?.minute ?? 0,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    resetFeedingState()

    setMapOpen(
      false
    )

    setMessage(
      'Você permanece escondido durante o dia. As horas passam lentamente. Quando o Sol finalmente desaparece, você pode voltar às ruas.'
    )

    onGameChange(
      updatedGame
    )
  }

  /*
    ========================================
    SAIR DO ABRIGO DURANTE O DIA
    ========================================
  */

  function leaveShelter() {
    if (
      !shelteredHere
    ) {
      return
    }

    const updatedGame = {
      ...game,

      flags: {
        ...(game.flags ?? {}),

        sunlightSheltered:
          false,

        sunlightShelterLocationId:
          null,
      },

      history: [
        ...(game.history ??
          []),

        {
          type:
            'left-sunlight-shelter',

          locationId,

          day:
            game.world
              ?.day ?? 1,

          hour:
            game.world
              ?.hour ?? 0,

          minute:
            game.world
              ?.minute ?? 0,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    resetFeedingState()

    setMapOpen(
      false
    )

    setMessage(
      'Você abandona a proteção do abrigo e volta para a rua. A luz do dia atinge o ambiente ao seu redor.'
    )

    onGameChange(
      updatedGame
    )
  }

  /*
    ========================================
    RESET ALIMENTAÇÃO
    ========================================
  */

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

  /*
    ========================================
    REAÇÃO PÚBLICA
    ========================================
  */

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

  /*
    ========================================
    CAÇA
    ========================================
  */

  function searchForPrey() {
    if (
      shelteredDuringDay
    ) {
      setMessage(
        'Você não pode sair para caçar enquanto estiver escondido da luz do dia.'
      )

      return
    }

    const preyLocation =
      location?.hunting
        ?.preyLocation

    const found =
      preyLocation
        ? generatePrey(
            preyLocation
          )
        : null

    const updatedGame =
      advanceTime(
        game,
        10,
        'Procurando uma presa'
      )

    onGameChange(
      updatedGame
    )

    /*
      Dez minutos circulando procurando
      uma presa também podem chamar atenção.
    */

    maybeTriggerPublicReaction(
      updatedGame
    )

    setPrey(
      found
    )

    setHuntingRoll(
      null
    )

    setSelectedMethod(
      null
    )

    setVictimBloodDrunk(
      0
    )

    setVictimCondition(
      null
    )

    setFrenzyActive(
      false
    )

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
    audioEngine.playSfx(
      'dice_roll'
    )

    const roll =
      rollHuntingAttempt(
        game,
        method.id
      )

    const updatedGame =
      advanceTime(
        game,
        5,
        'Tentativa de caça'
      )

    onGameChange(
      updatedGame
    )

    /*
      A tentativa de abordagem mantém o
      personagem exposto em público por
      mais alguns minutos.
    */

    maybeTriggerPublicReaction(
      updatedGame
    )

    setSelectedMethod(
      method
    )

    setHuntingRoll(
      roll
    )
  }

  /*
    ========================================
    HUMANIDADE
    ========================================
  */

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

  /*
    ========================================
    ALIMENTAÇÃO
    ========================================
  */

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
        2,
        'Alimentação'
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

    audioEngine.playSfx(
      'dice_roll'
    )

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

  /*
    ========================================
    TESTE DE HUMANIDADE
    ========================================
  */

  function rollHumanity() {
    if (
      !pendingHumanity
    ) {
      return
    }

    audioEngine.playSfx(
      'dice_roll'
    )

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

  /*
    ========================================
    EVENTO DA MÁSCARA
    ========================================
  */

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

  /*
    ========================================
    INTERFACE
    ========================================
  */

  return (
    <main className="free-roam-screen">
      <div className="free-roam-background" />

      <header className="free-roam-header">
        <div>
          <span>
            {
              shelteredDuringDay
                ? 'ABRIGADO DURANTE O DIA'
                : 'NOITE LIVRE'
            }
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
            {shelteredDuringDay ? (
              <>
                <p>
                  Você permanece protegido
                  da luz solar.
                </p>

                <blockquote>
                  O dia domina São Paulo
                  lá fora. Permanecer aqui
                  é seguro. Sair agora
                  significa voltar à
                  exposição direta ao Sol.
                </blockquote>
              </>
            ) : (
              <p>
                {
                  location?.description ??
                  'A cidade continua viva ao seu redor.'
                }
              </p>
            )}

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
            {shelteredDuringDay ? (
              <>
                <button
                  type="button"
                  onClick={
                    waitUntilSunset
                  }
                >
                  <strong>
                    Esperar até anoitecer
                  </strong>

                  <span>
                    Permanecer protegido
                    até o pôr do sol
                  </span>
                </button>

                <button
                  type="button"
                  onClick={
                    leaveShelter
                  }
                >
                  <strong>
                    Sair do abrigo
                  </strong>

                  <span>
                    Voltar para a rua
                    mesmo sob a luz do dia
                  </span>
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </section>

          {prey &&
            !shelteredDuringDay && (
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
              DIA
            </span>

            <strong>
              {
                game.world
                  ?.day ?? 1
              }
            </strong>
          </section>

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
              PERÍODO
            </span>

            <strong>
              {
                daytime
                  ? 'DIA'
                  : 'NOITE'
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

      {mapOpen &&
        !shelteredDuringDay && (
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
