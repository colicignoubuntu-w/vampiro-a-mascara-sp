const hungerScenes = {
  hunger_test: {
    id: 'hunger_test',

    chapter: 'TESTE DE SISTEMA',

    title: 'Sangue na Calçada',

    location: {
      id: 'hunger_test_street',
      name: 'Rua',
      district: 'São Paulo',
    },

    narration: [
      'Um homem está sentado contra a parede de uma loja fechada.',

      'Há um corte profundo em seu antebraço.',

      'Talvez tenha acabado de sair de uma briga.',

      'O sangue escorre pelos dedos e pinga na calçada.',

      'Você percebe o cheiro antes de perceber qualquer outra coisa.',

      'Quente.',

      'Fresco.',

      'Vivo.',

      'Sua boca se enche de saliva.',

      'Os músculos do seu maxilar ficam tensos.',

      'Por um instante, todos os sons da rua parecem desaparecer.',

      'Só existe o sangue.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Você está com fome.',
    },

    frenzyTrigger: {
      id: 'fresh_blood',

      type: 'hunger',

      title: 'Sangue fresco',

      description:
        'Um humano ferido está próximo e sua fome reage imediatamente.',

      difficulty: 6,

      onlyWhenHungry: true,

      successScene:
        'hunger_resisted',

      failureOutcomes: [
        {
          id: 'hunger_feed_short',

          title:
            'Quando a Fome Passa',

          durationMinutes: 12,

          bloodGain: 5,

          endScene:
            'hunger_after_frenzy',

          location: {
            id: 'hunger_test_alley',
            name: 'Beco',
            district: 'São Paulo',
          },

          remembered: true,

          memories: [
            'Você lembra de atravessar a rua sem prestar atenção aos carros.',

            'Lembra do homem tentando afastar você.',

            'Lembra do gosto do sangue.',
          ],

          narration: [
            'Sua consciência retorna aos poucos.',

            'Você está ajoelhado em um beco.',

            'Há sangue em suas mãos.',

            'Sua fome diminuiu.',

            'Você lembra do homem ferido.',

            'E lembra de não ter conseguido parar imediatamente.',
          ],

          flags: {
            fedDuringFrenzy: true,
          },

          humanityCheckRequired: true,
        },
      ],

      criticalOutcomes: [
        {
          id: 'hunger_violent_blackout',

          title:
            'Horas Perdidas',

          durationMinutes: 187,

          bloodSet: 'maximum',

          endScene:
            'hunger_after_violent_frenzy',

          location: {
            id: 'player_apartment',
            name: 'Seu Apartamento',
            district: 'São Paulo',
          },

          remembered: true,

          masqueradeRisk: 2,

          humanityCheckRequired: true,

          flags: {
            fedDuringFrenzy: true,
            violentFrenzyOccurred: true,
            bloodEvidenceAtHome: true,
            policeNearby: true,
            possibleVictimDeath: true,
          },

          memories: [
            'Você lembra do homem tentando fugir.',

            'Lembra de alguém gritando para você parar.',

            'Lembra de empurrar alguém contra uma parede.',

            'Lembra de suas chaves cobertas de sangue.',

            'Lembra de fechar a porta do apartamento.',
          ],

          narration: [
            'Você abre os olhos.',

            'Por alguns segundos não entende onde está.',

            'Então reconhece sua sala.',

            'Há sangue no piso.',

            'Sangue seco em suas mãos.',

            'Uma cadeira está caída.',

            'Sua camisa está coberta de manchas escuras.',

            'Você olha para o relógio.',

            'Horas se passaram.',

            'Uma sirene soa na rua.',

            'Depois outra.',

            'E as lembranças começam a voltar.',
          ],
        },
      ],
    },

    choices: [],
  },

  hunger_resisted: {
    id: 'hunger_resisted',

    chapter: 'TESTE DE SISTEMA',

    title: 'Controle',

    location: {
      id: 'hunger_test_street',
      name: 'Rua',
      district: 'São Paulo',
    },

    narration: [
      'A fome atravessa seu corpo como uma descarga.',

      'Seus caninos pressionam seus lábios.',

      'Por alguns segundos você deseja apenas atravessar a distância entre vocês e beber.',

      'Mas você não se move.',

      'A Besta recua.',

      'Não desaparece.',

      'Apenas espera.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Dessa vez você ganhou.',
    },

    choices: [
      {
        id: 'leave',

        text:
          'Se afastar do homem ferido.',

        nextScene:
          'security_exit',

        timeMinutes: 2,
      },
    ],
  },

  hunger_after_frenzy: {
    id: 'hunger_after_frenzy',

    chapter: 'TESTE DE SISTEMA',

    title: 'Depois da Fome',

    location: {
      id: 'hunger_test_alley',
      name: 'Beco',
      district: 'São Paulo',
    },

    narration: [
      'A fome diminuiu.',

      'E com ela sua consciência retorna.',

      'A cidade reaparece ao redor.',

      'Carros.',

      'Luzes.',

      'Pessoas.',

      'Consequências.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Bem-vindo de volta.',
    },

    choices: [
      {
        id: 'leave',

        text:
          'Sair dali.',

        nextScene:
          'security_exit',

        timeMinutes: 2,
      },
    ],
  },

  hunger_after_violent_frenzy: {
    id: 'hunger_after_violent_frenzy',

    chapter: 'TESTE DE SISTEMA',

    title: 'Sangue em Casa',

    location: {
      id: 'player_apartment',
      name: 'Seu Apartamento',
      district: 'São Paulo',
    },

    narration: [
      'Você está novamente no controle.',

      'O apartamento está silencioso.',

      'Há sangue demais para fingir que nada aconteceu.',

      'Você olha para suas mãos.',

      'Algumas lembranças ainda chegam fora de ordem.',

      'Mas não parecem sonhos.',

      'Você sabe que foi você.',

      'Lá fora, luzes vermelhas e azuis refletem por alguns segundos no teto.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Agora vem a parte em que você descobre quantos problemas trouxe para casa.',
    },

    choices: [
      {
        id: 'inspect_apartment',

        text:
          'Examinar o apartamento.',

        nextScene:
          'hunger_apartment_aftermath',

        timeMinutes: 3,
      },
    ],
  },

  hunger_apartment_aftermath: {
    id: 'hunger_apartment_aftermath',

    chapter: 'TESTE DE SISTEMA',

    title: 'Vestígios',

    location: {
      id: 'player_apartment',
      name: 'Seu Apartamento',
      district: 'São Paulo',
    },

    narration: [
      'Você força a mente a trabalhar.',

      'Há marcas no piso.',

      'Sangue próximo à porta.',

      'Uma toalha jogada no corredor.',

      'Seu celular está sobre a mesa.',

      'A tela mostra chamadas perdidas.',

      'Você ainda não sabe se a polícia está ali por sua causa.',

      'Mas sabe que precisa descobrir rapidamente.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Boa notícia: você chegou em casa. Má notícia: aparentemente trouxe a noite com você.',
    },

    choices: [],
  },
}

export default hungerScenes