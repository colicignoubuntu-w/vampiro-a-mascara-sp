import {
  rollDicePool,
} from '../dice/rollTest'

function getTraitData(
  game,
  type
) {
  if (type === 'fear') {
    return {
      key: 'courage',
      label: 'Coragem',
      value:
        game?.virtues
          ?.courage ?? 1,
    }
  }

  return {
    key: 'selfControl',
    label: 'Autocontrole',
    value:
      game?.virtues
        ?.selfControl ?? 1,
  }
}

function getRandomItem(
  items
) {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return null
  }

  const index =
    Math.floor(
      Math.random() *
      items.length
    )

  return items[index]
}

function addMinutes(
  world,
  amount
) {
  const hour =
    world?.hour ?? 0

  const minute =
    world?.minute ?? 0

  const total =
    hour * 60 +
    minute +
    amount

  const dayMinutes =
    24 * 60

  const normalized =
    ((total % dayMinutes) +
      dayMinutes) %
    dayMinutes

  return {
    ...world,

    hour:
      Math.floor(
        normalized / 60
      ),

    minute:
      normalized % 60,
  }
}

function formatTime(
  world
) {
  const hour =
    String(
      world?.hour ?? 0
    ).padStart(
      2,
      '0'
    )

  const minute =
    String(
      world?.minute ?? 0
    ).padStart(
      2,
      '0'
    )

  return `${hour}:${minute}`
}

function applyBloodGain(
  game,
  gain
) {
  if (!gain) {
    return game
  }

  const current =
    game?.blood?.current ?? 0

  const maximum =
    game?.blood?.maximum ?? 10

  return {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        Math.min(
          maximum,
          current + gain
        ),
    },
  }
}

function applyBloodSet(
  game,
  value
) {
  if (
    value === undefined ||
    value === null
  ) {
    return game
  }

  const maximum =
    game?.blood?.maximum ?? 10

  let target =
    value

  if (
    value === 'maximum'
  ) {
    target =
      maximum
  }

  return {
    ...game,

    blood: {
      ...(game.blood ?? {}),

      current:
        Math.max(
          0,
          Math.min(
            maximum,
            Number(target)
          )
        ),
    },
  }
}

export function executeFrenzyTest(
  game,
  trigger = {}
) {
  const type =
    trigger.type ??
    'rage'

  const trait =
    getTraitData(
      game,
      type
    )

  const difficulty =
    trigger.difficulty ??
    6

  const roll =
    rollDicePool({
      pool:
        Math.max(
          1,
          trait.value
        ),

      difficulty,
    })

  return {
    ...roll,

    type: 'frenzy',

    frenzyType:
      type,

    triggerId:
      trigger.id ??
      'unknown',

    traitKey:
      trait.key,

    traitLabel:
      trait.label,

    traitValue:
      trait.value,

    difficulty,

    timestamp:
      new Date()
        .toISOString(),
  }
}

export function createFrenzyAftermath(
  game,
  trigger,
  roll
) {
  if (
    roll.result ===
    'success'
  ) {
    return game
  }

  const severity =
    roll.result ===
    'botch'
      ? 'critical'
      : 'normal'

  const outcomes =
    severity === 'critical'
      ? trigger.criticalOutcomes
      : trigger.failureOutcomes

  const outcome =
    getRandomItem(
      outcomes
    )

  if (!outcome) {
    throw new Error(
      `Nenhuma consequência de Frenesi configurada para ${trigger.id} (${severity}).`
    )
  }

  const durationMinutes =
    Number(
      outcome.durationMinutes ??
      10
    )

  const startWorld = {
    ...(game.world ?? {}),
  }

  const startTime =
    formatTime(
      startWorld
    )

  const updatedWorld =
    addMinutes(
      startWorld,
      durationMinutes
    )

  if (
    outcome.location
  ) {
    updatedWorld.location = {
      ...outcome.location,
    }
  }

  const endTime =
    formatTime(
      updatedWorld
    )

  let updatedGame = {
    ...game,

    world:
      updatedWorld,
  }

  updatedGame =
    applyBloodGain(
      updatedGame,
      outcome.bloodGain
    )

  updatedGame =
    applyBloodSet(
      updatedGame,
      outcome.bloodSet
    )

  const oldMasqueradeRisk =
    Number(
      game.flags
        ?.masqueradeRisk ??
      0
    )

  const masqueradeRiskDelta =
    Number(
      outcome.masqueradeRisk ??
      0
    )

  const memories =
    Array.isArray(
      outcome.memories
    )
      ? outcome.memories
      : []

  const frenzyRecord = {
    id:
      `${trigger.id}-${Date.now()}`,

    type:
      trigger.type ??
      'rage',

    severity,

    trigger:
      trigger.id,

    remembered:
      outcome.remembered !==
      false,

    startedAtGameTime:
      startTime,

    endedAtGameTime:
      endTime,

    durationMinutes,

    outcomeId:
      outcome.id,

    outcomeTitle:
      outcome.title,

    memories,

    timestamp:
      new Date()
        .toISOString(),
  }

  const updatedFlags = {
    ...(game.flags ?? {}),

    ...(outcome.flags ?? {}),

    frenzyOccurred:
      true,

    masqueradeRisk:
      oldMasqueradeRisk +
      masqueradeRiskDelta,
  }

  if (
    severity === 'critical'
  ) {
    updatedFlags.violentFrenzyOccurred =
      true
  }

  if (
    outcome.humanityCheckRequired
  ) {
    updatedFlags.humanityCheckRequired =
      true
  }

  updatedGame = {
    ...updatedGame,

    flags:
      updatedFlags,

    beast: {
      ...(game.beast ?? {}),

      frenzy: false,

      severe:
        severity ===
        'critical',

      cause:
        trigger.id,

      lastFrenzy:
        frenzyRecord,

      pendingAftermath: {
        outcomeId:
          outcome.id,

        title:
          outcome.title,

        severity,

        frenzyType:
          trigger.type ??
          'rage',

        durationMinutes,

        startTime,

        endTime,

        location:
          outcome.location ??
          game.world?.location,

        narration:
          outcome.narration ??
          [],

        memories,

        remembered:
          outcome.remembered !==
          false,

        endScene:
  outcome.endScene ??
  trigger.endScene ??
  trigger.successScene ??
  game?.story?.scene ??
  null,

        flags:
          outcome.flags ??
          {},
      },
    },

    lastFrenzyRoll:
      roll,

    history: [
      ...(game.history ?? []),

      {
        type:
          'frenzy',

        trigger:
          trigger.id,

        frenzyType:
          trigger.type ??
          'rage',

        severity,

        dice:
          roll.dice,

        successes:
          roll.successes,

        result:
          roll.result,

        durationMinutes,

        outcome:
          outcome.id,

        startedAtGameTime:
          startTime,

        endedAtGameTime:
          endTime,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return updatedGame
}

export function finishFrenzyAftermath(
  game
) {
  const aftermath =
    game?.beast
      ?.pendingAftermath

  if (!aftermath) {
    return game
  }

  /*
    ========================================
    CENA DE RETORNO
    ========================================

    Saves antigos podem ter um
    pendingAftermath sem endScene.

    Nesse caso, permanecemos na cena
    em que o personagem já está.
  */

  const endScene =
    aftermath.endScene ??
    game?.story?.scene ??
    null

  if (!endScene) {
    return {
      ...game,

      beast: {
        ...(game.beast ?? {}),

        frenzy: false,

        pendingAftermath:
          null,
      },
    }
  }

  return {
    ...game,

    story: {
      ...(game.story ?? {}),

      previousScene:
        game.story?.scene,

      scene:
        endScene,
    },

    beast: {
      ...(game.beast ?? {}),

      frenzy: false,

      pendingAftermath:
        null,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'frenzy-aftermath-finished',

        endScene,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}