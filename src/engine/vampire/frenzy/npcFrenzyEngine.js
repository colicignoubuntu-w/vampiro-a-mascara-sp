function safeNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function rollD10() {
  return Math.floor(Math.random() * 10) + 1
}

function rollPool(pool, difficulty) {
  const amount = Math.max(1, safeNumber(pool, 1))
  const diff = clamp(safeNumber(difficulty, 6), 2, 10)
  const dice = Array.from({ length: amount }, () => rollD10())

  let rawSuccesses = 0
  let ones = 0

  for (const die of dice) {
    if (die >= diff) rawSuccesses += 1
    if (die === 1) ones += 1
  }

  const net = rawSuccesses - ones

  if (net > 0) {
    return {
      result: 'success',
      successes: net,
      rawSuccesses,
      ones,
      dice,
      difficulty: diff,
    }
  }

  if (rawSuccesses === 0 && ones > 0) {
    return {
      result: 'botch',
      successes: 0,
      rawSuccesses: 0,
      ones,
      dice,
      difficulty: diff,
    }
  }

  return {
    result: 'failure',
    successes: 0,
    rawSuccesses,
    ones,
    dice,
    difficulty: diff,
  }
}

function isVampireEnemy(combat) {
  return Boolean(
    combat?.enemy?.vampire ||
    combat?.enemy?.type === 'vampire'
  )
}

function getVirtue(combat, key, fallback = 3) {
  return Math.max(
    1,
    safeNumber(
      combat?.enemy?.virtues?.[key] ??
      combat?.enemy?.[key],
      fallback
    )
  )
}

export function getNpcFrenzyState(combat) {
  return combat?.enemy?.status?.frenzy ?? null
}

export function isNpcInFrenzy(combat) {
  return Boolean(getNpcFrenzyState(combat)?.active)
}

export function triggerNpcFrenzy({
  combat,
  triggerType,
  severity = 1,
  source = null,
}) {
  if (!isVampireEnemy(combat)) {
    return {
      combat,
      enteredFrenzy: false,
      roll: null,
      log: [],
    }
  }

  const safeSeverity = clamp(safeNumber(severity, 1), 1, 5)

  const fear =
    triggerType === 'fear' ||
    triggerType === 'fire' ||
    triggerType === 'sunlight'

  const virtue = fear ? 'courage' : 'selfControl'

  let difficulty = 6

  if (triggerType === 'fire') difficulty = 8
  else if (triggerType === 'sunlight') difficulty = 9
  else if (triggerType === 'fear') difficulty = 7
  else if (triggerType === 'madness') difficulty = 7 + Math.min(2, safeSeverity - 1)
  else if (triggerType === 'pain') difficulty = 5 + Math.min(3, safeSeverity)
  else if (triggerType === 'hunger') difficulty = 8
  else if (triggerType === 'provocation') difficulty = 5 + safeSeverity

  difficulty = clamp(difficulty, 3, 10)

  const pool = getVirtue(combat, virtue, 3)
  const roll = {
    ...rollPool(pool, difficulty),
    pool,
    virtue,
    triggerType,
  }

  if (roll.result === 'success') {
    return {
      combat,
      enteredFrenzy: false,
      roll,
      log: [
        {
          type: 'frenzy-resisted',
          text: `${combat.enemy.name} resiste à Besta e mantém o controle.`,
        },
      ],
    }
  }

  const botch = roll.result === 'botch'
  const type = fear ? 'fear' : 'violent'

  const frenzy = {
    active: true,
    type,
    trigger: triggerType,
    source,
    botch,
    roundsRemaining: botch ? 4 : Math.max(2, 1 + safeSeverity),
    attackBonus: type === 'violent' ? (botch ? 3 : 2) : 0,
    cannotUseSocialPowers: true,
    mustAttack: type === 'violent',
    mustEscape: type === 'fear',
  }

  const updatedCombat = {
    ...combat,
    enemy: {
      ...combat.enemy,
      status: {
        ...(combat.enemy?.status ?? {}),
        dominated: false,
        madness: false,
        skipActions: 0,
        frenzy,
      },
    },
  }

  return {
    combat: updatedCombat,
    enteredFrenzy: true,
    roll,
    log: [
      {
        type: botch ? 'frenzy-botch' : 'frenzy',
        text:
          type === 'fear'
            ? (
                botch
                  ? `${combat.enemy.name} perde completamente o controle diante do terror e foge em pânico.`
                  : `${combat.enemy.name} entra em Rötschreck.`
              )
            : (
                botch
                  ? `${combat.enemy.name} entrega-se completamente à Besta em um frenesi brutal.`
                  : `${combat.enemy.name} entra em frenesi de violência.`
              ),
      },
    ],
  }
}

export function processNpcFrenzyTurn(combat) {
  const frenzy = getNpcFrenzyState(combat)

  if (!frenzy?.active) {
    return {
      combat,
      active: false,
      type: null,
      forceEscape: false,
      attackBonus: 0,
      log: [],
    }
  }

  return {
    combat,
    active: true,
    type: frenzy.type,
    forceEscape: frenzy.type === 'fear',
    attackBonus:
      frenzy.type === 'violent'
        ? Math.max(1, safeNumber(frenzy.attackBonus, 2))
        : 0,
    log: [
      {
        type: 'frenzy',
        text:
          frenzy.type === 'fear'
            ? `${combat.enemy.name} está em Rötschreck e tenta fugir.`
            : `${combat.enemy.name} está dominado pela Besta e ataca sem hesitar.`,
      },
    ],
  }
}

export function advanceNpcFrenzy(combat) {
  const frenzy = getNpcFrenzyState(combat)

  if (!frenzy?.active) {
    return {
      combat,
      ended: false,
      log: [],
    }
  }

  const remaining =
    Math.max(0, safeNumber(frenzy.roundsRemaining, 1) - 1)

  if (remaining <= 0) {
    const status = { ...(combat.enemy?.status ?? {}) }
    delete status.frenzy

    return {
      combat: {
        ...combat,
        enemy: {
          ...combat.enemy,
          status,
        },
      },
      ended: true,
      log: [
        {
          type: 'frenzy-ended',
          text: `${combat.enemy.name} recupera lentamente o controle da própria Besta.`,
        },
      ],
    }
  }

  return {
    combat: {
      ...combat,
      enemy: {
        ...combat.enemy,
        status: {
          ...(combat.enemy?.status ?? {}),
          frenzy: {
            ...frenzy,
            roundsRemaining: remaining,
          },
        },
      },
    },
    ended: false,
    log: [],
  }
}


export function getAutomaticNpcFrenzyTrigger(
  combat
) {
  if (
    !combat ||
    isNpcInFrenzy(
      combat
    ) ||
    !(
      combat?.enemy?.vampire ||
      combat?.enemy?.type ===
        'vampire'
    )
  ) {
    return null
  }

  const blood =
    Math.max(
      0,
      safeNumber(
        combat?.enemy
          ?.blood
          ?.current,
        6
      )
    )

  const maximumBlood =
    Math.max(
      1,
      safeNumber(
        combat?.enemy
          ?.blood
          ?.maximum,
        10
      )
    )

  /*
    ========================================
    FOGO / INCÊNDIO

    O combate pode informar isso por:

    combat.environment.fire
    combat.flags.firePresent
    combat.flags.openFlame
    ========================================
  */

  const firePresent =
    Boolean(
      combat?.environment
        ?.fire ||
      combat?.flags
        ?.firePresent ||
      combat?.flags
        ?.openFlame
    )

  if (firePresent) {
    return {
      triggerType:
        'fire',

      severity:
        Math.max(
          2,
          safeNumber(
            combat?.environment
              ?.fireSeverity ??
            combat?.flags
              ?.fireSeverity,
            2
          )
        ),

      source:
        'combat-environment-fire',
    }
  }

  /*
    ========================================
    LUZ SOLAR
    ========================================
  */

  if (
    combat?.environment
      ?.sunlight ||
    combat?.flags
      ?.sunlight
  ) {
    return {
      triggerType:
        'sunlight',

      severity: 5,

      source:
        'combat-environment-sunlight',
    }
  }

  /*
    ========================================
    PROVOCAÇÃO

    Pode ser marcada por narrativa ou
    Disciplina usando:

    enemy.status.provoked = true
    enemy.status.provocationLevel = 1..5
    ========================================
  */

  if (
    combat?.enemy
      ?.status
      ?.provoked
  ) {
    return {
      triggerType:
        'provocation',

      severity:
        Math.max(
          1,
          safeNumber(
            combat.enemy
              .status
              .provocationLevel,
            2
          )
        ),

      source:
        combat.enemy
          .status
          .provokedBy ??
        'player',
    }
  }

  /*
    ========================================
    FOME

    20% ou menos da reserva:
    teste de frenesi.

    10% ou menos:
    gatilho mais severo.
    ========================================
  */

  const ratio =
    blood /
    maximumBlood

  if (
    ratio <= 0.1
  ) {
    return {
      triggerType:
        'hunger',

      severity: 5,

      source:
        'critical-hunger',
    }
  }

  if (
    ratio <= 0.2
  ) {
    return {
      triggerType:
        'hunger',

      severity: 3,

      source:
        'severe-hunger',
    }
  }

  /*
    ========================================
    CHEIRO / VISÃO DE SANGUE

    O combate pode informar:

    combat.flags.bloodScent
    combat.flags.visibleBlood

    Isso só dispara quando o vampiro
    também está com pouca vitae.
    ========================================
  */

  const bloodStimulus =
    Boolean(
      combat?.flags
        ?.bloodScent ||
      combat?.flags
        ?.visibleBlood
    )

  if (
    bloodStimulus &&
    ratio <= 0.35
  ) {
    return {
      triggerType:
        'hunger',

      severity: 2,

      source:
        'blood-stimulus',
    }
  }

  /*
    ========================================
    OUTRO VAMPIRO EM FRENESI

    A narrativa pode marcar:

    combat.flags.witnessedFrenzy
    ========================================
  */

  if (
    combat?.flags
      ?.witnessedFrenzy
  ) {
    return {
      triggerType:
        'provocation',

      severity: 2,

      source:
        'witnessed-frenzy',
    }
  }

  return null
}

export function checkAutomaticNpcFrenzy(
  combat
) {
  const trigger =
    getAutomaticNpcFrenzyTrigger(
      combat
    )

  if (!trigger) {
    return {
      combat,

      trigger: null,

      roll: null,

      enteredFrenzy:
        false,

      log: [],
    }
  }

  return triggerNpcFrenzy({
    combat,

    ...trigger,
  })
}

export function getNpcFrenzyPreferredAttack(
  combat
) {
  const frenzy =
    getNpcFrenzyState(
      combat
    )

  if (
    !frenzy?.active ||
    frenzy.type !==
      'violent'
  ) {
    return null
  }

  const enemy =
    combat?.enemy ??
    {}

  const vampire =
    Boolean(
      enemy.vampire ||
      enemy.type ===
        'vampire'
    )

  if (!vampire) {
    return null
  }

  const blood =
    Math.max(
      0,
      safeNumber(
        enemy?.blood
          ?.current,
        6
      )
    )

  const maxBlood =
    Math.max(
      1,
      safeNumber(
        enemy?.blood
          ?.maximum,
        10
      )
    )

  const ratio =
    blood /
    maxBlood

  /*
    Fome intensa durante frenesi:
    prioridade absoluta para a mordida.
  */

  if (
    ratio <= 0.3
  ) {
    return 'bite'
  }

  /*
    Frenesi violento comum:
    prefere ataques físicos diretos.
  */

  return 'fists'
}

export function shouldCheckNpcFrenzyAfterDamage({
  combat,
  damageType,
  inflicted,
}) {
  if (!isVampireEnemy(combat) || isNpcInFrenzy(combat)) {
    return null
  }

  const amount = Math.max(0, safeNumber(inflicted, 0))

  if (amount <= 0) return null

  if (damageType === 'aggravated') {
    return {
      triggerType: 'pain',
      severity: Math.min(5, amount + 2),
      source: 'aggravated-damage',
    }
  }

  if (amount >= 3) {
    return {
      triggerType: 'pain',
      severity: Math.min(5, amount),
      source: 'heavy-damage',
    }
  }

  return null
}

export default {
  getNpcFrenzyState,
  isNpcInFrenzy,
  triggerNpcFrenzy,
  processNpcFrenzyTurn,
  advanceNpcFrenzy,

  getAutomaticNpcFrenzyTrigger,
  checkAutomaticNpcFrenzy,
  getNpcFrenzyPreferredAttack,

  shouldCheckNpcFrenzyAfterDamage,
}