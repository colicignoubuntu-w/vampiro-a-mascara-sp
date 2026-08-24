function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
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
      length: safePool,
    }).map(() =>
      rollD10()
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

  if (successes > 0) {
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
   ESTADO DA MÁSCARA
========================================== */

export function getMasqueradeState(
  game
) {
  return {
    suspicion:
      Number(
        game.masquerade
          ?.suspicion ?? 0
      ),

    violations:
      Number(
        game.masquerade
          ?.violations ?? 0
      ),

    policeAttention:
      Number(
        game.masquerade
          ?.policeAttention ?? 0
      ),

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
  }
}

export function getSuspicionLabel(
  suspicion
) {
  if (suspicion <= 0) {
    return 'Nenhuma'
  }

  if (suspicion <= 2) {
    return 'Baixa'
  }

  if (suspicion <= 5) {
    return 'Moderada'
  }

  if (suspicion <= 8) {
    return 'Alta'
  }

  return 'Crítica'
}

/* ==========================================
   SANGUE VISÍVEL
========================================== */

export function getBloodSeverity(
  game
) {
  const body =
    Number(
      game.appearance
        ?.bodyBlood ?? 0
    )

  const clothes =
    Number(
      game.appearance
        ?.clothesBlood ?? 0
    )

  return Math.max(
    body,
    clothes
  )
}

/* ==========================================
   HUMANIDADE
========================================== */

function getHumanityFearModifier(
  game
) {
  const humanity =
    Number(
      game.humanity
        ?.current ?? 7
    )

  if (humanity >= 6) {
    return 0
  }

  if (humanity >= 4) {
    return 1
  }

  if (humanity >= 2) {
    return 2
  }

  return 3
}

/* ==========================================
   REAÇÃO PÚBLICA
========================================== */

export function calculatePublicReactionChance(
  game,
  location
) {
  const severity =
    getBloodSeverity(
      game
    )

  if (severity <= 0) {
    return 0
  }

  if (severity >= 3) {
    return 100
  }

  const humanityFear =
    getHumanityFearModifier(
      game
    )

  if (severity === 1) {
    return clamp(
      20 +
        humanityFear * 5,
      0,
      80
    )
  }

  let chance =
    65 +
    humanityFear * 5

  if (
    location?.type ===
      'bar' ||
    location?.type ===
      'nightclub'
  ) {
    chance += 10
  }

  if (
    location?.wealthLevel >= 4
  ) {
    chance += 10
  }

  return clamp(
    chance,
    0,
    95
  )
}

function selectReactionType(
  game,
  location
) {
  const severity =
    getBloodSeverity(
      game
    )

  const roll =
    Math.random() * 100

  if (severity === 1) {
    if (roll < 65) {
      return 'concern'
    }

    return 'avoid'
  }

  if (severity === 2) {
    if (roll < 35) {
      return 'concern'
    }

    if (roll < 60) {
      return 'phone'
    }

    if (roll < 85) {
      return 'security'
    }

    return 'police'
  }

  /*
    COBERTO DE SANGUE.
  */

  if (
    location?.type === 'bar'
  ) {
    if (roll < 35) {
      return 'phone'
    }

    if (roll < 70) {
      return 'security'
    }

    if (roll < 88) {
      return 'concern'
    }

    return 'police'
  }

  if (
    location?.type ===
    'nightclub'
  ) {
    if (roll < 40) {
      return 'security'
    }

    if (roll < 68) {
      return 'phone'
    }

    if (roll < 90) {
      return 'concern'
    }

    return 'police'
  }

  if (
    location?.wealthLevel >= 4
  ) {
    if (roll < 45) {
      return 'security'
    }

    if (roll < 70) {
      return 'phone'
    }

    return 'police'
  }

  if (roll < 45) {
    return 'phone'
  }

  if (roll < 72) {
    return 'concern'
  }

  if (roll < 88) {
    return 'security'
  }

  return 'police'
}

export function rollPublicReaction(
  game,
  location
) {
  if (
    !game ||
    !location
  ) {
    return null
  }

  const chance =
    calculatePublicReactionChance(
      game,
      location
    )

  if (chance <= 0) {
    return null
  }

  if (chance < 100) {
    const roll =
      Math.random() * 100

    if (roll >= chance) {
      return null
    }
  }

  return createReaction(
    selectReactionType(
      game,
      location
    ),
    location
  )
}

export function forcePublicReaction(
  game,
  location,
  type = 'phone'
) {
  return createReaction(
    type,
    location
  )
}

/* ==========================================
   EVENTOS
========================================== */

function createReaction(
  type,
  location
) {
  const id =
    `masquerade-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`

  if (type === 'concern') {
    return {
      id,

      type,

      title:
        'Alguém percebe o sangue',

      text:
        'Uma pessoa olha primeiro para seu rosto e depois para suas roupas ensanguentadas. Ela hesita antes de se aproximar.',

      dialogue:
        '— Cara... você está bem? Quer que eu chame uma ambulância?',

      locationId:
        location?.id ?? null,
    }
  }

  if (type === 'avoid') {
    return {
      id,

      type,

      title:
        'Olhares',

      text:
        'As pessoas começam a abrir espaço. Algumas cochicham. Outras desviam os olhos quando você percebe.',

      dialogue:
        null,

      locationId:
        location?.id ?? null,
    }
  }

  if (type === 'phone') {
    return {
      id,

      type,

      title:
        'Um celular aponta para você',

      text:
        'Uma pessoa levanta discretamente o celular. A câmera está apontada para você e para as manchas de sangue.',

      dialogue:
        '— Mano... olha isso.',

      locationId:
        location?.id ?? null,
    }
  }

  if (type === 'security') {
    return {
      id,

      type,

      title:
        'O segurança se aproxima',

      text:
        'Um segurança percebe seu estado e atravessa o salão em sua direção. Outro segurança acompanha a cena à distância.',

      dialogue:
        '— Senhor, fica onde está. O que aconteceu? Esse sangue é seu?',

      locationId:
        location?.id ?? null,
    }
  }

  return {
    id,

    type:
      'police',

    title:
      'Abordagem policial',

    text:
      'Uma viatura para próxima a você. Um dos policiais sai enquanto observa cuidadosamente o sangue em suas roupas.',

    dialogue:
      '— Boa noite. Documento. E me explica o que aconteceu.',

    locationId:
      location?.id ?? null,
  }
}

/* ==========================================
   OPÇÕES
========================================== */

export function getReactionChoices(
  event
) {
  if (
    event.type === 'avoid'
  ) {
    return [
      {
        id:
          'leave',

        label:
          'Sair do local',

        test:
          'none',
      },

      {
        id:
          'ignore',

        label:
          'Ignorar os olhares',

        test:
          'none',
      },
    ]
  }

  if (
    event.type === 'phone'
  ) {
    return [
      {
        id:
          'reassure',

        label:
          '"Foi uma briga. Está tudo bem."',

        test:
          'charismaSubterfuge',
      },

      {
        id:
          'lie',

        label:
          '"Trabalho num hospital. História longa."',

        test:
          'manipulationSubterfuge',
      },

      {
        id:
          'intimidate',

        label:
          '"Guarda esse celular. Agora."',

        test:
          'manipulationIntimidation',
      },

      {
        id:
          'leave',

        label:
          'Sair imediatamente',

        test:
          'dexterityAthletics',
      },
    ]
  }

  if (
    event.type ===
    'security'
  ) {
    return [
      {
        id:
          'reassure',

        label:
          '"Estou bem. Foi uma briga."',

        test:
          'charismaSubterfuge',
      },

      {
        id:
          'lie',

        label:
          '"Isso não é meu sangue."',

        test:
          'manipulationSubterfuge',
      },

      {
        id:
          'intimidate',

        label:
          '"Sai da minha frente."',

        test:
          'manipulationIntimidation',
      },

      {
        id:
          'leave',

        label:
          'Tentar simplesmente ir embora',

        test:
          'dexterityAthletics',
      },
    ]
  }

  if (
    event.type === 'police'
  ) {
    return [
      {
        id:
          'cooperate',

        label:
          'Cooperar e parecer calmo',

        test:
          'charismaEtiquette',
      },

      {
        id:
          'lie',

        label:
          'Inventar uma explicação',

        test:
          'manipulationSubterfuge',
      },

      {
        id:
          'intimidate',

        label:
          'Tentar intimidar os policiais',

        test:
          'manipulationIntimidation',
      },

      {
        id:
          'escape',

        label:
          'Tentar fugir',

        test:
          'dexterityAthletics',
      },
    ]
  }

  return [
    {
      id:
        'reassure',

      label:
        '"Estou bem. Não precisa chamar ninguém."',

      test:
        'charismaSubterfuge',
    },

    {
      id:
        'lie',

      label:
        '"Foi uma briga. Já acabou."',

      test:
        'manipulationSubterfuge',
    },

    {
      id:
        'leave',

      label:
        'Agradecer e sair',

      test:
        'none',
    },
  ]
}

/* ==========================================
   TESTE
========================================== */

function buildReactionTest(
  game,
  testId,
  event
) {
  let attributeLabel =
    'Carisma'

  let abilityLabel =
    'Lábia'

  let attributeValue =
    game.attributes
      ?.social
      ?.charisma ?? 1

  let abilityValue =
    game.abilities
      ?.subterfuge ?? 0

  if (
    testId ===
    'manipulationSubterfuge'
  ) {
    attributeLabel =
      'Manipulação'

    abilityLabel =
      'Lábia'

    attributeValue =
      game.attributes
        ?.social
        ?.manipulation ?? 1

    abilityValue =
      game.abilities
        ?.subterfuge ?? 0
  }

  if (
    testId ===
    'manipulationIntimidation'
  ) {
    attributeLabel =
      'Manipulação'

    abilityLabel =
      'Intimidação'

    attributeValue =
      game.attributes
        ?.social
        ?.manipulation ?? 1

    abilityValue =
      game.abilities
        ?.intimidation ?? 0
  }

  if (
    testId ===
    'charismaEtiquette'
  ) {
    attributeLabel =
      'Carisma'

    abilityLabel =
      'Etiqueta'

    attributeValue =
      game.attributes
        ?.social
        ?.charisma ?? 1

    abilityValue =
      game.abilities
        ?.etiquette ?? 0
  }

  if (
    testId ===
    'dexterityAthletics'
  ) {
    attributeLabel =
      'Destreza'

    abilityLabel =
      'Esportes'

    attributeValue =
      game.attributes
        ?.physical
        ?.dexterity ?? 1

    abilityValue =
      game.abilities
        ?.athletics ?? 0
  }

  let difficulty = 6

  const severity =
    getBloodSeverity(
      game
    )

  /*
    É realmente difícil explicar
    por que você está coberto de sangue.
  */

  if (severity === 2) {
    difficulty += 1
  }

  if (severity >= 3) {
    difficulty += 2
  }

  if (
    event.type === 'police'
  ) {
    difficulty += 1
  }

  if (
    event.type === 'security'
  ) {
    difficulty += 1
  }

  const humanity =
    Number(
      game.humanity
        ?.current ?? 7
    )

  if (
    testId ===
    'manipulationIntimidation'
  ) {
    if (humanity <= 3) {
      difficulty -= 1
    }
  } else if (
    humanity <= 3
  ) {
    difficulty += 1
  }

  return {
    attributeLabel,

    abilityLabel,

    attributeValue,

    abilityValue,

    pool:
      Math.max(
        1,
        attributeValue +
          abilityValue
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
   RESOLVER
========================================== */

export function resolveReactionChoice(
  game,
  event,
  choice
) {
  let roll = null

  let result =
    'success'

  if (
    choice.test !==
    'none'
  ) {
    const test =
      buildReactionTest(
        game,
        choice.test,
        event
      )

    roll = {
      ...rollPool(
        test.pool,
        test.difficulty
      ),

      ...test,
    }

    result =
      roll.result
  }

  const outcome =
    applyReactionOutcome(
      game,
      event,
      choice,
      result
    )

  return {
    tested:
      choice.test !==
      'none',

    result,

    roll,

    game:
      outcome.game,

    consequences:
      outcome.consequences,
  }
}

/* ==========================================
   TESTEMUNHA
========================================== */

function createWitness(
  event,
  description
) {
  return {
    id:
      `witness-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`,

    type:
      event.type ===
      'police'
        ? 'police'
        : event.type ===
            'security'
          ? 'security'
          : 'civilian',

    locationId:
      event.locationId,

    description,

    timestamp:
      new Date()
        .toISOString(),
  }
}

/* ==========================================
   EVIDÊNCIA
========================================== */

function createVideoEvidence(
  event,
  description
) {
  return {
    id:
      `video-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`,

    type:
      'phoneVideo',

    description,

    locationId:
      event.locationId,

    active: true,

    timestamp:
      new Date()
        .toISOString(),
  }
}

/* ==========================================
   CONSEQUÊNCIAS
========================================== */

function applyReactionOutcome(
  game,
  event,
  choice,
  result
) {
  const current =
    getMasqueradeState(
      game
    )

  const bloodSeverity =
    getBloodSeverity(
      game
    )

  let suspicionGain = 0
  let policeGain = 0
  let violationGain = 0

  let witnessAdded = false
  let evidenceAdded = false

  const witnesses = [
    ...current.witnesses,
  ]

  const evidence = [
    ...current.evidence,
  ]

  /* ======================================
     SUCESSO
  ====================================== */

  if (result === 'success') {
    /*
      COBERTO DE SANGUE

      Mesmo convencendo alguém,
      você foi visto.

      Isso não desaparece.
    */

    if (
      bloodSeverity >= 3
    ) {
      suspicionGain = 1

      witnesses.push(
        createWitness(
          event,
          'Pessoa que viu o personagem coberto de sangue.'
        )
      )

      witnessAdded =
        true
    }

    /*
      INTIMIDAÇÃO

      Resolve o problema imediato,
      mas deixa uma testemunha
      assustada.
    */

    if (
      choice.id ===
      'intimidate'
    ) {
      suspicionGain += 1

      if (!witnessAdded) {
        witnesses.push(
          createWitness(
            event,
            'Pessoa intimidada pelo personagem.'
          )
        )

        witnessAdded =
          true
      }
    }

    /*
      POLÍCIA

      Mesmo enganando os policiais,
      o encontro fica registrado.
    */

    if (
      event.type ===
      'police'
    ) {
      suspicionGain += 1

      policeGain += 1

      if (!witnessAdded) {
        witnesses.push(
          createWitness(
            event,
            'Policial que abordou o personagem.'
          )
        )

        witnessAdded =
          true
      }
    }

    /*
      SEGURANÇA também lembra.
    */

    if (
      event.type ===
      'security'
    ) {
      if (!witnessAdded) {
        witnesses.push(
          createWitness(
            event,
            'Segurança que encontrou o personagem ensanguentado.'
          )
        )

        witnessAdded =
          true
      }
    }
  }

  /* ======================================
     FALHA
  ====================================== */

  if (result === 'failure') {
    suspicionGain = 2

    witnesses.push(
      createWitness(
        event,
        'Testemunha desconfiada da explicação do personagem.'
      )
    )

    witnessAdded = true

    if (
      event.type ===
      'phone'
    ) {
      evidence.push(
        createVideoEvidence(
          event,
          'Vídeo de celular mostrando o personagem coberto de sangue.'
        )
      )

      evidenceAdded = true

      suspicionGain += 2
    }

    if (
      event.type ===
      'security'
    ) {
      policeGain += 1
    }

    if (
      event.type ===
      'police'
    ) {
      policeGain += 3
      suspicionGain += 1
    }

    if (
      choice.id ===
        'intimidate'
    ) {
      suspicionGain += 1
    }
  }

  /* ======================================
     FALHA CRÍTICA
  ====================================== */

  if (result === 'botch') {
    suspicionGain = 4

    violationGain = 1

    witnesses.push(
      createWitness(
        event,
        'Testemunha de comportamento extremamente suspeito.'
      )
    )

    witnessAdded = true

    if (
      event.type ===
        'phone' ||
      event.type ===
        'security'
    ) {
      evidence.push(
        createVideoEvidence(
          event,
          'Registro comprometedor do personagem em uma situação relacionada à Máscara.'
        )
      )

      evidenceAdded = true

      suspicionGain += 2
    }

    if (
      event.type ===
      'police'
    ) {
      policeGain += 5
    }

    if (
      choice.id ===
        'intimidate'
    ) {
      policeGain += 1
    }
  }

  suspicionGain =
    Math.max(
      0,
      suspicionGain
    )

  policeGain =
    Math.max(
      0,
      policeGain
    )

  const newSuspicion =
    clamp(
      current.suspicion +
        suspicionGain,
      0,
      10
    )

  const newPolice =
    clamp(
      current.policeAttention +
        policeGain,
      0,
      10
    )

  const newViolations =
    current.violations +
    violationGain

  const consequences = {
    suspicionGain,

    policeGain,

    violationGain,

    witnessAdded,

    evidenceAdded,

    suspicionBefore:
      current.suspicion,

    suspicionAfter:
      newSuspicion,

    policeBefore:
      current.policeAttention,

    policeAfter:
      newPolice,

    violationsBefore:
      current.violations,

    violationsAfter:
      newViolations,
  }

  const historyEntry = {
    type:
      'masquerade-reaction',

    eventType:
      event.type,

    choice:
      choice.id,

    result,

    consequences,

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    game: {
      ...game,

      masquerade: {
        suspicion:
          newSuspicion,

        violations:
          newViolations,

        policeAttention:
          newPolice,

        witnesses,

        evidence,
      },

      history: [
        ...(game.history ??
          []),

        historyEntry,
      ],
    },

    consequences,
  }
}

/* ==========================================
   TEXTO DO RESULTADO
========================================== */

export function getReactionResultText(
  event,
  choice,
  result
) {
  if (
    result === 'success'
  ) {
    if (
      choice.id ===
      'intimidate'
    ) {
      return (
        'A pessoa recua e para de insistir. Você resolveu o problema imediato, mas ela certamente vai lembrar do encontro.'
      )
    }

    if (
      choice.id ===
      'escape' ||
      choice.id ===
      'leave'
    ) {
      return (
        'Você consegue sair antes que alguém o impeça. Isso não significa que ninguém tenha reparado em você.'
      )
    }

    if (
      event.type ===
      'police'
    ) {
      return (
        'Sua explicação é boa o suficiente para evitar uma escalada imediata. Ainda assim, aqueles policiais viram você coberto de sangue.'
      )
    }

    if (
      event.type ===
      'security'
    ) {
      return (
        'O segurança aceita sua explicação por enquanto. Ele continua observando enquanto você se afasta.'
      )
    }

    if (
      event.type ===
      'phone'
    ) {
      return (
        'A pessoa abaixa o celular e parece aceitar sua explicação. Ainda assim, ela viu algo que não vai esquecer facilmente.'
      )
    }

    return (
      'Você consegue controlar a situação imediata, mas o encontro aconteceu e alguém viu seu estado.'
    )
  }

  if (
    result === 'failure'
  ) {
    if (
      event.type ===
      'phone'
    ) {
      return (
        'A pessoa não acredita. O celular continua gravando e agora existe uma evidência potencialmente comprometora.'
      )
    }

    if (
      event.type ===
      'security'
    ) {
      return (
        'O segurança não acredita na história. A situação começa a ficar mais séria.'
      )
    }

    if (
      event.type ===
      'police'
    ) {
      return (
        'Os policiais não acreditam na explicação. A atenção policial sobre você aumenta.'
      )
    }

    return (
      'Sua explicação não convence. A testemunha continua desconfiada.'
    )
  }

  if (
    event.type ===
    'phone'
  ) {
    return (
      'Sua reação piora tudo. Mais pessoas olham, e o celular continua gravando.'
    )
  }

  if (
    event.type ===
    'police'
  ) {
    return (
      'A situação sai do controle. Os policiais passam a tratar você como suspeito.'
    )
  }

  return (
    'Tudo que você faz aumenta a suspeita. A situação agora tem consequências reais.'
  )
}