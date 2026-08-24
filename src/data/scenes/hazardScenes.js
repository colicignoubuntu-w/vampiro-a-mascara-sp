const hazardScenes = {
  fire_hazard_demo: {
    id:
      'fire_hazard_demo',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'O Corredor em Chamas',

    location: {
      id:
        'burning_building',

      name:
        'Prédio em Chamas',

      district:
        'São Paulo',
    },

    narration: [
      'Uma explosão corta o corredor.',

      'O fogo sobe pelas paredes e encontra o teto em segundos.',

      'O calor atinge você antes mesmo das chamas.',

      'Seu corpo morto reage de uma maneira que sua mente não consegue controlar completamente.',

      'A Besta reconhece o fogo.',
    ],

    /*
      Primeiro ocorre Rötschreck.

      Se ele resistir, continua para
      a exposição propriamente dita.
    */

    frenzyTrigger: {
      id:
        'fire_rotschreck_demo',

      type:
        'fear',

      title:
        'Fogo',

      description:
        'Chamas abertas despertam o medo primordial da Besta.',

      difficulty: 6,

      successScene:
        'fire_exposure_demo',

      failureOutcomes: [
        {
          id:
            'fire_rotschreck_failure',

          title:
            'Pânico',

          durationMinutes: 2,

          endScene:
            'fire_escape_after_frenzy',

          location: {
            id:
              'burning_building_exit',

            name:
              'Saída do Prédio',

            district:
              'São Paulo',
          },

          narration: [
            'Quando você volta a perceber o que está fazendo, está correndo.',

            'Não lembra de escolher uma direção.',

            'Só lembra do fogo atrás de você.',
          ],

          memories: [
            'As chamas.',

            'O medo.',

            'A necessidade absoluta de fugir.',
          ],
        },
      ],

      criticalOutcomes: [
        {
          id:
            'fire_rotschreck_botch',

          title:
            'Terror Absoluto',

          durationMinutes: 5,

          endScene:
            'fire_escape_after_frenzy',

          location: {
            id:
              'burning_building_exit',

            name:
              'Rua',

            district:
              'São Paulo',
          },

          narration: [
            'Você retorna ao controle na rua.',

            'Há marcas de queda em suas roupas.',

            'Você não sabe quem empurrou para conseguir sair.',

            'A Besta só queria distância do fogo.',
          ],

          memories: [
            'Você lembra de correr.',

            'Lembra de derrubar alguém.',

            'Lembra do terror absoluto.',
          ],
        },
      ],
    },

    choices: [],
  },

  fire_exposure_demo: {
    id:
      'fire_exposure_demo',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Entre as Chamas',

    location: {
      id:
        'burning_building',

      name:
        'Prédio em Chamas',

      district:
        'São Paulo',
    },

    narration: [
      'Você consegue dominar o pânico.',

      'Isso não torna o fogo menos perigoso.',

      'As chamas continuam avançando.',
    ],

    hazardEncounter: {
      id:
        'building_fire',

      type:
        'fire',

      title:
        'Exposição ao Fogo',

      description:
        'As chamas podem causar dano agravado a cada nova exposição.',

      damagePerTurn: 1,

      escapeDifficulty: 6,

      coverDifficulty: 7,

      successScene:
        'fire_escape_success',

      destructionScene:
        'vampire_destroyed_fire',
    },

    choices: [],
  },

  fire_escape_after_frenzy: {
    id:
      'fire_escape_after_frenzy',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Longe do Fogo',

    location: {
      id:
        'burning_building_exit',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O incêndio continua atrás de você.',

      'Você está longe das chamas.',

      'Por enquanto.',
    ],

    choices: [],
  },

  fire_escape_success: {
    id:
      'fire_escape_success',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Fora do Alcance',

    location: {
      id:
        'burning_building_exit',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Você atravessa a saída.',

      'O ar da noite substitui o calor sufocante.',

      'As chamas ficaram para trás.',
    ],

    choices: [],
  },

  sunlight_demo: {
    id:
      'sunlight_demo',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'O Amanhecer',

    location: {
      id:
        'apartment_rooftop',

      name:
        'Cobertura de um Prédio',

      district:
        'São Paulo',
    },

    narration: [
      'O céu começa a clarear.',

      'A mudança seria bonita se você ainda fosse humano.',

      'A primeira faixa de luz aparece entre os prédios.',

      'Sua pele reage imediatamente.',
    ],

    hazardEncounter: {
      id:
        'direct_sunlight',

      type:
        'sunlight',

      title:
        'Luz Solar Direta',

      description:
        'A luz solar toca sua pele. Cada nova exposição pode destruir rapidamente um vampiro.',

      damagePerTurn: 2,

      escapeDifficulty: 7,

      coverDifficulty: 6,

      successScene:
        'sunlight_escape_success',

      destructionScene:
        'vampire_destroyed_sunlight',
    },

    choices: [],
  },

  sunlight_escape_success: {
    id:
      'sunlight_escape_success',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Escuridão',

    location: {
      id:
        'dark_stairwell',

      name:
        'Escadaria Interna',

      district:
        'São Paulo',
    },

    narration: [
      'Você atravessa a porta e cai na escuridão da escadaria.',

      'A luz fica do outro lado.',

      'Sua pele ainda arde.',

      'Mas você sobreviveu ao amanhecer.',
    ],

    choices: [],
  },

  vampire_destroyed_fire: {
    id:
      'vampire_destroyed_fire',

    chapter:
      'FIM',

    title:
      'Consumido',

    location: {
      id:
        'burning_building',

      name:
        'Prédio em Chamas',

      district:
        'São Paulo',
    },

    narration: [
      'O dano supera aquilo que seu sangue consegue sustentar.',

      'As chamas consomem o que resta do seu corpo.',

      'A noite termina aqui.',
    ],

    choices: [],
  },

  vampire_destroyed_sunlight: {
    id:
      'vampire_destroyed_sunlight',

    chapter:
      'FIM',

    title:
      'Cinzas ao Amanhecer',

    location: {
      id:
        'apartment_rooftop',

      name:
        'Cobertura',

      district:
        'São Paulo',
    },

    narration: [
      'A luz não deixa espaço para recuperação.',

      'Seu corpo começa a se desfazer.',

      'O amanhecer toma a cidade.',

      'E sua existência termina com ele.',
    ],

    choices: [],
  },
}

export default hazardScenes