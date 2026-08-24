const frenzyDemoScenes = {
  /* =========================
     FOME
  ========================= */

  frenzy_hunger_demo: {
    id: 'frenzy_hunger_demo',

    chapter: 'TESTE DE SISTEMA',

    title: 'Sangue Fresco',

    location: {
      id: 'street_hunger_demo',
      name: 'Calçada',
      district: 'São Paulo',
    },

    narration: [
      'Um homem está encostado contra a parede.',

      'Há um corte profundo no antebraço.',

      'Sangue fresco escorre pelos dedos.',

      'Você sente o cheiro antes de perceber qualquer outra coisa.',

      'Seu corpo inteiro reage.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Você está com fome.',
    },

    frenzyTrigger: {
      id: 'fresh_blood_demo',

      type: 'hunger',

      title: 'Sangue fresco',

      description:
        'A fome reage violentamente à presença de sangue humano.',

      difficulty: 6,

      onlyWhenHungry: true,

      successScene:
        'frenzy_hunger_resisted',

      failureOutcomes: [
        {
          id: 'hunger_feed_short',

          title:
            'Quando a Fome Passa',

          durationMinutes: 12,

          bloodGain: 5,

          endScene:
            'frenzy_hunger_recovery',

          location: {
            id: 'alley_after_feeding',
            name: 'Beco',
            district: 'São Paulo',
          },

          remembered: true,

          memories: [
            'Você lembra de atravessar a rua sem olhar para os carros.',

            'Lembra do homem tentando empurrar você.',

            'Lembra do sangue quente em sua boca.',
          ],

          narration: [
            'A consciência retorna aos poucos.',

            'Você está ajoelhado atrás de uma caçamba de lixo.',

            'Há sangue em sua camisa.',

            'Sua fome diminuiu.',

            'Você sabe exatamente de quem era o sangue.',
          ],

          flags: {
            fedDuringFrenzy: true,
          },

          humanityCheckRequired:
            true,
        },
      ],

      criticalOutcomes: [
        {
          id:
            'hunger_apartment_blood',

          title:
            'Horas Perdidas',

          durationMinutes: 187,

          bloodSet:
            'maximum',

          endScene:
            'frenzy_hunger_apartment_recovery',

          location: {
            id:
              'player_apartment',

            name:
              'Seu Apartamento',

            district:
              'São Paulo',
          },

          remembered: true,

          masqueradeRisk: 2,

          humanityCheckRequired:
            true,

          flags: {
            violentFeeding:
              true,

            bloodEvidenceAtHome:
              true,

            policeNearby:
              true,

            possibleVictimDeath:
              true,
          },

          memories: [
            'Você lembra do homem gritando quando percebeu o que você era.',

            'Lembra de alguém tentando puxar você para longe.',

            'Lembra de um corredor que não reconhece.',

            'Lembra das suas chaves cobertas de sangue.',

            'Lembra de fechar a porta do apartamento.',
          ],

          narration: [
            'Você abre os olhos.',

            'Por alguns segundos não entende onde está.',

            'Então reconhece sua sala.',

            'Há sangue no piso.',

            'Sangue seco em suas mãos.',

            'Uma cadeira está caída.',

            'Sua camisa não é mais da cor que era antes.',

            'Você olha para o relógio.',

            'Horas se passaram.',

            'Uma sirene soa na rua.',

            'Depois outra.',

            'E você começa a lembrar.',
          ],
        },
      ],
    },

    choices: [],
  },

  frenzy_hunger_resisted: {
    id: 'frenzy_hunger_resisted',

    chapter: 'TESTE DE SISTEMA',

    title: 'Controle',

    location: {
      id: 'street_hunger_demo',
      name: 'Calçada',
      district: 'São Paulo',
    },

    narration: [
      'A fome exige que você avance.',

      'Você não avança.',

      'Seus caninos permanecem expostos por alguns segundos.',

      'Então a Besta recua.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Dessa vez.',
    },

    choices: [],
  },

  frenzy_hunger_recovery: {
    id: 'frenzy_hunger_recovery',

    chapter: 'TESTE DE SISTEMA',

    title: 'Depois da Fome',

    location: {
      id: 'alley_after_feeding',
      name: 'Beco',
      district: 'São Paulo',
    },

    narration: [
      'Você recuperou o controle.',

      'A fome diminuiu.',

      'Agora precisa descobrir o que fazer com as consequências.',
    ],

    choices: [],
  },

  frenzy_hunger_apartment_recovery: {
    id:
      'frenzy_hunger_apartment_recovery',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Sangue em Casa',

    location: {
      id:
        'player_apartment',

      name:
        'Seu Apartamento',

      district:
        'São Paulo',
    },

    narration: [
      'Você está novamente no controle.',

      'O apartamento está silencioso.',

      'Mas há sangue demais para fingir que nada aconteceu.',

      'Lá fora, luzes vermelhas e azuis refletem por alguns segundos no teto.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Agora vem a parte em que você descobre quantos problemas trouxe para casa.',
    },

    choices: [],
  },

  /* =========================
     RAIVA
  ========================= */

  frenzy_rage_demo: {
    id: 'frenzy_rage_demo',

    chapter: 'TESTE DE SISTEMA',

    title: 'Provocação',

    location: {
      id: 'night_bar',
      name: 'Bar',
      district: 'São Paulo',
    },

    narration: [
      'O homem empurra seu ombro pela segunda vez.',

      'Ele está bêbado.',

      'Os amigos dele riem.',

      'Então ele menciona sua família.',

      'A frase atravessa alguma coisa dentro de você.',
    ],

    dialogue: {
      speaker: 'Desconhecido',

      text:
        'Vai fazer o quê, esquisito?',
    },

    frenzyTrigger: {
      id:
        'severe_provocation',

      type: 'rage',

      title:
        'Provocação extrema',

      description:
        'Humilhação, agressão e raiva alimentam a Besta.',

      difficulty: 6,

      successScene:
        'frenzy_rage_resisted',

      failureOutcomes: [
        {
          id:
            'rage_bar_fight',

          title:
            'Depois da Briga',

          durationMinutes: 8,

          endScene:
            'frenzy_rage_recovery',

          location: {
            id: 'bar_alley',
            name: 'Beco atrás do Bar',
            district: 'São Paulo',
          },

          remembered: true,

          masqueradeRisk: 1,

          flags: {
            attackedProvoker:
              true,
          },

          memories: [
            'Você lembra do primeiro soco.',

            'Lembra de uma mesa caindo.',

            'Lembra de alguém gritando para você parar.',
          ],

          narration: [
            'Você volta a perceber o mundo em um beco.',

            'Seus punhos estão machucados.',

            'Há sangue nas suas mãos.',

            'Você consegue ouvir confusão dentro do bar.',
          ],
        },
      ],

      criticalOutcomes: [
        {
          id:
            'rage_destroyed_bar',

          title:
            'O Que Você Fez?',

          durationMinutes: 31,

          endScene:
            'frenzy_rage_critical_recovery',

          location: {
            id: 'street_blocks_away',
            name: 'Rua',
            district: 'São Paulo',
          },

          remembered: true,

          masqueradeRisk: 2,

          humanityCheckRequired:
            true,

          flags: {
            violentAssault:
              true,

            propertyDestroyed:
              true,

            policeSearching:
              true,
          },

          memories: [
            'Você lembra do rosto dele atingindo o chão.',

            'Lembra de outro homem tentando segurar você.',

            'Lembra de quebrar uma porta para sair.',

            'Lembra de pessoas filmando.',
          ],

          narration: [
            'Você recupera o controle vários quarteirões depois.',

            'Seu corpo ainda está pronto para lutar.',

            'Há sangue nos seus braços.',

            'Seu celular vibra.',

            'Algum vídeo já pode estar circulando.',
          ],
        },
      ],
    },

    choices: [],
  },

  frenzy_rage_resisted: {
    id: 'frenzy_rage_resisted',

    chapter: 'TESTE DE SISTEMA',

    title: 'Engolir a Raiva',

    location: {
      id: 'night_bar',
      name: 'Bar',
      district: 'São Paulo',
    },

    narration: [
      'Você sente a Besta empurrando.',

      'Mas não entrega o controle.',

      'O homem continua sorrindo.',

      'Ele não faz ideia do que acabou de evitar.',
    ],

    choices: [],
  },

  frenzy_rage_recovery: {
    id: 'frenzy_rage_recovery',

    chapter: 'TESTE DE SISTEMA',

    title: 'Punhos Ensanguentados',

    location: {
      id: 'bar_alley',
      name: 'Beco atrás do Bar',
      district: 'São Paulo',
    },

    narration: [
      'A raiva está desaparecendo.',

      'As consequências, não.',
    ],

    choices: [],
  },

  frenzy_rage_critical_recovery: {
    id:
      'frenzy_rage_critical_recovery',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Depois da Violência',

    location: {
      id:
        'street_blocks_away',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Você olha para suas mãos.',

      'Algumas lembranças ainda chegam fora de ordem.',

      'Mas você sabe que foi você.',
    ],

    choices: [],
  },

  /* =========================
     MEDO / RÖTSCHRECK
  ========================= */

  frenzy_fear_demo: {
    id: 'frenzy_fear_demo',

    chapter: 'TESTE DE SISTEMA',

    title: 'Fogo',

    location: {
      id: 'burning_club',
      name: 'Boate',
      district: 'São Paulo',
    },

    narration: [
      'Um estrondo vem da cozinha.',

      'Segundos depois, chamas aparecem pela porta.',

      'As pessoas começam a gritar.',

      'Para elas é um incêndio.',

      'Para alguma coisa dentro de você, é a morte absoluta.',
    ],

    dialogue: {
      speaker: 'A Besta',

      text:
        'FUJA.',
    },

    frenzyTrigger: {
      id: 'open_fire',

      type: 'fear',

      title: 'Fogo aberto',

      description:
        'O fogo desperta o terror ancestral da Besta.',

      difficulty: 7,

      successScene:
        'frenzy_fear_resisted',

      failureOutcomes: [
        {
          id:
            'fear_escape',

          title:
            'Fora do Fogo',

          durationMinutes: 6,

          endScene:
            'frenzy_fear_recovery',

          location: {
            id: 'club_alley',
            name: 'Beco atrás da Boate',
            district: 'São Paulo',
          },

          remembered: true,

          flags: {
            fledFire:
              true,
          },

          memories: [
            'Você lembra de empurrar pessoas para alcançar a saída.',

            'Lembra do vidro da porta quebrando.',

            'Lembra de correr sem olhar para trás.',
          ],

          narration: [
            'Você recupera o controle no beco.',

            'O prédio ainda está atrás de você.',

            'Fumaça sobe sobre os telhados.',

            'Você não sabe quem deixou para trás.',
          ],
        },
      ],

      criticalOutcomes: [
        {
          id:
            'fear_total_escape',

          title:
            'Longe Demais',

          durationMinutes: 52,

          endScene:
            'frenzy_fear_critical_recovery',

          location: {
            id: 'unknown_underpass',
            name: 'Baixo de um Viaduto',
            district: 'São Paulo',
          },

          remembered: true,

          masqueradeRisk: 1,

          flags: {
            abandonedEveryone:
              true,

            injuredPeopleWhileEscaping:
              true,
          },

          memories: [
            'Você lembra de alguém segurando seu braço.',

            'Lembra de jogar essa pessoa contra a parede.',

            'Lembra de atravessar uma janela.',

            'Lembra de correr por ruas que não reconhece.',
          ],

          narration: [
            'Quando o medo finalmente solta você, a boate já está muito longe.',

            'Você está embaixo de um viaduto.',

            'Não sabe exatamente como chegou ali.',

            'Seu corpo está sujo de fuligem.',

            'E existe sangue que não parece ser seu em uma das mãos.',
          ],
        },
      ],
    },

    choices: [],
  },

  frenzy_fear_resisted: {
    id: 'frenzy_fear_resisted',

    chapter: 'TESTE DE SISTEMA',

    title: 'Diante das Chamas',

    location: {
      id: 'burning_club',
      name: 'Boate',
      district: 'São Paulo',
    },

    narration: [
      'Cada instinto exige fuga.',

      'Mas você mantém o controle.',

      'Agora pode decidir como sair.',
    ],

    choices: [],
  },

  frenzy_fear_recovery: {
    id: 'frenzy_fear_recovery',

    chapter: 'TESTE DE SISTEMA',

    title: 'No Beco',

    location: {
      id: 'club_alley',
      name: 'Beco atrás da Boate',
      district: 'São Paulo',
    },

    narration: [
      'Você voltou ao controle.',

      'O fogo ainda é visível atrás do prédio.',
    ],

    choices: [],
  },

  frenzy_fear_critical_recovery: {
    id:
      'frenzy_fear_critical_recovery',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Muito Longe',

    location: {
      id:
        'unknown_underpass',

      name:
        'Baixo de um Viaduto',

      district:
        'São Paulo',
    },

    narration: [
      'O terror passou.',

      'Agora você precisa descobrir o que abandonou durante a fuga.',
    ],

    choices: [],
  },
}

export default frenzyDemoScenes