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
      'O prédio parece ainda mais velho à noite.',

      'A fachada manchada pela chuva se mistura às construções do centro de São Paulo.',

      'Você reconhece o lugar antes mesmo de entrar.',

      'Fragmentos da sua antiga vida voltam sem pedir permissão.',

      'Lívia abrindo a porta.',

      'A voz dela.',

      'O cheiro do apartamento.',

      'Depois, sangue.',

      'Você sobe as escadas até o andar onde ela morava.',

      'A porta continua fechada.',

      'Por alguns segundos, parece absurdo pensar que Lívia nunca mais vai abri-la.',

      'Mas Jack estava certo.',

      'Se ela deixou respostas em algum lugar, provavelmente estão aqui.',
    ],

    dialogue: null,

    choices: [
      {
        id: 'enter_livia_apartment',

        text: 'Entrar no apartamento.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 2,

        flags: {
          visitedLiviaApartment: true,
        },
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
      'O ar está parado.',

      'As cortinas permanecem fechadas.',

      'Uma camada fina de poeira começa a se formar sobre os móveis.',

      'Nada parece ter sido organizado depois da morte de Lívia.',

      'Na sala há livros, fotografias, discos e papéis espalhados.',

      'Um computador está sobre uma pequena escrivaninha.',

      'O quarto fica no fim do corredor.',

      'Há também caixas empilhadas perto de uma estante.',

      'Jack falou em computador, papéis e fotografias.',

      'Agora você entende que procurar tudo pode levar algum tempo.',
    ],

    dialogue: null,

    choices: [
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
      'Você começa pela sala.',

      'Contas antigas.',

      'Livros com páginas marcadas.',

      'Fotografias sem data.',

      'Recibos de lugares que você não reconhece.',

      'Nada parece importante isoladamente.',

      'Mas existe uma estranha organização no caos.',

      'Lívia guardava coisas.',

      'Muitas coisas.',

      'Algumas fotografias mostram você antes do Abraço.',

      'Em uma delas, você está saindo de um estabelecimento sem perceber que estava sendo observado.',

      'A fotografia foi tirada semanas antes de você conhecer Lívia.',

      'Isso significa que ela já sabia quem você era.',
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
      'O quarto é mais organizado que a sala.',

      'Roupas escuras ocupam metade do armário.',

      'Livros estão empilhados perto da cama.',

      'Você abre gavetas e examina caixas.',

      'Debaixo de algumas roupas encontra três cadernosde capa preta.',

      'Não existem títulos.',

      'Somente datas.',

      'O mais antigo começa meses antes de seu Abraço.',

      'Você abre uma página ao acaso.',

      'Seu nome está escrito nela.',
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
      'As primeiras páginas são difíceis de interpretar.',

      'Lívia escrevia como se os textos fossem destinados apenas a ela.',

      'Nomes aparecem sem explicação.',

      'Endereços.',

      'Horários.',

      'Descrições de pessoas.',

      'Então você começa a aparecer cada vez mais.',

      'Ela escreveu sobre seus hábitos.',

      'Os lugares que frequentava.',

      'As noites em que voltava sozinho.',

      'As pessoas com quem conversava.',

      'Não parece o diário de alguém apaixonado.',

      'Parece o relatório de alguém escolhendo uma pessoa.',

      'Nas páginas próximas ao seu Abraço, uma frase aparece repetidamente:',

      '"Ainda existe humanidade suficiente."',

      'Depois disso as anotações ficam mais confusas.',

      'Alguns nomes são substituídos por iniciais.',

      'E uma palavra começa a aparecer várias vezes.',

      'Hospital.',
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

    title: 'Arquivos de Lívia',

    location: {
      id: 'livia_apartment',
      name: 'Apartamento de Lívia',
      district: 'Centro de São Paulo',
    },

    narration: [
      'O computador é antigo, mas ainda funciona.',

      'O sistema demora para iniciar.',

      'A área de trabalho parece quase vazia.',

      'Existem algumas fotografias, documentos pessoaise pastas comuns.',

      'Nada que justifique o aviso de Jack.',

      'Até você perceber uma pasta escondida entre arquivos de sistema.',

      'Dentro dela existem dezenas de documentos.',

      'Listas de nomes.',

      'Datas.',

      'Anotações sobre sangue.',

      'Registros de internação.',

      'Alguns arquivos estão protegidos.',

      'Outros possuem nomes de hospitais de São Paulo.',

      'Lívia estava investigando alguma coisa.',
    ],

    dialogue: null,

    choices: [
      {
        id: 'investigate_hospital_files',

        text: 'Investigar os arquivos relacionados aos hospitais.',

        nextScene: 'livia_hospital_clue',

        timeMinutes: 15,

        flags: {
          inspectedLiviaComputer: true,
        },
      },

      {
        id: 'computer_return_room',

        text: 'Voltar e procurar outras pistas.',

        nextScene: 'livia_apartment_inside',

        timeMinutes: 2,

        flags: {
          inspectedLiviaComputer: true,
        },
      },
    ],
  },

  /*
    ========================================
    PISTA DOS HOSPITAIS
    ========================================
  */

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
      'Você cruza datas e nomes.',

      'No começo parece apenas uma coleção de prontuários roubados.',

      'Então surge um padrão.',

      'Pacientes oficialmente mortos aparecem em registros posteriores.',

      'Bolsas de sangue desaparecem dos estoques.',

      'Cadáveres são transferidos sem documentação completa.',

      'Alguns nomes aparecem associados a mais de um hospital.',

      'Lívia marcou vários deles.',

      'Uma anotação chama sua atenção:',

      '"Não é tráfico comum."',

      'Logo abaixo existe outra frase.',

      '"Eles sabem o que somos."',

      'Você continua lendo.',

      'Há endereços, horários e nomes incompletos.',

      'Lívia estava seguindo uma rede.',

      'E morreu antes de descobrir até onde ela chegava.',

      'Agora os arquivos estão com você.',
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
