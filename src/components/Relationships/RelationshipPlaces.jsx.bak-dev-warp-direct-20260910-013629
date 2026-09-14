import FrenzyTest from '../FrenzyTest/FrenzyTest'
import { executeFrenzyTest } from '../../engine/vampire/frenzyEngine'
import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  createPortal,
} from 'react-dom'

import {
  venuesAt,
} from '../../data/npcs/relationships/venues.js'

import {
  relationshipState,
  relationshipChoiceReason,
  rollRelationshipTest,
} from '../../engine/relationships/relationshipEngine'

import {
  encountersAtVenue,
  performVenueChoice,
  prepareVenueRelationshipTest,
  resolveVenueRelationshipTest,
} from '../../engine/relationships/venueEngine'

import {
  reconcileRelationships,
} from '../../engine/relationships/relationshipClock'

import './Relationships.css'


function TestPanel({
  pending,
  roll,
  onRoll,
  onContinue,
  onCancel,
}) {
  const result =
    roll?.result ===
    'success'
      ? 'Sucesso'
      : roll?.result ===
          'botch'
        ? 'Falha crítica'
        : 'Falha'

  return (
    <section className="relationships-test relationships-test-story">
      <small>
        TESTE DE RELAÇÃO
      </small>

      <h3>
        {pending.label}
      </h3>

      <p>
        {pending.traitLabel}
        :
        {' '}
        <strong>
          {pending.pool}
        </strong>

        {' · '}

        Dificuldade:
        {' '}

        <strong>
          {pending.difficulty}
        </strong>
      </p>

      {!roll ? (
        <div className="relationships-story-choices">
          <button
            type="button"
            onClick={onRoll}
          >
            Rolar teste
          </button>

          <button
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <>
          <div
            className="relationships-test-dice"
            aria-label={`Dados: ${roll.dice.join(', ')}`}
          >
            {roll.dice.map(
              (die, index) => (
                <span
                  key={`${die}:${index}`}
                >
                  {die}
                </span>
              )
            )}
          </div>

          <p
            className={
              roll.result === 'success'
                ? 'relationships-result'
                : 'relationships-alert'
            }
            role="status"
          >
            <strong>
              {result}
            </strong>

            {' · '}

            {roll.successes}
            {' '}
            sucesso
            {roll.successes === 1 ? '' : 's'}
          </p>

          <button
            type="button"
            className="relationships-story-continue"
            onClick={onContinue}
          >
            Continuar
          </button>
        </>
      )}
    </section>
  )
}

function venueBackground(
  venue,
  scene
) {
  const id =
    String(
      venue?.id ??
      ''
    ).toLowerCase()

  const place =
    String(
      scene?.place ??
      venue?.name ??
      ''
    ).toLowerCase()

  if (
    id.includes(
      'ultimo'
    ) ||
    place.includes(
      'último gole'
    ) ||
    place.includes(
      'ultimo gole'
    )
  ) {
    return '/images/locations/ultimo-gole/main.jpg'
  }

  if (
    id.includes(
      'vesuvius'
    ) ||
    place.includes(
      'vesuvius'
    )
  ) {
    return '/images/locations/vesuvius.jpg'
  }

  if (
    id.includes(
      'asylum'
    ) ||
    place.includes(
      'asylum'
    )
  ) {
    return '/images/locations/asylum.jpg'
  }

  if (
    place.includes(
      'pinheiros'
    )
  ) {
    return '/images/locations/pinheiros.jpg'
  }

  return null
}

function VenueOverview({
  game,
  venue,
  encounters,
  selectedNpc,
  feedback,
  error,
  onSelect,
  onClose,
}) {
  return (
    <section className="relationship-place-overview">
      <header>
        <div>
          <small>
            {game.world?.location?.name}
          </small>

          <h2>
            {venue.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={
            onClose
          }
        >
          {venue.exit}
        </button>
      </header>

      <p>
        {venue.description}
      </p>

      {feedback && (
        <p
          className="relationships-result"
          role="status"
        >
          {feedback}
        </p>
      )}

      {!encounters.length && (
        <p>
          Nenhum encontro disponível por aqui nesta noite. Você pode permanecer observando o movimento ou voltar para a cidade.
        </p>
      )}

      {encounters.length >
        0 && (
        <>
          <small className="relationship-place-overview-label">
            PESSOAS PRESENTES
          </small>

          <div className="relationship-place-overview-people">
            {encounters.map(
              person => (
                <button
                  type="button"
                  key={
                    person.id
                  }
                  aria-pressed={
                    selectedNpc?.id ===
                    person.id
                  }
                  onClick={() =>
                    onSelect(
                      person.id
                    )
                  }
                >
                  {person.portrait && (
                    <img
                      src={
                        person.portrait
                      }
                      alt=""
                    />
                  )}

                  <span>
                    {
                      person.name
                    }
                  </span>
                </button>
              )
            )}
          </div>
        </>
      )}

      {error && (
        <p
          role="alert"
          className="relationships-alert"
        >
          {error}
        </p>
      )}
    </section>
  )
}


const RELATIONSHIP_DIALOGUE_DEFAULT_SPEAKERS = {
  second_night: 'Clara',
  second2_clara_flirt_reply: 'Clara',
  second2_rafael_direct: 'Rafael',
  second2_livia_returns: 'Clara',
  second2_livia_returns_tense: 'Clara',
  second2_livia_lie_clean: 'Clara',
  second2_livia_lie_soft: 'Clara',
  second2_livia_lie_fail: 'Clara',
  second2_livia_lie_botch: 'Clara',
  second2_livia_lie_overexplained: 'Clara',
  second2_livia_evade_reply: 'Clara',
  second2_livia_confess_setup: 'Clara',
  second2_confess_not_ready_reply: 'Clara',
  second2_confess_death_lie: 'Clara',
  second2_confess_stop_reply: 'Clara',
  second2_livia_deflect: 'Clara',
  second2_rafael_livia_long_reply: 'Rafael',
  second2_rafael_why_reply: 'Rafael',
  second2_rafael_worried_success: 'Rafael',
  second2_rafael_worried_fail: 'Rafael',
  second2_rafael_provoked: 'Rafael',
  second2_rafael_camera_complaint: 'Rafael',
  second2_follow_botch: 'Rafael',
  second2_ask_clara_rafael: 'Clara',
  second2_boundary_respected: 'Clara',
  second2_boundary_explain_reply: 'Clara',
  second2_boundary_possessive: 'Clara',
  second2_intimidation_success: 'Clara',
  second2_intimidation_botch: 'Clara',
  second2_confront_macho: 'Clara',
  second2_check_clara_opens: 'Clara',
  second2_check_clara_defensive: 'Clara',
  second2_check_clara_defensive_soft: 'Clara',
  second2_check_breakup_bad: 'Clara',
  second2_later_camera_argument_tense: 'Clara',
  second2_after_argument_clara: 'Clara',
  second2_bar_closing_tense: 'Clara',
  second2_uber_reply: 'Clara',
  second2_offer_clara_only: 'Clara',
  second2_goodbye_tense: 'Clara',
  second_clara_invites: 'Clara',
  second_work_talk: 'Clara',
  second_rafael: 'Clara',
  second_safety_seed: 'Clara',
  second_personal: 'Clara',
  second_connection: 'Clara',
}

const RELATIONSHIP_DIALOGUE_SPEAKER_ORDER = {
  second2_clara_introduces_tense: ['Clara', 'Clara', 'Rafael'],
  second2_clara_introduces: ['Clara', 'Clara', 'Rafael', 'Rafael'],
  second2_rafael_backpedals: ['Rafael', 'Clara', 'Rafael'],
  second2_rafael_joke_reply: ['Rafael', 'Clara', 'Clara'],
  second2_work_argument: ['Clara', 'Rafael', 'Clara', 'Rafael', 'Clara'],
  second2_work_argument_tense: ['Clara', 'Rafael', 'Clara'],
  second2_confront_boundary: ['Rafael', 'Clara', 'Rafael', 'Clara'],
  second2_intimidation_fail: ['Rafael', 'Clara'],
  second2_macho_near_fight: ['Clara', 'Rafael', 'Clara'],
  second2_argument_overheard_v2: ['Rafael', 'Clara', 'Rafael', 'Clara', 'Rafael', 'Clara', 'Rafael', 'Clara'],
  second2_argument_obfuscate_v2: ['Rafael', 'Clara', 'Rafael', 'Clara', 'Rafael', 'Clara'],
  second2_clara_takes_keys: ['Clara', 'Rafael', 'Clara'],
  second2_uber_both: ['Protagonista', 'Clara'],
}

const RELATIONSHIP_DIALOGUE_NAMES = [
  'Clara',
  'Rafael',
  'Caroline',
  'Íris',
  'Iris',
  'Caio',
  'Duda',
]

function relationshipDialogueSpeakerFromContext(before, after) {
  const beforeText = String(before ?? '')
  const afterText = String(after ?? '')

  let best = null
  let bestIndex = -1

  for (const name of RELATIONSHIP_DIALOGUE_NAMES) {
    const index = beforeText.lastIndexOf(name)

    if (index > bestIndex) {
      best = name === 'Iris' ? 'Íris' : name
      bestIndex = index
    }
  }

  if (best) {
    return best
  }

  for (const name of RELATIONSHIP_DIALOGUE_NAMES) {
    if (afterText.trimStart().startsWith(name)) {
      return name === 'Iris' ? 'Íris' : name
    }
  }

  return null
}

function relationshipLegacyTextBlocks(texts, node) {
  const fallbackOrder =
    RELATIONSHIP_DIALOGUE_SPEAKER_ORDER[node] ?? []

  const defaultSpeaker =
    RELATIONSHIP_DIALOGUE_DEFAULT_SPEAKERS[node] ??
    (
      String(node ?? '').startsWith('first_')
        ? 'Clara'
        : null
    )

  let quoteIndex = 0
  const blocks = []

  for (const raw of texts ?? []) {
    const text = String(raw ?? '')
    const matches = [...text.matchAll(/“([^”]+)”/g)]

    if (!matches.length) {
      blocks.push({
        type: 'narration',
        text,
      })
      continue
    }

    let cursor = 0
    let convertedAny = false

    for (const match of matches) {
      const matchIndex = match.index ?? 0
      const before = text.slice(cursor, matchIndex)
      const after = text.slice(matchIndex + match[0].length)

      const contextualSpeaker =
        relationshipDialogueSpeakerFromContext(
          text.slice(0, matchIndex),
          after
        )

      const speaker =
        contextualSpeaker ??
        fallbackOrder[quoteIndex] ??
        defaultSpeaker

      quoteIndex += 1

      if (!speaker) {
        continue
      }

      if (before.trim()) {
        blocks.push({
          type: 'narration',
          text: before.trim(),
        })
      }

      blocks.push({
        type: 'dialogue',
        speaker,
        text: match[1],
      })

      cursor = matchIndex + match[0].length
      convertedAny = true
    }

    if (!convertedAny) {
      blocks.push({
        type: 'narration',
        text,
      })
      continue
    }

    const tail = text.slice(cursor).trim()

    if (tail) {
      blocks.push({
        type: 'narration',
        text: tail,
      })
    }
  }

  return blocks
}

function relationshipScenePresentationBlocks(scene, node) {
  if (Array.isArray(scene?.blocks)) {
    return scene.blocks
  }

  const texts =
    scene?.narration ??
    scene?.text ??
    []

  const blocks =
    relationshipLegacyTextBlocks(texts, node)

  if (scene?.dialogue) {
    const dialogueSpeaker =
      String(scene.dialogue.speaker ?? '').trim()

    const dialogueText =
      String(scene.dialogue.text ?? '').trim()

    const alreadyPresent =
      blocks.some(
        block =>
          block?.type === 'dialogue' &&
          String(block.speaker ?? '').trim() === dialogueSpeaker &&
          String(block.text ?? '').trim() === dialogueText
      )

    if (!alreadyPresent && dialogueText) {
      blocks.push({
        type: 'dialogue',
        speaker: dialogueSpeaker,
        text: dialogueText,
      })
    }
  }

  return blocks
}

function VenueScene({
  game,
  venue,
  npc,
  state,
  scene,
  blocked,
  feedback,
  error,
  pendingTest,
  testRoll,
  onChoose,
  onRoll,
  onContinueTest,
  onCancelTest,
  onBack,
  onClose,
}) {
  const background =
    venueBackground(
      venue,
      scene
    )

  const sceneBlocks =
    relationshipScenePresentationBlocks(
      scene,
      state?.node
    )

  const dialogueSpeakers = [
    ...new Set(
      sceneBlocks
        .filter(
          block =>
            block?.type ===
            'dialogue'
        )
        .map(
          block =>
            block.speaker
        )
        .filter(Boolean)
    ),
  ]

  // CLARA_DYNAMIC_PORTRAIT_V1
  const claraPortraits = {
    normal: '/images/npcs/clara/portrait.jpg',
    serious: '/images/npcs/clara/clara-seria.png',
    angry: '/images/npcs/clara/clara-brava.png',
    jealousy: '/images/npcs/clara/clara-ciumes.png',
    sad: '/images/npcs/clara/clara-chorando.png',
    fear: '/images/npcs/clara/clara-medo.png',
    disgust: '/images/npcs/clara/clara-nojo.png',
    smiling: '/images/npcs/clara/clara-sorrindo.png',
    argument: '/images/npcs/clara/clara-discussao.png',
  }

  const claraMoodAliases = {
    normal: 'normal',
    neutral: 'normal',
    serious: 'serious',
    seria: 'serious',
    angry: 'angry',
    brava: 'angry',
    anger: 'angry',
    jealousy: 'jealousy',
    jealous: 'jealousy',
    ciumes: 'jealousy',
    ciúmes: 'jealousy',
    sad: 'sad',
    triste: 'sad',
    crying: 'sad',
    chorando: 'sad',
    fear: 'fear',
    medo: 'fear',
    disgust: 'disgust',
    nojo: 'disgust',
    smiling: 'smiling',
    smile: 'smiling',
    sorrindo: 'smiling',
    argument: 'argument',
    discussao: 'argument',
    discussão: 'argument',
  }

  const explicitClaraMood =
    claraMoodAliases[
      String(
        scene?.portraitMood ??
        ''
      )
        .trim()
        .toLowerCase()
    ]

  const explicitScenePortrait =
    String(
      scene?.portrait ??
      ''
    )

  const emotionalScenePortrait =
    npc?.id === 'clara' &&
    /\/clara-(?:seria|brava|ciumes|chorando|medo|nojo|sorrindo|discussao)(?:-sem-fundo)?\.png$/i
      .test(
        explicitScenePortrait
      )
      ? explicitScenePortrait
      : null

  const legacyRelationship =
    state?.metrics ??
    {}

  const relationshipEmotion =
    state?.relationshipMetrics ??
    {}

  const claraFlags =
    state?.flags ??
    {}

  const legacyTrust =
    Number(
      legacyRelationship.trust ??
      0
    )

  const legacyRespect =
    Number(
      legacyRelationship.respect ??
      0
    )

  const modernTrust =
    Number(
      relationshipEmotion.trust ??
      0
    )

  const happiness =
    Number(
      relationshipEmotion.happiness ??
      0
    )

  const anger =
    Number(
      relationshipEmotion.anger ??
      0
    )

  const fear =
    Number(
      relationshipEmotion.fear ??
      0
    )

  const badRelationshipStatus =
    state?.status === 'hostile' ||
    state?.status === 'enemy'

  const hasSeriousClaraFlag =
    Boolean(
      claraFlags.disrespectedClaraBoundary ||
      claraFlags.pushedFirstBoundary ||
      claraFlags.promisedViolence ||
      claraFlags.possessive ||
      claraFlags.guardedWithClara
    )

  let automaticClaraMood =
    'normal'

  if (
    fear >= 55
  ) {
    automaticClaraMood =
      'fear'
  } else if (
    anger >= 60
  ) {
    automaticClaraMood =
      'angry'
  } else if (
    happiness <= -50
  ) {
    automaticClaraMood =
      'sad'
  } else if (
    badRelationshipStatus ||
    legacyTrust <= -2 ||
    legacyRespect <= -2 ||
    modernTrust <= -20 ||
    anger >= 25 ||
    fear >= 25 ||
    happiness <= -20
  ) {
    automaticClaraMood =
      'serious'
  } else if (
    happiness >= 45 &&
    modernTrust >= 30 &&
    legacyTrust >= 2
  ) {
    automaticClaraMood =
      'smiling'
  }

  const claraPortrait =
    explicitClaraMood
      ? claraPortraits[
          explicitClaraMood
        ]
      : emotionalScenePortrait ??
        claraPortraits[
          automaticClaraMood
        ]

  const effectiveScenePortrait =
    npc?.id === 'clara'
      ? claraPortrait
      : (
          scene?.portrait ??
          npc?.portrait
        )


  // CLARA_ALWAYS_VISIBLE_V4
  // Se esta é uma cena da Clara, o retrato dela permanece na tela
  // mesmo quando Rafael, Íris, Caroline ou outro personagem fala.
  const showScenePortrait =
    npc?.id === 'clara'
      ? true
      : (
          scene.showPortrait !== false &&
          dialogueSpeakers.length <= 1
        )

  return (
    <section
      className="relationship-place-scene"
      style={
        background
          ? {
              '--relationship-place-background':
                `url("${background}")`,
            }
          : undefined
      }
    >
      <div className="relationship-place-scene-background" />
      <div className="relationship-place-scene-overlay" />

      <header className="relationship-place-scene-top">
        <button
          type="button"
          onClick={
            onBack
          }
          className="relationship-place-scene-back"
        >
          ← Voltar
        </button>

        <span>
          {scene.place}
        </span>

        <button
          type="button"
          onClick={
            onClose
          }
          className="relationship-place-scene-close"
          aria-label="Fechar"
        >
          ×
        </button>
      </header>

      {showScenePortrait && effectiveScenePortrait && (
        <img
          key={effectiveScenePortrait}
          className="relationship-place-scene-character"
          src={effectiveScenePortrait}
          alt=""
          onError={event => {
            event.currentTarget.hidden =
              true
          }}
        />
      )}

      <div className="relationship-place-scene-content">
        <div className="relationship-place-scene-heading">
          <span>
            {npc.name}
          </span>

          <h1>
            {scene.title}
          </h1>
        </div>

        <div className="relationship-place-scene-text">
          {sceneBlocks.map(
            (block, index) => {
              if (block?.type === 'dialogue') {
                return (
                  <div
                    className="game-dialogue"
                    key={`${state.node}:dialogue:${index}`}
                  >
                    <span className="game-dialogue-speaker">
                      {block.speaker}
                    </span>

                    <p>
                      {block.text}
                    </p>
                  </div>
                )
              }

              return (
                <p
                  key={`${state.node}:narration:${index}`}
                >
                  {block?.text ?? ''}
                </p>
              )
            }
          )}
        </div>

        {pendingTest ? (
          <TestPanel
            pending={pendingTest}
            roll={testRoll}
            onRoll={onRoll}
            onContinue={onContinueTest}
            onCancel={onCancelTest}
          />
        ) : (
          <div className="relationship-place-scene-choices">
            {scene.choices.map(
              choice => {
                const reason =
                  relationshipChoiceReason(
                    game,
                    npc.id,
                    choice
                  )

                return (
                  <div
                    key={choice.id}
                    className="relationship-place-scene-choice"
                  >
                    <button
                      type="button"
                      disabled={
                        Boolean(reason) ||
                        blocked
                      }
                      onClick={() =>
                        onChoose(choice)
                      }
                    >
                      <span>
                        {choice.test && (
                          <strong>
                            [{choice.test.label ?? 'Teste'}]
                            {' '}
                          </strong>
                        )}

                        {choice.text}
                      </span>

                    </button>

                    {reason && (
                      <small className="relationship-place-scene-reason">
                        {reason}
                      </small>
                    )}
                  </div>
                )
              }
            )}
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="relationships-alert relationship-place-scene-error"
          >
            {error}
          </p>
        )}
      </div>
    </section>
  )
}

export default function RelationshipPlaces({
  game,
  onChange,
  blocked = false,
  peopleOnly = false,
}) {
  const [
    opened,
    setOpened,
  ] = useState(
    null
  )

  const [
    selected,
    setSelected,
  ] = useState(
    null
  )

  const [
    feedback,
    setFeedback,
  ] = useState(
    ''
  )

  const [
    error,
    setError,
  ] = useState(
    ''
  )

  const [
    pendingTest,
    setPendingTest,
  ] = useState(
    null
  )

  const [
    testRoll,
    setTestRoll,
  ] = useState(
    null
  )

  const [relationshipFrenzyRoll, setRelationshipFrenzyRoll] = useState(null)
  const [relationshipFrenzyNode, setRelationshipFrenzyNode] = useState(null)

  const dialog =
    useRef(
      null
    )
const processedDevWarp =
    useRef(
      null
    )

  const current =
    reconcileRelationships(
      game
    )

  /*
    Locais que possuem componente próprio não devem
    ser abertos pelo sistema antigo RelationshipPlaces.

    O Último Gole possui navegação interna própria em:
    components/UltimoGole/UltimoGole.jsx
  */
  const venues =
    venuesAt(
      current.world
        ?.location
        ?.id
    ).filter(
      place =>
        peopleOnly ||
        place.id !==
          'ultimo_gole'
    )

  const venue =
    venues.find(
      item =>
        item.id ===
        opened
    )

  const visible =
    Boolean(
      venue &&
      !blocked
    )

  const encounters =
    venue
      ? encountersAtVenue(
          current,
          venue.id
        )
      : []

  const npc =
    encounters.find(
      person =>
        person.id ===
        selected
    ) ??
    (
      encounters.length ===
      1
        ? encounters[0]
        : null
    )

  const state =
    npc &&
    relationshipState(
      current,
      npc.id
    )

  const scene =
    npc?.scenes[
      state?.node
    ]

  const showScene =
    Boolean(
      npc &&
      state &&
      scene
    )


  // RELATIONSHIP_BODY_CLASS_MAIN_V4
  useEffect(() => {
    const shouldHideUnderlyingGame =
      Boolean(visible && showScene)

    document.body.classList.toggle(
      'relationship-place-dialog-open',
      shouldHideUnderlyingGame
    )

    return () => {
      document.body.classList.remove(
        'relationship-place-dialog-open'
      )
    }
  }, [visible, showScene])


  

  useEffect(
    () => {
      const warp =
        game?.devRelationshipWarp

      if (
        !warp ||
        !warp.token ||
        processedDevWarp.current ===
          warp.token
      ) {
        return
      }

      if (
        warp.venueId !==
          'ultimo_gole' ||
        warp.npcId !==
          'clara'
      ) {
        return
      }

      const targetPresent =
        encountersAtVenue(
          current,
          warp.venueId
        ).some(
          person =>
            person.id ===
            warp.npcId
        )

      if (!targetPresent) {
        return
      }

      processedDevWarp.current =
        warp.token

      setOpened(
        warp.venueId
      )

      setSelected(
        warp.npcId
      )

      setFeedback(
        ''
      )

      setError(
        ''
      )

      setPendingTest(
        null
      )

      setTestRoll(
        null
      )
    },
    [
      game?.devRelationshipWarp?.token,
      current,
    ]
  )

  useEffect(
    () => {
      if (!visible) {
        return undefined
      }

      const element =
        dialog.current

      if (
        !element?.open
      ) {
        element?.showModal()
      }

      return () => {
        if (
          element?.open
        ) {
          element.close()
        }
      }
    },
    [
      visible,
    ]
  )

  useEffect(
    () => {
      setPendingTest(
        null
      )

      setTestRoll(
        null
      )

      setError(
        ''
      )
    },
    [
      selected,
      state?.node,
    ]
  )

  function closePlace() {
    setOpened(
      null
    )

    setSelected(
      null
    )

    setFeedback(
      ''
    )

    setError(
      ''
    )

    setPendingTest(
      null
    )

    setTestRoll(
      null
    )
  }

  /* RELATIONSHIP FRENZY AUTO */
  useEffect(() => {
    if (!showScene || !scene?.frenzyTrigger) {
      setRelationshipFrenzyRoll(null)
      setRelationshipFrenzyNode(null)
      return
    }
    if (relationshipFrenzyNode !== state.node) {
      setRelationshipFrenzyRoll(null)
      setRelationshipFrenzyNode(state.node)
    }
  }, [showScene, state?.node, scene?.frenzyTrigger?.id])

  function rollRelationshipFrenzy() {
    if (!scene?.frenzyTrigger) return
    setRelationshipFrenzyRoll(executeFrenzyTest(current, scene.frenzyTrigger))
  }

  function continueRelationshipFrenzy() {
    if (!npc || !state || !scene?.frenzyTrigger || !relationshipFrenzyRoll) return
    const trigger = scene.frenzyTrigger
    let outcome = null
    let nextNode = trigger.successScene
    if (relationshipFrenzyRoll.result === 'botch') {
      outcome = trigger.criticalOutcomes?.[0] ?? trigger.failureOutcomes?.[0] ?? null
      nextNode = outcome?.endScene ?? nextNode
    } else if (relationshipFrenzyRoll.result !== 'success') {
      outcome = trigger.failureOutcomes?.[0] ?? null
      nextNode = outcome?.endScene ?? nextNode
    }
    if (!nextNode || !npc.scenes?.[nextNode]) {
      setError(`Cena de frenesi não encontrada: ${nextNode}`)
      return
    }
    const relationship = current.relationships?.[npc.id] ?? state
    const updated = {
      ...current,
      relationships: {
        ...(current.relationships ?? {}),
        [npc.id]: {
          ...relationship,
          node: nextNode,
          readyAt: 0,
          flags: {
            ...(relationship.flags ?? {}),
            ...(outcome?.flags ?? {}),
            ...(relationshipFrenzyRoll.result === 'success' ? { beastJealousyTriggered: true, resistedClaraRageControl: true } : {}),
          },
        },
      },
      lastFrenzyRoll: relationshipFrenzyRoll,
      history: [ ...(current.history ?? []), { type: 'relationship-frenzy', npcId: npc.id, node: state.node, triggerId: trigger.id, result: relationshipFrenzyRoll.result, timestamp: new Date().toISOString() } ],
    }
    onChange(updated)
    setRelationshipFrenzyRoll(null)
    setRelationshipFrenzyNode(null)
    setError('')
  }

  function choose(
    choice
  ) {
    if (
      blocked ||
      !npc ||
      !state ||
      !venue
    ) {
      return
    }

    try {
      if (
        choice.test
      ) {
        const prepared =
          prepareVenueRelationshipTest(
            game,
            venue.id,
            npc.id,
            state.node,
            choice.id
          )

        setPendingTest(
          prepared
        )

        setTestRoll(
          null
        )

        setError(
          ''
        )

        return
      }

      const updated =
        performVenueChoice(
          game,
          venue.id,
          npc.id,
          state.node,
          choice.id
        )

      onChange(
        updated
      )

      setFeedback(
        updated
          .relationships[
            npc.id
          ]
          .journal
          .at(-1)
          ?.text ??
        ''
      )

      setError(
        ''
      )
    } catch (
      err
    ) {
      setError(
        err.message
      )
    }
  }


  function rollTest() {
    try {
      setTestRoll(
        rollRelationshipTest(
          game,
          pendingTest
        )
      )

      setError(
        ''
      )
    } catch (
      err
    ) {
      setError(
        err.message
      )
    }
  }


  function continueTest() {
    if (
      !venue ||
      !pendingTest ||
      !testRoll
    ) {
      return
    }

    try {
      const updated =
        resolveVenueRelationshipTest(
          game,
          venue.id,
          pendingTest,
          testRoll
        )

      onChange(
        updated
      )

      setFeedback(
        updated
          .relationships[
            pendingTest.npcId
          ]
          .journal
          .at(-1)
          ?.text ??
        ''
      )

      setPendingTest(
        null
      )

      setTestRoll(
        null
      )

      setError(
        ''
      )
    } catch (
      err
    ) {
      setError(
        err.message
      )
    }
  }


  function cancelTest() {
    if (testRoll) {
      return
    }

    setPendingTest(
      null
    )

    setError(
      ''
    )
  }

  if (
    !venues.length
  ) {
    return null
  }

  return (
    <>
      {venues
        .filter(
          place =>
            !peopleOnly ||
            encountersAtVenue(
              current,
              place.id
            ).length >
              0
        )
        .map(
          place => {
            const present =
              encountersAtVenue(
                current,
                place.id
              )

            return (
              <button
                className={
                  peopleOnly
                    ? 'game-choice-button'
                    : undefined
                }
                type="button"
                key={
                  place.id
                }
                disabled={
                  blocked
                }
                onClick={() => {
                  setOpened(
                    place.id
                  )

                  setSelected(
                    present.length ===
                      1
                      ? present[0].id
                      : null
                  )

                  setFeedback(
                    ''
                  )

                  setError(
                    ''
                  )
                }}
              >
                <strong>
                  {peopleOnly
                    ? `Conversar com ${present
                        .map(
                          person =>
                            person.name.split(
                              ' '
                            )[0]
                        )
                        .join(
                          ' e '
                        )}.`
                    : place.name}
                </strong>

                {!peopleOnly && (
                  <span>
                    Entrar e explorar
                  </span>
                )}
              </button>
            )
          }
        )}

      {visible &&
        createPortal(
          <dialog
            className={[
              'relationships-dialog',
              'relationship-place',
              showScene
                ? 'relationship-place-story-mode'
                : 'relationship-place-overview-mode',
            ]
              .filter(
                Boolean
              )
              .join(
                ' '
              )}
            ref={
              dialog
            }
            onCancel={(
              event
            ) => {
              event.preventDefault()

              closePlace()
            }}
            onClose={() =>
              setOpened(
                null
              )
            }
            aria-labelledby="relationship-place-title"
          >
            {showScene && scene?.frenzyTrigger ? (
              <FrenzyTest
                game={current}
                trigger={scene.frenzyTrigger}
                result={relationshipFrenzyRoll}
                onRoll={rollRelationshipFrenzy}
                onContinue={continueRelationshipFrenzy}
              />
            ) : showScene ? (
              <VenueScene
                game={
                  current
                }
                venue={
                  venue
                }
                npc={
                  npc
                }
                state={
                  state
                }
                scene={
                  scene
                }
                blocked={
                  blocked || Boolean(scene?.frenzyTrigger && relationshipFrenzyNode === state?.node)
                }
                feedback={
                  feedback
                }
                error={
                  error
                }
                pendingTest={
                  pendingTest
                }
                testRoll={
                  testRoll
                }
                onChoose={
                  choose
                }
                onRoll={
                  rollTest
                }
                onContinueTest={
                  continueTest
                }
                onCancelTest={
                  cancelTest
                }
                onBack={() => {
                  if (
                    encounters.length >
                    1
                  ) {
                    setSelected(
                      null
                    )
                  } else {
                    closePlace()
                  }
                }}
                onClose={
                  closePlace
                }
              />
            ) : (
              <VenueOverview
                game={
                  current
                }
                venue={
                  venue
                }
                encounters={
                  encounters
                }
                selectedNpc={
                  npc
                }
                feedback={
                  feedback
                }
                error={
                  error
                }
                onSelect={
                  setSelected
                }
                onClose={
                  closePlace
                }
              />
            )}
          </dialog>,
          document.body
        )}
    </>
  )
}
