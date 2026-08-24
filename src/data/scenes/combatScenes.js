const combatScenes = {
  /*
    ========================================
    COMBATE CONTRA HUMANO
    ========================================
  */

  combat_demo: {
    id: 'combat_demo',

    chapter: 'TESTE DE SISTEMA',

    title: 'Problema no Beco',

    location: {
      id: 'combat_demo_alley',
      name: 'Beco',
      district: 'São Paulo',
    },

    narration: [
      'O homem fecha a distância entre vocês.',

      'Ele não parece saber exatamente com quem está mexendo.',

      'Mas está decidido a descobrir.',

      'Ele levanta os punhos.',

      'Não há mais conversa.',
    ],

    dialogue: {
      speaker: 'Desconhecido',

      text:
        'Agora você vai aprender.',
    },

    combatEncounter: {
      id: 'alley_fight',

      enemy: {
        id: 'angry_man',

        name: 'Homem Agressivo',

        type: 'human',

        armorId: 'none',

        weaponId: 'fists',

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
          melee: 1,
          firearms: 0,
        },

        health: 7,
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
    id: 'combat_demo_victory',

    chapter: 'TESTE DE SISTEMA',

    title: 'No Chão',

    location: {
      id: 'combat_demo_alley',
      name: 'Beco',
      district: 'São Paulo',
    },

    narration: [
      'O homem cai.',

      'Ele não parece capaz de continuar lutando.',

      'Sua respiração é pesada.',

      'A sua não deveria ser.',

      'Esse detalhe ainda é estranho.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Parabéns. Você bate melhor morto.',
    },

    choices: [],
  },

  combat_demo_defeat: {
    id: 'combat_demo_defeat',

    chapter: 'TESTE DE SISTEMA',

    title: 'Incapacitado',

    location: {
      id: 'combat_demo_alley',
      name: 'Beco',
      district: 'São Paulo',
    },

    narration: [
      'Seu corpo deixa de responder.',

      'Você cai.',

      'A dor permanece, mas fica distante.',

      'Para um mortal talvez fosse o fim.',

      'Para você, as coisas são mais complicadas.',
    ],

    choices: [],
  },

  combat_demo_escape: {
    id: 'combat_demo_escape',

    chapter: 'TESTE DE SISTEMA',

    title: 'Fuga',

    location: {
      id: 'combat_demo_street',
      name: 'Rua',
      district: 'São Paulo',
    },

    narration: [
      'Você alcança a rua antes que ele consiga impedir.',

      'Os passos atrás de você diminuem.',

      'A briga terminou sem precisar terminar.',
    ],

    choices: [],
  },

  /*
    ========================================
    COMBATE CONTRA VAMPIRO

    Aqui conseguimos testar:
    - absorção vampírica
    - tiro causando contusão
    - faca causando letal
    - mordida agravada
    - estaca no coração
    ========================================
  */

  combat_vampire_demo: {
    id: 'combat_vampire_demo',

    chapter: 'TESTE DE SISTEMA',

    title: 'Predador Contra Predador',

    location: {
      id: 'abandoned_warehouse',
      name: 'Galpão Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'O homem à sua frente não respira.',

      'Você percebe isso antes mesmo de notar os caninos.',

      'Ele tira o casaco lentamente.',

      'Os olhos permanecem presos em você.',

      'Não existe dúvida.',

      'Ele também é um vampiro.',
    ],

    dialogue: {
      speaker: 'Vampiro Desconhecido',

      text:
        'Você entrou no lugar errado, neófito.',
    },

    combatEncounter: {
      id: 'vampire_test_fight',

      enemy: {
        id: 'test_vampire',

        name: 'Vampiro Desconhecido',

        type: 'vampire',

        armorId: 'reinforcedJacket',

        weaponId: 'knife',

        attributes: {
          dexterity: 3,
          strength: 3,
          stamina: 3,
          wits: 3,
        },

        abilities: {
          brawl: 3,
          dodge: 2,
          athletics: 2,
          melee: 3,
          firearms: 1,
        },

        health: 7,
      },

      victoryScene:
        'combat_vampire_victory',

      defeatScene:
        'combat_vampire_defeat',

      escapeScene:
        'combat_vampire_escape',
    },

    choices: [],
  },

  combat_vampire_victory: {
    id: 'combat_vampire_victory',

    chapter: 'TESTE DE SISTEMA',

    title: 'Predador Derrotado',

    location: {
      id: 'abandoned_warehouse',
      name: 'Galpão Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'A luta termina.',

      'O outro vampiro não consegue mais continuar.',

      'O silêncio volta ao galpão.',

      'Agora vem a pergunta mais importante.',

      'O que você fará com ele?',
    ],

    choices: [],
  },

  combat_vampire_staked: {
    id: 'combat_vampire_staked',

    chapter: 'TESTE DE SISTEMA',

    title: 'Imóvel',

    location: {
      id: 'abandoned_warehouse',
      name: 'Galpão Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'A estaca atravessa o peito.',

      'O corpo do vampiro endurece imediatamente.',

      'Ele cai sem tentar aparar a própria queda.',

      'Os olhos continuam abertos.',

      'Ele está consciente.',

      'Mas não consegue mover sequer um dedo.',

      'Enquanto a madeira permanecer no coração, continuará assim.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Ele ainda está aí dentro.',
    },

    choices: [],
  },

  combat_vampire_defeat: {
    id: 'combat_vampire_defeat',

    chapter: 'TESTE DE SISTEMA',

    title: 'A Escuridão Vence',

    location: {
      id: 'abandoned_warehouse',
      name: 'Galpão Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Seu corpo finalmente cede.',

      'Você cai.',

      'O outro vampiro permanece de pé.',

      'Antes da consciência desaparecer, você o vê se aproximando.',
    ],

    choices: [],
  },

  combat_vampire_escape: {
    id: 'combat_vampire_escape',

    chapter: 'TESTE DE SISTEMA',

    title: 'Retirada',

    location: {
      id: 'warehouse_street',
      name: 'Rua',
      district: 'São Paulo',
    },

    narration: [
      'Você consegue sair do galpão.',

      'O vampiro não continua a perseguição.',

      'Talvez tenha decidido que não vale a pena.',

      'Talvez simplesmente esteja esperando outra oportunidade.',
    ],

    choices: [],
  },
}

export default combatScenes