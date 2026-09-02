const prologueTests = {
  'awakening.look_around': {
    id:
      'awakening-look-around',

    label:
      'Percepção + Prontidão',

    attributeGroup:
      'mental',

    attribute:
      'perception',

    attributeLabel:
      'Percepção',

    ability:
      'alertness',

    abilityLabel:
      'Prontidão',

    difficulty: 6,

    modifier: 0,

    outcomes: {
      success: {
        nextScene:
          'look_around_success',

        timeMinutes: 2,

        flags: {
          examinedRoom: true,
          noticedImportantDetails:
            true,
        },
      },

      failure: {
        nextScene:
          'look_around_failure',

        timeMinutes: 3,

        flags: {
          examinedRoom: true,
          missedRoomDetails: true,
        },
      },

      botch: {
        nextScene:
          'look_around_botch',

        timeMinutes: 4,

        flags: {
          examinedRoom: true,
          malkavianDistortion:
            true,
        },
      },
    },

    successText:
      'Você consegue separar os detalhes reais da confusão do despertar.',

    failureText:
      'Sua mente ainda está confusa demais para montar uma imagem clara do ambiente.',

    botchText:
      'Sua percepção se fragmenta. Por alguns segundos, realidade e alucinação parecem a mesma coisa.',
  },

  'look_around_success.check_phone': {
    id:
      'look-around-check-phone',

    label:
      'Raciocínio + Computador',

    attributeGroup:
      'mental',

    attribute:
      'wits',

    attributeLabel:
      'Raciocínio',

    ability:
      'computer',

    abilityLabel:
      'Computador',

    difficulty: 5,

    modifier: 0,

    outcomes: {
      success: {
        nextScene:
          'check_phone',

        timeMinutes: 2,

        flags: {
          checkedPhone: true,
          organizedNotifications:
            true,
        },
      },

      failure: {
        nextScene:
          'check_phone_confused',

        timeMinutes: 4,

        flags: {
          checkedPhone: true,
          confusedNotifications:
            true,
        },
      },

      botch: {
        nextScene:
          'check_phone_botch',

        timeMinutes: 5,

        flags: {
          checkedPhone: true,
          nearlyLockedPhone: true,
        },
      },
    },

    successText:
      'Você organiza rapidamente as notificações e percebe quais mensagens são importantes.',

    failureText:
      'As notificações parecem se misturar e você demora para entender a sequência.',

    botchText:
      'Você toca na tela rápido demais e quase bloqueia o aparelho.',
  },

  'door.ask_man': {
    id:
      'door-read-jack',

    label:
      'Percepção + Empatia',

    attributeGroup:
      'mental',

    attribute:
      'perception',

    attributeLabel:
      'Percepção',

    ability:
      'empathy',

    abilityLabel:
      'Empatia',

    difficulty: 6,

    modifier: 0,

    outcomes: {
      success: {
        nextScene:
          'jack_intro_read',

        timeMinutes: 1,

        flags: {
          readJackCorrectly: true,
        },
      },

      failure: {
        nextScene:
          'jack_intro',

        timeMinutes: 1,

        flags: {
          failedToReadJack: true,
        },
      },

      botch: {
        nextScene:
          'jack_intro_misread',

        timeMinutes: 2,

        flags: {
          misreadJack: true,
        },
      },
    },

    successText:
      'Você percebe que ele é perigoso, mas não demonstra intenção imediata de atacar.',

    failureText:
      'Você não consegue decidir se ele está ali para ajudar ou terminar o serviço.',

    botchText:
      'Você interpreta completamente errado a expressão dele e sente uma ameaça maior do que realmente existe.',
  },

  'door.stay_silent': {
    id:
      'door-stay-silent',

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

    difficulty: 6,

    modifier: 0,

    outcomes: {
      success: {
        nextScene:
          'jack_intro_silent_success',

        timeMinutes: 1,

        flags: {
          handledStreetSituation:
            true,
        },
      },

      failure: {
        nextScene:
          'jack_intro',

        timeMinutes: 1,

        flags: {
          awkwardSilence: true,
        },
      },

      botch: {
        nextScene:
          'jack_intro_silent_botch',

        timeMinutes: 2,

        flags: {
          hostileSilence: true,
        },
      },
    },

    successText:
      'Você lê a situação e percebe que observar antes de falar é a escolha certa.',

    failureText:
      'Você permanece quieto, mas não consegue entender se isso ajuda.',

    botchText:
      'Seu silêncio parece hostil e aumenta a tensão no corredor.',
  },

  'judgment_prince.challenge_prince': {
    id:
      'judgment-prince-courage',

    label:
      'Coragem',

    attributeGroup:
      'virtues',

    attribute:
      'courage',

    attributeLabel:
      'Coragem',

    ability:
      null,

    abilityLabel:
      null,

    difficulty: 6,

    modifier: 0,

    ignoreHealthPenalty:
      true,

    outcomes: {
      success: {
        nextScene:
          'challenge_prince_success',

        timeMinutes: 2,

        flags: {
          challengedPrince:
            true,
        },
      },

      failure: {
        nextScene:
          'challenge_prince_failure',

        timeMinutes: 2,

        flags: {
          failedPrinceCourage:
            true,
        },
      },

      botch: {
        nextScene:
          'challenge_prince_failure',

        timeMinutes: 2,

        flags: {
          botchedPrinceCourage:
            true,
        },
      },
    },

    successText:
      'Você vence o peso da presença do Príncipe e consegue falar.',

    failureText:
      'A pressão do salão faz as palavras morrerem em sua garganta.',

    botchText:
      'O medo toma sua voz e você não consegue terminar a frase.',
  },

  'judgment_mission.ask_choice': {
    id:
      'judgment-refusal-courage',

    label:
      'Coragem',

    attributeGroup:
      'virtues',

    attribute:
      'courage',

    attributeLabel:
      'Coragem',

    ability:
      null,

    abilityLabel:
      null,

    difficulty: 6,

    modifier: 0,

    ignoreHealthPenalty:
      true,

    outcomes: {
      success: {
        nextScene:
          'judgment_refusal',

        timeMinutes: 1,

        flags: {
          questionedRefusal:
            true,
        },
      },

      failure: {
        nextScene:
          'judgment_refusal_failure',

        timeMinutes: 1,

        flags: {
          failedToQuestionRefusal:
            true,
        },
      },

      botch: {
        nextScene:
          'judgment_refusal_failure',

        timeMinutes: 1,

        flags: {
          botchedRefusalCourage:
            true,
        },
      },
    },

    successText:
      'Mesmo diante das cinzas de Lívia, você encontra coragem para questionar o Príncipe.',

    failureText:
      'A resposta implícita nas cinzas de Lívia impede que você faça a pergunta.',

    botchText:
      'O medo fecha sua garganta antes que a provocação possa ser pronunciada.',
  },
}

export function getChoiceTest(
  sceneId,
  choiceId
) {
  const key =
    `${sceneId}.${choiceId}`

  return (
    prologueTests[key] ??
    null
  )
}

export default prologueTests
