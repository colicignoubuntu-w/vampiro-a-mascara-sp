const policeScenes = {
  police_stop: {
    id: 'police_stop',

    chapter:
      'A MÁSCARA',

    title:
      'A Viatura Para',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'A viatura encosta alguns metros à frente.',
      'Um dos policiais desce enquanto o outro permanece próximo ao carro.',
      'A mão dele repousa perto do coldre.',
      'Você percebe imediatamente que esta não é mais uma observação casual.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Boa noite. Documento, por favor. O senhor pode me dizer de onde está vindo?',
    },

    choices: [
      {
        id:
          'police_cooperate',

        text:
          'Entregar o documento e cooperar.',

        nextScene:
          'police_document_check',

        timeMinutes: 5,
      },

      {
        id:
          'police_lie',

        text:
          'Inventar uma explicação para sua presença ali.',

        nextScene:
          'police_lie_result',

        timeMinutes: 5,
      },

      {
        id:
          'police_leave',

        text:
          'Tentar encerrar a conversa e ir embora.',

        nextScene:
          'police_leave_attempt',

        timeMinutes: 2,
      },
    ],

    /*
      ======================================
      OPÇÕES DE DISCIPLINA
      ======================================
    */

    disciplineChoices: [
      {
        id:
          'police_dominate_leave',

        powerId:
          'dominate_1',

        text:
          '"Você não precisa falar comigo. Volte para a viatura."',

        description:
          'Tentar impor uma ordem curta e direta ao policial.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_questions',

        botchScene:
          'police_escalation',

        timeMinutes: 1,

        successFlags: {
          policeDominationSuccess:
            true,
        },

        failureFlags: {
          policeDominationFailure:
            true,
        },

        botchFlags: {
          policeDominationBotch:
            true,

          policeEscalation:
            true,
        },
      },

      {
        id:
          'police_presence_calm',

        powerId:
          'presence_1',

        text:
          'Usar Presença para fazê-lo baixar a guarda.',

        description:
          'Influenciar emocionalmente o policial sem dar uma ordem direta.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_released',

        failureScene:
          'police_document_check',

        botchScene:
          'police_questions',

        timeMinutes: 2,

        successFlags: {
          policePresenceSuccess:
            true,
        },
      },

      {
        id:
          'police_dementia_emotion',

        powerId:
          'dementia_1',

        text:
          'Amplificar a insegurança do policial.',

        description:
          'Usar Demência para intensificar uma emoção já presente.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_dementia_success',

        failureScene:
          'police_questions',

        botchScene:
          'police_escalation',

        timeMinutes: 1,

        successFlags: {
          policeDementiaSuccess:
            true,
        },

        botchFlags: {
          policeEscalation:
            true,
        },
      },

      {
        id:
          'police_auspex_read',

        powerId:
          'auspex_1',

        text:
          'Aguçar os sentidos e observar cada detalhe do policial.',

        description:
          'Usar Auspícios para perceber tensão, postura e sinais de perigo.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        nextScene:
          'police_auspex_observation',

        timeMinutes: 0,

        successFlags: {
          policeAuspexUsed:
            true,
        },
      },

      {
        id:
          'police_obfuscate_escape',

        powerId:
          'obfuscate_2',

        text:
          'Tentar desaparecer da atenção dos policiais.',

        description:
          'Usar Ofuscação para se retirar da situação sem confronto direto.',

        target: {
          type:
            'environment',
        },

        nextScene:
          'police_obfuscate_escape',

        timeMinutes: 1,

        successFlags: {
          policeObfuscateEscape:
            true,
        },
      },
    ],
  },

  police_recognized: {
    id:
      'police_recognized',

    chapter:
      'A MÁSCARA',

    title:
      'Reconhecido',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O policial observa seu rosto por alguns segundos a mais.',
      'A expressão dele muda.',
      'Os olhos descem rapidamente até algum ponto de referência e voltam para você.',
      'A mão vai até o rádio preso no ombro.',
      'O segundo policial sai da viatura.',
      'Agora não existe mais dúvida: eles acreditam que encontraram o suspeito que estavam procurando.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Central, possível positivo. Acho que encontrei o suspeito.',
    },

    choices: [
      {
        id:
          'recognized_surrender',

        text:
          'Manter as mãos visíveis e se entregar.',

        nextScene:
          'police_detained',

        timeMinutes:
          2,

        flags: {
          policeStopActive:
            true,

          policeTrouble:
            true,

          policeRecognizedPlayer:
            true,

          policeChase:
            false,
        },
      },

      {
        id:
          'recognized_show_document',

        text:
          'Entregar o documento e deixar o policial conferir seus dados.',

        nextScene:
          'police_identity_uncertain',

        timeMinutes:
          0,

        flags: {
          policeStopActive:
            true,

          policeTrouble:
            true,

          policeDocumentOffered:
            true,
        },
      },

      {
        id:
          'recognized_argue',

        text:
          'Dizer que eles estão confundindo você com outra pessoa.',

        nextScene:
          'police_questions',

        timeMinutes:
          1,

        flags: {
          policeRecognizedPlayer:
            true,

          policeTrouble:
            true,
        },
      },

      {
        id:
          'recognized_run',

        text:
          'Correr antes que eles consigam cercar você.',

        nextScene:
          'police_chase',

        timeMinutes:
          0,

        flags: {
          policeRecognizedPlayer:
            true,

          policeTrouble:
            true,

          policeStopActive:
            false,

          policeChase:
            true,

          escapedPolice:
            false,

          policeWantedRegistered:
            false,
        },
      },

      {
        id:
          'recognized_resist',

        text:
          'Resistir fisicamente à prisão.',

        nextScene:
          'police_force',

        timeMinutes:
          0,

        flags: {
          policeRecognizedPlayer:
            true,

          policeTrouble:
            true,

          policeViolence:
            true,

          policeStopActive:
            false,

          possibleMasqueradeRisk:
            true,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'recognized_dominate',

        powerId:
          'dominate_1',

        text:
          '"Você se enganou. Eu não sou quem procura."',

        description:
          'Tentar apagar a certeza imediata do policial com uma ordem direta.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_escalation',

        botchScene:
          'police_force',

        timeMinutes:
          1,

        successFlags: {
          policeRecognizedPlayer:
            false,

          policeStopActive:
            false,

          policeTrouble:
            false,
        },

        failureFlags: {
          policeRecognizedPlayer:
            true,

          policeEscalation:
            true,
        },

        botchFlags: {
          policeRecognizedPlayer:
            true,

          policeEscalation:
            true,

          possibleMasqueradeRisk:
            true,
        },
      },

      {
        id:
          'recognized_presence',

        powerId:
          'presence_1',

        text:
          'Usar Presença para fazê-los hesitar.',

        description:
          'Tentar transformar a certeza em dúvida e reduzir a hostilidade antes que eles avancem.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_released',

        failureScene:
          'police_escalation',

        botchScene:
          'police_force',

        timeMinutes:
          1,

        successFlags: {
          policeRecognizedPlayer:
            false,

          policeStopActive:
            false,

          policeTrouble:
            false,
        },

        failureFlags: {
          policeRecognizedPlayer:
            true,

          policeEscalation:
            true,
        },
      },

      {
        id:
          'recognized_dementia',

        powerId:
          'dementia_1',

        text:
          'Amplificar a insegurança do policial sobre o reconhecimento.',

        description:
          'Intensificar a dúvida até que ele comece a questionar a própria certeza.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_dementia_success',

        failureScene:
          'police_escalation',

        botchScene:
          'police_force',

        timeMinutes:
          1,

        successFlags: {
          policeRecognizedPlayer:
            false,

          policeTrouble:
            false,
        },

        failureFlags: {
          policeRecognizedPlayer:
            true,

          policeEscalation:
            true,
        },
      },

      {
        id:
          'recognized_obfuscate',

        powerId:
          'obfuscate_2',

        text:
          'Usar Ofuscação e desaparecer da atenção deles.',

        description:
          'Quebrar o foco dos policiais e sair do campo de atenção antes que a abordagem se feche.',

        target: {
          type:
            'environment',
        },

        nextScene:
          'police_obfuscate_escape',

        timeMinutes:
          1,

        successFlags: {
          policeRecognizedPlayer:
            false,

          policeStopActive:
            false,

          policeTrouble:
            false,

          policeChase:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeEscapeMethod:
            'obfuscation',

          policeWantedRegistered:
            false,
        },
      },
    ],
  },

  police_document_check: {
    id:
      'police_document_check',

    chapter:
      'A MÁSCARA',

    title:
      'Verificação',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O policial pega o documento.',
      'Ele olha para você.',
      'Depois olha novamente para a fotografia.',
      'A demora parece maior do que realmente é.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Espera aqui.',
    },

    choices: [
      {
        id:
          'police_wait',

        text:
          'Esperar sem chamar atenção.',

        nextScene:
          'police_detained',

        timeMinutes: 10,
      },

      {
        id:
          'police_nervous',

        text:
          'Perguntar por que está sendo parado.',

        nextScene:
          'police_questions',

        timeMinutes: 3,
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_document_dominate',

        powerId:
          'dominate_1',

        text:
          '"Está tudo certo com meus documentos."',

        description:
          'Tentar impor ao policial a certeza de que a verificação já foi concluída.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_questions',

        botchScene:
          'police_escalation',

        timeMinutes: 1,
      },

      {
        id:
          'police_document_presence',

        powerId:
          'presence_1',

        text:
          'Usar Presença para parecer confiável e inofensivo.',

        description:
          'Tentar transformar a suspeita em simpatia ou confiança.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_released',

        failureScene:
          'police_detained',

        botchScene:
          'police_questions',

        timeMinutes: 2,
      },

      {
        id:
          'police_document_auspex',

        powerId:
          'auspex_1',

        text:
          'Observar cuidadosamente as reações do policial.',

        description:
          'Aguçar os sentidos para descobrir se ele realmente suspeita de você.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        nextScene:
          'police_auspex_observation',

        timeMinutes: 0,
      },
    ],
  },

  police_questions: {
    id:
      'police_questions',

    chapter:
      'A MÁSCARA',

    title:
      'Perguntas Demais',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O policial ergue os olhos.',
      'Agora ele presta mais atenção no seu comportamento.',
      'A conversa deixou de ser burocrática.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Só estou fazendo meu trabalho. Tem algum problema com isso?',
    },

    choices: [
      {
        id:
          'police_back_down',

        text:
          'Recuar e aceitar a revista.',

        nextScene:
          'police_detained',

        timeMinutes: 5,
      },

      {
        id:
          'police_intimidate',

        text:
          'Tentar intimidá-lo.',

        nextScene:
          'police_escalation',

        timeMinutes: 2,

        flags: {
          policeEscalation:
            true,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_questions_dominate',

        powerId:
          'dominate_1',

        text:
          '"Pare de fazer perguntas."',

        description:
          'Uma ordem direta usando Dominação.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_escalation',

        botchScene:
          'police_escalation',

        timeMinutes: 1,
      },

      {
        id:
          'police_questions_presence',

        powerId:
          'presence_1',

        text:
          'Usar Presença para mudar o tom da conversa.',

        description:
          'Tentar transformar hostilidade em receptividade.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_released',

        failureScene:
          'police_detained',

        botchScene:
          'police_escalation',

        timeMinutes: 2,
      },

      {
        id:
          'police_questions_dementia',

        powerId:
          'dementia_1',

        text:
          'Amplificar a irritação do policial contra o próprio parceiro.',

        description:
          'Usar Demência para direcionar uma emoção já presente.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_dementia_success',

        failureScene:
          'police_escalation',

        botchScene:
          'police_escalation',

        timeMinutes: 1,
      },
    ],
  },

  police_lie_result: {
    id:
      'police_lie_result',

    chapter:
      'A MÁSCARA',

    title:
      'Uma História',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Você oferece uma explicação.',
      'O policial ouve sem interromper.',
      'A expressão dele não revela se acreditou.',
    ],

    choices: [
      {
        id:
          'police_lie_continue',

        text:
          'Manter a história.',

        nextScene:
          'police_detained',

        timeMinutes: 5,
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_lie_presence',

        powerId:
          'presence_1',

        text:
          'Reforçar a história com sua presença sobrenatural.',

        target: {
          id:
            'police_officer_1',

          type:
            'human',
        },

        successScene:
          'police_released',

        failureScene:
          'police_detained',

        botchScene:
          'police_questions',

        timeMinutes: 1,
      },

      {
        id:
          'police_lie_dominate',

        powerId:
          'dominate_1',

        text:
          '"Você acredita em mim."',

        target: {
          id:
            'police_officer_1',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_questions',

        botchScene:
          'police_escalation',

        timeMinutes: 1,
      },
    ],
  },

  police_leave_attempt: {
    id:
      'police_leave_attempt',

    chapter:
      'A MÁSCARA',

    title:
      'Não Tão Rápido',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Você dá um passo para se afastar.',
      'O policial imediatamente muda de postura.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Eu não falei que o senhor podia ir.',
    },

    choices: [
      {
        id:
          'police_stop',

        text:
          'Parar e aceitar a abordagem.',

        nextScene:
          'police_detained',

        timeMinutes: 2,
      },

      {
        id:
          'police_run',

        text:
          'Correr.',

        nextScene:
          'police_chase',

        timeMinutes: 1,

        flags: {
          policeChase:
            true,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_leave_dominate',

        powerId:
          'dominate_1',

        text:
          '"Você me deixou ir."',

        target: {
          id:
            'police_officer_1',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_escalation',

        botchScene:
          'police_escalation',

        timeMinutes: 1,
      },

      {
        id:
          'police_leave_obfuscate',

        powerId:
          'obfuscate_2',

        text:
          'Usar Ofuscação para desaparecer da atenção deles.',

        target: {
          type:
            'environment',
        },

        nextScene:
          'police_obfuscate_escape',

        timeMinutes: 1,
      },
    ],
  },

  police_escalation: {
    id:
      'police_escalation',

    chapter:
      'A MÁSCARA',

    title:
      'Mão no Coldre',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'A tentativa de intimidação muda completamente a situação.',
      'O policial recua meio passo.',
      'A mão fecha no cabo da arma.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Mãos onde eu possa ver. Agora.',
    },

    choices: [
      {
        id:
          'police_surrender',

        text:
          'Obedecer.',

        nextScene:
          'police_detained',

        timeMinutes: 5,
      },

      {
        id:
          'police_resist',

        text:
          'Resistir fisicamente.',

        nextScene:
          'police_force',

        timeMinutes: 1,

        flags: {
          policeViolence:
            true,

          possibleMasqueradeRisk:
            true,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_escalation_dominate',

        powerId:
          'dominate_1',

        text:
          '"Tire a mão da arma."',

        description:
          'Uma ordem curta e imediata.',

        target: {
          id:
            'police_officer_1',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_dominate_weapon_down',

        failureScene:
          'police_force',

        botchScene:
          'police_force',

        timeMinutes: 0,
      },

      {
        id:
          'police_escalation_dementia',

        powerId:
          'dementia_1',

        text:
          'Amplificar o medo do policial.',

        target: {
          id:
            'police_officer_1',

          type:
            'human',
        },

        successScene:
          'police_dementia_fear',

        failureScene:
          'police_force',

        botchScene:
          'police_force',

        timeMinutes: 0,
      },
    ],
  },

  police_detained: {
    id:
      'police_detained',

    chapter:
      'A MÁSCARA',

    title:
      'A Revista',

    policeSearchEncounter:
      true,

    location: {
      id:
        'street_police_search',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O policial manda você ficar de frente para o carro.',
      'Ele começa a verificar seus bolsos, a cintura e os objetos que você está carregando.',
      'Qualquer coisa incomum pode transformar uma abordagem simples em um problema muito maior.',
    ],

    choices: [],
  },

  police_item_questions: {
    id:
      'police_item_questions',

    chapter:
      'A MÁSCARA',

    title:
      'O Que É Isso?',

    location: {
      id:
        'street_police_search',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O policial ergue um dos objetos encontrados.',
      'Ele olha para você esperando uma explicação.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Quer me explicar por que está carregando isso?',
    },

    choices: [
      {
        id:
          'police_explain_item',

        text:
          'Dar uma explicação simples.',

        nextScene:
          'police_released',

        timeMinutes: 5,
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_item_dominate',

        powerId:
          'dominate_1',

        text:
          '"Isso não é importante."',

        target: {
          id:
            'police_officer_1',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_weapon_questions',

        botchScene:
          'police_escalation',

        timeMinutes: 1,
      },
    ],
  },

  police_weapon_questions: {
    id:
      'police_weapon_questions',

    chapter:
      'A MÁSCARA',

    title:
      'Uma Explicação Muito Boa',

    location: {
      id:
        'street_police_search',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O objeto encontrado muda o tom da abordagem.',
      'O segundo policial se aproxima.',
      'Agora os dois estão prestando atenção em cada movimento seu.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Fica parado. Você vai me explicar isso agora.',
    },

    choices: [
      {
        id:
          'police_weapon_cooperate',

        text:
          'Cooperar e tentar explicar.',

        nextScene:
          'police_released',

        timeMinutes: 10,
      },

      {
        id:
          'police_weapon_resist',

        text:
          'Recusar-se a cooperar.',

        nextScene:
          'police_escalation',

        timeMinutes: 2,

        flags: {
          policeEscalation:
            true,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_weapon_dominate',

        powerId:
          'dominate_1',

        text:
          '"Devolva o objeto e esqueça isso."',

        target: {
          id:
            'police_officer_1',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_escalation',

        botchScene:
          'police_force',

        timeMinutes: 1,
      },

      {
        id:
          'police_weapon_presence',

        powerId:
          'presence_1',

        text:
          'Usar Presença para diminuir a hostilidade dos policiais.',

        target: {
          id:
            'police_officer_1',

          type:
            'human',
        },

        successScene:
          'police_released',

        failureScene:
          'police_escalation',

        botchScene:
          'police_force',

        timeMinutes: 2,
      },
    ],
  },

  police_weapon_found: {
    id:
      'police_weapon_found',

    chapter:
      'A MÁSCARA',

    title:
      'A Situação Muda',

    location: {
      id:
        'street_police_search',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Assim que o policial encontra o objeto, sua postura muda.',
      'O outro policial se afasta um pouco e posiciona a mão perto da arma.',
      'Você percebe que qualquer movimento brusco agora terá consequências.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Não se mexe. Mãos onde eu possa ver.',
    },

    choices: [
      {
        id:
          'police_weapon_surrender',

        text:
          'Ficar imóvel e cooperar.',

        nextScene:
          'police_weapon_questions',

        timeMinutes: 5,
      },

      {
        id:
          'police_weapon_force',

        text:
          'Usar sua força para sair da situação.',

        nextScene:
          'police_force',

        timeMinutes: 1,

        flags: {
          policeViolence:
            true,

          possibleMasqueradeRisk:
            true,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_weapon_found_dominate',

        powerId:
          'dominate_1',

        text:
          '"Abaixe a arma."',

        target: {
          id:
            'police_officer_1',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_dominate_weapon_down',

        failureScene:
          'police_force',

        botchScene:
          'police_force',

        timeMinutes: 0,
      },
    ],
  },

  /*
    ========================================
    RESULTADOS ESPECIAIS DE DISCIPLINAS
    ========================================
  */

  police_auspex_observation: {
    id:
      'police_auspex_observation',

    chapter:
      'A MÁSCARA',

    title:
      'Detalhes',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Seus sentidos se aguçam.',
      'A respiração do policial está mais rápida do que o tom de voz sugere.',
      'Os dedos da mão direita permanecem próximos do coldre.',
      'Ele não parece ter certeza de que você representa uma ameaça.',
      'O segundo policial observa, mas ainda não decidiu intervir.',
      'A situação é tensa, mas ainda pode ser controlada.',
    ],

    choices: [
      {
        id:
          'auspex_cooperate',

        text:
          'Aproveitar a leitura da situação e cooperar.',

        nextScene:
          'police_document_check',

        timeMinutes: 1,
      },

      {
        id:
          'auspex_leave',

        text:
          'Tentar encerrar a conversa sem provocar o policial.',

        nextScene:
          'police_leave_attempt',

        timeMinutes: 1,
      },
    ],
  },

  police_dementia_success: {
    id:
      'police_dementia_success',

    chapter:
      'A MÁSCARA',

    title:
      'Uma Emoção Cresce',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'A emoção que já existia dentro do policial se intensifica.',
      'Ele olha para o parceiro.',
      'Por um momento, a atenção deixa de estar completamente voltada para você.',
      'A tensão entre os dois se torna perceptível.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Deixa comigo. Eu sei fazer meu trabalho.',
    },

    choices: [
      {
        id:
          'dementia_leave',

        text:
          'Aproveitar a distração e sair.',

        nextScene:
          'police_released',

        timeMinutes: 2,
      },
    ],
  },

  police_dementia_fear: {
    id:
      'police_dementia_fear',

    chapter:
      'A MÁSCARA',

    title:
      'Medo',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O medo que existia sob a superfície cresce de forma súbita.',
      'O policial dá meio passo para trás.',
      'A mão continua próxima à arma, mas agora a hesitação é evidente.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Fica aí.',
    },

    choices: [
      {
        id:
          'dementia_fear_leave',

        text:
          'Recuar lentamente e sair da situação.',

        nextScene:
          'police_released',

        timeMinutes: 2,
      },
    ],
  },

  police_obfuscate_escape: {
    id:
      'police_obfuscate_escape',

    chapter:
      'A MÁSCARA',

    title:
      'Fora de Atenção',

    location: {
      id:
        'street_after_police',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Você deixa de ocupar o centro da atenção deles.',
      'Não é uma invisibilidade literal.',
      'É como se os olhos simplesmente encontrassem coisas mais importantes para observar.',
      'Quando percebem, você já se afastou.',
    ],

    choices: [
      {
        id:
          'obfuscate_continue',

        text:
          'Continuar pela noite.',

        nextScene:
          'free_roam',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeTrouble:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            false,

          policeEscapeMethod:
            'obfuscation',
        },
      },
    ],
  },

  police_dominate_weapon_down: {
    id:
      'police_dominate_weapon_down',

    chapter:
      'A MÁSCARA',

    title:
      'A Ordem',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Por um instante, toda a atenção do policial fica presa às suas palavras.',
      'A mão se afasta lentamente do coldre.',
      'Ele parece confuso sobre por que havia se preparado para sacar a arma.',
    ],

    choices: [
      {
        id:
          'dominate_weapon_leave',

        text:
          'Encerrar a situação antes que ele volte a desconfiar.',

        nextScene:
          'police_released',

        timeMinutes: 1,
      },
    ],
  },

    police_identity_confirmed: {
    id:
      'police_identity_confirmed',

    chapter:
      'A MÁSCARA',

    title:
      'Identidade Confirmada',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O policial pega o documento e compara os dados com as informações recebidas.',
      'O olhar dele passa da fotografia para o seu rosto.',
      'Desta vez a hesitação desaparece.',
      'O segundo policial se aproxima e muda de posição para bloquear sua rota de fuga.',
      'A abordagem deixou de ser uma suspeita: para eles, sua identidade está confirmada.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Confirmado. É ele. Mantenha as mãos onde eu possa ver.',
    },

    choices: [
      {
        id:
          'identity_confirmed_cooperate',

        text:
          'Cooperar e se entregar.',

        nextScene:
          'police_detained',

        timeMinutes:
          2,

        flags: {
          policeIdentityConfirmed:
            true,

          policeRecognizedPlayer:
            true,

          policeTrouble:
            true,

          policeStopActive:
            true,

          policeChase:
            false,
        },
      },

      {
        id:
          'identity_confirmed_argue',

        text:
          'Insistir que existe algum erro nos registros.',

        nextScene:
          'police_escalation',

        timeMinutes:
          1,

        flags: {
          policeIdentityConfirmed:
            true,

          policeRecognizedPlayer:
            true,

          policeTrouble:
            true,

          policeEscalation:
            true,
        },
      },

      {
        id:
          'identity_confirmed_run',

        text:
          'Correr antes que eles coloquem as algemas.',

        nextScene:
          'police_chase',

        timeMinutes:
          0,

        flags: {
          policeIdentityConfirmed:
            true,

          policeRecognizedPlayer:
            true,

          policeTrouble:
            true,

          policeStopActive:
            false,

          policeChase:
            true,

          escapedPolice:
            false,
        },
      },

      {
        id:
          'identity_confirmed_resist',

        text:
          'Resistir fisicamente à prisão.',

        nextScene:
          'police_force',

        timeMinutes:
          0,

        flags: {
          policeIdentityConfirmed:
            true,

          policeRecognizedPlayer:
            true,

          policeTrouble:
            true,

          policeStopActive:
            false,

          policeViolence:
            true,

          possibleMasqueradeRisk:
            true,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'identity_confirmed_dominate',

        powerId:
          'dominate_1',

        text:
          '"Você verificou errado. Guarde o documento."',

        description:
          'Tentar impor uma ordem direta mesmo depois da confirmação.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_force',

        botchScene:
          'police_force',

        timeMinutes:
          1,

        successFlags: {
          policeStopActive:
            false,

          policeTrouble:
            false,

          policeRecognizedPlayer:
            false,
        },

        failureFlags: {
          policeIdentityConfirmed:
            true,

          policeRecognizedPlayer:
            true,

          policeEscalation:
            true,
        },
      },

      {
        id:
          'identity_confirmed_presence',

        powerId:
          'presence_1',

        text:
          'Usar Presença para fazê-los hesitar antes da prisão.',

        description:
          'Tentar reduzir a hostilidade e criar um instante de dúvida.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_questions',

        failureScene:
          'police_force',

        botchScene:
          'police_force',

        timeMinutes:
          1,
      },

      {
        id:
          'identity_confirmed_dementia',

        powerId:
          'dementia_1',

        text:
          'Amplificar a insegurança do policial sobre a conferência.',

        description:
          'Mexer com a emoção do policial para enfraquecer a certeza do momento.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_questions',

        failureScene:
          'police_force',

        botchScene:
          'police_force',

        timeMinutes:
          1,
      },

      {
        id:
          'identity_confirmed_obfuscate',

        powerId:
          'obfuscate_2',

        text:
          'Tentar desaparecer da atenção deles antes das algemas.',

        description:
          'Usar Ofuscação para quebrar a atenção dos policiais e sair da abordagem.',

        target: {
          type:
            'environment',
        },

        nextScene:
          'police_obfuscate_escape',

        timeMinutes:
          1,

        successFlags: {
          policeStopActive:
            false,

          policeObfuscateEscape:
            true,
        },
      },
    ],
  },

  police_identity_uncertain: {
    id:
      'police_identity_uncertain',

    chapter:
      'A MÁSCARA',

    title:
      'Ainda Há Dúvida',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O policial confere o documento com atenção.',
      'Ele olha novamente para você e depois para as informações disponíveis.',
      'Alguma coisa não fecha perfeitamente.',
      'A semelhança existe, mas a confirmação não é forte o bastante para encerrar a dúvida.',
      'Você ganhou alguns segundos, não necessariamente sua liberdade.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Espera aí. Fica parado enquanto eu confirmo uma coisa.',
    },

    choices: [
      {
        id:
          'identity_uncertain_cooperate',

        text:
          'Continuar cooperando e responder às perguntas.',

        nextScene:
          'police_questions',

        timeMinutes:
          2,

        flags: {
          policeIdentityConfirmed:
            false,

          policeRecognitionUncertain:
            true,

          policeStopActive:
            true,

          policeTrouble:
            true,
        },
      },

      {
        id:
          'identity_uncertain_argue',

        text:
          'Aproveitar a dúvida e insistir que houve um engano.',

        nextScene:
          'police_released',

        timeMinutes:
          1,

        flags: {
          policeIdentityConfirmed:
            false,

          policeRecognizedPlayer:
            false,

          policeRecognitionDisputed:
            true,

          policeStopActive:
            false,

          policeTrouble:
            false,
        },
      },

      {
        id:
          'identity_uncertain_run',

        text:
          'Aproveitar a hesitação e fugir.',

        nextScene:
          'police_chase',

        timeMinutes:
          0,

        flags: {
          policeIdentityConfirmed:
            false,

          policeTrouble:
            true,

          policeStopActive:
            false,

          policeChase:
            true,

          escapedPolice:
            false,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'identity_uncertain_dominate',

        powerId:
          'dominate_1',

        text:
          '"Você já conferiu. Está tudo certo."',

        description:
          'Usar a dúvida existente para impor uma conclusão simples.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',

          requiresEyeContact:
            true,

          eyeContact:
            true,
        },

        successScene:
          'police_released',

        failureScene:
          'police_escalation',

        botchScene:
          'police_force',

        timeMinutes:
          1,

        successFlags: {
          policeStopActive:
            false,

          policeTrouble:
            false,

          policeRecognizedPlayer:
            false,
        },
      },

      {
        id:
          'identity_uncertain_presence',

        powerId:
          'presence_1',

        text:
          'Usar Presença para tornar sua versão mais aceitável.',

        description:
          'Aproveitar a incerteza do policial para reduzir a suspeita.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_released',

        failureScene:
          'police_questions',

        botchScene:
          'police_escalation',

        timeMinutes:
          1,
      },

      {
        id:
          'identity_uncertain_dementia',

        powerId:
          'dementia_1',

        text:
          'Amplificar a dúvida que ele já está sentindo.',

        description:
          'Transformar uma pequena incerteza em uma convicção de que a identificação pode estar errada.',

        target: {
          id:
            'police_officer_1',

          name:
            'Policial',

          type:
            'human',
        },

        successScene:
          'police_released',

        failureScene:
          'police_questions',

        botchScene:
          'police_escalation',

        timeMinutes:
          1,
      },

      {
        id:
          'identity_uncertain_obfuscate',

        powerId:
          'obfuscate_2',

        text:
          'Sair da atenção deles enquanto ainda estão em dúvida.',

        description:
          'Usar Ofuscação para abandonar a abordagem antes de uma nova confirmação.',

        target: {
          type:
            'environment',
        },

        nextScene:
          'police_obfuscate_escape',

        timeMinutes:
          1,

        successFlags: {
          policeStopActive:
            false,

          policeObfuscateEscape:
            true,
        },
      },
    ],
  },

  police_chase: {
    id:
      'police_chase',

    chapter:
      'A MÁSCARA',

    title:
      'Correndo',

    location: {
      id:
        'street_police_chase',

      name:
        'Ruas de São Paulo',

      district:
        'São Paulo',
    },

    narration: [
      'Você dispara pela calçada.',
      'Atrás de você, o policial grita.',
      'A porta da viatura bate.',
      'A perseguição começou.',
      'Você precisa abrir distância antes que eles consigam cercar você.',
    ],

    choices: [
      {
        id:
          'try_escape',

        text:
          'Continuar correndo e tentar abrir distância.',

        nextScene:
          'police_chase',

        timeMinutes:
          0,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,
        },
      },

      {
        id:
          'jump_obstacle',

        text:
          'Pular um muro ou obstáculo para despistar os policiais.',

        nextScene:
          'police_chase',

        timeMinutes:
          0,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,
        },
      },

      {
        id:
          'enter_alley',

        text:
          'Entrar em uma viela e procurar uma rota alternativa.',

        nextScene:
          'police_chase',

        timeMinutes:
          0,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,
        },
      },

      {
        id:
          'hide',

        text:
          'Quebrar a linha de visão e procurar um lugar para se esconder.',

        nextScene:
          'police_chase',

        timeMinutes:
          0,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_chase_obfuscate',

        powerId:
          'obfuscate_2',

        text:
          'Usar Ofuscação para desaparecer da atenção dos policiais.',

        description:
          'Quebrar a perseguição ao deixar de ocupar o foco da atenção deles.',

        target: {
          type:
            'environment',
        },

        nextScene:
          'police_obfuscate_escape',

        timeMinutes:
          1,

        successFlags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeEscapeMethod:
            'obfuscation',
        },
      },

      {
        id:
          'police_chase_celerity',

        powerId:
          'celerity_1',

        text:
          'Usar Celeridade para abrir distância imediatamente.',

        description:
          'Gastar sangue e correr em velocidade sobrenatural. Se os policiais perceberem claramente o que aconteceu, isso pode ameaçar a Máscara.',

        target: {
          type:
            'self',
        },

        nextScene:
          'police_celerity_escape',

        timeMinutes:
          0,

        context: {
          visible:
            true,

          witnesses: [
            {
              id:
                'police_chase_officer_1',

              name:
                'Policial',

              type:
                'human',

              sawDiscipline:
                true,

              knowsSupernatural:
                false,

              credibility:
                3,
            },

            {
              id:
                'police_chase_officer_2',

              name:
                'Policial',

              type:
                'human',

              sawDiscipline:
                true,

              knowsSupernatural:
                false,

              credibility:
                3,
            },
          ],
        },

        successFlags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeWitnessedSupernatural:
            true,

          possibleMasqueradeRisk:
            true,

          policeEscapeMethod:
            'celerity',
        },
      },
    ],
  },

  police_chase_continues: {
    id:
      'police_chase_continues',

    chapter:
      'A MÁSCARA',

    title:
      'Eles Ainda Estão Atrás',

    location: {
      id:
        'street_police_chase',

      name:
        'Ruas de São Paulo',

      district:
        'São Paulo',
    },

    narration: [
      'Você dobra uma esquina e força o ritmo.',
      'Por alguns segundos parece que conseguiu abrir distância.',
      'Então você escuta passos novamente.',
      'Os policiais ainda estão atrás de você.',
      'A perseguição está ficando mais difícil.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Para! Polícia!',
    },

    choices: [
      {
        id:
          'try_escape_again',

        text:
          'Forçar o ritmo e continuar correndo.',

        nextScene:
          'police_chase_continues',

        timeMinutes:
          0,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,
        },
      },

      {
        id:
          'jump_obstacle_again',

        text:
          'Tentar superar outro obstáculo.',

        nextScene:
          'police_chase_continues',

        timeMinutes:
          0,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,
        },
      },

      {
        id:
          'enter_alley_again',

        text:
          'Entrar em uma viela e apostar em outra rota.',

        nextScene:
          'police_chase_continues',

        timeMinutes:
          0,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,
        },
      },

      {
        id:
          'hide_again',

        text:
          'Tentar desaparecer da linha de visão e se esconder.',

        nextScene:
          'police_chase_continues',

        timeMinutes:
          0,

        flags: {
          policeChase:
            true,

          policeStopActive:
            false,
        },
      },
    ],

    disciplineChoices: [
      {
        id:
          'police_chase_continues_obfuscate',

        powerId:
          'obfuscate_2',

        text:
          'Usar Ofuscação para desaparecer da perseguição.',

        description:
          'Sumir da atenção dos policiais antes que eles fechem a distância.',

        target: {
          type:
            'environment',
        },

        nextScene:
          'police_obfuscate_escape',

        timeMinutes:
          1,

        successFlags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeEscapeMethod:
            'obfuscation',
        },
      },

      {
        id:
          'police_chase_continues_celerity',

        powerId:
          'celerity_1',

        text:
          'Usar Celeridade para romper a perseguição.',

        description:
          'Gastar sangue para atingir velocidade sobrenatural diante dos policiais.',

        target: {
          type:
            'self',
        },

        nextScene:
          'police_celerity_escape',

        timeMinutes:
          0,

        context: {
          visible:
            true,

          witnesses: [
            {
              id:
                'police_chase_officer_1',

              name:
                'Policial',

              type:
                'human',

              sawDiscipline:
                true,

              knowsSupernatural:
                false,

              credibility:
                3,
            },

            {
              id:
                'police_chase_officer_2',

              name:
                'Policial',

              type:
                'human',

              sawDiscipline:
                true,

              knowsSupernatural:
                false,

              credibility:
                3,
            },
          ],
        },

        successFlags: {
          policeChase:
            false,

          policeStopActive:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeWitnessedSupernatural:
            true,

          possibleMasqueradeRisk:
            true,

          policeEscapeMethod:
            'celerity',
        },
      },
    ],
  },

  police_chase_escape: {
    id:
      'police_chase_escape',

    chapter:
      'A MÁSCARA',

    title:
      'Você os Despistou',

    location: {
      id:
        'street_after_police',

      name:
        'Ruas de São Paulo',

      district:
        'São Paulo',
    },

    narration: [
      'Você muda de direção entre duas ruas.',
      'Passa por um corredor estreito entre os prédios e continua correndo.',
      'Os gritos ficam mais distantes.',
      'Depois de alguns minutos, você não escuta mais passos atrás de você.',
      'Você conseguiu escapar.',
      'Isso não significa que a polícia esqueceu seu rosto.',
    ],

    choices: [
      {
        id:
          'chase_escape_continue',

        text:
          'Voltar para a noite.',

        nextScene:
          'free_roam',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeTrouble:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,
        },
      },
    ],
  },

  police_celerity_escape: {
    id:
      'police_celerity_escape',

    chapter:
      'A MÁSCARA',

    title:
      'Rápido Demais',

    location: {
      id:
        'street_after_police',

      name:
        'Ruas de São Paulo',

      district:
        'São Paulo',
    },

    narration: [
      'Você libera o sangue e seu corpo responde imediatamente.',
      'O mundo parece desacelerar ao redor.',
      'Seus passos cobrem a distância rápido demais para qualquer perseguição humana.',
      'Em segundos, os policiais ficam para trás.',
      'Quando eles alcançam a próxima esquina, você já está longe.',
      'Mas pelo menos um deles viu o suficiente para saber que aquilo não foi normal.',
    ],

    dialogue: {
      speaker:
        'A Voz',

      text:
        'Parabéns. Você fugiu. Agora só precisa torcer para ninguém acreditar no que eles viram.',
    },

    choices: [
      {
        id:
          'celerity_escape_continue',

        text:
          'Diminuir o ritmo e voltar para a noite.',

        nextScene:
          'free_roam',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeTrouble:
            false,

          escapedPolice:
            true,

          policeLookingForPlayer:
            true,

          policeWitnessedSupernatural:
            true,

          possibleMasqueradeRisk:
            true,

          policeEscapeMethod:
            'celerity',
        },
      },
    ],
  },

  police_chase_caught: {
    id:
      'police_chase_caught',

    chapter:
      'A MÁSCARA',

    title:
      'Alcançado',

    location: {
      id:
        'street_police_chase',

      name:
        'Ruas de São Paulo',

      district:
        'São Paulo',
    },

    narration: [
      'Você não consegue abrir distância.',
      'Um dos policiais corta seu caminho enquanto o outro se aproxima por trás.',
      'A fuga terminou.',
      'Agora eles não estão mais tratando isso como uma abordagem de rotina.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'No chão! Agora!',
    },

    choices: [
      {
        id:
          'chase_caught_surrender',

        text:
          'Parar e se render.',

        nextScene:
          'police_detained',

        timeMinutes:
          2,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeTrouble:
            true,

          policeChaseCaught:
            true,
        },
      },

      {
        id:
          'chase_caught_resist',

        text:
          'Resistir fisicamente.',

        nextScene:
          'police_force',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeTrouble:
            true,

          policeViolence:
            true,

          possibleMasqueradeRisk:
            true,
        },
      },
    ],
  },

  /*
    police_force existe também em
    policeForceScenes.js e será sobrescrito
    por aquela versão no index.js.
  */

  police_force: {
    id:
      'police_force',

    chapter:
      'A MÁSCARA',

    title:
      'Força Demais',

    location: {
      id:
        'street_police_stop',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'A situação atingiu o limite.',
    ],

    choices: [],
  },

  police_released: {
    id:
      'police_released',

    chapter:
      'A MÁSCARA',

    title:
      'Pode Ir',

    location: {
      id:
        'street_after_police',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'A tensão diminui.',
      'Por enquanto, a abordagem terminou.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Pode ir.',
    },

    choices: [
      {
        id:
          'police_released_continue',

        text:
          'Continuar pela noite.',

        nextScene:
          'free_roam',

        timeMinutes:
          1,

        flags: {
          policeChase:
            false,

          policeStopActive:
            false,

          policeTrouble:
            false,
        },
      },
    ],
  },
}

export default policeScenes