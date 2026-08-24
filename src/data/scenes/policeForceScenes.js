const policeForceScenes = {
  police_force: {
    id:
      'police_force',

    chapter:
      'A MÁSCARA',

    title:
      'Força Demais',

    policeForceEncounter:
      true,

    location: {
      id:
        'street_police_force',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Os dois policiais estão atentos a qualquer movimento seu.',

      'Você sabe que poderia reagir muito mais rápido e com muito mais força do que qualquer um deles imagina.',

      'O problema não é apenas sobreviver à abordagem.',

      'O problema é decidir quanto da criatura que você se tornou pode ser mostrado diante de testemunhas humanas.',
    ],

    choices: [],
  },

  police_normal_resistance: {
    id:
      'police_normal_resistance',

    chapter:
      'A MÁSCARA',

    title:
      'Resistência',

    location: {
      id:
        'street_police_force',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Você reage fisicamente sem permitir que sua verdadeira força apareça.',

      'O primeiro policial tenta segurá-lo.',

      'O segundo começa a se aproximar.',

      'A situação pode facilmente virar uma luta, mas até agora nada prova que você seja algo além de humano.',
    ],

    choices: [
      {
        id:
          'normal_resistance_stop',

        text:
          'Parar de resistir.',

        nextScene:
          'police_detained',

        timeMinutes: 2,
      },

      {
        id:
          'normal_resistance_run',

        text:
          'Aproveitar a confusão e tentar fugir.',

        nextScene:
          'police_chase',

        timeMinutes: 1,

        flags: {
          policeChase:
            true,
        },
      },
    ],
  },

  police_supernatural_seen: {
    id:
      'police_supernatural_seen',

    chapter:
      'A MÁSCARA',

    title:
      'Eles Viram',

    location: {
      id:
        'street_police_force',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'Por alguns segundos ninguém fala.',

      'O policial que você afastou tenta compreender como foi lançado para trás com tamanha facilidade.',

      'O outro olha para você de uma maneira diferente agora.',

      'Não é apenas medo.',

      'É a percepção de que alguma coisa naquela cena desafia uma explicação normal.',

      'A Máscara foi colocada em risco.',
    ],

    dialogue: {
      speaker:
        'Policial',

      text:
        'Que porra foi essa?',
    },

    choices: [
      {
        id:
          'supernatural_seen_run',

        text:
          'Fugir antes que eles consigam reagir.',

        nextScene:
          'police_chase',

        timeMinutes: 1,

        flags: {
          policeChase:
            true,

          policeWitnessedSupernatural:
            true,
        },
      },

      {
        id:
          'supernatural_seen_surrender',

        text:
          'Parar e tentar evitar que a situação piore.',

        nextScene:
          'police_supernatural_aftermath',

        timeMinutes: 2,
      },
    ],
  },

  police_supernatural_aftermath: {
    id:
      'police_supernatural_aftermath',

    chapter:
      'A MÁSCARA',

    title:
      'Depois do Impossível',

    location: {
      id:
        'street_police_force',

      name:
        'Rua',

      district:
        'São Paulo',
    },

    narration: [
      'O problema já não é apenas a abordagem policial.',

      'Duas testemunhas humanas viram algo que não deveriam ter visto.',

      'Mesmo que você consiga sair dali sem ser preso, o ocorrido não simplesmente deixa de existir.',

      'Relatórios podem ser escritos.',

      'Câmeras podem ter registrado a cena.',

      'Outros membros da Camarilla podem descobrir o que aconteceu.',
    ],

    choices: [],
  },
}

export default policeForceScenes