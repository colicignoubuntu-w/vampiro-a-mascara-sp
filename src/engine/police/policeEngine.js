import {
  addMinutes,
} from '../../utils/gameState'

import {
  processMasqueradeTime,
} from '../consequences/consequenceEngine'
import {
  notifyDiceRoll,
} from '../dice/diceRollEvents'

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

function rollD10() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function rollPool(
  pool,
  difficulty
) {
  notifyDiceRoll(
    'police-test'
  )

  const safePool =
    Math.max(
      1,
      Number(pool) || 1
    )

  const safeDifficulty =
    clamp(
      Number(difficulty) || 6,
      2,
      10
    )

  const dice =
    Array.from({
      length:
        safePool,
    }).map(
      () => rollD10()
    )

  const rawSuccesses =
    dice.filter(
      (die) =>
        die >=
        safeDifficulty
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

  if (
    successes > 0
  ) {
    result =
      'success'
  } else if (
    ones > 0 &&
    rawSuccesses === 0
  ) {
    result =
      'botch'
  }

  return {
    pool:
      safePool,

    difficulty:
      safeDifficulty,

    dice,

    rawSuccesses,

    ones,

    successes,

    result,
  }
}

/* ==========================================
   DISCIPLINAS

   Aceita nomes com ou sem acento para
   evitar problemas com saves antigos.
========================================== */

function getDisciplineLevel(
  game,
  possibleNames
) {
  const disciplines =
    game?.disciplines ??
    {}

  for (
    const name of possibleNames
  ) {
    const value =
      Number(
        disciplines[name] ??
        0
      )

    if (
      value > 0
    ) {
      return value
    }
  }

  return 0
}

export function getDominateLevel(
  game
) {
  return getDisciplineLevel(
    game,
    [
      'Dominação',
      'Dominacao',
      'Dominate',
    ]
  )
}

export function getObfuscateLevel(
  game
) {
  return getDisciplineLevel(
    game,
    [
      'Ofuscação',
      'Ofuscacao',
      'Obfuscate',
    ]
  )
}

/* ==========================================
   ESTADO DA POLÍCIA
========================================== */

function getPoliceAttention(
  game
) {
  return Number(
    game?.masquerade
      ?.policeAttention ??
      0
  )
}

function getSuspicion(
  game
) {
  return Number(
    game?.masquerade
      ?.suspicion ??
      0
  )
}

function getViolations(
  game
) {
  return Number(
    game?.masquerade
      ?.violations ??
      0
  )
}

function getBloodSeverity(
  game
) {
  const body =
    Number(
      game?.appearance
        ?.bodyBlood ?? 0
    )

  const clothes =
    Number(
      game?.appearance
        ?.clothesBlood ?? 0
    )

  return Math.max(
    body,
    clothes
  )
}

/* ==========================================
   DIFICULDADE BASE DA ABORDAGEM
========================================== */

function getBaseDifficulty(
  game,
  event
) {
  let difficulty = 6

  if (
    event?.type ===
    'policeRecognition'
  ) {
    difficulty += 1
  }

  if (
    event?.type ===
    'policeInvestigation'
  ) {
    difficulty += 2
  }

  const attention =
    getPoliceAttention(
      game
    )

  if (
    attention >= 6
  ) {
    difficulty += 1
  }

  if (
    attention >= 9
  ) {
    difficulty += 1
  }

  return clamp(
    difficulty,
    4,
    10
  )
}

/* ==========================================
   OPÇÕES DISPONÍVEIS
========================================== */

export function getPoliceChoices(
  game,
  event
) {
  const choices = [
    {
      id:
        'cooperate',

      label:
        'Cooperar e tentar parecer calmo',

      description:
        'Carisma + Etiqueta',

      type:
        'normal',
    },

    {
      id:
        'lie',

      label:
        'Inventar uma explicação',

      description:
        'Manipulação + Lábia',

      type:
        'normal',
    },

    {
      id:
        'analyze',

      label:
        'Tentar entender o quanto eles sabem',

      description:
        'Raciocínio + Manha',

      type:
        'analyze',
    },

    {
      id:
        'intimidate',

      label:
        'Pressionar os policiais',

      description:
        'Manipulação + Intimidação',

      type:
        'normal',
    },
  ]

  const obfuscate =
    getObfuscateLevel(
      game
    )

  const dominate =
    getDominateLevel(
      game
    )

  if (
    obfuscate > 0
  ) {
    choices.push({
      id:
        'obfuscate',

      label:
        'Usar Ofuscação',

      description:
        `Ofuscação ${obfuscate}`,

      type:
        'discipline',
    })
  }

  if (
    dominate > 0
  ) {
    choices.push({
      id:
        'dominate',

      label:
        'Usar Dominação',

      description:
        `Dominação ${dominate}`,

      type:
        'discipline',
    })
  }

  choices.push({
    id:
      'flee',

    label:
      'Tentar fugir',

    description:
      'Destreza + Esportes',

    type:
      'escape',
  })

  return choices
}

/* ==========================================
   CRIAR TESTE
========================================== */

function buildPoliceTest(
  game,
  event,
  choice
) {
  const baseDifficulty =
    getBaseDifficulty(
      game,
      event
    )

  let attributeLabel =
    'Carisma'

  let abilityLabel =
    'Etiqueta'

  let attributeValue =
    game?.attributes
      ?.social
      ?.charisma ?? 1

  let abilityValue =
    game?.abilities
      ?.etiquette ?? 0

  let bonusDice = 0

  let difficulty =
    baseDifficulty

  if (
    choice.id ===
    'lie'
  ) {
    attributeLabel =
      'Manipulação'

    abilityLabel =
      'Lábia'

    attributeValue =
      game?.attributes
        ?.social
        ?.manipulation ?? 1

    abilityValue =
      game?.abilities
        ?.subterfuge ?? 0
  }

  if (
    choice.id ===
    'analyze'
  ) {
    attributeLabel =
      'Raciocínio'

    abilityLabel =
      'Manha'

    attributeValue =
      game?.attributes
        ?.mental
        ?.wits ?? 1

    abilityValue =
      game?.abilities
        ?.streetwise ?? 0

    difficulty -= 1
  }

  if (
    choice.id ===
    'intimidate'
  ) {
    attributeLabel =
      'Manipulação'

    abilityLabel =
      'Intimidação'

    attributeValue =
      game?.attributes
        ?.social
        ?.manipulation ?? 1

    abilityValue =
      game?.abilities
        ?.intimidation ?? 0

    /*
      Baixa Humanidade ajuda
      o personagem a parecer
      naturalmente ameaçador.
    */

    const humanity =
      Number(
        game?.humanity
          ?.current ?? 7
      )

    if (
      humanity <= 3
    ) {
      difficulty -= 1
    }
  }

  if (
    choice.id ===
    'flee'
  ) {
    attributeLabel =
      'Destreza'

    abilityLabel =
      'Esportes'

    attributeValue =
      game?.attributes
        ?.physical
        ?.dexterity ?? 1

    abilityValue =
      game?.abilities
        ?.athletics ?? 0

    difficulty += 1
  }

  if (
    choice.id ===
    'obfuscate'
  ) {
    attributeLabel =
      'Raciocínio'

    abilityLabel =
      'Furtividade'

    attributeValue =
      game?.attributes
        ?.mental
        ?.wits ?? 1

    abilityValue =
      game?.abilities
        ?.stealth ?? 0

    bonusDice =
      getObfuscateLevel(
        game
      )

    difficulty -= 1
  }

  if (
    choice.id ===
    'dominate'
  ) {
    attributeLabel =
      'Manipulação'

    abilityLabel =
      'Liderança'

    attributeValue =
      game?.attributes
        ?.social
        ?.manipulation ?? 1

    abilityValue =
      game?.abilities
        ?.leadership ?? 0

    bonusDice =
      getDominateLevel(
        game
      )
  }

  /*
    Estar coberto de sangue
    torna explicações normais
    muito menos convincentes.
  */

  const bloodSeverity =
    getBloodSeverity(
      game
    )

  if (
    bloodSeverity >= 2 &&
    [
      'cooperate',
      'lie',
    ].includes(
      choice.id
    )
  ) {
    difficulty += 1
  }

  if (
    bloodSeverity >= 3 &&
    [
      'cooperate',
      'lie',
    ].includes(
      choice.id
    )
  ) {
    difficulty += 1
  }

  return {
    attributeLabel,

    abilityLabel,

    attributeValue,

    abilityValue,

    bonusDice,

    pool:
      Math.max(
        1,
        attributeValue +
          abilityValue +
          bonusDice
      ),

    difficulty:
      clamp(
        difficulty,
        2,
        10
      ),
  }
}

/* ==========================================
   TEMPO DA AÇÃO
========================================== */

function getActionMinutes(
  choiceId
) {
  if (
    choiceId ===
    'analyze'
  ) {
    return 2
  }

  if (
    choiceId ===
    'flee'
  ) {
    return 3
  }

  return 5
}

/* ==========================================
   ALTERAR TEMPO
========================================== */

function advancePoliceTime(
  game,
  minutes
) {
  let updatedGame = {
    ...game,

    world:
      addMinutes(
        game.world,
        minutes
      ),
  }

  updatedGame =
    processMasqueradeTime(
      updatedGame,
      minutes
    )

  return updatedGame
}

/* ==========================================
   TESTE
========================================== */

export function resolvePoliceChoice(
  game,
  event,
  choice
) {
  const test =
    buildPoliceTest(
      game,
      event,
      choice
    )

  const roll =
    rollPool(
      test.pool,
      test.difficulty
    )

  const completeRoll = {
    ...roll,
    ...test,
  }

  let updatedGame =
    advancePoliceTime(
      game,
      getActionMinutes(
        choice.id
      )
    )

  const outcome =
    applyPoliceOutcome(
      updatedGame,
      event,
      choice,
      completeRoll
    )

  return {
    ...outcome,

    roll:
      completeRoll,

    choice,
  }
}

/* ==========================================
   APLICAR RESULTADO
========================================== */

function applyPoliceOutcome(
  game,
  event,
  choice,
  roll
) {
  const currentPolice =
    getPoliceAttention(
      game
    )

  const currentSuspicion =
    getSuspicion(
      game
    )

  const currentViolations =
    getViolations(
      game
    )

  let policeChange = 0
  let suspicionChange = 0
  let violationChange = 0

  let encounterFinished = true

  let detained = false
  let escaped = false

  let intelligence = null

  /* ======================================
     ANALISAR A SITUAÇÃO

     Não encerra automaticamente
     a abordagem.

     O jogador recebe informação e
     poderá escolher outra ação.
  ====================================== */

  if (
    choice.id ===
    'analyze'
  ) {
    encounterFinished =
      false

    if (
      roll.result ===
      'success'
    ) {
      intelligence =
        getPoliceIntelligence(
          game,
          event
        )
    }

    if (
      roll.result ===
      'failure'
    ) {
      suspicionChange += 1
    }

    if (
      roll.result ===
      'botch'
    ) {
      suspicionChange += 1
      policeChange += 1
    }
  }

  /* ======================================
     COOPERAR
  ====================================== */

  if (
    choice.id ===
    'cooperate'
  ) {
    if (
      roll.result ===
      'success'
    ) {
      policeChange -= 1
    }

    if (
      roll.result ===
      'failure'
    ) {
      policeChange += 1
    }

    if (
      roll.result ===
      'botch'
    ) {
      policeChange += 2
      suspicionChange += 1

      detained = true
    }
  }

  /* ======================================
     MENTIR
  ====================================== */

  if (
    choice.id ===
    'lie'
  ) {
    if (
      roll.result ===
      'success'
    ) {
      /*
        Sai da abordagem sem
        aumentar imediatamente.
      */
    }

    if (
      roll.result ===
      'failure'
    ) {
      policeChange += 2
      suspicionChange += 1
    }

    if (
      roll.result ===
      'botch'
    ) {
      policeChange += 3
      suspicionChange += 2

      detained = true
    }
  }

  /* ======================================
     INTIMIDAR POLICIAIS

     Mesmo funcionando, isso cria
     atenção futura.
  ====================================== */

  if (
    choice.id ===
    'intimidate'
  ) {
    if (
      roll.result ===
      'success'
    ) {
      policeChange += 1
      suspicionChange += 1
    }

    if (
      roll.result ===
      'failure'
    ) {
      policeChange += 3
      suspicionChange += 1
    }

    if (
      roll.result ===
      'botch'
    ) {
      policeChange += 4
      suspicionChange += 2

      detained = true
    }
  }

  /* ======================================
     FUGIR
  ====================================== */

  if (
    choice.id ===
    'flee'
  ) {
    if (
      roll.result ===
      'success'
    ) {
      policeChange += 2
      suspicionChange += 1

      escaped = true
    }

    if (
      roll.result ===
      'failure'
    ) {
      policeChange += 3
      suspicionChange += 1

      detained = true
    }

    if (
      roll.result ===
      'botch'
    ) {
      policeChange += 5
      suspicionChange += 2

      detained = true
    }
  }

  /* ======================================
     OFUSCAÇÃO

     Funciona muito bem contra mortais,
     mas uma falha pode criar uma
     violação séria da Máscara.
  ====================================== */

  if (
    choice.id ===
    'obfuscate'
  ) {
    if (
      roll.result ===
      'success'
    ) {
      policeChange += 1

      escaped = true
    }

    if (
      roll.result ===
      'failure'
    ) {
      policeChange += 2
      suspicionChange += 2
      violationChange += 1
    }

    if (
      roll.result ===
      'botch'
    ) {
      policeChange += 4
      suspicionChange += 3
      violationChange += 1

      detained = true
    }
  }

  /* ======================================
     DOMINAÇÃO

     Um sucesso resolve a situação,
     mas uma falha diante de policiais
     pode ser perigosa para a Máscara.
  ====================================== */

  if (
    choice.id ===
    'dominate'
  ) {
    if (
      roll.result ===
      'success'
    ) {
      policeChange -= 1
    }

    if (
      roll.result ===
      'failure'
    ) {
      policeChange += 2
      suspicionChange += 2
      violationChange += 1
    }

    if (
      roll.result ===
      'botch'
    ) {
      policeChange += 4
      suspicionChange += 3
      violationChange += 1

      detained = true
    }
  }

  const newPolice =
    clamp(
      currentPolice +
        policeChange,
      0,
      10
    )

  const newSuspicion =
    clamp(
      currentSuspicion +
        suspicionChange,
      0,
      10
    )

  const newViolations =
    Math.max(
      0,
      currentViolations +
        violationChange
    )

  const flags = {
    ...(game.flags ?? {}),
  }

  if (detained) {
    flags.detainedByPolice =
      true
  }

  if (escaped) {
    flags.escapedPolice =
      true
  }

  const historyEntry = {
    type:
      'police-encounter',

    eventType:
      event?.type ??
      'police',

    choice:
      choice.id,

    result:
      roll.result,

    policeBefore:
      currentPolice,

    policeAfter:
      newPolice,

    suspicionBefore:
      currentSuspicion,

    suspicionAfter:
      newSuspicion,

    violationsBefore:
      currentViolations,

    violationsAfter:
      newViolations,

    detained,

    escaped,

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    game: {
      ...game,

      flags,

      masquerade: {
        ...(game.masquerade ??
          {}),

        suspicion:
          newSuspicion,

        policeAttention:
          newPolice,

        violations:
          newViolations,

        witnesses:
          Array.isArray(
            game.masquerade
              ?.witnesses
          )
            ? game.masquerade.witnesses
            : [],

        evidence:
          Array.isArray(
            game.masquerade
              ?.evidence
          )
            ? game.masquerade.evidence
            : [],

        exposure:
          Number(
            game.masquerade
              ?.exposure ?? 0
          ),
      },

      history: [
        ...(game.history ?? []),

        historyEntry,
      ],
    },

    result:
      roll.result,

    encounterFinished,

    detained,

    escaped,

    intelligence,

    consequences: {
      policeBefore:
        currentPolice,

      policeAfter:
        newPolice,

      suspicionBefore:
        currentSuspicion,

      suspicionAfter:
        newSuspicion,

      violationsBefore:
        currentViolations,

      violationsAfter:
        newViolations,
    },
  }
}

/* ==========================================
   O QUE MANHA + RACIOCÍNIO DESCOBRE
========================================== */

function getPoliceIntelligence(
  game,
  event
) {
  const attention =
    getPoliceAttention(
      game
    )

  const evidence =
    Array.isArray(
      game?.masquerade
        ?.evidence
    )
      ? game.masquerade.evidence.filter(
          (item) =>
            item.active !== false
        )
      : []

  if (
    event?.type ===
      'policeInvestigation' ||
    attention >= 9
  ) {
    return (
      'Isso definitivamente não é uma abordagem aleatória. Eles parecem ter uma descrição ou alguma informação anterior sobre você.'
    )
  }

  if (
    event?.type ===
      'policeRecognition' ||
    attention >= 6
  ) {
    return (
      'O policial está comparando seu rosto com alguma informação no celular. Você provavelmente já apareceu em alguma ocorrência ou descrição.'
    )
  }

  if (
    evidence.length > 0
  ) {
    return (
      'Eles não parecem saber exatamente quem você é, mas perguntas recentes ou algum registro podem ter chamado atenção.'
    )
  }

  return (
    'Parece uma abordagem de rotina. Por enquanto, eles não demonstram saber nada específico sobre você.'
  )
}

/* ==========================================
   TEXTOS DOS RESULTADOS
========================================== */

export function getPoliceResultText(
  resolution
) {
  const choiceId =
    resolution?.choice?.id

  const result =
    resolution?.result

  if (
    choiceId ===
    'analyze'
  ) {
    if (
      result ===
      'success'
    ) {
      return (
        resolution.intelligence ??
        'Você consegue interpretar a situação.'
      )
    }

    if (
      result ===
      'botch'
    ) {
      return (
        'Você observa os policiais por tempo demais. Um deles percebe e passa a prestar ainda mais atenção em você.'
      )
    }

    return (
      'Você tenta ler a situação, mas não consegue descobrir o quanto eles realmente sabem.'
    )
  }

  if (
    resolution.detained
  ) {
    return (
      'A conversa acabou. Um dos policiais manda você colocar as mãos onde ele possa vê-las. Você está sendo detido.'
    )
  }

  if (
    choiceId ===
      'cooperate' &&
    result ===
      'success'
  ) {
    return (
      'Você mantém a voz calma e responde sem oferecer mais informação do que o necessário. Depois de alguns minutos, os policiais permitem que você siga.'
    )
  }

  if (
    choiceId ===
      'lie' &&
    result ===
      'success'
  ) {
    return (
      'Sua história parece suficientemente plausível. Os policiais trocam algumas palavras e finalmente deixam você seguir.'
    )
  }

  if (
    choiceId ===
      'intimidate' &&
    result ===
      'success'
  ) {
    return (
      'Por alguma razão, os policiais hesitam e decidem não prolongar a abordagem. Mas você sabe que chamar a atenção deles dessa maneira pode ter consequências.'
    )
  }

  if (
    choiceId ===
      'flee' &&
    result ===
      'success'
  ) {
    return (
      'Você dispara antes que consigam reagir completamente e desaparece entre as ruas. Você escapou, mas agora existe um motivo muito melhor para a polícia procurar por você.'
    )
  }

  if (
    choiceId ===
      'obfuscate' &&
    result ===
      'success'
  ) {
    return (
      'A atenção dos policiais desliza para longe de você. É como se sua presença tivesse deixado de importar. Quando percebem, você já não está mais ao alcance deles.'
    )
  }

  if (
    choiceId ===
      'dominate' &&
    result ===
      'success'
  ) {
    return (
      'O olhar do policial perde por um instante a resistência. A ordem encontra espaço dentro da mente dele. Ele manda o parceiro seguir em frente.'
    )
  }

  if (
    result ===
    'botch'
  ) {
    return (
      'A situação piora de forma imediata. O comportamento dos policiais muda e você percebe que perdeu o controle da abordagem.'
    )
  }

  return (
    'Sua tentativa não funciona. Os policiais ficam ainda mais desconfiados.'
  )
}
