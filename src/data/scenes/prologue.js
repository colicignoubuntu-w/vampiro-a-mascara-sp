const prologueScenes = {
  awakening: {
    id: 'awakening',

    chapter: 'PRÓLOGO',

    title: 'O Despertar',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'A consciência retorna aos poucos.',

      'Primeiro vem o frio. Depois, o cheiro de umidade, ferrugem e algo metálico que você demora alguns segundos para reconhecer como sangue.',

      'Você abre os olhos.',

      'O teto acima de você está coberto por manchas escuras de infiltração. Uma lâmpada fluorescente pisca em intervalos irregulares, produzindo um zumbido irritante.',

      'Você tenta respirar fundo. Seu peito se move, mas existe alguma coisa profundamente errada naquele movimento.',

      'Você não precisa respirar.',

      'Por alguns segundos, sua mente tenta rejeitar essa informação.',

      'Então você escuta uma voz.',
    ],

    dialogue: {
      speaker: '???',

      text:
        'Finalmente. O morto resolveu acordar.',
    },

    choices: [
      {
        id: 'look_around',

        text:
          'Olhar ao redor',

        nextScene:
          'look_around_success',

        timeMinutes: 2,
      },

      {
        id: 'try_stand',

        text:
          'Tentar se levantar',

        nextScene:
          'try_stand',

        timeMinutes: 1,

        flags: {
          triedStandingImmediately:
            true,
        },
      },

      {
        id: 'ask_voice',

        text:
          'Perguntar quem está falando',

        nextScene:
          'ask_voice',

        timeMinutes: 1,

        flags: {
          answeredVoice: true,
        },
      },
    ],
  },

  /* ==========================================
     OLHAR AO REDOR — SUCESSO
  ========================================== */

  look_around_success: {
    id: 'look_around_success',

    chapter: 'PRÓLOGO',

    title: 'Detalhes',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você força a mente a se concentrar.',

      'O pânico continua ali, mas você consegue empurrá-lo para o fundo por alguns segundos.',

      'Está deitado sobre uma antiga maca hospitalar. As tiras de couro que um dia serviram para prender pacientes estão abertas ao seu lado.',

      'No colchão existem manchas antigas de sangue.',

      'Algumas são escuras e secas.',

      'Uma delas ainda parece recente.',

      'Sobre uma cadeira há suas roupas, dobradas de qualquer jeito.',

      'Seu celular está sobre elas.',

      'Mais importante: há marcas de arrasto no chão.',

      'Alguém moveu a maca recentemente.',

      'Você olha para a porta metálica.',

      'Ela está entreaberta.',

      'Do outro lado existe um corredor escuro.',

      'Você percebe também que não consegue ouvir seu próprio coração.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Muito bem. Ainda consegue juntar algumas peças.',
    },

    choices: [
      {
        id: 'check_phone',

        text:
          'Pegar o celular',

        nextScene:
          'check_phone',

        timeMinutes: 2,
      },

      {
        id: 'stand_after_looking',

        text:
          'Levantar da maca',

        nextScene:
          'standing',

        timeMinutes: 1,

        flags: {
          examinedBeforeStanding:
            true,
        },
      },

      {
        id: 'inspect_drag_marks',

        text:
          'Examinar as marcas de arrasto',

        nextScene:
          'drag_marks',

        timeMinutes: 2,

        flags: {
          examinedDragMarks:
            true,
        },
      },

      {
        id: 'ask_voice_after_looking',

        text:
          'Perguntar quem está falando',

        nextScene:
          'ask_voice',

        timeMinutes: 1,

        flags: {
          answeredVoice: true,
        },
      },
    ],
  },

  /* ==========================================
     OLHAR AO REDOR — FALHA
  ========================================== */

  look_around_failure: {
    id: 'look_around_failure',

    chapter: 'PRÓLOGO',

    title: 'Confusão',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você tenta observar o ambiente, mas sua atenção escapa de um detalhe para outro.',

      'A luz pisca.',

      'O teto parece se mover por um instante.',

      'Você fecha os olhos.',

      'Quando abre novamente, tudo parece normal.',

      'Ou pelo menos normal o suficiente.',

      'Você percebe uma maca.',

      'Uma cadeira.',

      'Suas roupas.',

      'Uma porta entreaberta.',

      'Seu celular está sobre a cadeira.',

      'Não consegue perceber muito mais do que isso.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Não se preocupe. A realidade costuma ficar pior quando você presta atenção.',
    },

    choices: [
      {
        id: 'check_phone',

        text:
          'Pegar o celular',

        nextScene:
          'check_phone',

        timeMinutes: 2,
      },

      {
        id: 'stand',

        text:
          'Levantar da maca',

        nextScene:
          'standing',

        timeMinutes: 1,
      },

      {
        id: 'ask_voice',

        text:
          'Perguntar quem está falando',

        nextScene:
          'ask_voice',

        timeMinutes: 1,
      },
    ],
  },

  /* ==========================================
     OLHAR AO REDOR — FALHA CRÍTICA
  ========================================== */

  look_around_botch: {
    id: 'look_around_botch',

    chapter: 'PRÓLOGO',

    title: 'A Sala Respira',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você tenta se concentrar.',

      'A lâmpada pisca.',

      'Uma vez.',

      'Duas.',

      'Na terceira vez, alguma coisa muda.',

      'As paredes parecem mais próximas.',

      'O teto sobe e desce lentamente.',

      'Como um pulmão respirando.',

      'Você olha para a maca e vê por um instante alguém deitado nela.',

      'Você.',

      'Olhos fechados.',

      'Pele pálida.',

      'Morto.',

      'Você recua.',

      'A imagem desaparece.',

      'A maca está vazia.',

      'Então uma voz sussurra perto do seu ouvido.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Tem certeza de que foi você quem acordou?',
    },

    choices: [
      {
        id: 'close_eyes',

        text:
          'Fechar os olhos e tentar se acalmar',

        nextScene:
          'recover_from_vision',

        timeMinutes: 3,

        flags: {
          triedToGroundSelf:
            true,
        },
      },

      {
        id: 'stand_in_panic',

        text:
          'Levantar imediatamente',

        nextScene:
          'try_stand',

        timeMinutes: 1,

        flags: {
          panickedAfterVision:
            true,
        },
      },

      {
        id: 'talk_to_voice',

        text:
          '"O que está acontecendo comigo?"',

        nextScene:
          'ask_voice',

        timeMinutes: 2,

        flags: {
          questionedReality:
            true,
        },
      },
    ],
  },

  recover_from_vision: {
    id: 'recover_from_vision',

    chapter: 'PRÓLOGO',

    title: 'Um, Dois, Três',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você fecha os olhos.',

      'Conta até três.',

      'Abre novamente.',

      'A sala voltou ao normal.',

      'Ou decidiu fingir que voltou.',

      'A maca está vazia.',

      'Seu celular continua sobre a cadeira.',

      'A porta continua entreaberta.',

      'A fome continua dentro de você.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Melhor. Fingir normalidade é uma habilidade importante.',
    },

    choices: [
      {
        id: 'take_phone',

        text:
          'Pegar o celular',

        nextScene:
          'check_phone',

        timeMinutes: 1,
      },

      {
        id: 'stand',

        text:
          'Levantar',

        nextScene:
          'standing',

        timeMinutes: 1,
      },
    ],
  },

  drag_marks: {
    id: 'drag_marks',

    chapter: 'PRÓLOGO',

    title: 'Marcas no Chão',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você se inclina para observar as marcas no chão.',

      'São recentes.',

      'A maca foi empurrada da porta até a posição onde você acordou.',

      'Existe também uma pequena mancha de sangue próximo à entrada.',

      'Não parece sua.',

      'Você não sabe por que sabe disso.',

      'Mas sabe.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Alguém trouxe você até aqui. A pergunta divertida é: quem?',
    },

    choices: [
      {
        id: 'stand',

        text:
          'Levantar',

        nextScene:
          'standing',

        timeMinutes: 1,
      },

      {
        id: 'go_to_door',

        text:
          'Ir até a porta',

        nextScene:
          'door',

        timeMinutes: 1,
      },
    ],
  },

  /* ==========================================
     LEVANTAR
  ========================================== */

  try_stand: {
    id: 'try_stand',

    chapter: 'PRÓLOGO',

    title: 'O Corpo Morto',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você tenta se levantar rápido demais.',

      'Seu corpo responde com uma força que não esperava.',

      'A maca desliza para trás e bate contra a parede com um estrondo metálico.',

      'Você fica em pé.',

      'Não sente tontura.',

      'Não sente fraqueza.',

      'Na verdade, sente exatamente o contrário.',

      'Seu corpo parece mais leve.',

      'Mais rápido.',

      'Mais atento.',

      'Mas há uma pressão desagradável atrás dos olhos.',

      'E uma fome absurda crescendo dentro de você.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Calma, campeão. Você acabou de morrer. Não precisa quebrar os móveis no primeiro minuto.',
    },

    choices: [
      {
        id: 'ask_dead',

        text:
          '"Como assim eu morri?"',

        nextScene:
          'ask_voice',

        timeMinutes: 1,

        flags: {
          questionedDeath:
            true,
        },
      },

      {
        id: 'inspect_body',

        text:
          'Examinar o próprio corpo',

        nextScene:
          'inspect_body',

        timeMinutes: 3,

        flags: {
          inspectedBody:
            true,
        },
      },

      {
        id: 'walk_door',

        text:
          'Ir até a porta',

        nextScene:
          'door',

        timeMinutes: 1,

        flags: {
          approachedDoor:
            true,
        },
      },
    ],
  },

  standing: {
    id: 'standing',

    chapter: 'PRÓLOGO',

    title: 'Em Pé',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você apoia os pés no chão.',

      'O piso está gelado, mas o frio parece distante.',

      'Você se levanta devagar.',

      'Seu equilíbrio está perfeito.',

      'Melhor do que deveria.',

      'A fome, porém, continua ali.',

      'Não é fome de comida.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Aí está. Duas pernas, dois braços e uma quantidade preocupante de perguntas.',
    },

    choices: [
      {
        id: 'inspect_body_from_standing',

        text:
          'Examinar o próprio corpo',

        nextScene:
          'inspect_body',

        timeMinutes: 2,

        flags: {
          inspectedBody:
            true,
        },
      },

      {
        id: 'walk_to_door',

        text:
          'Ir até a porta',

        nextScene:
          'door',

        timeMinutes: 1,

        flags: {
          approachedDoor:
            true,
        },
      },

      {
        id: 'demand_answer',

        text:
          '"Quem é você?"',

        nextScene:
          'ask_voice',

        timeMinutes: 1,

        flags: {
          demandedVoiceIdentity:
            true,
        },
      },
    ],
  },

  inspect_body: {
    id: 'inspect_body',

    chapter: 'PRÓLOGO',

    title: 'Sem Pulso',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você coloca dois dedos contra o próprio pescoço.',

      'Nada.',

      'Tenta novamente.',

      'Nenhum pulso.',

      'Coloca a mão sobre o peito.',

      'Seu coração está parado.',

      'Ainda assim você está de pé.',

      'Pensando.',

      'Olhando.',

      'Com medo.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Parabéns. Diagnóstico correto: morto.',
    },

    choices: [
      {
        id: 'ask_what_happened',

        text:
          '"O que aconteceu comigo?"',

        nextScene:
          'voice_question',

        timeMinutes: 1,

        flags: {
          askedWhatHappened:
            true,
        },
      },

      {
        id: 'go_door_after_body',

        text:
          'Ir até a porta',

        nextScene:
          'door',

        timeMinutes: 1,

        flags: {
          approachedDoor:
            true,
        },
      },
    ],
  },

  /* ==========================================
     VOZES
  ========================================== */

  ask_voice: {
    id: 'ask_voice',

    chapter: 'PRÓLOGO',

    title: 'As Vozes',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Sua própria voz soa estranha quando sai de sua boca.',

      '"Quem está falando?"',

      'Silêncio.',

      'Você olha para a porta.',

      'Para os cantos da sala.',

      'Para trás da maca.',

      'Não há ninguém.',

      'Então a resposta vem novamente.',

      'Mas desta vez você entende.',

      'A voz não veio da sala.',

      'Veio de dentro da sua cabeça.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Agora estamos chegando a algum lugar.',
    },

    choices: [
      {
        id: 'panic_voice',

        text:
          '"Sai da minha cabeça."',

        nextScene:
          'voice_panic',

        timeMinutes: 2,

        flags: {
          rejectedVoice:
            true,
        },
      },

      {
        id: 'question_voice',

        text:
          '"Quem é você?"',

        nextScene:
          'voice_question',

        timeMinutes: 1,

        flags: {
          questionedVoice:
            true,
        },
      },

      {
        id: 'ignore_voice',

        text:
          'Ignorar a voz e procurar uma saída',

        nextScene:
          'door',

        timeMinutes: 2,

        flags: {
          ignoredVoice:
            true,
        },
      },
    ],
  },

  voice_panic: {
    id: 'voice_panic',

    chapter: 'PRÓLOGO',

    title: 'Silêncio',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      '"Sai da minha cabeça!"',

      'Você grita.',

      'Sua voz ecoa pelo corredor do hospital.',

      'Por alguns segundos, não existe resposta.',

      'Então outra voz, diferente da primeira, sussurra muito baixo.',
    ],

    dialogue: {
      speaker: 'Outra Voz',

      text:
        'Ele acha que a cabeça ainda pertence só a ele.',
    },

    choices: [
      {
        id: 'freeze',

        text:
          'Ficar em silêncio',

        nextScene:
          'door',

        timeMinutes: 2,

        flags: {
          heardSecondVoice:
            true,
        },
      },
    ],
  },

  voice_question: {
    id: 'voice_question',

    chapter: 'PRÓLOGO',

    title: 'Uma Resposta Inútil',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      '"Quem é você?"',

      'A pergunta parece simples.',

      'A resposta não.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Hoje? Talvez eu seja você. Talvez seja alguém que esqueceu de morrer direito.',
    },

    choices: [
      {
        id: 'go_to_door_after_voice',

        text:
          'Parar de discutir e procurar uma saída',

        nextScene:
          'door',

        timeMinutes: 2,

        flags: {
          stoppedArguingWithVoice:
            true,
        },
      },
    ],
  },

  /* ==========================================
     CELULAR
  ========================================== */

  check_phone: {
    id: 'check_phone',

    chapter: 'PRÓLOGO',

    title: 'Chamadas Perdidas',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você pega o celular.',

      'A bateria está quase acabando.',

      'Quando a tela acende, dezenas de notificações aparecem de uma vez.',

      'Você consegue rapidamente organizar os horários.',

      'Chamadas perdidas.',

      'Mensagens.',

      'Sua irmã tentou falar com você várias vezes.',

      'A última mensagem foi enviada horas atrás.',

      '"Por favor me responde. Estou preocupada."',

      'Você fica olhando para aquelas palavras por alguns segundos.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Não liga. Ainda não. Você vai ter muita coisa para explicar.',
    },

    choices: [
      {
        id: 'read_sister_messages',

        text:
          'Ler as mensagens da sua irmã',

        nextScene:
          'sister_messages',

        timeMinutes: 5,

        flags: {
          readSisterMessages:
            true,
        },
      },

      {
        id: 'put_phone_away',

        text:
          'Guardar o celular e levantar',

        nextScene:
          'standing',

        timeMinutes: 1,

        flags: {
          keptPhone:
            true,
        },
      },
    ],
  },

  check_phone_confused: {
    id: 'check_phone_confused',

    chapter: 'PRÓLOGO',

    title: 'Notificações',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você pega o celular.',

      'A tela acende com dezenas de notificações.',

      'Os horários parecem embaralhados.',

      'Você lê uma mensagem.',

      'Depois outra.',

      'Volta para a primeira.',

      'Sua cabeça não consegue organizar a sequência.',

      'Mas um nome aparece repetidamente.',

      'Sua irmã.',

      'Ela tentou falar com você muitas vezes.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Ela está preocupada. E você ainda nem sabe com o quê ela deveria estar preocupada.',
    },

    choices: [
      {
        id: 'read_messages',

        text:
          'Continuar lendo',

        nextScene:
          'sister_messages',

        timeMinutes: 6,
      },

      {
        id: 'stop_reading',

        text:
          'Guardar o celular',

        nextScene:
          'standing',

        timeMinutes: 1,
      },
    ],
  },

  check_phone_botch: {
    id: 'check_phone_botch',

    chapter: 'PRÓLOGO',

    title: 'Senha Incorreta',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você pega o celular depressa.',

      'Seus dedos parecem mais rápidos do que sua cabeça.',

      'Digita a senha errada.',

      'Tenta novamente.',

      'Errada.',

      'A tela avisa que uma nova tentativa incorreta bloqueará temporariamente o aparelho.',

      'Você para.',

      'Respira por hábito.',

      'E lembra novamente que não precisa respirar.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Excelente. Morto há poucas horas e já quase perdeu o acesso ao próprio telefone.',
    },

    choices: [
      {
        id: 'put_away',

        text:
          'Guardar o celular',

        nextScene:
          'standing',

        timeMinutes: 2,

        flags: {
          phoneAttemptFailed:
            true,
        },
      },
    ],
  },

  sister_messages: {
    id: 'sister_messages',

    chapter: 'PRÓLOGO',

    title: 'Família',

    location: {
      id: 'malkavian_hospital',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você percorre as mensagens.',

      '"Onde você está?"',

      '"Você saiu com aquela garota de novo?"',

      '"Me responde."',

      '"Eu só quero saber se você está bem."',

      'A última mensagem termina sem resposta.',

      'Você começa a digitar alguma coisa.',

      'Apaga.',

      'Tenta outra vez.',

      'Apaga novamente.',

      'Como explicar que você não sabe se está bem porque nem sequer sabe se ainda está vivo?',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Ela ainda te ama. Isso vai complicar tudo.',
    },

    choices: [
      {
        id: 'leave_phone',

        text:
          'Guardar o celular',

        nextScene:
          'door',

        timeMinutes: 2,

        flags: {
          keptSisterSecret:
            true,
        },
      },
    ],
  },

  /* ==========================================
     CORREDOR
  ========================================== */

  door: {
    id: 'door',

    chapter: 'PRÓLOGO',

    title: 'O Corredor',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você empurra a porta metálica.',

      'Ela range alto demais.',

      'Do outro lado existe um corredor comprido, iluminado apenas por algumas lâmpadas de emergência.',

      'Portas antigas se alinham dos dois lados.',

      'Algumas estão abertas.',

      'Outras foram fechadas com correntes.',

      'No fim do corredor há um homem encostado na parede.',

      'Jaqueta velha.',

      'Cabelo comprido.',

      'Postura relaxada demais para aquele lugar.',

      'Ele olha para você como se estivesse esperando há algum tempo.',
    ],

    dialogue: {
      speaker: 'Desconhecido',

      text:
        'Então você é a cria da Lívia.',
    },

    choices: [
      {
        id: 'ask_livia',

        text:
          '"Onde está a Lívia?"',

        nextScene:
          'jack_intro',

        timeMinutes: 1,

        flags: {
          firstQuestionWasLivia:
            true,
        },
      },

      {
        id: 'ask_man',

        text:
          '"Quem é você?"',

        nextScene:
          'jack_intro',

        timeMinutes: 1,
      },

      {
        id: 'stay_silent',

        text:
          'Ficar em silêncio',

        nextScene:
          'jack_intro',

        timeMinutes: 1,
      },
    ],
  },

  /* ==========================================
     JACK — SUCESSO EM EMPATIA
  ========================================== */

  jack_intro_read: {
    id: 'jack_intro_read',

    chapter: 'PRÓLOGO',

    title: 'O Estranho',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você observa o desconhecido antes de responder.',

      'Ele está relaxado, mas não desatento.',

      'A posição das mãos.',

      'O jeito como ocupa o corredor.',

      'A maneira como mantém distância suficiente para reagir caso você avance.',

      'Ele é perigoso.',

      'Muito perigoso.',

      'Mas não parece estar ali para matar você.',

      'Pelo menos não agora.',
    ],

    dialogue: {
      speaker: 'Desconhecido',

      text:
        'Boa. Pelo menos você olha antes de abrir a boca.',
    },

    choices: [
      {
        id: 'ask_name',

        text:
          '"Quem é você?"',

        nextScene:
          'jack_reveals_name',

        timeMinutes: 1,

        flags: {
          readJackCorrectly:
            true,
        },
      },
    ],
  },

  /* ==========================================
     JACK — FALHA NORMAL
  ========================================== */

  jack_intro: {
    id: 'jack_intro',

    chapter: 'PRÓLOGO',

    title: 'Jack',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'O homem observa seu rosto por alguns segundos.',

      'Não parece impressionado.',

      'Também não parece assustado.',

      'Isso, por algum motivo, é ainda mais preocupante.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Jack. E se eu fosse você, guardava as perguntas mais difíceis para depois. A noite vai ser longa.',
    },

    choices: [
      {
        id: 'continue_with_jack',

        text:
          'Seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 5,

        flags: {
          metJack:
            true,
        },
      },
    ],
  },

  /* ==========================================
     JACK — FALHA CRÍTICA EMPATIA
  ========================================== */

  jack_intro_misread: {
    id: 'jack_intro_misread',

    chapter: 'PRÓLOGO',

    title: 'Ameaça',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você observa o homem.',

      'Alguma coisa em sua postura parece errada.',

      'Seu cérebro transforma pequenos detalhes em sinais de ameaça.',

      'A mão perto do bolso.',

      'A maneira como ele inclina a cabeça.',

      'O sorriso curto.',

      'Você tem certeza de que ele está prestes a atacar.',

      'Seu corpo fica tenso.',
    ],

    dialogue: {
      speaker: 'Desconhecido',

      text:
        'Ei. Relaxa. Se eu quisesse te matar, você não teria acordado.',
    },

    choices: [
      {
        id: 'back_away',

        text:
          'Dar um passo para trás',

        nextScene:
          'jack_reveals_name',

        timeMinutes: 2,

        flags: {
          fearedJackInitially:
            true,
        },
      },

      {
        id: 'ask_identity',

        text:
          '"Quem é você?"',

        nextScene:
          'jack_reveals_name',

        timeMinutes: 1,
      },
    ],
  },

  /* ==========================================
     JACK — SUCESSO MANHA
  ========================================== */

  jack_intro_silent_success: {
    id: 'jack_intro_silent_success',

    chapter: 'PRÓLOGO',

    title: 'Esperar',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você não responde imediatamente.',

      'Observa.',

      'Espera.',

      'O desconhecido percebe a escolha.',

      'Um pequeno sorriso aparece em seu rosto.',

      'Não parece zombaria.',

      'Parece aprovação.',
    ],

    dialogue: {
      speaker: 'Desconhecido',

      text:
        'Certo. Você aprende rápido. Às vezes ficar quieto mantém você vivo.',
    },

    choices: [
      {
        id: 'wait',

        text:
          'Continuar esperando',

        nextScene:
          'jack_reveals_name',

        timeMinutes: 1,

        flags: {
          impressedJack:
            true,
        },
      },
    ],
  },

  /* ==========================================
     JACK — FALHA CRÍTICA MANHA
  ========================================== */

  jack_intro_silent_botch: {
    id: 'jack_intro_silent_botch',

    chapter: 'PRÓLOGO',

    title: 'Tensão',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Você fica em silêncio.',

      'Mas seu corpo está rígido.',

      'Seus olhos permanecem fixos demais nele.',

      'O gesto que você pretendia usar como cautela parece desafio.',

      'O desconhecido deixa de sorrir.',
    ],

    dialogue: {
      speaker: 'Desconhecido',

      text:
        'Não faz isso, garoto. Você ainda não sabe quem pode encarar desse jeito.',
    },

    choices: [
      {
        id: 'relax',

        text:
          'Desviar o olhar',

        nextScene:
          'jack_reveals_name',

        timeMinutes: 2,

        flags: {
          awkwardFirstMeeting:
            true,
        },
      },

      {
        id: 'ask_name',

        text:
          '"Quem é você?"',

        nextScene:
          'jack_reveals_name',

        timeMinutes: 1,
      },
    ],
  },

  jack_reveals_name: {
    id: 'jack_reveals_name',

    chapter: 'PRÓLOGO',

    title: 'Jack',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'O homem desencosta da parede.',

      'Agora que está mais perto, você percebe que existe algo estranho nele também.',

      'Não é apenas confiança.',

      'É a ausência de pequenos movimentos humanos.',

      'Respiração.',

      'Mudanças involuntárias de postura.',

      'Ele é como você.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Jack. Só Jack. E você tem problemas maiores do que meu sobrenome.',
    },

    choices: [
      {
        id: 'ask_livia',

        text:
          '"Onde está a Lívia?"',

        nextScene:
          'jack_about_livia',

        timeMinutes: 2,
      },

      {
        id: 'ask_dead',

        text:
          '"O que aconteceu comigo?"',

        nextScene:
          'jack_explains_basics',

        timeMinutes: 3,
      },

      {
        id: 'follow',

        text:
          'Seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 3,

        flags: {
          metJack:
            true,
        },
      },
    ],
  },

  jack_about_livia: {
    id: 'jack_about_livia',

    chapter: 'PRÓLOGO',

    title: 'Lívia',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'O nome dela parece mudar alguma coisa no rosto de Jack.',

      'Não pena.',

      'Talvez irritação.',

      'Talvez preocupação.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Você vai ter respostas sobre a Lívia. Mas não aqui. E não todas de uma vez.',
    },

    choices: [
      {
        id: 'demand',

        text:
          '"Ela está viva?"',

        nextScene:
          'jack_livia_answer',

        timeMinutes: 1,
      },

      {
        id: 'follow',

        text:
          'Seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 3,
      },
    ],
  },

  jack_livia_answer: {
    id: 'jack_livia_answer',

    chapter: 'PRÓLOGO',

    title: 'Sem Resposta',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Jack sustenta seu olhar.',

      'Desta vez ele não faz piada.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Agora? Sim. Mas se a Camarilla tiver alguma coisa a dizer sobre isso, talvez não por muito tempo.',
    },

    choices: [
      {
        id: 'ask_camarilla',

        text:
          '"Camarilla?"',

        nextScene:
          'jack_explains_camarilla',

        timeMinutes: 3,
      },

      {
        id: 'follow',

        text:
          'Seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 2,
      },
    ],
  },

  jack_explains_basics: {
    id: 'jack_explains_basics',

    chapter: 'PRÓLOGO',

    title: 'O Básico',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Jack olha para você como um professor cansado diante de um aluno que perdeu metade do semestre.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Você morreu. Lívia colocou o sangue dela em você. Agora você é um vampiro. Membro, Kindred, sanguessuga, escolha seu termo favorito. O importante é: sol mata, fogo machuca muito e essa fome que você está sentindo só piora.',
    },

    choices: [
      {
        id: 'deny',

        text:
          '"Isso é impossível."',

        nextScene:
          'jack_denial',

        timeMinutes: 2,
      },

      {
        id: 'ask_hunger',

        text:
          '"Que fome é essa?"',

        nextScene:
          'jack_hunger',

        timeMinutes: 2,
      },

      {
        id: 'follow',

        text:
          'Aceitar por enquanto e seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 3,
      },
    ],
  },

  jack_denial: {
    id: 'jack_denial',

    chapter: 'PRÓLOGO',

    title: 'Impossível',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      '"Isso é impossível."',

      'Jack olha para você.',

      'Depois aponta para seu peito.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Então encontra seu pulso e me explica a parte impossível.',
    },

    choices: [
      {
        id: 'follow',

        text:
          'Seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 2,
      },
    ],
  },

  jack_hunger: {
    id: 'jack_hunger',

    chapter: 'PRÓLOGO',

    title: 'Fome',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'A simples palavra parece acordar alguma coisa dentro de você.',

      'Fome.',

      'Sua boca fica seca.',

      'Seus dentes doem.',

      'Por um instante você imagina sangue.',

      'Quente.',

      'Vivo.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Sangue. E antes que pergunte: não, suco de tomate não funciona.',
    },

    choices: [
      {
        id: 'follow',

        text:
          'Seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 2,
      },
    ],
  },

  jack_explains_camarilla: {
    id: 'jack_explains_camarilla',

    chapter: 'PRÓLOGO',

    title: 'A Camarilla',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Jack começa a caminhar enquanto fala.',

      'Você o acompanha.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Uma organização de vampiros que gosta de fingir que é governo. Tem Príncipe, leis, punições e gente velha demais decidindo o que todo mundo pode fazer. Lívia criou você sem pedir licença. Isso é um problema.',
    },

    choices: [
      {
        id: 'ask_judgment',

        text:
          '"O que vai acontecer comigo?"',

        nextScene:
          'jack_judgment',

        timeMinutes: 2,
      },

      {
        id: 'keep_walking',

        text:
          'Continuar andando',

        nextScene:
          'jack_walk',

        timeMinutes: 2,
      },
    ],
  },

  jack_judgment: {
    id: 'jack_judgment',

    chapter: 'PRÓLOGO',

    title: 'Julgamento',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Jack não responde imediatamente.',

      'Isso não ajuda.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Você vai ser levado diante do Príncipe. Ele decide se você continua morto andando ou vira só morto.',
    },

    choices: [
      {
        id: 'continue',

        text:
          'Seguir Jack',

        nextScene:
          'jack_walk',

        timeMinutes: 3,
      },
    ],
  },

  /* ==========================================
     SAÍDA DO HOSPITAL
  ========================================== */

  jack_walk: {
    id: 'jack_walk',

    chapter: 'PRÓLOGO',

    title: 'Pelos Corredores',

    location: {
      id: 'malkavian_hospital_corridor',
      name: 'Hospital Abandonado',
      district: 'São Paulo',
    },

    narration: [
      'Jack segue pelo corredor.',

      'Você caminha atrás dele.',

      'Passam por quartos vazios, antigas salas de tratamento e paredes cobertas de tinta descascada.',

      'Algumas portas têm símbolos riscados na madeira.',

      'Você prefere não perguntar.',

      'À medida que se aproximam da saída, começam a aparecer sons da cidade.',

      'Carros.',

      'Uma buzina distante.',

      'Uma sirene.',

      'São Paulo continua funcionando.',

      'Como se sua morte não tivesse significado nada.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Primeira lição: o mundo não parou porque você morreu.',
    },

    choices: [
      {
        id: 'leave_hospital',

        text:
          'Sair do hospital',

        nextScene:
          'outside_hospital',

        timeMinutes: 5,

        flags: {
          leftHospital:
            true,
        },
      },
    ],
  },

  outside_hospital: {
    id: 'outside_hospital',

    chapter: 'PRÓLOGO',

    title: 'São Paulo à Noite',

    location: {
      id: 'hospital_street',
      name: 'Rua diante do Hospital',
      district: 'São Paulo',
    },

    narration: [
      'Jack abre uma porta lateral.',

      'O ar da noite bate no seu rosto.',

      'Você sai.',

      'São Paulo está diante de você.',

      'Prédios iluminados ao longe.',

      'Faróis cortando as ruas.',

      'Ônibus passando.',

      'Pessoas caminhando sem imaginar o que existe ao lado delas.',

      'E então você sente.',

      'Sangue.',

      'Cada pessoa na rua parece carregar uma presença quente e pulsante.',

      'Sua fome responde.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Olha só quantos corações.',
    },

    choices: [
      {
        id: 'resist_hunger',

        text:
          'Tentar ignorar a fome',

        nextScene:
          'jack_car',

        timeMinutes: 2,

        flags: {
          resistedFirstHunger:
            true,
        },
      },

      {
        id: 'watch_people',

        text:
          'Observar as pessoas na rua',

        nextScene:
          'street_hunger',

        timeMinutes: 3,

        flags: {
          watchedMortals:
            true,
        },
      },
    ],
  },

  street_hunger: {
    id: 'street_hunger',

    chapter: 'PRÓLOGO',

    title: 'Corações',

    location: {
      id: 'hospital_street',
      name: 'Rua diante do Hospital',
      district: 'São Paulo',
    },

    narration: [
      'Você observa as pessoas.',

      'Um homem passa olhando o celular.',

      'Uma mulher espera um carro de aplicativo.',

      'Um casal discute perto de uma esquina.',

      'Você consegue ouvir batimentos.',

      'Talvez não de todos.',

      'Talvez sua mente esteja inventando alguns.',

      'Mas a fome não parece se importar com a diferença.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Não encara demais. Você está com a cara de quem acabou de descobrir um buffet.',
    },

    choices: [
      {
        id: 'follow_jack',

        text:
          'Seguir Jack até o carro',

        nextScene:
          'jack_car',

        timeMinutes: 2,
      },
    ],
  },

  jack_car: {
    id: 'jack_car',

    chapter: 'PRÓLOGO',

    title: 'No Carro',

    location: {
      id: 'jack_car',
      name: 'Carro de Jack',
      district: 'São Paulo',
    },

    narration: [
      'Jack destranca um carro velho estacionado próximo ao hospital.',

      'Você entra no banco do passageiro.',

      'O motor demora duas tentativas para pegar.',

      'Jack bate no painel.',

      'O rádio liga sozinho por alguns segundos.',

      'Uma música antiga toca baixo.',

      'Ele sai para a avenida.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Agora vem a parte divertida. Vou te ensinar o suficiente para você não morrer antes do seu julgamento.',
    },

    choices: [
      {
        id: 'ask_rules',

        text:
          '"Que regras?"',

        nextScene:
          'jack_rules',

        timeMinutes: 4,
      },

      {
        id: 'ask_livia_again',

        text:
          '"Quero saber sobre a Lívia."',

        nextScene:
          'jack_livia_car',

        timeMinutes: 4,
      },

      {
        id: 'stay_quiet',

        text:
          'Ficar em silêncio e observar a cidade',

        nextScene:
          'city_drive',

        timeMinutes: 6,
      },
    ],
  },

  jack_rules: {
    id: 'jack_rules',

    chapter: 'PRÓLOGO',

    title: 'Regras',

    location: {
      id: 'jack_car',
      name: 'Carro de Jack',
      district: 'São Paulo',
    },

    narration: [
      'O carro atravessa a cidade enquanto Jack fala.',

      'Sem cerimônia.',

      'Sem discurso bonito.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Não deixa mortal descobrir o que você é. Não sai no sol. Não brinca com fogo. Não entra no território de outro vampiro achando que é parque público. E aprende a controlar a fome antes que a fome controle você.',
    },

    choices: [
      {
        id: 'ask_mortals',

        text:
          '"E se alguém descobrir?"',

        nextScene:
          'jack_mask',

        timeMinutes: 3,
      },

      {
        id: 'continue_drive',

        text:
          'Continuar viagem',

        nextScene:
          'city_drive',

        timeMinutes: 5,
      },
    ],
  },

  jack_mask: {
    id: 'jack_mask',

    chapter: 'PRÓLOGO',

    title: 'A Máscara',

    location: {
      id: 'jack_car',
      name: 'Carro de Jack',
      district: 'São Paulo',
    },

    narration: [
      'Jack muda de faixa sem olhar para você.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Chamam de Máscara. Mortais não podem saber que nós existimos. Quando alguém quebra isso, todo mundo fica em risco. É uma das poucas regras que até eu acho que faz sentido.',
    },

    choices: [
      {
        id: 'continue',

        text:
          'Continuar viagem',

        nextScene:
          'city_drive',

        timeMinutes: 4,
      },
    ],
  },

  jack_livia_car: {
    id: 'jack_livia_car',

    chapter: 'PRÓLOGO',

    title: 'Ela Escolheu Você',

    location: {
      id: 'jack_car',
      name: 'Carro de Jack',
      district: 'São Paulo',
    },

    narration: [
      'Jack segura o volante com uma mão.',

      'Por alguns segundos ele parece decidir quanto contar.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Lívia não fez isso por acidente. Ela escolheu você. Há quanto tempo e por quê... isso é coisa que você vai ter que descobrir.',
    },

    choices: [
      {
        id: 'ask_why',

        text:
          '"Por que eu?"',

        nextScene:
          'jack_livia_why',

        timeMinutes: 2,
      },

      {
        id: 'continue',

        text:
          'Continuar viagem',

        nextScene:
          'city_drive',

        timeMinutes: 4,
      },
    ],
  },

  jack_livia_why: {
    id: 'jack_livia_why',

    chapter: 'PRÓLOGO',

    title: 'Por Quê?',

    location: {
      id: 'jack_car',
      name: 'Carro de Jack',
      district: 'São Paulo',
    },

    narration: [
      'Jack olha rapidamente para você.',

      'Depois volta os olhos para a rua.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Talvez ela tenha visto alguma coisa em você. Talvez tenha se apaixonado. Talvez seja pior. Malkavianos não costumam escolher gente por motivos simples.',
    },

    choices: [
      {
        id: 'continue',

        text:
          'Olhar pela janela',

        nextScene:
          'city_drive',

        timeMinutes: 4,
      },
    ],
  },

  city_drive: {
    id: 'city_drive',

    chapter: 'PRÓLOGO',

    title: 'A Cidade',

    location: {
      id: 'jack_car',
      name: 'Carro de Jack',
      district: 'São Paulo',
    },

    narration: [
      'São Paulo passa do lado de fora da janela.',

      'Semáforos.',

      'Prédios.',

      'Postos de gasolina.',

      'Bares ainda abertos.',

      'Gente voltando para casa.',

      'Gente começando a noite.',

      'Tudo parece familiar.',

      'E completamente diferente.',

      'Você percebe que não está mais olhando para a cidade como alguém que pertence ao dia.',

      'Agora você faz parte do que acontece depois que as luzes se apagam.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Você sempre gostou da noite. Agora ela gosta de você também.',
    },

    choices: [
      {
        id: 'continue_to_judgment',

        text:
          'Seguir para o julgamento',

        nextScene:
          'judgment_arrival',

        timeMinutes: 18,

        flags: {
          headingToJudgment:
            true,
        },
      },
    ],
  },

  /* ==========================================
     JULGAMENTO
  ========================================== */

  judgment_arrival: {
    id: 'judgment_arrival',

    chapter: 'PRÓLOGO',

    title: 'A Corte',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'O carro para diante de um edifício que você já viu antes sem nunca prestar atenção.',

      'Jack desliga o motor.',

      'Por um momento nenhum dos dois fala.',

      'Ele olha para você.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Daqui pra frente, pensa antes de responder. O Príncipe não é conhecido pelo senso de humor.',
    },

    choices: [
      {
        id: 'enter_court',

        text:
          'Entrar',

        nextScene:
          'judgment_hall',

        timeMinutes: 4,

        flags: {
          enteredCamarillaCourt:
            true,
        },
      },
    ],
  },

  judgment_hall: {
    id: 'judgment_hall',

    chapter: 'PRÓLOGO',

    title: 'O Julgamento',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'As portas se abrem.',

      'Há mais pessoas no salão do que você esperava.',

      'Pessoas demais que não respiram.',

      'Algumas conversam baixo.',

      'Outras apenas observam.',

      'No centro do salão está Lívia.',

      'Você a reconhece imediatamente.',

      'Por um instante todo o resto desaparece.',

      'Ela olha para você.',

      'Não sorri.',

      'Há algo em seus olhos que parece alívio.',

      'E medo.',
    ],

    dialogue: {
      speaker: 'O Príncipe',

      text:
        'Finalmente acordou, neófito.',
    },

    choices: [
      {
        id: 'look_livia',

        text:
          'Olhar para Lívia',

        nextScene:
          'judgment_livia',

        timeMinutes: 1,
      },

      {
        id: 'look_prince',

        text:
          'Encarar o Príncipe',

        nextScene:
          'judgment_prince',

        timeMinutes: 1,
      },

      {
        id: 'stay_silent',

        text:
          'Ficar em silêncio',

        nextScene:
          'judgment_prince',

        timeMinutes: 1,
      },
    ],
  },

  judgment_livia: {
    id: 'judgment_livia',

    chapter: 'PRÓLOGO',

    title: 'Lívia',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'Seus olhos encontram os dela.',

      'Por um instante você lembra do apartamento.',

      'Da música.',

      'Do cheiro do perfume dela.',

      'Da sensação dos dedos frios no seu pescoço.',

      'Depois sangue.',

      'Dor.',

      'Escuridão.',

      'Lívia parece querer dizer alguma coisa.',

      'Mas não diz.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Ela sabia que isso podia acontecer.',
    },

    choices: [
      {
        id: 'face_prince',

        text:
          'Voltar a atenção para o Príncipe',

        nextScene:
          'judgment_prince',

        timeMinutes: 1,
      },
    ],
  },

  judgment_prince: {
    id: 'judgment_prince',

    chapter: 'PRÓLOGO',

    title: 'A Tradição',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'O Príncipe permanece sentado.',

      'Não precisa levantar a voz.',

      'O salão inteiro já está em silêncio.',
    ],

    dialogue: {
      speaker: 'O Príncipe',

      text:
        'Existe um código de conduta rigoroso ao qual todos nós devemos aderir se quisermos sobreviver. Sua criadora quebrou uma das tradições fundamentais desta cidade. Ela criou você sem autorização.',
    },

    choices: [
      {
        id: 'say_nothing',

        text:
          'Permanecer em silêncio',

        nextScene:
          'judgment_sentence',

        timeMinutes: 3,
      },

      {
        id: 'ask_why_punish_me',

        text:
          '"Eu não pedi por isso."',

        nextScene:
          'judgment_response',

        timeMinutes: 2,
      },
    ],
  },

  judgment_response: {
    id: 'judgment_response',

    chapter: 'PRÓLOGO',

    title: 'Responsabilidade',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'Alguns dos vampiros presentes trocam olhares.',

      'O Príncipe não demonstra surpresa.',
    ],

    dialogue: {
      speaker: 'O Príncipe',

      text:
        'Não. Você não pediu. Mas sua existência agora é uma realidade pela qual alguém deverá responder.',
    },

    choices: [
      {
        id: 'continue',

        text:
          'Ouvir',

        nextScene:
          'judgment_sentence',

        timeMinutes: 2,
      },
    ],
  },

  judgment_sentence: {
    id: 'judgment_sentence',

    chapter: 'PRÓLOGO',

    title: 'A Sentença',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'O Príncipe olha primeiro para Lívia.',

      'Depois para você.',

      'O silêncio dura tempo demais.',
    ],

    dialogue: {
      speaker: 'O Príncipe',

      text:
        'Sua criadora será punida por sua transgressão. Quanto a você, permitir que viva me torna responsável pelo seu comportamento subsequente. Portanto, sua existência será uma provação.',
    },

    choices: [
      {
        id: 'continue',

        text:
          'Continuar ouvindo',

        nextScene:
          'judgment_livia_death',

        timeMinutes: 2,
      },
    ],
  },

  judgment_livia_death: {
    id: 'judgment_livia_death',

    chapter: 'PRÓLOGO',

    title: 'A Morte de Lívia',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'Você demora alguns segundos para entender o que está acontecendo.',

      'Dois vampiros se aproximam de Lívia.',

      'Ela não tenta fugir.',

      'Olha apenas para você.',

      'Talvez queira pedir desculpas.',

      'Talvez queira que você entenda.',

      'Talvez saiba que não existe tempo para nenhum dos dois.',

      'Então tudo acontece rápido demais.',

      'Quando termina, Lívia não existe mais.',

      'O salão permanece silencioso.',

      'Alguma coisa dentro de você também.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Agora ela realmente foi embora.',
    },

    choices: [
      {
        id: 'continue',

        text:
          'Encarar o Príncipe',

        nextScene:
          'judgment_mission',

        timeMinutes: 3,

        flags: {
          liviaExecuted:
            true,
        },
      },
    ],
  },

  judgment_mission: {
    id: 'judgment_mission',

    chapter: 'PRÓLOGO',

    title: 'A Provação',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'Você mal consegue organizar o que acabou de ver.',

      'O Príncipe continua falando como se estivesse tratando de negócios.',
    ],

    dialogue: {
      speaker: 'O Príncipe',

      text:
        'Esta é a sua provação. Você demonstrará que consegue existir dentro das leis desta cidade. Sirva bem, preserve a Máscara e talvez prove que minha decisão de permitir que continue existindo não foi um erro.',
    },

    choices: [
      {
        id: 'accept',

        text:
          'Aceitar em silêncio',

        nextScene:
          'prologue_end',

        timeMinutes: 2,

        flags: {
          survivedJudgment:
            true,
        },
      },

      {
        id: 'ask_choice',

        text:
          '"E se eu recusar?"',

        nextScene:
          'judgment_refusal',

        timeMinutes: 1,
      },
    ],
  },

  judgment_refusal: {
    id: 'judgment_refusal',

    chapter: 'PRÓLOGO',

    title: 'Escolha',

    location: {
      id: 'camarilla_court',
      name: 'Salão da Camarilla',
      district: 'São Paulo',
    },

    narration: [
      'Por alguns segundos ninguém se move.',

      'Jack fecha os olhos brevemente, como se já soubesse a resposta.',
    ],

    dialogue: {
      speaker: 'O Príncipe',

      text:
        'Então sua existência termina esta noite.',
    },

    choices: [
      {
        id: 'accept_after_all',

        text:
          'Aceitar a provação',

        nextScene:
          'prologue_end',

        timeMinutes: 1,

        flags: {
          survivedJudgment:
            true,

          challengedPrince:
            true,
        },
      },
    ],
  },

  /* ==========================================
     FINAL DO PRÓLOGO
  ========================================== */

  prologue_end: {
    id: 'prologue_end',

    chapter: 'PRÓLOGO',

    title: 'Depois da Morte',

    location: {
      id: 'camarilla_court_exit',
      name: 'Saída da Corte',
      district: 'São Paulo',
    },

    narration: [
      'As portas do salão se fecham atrás de você.',

      'Lívia está morta.',

      'Você também.',

      'Mas apenas um de vocês continua andando.',

      'Jack espera alguns metros adiante.',

      'São Paulo continua do lado de fora.',

      'A cidade onde você nasceu.',

      'A cidade onde você perdeu pessoas.',

      'A cidade onde sua vida nunca pareceu dar certo.',

      'Agora ela é outra coisa.',

      'Território.',

      'Caça.',

      'Política.',

      'Sangue.',

      'E em algum lugar dentro da sua cabeça, as vozes continuam conversando.',
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Vamos. Sua primeira noite ainda nem começou direito.',
    },

    choices: [],
  },
}

export default prologueScenes