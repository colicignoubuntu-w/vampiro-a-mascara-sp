import { RELATIONSHIP_NPCS } from '../../data/npcs/relationships/index.js'
import { advanceGameTime, crossesSunrise, isDaytime } from '../time/timeEngine'
import { addDamage } from '../combat/damageEngine'
import { rollDicePool } from '../dice/rollTest'
import {
  applyRelationshipEffects,
  createRelationshipState,
  normalizeRelationshipState,
} from './relationshipModel'
import { reconcileRelationships, relationshipMinutes } from './relationshipClock'

export function relationshipState(game, npcId) {
  const npc = RELATIONSHIP_NPCS[npcId]

  if (!npc) {
    return null
  }

  return normalizeRelationshipState(
    game.relationships?.[npcId] ??
      createRelationshipState(npcId),
    npcId
  )
}

const skill = (game, id) =>
  game.abilities?.[id] ??
  Object.values(game.attributes ?? {})
    .find(group => group?.[id] !== undefined)
    ?.[id] ??
  0

const trait = (game, id) => {
  if (
    ['selfControl', 'conscience', 'courage']
      .includes(id)
  ) {
    return game.virtues?.[id] ?? 1
  }

  if (id === 'willpower') {
    return game.willpower?.current ?? 0
  }

  return skill(game, id)
}

const traitLabel = id => ({
  selfControl: 'Autocontrole',
  conscience: 'Consciência',
  courage: 'Coragem',
  willpower: 'Força de Vontade',
  brawl: 'Briga',
  streetwise: 'Manha',
  empathy: 'Empatia',
  intimidation: 'Intimidação',
}[id] ?? id ?? 'Teste')

const clampLegacyMetric = (
  key,
  value
) =>
  key === 'bond'
    ? Math.max(
        0,
        Math.min(3, value)
      )
    : Math.max(
        -10,
        Math.min(10, value)
      )

function applyLegacyMetrics(
  state,
  changes = {}
) {
  const metrics = {
    trust: 0,
    affinity: 0,
    respect: 0,
    bond: 0,
    ...(state.metrics ?? {}),
  }

  for (
    const [key, amount]
    of Object.entries(changes)
  ) {
    metrics[key] =
      clampLegacyMetric(
        key,
        (metrics[key] ?? 0) +
          Number(amount ?? 0)
      )
  }

  return metrics
}

export function relationshipChoiceReason(
  game,
  npcId,
  choice
) {
  const state =
    relationshipState(
      game,
      npcId
    )

  const r =
    choice.requires ?? {}

  if (
    r.flag &&
    !state.flags[r.flag]
  ) {
    return 'Esta opção depende de uma descoberta anterior.'
  }

  if (
    r.notFlag &&
    state.flags[r.notFlag]
  ) {
    return 'Esta opção não corresponde ao caminho escolhido.'
  }

  if (
    r.skill &&
    skill(game, r.skill) < r.min
  ) {
    return `Requer ${traitLabel(r.skill)} ${r.min}.`
  }

  const target =
    r.npc
      ? relationshipState(
          game,
          r.npc
        )
      : state

  // Compatibilidade com cenas antigas.
  if (
    r.metric &&
    (target?.metrics?.[r.metric] ?? 0) <
      r.min
  ) {
    return r.npc
      ? `É preciso construir mais confiança com ${RELATIONSHIP_NPCS[r.npc].name}.`
      : 'A relação ainda não permite essa aproximação.'
  }

  // Novo sistema.
  if (
    r.relationshipMetric &&
    (
      target
        ?.relationshipMetrics
        ?.[r.relationshipMetric] ??
      0
    ) < r.min
  ) {
    return 'O estado atual da relação ainda não permite isso.'
  }

  if (
    r.status &&
    target?.status !== r.status
  ) {
    return 'O vínculo entre vocês ainda não chegou a esse ponto.'
  }

  if (
    r.contact &&
    !target?.contact?.known
  ) {
    return 'Você ainda não tem o contato dessa pessoa.'
  }

  if (
    r.notBlocked &&
    target?.contact?.blocked
  ) {
    return 'Essa pessoa bloqueou seu contato.'
  }

  if (
    r.bloodBondMin !== undefined &&
    (
      target
        ?.influence
        ?.bloodBond ??
      0
    ) < r.bloodBondMin
  ) {
    return 'O Laço de Sangue ainda não chegou a esse nível.'
  }

  if (
    (game.blood?.current ?? 0) <=
      (choice.bloodCost ?? 0) &&
    choice.bloodCost
  ) {
    return 'Você precisa conservar pelo menos um ponto de sangue para continuar consciente.'
  }

  return null
}

export function relationshipAvailability(
  game,
  npcId
) {
  const state =
    relationshipState(
      game,
      npcId
    )

  const scene =
    RELATIONSHIP_NPCS[npcId]
      ?.scenes[
        state?.node
      ]

  if (
    !scene ||
    state.completed
  ) {
    return 'História concluída.'
  }

  if (
    game.flags?.inTorpor ||
    game.vampireState?.torpor ||
    game.health?.currentLevel >= 7
  ) {
    return 'Você não está em condições de conversar.'
  }

  if (
    game.flags?.humanityCheckRequired ||
    game.livelihood?.active ||
    game.livelihood?.crime ||
    game.livelihood?.workEvent
  ) {
    return 'Resolva a atividade em andamento primeiro.'
  }

  if (
    isDaytime(game.world)
  ) {
    return 'Os encontros acontecem à noite.'
  }

  if (
    relationshipMinutes(
      game.world
    ) < state.readyAt
  ) {
    return 'O próximo encontro ainda não está disponível.'
  }

  if (
    !scene.locations.includes(
      game.world?.location?.id
    )
  ) {
    return `Próximo encontro: ${scene.place}.`
  }

  return null
}

function validateChoice(
  game,
  npcId,
  nodeId,
  choiceId
) {
  const npc =
    RELATIONSHIP_NPCS[npcId]

  const state =
    relationshipState(
      game,
      npcId
    )

  if (
    !npc ||
    state.completed ||
    state.node !== nodeId
  ) {
    throw new Error(
      'Este encontro já mudou. Consulte o diário atualizado.'
    )
  }

  const scene =
    npc.scenes[nodeId]

  const choice =
    scene.choices.find(
      entry =>
        entry.id === choiceId
    )

  if (!choice) {
    throw new Error(
      'Escolha desconhecida.'
    )
  }

  const reason =
    relationshipAvailability(
      game,
      npcId
    ) ||
    relationshipChoiceReason(
      game,
      npcId,
      choice
    )

  if (reason) {
    throw new Error(reason)
  }

  return {
    npc,
    state,
    scene,
    choice,
  }
}

export function prepareRelationshipTest(
  input,
  npcId,
  nodeId,
  choiceId
) {
  const game =
    reconcileRelationships(
      input
    )

  const { choice } =
    validateChoice(
      game,
      npcId,
      nodeId,
      choiceId
    )

  if (!choice.test) {
    return null
  }

  const test =
    choice.test

  const traitId =
    test.trait ??
    'selfControl'

  return {
    npcId,
    nodeId,
    choiceId,

    label:
      test.label ??
      traitLabel(traitId),

    trait:
      traitId,

    traitLabel:
      traitLabel(traitId),

    pool:
      Math.max(
        1,
        Number(
          trait(
            game,
            traitId
          )
        ) || 1
      ),

    difficulty:
      Math.max(
        2,
        Math.min(
          10,
          Number(
            test.difficulty ??
            6
          ) || 6
        )
      ),
  }
}

export function rollRelationshipTest(
  game,
  preparedTest
) {
  if (!preparedTest) {
    throw new Error(
      'Nenhum teste de relação foi preparado.'
    )
  }

  const roll =
    rollDicePool({
      pool:
        preparedTest.pool,

      difficulty:
        preparedTest.difficulty,
    })

  return {
    ...roll,

    label:
      preparedTest.label,

    trait:
      preparedTest.trait,

    traitLabel:
      preparedTest.traitLabel,
  }
}

function applyOutcome(
  input,
  npcId,
  nodeId,
  choice,
  outcome,
  testRoll = null
) {
  const game =
    reconcileRelationships(
      input
    )

  const npc =
    RELATIONSHIP_NPCS[npcId]

  const state =
    relationshipState(
      game,
      npcId
    )

  const scene =
    npc.scenes[nodeId]

  const minutes =
    outcome.minutes ??
    choice.minutes ??
    15

  if (
    crossesSunrise({
      world:
        game.world,

      minutes,
    })
  ) {
    throw new Error(
      'A conversa alcançaria o amanhecer. Volte na próxima noite.'
    )
  }

  const now =
    relationshipMinutes(
      game.world
    )

  if (
    state.deadlineAt &&
    now + minutes >=
      state.deadlineAt
  ) {
    throw new Error(
      'Não há tempo para concluir essa ação antes da ameaça. Escolha uma alternativa mais rápida.'
    )
  }

  const legacyChanges =
    outcome.metrics ??
    choice.metrics ??
    {}

  const metrics =
    applyLegacyMetrics(
      state,
      legacyChanges
    )

  const flags = {
    ...(state.flags ?? {}),
    ...(choice.flags ?? {}),
    ...(outcome.flags ?? {}),
  }

  const enrichedState =
    applyRelationshipEffects(
      {
        ...state,
        metrics,
        flags,
      },
      {
        legacy:
          legacyChanges,

        relationshipMetrics:
          outcome.relationshipMetrics ??
          choice.relationshipMetrics ??
          {},

        emotions:
          outcome.emotions ??
          choice.emotions ??
          {},

        status:
          outcome.status ??
          choice.status,

        influence:
          {
            ...(
              choice.influence ??
              {}
            ),
            ...(
              outcome.influence ??
              {}
            ),
          },

        contact:
          {
            ...(
              choice.contact ??
              {}
            ),
            ...(
              outcome.contact ??
              {}
            ),
          },

        memory:
          outcome.memory ??
          choice.memory,

        memories: [
          ...(
            choice.memories ??
            []
          ),
          ...(
            outcome.memories ??
            []
          ),
        ],

        flags,
      }
    )

  const next =
    outcome.next !== undefined
      ? outcome.next
      : choice.next

  const ending =
    outcome.ending ??
    choice.ending ??
    null

  const text =
    outcome.result ??
    choice.result ??
    ending ??
    choice.text

  const entry = {
    id:
      `${npcId}:${nodeId}`,

    npcId,
    nodeId,

    choiceId:
      choice.id,

    at:
      now + minutes,

    title:
      scene.title,

    text,

    ...(testRoll
      ? {
          test: {
            label:
              testRoll.label,

            trait:
              testRoll.trait,

            pool:
              testRoll.pool,

            difficulty:
              testRoll.difficulty,

            dice:
              testRoll.dice,

            successes:
              testRoll.successes,

            result:
              testRoll.result,
          },
        }
      : {}),
  }

  const nextState = {
    ...enrichedState,

    metrics,

    flags,

    node:
      next ??
      nodeId,

    completed:
      !next,

    ending,

    readyAt:
      now +
      minutes +
      (
        outcome.delayDays ??
        choice.delayDays ??
        0
      ) *
        1440,

    deadlineAt:
      (
        outcome.clearDeadline ??
        choice.clearDeadline
      )
        ? null
        : (
            outcome.deadlineDays ??
            choice.deadlineDays
          )
          ? now +
            minutes +
            (
              outcome.deadlineDays ??
              choice.deadlineDays
            ) *
              1440
          : state.deadlineAt ??
            null,

    journal: [
      ...(state.journal ?? []),
      entry,
    ],
  }

  let updated = {
    ...game,

    relationships: {
      ...(game.relationships ??
        {}),
      [npcId]:
        nextState,
    },

    history: [
      ...(game.history ?? []),
      {
        ...entry,

        type:
          testRoll
            ? 'relationship-test'
            : 'relationship-choice',
      },
    ],
  }

  const bloodCost =
    outcome.bloodCost ??
    choice.bloodCost

  if (bloodCost) {
    updated = {
      ...updated,

      blood: {
        ...game.blood,

        current:
          game.blood.current -
          bloodCost,
      },
    }
  }

  const damage =
    outcome.damage ??
    choice.damage

  if (damage) {
    updated = {
      ...updated,

      health:
        addDamage({
          health:
            game.health,

          amount:
            damage,

          damageType:
            'lethal',
        }),
    }
  }

  return reconcileRelationships(
    advanceGameTime(
      updated,
      minutes,
      {
        reason:
          `Encontro com ${npc.name}: ${scene.title}`,
      }
    )
  )
}

export function resolveRelationshipTest(
  input,
  preparedTest,
  roll
) {
  if (
    !preparedTest ||
    !roll
  ) {
    throw new Error(
      'O teste de relação ainda não foi concluído.'
    )
  }

  const game =
    reconcileRelationships(
      input
    )

  const { choice } =
    validateChoice(
      game,
      preparedTest.npcId,
      preparedTest.nodeId,
      preparedTest.choiceId
    )

  if (!choice.test) {
    throw new Error(
      'Esta escolha não possui teste.'
    )
  }

  const outcome =
    choice.test[
      roll.result
    ] ??
    choice.test.failure

  if (!outcome) {
    throw new Error(
      `O teste não possui resultado configurado para ${roll.result}.`
    )
  }

  return applyOutcome(
    game,
    preparedTest.npcId,
    preparedTest.nodeId,
    choice,
    outcome,
    roll
  )
}

export function performRelationshipChoice(
  input,
  npcId,
  nodeId,
  choiceId
) {
  const game =
    reconcileRelationships(
      input
    )

  const { choice } =
    validateChoice(
      game,
      npcId,
      nodeId,
      choiceId
    )

  if (choice.test) {
    throw new Error(
      'Esta escolha exige um teste.'
    )
  }

  return applyOutcome(
    game,
    npcId,
    nodeId,
    choice,
    choice
  )
}
