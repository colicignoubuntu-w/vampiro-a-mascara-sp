const huntingScenes = {
  hunting_bar: {
    id: 'hunting_bar',

    chapter: 'CAÇA',

    title: 'Último Gole',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'O bar está cheio o bastante para esconder você, mas não tanto a ponto de impedir uma conversa.',

      'Copos batem contra o balcão. Uma guitarra distorcida toca baixo nas caixas de som.',

      'Você sente dezenas de pulsações ao seu redor.',

      'Agora que sabe o que procurar, é difícil ignorá-las.',

      'Uma mulher está sentada sozinha perto do fim do balcão.',

      'Um copo pela metade diante dela.',

      'Ela olha o celular, guarda, observa o salão e volta a beber.',

      'Parece estar esperando alguém.',

      'Ou desistindo de esperar.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Vai conversar ou pretende ficar contando batimentos a noite inteira?',
    },

    choices: [
      {
        id: 'friendly_conversation',

        text:
          'Puxar conversa de maneira natural.',

        nextScene:
          'hunting_failed_approach',

        timeMinutes: 4,
      },

      {
        id: 'read_mood',

        text:
          'Observar primeiro e tentar entender o estado emocional dela.',

        nextScene:
          'hunting_failed_approach',

        timeMinutes: 3,
      },

      {
        id: 'invent_story',

        text:
          'Inventar uma história para despertar curiosidade.',

        nextScene:
          'hunting_failed_approach',

        timeMinutes: 4,
      },

      {
        id: 'street_approach',

        text:
          'Usar sua experiência com pessoas da noite para abordar sem parecer estranho.',

        nextScene:
          'hunting_failed_approach',

        timeMinutes: 3,
      },

      {
        id: 'leave',

        text:
          'Decidir não caçar aqui.',

        nextScene:
          'hunting_leave_bar',

        timeMinutes: 2,
      },
    ],
  },

  hunting_charm_success: {
    id: 'hunting_charm_success',

    chapter: 'CAÇA',

    title: 'Conversa',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'Você se aproxima sem pressa.',

      'A conversa começa com alguma coisa banal.',

      'A música.',

      'O lugar.',

      'A hora.',

      'Poucos minutos depois, ela já não está olhando para o celular.',

      'Está olhando para você.',

      'Você percebe algo desconfortável.',

      'Uma parte de você está conversando.',

      'Outra está ouvindo o coração dela.',
    ],

    dialogue: {
      speaker: 'Marina',

      text:
        'Você sempre conversa com desconhecidos desse jeito ou eu tive sorte?',
    },

    choices: [
      {
        id: 'invite_private',

        text:
          'Sugerir um lugar mais tranquilo para conversar.',

        nextScene:
          'hunting_private_place',

        timeMinutes: 8,

        flags: {
          huntingApproachSucceeded: true,
        },
      },

      {
        id: 'keep_talking',

        text:
          'Continuar conversando antes de tentar qualquer coisa.',

        nextScene:
          'hunting_long_conversation',

        timeMinutes: 12,

        flags: {
          spentTimeWithMarina: true,
        },
      },

      {
        id: 'back_off',

        text:
          'Desistir da ideia de se alimentar dela.',

        nextScene:
          'hunting_leave_bar',

        timeMinutes: 2,

        flags: {
          sparedPotentialVictim: true,
        },
      },
    ],
  },

  hunting_empathy_success: {
    id: 'hunting_empathy_success',

    chapter: 'CAÇA',

    title: 'Sozinha',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'Você observa antes de agir.',

      'Ela não parece exatamente triste.',

      'Parece decepcionada.',

      'Olha para a porta sempre que alguém entra.',

      'A mensagem na tela do celular chega e ela nem abre.',

      'Quem quer que ela estivesse esperando provavelmente não vem mais.',

      'Você sabe que uma abordagem agressiva seria um erro.',

      'Ela quer companhia, mas não quer admitir.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Solidão. Uma porta quase sempre destrancada.',
    },

    choices: [
      {
        id: 'gentle_approach',

        text:
          'Se aproximar sem pressioná-la.',

        nextScene:
          'hunting_charm_success',

        timeMinutes: 5,

        flags: {
          understoodMarinaMood: true,
        },
      },

      {
        id: 'leave_her',

        text:
          'Deixá-la em paz.',

        nextScene:
          'hunting_leave_bar',

        timeMinutes: 1,

        flags: {
          sparedPotentialVictim: true,
        },
      },
    ],
  },

  hunting_manipulation_success: {
    id: 'hunting_manipulation_success',

    chapter: 'CAÇA',

    title: 'Uma História Interessante',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'A mentira surge naturalmente.',

      'Nada grande demais.',

      'Nada que exija prova imediata.',

      'Apenas o suficiente para fazer você parecer mais interessante do que realmente é.',

      'Ela ri de alguma coisa que você diz.',

      'O pulso em seu pescoço acelera um pouco.',
    ],

    dialogue: {
      speaker: 'Marina',

      text:
        'Tá. Agora eu fiquei curiosa.',
    },

    choices: [
      {
        id: 'invite_private',

        text:
          'Convidá-la para um lugar mais reservado.',

        nextScene:
          'hunting_private_place',

        timeMinutes: 7,

        flags: {
          liedDuringHunt: true,
          huntingApproachSucceeded: true,
        },
      },

      {
        id: 'stop',

        text:
          'Parar antes de levar a mentira adiante.',

        nextScene:
          'hunting_leave_bar',

        timeMinutes: 2,
      },
    ],
  },

  hunting_street_success: {
    id: 'hunting_street_success',

    chapter: 'CAÇA',

    title: 'Sem Parecer uma Ameaça',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'Você reconhece pequenos códigos daquele ambiente.',

      'Onde ficar.',

      'Quando falar.',

      'Quanto espaço deixar.',

      'Como não parecer alguém desesperado por atenção.',

      'Ela permite que você permaneça ao lado dela.',

      'A conversa começa.',
    ],

    dialogue: {
      speaker: 'Marina',

      text:
        'Você conhece bastante esse tipo de lugar, né?',
    },

    choices: [
      {
        id: 'continue',

        text:
          'Continuar a conversa.',

        nextScene:
          'hunting_charm_success',

        timeMinutes: 5,

        flags: {
          usedStreetwiseToHunt: true,
        },
      },
    ],
  },

  hunting_failed_approach: {
    id: 'hunting_failed_approach',

    chapter: 'CAÇA',

    title: 'Sem Interesse',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'A conversa não encaixa.',

      'Ela responde por educação, mas volta a olhar para o celular.',

      'Você reconhece o sinal.',

      'Insistir chamaria mais atenção do que vale a pena.',
    ],

    dialogue: {
      speaker: 'Marina',

      text:
        'Desculpa. Eu realmente não estou muito a fim de conversar agora.',
    },

    choices: [
      {
        id: 'respect',

        text:
          'Respeitar e se afastar.',

        nextScene:
          'hunting_bar_after_failure',

        timeMinutes: 2,

        flags: {
          huntingAttemptFailed: true,
        },
      },

      {
        id: 'insist',

        text:
          'Insistir mesmo assim.',

        nextScene:
          'hunting_insistence',

        timeMinutes: 2,

        flags: {
          ignoredSocialBoundary: true,
        },
      },
    ],
  },

  hunting_bar_after_failure: {
    id: 'hunting_bar_after_failure',

    chapter: 'CAÇA',

    title: 'Outra Presa',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'Você volta a observar o salão.',

      'A fome não desapareceu.',

      'Só aquela oportunidade.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'A cidade tem milhões de pessoas. Não precisa transformar toda rejeição em uma tragédia.',
    },

    choices: [
      {
        id: 'try_again',

        text:
          'Procurar outra oportunidade.',

        nextScene:
          'hunting_bar',

        timeMinutes: 8,
      },

      {
        id: 'leave',

        text:
          'Sair do bar.',

        nextScene:
          'hunting_leave_bar',

        timeMinutes: 2,
      },
    ],
  },

  hunting_insistence: {
    id: 'hunting_insistence',

    chapter: 'CAÇA',

    title: 'Atenção Indesejada',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'Você insiste.',

      'A expressão dela muda imediatamente.',

      'Não é mais desinteresse.',

      'É desconforto.',

      'Um homem sentado dois bancos adiante percebe a situação.',

      'O bartender também.',
    ],

    dialogue: {
      speaker: 'Marina',

      text:
        'Eu falei que não quero.',
    },

    choices: [
      {
        id: 'leave_now',

        text:
          'Recuar e sair dali.',

        nextScene:
          'hunting_leave_bar',

        timeMinutes: 2,

        flags: {
          drewAttentionDuringHunt: true,
        },
      },
    ],
  },

  hunting_long_conversation: {
    id: 'hunting_long_conversation',

    chapter: 'CAÇA',

    title: 'Mais uma Bebida',

    location: {
      id: 'ultimo_gole',
      name: 'Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'Vocês continuam conversando.',

      'Ela pede mais uma bebida.',

      'Você finge beber a sua.',

      'Por alguns minutos quase consegue esquecer por que se aproximou.',

      'Então o coração dela acelera quando vocês se aproximam para ouvir um ao outro sobre a música.',

      'A fome lembra você.',
    ],

    dialogue: {
      speaker: 'Marina',

      text:
        'Aqui está impossível conversar. Quer ir para um lugar mais quieto?',
    },

    choices: [
      {
        id: 'go',

        text:
          'Ir com ela.',

        nextScene:
          'hunting_private_place',

        timeMinutes: 10,

        flags: {
          marinaInvitedPlayer: true,
        },
      },

      {
        id: 'decline',

        text:
          'Recusar e ir embora.',

        nextScene:
          'hunting_leave_bar',

        timeMinutes: 2,
      },
    ],
  },

  hunting_private_place: {
    id: 'hunting_private_place',

    chapter: 'CAÇA',

    title: 'Longe dos Olhares',

    location: {
      id: 'ultimo_gole_private',
      name: 'Corredor Reservado',
      district: 'São Paulo',
    },

    narration: [
      'A música fica abafada atrás da porta.',

      'Vocês estão longe da parte mais movimentada do bar.',

      'Ela está perto o suficiente para que você consiga ouvir claramente o coração.',

      'A fome se concentra.',

      'Agora existe uma escolha que não existia quando você ainda era humano.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Com cuidado. Ou isso vira outro tipo de noite.',
    },

    choices: [
      {
        id: 'feed',

        text:
          'Aproximar-se e se alimentar.',

        nextScene:
          'feeding_marina',

        timeMinutes: 1,

        flags: {
          voluntarilyFed: true,
        },
      },

      {
        id: 'stop',

        text:
          'Mudar de ideia e não se alimentar dela.',

        nextScene:
          'hunting_spare_marina',

        timeMinutes: 2,

        flags: {
          sparedMarina: true,
        },
      },
    ],
  },

  feeding_marina: {
    id: 'feeding_marina',

    chapter: 'CAÇA',

    title: 'O Beijo',

    location: {
      id: 'ultimo_gole_private',
      name: 'Corredor Reservado',
      district: 'São Paulo',
    },

    narration: [
      'Você se aproxima.',

      'Por um instante ainda percebe o perfume dela, a música distante e o som de passos do outro lado da parede.',

      'Então seus caninos encontram a pele.',

      'O primeiro gosto de sangue elimina todo o resto.',
    ],

    feedingEncounter: {
      id: 'marina_feeding',

      victim: {
        id: 'marina',
        name: 'Marina',
        blood: 10,
      },

      exitScene:
        'feeding_marina_after',

      deathScene:
        'feeding_marina_death',
    },

    choices: [],
  },

  feeding_marina_after: {
    id: 'feeding_marina_after',

    chapter: 'CAÇA',

    title: 'Depois do Beijo',

    location: {
      id: 'ultimo_gole_private',
      name: 'Corredor Reservado',
      district: 'São Paulo',
    },

    narration: [
      'Você afasta os dentes da pele dela.',

      'Uma pequena gota de sangue aparece onde os caninos estiveram.',

      'Por instinto, você passa a língua sobre a ferida.',

      'As marcas se fecham.',

      'Marina parece atordoada.',

      'A experiência foi intensa demais para que ela organize imediatamente o que aconteceu.',
    ],

    dialogue: {
      speaker: 'Marina',

      text:
        'Eu... acho que preciso sentar um pouco.',
    },

    choices: [
      {
        id: 'help',

        text:
          'Ajudá-la a se sentar e esperar alguns minutos.',

        nextScene:
          'hunting_leave_after_feed',

        timeMinutes: 8,

        flags: {
          caredForVictimAfterFeeding: true,
        },
      },

      {
        id: 'leave',

        text:
          'Sair antes que alguém apareça.',

        nextScene:
          'hunting_leave_after_feed',

        timeMinutes: 2,
      },
    ],
  },

  feeding_marina_death: {
    id: 'feeding_marina_death',

    chapter: 'CAÇA',

    title: 'Silêncio',

    location: {
      id: 'ultimo_gole_private',
      name: 'Corredor Reservado',
      district: 'São Paulo',
    },

    narration: [
      'Você finalmente se afasta.',

      'Ela não responde.',

      'Não existe mais pulsação.',

      'A satisfação da fome dura apenas alguns segundos.',

      'Depois vem a compreensão do que aconteceu.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Você poderia ter parado.',
    },

    choices: [
      {
        id: 'leave_body',

        text:
          'Olhar ao redor e tentar entender o que fazer.',

        nextScene:
          'feeding_death_consequence',

        timeMinutes: 2,

        flags: {
          killedMarinaByFeeding: true,
          humanityCheckRequired: true,
          masqueradeRisk: 1,
        },
      },
    ],
  },

  feeding_death_consequence: {
    id: 'feeding_death_consequence',

    chapter: 'CAÇA',

    title: 'Consequências',

    location: {
      id: 'ultimo_gole_private',
      name: 'Corredor Reservado',
      district: 'São Paulo',
    },

    narration: [
      'Há um corpo em um estabelecimento cheio de pessoas.',

      'Câmeras.',

      'Funcionários.',

      'Clientes.',

      'Talvez alguém tenha visto vocês saindo juntos.',

      'A fome está satisfeita.',

      'O problema apenas começou.',
    ],

    choices: [],
  },

  hunting_spare_marina: {
    id: 'hunting_spare_marina',

    chapter: 'CAÇA',

    title: 'Não Hoje',

    location: {
      id: 'ultimo_gole_private',
      name: 'Corredor Reservado',
      district: 'São Paulo',
    },

    narration: [
      'Você consegue sentir o sangue dela.',

      'Mesmo assim, recua.',

      'A fome protesta.',

      'Mas continua sendo sua decisão.',
    ],

    dialogue: {
      speaker: 'Marina',

      text:
        'Está tudo bem?',
    },

    choices: [
      {
        id: 'leave',

        text:
          '"Estou. Só preciso ir."',

        nextScene:
          'hunting_leave_bar',

        timeMinutes: 2,
      },
    ],
  },

  hunting_leave_after_feed: {
    id: 'hunting_leave_after_feed',

    chapter: 'CAÇA',

    title: 'De Volta à Noite',

    location: {
      id: 'ultimo_gole_street',
      name: 'Rua diante do Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'Você deixa o bar.',

      'A noite parece diferente com sangue novo correndo dentro de você.',

      'A fome está menor.',

      'Mas agora você entende por que os vampiros chamam aquilo de Beijo.',

      'E entende também o perigo de gostar demais.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Melhor, não é?',
    },

    choices: [],
  },

  hunting_leave_bar: {
    id: 'hunting_leave_bar',

    chapter: 'CAÇA',

    title: 'A Rua',

    location: {
      id: 'ultimo_gole_street',
      name: 'Rua diante do Último Gole',
      district: 'São Paulo',
    },

    narration: [
      'Você deixa o bar.',

      'A fome continua com você.',

      'São Paulo oferece milhões de possibilidades.',

      'E milhões de maneiras de cometer um erro.',
    ],

    choices: [],
  },
}

export default huntingScenes