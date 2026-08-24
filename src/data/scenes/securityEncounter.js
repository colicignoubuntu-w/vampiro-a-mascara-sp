const securityEncounterScenes = {
  security_approaches: {
    id: 'security_approaches',

    chapter: 'PRÓLOGO',

    title: 'O Segurança se Aproxima',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'Um segurança percebe seu estado e atravessa o salão em sua direção.',

      'Outro segurança acompanha a cena à distância.',

      'Algumas pessoas começam a olhar.',

      'Você percebe a mão do primeiro segurança próxima do rádio preso ao uniforme.',

      'Ele ainda não parece agressivo.',

      'Mas qualquer resposta errada pode transformar aquilo em um problema muito maior.',
    ],

    dialogue: {
      speaker: 'Segurança',

      text:
        'Senhor, fica onde está. O que aconteceu? Esse sangue é seu?',
    },

    choices: [
      {
        id: 'say_fight',

        text:
          '"Foi só uma briga. Eu estou bem."',

        nextScene:
          'security_generic_exit',

        timeMinutes: 1,
      },

      {
        id: 'girlfriend_story',

        text:
          '"Minha namorada se machucou. Eu estava tentando ajudar."',

        nextScene:
          'security_generic_exit',

        timeMinutes: 1,
      },

      {
        id: 'act_casual',

        text:
          'Agir como se aquilo não fosse nada e tentar fazê-lo perder o interesse.',

        nextScene:
          'security_generic_exit',

        timeMinutes: 1,
      },

      {
        id: 'intimidate',

        text:
          '"Não é problema seu."',

        nextScene:
          'security_generic_exit',

        timeMinutes: 1,
      },

      {
        id: 'scan_exit',

        text:
          'Observar rapidamente o salão e procurar a melhor saída.',

        nextScene:
          'security_generic_exit',

        timeMinutes: 1,
      },

      {
        id: 'walk_away',

        text:
          'Não responder e tentar ir embora.',

        nextScene:
          'security_walk_away',

        timeMinutes: 1,

        flags: {
          ignoredSecurity: true,
        },
      },
    ],
  },

  security_charm_success: {
    id: 'security_charm_success',

    chapter: 'PRÓLOGO',

    title: 'Uma Explicação Simples',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'O segurança olha para o sangue.',

      'Depois para seu rosto.',

      'Você mantém a voz firme o suficiente para parecer apenas cansado.',

      'A mão dele se afasta lentamente do rádio.',
    ],

    dialogue: {
      speaker: 'Segurança',

      text:
        'Tá. Mas você não pode ficar aqui desse jeito. Vai ao banheiro, se limpa e depois sai.',
    },

    choices: [
      {
        id: 'accept',

        text:
          'Agradecer e se afastar.',

        nextScene:
          'security_exit',

        timeMinutes: 2,

        flags: {
          convincedSecurity: true,
          securitySuspicious: false,
        },
      },
    ],
  },

  security_charm_failure: {
    id: 'security_charm_failure',

    chapter: 'PRÓLOGO',

    title: 'Ele Não Acreditou',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'O segurança permanece olhando para você.',

      'Sua explicação não parece ter convencido.',

      'O segundo segurança começa a atravessar o salão na direção de vocês.',
    ],

    dialogue: {
      speaker: 'Segurança',

      text:
        'Senhor, eu perguntei o que aconteceu.',
    },

    choices: [
      {
        id: 'try_again',

        text:
          'Tentar outra explicação.',

        nextScene:
          'security_approaches',

        timeMinutes: 1,

        flags: {
          securitySuspicious: true,
        },
      },

      {
        id: 'leave',

        text:
          'Tentar sair antes que o outro segurança chegue.',

        nextScene:
          'security_walk_away',

        timeMinutes: 1,

        flags: {
          securitySuspicious: true,
        },
      },
    ],
  },

  security_charm_botch: {
    id: 'security_charm_botch',

    chapter: 'PRÓLOGO',

    title: 'Atenção Demais',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'Sua história sai errada.',

      'Detalhes demais.',

      'Uma pausa no momento errado.',

      'O segurança olha novamente para a quantidade de sangue em sua roupa.',

      'Então aperta o botão do rádio.',

      'Algumas pessoas próximas começam a observar com mais atenção.',

      'Uma delas já está com o celular na mão.',
    ],

    dialogue: {
      speaker: 'Segurança',

      text:
        'Central, preciso de apoio aqui.',
    },

    choices: [
      {
        id: 'run',

        text:
          'Sair dali imediatamente.',

        nextScene:
          'security_escape',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
          masqueradeRisk: 1,
          securityCalledSupport: true,
        },
      },

      {
        id: 'stay',

        text:
          'Ficar e tentar controlar a situação.',

        nextScene:
          'security_backup',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
          masqueradeRisk: 1,
          securityCalledSupport: true,
        },
      },
    ],
  },

  security_manipulation_success: {
    id: 'security_manipulation_success',

    chapter: 'PRÓLOGO',

    title: 'Uma História Convincente',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'Você improvisa uma história rapidamente.',

      'Mantém os detalhes simples.',

      'A preocupação no rosto do segurança muda de suspeita para desconforto.',
    ],

    dialogue: {
      speaker: 'Segurança',

      text:
        'Certo. Vai se limpar. Se precisar de ambulância, avisa.',
    },

    choices: [
      {
        id: 'leave',

        text:
          'Concordar e sair.',

        nextScene:
          'security_exit',

        timeMinutes: 2,

        flags: {
          liedToSecurity: true,
          convincedSecurity: true,
        },
      },
    ],
  },

  security_intimidation_success: {
    id: 'security_intimidation_success',

    chapter: 'PRÓLOGO',

    title: 'Um Passo Atrás',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'Você responde sem elevar a voz.',

      'Mas alguma coisa em sua expressão faz o segurança hesitar.',

      'Por um instante ele parece esquecer que estava no controle da conversa.',
    ],

    dialogue: {
      speaker: 'Segurança',

      text:
        'Tá bom. Só... não causa problema aqui.',
    },

    choices: [
      {
        id: 'leave',

        text:
          'Ir embora.',

        nextScene:
          'security_exit',

        timeMinutes: 1,

        flags: {
          intimidatedSecurity: true,
          securitySuspicious: true,
        },
      },
    ],
  },

  security_scan_success: {
    id: 'security_scan_success',

    chapter: 'PRÓLOGO',

    title: 'Uma Saída',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'Você ignora a primeira vontade de responder e observa o ambiente.',

      'Porta principal com segurança.',

      'Elevadores longe demais.',

      'Uma saída lateral próxima aos banheiros.',

      'Pouca gente olhando naquela direção.',

      'Você reconhece rapidamente a melhor rota.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Esquerda. Antes que o amigo dele resolva participar.',
    },

    choices: [
      {
        id: 'take_exit',

        text:
          'Seguir pela saída lateral.',

        nextScene:
          'security_escape',

        timeMinutes: 2,

        flags: {
          foundSafeExit: true,
        },
      },
    ],
  },

  security_walk_away: {
    id: 'security_walk_away',

    chapter: 'PRÓLOGO',

    title: 'Não Tão Rápido',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'Você simplesmente começa a andar.',

      'Atrás de você, o segurança chama novamente.',

      'Os passos dele ficam mais rápidos.',
    ],

    dialogue: {
      speaker: 'Segurança',

      text:
        'Senhor! Eu mandei ficar onde está.',
    },

    choices: [
      {
        id: 'stop',

        text:
          'Parar.',

        nextScene:
          'security_approaches',

        timeMinutes: 1,
      },

      {
        id: 'keep_going',

        text:
          'Continuar andando.',

        nextScene:
          'security_escape',

        timeMinutes: 2,

        flags: {
          ignoredSecurity: true,
          securitySuspicious: true,
        },
      },
    ],
  },

  security_backup: {
    id: 'security_backup',

    chapter: 'PRÓLOGO',

    title: 'Dois Seguranças',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'O segundo segurança chega.',

      'Agora os dois estão olhando para você.',

      'Um deles segura o rádio.',

      'O outro mantém distância suficiente para reagir.',

      'Você percebe olhares vindos de vários pontos do salão.',
    ],

    dialogue: {
      speaker: 'Segundo Segurança',

      text:
        'Vamos com calma. Mostra as mãos e explica o que aconteceu.',
    },

    choices: [
      {
        id: 'cooperate',

        text:
          'Tentar conversar.',

        nextScene:
          'security_approaches',

        timeMinutes: 2,
      },

      {
        id: 'escape',

        text:
          'Tentar escapar.',

        nextScene:
          'security_escape',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
          masqueradeRisk: 1,
        },
      },
    ],
  },

  security_escape: {
    id: 'security_escape',

    chapter: 'PRÓLOGO',

    title: 'Para a Rua',

    location: {
      id: 'street_outside_building',
      name: 'Rua',
      district: 'São Paulo',
    },

    narration: [
      'Você atravessa a saída e alcança a rua.',

      'O ar noturno atinge seu rosto.',

      'Atrás de você ainda existem vozes.',

      'Mas ninguém o alcançou.',

      'Por enquanto.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Muito discreto. Quase ninguém percebeu.',
    },

    choices: [
      {
        id: 'continue',

        text:
          'Seguir pela rua.',

        nextScene:
          'security_exit',

        timeMinutes: 3,
      },
    ],
  },

  security_exit: {
    id: 'security_exit',

    chapter: 'PRÓLOGO',

    title: 'Fora do Salão',

    location: {
      id: 'street_outside_building',
      name: 'Rua',
      district: 'São Paulo',
    },

    narration: [
      'Você deixa o salão para trás.',

      'A situação acabou sem polícia.',

      'Sem ambulância.',

      'Sem alguém descobrindo exatamente o que você é.',

      'Por enquanto, a Máscara continua intacta.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Primeira mentira da noite. Provavelmente não será a última.',
    },

    choices: [],
  },

  security_generic_exit: {
    id: 'security_generic_exit',

    chapter: 'PRÓLOGO',

    title: 'O Segurança',

    location: {
      id: 'building_lobby',
      name: 'Saguão',
      district: 'São Paulo',
    },

    narration: [
      'Você tenta responder.',

      'Por um instante o segurança apenas observa.',

      'O resultado dessa conversa dependerá de como você conduz a situação.',
    ],

    dialogue: {
      speaker: 'Segurança',

      text:
        'Estou ouvindo.',
    },

    choices: [],
  },
}

export default securityEncounterScenes