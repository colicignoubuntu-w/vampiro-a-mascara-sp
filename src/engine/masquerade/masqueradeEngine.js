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
      () =>
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

/*
  ========================================
  ESTADO DA MÁSCARA
  ========================================
*/

export function getMasqueradeState(
  game
) {
  return {
    suspicion:
      Number(
        game?.masquerade
          ?.suspicion ?? 0
      ),

    violations:
      Number(
        game?.masquerade
          ?.violations ?? 0
      ),

    policeAttention:
      Number(
        game?.masquerade
          ?.policeAttention ?? 0
      ),

    witnesses:
      Array.isArray(
        game?.masquerade
          ?.witnesses
      )
        ? game.masquerade
            .witnesses
        : [],

    evidence:
      Array.isArray(
        game?.masquerade
          ?.evidence
      )
        ? game.masquerade
            .evidence
        : [],
  }
}

/*
  ========================================
  RÓTULOS
  ========================================
*/

export function getSuspicionLabel(
  suspicion
) {
  if (
    suspicion <= 0
  ) {
    return 'Nenhuma'
  }

  if (
    suspicion <= 2
  ) {
    return 'Baixa'
  }

  if (
    suspicion <= 5
  ) {
    return 'Moderada'
  }

  if (
    suspicion <= 8
  ) {
    return 'Alta'
  }

  return 'Crítica'
}

export function getPoliceAttentionLabel(
  value
) {
  if (
    value <= 0
  ) {
    return 'Nenhuma'
  }

  if (
    value <= 2
  ) {
    return 'Baixa'
  }

  if (
    value <= 5
  ) {
    return 'Moderada'
  }

  if (
    value <= 8
  ) {
    return 'Alta'
  }

  return 'Crítica'
}

/*
  ========================================
  SANGUE VISÍVEL
  ========================================
*/

export function getBloodSeverity(
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

/*
  ========================================
  HUMANIDADE
  ========================================
*/

function getHumanityFearModifier(
  game
) {
  const humanity =
    Number(
      game?.humanity
        ?.current ?? 7
    )

  if (
    humanity >= 6
  ) {
    return 0
  }

  if (
    humanity >= 4
  ) {
    return 1
  }

  if (
    humanity >= 2
  ) {
    return 2
  }

  return 3
}

/*
  ========================================
  MODIFICADOR POLICIAL
  ========================================

  Quanto mais atenção policial
  acumulada, mais perigoso circular
  publicamente em situação suspeita.
*/

function getPoliceReactionModifier(
  game
) {
  const police =
    getMasqueradeState(
      game
    ).policeAttention

  if (
    police <= 2
  ) {
    return 0
  }

  if (
    police <= 5
  ) {
    return 5
  }

  if (
    police <= 8
  ) {
    return 12
  }

  return 20
}

/*
  ========================================
  CHANCE DE REAÇÃO PÚBLICA
  ========================================
*/

export function calculatePublicReactionChance(
  game,
  location
) {
  const severity =
    getBloodSeverity(
      game
    )

  if (
    severity <= 0
  ) {
    return 0
  }

  const humanityFear =
    getHumanityFearModifier(
      game
    )

  const policeModifier =
    getPoliceReactionModifier(
      game
    )

  const crowdLevel =
    clamp(
      Number(
        location?.crowdLevel ??
        0.5
      ),
      0,
      1
    )

  const policePresence =
    clamp(
      Number(
        location?.policePresence ??
        0.3
      ),
      0,
      1
    )

  /*
    ========================================
    PEQUENAS MANCHAS
    ========================================
  */

  if (
    severity === 1
  ) {
    let chance =
      12

    chance +=
      crowdLevel *
      35

    chance +=
      policePresence *
      8

    chance +=
      humanityFear *
      5

    chance +=
      Math.floor(
        policeModifier /
        2
      )

    return clamp(
      Math.round(
        chance
      ),
      5,
      75
    )
  }

  /*
    ========================================
    VISIVELMENTE ENSANGUENTADO
    ========================================
  */

  if (
    severity === 2
  ) {
    let chance =
      40

    chance +=
      crowdLevel *
      45

    chance +=
      policePresence *
      15

    chance +=
      humanityFear *
      5

    chance +=
      policeModifier

    return clamp(
      Math.round(
        chance
      ),
      35,
      99
    )
  }

  /*
    ========================================
    COBERTO DE SANGUE
    ========================================

    Em local público movimentado,
    alguém inevitavelmente percebe.

    Em área extremamente isolada ainda
    existe uma pequena possibilidade
    de ninguém estar por perto naquele
    momento.
  */

  if (
    crowdLevel <= 0.15
  ) {
    return 85
  }

  return 100
}

function selectReactionType(
  game,
  location
) {
  const severity =
    getBloodSeverity(
      game
    )

  const masquerade =
    getMasqueradeState(
      game
    )

  const policeAttention =
    masquerade
      .policeAttention

  const crowdLevel =
    clamp(
      Number(
        location?.crowdLevel ??
        0.5
      ),
      0,
      1
    )

  const policePresence =
    clamp(
      Number(
        location?.policePresence ??
        0.3
      ),
      0,
      1
    )

  /*
    Transformamos características do
    local em pesos.

    Exemplo:

    Paulista:
    crowdLevel 1.0
    policePresence 0.8

    Portanto celular, segurança e
    polícia se tornam bem mais
    prováveis.
  */

  const crowdWeight =
    crowdLevel *
    100

  const policeWeight =
    policePresence *
    100

  const roll =
    Math.random() *
    100

  /*
    ========================================
    PEQUENAS MANCHAS
    ========================================
  */

  if (
    severity === 1
  ) {
    /*
      Só existe chance relevante de
      polícia se já houver grande atenção
      policial sobre o personagem.
    */

    const directPoliceChance =
      clamp(
        (
          policeAttention >= 8
            ? 4
            : 0
        ) +
        (
          policeAttention >= 10
            ? 5
            : 0
        ) +
        policePresence *
          2,
        0,
        12
      )

    if (
      roll <
      directPoliceChance
    ) {
      return 'police'
    }

    /*
      Lugares muito cheios produzem
      mais observadores.
    */

    const concernChance =
      45 +
      crowdLevel *
        25

    if (
      roll <
      concernChance
    ) {
      return 'concern'
    }

    return 'avoid'
  }

  /*
    ========================================
    VISIVELMENTE ENSANGUENTADO
    ========================================
  */

  if (
    severity === 2
  ) {
    /*
      Chance direta de polícia.

      Ela depende de:
      - presença policial da região;
      - atenção policial já acumulada.
    */

    let policeChance =
      5 +
      policePresence *
        20

    if (
      policeAttention >= 3
    ) {
      policeChance += 5
    }

    if (
      policeAttention >= 6
    ) {
      policeChance += 8
    }

    if (
      policeAttention >= 9
    ) {
      policeChance += 12
    }

    policeChance =
      clamp(
        policeChance,
        5,
        50
      )

    /*
      Segurança é muito provável em
      regiões movimentadas.
    */

    let securityChance =
      10 +
      crowdLevel *
        20 +
      policePresence *
        5

    securityChance =
      clamp(
        securityChance,
        10,
        35
      )

    /*
      Celulares são especialmente
      comuns em áreas cheias.
    */

    let phoneChance =
      15 +
      crowdLevel *
        25

    phoneChance =
      clamp(
        phoneChance,
        15,
        40
      )

    if (
      roll <
      policeChance
    ) {
      return 'police'
    }

    if (
      roll <
      policeChance +
        securityChance
    ) {
      return 'security'
    }

    if (
      roll <
      policeChance +
        securityChance +
        phoneChance
    ) {
      return 'phone'
    }

    return 'concern'
  }

  /*
    ========================================
    COBERTO DE SANGUE
    ========================================
  */

  let policeChance =
    15 +
    policePresence *
      30

  if (
    policeAttention >= 3
  ) {
    policeChance += 5
  }

  if (
    policeAttention >= 6
  ) {
    policeChance += 10
  }

  if (
    policeAttention >= 9
  ) {
    policeChance += 15
  }

  /*
    Em uma região praticamente sem
    polícia, reduzimos o mínimo.
  */

  if (
    policePresence <= 0.2
  ) {
    policeChance -= 10
  }

  policeChance =
    clamp(
      policeChance,
      5,
      70
    )

  let securityChance =
    10 +
    crowdLevel *
      25

  /*
    Em local quase vazio normalmente
    não há segurança imediatamente.
  */

  if (
    crowdLevel <= 0.2
  ) {
    securityChance =
      5
  }

  securityChance =
    clamp(
      securityChance,
      5,
      35
    )

  let phoneChance =
    15 +
    crowdLevel *
      30

  phoneChance =
    clamp(
      phoneChance,
      10,
      40
    )

  if (
    roll <
    policeChance
  ) {
    return 'police'
  }

  if (
    roll <
    policeChance +
      securityChance
  ) {
    return 'security'
  }

  if (
    roll <
    policeChance +
      securityChance +
      phoneChance
  ) {
    return 'phone'
  }

  return 'concern'
}

/*
  ========================================
  ROLAR REAÇÃO PÚBLICA
  ========================================
*/

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

  if (
    chance <= 0
  ) {
    return null
  }

  if (
    chance < 100
  ) {
    const roll =
      Math.random() *
      100

    if (
      roll >= chance
    ) {
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
  if (
    !game ||
    !location
  ) {
    return null
  }

  return createReaction(
    type,
    location
  )
}

/*
  ========================================
  EVENTOS
  ========================================
*/

function createReaction(
  type,
  location
) {
  const id =
    `masquerade-${Date.now()}-${Math.floor(
      Math.random() *
      10000
    )}`

  if (
    type === 'concern'
  ) {
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
        location?.id ??
        null,
    }
  }

  if (
    type === 'avoid'
  ) {
    return {
      id,

      type,

      title:
        'Olhares e cochichos',

      text:
        'As pessoas começam a abrir espaço. Algumas cochicham entre si. Outras mudam discretamente de caminho quando percebem o sangue.',

      dialogue:
        null,

      locationId:
        location?.id ??
        null,
    }
  }

  if (
    type === 'phone'
  ) {
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
        location?.id ??
        null,
    }
  }

  if (
    type === 'security'
  ) {
    return {
      id,

      type,

      title:
        'O segurança se aproxima',

      text:
        'Um segurança percebe seu estado e caminha em sua direção. Outro observa a situação à distância.',

      dialogue:
        '— Senhor, fica onde está. O que aconteceu? Esse sangue é seu?',

      locationId:
        location?.id ??
        null,
    }
  }

  return {
    id,

    type:
      'police',

    title:
      'Abordagem policial',

    text:
      'Uma viatura reduz a velocidade e para próxima a você. Um dos policiais sai enquanto observa cuidadosamente o sangue em suas roupas.',

    dialogue:
      '— Boa noite. Documento. E me explica o que aconteceu.',

    locationId:
      location?.id ??
      null,
  }
}

/*
  ========================================
  OPÇÕES
  ========================================
*/

export function getReactionChoices(
  event
) {
  if (
    event.type ===
    'avoid'
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
    event.type ===
    'phone'
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
    event.type ===
    'police'
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

/*
  ========================================
  TESTE
  ========================================
*/

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

  const policeAttention =
    getMasqueradeState(
      game
    ).policeAttention

  if (
    severity === 2
  ) {
    difficulty += 1
  }

  if (
    severity >= 3
  ) {
    difficulty += 2
  }

  if (
    event.type ===
    'police'
  ) {
    difficulty += 1

    if (
      policeAttention >= 6
    ) {
      difficulty += 1
    }

    if (
      policeAttention >= 9
    ) {
      difficulty += 1
    }
  }

  if (
    event.type ===
    'security'
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
    if (
      humanity <= 3
    ) {
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

/*
  ========================================
  RESOLVER
  ========================================
*/

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

/*
  ========================================
  TESTEMUNHA
  ========================================
*/

function createWitness(
  event,
  description
) {
  return {
    id:
      `witness-${Date.now()}-${Math.floor(
        Math.random() *
        10000
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

/*
  ========================================
  EVIDÊNCIA
  ========================================
*/

function createVideoEvidence(
  event,
  description
) {
  return {
    id:
      `video-${Date.now()}-${Math.floor(
        Math.random() *
        10000
      )}`,

    type:
      'phoneVideo',

    description,

    locationId:
      event.locationId,

    active:
      true,

    timestamp:
      new Date()
        .toISOString(),
  }
}

/*
  ========================================
  CONSEQUÊNCIAS
  ========================================
*/

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

  let witnessAdded =
    false

  let evidenceAdded =
    false

  const witnesses = [
    ...current.witnesses,
  ]

  const evidence = [
    ...current.evidence,
  ]

  /*
    ======================================
    SUCESSO
    ======================================
  */

  if (
    result ===
    'success'
  ) {
    /*
      Mesmo numa interação sem teste,
      estar extremamente ensanguentado
      pode deixar uma impressão.
    */

    if (
      bloodSeverity >= 3
    ) {
      suspicionGain += 1

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
      Ignorar pessoas enquanto se está
      coberto de sangue não elimina a
      suspeita.
    */

    if (
      event.type ===
        'avoid' &&
      choice.id ===
        'ignore' &&
      bloodSeverity >= 2
    ) {
      suspicionGain += 1
    }

    /*
      Intimidação.
    */

    if (
      choice.id ===
      'intimidate'
    ) {
      suspicionGain += 1

      if (
        !witnessAdded
      ) {
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
      Polícia.
    */

    if (
      event.type ===
      'police'
    ) {
      suspicionGain += 1

      policeGain += 1

      if (
        !witnessAdded
      ) {
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
      Segurança.
    */

    if (
      event.type ===
      'security'
    ) {
      if (
        !witnessAdded
      ) {
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

    /*
      Celular.

      Se está completamente coberto
      de sangue, o simples fato de um
      celular ter sido apontado já pode
      deixar algum registro.
    */

    if (
      event.type ===
        'phone' &&
      bloodSeverity >= 3 &&
      choice.id ===
        'leave'
    ) {
      evidence.push(
        createVideoEvidence(
          event,
          'Gravação curta mostrando o personagem coberto de sangue deixando o local.'
        )
      )

      evidenceAdded =
        true

      suspicionGain += 1
    }
  }

  /*
    ======================================
    FALHA
    ======================================
  */

  if (
    result ===
    'failure'
  ) {
    suspicionGain = 2

    witnesses.push(
      createWitness(
        event,
        'Testemunha desconfiada da explicação do personagem.'
      )
    )

    witnessAdded =
      true

    if (
      event.type ===
      'phone'
    ) {
      evidence.push(
        createVideoEvidence(
          event,
          'Vídeo de celular mostrando o personagem ensanguentado.'
        )
      )

      evidenceAdded =
        true

      suspicionGain += 2

      /*
        Evidência pública também pode
        aumentar atenção policial.
      */

      if (
        bloodSeverity >= 2
      ) {
        policeGain += 1
      }
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

  /*
    ======================================
    FALHA CRÍTICA
    ======================================
  */

  if (
    result ===
    'botch'
  ) {
    suspicionGain = 4

    violationGain = 1

    witnesses.push(
      createWitness(
        event,
        'Testemunha de comportamento extremamente suspeito.'
      )
    )

    witnessAdded =
      true

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

      evidenceAdded =
        true

      suspicionGain += 2

      policeGain += 1
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

    locationId:
      event.locationId ??
      null,

    bloodSeverity,

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

/*
  ========================================
  TEXTO DO RESULTADO
  ========================================
*/

export function getReactionResultText(
  event,
  choice,
  result
) {
  if (
    result ===
    'success'
  ) {
    if (
      choice.id ===
      'ignore'
    ) {
      return (
        'Você continua andando sem responder. Os cochichos ficam para trás, mas algumas pessoas continuam olhando.'
      )
    }

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
        'Sua explicação é boa o suficiente para evitar uma escalada imediata. Ainda assim, os policiais registram mentalmente o encontro.'
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
    result ===
    'failure'
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
        'O segurança não acredita na história. Ele começa a tratar a situação como um possível caso policial.'
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

  if (
    event.type ===
    'security'
  ) {
    return (
      'Sua reação faz o segurança acionar ajuda. A situação começa a escapar do seu controle.'
    )
  }

  return (
    'Tudo que você faz aumenta a suspeita. A situação agora tem consequências reais.'
  )
}