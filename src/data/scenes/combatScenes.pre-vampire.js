const combatScenes = {
  combat_demo: {
    id: 'combat_demo',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Problema no Beco',

    location: {
      id:
        'combat_demo_alley',

      name:
        'Beco',

      district:
        'São Paulo',
    },

    narration: [
      'O homem fecha a distância entre vocês.',

      'Ele não parece saber exatamente com quem está mexendo.',

      'Mas está decidido a descobrir.',

      'Ele levanta os punhos.',

      'Não há mais conversa.',
    ],

    dialogue: {
      speaker:
        'Desconhecido',

      text:
        'Agora você vai aprender.',
    },

    combatEncounter: {
      id:
        'alley_fight',

      enemy: {
        id:
          'angry_man',

        name:
          'Homem Agressivo',

        type:
          'human',

        attributes: {
          dexterity: 2,
          strength: 3,
          stamina: 2,
          wits: 2,
        },

        abilities: {
          brawl: 2,
          dodge: 1,
          athletics: 2,
        },

        health: 7,

        attack: {
          name:
            'Soco',

          difficulty: 6,

          damageBonus: 0,
        },
      },

      victoryScene:
        'combat_demo_victory',

      defeatScene:
        'combat_demo_defeat',

      escapeScene:
        'combat_demo_escape',
    },

    choices: [],
  },

  combat_demo_victory: {
    id:
      'combat_demo_victory',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'No Chão',

    location: {
      id:
        'combat_demo_alley',

      name:
        'Beco',

      district:
        'São Paulo',
    },

    narration: [
      'O homem cai.',

      'Ele não parece capaz de continuar lutando.',

      'Sua respiração é pesada.',

      'A sua não deveria ser.',

      'Esse detalhe ainda é estranho.',
    ],

    dialogue: {
      speaker:
        'A Voz',

      text:
        'Parabéns. Você bate melhor morto.',
    },

    choices: [],
  },

  combat_demo_defeat: {
    id:
      'combat_demo_defeat',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Incapacitado',

    location: {
      id:
        'combat_demo_alley',

      name:
        'Beco',

      district:
        'São Paulo',
    },

    narration: [
      'Seu corpo deixa de responder como deveria.',

      'Você cai.',

      'A dor é distante.',

      'Mas o mundo ao redor começa a desaparecer.',

      'Para um mortal, talvez fosse o fim.',

      'Para você, as coisas são mais complicadas.',
    ],

    choices: [],
  },

  combat_demo_escape: {
    id:
      'combat_demo_escape',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Fuga',

    location: {
      id:
        'combat_demo_street',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Você alcança a rua antes que ele consiga impedir.',

      'Os passos atrás de você diminuem.',

      'A briga terminou sem precisar terminar.',
    ],

    dialogue: {
      speaker:
        'A Voz',

      text:
        'Sobreviver também conta como vitória.',
    },

    choices: [],
  },
}

export default combatScenes