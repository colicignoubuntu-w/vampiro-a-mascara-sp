/* ==========================================
   SISTEMA DE HUMANIDADE

   A Humanidade representa o quanto
   o vampiro ainda mantém empatia,
   consciência moral e ligação com
   sua antiga natureza humana.
========================================== */

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  )
}

/* ==========================================
   TIPOS DE TRANSGRESSÃO

   severity:
   1 = pequena
   2 = moderada
   3 = séria
   4 = grave
   5 = monstruosa

   deliberate:
   foi uma escolha consciente?

   automaticLoss:
   situações excepcionais onde queremos
   perda direta por decisão narrativa.
========================================== */

export const humanityTransgressions = {
  selfishCruelty: {
    id: 'selfishCruelty',

    label:
      'Crueldade egoísta',

    severity: 1,

    deliberate: true,

    baseDifficulty: 6,
  },

  theft: {
    id: 'theft',

    label:
      'Roubo',

    severity: 1,

    deliberate: true,

    baseDifficulty: 6,
  },

  seriousInjury: {
    id: 'seriousInjury',

    label:
      'Ferir gravemente alguém',

    severity: 2,

    deliberate: true,

    baseDifficulty: 7,
  },

  accidentalSeriousInjury: {
    id:
      'accidentalSeriousInjury',

    label:
      'Ferimento grave acidental',

    severity: 2,

    deliberate: false,

    baseDifficulty: 6,
  },

  accidentalKilling: {
    id:
      'accidentalKilling',

    label:
      'Morte acidental',

    severity: 3,

    deliberate: false,

    baseDifficulty: 8,
  },

  recklessKilling: {
    id:
      'recklessKilling',

    label:
      'Morte por imprudência',

    severity: 4,

    deliberate: false,

    baseDifficulty: 8,
  },

  intentionalKilling: {
    id:
      'intentionalKilling',

    label:
      'Homicídio intencional',

    severity: 4,

    deliberate: true,

    baseDifficulty: 8,
  },

  murderForConvenience: {
    id:
      'murderForConvenience',

    label:
      'Matar por conveniência',

    severity: 5,

    deliberate: true,

    baseDifficulty: 9,
  },

  torture: {
    id: 'torture',

    label:
      'Tortura deliberada',

    severity: 5,

    deliberate: true,

    baseDifficulty: 9,
  },

  deliberateAtrocity: {
    id:
      'deliberateAtrocity',

    label:
      'Atrocidade deliberada',

    severity: 5,

    deliberate: true,

    baseDifficulty: 9,

    automaticLoss: true,
  },
}

/* ==========================================
   HISTÓRICO MORAL

   Serve para sabermos se é a primeira
   vez que o personagem faz algo.

   Isso permite exatamente:

   primeira morte acidental
   ≠
   quinta morte acidental.
========================================== */

export function getTransgressionCount(
  game,
  transgressionId
) {
  const history =
    game.morality
      ?.transgressions ??
    []

  return history.filter(
    (entry) =>
      entry.transgressionId ===
      transgressionId
  ).length
}

/* ==========================================
   DIFICULDADE DE DEGENERAÇÃO
========================================== */

export function calculateDegenerationDifficulty(
  game,
  transgression
) {
  const humanity =
    game.humanity
      ?.current ?? 7

  const previousCount =
    getTransgressionCount(
      game,
      transgression.id
    )

  let difficulty =
    transgression
      .baseDifficulty ??
    8

  /*
    HUMANIDADE ALTA

    Uma pessoa ainda muito humana
    possui uma consciência forte.

    Ela sente mais culpa.
  */

  if (
    humanity >= 8
  ) {
    difficulty += 1
  }

  /*
    REPETIÇÃO

    A primeira vez pode destruir
    emocionalmente o personagem.

    Com repetição ele começa a
    racionalizar e endurecer.

    Isso aumenta o risco de degeneração.
  */

  if (
    previousCount >= 1
  ) {
    difficulty += 1
  }

  if (
    previousCount >= 3
  ) {
    difficulty += 1
  }

  /*
    PRIMEIRA MORTE ACIDENTAL

    O personagem realmente não queria
    aquilo.

    Damos uma pequena proteção narrativa
    na primeira ocorrência.
  */

  if (
    transgression.id ===
      'accidentalKilling' &&
    previousCount === 0
  ) {
    difficulty -= 1
  }

  return clamp(
    difficulty,
    4,
    10
  )
}

/* ==========================================
   TESTE DE CONSCIÊNCIA
========================================== */

export function rollDegeneration(
  game,
  transgressionId
) {
  const transgression =
    humanityTransgressions[
      transgressionId
    ]

  if (!transgression) {
    throw new Error(
      `Transgressão inexistente: ${transgressionId}`
    )
  }

  const conscience =
    game.virtues
      ?.conscience ?? 1

  const difficulty =
    calculateDegenerationDifficulty(
      game,
      transgression
    )

  /*
    Algumas decisões extremamente
    monstruosas podem gerar perda
    automática configurada pela história.
  */

  if (
    transgression
      .automaticLoss
  ) {
    return {
      type:
        'degeneration',

      transgression,

      conscience,

      difficulty,

      dice: [],

      rawSuccesses: 0,

      ones: 0,

      successes: 0,

      result:
        'automaticLoss',

      humanityLost: 1,
    }
  }

  const dice =
    Array.from({
      length:
        Math.max(
          1,
          conscience
        ),
    }).map(
      () => rollD10()
    )

  const rawSuccesses =
    dice.filter(
      (die) =>
        die >=
        difficulty
    ).length

  const ones =
    dice.filter(
      (die) =>
        die === 1
    ).length

  const successes =
    Math.max(
      0,
      rawSuccesses -
        ones
    )

  let result =
    'failure'

  let humanityLost = 1

  if (
    successes > 0
  ) {
    result =
      'remorse'

    humanityLost = 0
  } else if (
    ones > 0 &&
    rawSuccesses === 0
  ) {
    result =
      'botch'

    humanityLost = 1
  }

  return {
    type:
      'degeneration',

    transgression,

    conscience,

    difficulty,

    dice,

    rawSuccesses,

    ones,

    successes,

    result,

    humanityLost,
  }
}

/* ==========================================
   APLICAR RESULTADO
========================================== */

export function applyDegenerationResult(
  game,
  roll
) {
  const currentHumanity =
    game.humanity
      ?.current ?? 7

  const loss =
    roll.humanityLost ??
    0

  const newHumanity =
    Math.max(
      0,
      currentHumanity -
        loss
    )

  const entry = {
    type:
      'morality',

    transgressionId:
      roll.transgression.id,

    transgressionLabel:
      roll.transgression.label,

    result:
      roll.result,

    humanityBefore:
      currentHumanity,

    humanityAfter:
      newHumanity,

    humanityLost:
      loss,

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    ...game,

    humanity: {
      ...game.humanity,

      current:
        newHumanity,
    },

    morality: {
      ...(game.morality ??
        {}),

      remorse:
        roll.result ===
        'remorse',

      lastTransgression:
        entry,

      transgressions: [
        ...(game.morality
          ?.transgressions ??
          []),

        entry,
      ],
    },

    history: [
      ...(game.history ??
        []),

      entry,
    ],
  }
}

/* ==========================================
   PERDA DIRETA DE HUMANIDADE

   Para escolhas explicitamente
   configuradas pela história.
========================================== */

export function loseHumanity(
  game,
  amount = 1,
  reason = 'Ação desumana'
) {
  const current =
    game.humanity
      ?.current ?? 7

  const safeAmount =
    Math.max(
      0,
      Number(amount) || 0
    )

  const newValue =
    Math.max(
      0,
      current -
        safeAmount
    )

  const entry = {
    type:
      'humanity-loss',

    reason,

    humanityBefore:
      current,

    humanityAfter:
      newValue,

    humanityLost:
      safeAmount,

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    ...game,

    humanity: {
      ...game.humanity,

      current:
        newValue,
    },

    history: [
      ...(game.history ??
        []),

      entry,
    ],
  }
}

/* ==========================================
   HUMANIDADE E APARÊNCIA SOCIAL
========================================== */

export function getHumanityState(
  game
) {
  const humanity =
    game.humanity
      ?.current ?? 7

  if (
    humanity >= 8
  ) {
    return {
      level:
        'human',

      label:
        'Muito humano',

      mortalSocialPenalty:
        0,

      intimidationBonus:
        0,
    }
  }

  if (
    humanity >= 6
  ) {
    return {
      level:
        'normal',

      label:
        'Humano',

      mortalSocialPenalty:
        0,

      intimidationBonus:
        0,
    }
  }

  if (
    humanity >= 4
  ) {
    return {
      level:
        'cold',

      label:
        'Frio e inquietante',

      mortalSocialPenalty:
        -1,

      intimidationBonus:
        1,
    }
  }

  if (
    humanity >= 2
  ) {
    return {
      level:
        'predatory',

      label:
        'Predatório',

      mortalSocialPenalty:
        -2,

      intimidationBonus:
        2,
    }
  }

  return {
    level:
      'monstrous',

    label:
      'Profundamente inumano',

    mortalSocialPenalty:
      -3,

    intimidationBonus:
      2,
  }
}