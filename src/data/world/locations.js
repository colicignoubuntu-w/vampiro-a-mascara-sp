const locations = {
  /*
    ========================================
    EXPOSIÇÃO PÚBLICA
    ========================================

    Cada localização pode definir:

    exposure.publicAccess
      Se civis/público podem estar presentes.

    exposure.crowdLevel
      0.0 = ninguém
      1.0 = extremamente movimentado.

    exposure.policePresence
      0.0 = sem resposta policial normal
      1.0 = presença policial muito alta.

    exposure.soundIsolation
      0.0 = som se espalha facilmente
      1.0 = local extremamente isolado.

    exposure.hostilePresence
      Presença de inimigos internos.
      Isso NÃO equivale a testemunhas civis.

    Locais secretos/subterrâneos podem ter:
      publicAccess: false
      crowdLevel: 0
      policePresence: 0

    Nesse caso a chance pública pode ser
    literalmente zero, mesmo com tiros.
  */

  /*
    ========================================
    PRÓLOGO
    ========================================
  */

  prologue: {
    id: 'prologue',

    name:
      'Prólogo',

    district:
      'São Paulo',

    description:
      'O local onde a história começa.',

    type:
      'special',

    showOnMap:
      false,

    coordinates: {
      x: 55,
      y: 53,
    },

    danger:
      0.3,

    policePresence:
      0.2,

    crowdLevel:
      0.0,
    exposure: {
      publicAccess:
        false,

      crowdLevel:
        0.0,

      policePresence:
        0.0,

      soundIsolation:
        0.7,

      hostilePresence:
        0.0,
    },

  },

  /*
    ========================================
    CENTRO
    ========================================
  */

  centro: {
    id: 'centro',

    name:
      'Centro',

    district:
      'Centro',

    description:
      'Você caminha entre a Praça da República, o Vale do Anhangabaú e as avenidas São João e Ipiranga. Bares, lanchonetes e hotéis ainda mantêm algumas portas abertas, enquanto quarteirões comerciais já estão vazios e protegidos por grades. A população muda de uma rua para outra: trabalhadores esperando o último ônibus, gente saindo para beber, vendedores recolhendo mercadoria e pessoas procurando abrigo sob as marquises.',

    type:
      'district',

    coordinates: {
      x: 52,
      y: 55,
    },

    danger:
      0.6,

    policePresence:
      0.6,

    crowdLevel:
      0.7,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.7,

      policePresence:
        0.6,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        6,

      description:
        'Ruas, becos, bares baratos e pessoas circulando durante a madrugada.',
    },
  },

  /*
    ========================================
    REFÚGIO
    ========================================
  */

  livia_apartment: {
    id:
      'livia_apartment',

    name:
      'Seu Refúgio',

    district:
      'Centro',

    description:
      'O antigo apartamento de Lívia ocupa um prédio envelhecido do Centro, numa rua onde o movimento diminui depois que o comércio fecha. O corredor conserva o cheiro de umidade e produto de limpeza, e os ruídos da avenida chegam abafados pelas janelas. Desde a morte dela, o lugar funciona como seu refúgio, embora objetos esquecidos pelos cômodos ainda façam parecer que a verdadeira moradora pode voltar a qualquer momento.',

    type:
      'haven',

    coordinates: {
      x: 50,
      y: 51,
    },

    danger:
      0.1,

    policePresence:
      0.3,

    crowdLevel:
      0.0,

    exposure: {
      publicAccess:
        false,

      crowdLevel:
        0.0,

      policePresence:
        0.0,

      soundIsolation:
        0.8,

      hostilePresence:
        0.0,
    },

    /*
      Não existe hunting aqui.

      Portanto o FreeRoam não exibirá
      a opção "Caçar" dentro do refúgio.
    */

    requiresFlag:
      'liviaApartmentUnlocked',

    arrivalScene:
      'livia_apartment_arrival',

    isHaven:
      true,
  },

  /*
    ========================================
    AVENIDA PAULISTA
    ========================================
  */

  paulista: {
    id:
      'paulista',

    name:
      'Avenida Paulista',

    district:
      'Bela Vista',

    description:
      'A Avenida Paulista continua iluminada muito depois do expediente. Prédios de bancos e escritórios dividem espaço com hospitais, centros culturais, restaurantes e acessos do metrô; nas calçadas largas passam estudantes, funcionários, turistas, entregadores e grupos que saem dos bares. Viaturas e seguranças particulares aparecem com frequência, e a claridade das fachadas deixa pouca coisa realmente escondida.',

    type:
      'district',

    coordinates: {
      x: 45,
      y: 57,
    },

    danger:
      0.3,

    policePresence:
      0.8,

    crowdLevel:
      1.0,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        1.0,

      policePresence:
        0.8,

      soundIsolation:
        0.0,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'luxury_bar',

      baseDifficulty:
        6,

      description:
        'Bares, restaurantes e pessoas circulando pela região durante a noite.',
    },
  },

  vesuvius: {
    id: 'vesuvius',

    name: 'Vesuvius',

    district: 'Bela Vista',

    description:
      'O Vesuvius ocupa um imóvel discreto perto da Rua Augusta, entre restaurantes recentes, bares antigos e edifícios residenciais que mudaram o perfil da região. Dentro do clube, veludo vermelho, corredores estreitos e música alta isolam os clientes do movimento da rua. A casa parece apenas mais um negócio da noite, mas a equipe controla com cuidado quem atravessa suas áreas reservadas.',

    type: 'club',

    coordinates: {
      x: 46,
      y: 54,
    },

    danger: 0.4,

    policePresence: 0.5,

    crowdLevel: 0.8,

    exposure: {
      publicAccess: true,
      crowdLevel: 0.8,
      policePresence: 0.5,
      soundIsolation: 0.6,
      hostilePresence: 0.1,
    },

    arrivalScene: 'vesuvius_entrance',
  },

  asylum: {
    id: 'asylum',
    name: 'Asylum',
    district: 'Consolação',
    description:
      'O Asylum funciona num antigo teatro da Consolação, próximo ao trecho da Augusta onde bares, casas noturnas, restaurantes e pequenos comércios disputam a mesma calçada. A fachada preservada esconde uma boate gótica de salões escuros e música constante. O público é variado, mas a administração das irmãs Voerman transforma certas portas e camarotes em fronteiras que os frequentadores comuns aprendem a não atravessar.',
    type: 'club',
    coordinates: { x: 44, y: 50 },
    danger: 0.5,
    policePresence: 0.5,
    crowdLevel: 0.9,
    exposure: {
      publicAccess: true,
      crowdLevel: 0.9,
      policePresence: 0.5,
      soundIsolation: 0.55,
      hostilePresence: 0.1,
    },
    arrivalScene: 'asylum_entrance',
  },

  mercurio_apartment: {
    id: 'mercurio_apartment',
    name: 'Apartamento de Mercurio',
    district: 'Barra Funda',
    description:
      'Mercurio mora num edifício comum da Barra Funda, próximo o bastante das linhas de trem para que a passagem das composições faça vibrar as janelas. O apartamento tem poucos móveis e muitas caixas, algumas com etiquetas arrancadas. Para os vizinhos, ele é apenas um morador reservado; para seus contatos, o endereço funciona como residência, depósito e ponto de entrega de mercadorias que não devem passar por registros oficiais.',
    type: 'contact',
    coordinates: { x: 42, y: 29 },
    danger: 0.4,
    policePresence: 0.3,
    crowdLevel: 0.1,
    exposure: {
      publicAccess: false,
      crowdLevel: 0.1,
      policePresence: 0.2,
      soundIsolation: 0.7,
      hostilePresence: 0,
    },
    arrivalScene: 'mercurio_wounded',
  },

  lucky_star_motel: {
    id: 'lucky_star_motel', name: 'Motel Estrela da Sorte', district: 'Centro',
    description: 'O Estrela da Sorte ocupa um prédio estreito do Centro, entre uma lanchonete aberta a noite inteira e uma fileira de lojas fechadas. A recepção protegida por vidro observa um corredor de iluminação cansada, frequentado por casais, viajantes e hóspedes que preferem não fornecer muitos dados. David Hatter administra o lugar do balcão e aproveita as horas vazias para escrever roteiros de terror.',
    type: 'investigation', coordinates: { x: 56, y: 50 }, danger: 0.3, policePresence: 0.5, crowdLevel: 0.3,
    exposure: { publicAccess: true, crowdLevel: 0.3, policePresence: 0.5, soundIsolation: 0.45, hostilePresence: 0 },
    requiresFlag: 'luckyStarUnlocked', arrivalScene: 'vesuvius_david_meeting',
  },

  dennis_warehouse: {
    id: 'dennis_warehouse', name: 'Galpão de Dennis', district: 'Limão',
    description: 'O galpão fica no Limão, num trecho industrial próximo à Marginal Tietê onde transportadoras, oficinas e depósitos ocupam quadras inteiras. Durante a madrugada há poucos pedestres, mas caminhões continuam passando e vigias acompanham veículos desconhecidos. As pistas encontradas nas roupas de Mercurio conduzem até um portão sem identificação, protegido da rua por chapas metálicas e câmeras improvisadas.',
    type: 'investigation', coordinates: { x: 35, y: 20 }, danger: 0.8, policePresence: 0.2, crowdLevel: 0.1,
    exposure: { publicAccess: false, crowdLevel: 0.1, policePresence: 0.2, soundIsolation: 0.7, hostilePresence: 0.8 },
    requiresFlag: 'dennisWarehouseUnlocked', arrivalScene: 'mercurio_warehouse',
  },

  gallery_noir: {
    id: 'gallery_noir', name: 'Galeria Noir', district: 'Jardins',
    description: 'A Galeria Noir ocupa um imóvel reformado nos Jardins, cercado por restaurantes caros, lojas de fachada discreta e edifícios com porteiros atentos. Nesta noite, carros deixam convidados diante da entrada de uma inauguração beneficente, onde taças e conversas cuidadosas circulam entre obras contemporâneas. A equipe controla os nomes na porta, e a aparência informal de quem passa chama mais atenção do que chamaria em outros bairros.',
    type: 'investigation', coordinates: { x: 40, y: 59 }, danger: 0.55, policePresence: 0.55, crowdLevel: 0.85,
    exposure: { publicAccess: true, crowdLevel: 0.85, policePresence: 0.55, soundIsolation: 0.35, hostilePresence: 0.15 },
    requiresFlag: 'galleryNoirUnlocked', arrivalScene: 'gallery_noir_infiltration',
  },

  ocean_house_sp: {
    id: 'ocean_house_sp', name: 'Ocean House Hotel', district: 'Santos',
    description: 'O Ocean House está afastado da parte mais movimentada da orla de Santos. Tapumes e marcas do incêndio escondem o antigo acesso, mas ainda é possível reconhecer a estrutura de um hotel que recebeu hóspedes durante décadas. O interior conserva corredores chamuscados, móveis abandonados e áreas comprometidas pelo fogo; operários enviados para avaliar o imóvel se recusaram a voltar, impedindo os planos imobiliários de Therese.',
    type: 'investigation', coordinates: { x: 84, y: 92 }, danger: 0.7, policePresence: 0.1, crowdLevel: 0,
    exposure: { publicAccess: false, crowdLevel: 0, policePresence: 0.1, soundIsolation: 0.8, hostilePresence: 0.5 },
    requiresFlag: 'oceanHouseUnlocked', arrivalScene: 'ocean_house_investigation',
  },

  surfside_diner: {
    id: 'surfside_diner', name: 'Surfside Diner', district: 'Santos — Gonzaga',
    description: 'A lanchonete permanece aberta perto da orla de Santos, recebendo taxistas, trabalhadores noturnos e clientes que procuram café depois que os restaurantes fecham. Ventiladores giram sobre mesas de fórmica e o cheiro da chapa se mistura ao ar úmido trazido da praia. A cabine dos fundos, ao lado dos telefones públicos, oferece distância suficiente do balcão para uma conversa discreta.',
    type: 'contact', coordinates: { x: 80, y: 88 }, danger: 0.3, policePresence: 0.3, crowdLevel: 0.35,
    exposure: { publicAccess: true, crowdLevel: 0.35, policePresence: 0.3, soundIsolation: 0.4, hostilePresence: 0.05 },
    requiresFlag: 'surfsideMeetingUnlocked', arrivalScene: 'surfside_wait_jeanette',
  },

  /*
    ========================================
    LIBERDADE
    ========================================
  */

  liberdade: {
    id:
      'liberdade',

    name:
      'Liberdade',

    district:
      'Liberdade',

    description:
      'As lanternas e placas orientais tornam a Liberdade reconhecível antes mesmo de você chegar à praça. Restaurantes encerram o serviço enquanto mercados, lojas de conveniência e karaokês prolongam o movimento pelas ruas laterais. Perto do metrô ainda há grupos conversando e entregadores esperando pedidos; alguns quarteirões abaixo, em direção ao Glicério, a iluminação piora, as lojas fecham e a circulação se torna bem mais dispersa.',

    type:
      'district',

    coordinates: {
      x: 55,
      y: 59,
    },

    danger:
      0.4,

    policePresence:
      0.6,

    crowdLevel:
      0.85,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.85,

      policePresence:
        0.6,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        6,

      description:
        'Restaurantes, ruas movimentadas e pessoas voltando para casa oferecem oportunidades de caça.',
    },
  },

  /*
    ========================================
    BELA VISTA
    ========================================
  */

  bela_vista: {
    id:
      'bela_vista',

    name:
      'Bela Vista',

    district:
      'Bela Vista',

    description:
      'A Bela Vista muda conforme você desce da Paulista em direção ao Centro. Na parte alta da Augusta predominam restaurantes, novos edifícios e um público com mais dinheiro; adiante aparecem teatros, bares pequenos, casas noturnas, vendedores e filas ocupando a calçada. A região continua viva, mas antigos estabelecimentos cedem espaço a prédios e negócios mais caros, misturando a memória boêmia do bairro com uma transformação que ainda está em andamento.',

    type:
      'district',

    coordinates: {
      x: 48,
      y: 57,
    },

    danger:
      0.4,

    policePresence:
      0.6,

    crowdLevel:
      0.8,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.8,

      policePresence:
        0.6,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'luxury_bar',

      baseDifficulty:
        6,

      description:
        'Bares, restaurantes e casas noturnas atraem possíveis presas durante a madrugada.',
    },
  },

  /*
    ========================================
    PINHEIROS
    ========================================
  */

  pinheiros: {
    id:
      'pinheiros',

    name:
      'Pinheiros',

    district:
      'Pinheiros',

    description:
      'Pinheiros reúne ruas residenciais arborizadas, edifícios novos, escritórios e corredores comerciais que permanecem ativos à noite. Nos arredores da Teodoro Sampaio e da estação Fradique Coutinho, restaurantes e bares mantêm as calçadas ocupadas; mais perto da Faria Lima, fachadas envidraçadas e segurança privada anunciam outra escala de dinheiro. A multidão é menos concentrada que no Centro, espalhando-se entre estações, esquinas e carros de aplicativo.',

    type:
      'district',

    coordinates: {
      x: 31,
      y: 64,
    },

    danger:
      0.3,

    policePresence:
      0.5,

    crowdLevel:
      0.85,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.85,

      policePresence:
        0.5,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'rock_bar',

      baseDifficulty:
        6,

      description:
        'Bares, casas noturnas e ruas movimentadas oferecem várias oportunidades de caça.',
    },
  },

  /*
    ========================================
    VILA MADALENA
    ========================================
  */

  vila_madalena: {
    id:
      'vila_madalena',

    name:
      'Vila Madalena',

    district:
      'Vila Madalena',

    description:
      'Na Vila Madalena, o movimento se concentra em poucas ruas tomadas por bares, restaurantes e mesas na calçada. Muros pintados e fachadas coloridas permanecem visíveis sob a iluminação dos estabelecimentos, enquanto grupos circulam entre o Beco do Batman e as ladeiras do bairro. Fora desse núcleo, o barulho cai depressa e surgem casas, pequenos prédios e ruas residenciais onde os moradores convivem com o trânsito e a festa dos fins de semana.',

    type:
      'district',

    coordinates: {
      x: 28,
      y: 45,
    },

    danger:
      0.3,

    policePresence:
      0.4,

    crowdLevel:
      0.9,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.9,

      policePresence:
        0.4,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'rock_bar',

      baseDifficulty:
        5,

      description:
        'A intensa vida noturna facilita encontrar pessoas isoladas ou alcoolizadas.',
    },
  },

  /*
    ========================================
    SANTANA
    ========================================
  */

  santana: {
    id:
      'santana',

    name:
      'Santana',

    district:
      'Santana',

    description:
      'Santana se organiza ao redor de avenidas largas, comércio de bairro e estações que ligam a Zona Norte ao Centro. Perto do metrô e do terminal ainda há passageiros, ambulantes e ônibus chegando em intervalos curtos; algumas quadras depois predominam edifícios residenciais, padarias fechando e ruas mais tranquilas. O fluxo muda bastante ao longo da noite, deixando bolsões movimentados cercados por trechos quase vazios.',

    type:
      'district',

    coordinates: {
      x: 53,
      y: 9,
    },

    danger:
      0.4,

    policePresence:
      0.5,

    crowdLevel:
      0.65,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.65,

      policePresence:
        0.5,

      soundIsolation:
        0.1,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        6,

      description:
        'Ruas comerciais, bares e pessoas voltando para casa oferecem oportunidades de caça.',
    },
  },

  /*
    ========================================
    CANTAREIRA
    ========================================
  */

  cantareira: {
    id:
      'cantareira',

    name:
      'Serra da Cantareira',

    district:
      'Zona Norte',

    description:
      'A subida para a Serra da Cantareira afasta você do trânsito contínuo das áreas centrais. As construções ficam mais espaçadas, os muros mais longos e a iluminação pública irregular; entre condomínios e ruas estreitas surgem terrenos cobertos por mata. À noite, há poucos pedestres e quase nenhum comércio aberto, de modo que motores, cães e movimentos entre as árvores se destacam no silêncio.',

    type:
      'district',

    coordinates: {
      x: 46,
      y: 4,
    },

    danger:
      0.6,

    policePresence:
      0.2,

    crowdLevel:
      0.1,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.1,

      policePresence:
        0.2,

      soundIsolation:
        0.35,

      hostilePresence:
        0.0,
    },

    /*
      Por enquanto não há caça configurada.

      Posteriormente podemos criar:
      - animais silvestres;
      - pessoas em trilhas;
      - moradores;
      - encontros sobrenaturais.
    */
  },

  /*
    ========================================
    MOOCA
    ========================================
  */

  mooca: {
    id:
      'mooca',

    name:
      'Mooca',

    district:
      'Mooca',

    description:
      'A Mooca conserva casas geminadas, galpões e antigas instalações industriais entre condomínios mais recentes. Pizzarias, padarias e bares de bairro sustentam algum movimento depois que o comércio comum fecha, principalmente perto das avenidas e estações. Nas ruas internas, famílias voltam para casa e conversas escapam de janelas abertas, dando à região um ritmo noturno mais residencial que o encontrado no Centro.',

    type:
      'district',

    coordinates: {
      x: 71,
      y: 55,
    },

    danger:
      0.3,

    policePresence:
      0.5,

    crowdLevel:
      0.45,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.45,

      policePresence:
        0.5,

      soundIsolation:
        0.1,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        7,

      description:
        'As ruas são mais tranquilas durante a madrugada, tornando necessário procurar por mais tempo.',
    },
  },

  /*
    ========================================
    TATUAPÉ
    ========================================
  */

  tatuape: {
    id:
      'tatuape',

    name:
      'Tatuapé',

    district:
      'Tatuapé',

    description:
      'No Tatuapé, o movimento se distribui entre o metrô, os shoppings, os bares e os edifícios residenciais que cercam as avenidas principais. Restaurantes permanecem cheios até mais tarde e carros de aplicativo param continuamente diante das entradas. Longe desses eixos, as calçadas esvaziam e o bairro assume um caráter residencial, com portarias iluminadas e vigilância privada acompanhando quem passa.',

    type:
      'district',

    coordinates: {
      x: 87,
      y: 48,
    },

    danger:
      0.3,

    policePresence:
      0.6,

    crowdLevel:
      0.7,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.7,

      policePresence:
        0.6,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'luxury_bar',

      baseDifficulty:
        6,

      description:
        'Bares, restaurantes e estabelecimentos noturnos atraem possíveis presas.',
    },
  },

  /*
    ========================================
    IPIRANGA
    ========================================
  */

  ipiranga: {
    id:
      'ipiranga',

    name:
      'Ipiranga',

    district:
      'Ipiranga',

    description:
      'O Ipiranga alterna avenidas de passagem, comércio local e ruas residenciais que descem em direção ao vale. A presença do Museu e do Parque da Independência marca a região, mas à noite são as padarias, postos, bares e pontos de ônibus que concentram as pessoas. Entre casarões antigos e prédios recentes, há longos trechos silenciosos onde o movimento de um único carro pode ser acompanhado por vários quarteirões.',

    type:
      'district',

    coordinates: {
      x: 63,
      y: 69,
    },

    danger:
      0.3,

    policePresence:
      0.5,

    crowdLevel:
      0.45,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.45,

      policePresence:
        0.5,

      soundIsolation:
        0.1,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        7,

      description:
        'A movimentação diminui durante a madrugada, mas ainda existem oportunidades nas ruas e bares.',
    },
  },

  /*
    ========================================
    VILA MARIANA
    ========================================
  */

  vila_mariana: {
    id:
      'vila_mariana',

    name:
      'Vila Mariana',

    district:
      'Vila Mariana',

    description:
      'A Vila Mariana permanece ativa ao redor do metrô, das faculdades, dos hospitais e dos restaurantes próximos à Domingos de Morais. Estudantes dividem as calçadas com profissionais saindo de plantões e moradores levando cães para a última volta. Nas ruas internas aparecem casas antigas, edifícios médios e pequenos comércios já fechados; o bairro é bem servido e iluminado, mas fica rapidamente mais quieto quando você se afasta das avenidas.',

    type:
      'district',

    coordinates: {
      x: 39,
      y: 73,
    },

    danger:
      0.2,

    policePresence:
      0.6,

    crowdLevel:
      0.65,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.65,

      policePresence:
        0.6,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        6,

      description:
        'Estudantes, bares e circulação noturna oferecem oportunidades discretas de caça.',
    },
  },

  /*
    ========================================
    SAÚDE
    ========================================
  */

  saude: {
    id:
      'saude',

    name:
      'Saúde',

    district:
      'Saúde',

    description:
      'A Saúde acompanha o eixo do metrô e da Avenida Jabaquara, onde ônibus, farmácias, mercados e restaurantes mantêm alguma circulação até tarde. Atrás desse corredor, o terreno inclinado conduz a ruas residenciais de casas e edifícios baixos. O ruído do trânsito continua presente, embora haja poucas pessoas caminhando depois que as estações começam a esvaziar.',

    type:
      'district',

    coordinates: {
      x: 51,
      y: 87,
    },

    danger:
      0.3,

    policePresence:
      0.5,

    crowdLevel:
      0.45,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.45,

      policePresence:
        0.5,

      soundIsolation:
        0.1,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        7,

      description:
        'As ruas ficam mais vazias durante a madrugada, exigindo paciência para encontrar uma presa.',
    },
  },

  /*
    ========================================
    SANTO AMARO
    ========================================
  */

  santo_amaro: {
    id:
      'santo_amaro',

    name:
      'Santo Amaro',

    district:
      'Santo Amaro',

    description:
      'Santo Amaro funciona como um centro próprio dentro da Zona Sul. Terminais, estações e ruas comerciais reúnem passageiros vindos de bairros distantes, enquanto escritórios e lojas baixam as portas ao redor do Largo Treze. Mesmo à noite há ônibus, vendedores e trabalhadores atravessando a região, mas o movimento se concentra nos corredores de transporte e abandona depressa as ruas laterais.',

    type:
      'district',

    coordinates: {
      x: 38,
      y: 92,
    },

    danger:
      0.4,

    policePresence:
      0.5,

    crowdLevel:
      0.7,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.7,

      policePresence:
        0.5,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        6,

      description:
        'Terminais, bares e ruas comerciais mantêm alguma circulação mesmo durante a madrugada.',
    },
  },

  /*
    ========================================
    CAPÃO REDONDO
    ========================================
  */

  capao_redondo: {
    id:
      'capao_redondo',

    name:
      'Capão Redondo',

    district:
      'Zona Sul',

    description:
      'O Capão Redondo se espalha por avenidas movimentadas, ladeiras e ruas residenciais densamente ocupadas. O metrô e os corredores de ônibus concentram trabalhadores retornando para casa, comércio popular e vendedores que prolongam o expediente. Conforme a noite avança, bares de bairro e pontos de transporte permanecem ativos, enquanto trajetos fora das vias principais exigem conhecer bem as entradas, escadarias e mudanças do terreno.',

    type:
      'district',

    coordinates: {
      x: 22,
      y: 94,
    },

    danger:
      0.7,

    policePresence:
      0.5,

    crowdLevel:
      0.65,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.65,

      policePresence:
        0.5,

      soundIsolation:
        0.1,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'dangerous_alley',

      baseDifficulty:
        7,

      description:
        'Há oportunidades de caça, mas circular sozinho durante a madrugada envolve riscos maiores.',
    },
  },

  /*
    ========================================
    MORUMBI
    ========================================
  */

  morumbi: {
    id:
      'morumbi',

    name:
      'Morumbi',

    district:
      'Morumbi',

    description:
      'No Morumbi, grandes avenidas ligam condomínios fechados, hospitais, clubes e centros comerciais separados por longos muros. Ruas com mansões e jardins bem cuidados contam com câmeras, guaritas e pouca presença de pedestres; a poucos minutos dali, o relevo revela comunidades densas e trajetos onde ônibus e trabalhadores ainda circulam. As distâncias são maiores do que parecem, e quase toda movimentação depende de carro.',

    type:
      'district',

    coordinates: {
      x: 29,
      y: 84,
    },

    danger:
      0.3,

    policePresence:
      0.6,

    crowdLevel:
      0.4,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.4,

      policePresence:
        0.6,

      soundIsolation:
        0.15,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'luxury_bar',

      baseDifficulty:
        7,

      description:
        'Restaurantes, bares sofisticados e áreas residenciais oferecem oportunidades, mas exigem discrição.',
    },
  },

  /*
    ========================================
    BARRA FUNDA
    ========================================
  */

  barra_funda: {
    id:
      'barra_funda',

    name:
      'Barra Funda',

    district:
      'Barra Funda',

    description:
      'A Barra Funda é atravessada por linhas de trem, corredores de ônibus, viadutos e acessos à Marginal Tietê. Nos dias de evento, o terminal, o Allianz Parque e as casas de espetáculo espalham multidões pelas avenidas; depois que o público vai embora, restam estacionamentos, galpões, oficinas e extensos quarteirões silenciosos. Perto da Marechal Deodoro, o fluxo de passageiros convive com hotéis baratos, pessoas sem abrigo e policiamento mais atento.',

    type:
      'district',

    coordinates: {
      x: 43,
      y: 28,
    },

    danger:
      0.4,

    policePresence:
      0.6,

    crowdLevel:
      0.75,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.75,

      policePresence:
        0.6,

      soundIsolation:
        0.05,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        6,

      description:
        'Terminais, casas de eventos, bares e ruas movimentadas criam oportunidades durante a noite.',
    },
  },

  /*
    ========================================
    HOSPITAL VICTOR
    ========================================
  */

  hospital_victor: {
    id:
      'hospital_victor',

    name:
      'Hospital Victor',

    district:
      'Vila Mariana',

    description:
      'O Hospital Victor ocupa um quarteirão bem iluminado da Vila Mariana, cercado por farmácias, estacionamentos e restaurantes que atendem familiares e funcionários de plantão. Ambulâncias entram pelos fundos enquanto visitantes atravessam a recepção principal a qualquer hora. Nos arquivos de Lívia, porém, entregas noturnas e acessos a uma ala restrita aparecem em horários que não correspondem aos registros oficiais.',

    type:
      'hospital',

    coordinates: {
      x: 40,
      y: 72,
    },

    danger:
      0.5,

    policePresence:
      0.7,

    crowdLevel:
      0.55,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.55,

      policePresence:
        0.7,

      soundIsolation:
        0.15,

      hostilePresence:
        0.25,
    },

    requiresFlag:
      'hospitalVictorDiscovered',

    arrivalScene:
      'hospital_victor_arrival',
  },

  /*
    ========================================
    LAPA
    ========================================
  */

  lapa: {
    id:
      'lapa',

    name:
      'Lapa',

    district:
      'Lapa',

    description:
      'A Lapa cresceu ao redor das linhas ferroviárias e ainda conserva um centro comercial movimentado junto ao mercado, ao terminal e às ruas de lojas populares. Depois que as portas de aço descem, passageiros continuam atravessando as passarelas e esperando ônibus sob a iluminação dos corredores principais. Mais longe dos trilhos, oficinas, bares antigos, casas e edifícios residenciais formam ruas menos movimentadas e mais escuras.',

    type:
      'district',

    coordinates: {
      x: 34,
      y: 21,
    },

    danger:
      0.4,

    policePresence:
      0.5,

    crowdLevel:
      0.6,

    exposure: {
      publicAccess:
        true,

      crowdLevel:
        0.6,

      policePresence:
        0.5,

      soundIsolation:
        0.1,

      hostilePresence:
        0.0,
    },

    hunting: {
      enabled:
        true,

      preyLocation:
        'centro_street',

      baseDifficulty:
        6,

      description:
        'Bares, ruas comerciais e estações mantêm circulação suficiente para procurar uma presa.',
    },
  },
}

/*
  ========================================
  LOCAL INDIVIDUAL
  ========================================
*/

export function getLocation(
  locationId
) {
  if (!locationId) {
    return null
  }

  return (
    locations[
      locationId
    ] ??
    null
  )
}

/*
  ========================================
  TODOS OS LOCAIS
  ========================================

  Sem game:
  retorna todos.

  Com game:
  esconde locais bloqueados por flags.
*/

export function getAllLocations(
  game = null
) {
  const allLocations =
    Object.values(
      locations
    )

  if (!game) {
    return allLocations
  }

  return allLocations.filter(
    (location) => {
      if (
        !location.requiresFlag
      ) {
        return true
      }

      return Boolean(
        game?.flags?.[
          location.requiresFlag
        ]
      )
    }
  )
}

/*
  ========================================
  LOCAIS DISPONÍVEIS
  ========================================
*/

export function getUnlockedLocations(
  game
) {
  return getAllLocations(
    game
  )
}

/*
  ========================================
  REFÚGIO
  ========================================
*/

export function getHavenLocation(
  game
) {
  if (
    !game?.flags
      ?.liviaApartmentUnlocked
  ) {
    return null
  }

  return locations
    .livia_apartment
}

/*
  ========================================
  EXPORT PADRÃO
  ========================================
*/

export default locations
