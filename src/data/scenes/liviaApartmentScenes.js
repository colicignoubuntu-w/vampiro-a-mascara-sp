function createLiviaFileScene({
  id,
  title,
  narration,
  flag,
}) {
  return {
    id,
    chapter: 'O LEGADO DE LÍVIA',
    title,
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration,
    dialogue: null,
    choices: [
      {
        id: `${id}_return`,
        text: 'Voltar à lista de arquivos.',
        nextScene: 'livia_computer_unlocked',
        timeMinutes: 1,
        flags: {
          [flag]: true,
        },
      },
    ],
  }
}

const liviaApartmentScenes = {
  /*
    ========================================
    CHEGADA AO APARTAMENTO
    ========================================
  */

  livia_apartment_arrival: {
    id: 'livia_apartment_arrival',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'O Apartamento de Lívia',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

   narration: [
  `O prédio parece ainda mais velho à noite. A fachada manchada pela chuva quase desaparece entre as construções do centro de São Paulo.

Você reconhece o lugar antes mesmo de entrar. Já esteve ali vezes suficientes para não precisar pensar no caminho.`,

  `Ainda assim, atravessar a entrada agora é diferente.

Algumas lembranças surgem sem que você as procure: Lívia abrindo a porta para você, a voz dela vindo de algum lugar do apartamento, o cheiro familiar que encontrava sempre que entrava.

Por um momento, são lembranças comuns.

Depois vem o sangue.`,

  `Você sobe as escadas até o andar onde ela morava.

Quando chega ao apartamento, encontra a porta fechada.

Você tenta a maçaneta.

Trancada.`,

  `Você permanece diante dela por alguns segundos.

É estranho pensar que Lívia nunca mais vai aparecer do outro lado para abrir a porta e deixar você entrar.`,

  `Jack estava certo.

Se ela deixou alguma resposta para o que aconteceu — ou qualquer coisa que possa explicar por que escolheu você — provavelmente está aqui.`,
],

    dialogue: null,

    choices: [
      {
        id: 'try_open_livia_door',

        text: 'Tentar abrir a porta.',

        nextScene: 'livia_apartment_locked_door',

        timeMinutes: 1,
      },

      {
        id: 'leave_livia_apartment',

        text: 'Ir embora por enquanto.',

        nextScene: 'free_roam',

        timeMinutes: 1,
      },
    ],
  },

  /*
    ========================================
    A PORTA TRANCADA
    ========================================
  */

  livia_apartment_locked_door: {
    id: 'livia_apartment_locked_door',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'A Porta',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
      `Você segura a maçaneta e examina a porta. Poderia tentar forçá-la, mas Jack percebe sua intenção antes que você faça qualquer coisa.

Ele toca seu braço de leve e balança a cabeça.`,
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Calma aí, garoto. Você acabou de ganhar uma segunda chance e já quer começar com vizinho chamando a polícia? Primeiro a gente tenta entrar sem transformar isso numa cena de crime.',
    },

    choices: [
      {
        id: 'ask_jack_how_to_enter',

        text: '"E como a gente entra?"',

        nextScene: 'jack_lockpick_kit',

        timeMinutes: 1,
      },
    ],
  },

  jack_lockpick_kit: {
    id: 'jack_lockpick_kit',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'Ferramentas do Ofício',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
      `Jack enfia a mão por dentro da jaqueta e tira um pequeno estojo escuro. Quando abre, você encontra algumas ferramentas finas de metal organizadas lado a lado.

Ele estende o estojo para você.`,
    ],

    dialogue: {
      speaker: 'Jack',

       text:
    'Primeira lição grátis: força resolve muita coisa. Discrição resolve sem deixar vizinho, câmera e polícia fazendo perguntas depois. Toma, fica com isso por enquanto. Vamos ver se você sabe usar.',
},

    choices: [
      {
        id: 'pick_livia_lock',

        text: '[Segurança] Tentar abrir a fechadura.',

        test: {
          ability: 'security',
          difficulty: 6,
          successScene: 'livia_lockpick_success',
          failureScene: 'livia_lockpick_failure',
        },

        timeMinutes: 2,
      },
    ],
  },

  livia_lockpick_success: {
    id: 'livia_lockpick_success',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'Clique',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
      `Você se ajoelha diante da fechadura e encaixa as ferramentas.

No começo, sente apenas a resistência do mecanismo. Então começa a perceber pequenas mudanças na pressão. Você ajusta uma das ferramentas, tenta novamente e escuta um clique discreto.`,

      `A fechadura cede.

Você gira a maçaneta e olha para Jack.`,
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Olha só. Talvez você dure mais de uma semana.',
    },

    choices: [
      {
        id: 'enter_livia_apartment_after_lockpick',

        text: 'Abrir a porta.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 1,

        flags: {
          visitedLiviaApartment: true,
          pickedLiviaApartmentLock: true,
        },
      },
    ],
  },

  livia_lockpick_failure: {
    id: 'livia_lockpick_failure',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'Clique Errado',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
      `Você tenta reproduzir o que imagina que deveria fazer, movimentando as ferramentas dentro da fechadura.

Nada.

Muda a pressão, tenta outro ângulo e continua por mais alguns segundos. A fechadura permanece exatamente como estava.`,

      `Jack observa em silêncio até estender a mão.`,
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Tá bom, garoto. Antes que você transforme uma fechadura de trinta reais num problema de trezentos, me dá isso aqui.',
    },

    choices: [
      {
        id: 'give_lockpicks_to_jack',

        text: 'Entregar as ferramentas.',

        nextScene: 'jack_opens_livia_door',

        timeMinutes: 1,
      },
    ],
  },

  jack_opens_livia_door: {
    id: 'jack_opens_livia_door',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'Experiência',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
      `Jack se abaixa diante da porta e coloca as ferramentas na fechadura.

Ele faz dois movimentos curtos.

Clique.

Jack gira a maçaneta, recolhe as ferramentas e guarda o estojo dentro da jaqueta.`,
    ],

    dialogue: {
      speaker: 'Jack',

      text:
        'Você tem tempo para aprender. Uma das poucas vantagens de estar morto.',
    },

    choices: [
      {
        id: 'enter_livia_apartment_with_jack',

        text: 'Entrar no apartamento.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 1,

        flags: {
          visitedLiviaApartment: true,
          jackOpenedLiviaApartment: true,
        },
      },
    ],
  },

  /*
    ========================================
    INTERIOR
    ========================================
  */

  livia_apartment_inside: {
    id: 'livia_apartment_inside',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'Onde Ela Viveu',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

  narration: [
  `O ar está parado quando você entra. As cortinas permanecem fechadas, deixando o apartamento mergulhado em uma penumbra que torna tudo estranhamente familiar.

Uma fina camada de poeira começa a se formar sobre os móveis. `,

  `Na sala, livros dividem espaço com fotografias, discos e papéis espalhados. Um computador está sobre uma pequena escrivaninha, enquanto algumas caixas permanecem empilhadas perto da estante.

O quarto fica no fim do corredor.`,

  `Você reconhece boa parte daquilo. Já esteve naquele apartamento outras vezes, mas nunca teve motivo para prestar tanta atenção ao que Lívia guardava.

Agora cada gaveta, caixa ou arquivo pode esconder alguma coisa que ela nunca contou a você.`,

  `Jack entra logo atrás.

Ele havia falado em computador, papéis e fotografias. Olhando para tudo que Lívia deixou, descobrir o que realmente importa pode levar algum tempo.`,
],

    dialogue: null,

    choices: [
      {
        id: 'investigate_livia_apartment',

        text: 'Examinar atentamente as alterações no apartamento.',

        timeMinutes: 5,
      },

      {
        id: 'search_livia_living_room',

        text: 'Vasculhar a sala.',

        nextScene: 'livia_apartment_search',

        timeMinutes: 10,

        flags: {
          searchedLiviaApartment: true,
        },
      },

      {
        id: 'inspect_livia_computer',

        text: 'Examinar o computador.',

        nextScene: 'livia_computer',

        timeMinutes: 5,
      },

      {
        id: 'search_livia_bedroom',

        text: 'Vasculhar o quarto.',

        nextScene: 'livia_bedroom',

        timeMinutes: 10,
      },

      {
  id: 'return_to_haven',

  text: 'Voltar ao refúgio.',

  nextScene: 'free_roam',

  timeMinutes: 1,
},
    ],
  },

  /*
    ========================================
    VASCULHAR A SALA
    ========================================
  */

  livia_apartment_investigation_success: {
    id: 'livia_apartment_investigation_success',
    chapter: 'O LEGADO DE LÍVIA',
    title: 'Alguém Esteve Aqui',
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration: [
      `À primeira vista, o apartamento parece apenas abandonado. Quando começa a prestar atenção aos detalhes, porém, alguma coisa não combina com suas lembranças do lugar.`,

      `Uma das gavetas da escrivaninha não fecha completamente. Você a abre e encontra papéis empurrados para um dos lados, deixando um espaço vazio no fundo. Pela marca mais clara na madeira, alguma coisa costumava ficar ali.

Não está mais.`,

      `Perto da estante, alguns livros foram colocados de volta fora de ordem. Uma das caixas também parece ter sido aberta e fechada novamente. Nada foi jogado no chão e nenhum móvel foi quebrado.

Quem esteve ali não estava procurando dinheiro.`,

      `Quanto mais você examina o apartamento, mais percebe que algumas ausências parecem específicas demais para serem acaso.

Em uma gaveta há divisórias vazias entre documentos que continuam organizados. Em outra, restaram apenas algumas folhas soltas, como se alguém tivesse retirado uma pasta inteira e colocado o restante de volta no lugar.`,

      `Dentro de uma das caixas, você encontra cópias de notícias antigas, recibos e anotações de Lívia. Algumas palavras aparecem circuladas várias vezes:

“órgãos.”

“sangue.”

“desaparecidos.”

“transferências.”

“doações.”`,

      `Há também nomes escritos à mão, alguns acompanhados de cargos ou instituições.

Empresários. Médicos. Policiais. Funcionários públicos. Assessores.

Em alguns casos, Lívia desenhou linhas entre os nomes, mas partes do esquema desapareceram junto com os documentos que foram levados.`,

      `Outra folha parece ainda mais estranha.

Há endereços de fóruns da internet, nomes de usuários e títulos de vídeos anotados nas margens. Ao lado de alguns deles, Lívia escreveu:

“encenação?”

Em outros:

“não parece.”

E, perto do fim da página:

“mesmas pessoas?”`,

      `Você encontra ainda referências isoladas a drogas, casas noturnas, clínicas particulares e pessoas desaparecidas.

Nada daquilo é suficiente para explicar o que Lívia estava investigando.

Mas é suficiente para perceber que ela não estava seguindo apenas um hospital.`,
    ],
    dialogue: {
      speaker: 'Jack',
      text:
        'Camarilla. Aposto meu traseiro. Entraram, procuraram o que interessava e deixaram o resto parecendo normal. Pelo menos tiveram educação de fechar a porta quando saíram.',
    },
    choices: [
      {
        id: 'ask_jack_why_computer_remains',
        text: '“Então por que deixaram o computador?”',
        nextScene: 'jack_explains_livia_search',
        timeMinutes: 1,
      },
      {
        id: 'continue_after_apartment_investigation',
        text: 'Continuar procurando.',
        nextScene: 'livia_apartment_inside',
        timeMinutes: 1,
      },
    ],
  },

  livia_apartment_investigation_failure: {
    id: 'livia_apartment_investigation_failure',
    chapter: 'O LEGADO DE LÍVIA',
    title: 'Vestígios',
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration: [
      'Você examina gavetas, caixas e estantes, mas o abandono torna difícil separar desordem de intenção.',
      'Se alguém esteve ali antes de vocês, não deixou sinais que você consiga reconhecer.',
    ],
    dialogue: null,
    choices: [
      {
        id: 'continue_after_failed_apartment_investigation',
        text: 'Continuar procurando.',
        nextScene: 'livia_apartment_inside',
        timeMinutes: 1,
      },
    ],
  },

  jack_explains_livia_search: {
    id: 'jack_explains_livia_search',
    chapter: 'O LEGADO DE LÍVIA',
    title: 'Lívia Vesper',
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration: [
      'Jack olha para o computador antigo sobre a escrivaninha e dá de ombros.',
    ],
    dialogue: {
      speaker: 'Jack',
      text:
        'Porque provavelmente olharam pra ele e não encontraram nada. Lívia tinha fama de arrumar problema, garoto. Fazia perguntas demais, comprava briga demais e desconfiava de todo mundo. Depois de um tempo, quando alguém assim diz que descobriu uma conspiração, metade da Corte só escuta “Lívia sendo Lívia”.',
    },
    choices: [
      {
        id: 'inspect_computer_after_search',
        text: 'Examinar o computador.',
        nextScene: 'livia_computer',
        timeMinutes: 1,
      },
      {
        id: 'continue_search_after_jack_explanation',
        text: 'Continuar procurando.',
        nextScene: 'livia_apartment_inside',
        timeMinutes: 1,
      },
    ],
  },

  livia_apartment_search: {
    id: 'livia_apartment_search',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'Coisas de uma Morta',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

   narration: [
  `Você começa pela sala.

Contas antigas, livros com páginas marcadas, fotografias sem data, recibos de lugares que você não reconhece. Nada parece importante isoladamente, mas existe uma estranha organização no caos.

Lívia guardava coisas. Muitas coisas.`,

  `Algumas fotografias mostram você antes do Abraço.

Em uma delas, você está saindo de um estabelecimento sem perceber que estava sendo observado. A fotografia foi tirada semanas antes de você conhecer Lívia.

Isso significa que ela já sabia quem você era.`,
],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Ela não encontrou você por acaso.',
    },

    choices: [
      {
        id: 'continue_search_bedroom',

        text: 'Procurar mais coisas no quarto.',

        nextScene: 'livia_bedroom',

        timeMinutes: 5,
      },

      {
        id: 'go_to_livia_computer',

        text: 'Examinar o computador.',

        nextScene: 'livia_computer',

        timeMinutes: 2,
      },

      {
        id: 'return_livia_main_room',

        text: 'Voltar para a sala.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 1,
      },
    ],
  },

  /*
    ========================================
    QUARTO
    ========================================
  */

  livia_bedroom: {
    id: 'livia_bedroom',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'O Quarto de Lívia',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

   narration: [
  `O quarto é mais organizado que a sala. Roupas escuras ocupam boa parte do armário, enquanto livros se acumulam perto da cama. Algumas coisas estão fora do lugar, mas ainda existe ali uma organização que parece muito mais com Lívia do que a desordem da sala.`,

  `Você começa a procurar. Abre gavetas, afasta roupas e examina algumas das caixas guardadas no quarto.

Debaixo de uma pequena pilha de roupas, encontra três cadernos de capa preta.`,

  `Nenhum deles possui título. Há apenas datas escritas nas primeiras páginas, indicando períodos diferentes.

Você coloca os três lado a lado e percebe que o mais antigo começa meses antes do seu Abraço.`,

  `Você abre o caderno em uma página qualquer.

No meio de anotações que ainda não fazem sentido para você, uma palavra imediatamente chama sua atenção.

Seu nome.`,
],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Meses. Ela observou você durante meses.',
    },

    choices: [
      {
        id: 'read_livia_diaries',

        text: 'Ler os cadernos.',

        nextScene: 'livia_diary',

        timeMinutes: 15,

        flags: {
          foundLiviaDiary: true,
        },
      },

      {
        id: 'bedroom_to_computer',

        text: 'Levar os cadernos e examinar o computador.',

        nextScene: 'livia_computer',

        timeMinutes: 3,

        flags: {
          foundLiviaDiary: true,
        },
      },

      {
        id: 'bedroom_return',

        text: 'Voltar para a sala.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 1,
      },
    ],
  },

  /*
    ========================================
    DIÁRIOS
    ========================================
  */

  livia_diary: {
    id: 'livia_diary',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'Antes do Abraço',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
  `As primeiras páginas são difíceis de interpretar. Lívia escrevia como se nunca esperasse que outra pessoa fosse ler aquilo. Nomes aparecem sem explicação, misturados a endereços, horários e descrições de pessoas que você não reconhece.

Você continua avançando pelas páginas, tentando encontrar algum sentido nas anotações.`,

  `Depois de algum tempo, seu nome começa a aparecer com mais frequência.

Lívia escreveu sobre seus hábitos, os lugares que você frequentava, as noites em que voltava sozinho e até sobre algumas das pessoas com quem costumava conversar. Há datas ao lado das anotações, algumas muito anteriores à noite em que vocês se conheceram.`,

  `Quanto mais você lê, mais difícil fica interpretar aquilo como simples curiosidade.

Não parece o diário de alguém apaixonado.

Parece o relatório de alguém observando uma pessoa antes de tomar uma decisão.`,

  `Nas páginas mais próximas do seu Abraço, uma mesma frase aparece diversas vezes, às vezes sozinha, outras no meio de anotações sobre você:

"Ainda existe humanidade suficiente."`,

  `Depois disso, os registros mudam. As anotações ficam mais confusas, alguns nomes desaparecem e outros passam a ser identificados apenas por iniciais.

No meio de tudo aquilo, uma palavra começa a se repetir com frequência cada vez maior.

Hospital.`,
],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Então a pergunta não é por que ela matou você.É por que ela escolheu você.',
    },

    choices: [
      {
        id: 'diary_check_computer',

        text: 'Procurar referências aos hospitais no computador.',

        nextScene: 'livia_computer',

        timeMinutes: 5,
      },

      {
        id: 'diary_return_room',

        text: 'Guardar os cadernos e continuar procurando.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 2,
      },
    ],
  },

  /*
    ========================================
    COMPUTADOR
    ========================================
  */

  livia_computer: {
    id: 'livia_computer',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'A Senha',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
  `O computador é antigo, mas ainda funciona. Você aperta o botão e espera enquanto o sistema demora alguns segundos para iniciar.`,

  `Em vez da área de trabalho, surge a tela de login de Lívia.

Um campo vazio pede a senha.`,

  `Você procura alguma indicação do que ela poderia ter usado e percebe que existe uma dica cadastrada.

Ao abri-la, uma única frase aparece na tela:

"Você sempre me deu uma razão."`,

  `Você fica olhando para aquelas palavras por alguns segundos.

Elas parecem familiares.`,
],

    dialogue: null,

    passwordChallenge: {
      suffix: 'viver',
      successScene: 'livia_computer_unlocked',
      failureScene: 'livia_computer_wrong_password',
    },

    choices: [
      {
        id: 'hack_livia_password',

        text: 'Tentar quebrar a senha pelo sistema.',

        timeMinutes: 10,
      },

      {
        id: 'reason_livia_password',

        text: 'Relacionar a dica às lembranças e aos objetos do apartamento.',

        timeMinutes: 5,
      },

      {
        id: 'computer_return_room',

        text: 'Deixar o computador por enquanto.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 1,
      },
    ],
  },

  livia_computer_wrong_password: {
    id: 'livia_computer_wrong_password',
    chapter: 'O LEGADO DE LÍVIA',
    title: 'Acesso Negado',
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration: [
      'Você confirma a senha.',
      'O computador demora um instante antes de exibir uma mensagem curta: “Acesso negado.”',
      'A dica continua na tela. Lívia esperava que você entendesse.',
    ],
    dialogue: null,
    choices: [
      {
        id: 'retry_livia_password',
        text: 'Tentar novamente.',
        nextScene: 'livia_computer',
        timeMinutes: 1,
      },
    ],
  },

  livia_computer_hack_failed: {
    id: 'livia_computer_hack_failed',
    chapter: 'O LEGADO DE LÍVIA',
    title: 'Proteção',
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration: [
      'Você procura uma forma de contornar a tela de acesso.',
      'O sistema é antigo, mas Lívia o protegeu melhor do que você esperava.',
      'Depois de várias tentativas, você percebe que insistir daquele jeito não produzirá resultado.',
    ],
    dialogue: null,
    choices: [
      {
        id: 'return_after_failed_hack',
        text: 'Voltar à tela da senha.',
        nextScene: 'livia_computer',
        timeMinutes: 1,
      },
    ],
  },

  livia_password_clue_found: {
    id: 'livia_password_clue_found',
    chapter: 'O LEGADO DE LÍVIA',
    title: 'Uma Razão',
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration: [
      'Você observa novamente as fotografias, os livros marcados e as anotações espalhadas pelo apartamento.',
      'Então se lembra de algo que Lívia disse: você lhe dava vontade de viver.',
      'A dica não fala apenas de uma razão. Ela fala de você.',
      'Seu nome e a palavra “viver”. Essa deve ser a senha.',
    ],
    dialogue: null,
    choices: [
      {
        id: 'use_discovered_password',
        text: 'Voltar ao computador e digitar a senha.',
        nextScene: 'livia_computer',
        timeMinutes: 1,

        flags: {
          discoveredLiviaPassword: true,
        },
      },
    ],
  },

  livia_password_reasoning_failed: {
    id: 'livia_password_reasoning_failed',
    chapter: 'O LEGADO DE LÍVIA',
    title: 'Peças Soltas',
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration: [
      'Você tenta relacionar a dica às coisas que Lívia deixou.',
      'Existem lembranças demais e nenhuma parece se encaixar por completo.',
      'Por enquanto, a resposta continua fora de alcance.',
    ],
    dialogue: null,
    choices: [
      {
        id: 'return_after_failed_reasoning',
        text: 'Voltar à tela da senha.',
        nextScene: 'livia_computer',
        timeMinutes: 1,
      },
    ],
  },

  livia_computer_unlocked: {
    id: 'livia_computer_unlocked',
    chapter: 'O LEGADO DE LÍVIA',
    title: 'Arquivos de Lívia',
    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },
    narration: [
  `A tela de acesso desaparece e, alguns segundos depois, a área de trabalho surge diante de você.

À primeira vista, não há nada de incomum. Algumas fotografias, documentos pessoais e pastas com nomes comuns ocupam a tela. Nada que pareça justificar o interesse de Jack pelo computador.`,

  `Você começa a examinar os arquivos com mais atenção.

É então que percebe uma pasta escondida entre os arquivos do sistema. O nome não chama atenção e, se não estivesse procurando alguma coisa fora do lugar, provavelmente passaria por ela sem perceber.`,

  `Dentro estão dezenas de documentos.

Listas de nomes, datas, anotações sobre sangue e registros de internação se acumulam em diferentes arquivos. Alguns possuem nomes de hospitais de São Paulo; outros são identificados apenas por datas ou iniciais.`,

  `Você abre alguns deles, tentando entender o que está diante de você.

Ainda é cedo para saber como todas aquelas informações se relacionam, mas uma coisa fica evidente:

Lívia estava investigando alguma coisa.`,

  `Você continua abrindo as pastas.

A primeira impressão de que se trata apenas de registros hospitalares desaparece rapidamente. Existem documentos sobre transplantes e retirada de órgãos. Em várias planilhas, órgãos de pacientes declarados mortos aparecem associados a códigos, valores e destinos diferentes.

Lívia marcou diversos deles com a mesma palavra: “vendido.”`,

  `Outra pasta reúne informações sobre estoques de sangue. Bolsas desaparecem de hospitais e bancos de sangue sem registro de descarte ou utilização. Algumas são transferidas durante a madrugada para veículos que não pertencem às instituições.

Há datas, placas incompletas, nomes de funcionários e fotografias tiradas à distância.`,

  `Os arquivos seguintes são piores. Listas de pessoas desaparecidas aparecem ao lado de registros de clínicas, abrigos, delegacias e hospitais. Algumas vítimas surgem também em anotações relacionadas a prostituição, trabalho clandestino e transporte entre cidades.

Em certos documentos, Lívia escreveu apenas: “tráfico de pessoas.”`,

  `Há ainda uma pasta inteira dedicada a drogas. Apreensões que nunca chegaram aos depósitos. Medicamentos desviados de hospitais. Entregas através de empresas aparentemente legítimas. Traficantes aparecem ao lado de médicos, seguranças privados e intermediários não identificados.`,

  `Então você encontra um arquivo diferente. Não é uma lista de crimes. É uma rede.

Empresários, diretores de hospitais, advogados, delegados, assessores, funcionários de gabinetes e políticos importantes aparecem conectados por encontros, telefonemas, empresas, doações e contratos.

Alguns nomes são conhecidos dos jornais; todos os envolvidos diretamente nas anotações são pessoas fictícias.`,

  `Algumas conexões terminam em pontos de interrogação. Outras atravessam várias páginas. Não parece que todos façam parte da mesma organização.

Parece uma rede de pessoas que, por motivos diferentes, protegem umas às outras.`,

  `Entre os documentos existe uma pasta chamada apenas “FILMES”. Dentro dela há capturas de fóruns antigos e conversas sobre vídeos sem créditos que aparecem durante algumas semanas e depois somem da internet.

Lívia comparou cenários, roupas, ferimentos, datas e pessoas desaparecidas. Em uma discussão sobre uma gravação particularmente convincente, ela circulou a frase: “ninguém atua assim.”`,

  `Uma postagem dizia reconhecer um prédio abandonado de São Paulo ao fundo de um vídeo. A postagem e a conta desapareceram dias depois.

Em um quadro ampliado, uma figura alta demais e com braços longos demais aparece atrás de uma porta. Lívia escreveu: “Não é efeito. Encontrar o original.”`,

  `Uma pasta menor contém referências a David Hatter, um humano, gerente de hotel e aspirante a roteirista. Lívia não o associou à produção dos filmes.

O interesse dela estava nos trechos de um roteiro sobre sociedades vampíricas, regras de segredo, criadores, crias e uma criatura interior. Ao lado do nome, ela escreveu: “Ele sabe demais. Quem contou?”`,

  `Separada das demais existe uma pasta chamada “CAÇADORES”. Fotografias mostram pessoas repetidas perto de clubes, bares e outros pontos marcados por Lívia.

Uma anotação resume a suspeita dela: “Eles não estão procurando pessoas desaparecidas. Estão procurando a gente.”`,

  `Você volta para a lista: órgãos, sangue, pessoas, drogas, hospitais, empresas, policiais, políticos e filmes que talvez não sejam filmes.

À primeira vista, parecem investigações diferentes. Lívia guardou tudo no mesmo lugar, mas isso não prova que todas as linhas estejam realmente conectadas.`,
],
    dialogue: null,
    choices: [
      {
        id: 'investigate_organ_traffic',
        text: 'Investigar os registros sobre tráfico de órgãos.',
        nextScene: 'livia_files_organs',
        timeMinutes: 10,
      },
      {
        id: 'investigate_blood_traffic',
        text: 'Investigar o desaparecimento de bolsas de sangue.',
        nextScene: 'livia_files_blood',
        timeMinutes: 10,
      },
      {
        id: 'investigate_missing_people',
        text: 'Investigar as pessoas desaparecidas.',
        nextScene: 'livia_files_people',
        timeMinutes: 10,
      },
      {
        id: 'investigate_drug_network',
        text: 'Investigar os registros sobre drogas.',
        nextScene: 'livia_files_drugs',
        timeMinutes: 10,
      },
      {
        id: 'investigate_influence_network',
        text: 'Examinar a rede de influência.',
        nextScene: 'livia_files_influence',
        timeMinutes: 15,
      },
      {
        id: 'investigate_macabre_films',
        text: 'Abrir a pasta “FILMES”.',
        nextScene: 'livia_files_films',
        timeMinutes: 10,
      },
      {
        id: 'investigate_david_hatter',
        text: 'Examinar os arquivos sobre David Hatter.',
        nextScene: 'livia_files_david_hatter',
        timeMinutes: 10,
      },
      {
        id: 'investigate_hunters',
        text: 'Abrir a pasta “CAÇADORES”.',
        nextScene: 'livia_files_hunters',
        timeMinutes: 10,
      },
      {
        id: 'investigate_hospital_files',
        text: 'Investigar os arquivos relacionados aos hospitais.',
        nextScene: 'livia_hospital_clue',
        timeMinutes: 15,
        flags: {
          inspectedLiviaComputer: true,
          unlockedLiviaComputer: true,
        },
      },
      {
        id: 'computer_return_room_unlocked',

        text: 'Voltar e procurar outras pistas.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 2,

        flags: {
          inspectedLiviaComputer: true,
          unlockedLiviaComputer: true,
        },
      },
    ],
  },

  /*
    ========================================
    PISTA DOS HOSPITAIS
    ========================================
  */

  livia_files_organs: createLiviaFileScene({
    id: 'livia_files_organs',
    title: 'Peças de Reposição',
    flag: 'foundOrganTrafficLead',
    narration: [
      'As planilhas ligam cirurgias, funerárias e clínicas particulares por códigos repetidos.',
      'Alguns órgãos possuem dois destinos: o declarado no prontuário e outro acompanhado de valor, data e intermediário.',
      'Os documentos provam desvios, mas ainda não revelam quem controla a operação ou quem recebe os órgãos.',
    ],
  }),

  livia_files_blood: createLiviaFileScene({
    id: 'livia_files_blood',
    title: 'Estoque Noturno',
    flag: 'foundBloodTrafficLead',
    narration: [
      'As perdas de sangue seguem horários e rotas regulares demais para serem furtos ocasionais.',
      'Funcionários diferentes autorizam as saídas, mas as placas incompletas apontam para o mesmo pequeno grupo de veículos.',
      'Lívia suspeitava de compradores que não aparecem em qualquer registro hospitalar.',
    ],
  }),

  livia_files_people: createLiviaFileScene({
    id: 'livia_files_people',
    title: 'Nomes Ausentes',
    flag: 'foundMissingPeopleLead',
    narration: [
      'Pessoas desaparecidas reaparecem como números em clínicas, transportadoras e alojamentos clandestinos.',
      'Algumas foram vistas pela última vez perto de casas noturnas; outras passaram por delegacias ou abrigos antes de sumir.',
      'As conexões sugerem tráfico de pessoas, mas também existem casos estranhos que não se encaixam nesse padrão.',
    ],
  }),

  livia_files_drugs: createLiviaFileScene({
    id: 'livia_files_drugs',
    title: 'Carga Desviada',
    flag: 'foundDrugNetworkLead',
    narration: [
      'Relatórios policiais registram apreensões maiores do que as quantidades entregues aos depósitos.',
      'Medicamentos hospitalares e drogas ilegais circulam por empresas de segurança, distribuidoras e casas noturnas.',
      'Os intermediários mudam, mas alguns médicos e policiais aparecem repetidamente.',
    ],
  }),

  livia_files_influence: createLiviaFileScene({
    id: 'livia_files_influence',
    title: 'A Rede',
    flag: 'foundInfluenceNetworkLead',
    narration: [
      'Lívia conectou empresários, médicos, delegados, assessores e políticos fictícios por contratos, encontros e doações.',
      'Não existe uma acusação central. Algumas pessoas parecem cúmplices; outras podem ser apenas úteis, coagidas ou comprometidas.',
      'A rede não prova uma única conspiração. Prova que muita gente poderosa possui motivos para proteger as demais.',
    ],
  }),

  livia_files_films: createLiviaFileScene({
    id: 'livia_files_films',
    title: 'Ninguém Atua Assim',
    flag: 'foundMacabreFilmsLead',
    narration: [
      `Os fóruns tratam as gravações como lendas: filmes sem créditos que somem depois de poucas semanas. Alguns usuários insistem que são produções independentes; outros afirmam que não existe equipe, elenco ou produtora por trás delas.`,
      `A imagem é ruim, o áudio quase incompreensível e ninguém identifica os atores. Algumas pessoas nas gravações, porém, parecem assustadas demais para estarem atuando.`,
      `Lívia comparou imagens dos vídeos com fotografias de pessoas desaparecidas. Ao lado de duas delas, escreveu: “Possível correspondência.”`,
      `Ela também relacionou cenários a um prédio abandonado de São Paulo. A postagem que indicava o endereço desapareceu, assim como a conta de quem a publicou.`,
      `A figura desproporcional em um dos quadros pode ser efeito, fantasia ou algo que não deveria estar diante de uma câmera.`,
      `Lívia não chegou a uma resposta. Sua última anotação diz apenas: “Não é efeito. Descobrir quem está fazendo esses filmes.”`,
    ],
  }),

  livia_files_david_hatter: createLiviaFileScene({
    id: 'livia_files_david_hatter',
    title: 'Ele Sabe Demais',
    flag: 'foundDavidHatterLead',
    narration: [
      `David Hatter. Humano. Gerente de hotel. Aspirante a roteirista. Não há qualquer indicação de que tenha produzido ou participado das gravações macabras.`,
      `Trechos atribuídos a um roteiro escrito por ele circularam em um pequeno fórum de cinema independente. Você lê algumas páginas.`,
      `Sociedades secretas de vampiros. Regras para permanecer escondidos entre humanos. Disputas territoriais. Criadores e suas crias. Uma criatura interior que precisa ser controlada.`,
      `Você descobriu que vampiros existem há pouco tempo e já sabe que um humano não deveria escrever aquilo com tamanha precisão.`,
      `Ao lado do nome de David, Lívia anotou: “Ele sabe demais.” Logo abaixo: “Quem contou?”`,
      `Há outro nome ligado a ele: Julius. Nenhum sobrenome ou endereço confirmado, apenas referências a encontros e conversas sobre roteiros de vampiros.`,
      `Os arquivos terminam aí. David pode ser um cúmplice, uma testemunha ou apenas um humano que não percebe o perigo do que aprendeu. Lívia morreu antes de descobrir.`,
    ],
  }),

  livia_files_hunters: createLiviaFileScene({
    id: 'livia_files_hunters',
    title: 'Eles Estão Procurando',
    flag: 'foundHunterSurveillanceLead',
    narration: [
      `A pasta contém fotografias de pessoas que aparecem repetidamente perto de clubes, bares e outros lugares marcados por Lívia em um mapa de São Paulo.`,
      `Algumas parecem policiais à paisana. Outras não possuem qualquer identificação visível. Lívia anotou placas, horários e descrições.`,
      `Em pelo menos três ocasiões, a mesma pessoa aparece observando estabelecimentos diferentes frequentados por vampiros.`,
      `Os registros sugerem vigilância organizada, mas não revelam quantas pessoas estão envolvidas nem o que realmente sabem.`,
      `Ao lado de uma das fotografias, Lívia escreveu: “Eles não estão procurando pessoas desaparecidas. Estão procurando a gente.”`,
      `Não existe qualquer referência ligando diretamente esses observadores aos hospitais, aos filmes ou à rede de influência. Por enquanto, são apenas mais perguntas deixadas por Lívia.`,
    ],
  }),

  livia_hospital_clue: {
    id: 'livia_hospital_clue',

    chapter: 'O LEGADO DE LÍVIA',

    title: 'Os Mortos Não Dormem',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
  `Você começa a cruzar os nomes e as datas dos documentos. No início, aquilo parece apenas uma coleção de prontuários roubados, registros hospitalares e informações reunidas sem qualquer ordem aparente.

Mas, conforme compara os arquivos, algumas coincidências começam a se repetir vezes demais para continuarem parecendo coincidências.`,

  `Pacientes oficialmente declarados mortos aparecem novamente em registros posteriores. Bolsas de sangue desaparecem dos estoques sem justificativa, enquanto cadáveres são transferidos entre unidades sem que exista documentação completa sobre o destino deles.

Alguns nomes aparecem associados a mais de um hospital. Lívia percebeu isso antes de você e marcou vários deles.`,

  `Entre as anotações, uma frase escrita por ela chama sua atenção:

"Não é tráfico comum."

Logo abaixo, outra:

"Eles sabem o que somos."`,

  `Você continua lendo.

Há endereços, horários, nomes incompletos e referências a diferentes hospitais de São Paulo. Algumas informações parecem desconexas, mas outras começam a formar os contornos de algo muito maior do que um único hospital ou um grupo isolado.`,

  `Lívia estava seguindo uma rede.

Você ainda não sabe quem faz parte dela, o que acontece com as pessoas registradas nesses documentos ou o que Lívia quis dizer quando escreveu que "eles" sabem o que vocês são.

Ela não conseguiu terminar a investigação.

Agora os arquivos estão com você.`,
],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Parabéns. Você herdou o apartamento, os segredos e provavelmente os inimigos dela.',
    },

    choices: [
      {
        id: 'finish_livia_investigation',

        text: 'Guardar as informações e voltar para a noite.',

        nextScene: 'free_roam',

        timeMinutes: 5,

        flags: {
          inspectedLiviaComputer: true,

          discoveredHospitalConnection: true,

          liviaHospitalConnection: true,
        },
      },
    ],
  },
    livia_apartment_haven: {
    id: 'livia_apartment_haven',

    chapter: 'NOITE LIVRE',

    title: 'Seu Refúgio',
    daySafe: true,

    location: {
      id: 'livia_apartment',
      name: 'Seu Refúgio',
      district: 'Centro de São Paulo',
    },

    narration: [
      'Você fecha a porta atrás de si.',

      'O apartamento ainda guarda vestígios da vida de Lívia.',

      'Mas agora o lugar também começa a carregar os seus.',

      'As janelas estão protegidas da luz do amanhecer.',

      'O computador permanece sobre a mesa.',

      'Os cadernos e documentos que ela deixou continuam guardados.',

      'Pela primeira vez desde o Abraço, existe um lugar na cidade que você pode chamar de seu.',

      'Um refúgio.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Lar doce lar. Considerando que você está morto, podia ser pior.',
    },

    choices: [
      {
        id: 'haven_use_computer',

        text:
          'Usar o computador.',

        nextScene:
          'livia_computer',

        timeMinutes: 5,
      },

      {
        id: 'haven_review_livia_notes',

        text:
          'Rever as anotações de Lívia.',

        nextScene:
          'livia_diary',

        timeMinutes: 5,
      },

      {
        id: 'haven_investigate_disappearances',

        text:
          'Investigar os desaparecimentos nos arquivos de Lívia.',

        nextScene:
          'strange_hospitals_records',

        timeMinutes: 10,
      },

      {
        id: 'haven_rest',

        text:
          'Preparar o refúgio para descansar.',

        nextScene:
          'livia_apartment_rest',

        timeMinutes: 5,
      },

     {
  id: 'haven_leave',

  text:
    'Sair para a cidade.',

  nextScene:
    'livia_apartment_exit',

  timeMinutes: 2,
},
    ],
  },
livia_apartment_exit: {
  id:
    'livia_apartment_exit',

  chapter:
    'NOITE LIVRE',

  title:
    'De Volta às Ruas',

  location: {
    id:
      'centro',

    name:
      'Centro de São Paulo',

    district:
      'Centro',
  },

  narration: [
    'Você fecha a porta do apartamento atrás de si.',

    'O corredor antigo do prédio está silencioso.',

    'Poucos minutos depois, você volta às ruas do centro de São Paulo.',

    'O apartamento permanece atrás de você.',

    'Seu refúgio.',

    'Quando quiser voltar, ele estará esperando.',
  ],

  dialogue: null,

  choices: [
    {
      id:
        'exit_to_free_roam',

      text:
        'Continuar pela cidade.',

      nextScene:
        'free_roam',

      timeMinutes:
        0,
    },
  ],
},
  livia_apartment_rest: {
    id: 'livia_apartment_rest',

    chapter: 'NOITE LIVRE',

    title: 'Silêncio',

    daySafe: true,

    location: {
      id: 'livia_apartment',
      name: 'Seu Refúgio',
      district: 'Centro de São Paulo',
    },

    narration: [
      'Você verifica as cortinas.',

      'Nenhuma fresta de luz atravessa as janelas.',

      'A porta está trancada.',

      'O apartamento está silencioso.',

      'Durante o dia, esse silêncio será a diferença entre descanso e morte.',
    ],

    dialogue: null,

    choices: [
  {
    id:
      'haven_sleep_until_night',

    text:
      'Dormir até o anoitecer.',

    nextScene:
      null,

    timeMinutes:
      0,
  },

 {
  id:
    'haven_rest_return',

  text:
    'Ainda não. Voltar para o refúgio.',

  nextScene:
    'free_roam',

  timeMinutes:
    0,
},
],
  },
  livia_apartment_wakeup: {
  id:
    'livia_apartment_wakeup',

  chapter:
    'NOITE LIVRE',

  title:
    'Outra Noite',

  daySafe:
    true,

  location: {
    id:
      'livia_apartment',

    name:
      'Seu Refúgio',

    district:
      'Centro de São Paulo',
  },

  narration: [
    'A consciência retorna lentamente.',

    'Durante algumas horas não existiu sonho, pensamento ou passagem do tempo.',

    'Apenas o peso imóvel da morte durante o dia.',

    'Seus olhos se abrem.',

    'O apartamento permanece mergulhado em silêncio.',

    'Nenhuma luz atravessou as cortinas.',

    'Lá fora, São Paulo voltou a pertencer à noite.',

    'Você sobreviveu a mais um dia.',
  ],

  dialogue: {
    speaker:
      'A Voz',

    text:
      'Bom dia. Quer dizer... tecnicamente boa noite. Ainda precisamos trabalhar nisso.',
  },

  choices: [
    {
      id:
        'haven_wakeup_continue',

      text:
        'Levantar.',

      nextScene:
        'livia_apartment_haven',

      timeMinutes:
        0,
    },
  ],
},
  /*
    ========================================
    OS MORTOS NÃO DORMEM
    INVESTIGAÇÃO DOS DESAPARECIMENTOS
    ========================================
  */

  strange_hospitals_records: {
    id: 'strange_hospitals_records',

    chapter: 'OS MORTOS NÃO DORMEM',

    title: 'Nomes que se Repetem',

    location: {
      id: 'livia_apartment',
      name: 'Seu Refúgio',
      district: 'Centro de São Paulo',
    },

    narration: [
      'Você volta aos arquivos que Lívia reuniu antes de morrer.',

      'Prontuários incompletos, cópias de boletins de ocorrência, listas de internação e anotações escritas à mão ocupam a tela e a mesa.',

      'Separados, os documentos parecem apenas fragmentos de vidas que deram errado.',

      'Quando você coloca as datas em ordem, algumas coincidências deixam de parecer coincidências.',

      'Pessoas desapareceram poucos dias depois de passarem por atendimento médico.',

      'Algumas foram oficialmente transferidas para outras unidades.',

      'Outras simplesmente deixaram de existir nos sistemas.',

      'Há assinaturas diferentes nos documentos, mas determinados horários e códigos administrativos se repetem.',

      'Lívia percebeu o padrão.',

      'Agora você também percebe.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Mortos que continuam andando em planilhas. Isso parece familiar.',
    },

    choices: [
      {
        id: 'cross_reference_missing_people',

        text:
          'Cruzar nomes, datas e registros de internação.',

        nextScene:
          'strange_hospitals_pattern',

        timeMinutes: 25,

        flags: {
          hospitalDisappearancesInvestigated: true,
        },
      },

      {
        id: 'records_return_haven',

        text:
          'Guardar os documentos e continuar depois.',

        nextScene:
          'livia_apartment_haven',

        timeMinutes: 2,
      },
    ],
  },

  strange_hospitals_pattern: {
    id: 'strange_hospitals_pattern',

    chapter: 'OS MORTOS NÃO DORMEM',

    title: 'O Mesmo Destino',

    location: {
      id: 'livia_apartment',
      name: 'Seu Refúgio',
      district: 'Centro de São Paulo',
    },

    narration: [
      'A lista diminui conforme você elimina coincidências sem relação entre si.',

      'Restam oito desaparecimentos que seguem quase o mesmo caminho.',

      'Todos passaram por hospitais ou clínicas diferentes.',

      'Mas existe uma etapa comum nos registros.',

      'Em algum momento, seus documentos foram encaminhados para a mesma instituição.',

      'Hospital Victor.',

      'Uma unidade particular na região da Vila Mariana.',

      'O nome aparece discretamente demais para chamar atenção em uma consulta rápida.',

      'Lívia o circulou três vezes em uma folha impressa.',

      'Ao lado, escreveu apenas uma palavra:',

      '"Noite."',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Se alguém queria esconder um hospital, colocar o nome em oito prontuários foi uma escolha ousada.',
    },

    choices: [
      {
        id: 'trace_hospital_pattern',

        text:
          'Confirmar o endereço e pesquisar o Hospital Victor.',

        nextScene:
          'strange_hospitals_identified',

        timeMinutes: 20,

        flags: {
          hospitalDisappearancePatternFound: true,
        },
      },
    ],
  },

  strange_hospitals_identified: {
    id: 'strange_hospitals_identified',

    chapter: 'OS MORTOS NÃO DORMEM',

    title: 'Hospital Victor',

    location: {
      id: 'livia_apartment',
      name: 'Seu Refúgio',
      district: 'Centro de São Paulo',
    },

    narration: [
      'O endereço confere.',

      'Hospital Victor funciona vinte e quatro horas por dia.',

      'Durante o dia é apenas mais uma instituição particular cercada por prédios, consultórios e trânsito.',

      'Mas os registros que Lívia guardou mostram atividade incomum depois da meia-noite.',

      'Transferências sem justificativa.',

      'Entradas pela área de serviço.',

      'Funcionários que aparecem em escalas diferentes com a mesma assinatura.',

      'E uma sequência de pacientes que desaparece depois de passar pelo local.',

      'Você salva o endereço.',

      'Agora sabe onde procurar.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Excelente. Um hospital aberto de madrugada. O que poderia dar errado?',
    },

    choices: [
      {
        id: 'mark_hospital_victor',

        text:
          'Marcar o Hospital Victor no mapa e sair para a noite.',

        nextScene:
          'free_roam',

        timeMinutes: 5,

        flags: {
          hospitalVictorIdentified: true,
          hospitalVictorDiscovered: true,
          hospitalVictorUnlocked: true,
        },
      },
    ],
  },

  /*
    ========================================
    HOSPITAL VICTOR
    PRIMEIRA VISITA
    ========================================
  */

  hospital_victor_arrival: {
    id: 'hospital_victor_arrival',

    chapter: 'OS MORTOS NÃO DORMEM',

    title: 'Hospital Victor',

    location: {
      id: 'hospital_victor',
      name: 'Hospital Victor',
      district: 'Vila Mariana',
    },

    narration: [
      'O Hospital Victor ocupa quase um quarteirão.',

      'Vidro, concreto claro e luz branca demais para aquela hora.',

      'A recepção continua funcionando.',

      'Algumas pessoas esperam em cadeiras próximas à entrada.',

      'Uma ambulância deixa o estacionamento enquanto outra permanece perto de uma entrada lateral.',

      'Seguranças privados circulam entre a porta principal e o acesso de veículos.',

      'Nada parece obviamente sobrenatural.',

      'Esse é justamente o problema.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Lugar acolhedor. Cheiro de desinfetante, medo e decisões ruins.',
    },

    choices: [
      {
        id: 'hospital_watch_entrance',

        text:
          'Observar a entrada e a movimentação dos funcionários.',

        nextScene:
          'hospital_victor_exterior',

        timeMinutes: 15,
      },

      {
        id: 'hospital_watch_ambulances',

        text:
          'Observar discretamente a área das ambulâncias.',

        nextScene:
          'hospital_victor_ambulance_bay',

        timeMinutes: 15,
      },

      {
        id: 'hospital_leave_for_now',

        text:
          'Não entrar ainda e voltar para a cidade.',

        nextScene:
          'free_roam',

        timeMinutes: 3,
      },
    ],
  },

  hospital_victor_exterior: {
    id: 'hospital_victor_exterior',

    chapter: 'OS MORTOS NÃO DORMEM',

    title: 'Depois da Meia-Noite',

    location: {
      id: 'hospital_victor',
      name: 'Hospital Victor',
      district: 'Vila Mariana',
    },

    narration: [
      'Você observa o hospital sem se aproximar demais.',

      'O movimento da recepção parece normal.',

      'Nos fundos, porém, funcionários empurram macas por uma porta que não aparece indicada para visitantes.',

      'Uma transferência acontece sem que nenhuma ambulância oficial chegue pela entrada principal.',

      'Pouco depois, um segurança fecha o acesso lateral.',

      'Os horários anotados por Lívia estavam certos.',

      'Existe uma rotina noturna que o público não deveria perceber.',
    ],

    dialogue: null,

    choices: [
      {
        id: 'hospital_follow_service_activity',

        text:
          'Continuar observando a área de serviço e as ambulâncias.',

        nextScene:
          'hospital_victor_ambulance_bay',

        timeMinutes: 10,

        flags: {
          investigatedHospitalVictor: true,
          hospitalNightOperationConfirmed: true,
        },
      },

      {
        id: 'hospital_exterior_leave',

        text:
          'Guardar o que descobriu e voltar para a cidade.',

        nextScene:
          'free_roam',

        timeMinutes: 5,

        flags: {
          investigatedHospitalVictor: true,
          hospitalNightOperationConfirmed: true,
        },
      },
    ],
  },

  hospital_victor_ambulance_bay: {
    id: 'hospital_victor_ambulance_bay',

    chapter: 'OS MORTOS NÃO DORMEM',

    title: 'A Ambulância sem Nome',

    location: {
      id: 'hospital_victor',
      name: 'Hospital Victor',
      district: 'Vila Mariana',
    },

    narration: [
      'Você mantém distância e acompanha a área reservada às ambulâncias.',

      'A maioria dos veículos possui identificação normal.',

      'Um deles não.',

      'É uma ambulância branca sem logotipo visível na lateral.',

      'A placa está parcialmente coberta de sujeira.',

      'Dois homens descarregam uma maca coberta e entram pela porta de serviço.',

      'Nenhum deles usa uniforme do hospital.',

      'Minutos depois, a ambulância parte novamente.',

      'Você não sabe de onde veio.',

      'Mas agora sabe que ela faz parte da operação.',
    ],

    dialogue: {
      speaker: 'A Voz',

      text:
        'Achamos o fio. Agora só falta descobrir o que acontece quando puxamos.',
    },

    choices: [
      {
        id: 'record_suspicious_ambulance',

        text:
          'Registrar os detalhes da ambulância e continuar a investigação depois.',

        nextScene:
          'free_roam',

        timeMinutes: 5,

        flags: {
          investigatedHospitalVictor: true,
          hospitalNightOperationConfirmed: true,
          hospitalAmbulanceSeen: true,
          suspiciousAmbulanceDiscovered: true,
        },
      },
    ],
  },

livia_apartment_torpor: {
  id:
    'livia_apartment_torpor',

  chapter:
    'TORPOR',

  title:
    'O Sono dos Mortos',

  daySafe:
    true,

  location: {
    id:
      'livia_apartment',

    name:
      'Seu Refúgio',

    district:
      'Centro de São Paulo',
  },

  narration: [
    'A noite chega.',

    'Mas você não desperta.',

    'Seu corpo permanece imóvel onde caiu durante o sono diurno.',

    'Não há respiração.',

    'Não há batimento cardíaco.',

    'Nem mesmo a fome consegue arrancar você da imobilidade.',

    'Seu sangue acabou.',

    'Sem vitae suficiente para despertar, seu corpo afunda em Torpor.',

    'Horas passam.',

    'Depois noites.',

    'O apartamento permanece silencioso enquanto São Paulo continua vivendo do lado de fora.',

    'Você não está verdadeiramente morto.',

    'Mas também não pode acordar sozinho.',
  ],

  dialogue: {
    speaker:
      'A Voz',

    text:
      'Silêncio. Finalmente silêncio.',
  },

  choices: [],
},
}

export default liviaApartmentScenes
