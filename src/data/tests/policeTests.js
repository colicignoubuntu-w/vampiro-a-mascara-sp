function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value)

  return Number.isFinite(
    number
  )
    ? number
    : fallback
}

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  )
}

/*
  ========================================
  DIFICULDADE — ARGUMENTAR APÓS RECONHECIMENTO
  ========================================

  Base pelo nível de procura:
  1 -> 6
  2 -> 7
  3 -> 8
  4 -> 9

  Modificadores:
  - descrição muito boa: +1
  - câmera: +1
  - identidade nominal conhecida: +1
  - descrição ruim: -1

  A dificuldade final fica entre 5 e 10.
*/

function getRecognizedArgumentDifficulty(
  game
) {
  const wanted =
    game?.policeWanted ??
    {}

  const level =
    clamp(
      safeNumber(
        wanted.level,
        game?.flags
          ?.policeWantedLevel ??
        1
      ),
      1,
      4
    )

  const baseByLevel = {
    1: 6,
    2: 7,
    3: 8,
    4: 9,
  }

  let difficulty =
    baseByLevel[level] ??
    7

  const descriptionQuality =
    clamp(
      safeNumber(
        wanted.descriptionQuality,
        0
      ),
      0,
      1
    )

  if (
    descriptionQuality >=
    0.75
  ) {
    difficulty += 1
  } else if (
    descriptionQuality <=
    0.25
  ) {
    difficulty -= 1
  }

  if (
    wanted.cameraEvidence
  ) {
    difficulty += 1
  }

  if (
    game?.flags
      ?.policeKnownIdentity
  ) {
    difficulty += 1
  }

  return clamp(
    difficulty,
    5,
    10
  )
}

const policeTests = {
  /*
    ========================================
    RECONHECIDO — TENTAR CONVENCER
    ========================================

    O policial acredita ter encontrado
    o suspeito procurado.

    O personagem tenta fazê-lo duvidar
    da identificação.

    Manipulação + Lábia.
  */

  'police_recognized.recognized_argue': {
    id:
      'police-recognized-argue',

    label:
      'Manipulação + Lábia',

    attributeGroup:
      'social',

    attribute:
      'manipulation',

    attributeLabel:
      'Manipulação',

    ability:
      'subterfuge',

    abilityLabel:
      'Lábia',

    difficulty:
      7,

    outcomes: {
      success: {
        nextScene:
          'police_released',

        timeMinutes:
          2,

        flags: {
          policeRecognizedPlayer:
            false,

          policeRecognitionDisputed:
            true,

          policeStopActive:
            false,

          policeTrouble:
            false,
        },

        timeReason:
          'Convencendo o policial de que houve um engano',
      },

      failure: {
        nextScene:
          'police_escalation',

        timeMinutes:
          1,

        flags: {
          policeRecognizedPlayer:
            true,

          policeRecognitionDisputed:
            false,

          policeTrouble:
            true,

          policeEscalation:
            true,
        },

        timeReason:
          'Falhando em contestar o reconhecimento',
      },

      botch: {
        nextScene:
          'police_force',

        timeMinutes:
          0,

        flags: {
          policeRecognizedPlayer:
            true,

          policeRecognitionDisputed:
            false,

          policeTrouble:
            true,

          policeEscalation:
            true,

          policeViolence:
            true,

          possibleMasqueradeRisk:
            true,
        },

        timeReason:
          'Falha crítica ao contestar o reconhecimento',
      },
    },

    successText:
      'Você aponta inconsistências com calma e segurança. O policial olha novamente para você, depois para as informações que recebeu. A certeza começa a desaparecer.',

    failureText:
      'Sua explicação não convence. O policial fica ainda mais certo de que encontrou a pessoa que estava procurando.',

    botchText:
      'Você se contradiz de forma tão evidente que elimina qualquer dúvida. Os policiais reagem imediatamente e a situação sai do controle.',
  },

  /*
    ========================================
    PERSEGUIÇÃO POLICIAL — PRIMEIRA TENTATIVA
    ========================================
  */

  'police_chase.try_escape': {
    id:
      'police-chase-try-escape',

    label:
      'Destreza + Esportes',

    attributeGroup:
      'physical',

    attribute:
      'dexterity',

    attributeLabel:
      'Destreza',

    ability:
      'athletics',

    abilityLabel:
      'Esportes',

    difficulty:
      7,

    outcomes: {
      success: {
        nextScene:
          'police_chase_escape',

        timeMinutes:
          4,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeEscapeMethod:
            'running',
        },

        timeReason:
          'Fugindo da polícia',
      },

      failure: {
        nextScene:
          'police_chase_continues',

        timeMinutes:
          2,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,

          policeChaseFailedOnce:
            true,

          policeEscapeMethod:
            'running',
        },

        timeReason:
          'Perseguição policial',
      },

      botch: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeEscapeMethod:
            'running',
        },

        timeReason:
          'Capturado durante a perseguição',
      },
    },

    successText:
      'Você força o ritmo, muda de direção entre as ruas e consegue abrir distância. Quando os policiais alcançam a próxima esquina, você já desapareceu.',

    failureText:
      'Você corre, mas não consegue abrir distância suficiente. Os passos e gritos continuam logo atrás.',

    botchText:
      'A fuga dá errado. Você perde terreno e os policiais conseguem alcançar você.',
  },

  'police_chase.jump_obstacle': {
    id:
      'police-chase-jump-obstacle',

    label:
      'Destreza + Esportes',

    attributeGroup:
      'physical',

    attribute:
      'dexterity',

    attributeLabel:
      'Destreza',

    ability:
      'athletics',

    abilityLabel:
      'Esportes',

    difficulty:
      8,

    outcomes: {
      success: {
        nextScene:
          'police_chase_escape',

        timeMinutes:
          3,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeJumpedObstacle:
            true,

          policeEscapeMethod:
            'obstacle',
        },

        timeReason:
          'Escapando por obstáculos',
      },

      failure: {
        nextScene:
          'police_chase_continues',

        timeMinutes:
          2,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,

          policeChaseFailedOnce:
            true,

          policeObstacleFailed:
            true,

          policeEscapeMethod:
            'obstacle',
        },

        timeReason:
          'Tentando superar um obstáculo',
      },

      botch: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeObstacleBotch:
            true,

          policeEscapeMethod:
            'obstacle',
        },

        timeReason:
          'Queda durante a perseguição',
      },
    },

    successText:
      'Você salta o obstáculo sem diminuir o ritmo. Os policiais precisam contorná-lo e você ganha os segundos necessários para desaparecer.',

    failureText:
      'Você supera o obstáculo, mas perde velocidade. Os policiais continuam próximos demais.',

    botchText:
      'Você calcula mal o salto e cai. Antes que consiga recuperar o equilíbrio, os policiais chegam até você.',
  },

  'police_chase.enter_alley': {
    id:
      'police-chase-enter-alley',

    label:
      'Raciocínio + Manha',

    attributeGroup:
      'mental',

    attribute:
      'wits',

    attributeLabel:
      'Raciocínio',

    ability:
      'streetwise',

    abilityLabel:
      'Manha',

    difficulty:
      7,

    outcomes: {
      success: {
        nextScene:
          'police_chase_escape',

        timeMinutes:
          3,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeUsedAlley:
            true,

          policeEscapeMethod:
            'alley',
        },

        timeReason:
          'Despistando a polícia pelas ruas',
      },

      failure: {
        nextScene:
          'police_chase_continues',

        timeMinutes:
          2,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,

          policeChaseFailedOnce:
            true,

          policeAlleyFailed:
            true,

          policeEscapeMethod:
            'alley',
        },

        timeReason:
          'Procurando uma rota de fuga',
      },

      botch: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeAlleyBotch:
            true,

          policeEscapeMethod:
            'alley',
        },

        timeReason:
          'Encurralado durante a fuga',
      },
    },

    successText:
      'Você percebe uma passagem estreita entre os prédios e muda de direção no momento certo. Os policiais seguem pela rota mais óbvia e perdem você de vista.',

    failureText:
      'A viela não oferece a saída que você esperava. Você precisa voltar para a rua enquanto os policiais continuam se aproximando.',

    botchText:
      'Você entra na viela e percebe tarde demais que escolheu um caminho sem saída.',
  },

  'police_chase.hide': {
    id:
      'police-chase-hide',

    label:
      'Destreza + Furtividade',

    attributeGroup:
      'physical',

    attribute:
      'dexterity',

    attributeLabel:
      'Destreza',

    ability:
      'stealth',

    abilityLabel:
      'Furtividade',

    difficulty:
      7,

    outcomes: {
      success: {
        nextScene:
          'police_chase_escape',

        timeMinutes:
          5,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeHidSuccessfully:
            true,

          policeEscapeMethod:
            'hiding',
        },

        timeReason:
          'Escondendo-se da polícia',
      },

      failure: {
        nextScene:
          'police_chase_continues',

        timeMinutes:
          2,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,

          policeChaseFailedOnce:
            true,

          policeHideFailed:
            true,

          policeEscapeMethod:
            'hiding',
        },

        timeReason:
          'Tentando se esconder',
      },

      botch: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeHideBotch:
            true,

          policeEscapeMethod:
            'hiding',
        },

        timeReason:
          'Encontrado pela polícia',
      },
    },

    successText:
      'Você quebra a linha de visão, entra em um ponto escuro e permanece imóvel. Os policiais passam correndo sem perceber onde você se escondeu.',

    failureText:
      'Você tenta desaparecer entre as sombras, mas os policiais percebem seu movimento. Você precisa voltar a correr.',

    botchText:
      'Você escolhe um esconderijo ruim. Um dos policiais percebe imediatamente onde você entrou.',
  },

  /*
    ========================================
    PERSEGUIÇÃO POLICIAL — SEGUNDA TENTATIVA
    ========================================
  */

  'police_chase_continues.try_escape_again': {
    id:
      'police-chase-try-escape-again',

    label:
      'Destreza + Esportes',

    attributeGroup:
      'physical',

    attribute:
      'dexterity',

    attributeLabel:
      'Destreza',

    ability:
      'athletics',

    abilityLabel:
      'Esportes',

    difficulty:
      8,

    outcomes: {
      success: {
        nextScene:
          'police_chase_escape',

        timeMinutes:
          3,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeEscapeMethod:
            'running-second-attempt',
        },

        timeReason:
          'Despistando a polícia',
      },

      failure: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeEscapeMethod:
            'running-second-attempt',
        },

        timeReason:
          'Polícia alcançando o personagem',
      },

      botch: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeChaseBotch:
            true,

          policeEscapeMethod:
            'running-second-attempt',
        },

        timeReason:
          'Falha crítica durante a fuga',
      },
    },

    successText:
      'No último momento você encontra uma rota melhor, corta caminho e finalmente consegue despistar os policiais.',

    failureText:
      'Você já não consegue manter a distância. Os policiais fecham o espaço e alcançam você.',

    botchText:
      'Você calcula mal a rota e acaba sem saída. A perseguição termina com os policiais alcançando você.',
  },

  'police_chase_continues.jump_obstacle_again': {
    id:
      'police-chase-jump-obstacle-again',

    label:
      'Destreza + Esportes',

    attributeGroup:
      'physical',

    attribute:
      'dexterity',

    attributeLabel:
      'Destreza',

    ability:
      'athletics',

    abilityLabel:
      'Esportes',

    difficulty:
      8,

    outcomes: {
      success: {
        nextScene:
          'police_chase_escape',

        timeMinutes:
          3,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeJumpedObstacle:
            true,

          policeEscapeMethod:
            'obstacle-second-attempt',
        },

        timeReason:
          'Superando obstáculos durante a fuga',
      },

      failure: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeEscapeMethod:
            'obstacle-second-attempt',
        },

        timeReason:
          'Polícia alcançando o personagem',
      },

      botch: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeObstacleBotch:
            true,

          policeEscapeMethod:
            'obstacle-second-attempt',
        },

        timeReason:
          'Queda durante a perseguição',
      },
    },

    successText:
      'Mesmo com os policiais próximos, você supera o obstáculo e consegue colocá-lo entre você e seus perseguidores.',

    failureText:
      'Você perde velocidade ao superar o obstáculo. Desta vez os policiais conseguem fechar a distância.',

    botchText:
      'Você tropeça durante a tentativa e cai. Os policiais chegam antes que consiga voltar a correr.',
  },

  'police_chase_continues.enter_alley_again': {
    id:
      'police-chase-enter-alley-again',

    label:
      'Raciocínio + Manha',

    attributeGroup:
      'mental',

    attribute:
      'wits',

    attributeLabel:
      'Raciocínio',

    ability:
      'streetwise',

    abilityLabel:
      'Manha',

    difficulty:
      8,

    outcomes: {
      success: {
        nextScene:
          'police_chase_escape',

        timeMinutes:
          3,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeUsedAlley:
            true,

          policeEscapeMethod:
            'alley-second-attempt',
        },

        timeReason:
          'Despistando a polícia pelas ruas',
      },

      failure: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeEscapeMethod:
            'alley-second-attempt',
        },

        timeReason:
          'Polícia alcançando o personagem',
      },

      botch: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeAlleyBotch:
            true,

          policeEscapeMethod:
            'alley-second-attempt',
        },

        timeReason:
          'Encurralado durante a fuga',
      },
    },

    successText:
      'Você identifica uma rota improvável entre as construções e consegue quebrar definitivamente a linha de perseguição.',

    failureText:
      'A rota não leva onde você esperava. Quando tenta corrigir o caminho, os policiais já estão perto demais.',

    botchText:
      'A viela termina em um portão fechado. Você acabou de encurralar a si mesmo.',
  },

  'police_chase_continues.hide_again': {
    id:
      'police-chase-hide-again',

    label:
      'Destreza + Furtividade',

    attributeGroup:
      'physical',

    attribute:
      'dexterity',

    attributeLabel:
      'Destreza',

    ability:
      'stealth',

    abilityLabel:
      'Furtividade',

    difficulty:
      8,

    outcomes: {
      success: {
        nextScene:
          'police_chase_escape',

        timeMinutes:
          5,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeHidSuccessfully:
            true,

          policeEscapeMethod:
            'hiding-second-attempt',
        },

        timeReason:
          'Escondendo-se da polícia',
      },

      failure: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeEscapeMethod:
            'hiding-second-attempt',
        },

        timeReason:
          'Encontrado durante a perseguição',
      },

      botch: {
        nextScene:
          'police_chase_caught',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeChaseCaught:
            true,

          policeTrouble:
            true,

          policeHideBotch:
            true,

          policeEscapeMethod:
            'hiding-second-attempt',
        },

        timeReason:
          'Esconderijo descoberto',
      },
    },

    successText:
      'Você quebra a linha de visão no último instante e encontra um ponto escuro. Os policiais passam sem perceber que você está a poucos metros deles.',

    failureText:
      'Você tenta se esconder, mas já não existe distância suficiente. Um dos policiais vê exatamente onde você entrou.',

    botchText:
      'Você entra no esconderijo no pior momento possível. O policial vê todo o movimento e bloqueia sua saída.',
  },
}

export function getPoliceChoiceTest(
  sceneId,
  choiceId,
  game = null
) {
  const key =
    `${sceneId}.${choiceId}`

  const test =
    policeTests[key] ??
    null

  if (!test) {
    return null
  }

  /*
    A argumentação depois de ser reconhecido
    precisa considerar o estado atual da
    procura policial.
  */

  if (
    key ===
    'police_recognized.recognized_argue'
  ) {
    return {
      ...test,

      difficulty:
        getRecognizedArgumentDifficulty(
          game
        ),
    }
  }

  return test
}

export default policeTests