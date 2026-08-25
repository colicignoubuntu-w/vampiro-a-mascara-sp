const jackIntroScenes = {
  jack_intro: {
    id: 'jack_intro',

    chapter: 'PRÓLOGO',

    title: 'Jack',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'O homem desencosta da parede.',

      'Agora que ele está mais perto, você percebe algo que não tinha notado antes.',

      'Ele também não respira.',

      'Não há aquele movimento quase invisível do peito que você passou a vida inteira vendo nas pessoas sem perceber.',

      'Ele observa você de cima a baixo.',

      'Não parece impressionado.',

      'Também não parece particularmente preocupado.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Jack. Só Jack. E, antes que você comece com as vinte perguntas: sim, você está morto. Não, não é uma metáfora. E sim, essa noite vai piorar antes de melhorar.',
    },

    choices: [
      {
        id:
          'jack_what_happened',

        text:
          '"O que aconteceu comigo?"',

        nextScene:
          'jack_embrace',

        timeMinutes: 2,
      },

      {
        id:
          'jack_where_livia',

        text:
          '"Onde está a Lívia?"',

        nextScene:
          'jack_livia',

        timeMinutes: 1,
      },

      {
        id:
          'jack_what_are_you',

        text:
          '"O que você é?"',

        nextScene:
          'jack_vampire',

        timeMinutes: 2,
      },
    ],
  },

  jack_embrace: {
    id: 'jack_embrace',

    chapter: 'PRÓLOGO',

    title:
      'O Que Aconteceu',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack passa a mão pela barba e olha para você por alguns segundos.',

      'Parece procurar uma versão da resposta que você consiga suportar.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Lívia drenou você até a morte e depois fez você beber do sangue dela. É assim que funciona. Morre humano, acorda Membro. Não tem raio, caixão nem castelo. Só dor, fome e um monte de gente velha dizendo que agora você precisa seguir as regras deles.',
    },

    choices: [
      {
        id:
          'jack_member',

        text:
          '"Membro?"',

        nextScene:
          'jack_kindred',

        timeMinutes: 1,
      },

      {
        id:
          'jack_livia_after_embrace',

        text:
          '"Por que ela fez isso?"',

        nextScene:
          'jack_livia_reason',

        timeMinutes: 2,
      },

      {
        id:
          'jack_rules',

        text:
          '"Que regras?"',

        nextScene:
          'jack_camarilla_intro',

        timeMinutes: 2,
      },
    ],
  },

  jack_vampire: {
    id: 'jack_vampire',

    chapter: 'PRÓLOGO',

    title: 'Vampiro',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack solta uma risada curta.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Vampiro. Kindred. Membro. Sanguessuga, se quiser irritar alguém. O nome não muda muita coisa. Você está morto, precisa de sangue para continuar funcionando e o sol agora é uma sentença de morte.',
    },

    choices: [
      {
        id:
          'jack_hunger_question',

        text:
          '"Então essa fome..."',

        nextScene:
          'jack_hunger_explanation',

        timeMinutes: 1,
      },

      {
        id:
          'jack_livia_from_vampire',

        text:
          '"E a Lívia?"',

        nextScene:
          'jack_livia',

        timeMinutes: 1,
      },
    ],
  },

  jack_kindred: {
    id: 'jack_kindred',

    chapter: 'PRÓLOGO',

    title: 'Membros',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack dá de ombros.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'É como a maioria prefere chamar nossa espécie. Faz parecer civilizado. Vampiro lembra demais o que realmente fazemos.',
    },

    choices: [
      {
        id:
          'jack_continue_explanation',

        text:
          '"Continua."',

        nextScene:
          'jack_camarilla_intro',

        timeMinutes: 1,
      },
    ],
  },

  jack_hunger_explanation: {
    id:
      'jack_hunger_explanation',

    chapter: 'PRÓLOGO',

    title: 'A Fome',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'A palavra parece tornar a sensação mais forte.',

      'Seu estômago não dói.',

      'Não é esse tipo de fome.',

      'Ela está em algum lugar mais fundo.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Sangue. Quanto menos você tem, mais alto a coisa aí dentro fala. A gente chama de Besta. Quando você está cheio, dá para fingir que manda no próprio corpo. Quando está vazio e alguém sangra na sua frente... aí descobre quem realmente está segurando a coleira.',
    },

    choices: [
      {
        id:
          'jack_beast',

        text:
          '"Besta?"',

        nextScene:
          'jack_beast',

        timeMinutes: 1,
      },

      {
        id:
          'jack_move_on',

        text:
          'Continuar pelo corredor',

        nextScene:
          'jack_camarilla_intro',

        timeMinutes: 2,
      },
    ],
  },

  jack_beast: {
    id: 'jack_beast',

    chapter: 'PRÓLOGO',

    title: 'A Besta',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack aponta dois dedos para o centro do seu peito.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'A parte de você que quer sobreviver sem se importar com o resto. Fome demais, raiva demais, medo demais... ela tenta dirigir. Você aprende a segurar. Ou alguém acaba segurando você.',
    },

    choices: [
      {
        id:
          'jack_fire',

        text:
          '"Medo de quê?"',

        nextScene:
          'jack_fire_explanation',

        timeMinutes: 1,
      },

      {
        id:
          'jack_continue',

        text:
          'Continuar andando',

        nextScene:
          'jack_camarilla_intro',

        timeMinutes: 1,
      },
    ],
  },

  jack_fire_explanation: {
    id:
      'jack_fire_explanation',

    chapter: 'PRÓLOGO',

    title: 'Fogo',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack olha para uma antiga placa de saída de emergência presa à parede.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Fogo. E sol. Seu cérebro pode saber que um cigarro não vai incendiar você inteiro, mas seu sangue não recebeu o memorando. Uma chama pequena dá para controlar. Um prédio pegando fogo? A Besta não quer discutir filosofia. Ela quer sair.',
    },

    choices: [
      {
        id:
          'jack_camarilla',

        text:
          '"E quem são essas pessoas com regras?"',

        nextScene:
          'jack_camarilla_intro',

        timeMinutes: 2,
      },
    ],
  },

  jack_livia: {
    id: 'jack_livia',

    chapter: 'PRÓLOGO',

    title: 'Lívia',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'O humor desaparece um pouco do rosto de Jack.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Viva. Por enquanto. A Camarilla pegou ela antes que pudesse desaparecer. Criar outro vampiro sem autorização é coisa que esses sujeitos levam bem a sério.',
    },

    choices: [
      {
        id:
          'jack_why_permission',

        text:
          '"Autorização para criar alguém?"',

        nextScene:
          'jack_camarilla_intro',

        timeMinutes: 2,
      },

      {
        id:
          'jack_why_me',

        text:
          '"Por que ela me escolheu?"',

        nextScene:
          'jack_livia_reason',

        timeMinutes: 2,
      },
    ],
  },

  jack_livia_reason: {
    id:
      'jack_livia_reason',

    chapter: 'PRÓLOGO',

    title: 'Por Que Você?',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack observa você com mais atenção.',

      'Desta vez a resposta vem sem piada.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Essa parte eu não sei. Mas não parece ter sido impulso. Ela vinha observando você havia algum tempo. Talvez tenha gostado do jeito que você pensa. Talvez tenha visto alguma coisa quebrada que parecia familiar. Malkavianos têm um talento especial para encontrar rachaduras nos outros.',
    },

    choices: [
      {
        id:
          'jack_documents_hint',

        text:
          '"Ela estava me observando?"',

        nextScene:
          'jack_livia_documents_hint',

        timeMinutes: 2,
      },

      {
        id:
          'jack_camarilla_after_livia',

        text:
          'Perguntar sobre a Camarilla',

        nextScene:
          'jack_camarilla_intro',

        timeMinutes: 2,
      },
    ],
  },

  jack_livia_documents_hint: {
    id:
      'jack_livia_documents_hint',

    chapter: 'PRÓLOGO',

    title: 'Antes de Você Saber',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack dá de ombros.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Eu só sei que isso não começou na noite em que ela mordeu você. Se quiser saber até onde foi, procura as coisas dela quando tiver oportunidade. Computador, papéis, fotografias. Mortos guardam mais segredos que vivos.',
    },

    choices: [
      {
        id:
          'jack_camarilla_now',

        text:
          'Continuar',

        nextScene:
          'jack_camarilla_intro',

        timeMinutes: 2,

        flags: {
          knowsLiviaLeftEvidence:
            true,
        },
      },
    ],
  },

  jack_camarilla_intro: {
    id:
      'jack_camarilla_intro',

    chapter: 'PRÓLOGO',

    title: 'A Camarilla',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack começa a caminhar.',

      'Você acompanha.',

      'Ele fala como alguém explicando uma velha irritação.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'A Camarilla é uma organização de vampiros que decidiu que sobrevivemos melhor com leis, segredo e gente velha no comando. Parte disso funciona. A parte em que eles começam a achar que mandam no sangue de todo mundo é onde eu perco a paciência.',
    },

    choices: [
      {
        id:
          'jack_prince',

        text:
          '"Quem manda?"',

        nextScene:
          'jack_prince',

        timeMinutes: 1,
      },

      {
        id:
          'jack_siring_law',

        text:
          '"Então Lívia precisava pedir permissão?"',

        nextScene:
          'jack_siring_law',

        timeMinutes: 2,
      },

      {
        id:
          'jack_go',

        text:
          'Seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 2,
      },
    ],
  },

  jack_prince: {
    id: 'jack_prince',

    chapter: 'PRÓLOGO',

    title: 'O Príncipe',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack faz uma expressão de desagrado.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Chamam o sujeito no topo de Príncipe. Não porque tenha sangue azul ou coroa. Ele manda porque tem força, aliados e gente suficiente concordando que ele manda. É política. Só que os políticos aqui não envelhecem e bebem sangue.',
    },

    choices: [
      {
        id:
          'jack_why_me_trial',

        text:
          '"E o que isso tem a ver comigo?"',

        nextScene:
          'jack_trial',

        timeMinutes: 1,
      },
    ],
  },

  jack_siring_law: {
    id:
      'jack_siring_law',

    chapter: 'PRÓLOGO',

    title: 'A Prole',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack solta uma risada sem humor.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Isso. Controle de população sobrenatural, dizem eles. Você quer criar alguém, pede autorização. Lívia não pediu. Agora o Príncipe precisa mostrar para todo mundo que a lei significa alguma coisa.',
    },

    choices: [
      {
        id:
          'jack_trial_from_law',

        text:
          '"E eu?"',

        nextScene:
          'jack_trial',

        timeMinutes: 1,
      },
    ],
  },

  jack_trial: {
    id: 'jack_trial',

    chapter: 'PRÓLOGO',

    title: 'Seu Problema',

    location: {
      id:
        'malkavian_hospital_corridor',

      name:
        'Hospital Abandonado',

      district:
        'São Paulo',
    },

    narration: [
      'Jack para diante de uma porta no fim do corredor.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Você é a prova viva — ou morta — de que ela quebrou a regra. Então vai para julgamento junto com ela. Minha sugestão? Escuta mais do que fala. Esses sujeitos conseguem transformar uma frase ruim em sentença de morte.',
    },

    choices: [
      {
        id:
          'jack_leave_hospital',

        text:
          'Seguir Jack para fora',

        nextScene:
          'jack_walk',

        timeMinutes: 2,

        flags: {
          jackExplainedUndeath:
            true,

          jackExplainedBeast:
            true,

          jackExplainedCamarilla:
            true,
        },
      },
    ],
  },
  jack_after_trial: {
    id:
      'jack_after_trial',

    chapter:
      'PRÓLOGO',

    title:
      'Depois da Corte',

    location: {
      id:
        'court_exit',

      name:
        'Saída da Corte',

      district:
        'São Paulo',
    },

    narration: [
      'Jack espera alguns metros adiante.',

      'As portas da Corte se fecham atrás de você.',

      'Por alguns segundos nenhum dos dois diz nada.',

      'Lívia está morta.',

      'A Camarilla decidiu que você continua existindo.',

      'Pelo menos por enquanto.',

      'Jack olha para a rua e depois para você.',

      'São Paulo continua funcionando como se nada tivesse acontecido.',
    ],

    dialogue: {
      speaker:
        'Jack',

      text:
        'Bem-vindo à sua primeira noite de verdade. Você sobreviveu ao Príncipe. Já é mais do que muita gente consegue.',
    },

    choices: [
      {
        id:
          'ask_jack_what_now',

        text:
          '"E agora?"',

        nextScene:
          'jack_after_trial_livia',

        timeMinutes: 1,
      },

      {
        id:
          'ask_jack_about_livia_after_trial',

        text:
          '"E as coisas da Lívia?"',

        nextScene:
          'jack_after_trial_livia',

        timeMinutes: 1,
      },
    ],
  },

  jack_after_trial_livia: {
    id:
      'jack_after_trial_livia',

    chapter:
      'PRÓLOGO',

    title:
      'O Que Ela Deixou',

    location: {
      id:
        'court_exit',

      name:
        'Saída da Corte',

      district:
        'São Paulo',
    },

    narration: [
      'Jack enfia as mãos nos bolsos do casaco.',

      'A expressão dele fica um pouco mais séria.',

      'Ele parece escolher as palavras antes de continuar.',
    ],

    dialogue: {
      speaker:
        'Jack',

      text:
        'O apartamento dela ainda está lá. Computador, papéis, fotografias, o que quer que ela tenha deixado. Se eu fosse você, passava lá antes que alguém resolva limpar tudo.',
    },

    choices: [
      {
        id:
          'go_livia_apartment_after_trial',

        text:
          'Ir ao apartamento de Lívia.',

        nextScene:
          'livia_apartment_arrival',

        timeMinutes: 15,

        flags: {
          survivedTrial:
            true,

          liviaDead:
            true,

          metJack:
            true,

          knowsLiviaLeftEvidence:
            true,

          liviaApartmentUnlocked:
            true,
        },
      },

      {
        id:
          'go_free_roam_after_trial',

        text:
          'Dizer que irá depois.',

        nextScene:
          'free_roam',

        timeMinutes: 2,

        flags: {
          survivedTrial:
            true,

          liviaDead:
            true,

          metJack:
            true,

          knowsLiviaLeftEvidence:
            true,

          liviaApartmentUnlocked:
            true,
        },
      },
    ],
  },
}

export default jackIntroScenes