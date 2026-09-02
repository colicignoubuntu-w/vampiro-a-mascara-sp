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
      'O coração histórico e político de São Paulo. Durante a noite, suas ruas assumem uma atmosfera completamente diferente.',

    type:
      'district',

    coordinates: {
      x: 52,
      y: 44,
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
      'O antigo apartamento de Lívia. Depois de sua morte, o imóvel ficou para você. Agora este é seu refúgio na cidade.',

    type:
      'haven',

    coordinates: {
      x: 58,
      y: 39,
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
      'Uma das regiões mais movimentadas da cidade, cercada por empresas, bancos, museus, bares e vida noturna.',

    type:
      'district',

    coordinates: {
      x: 48,
      y: 49,
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
      'Um clube de striptease na região da Augusta. Veludo vermelho, luz baixa e música alta escondem uma discreta corte da noite paulistana.',

    type: 'club',

    coordinates: {
      x: 40,
      y: 57,
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
      'Uma boate gótica instalada num antigo teatro da Rua Augusta, administrada pelas irmãs Jeanette e Therese Voerman.',
    type: 'club',
    coordinates: { x: 68, y: 61 },
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
      'Um apartamento discreto usado por Mercurio como residência, depósito e ponto de contatos clandestinos.',
    type: 'contact',
    coordinates: { x: 34, y: 36 },
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
    description: 'O motel administrado por David Hatter, onde ele escreve seus roteiros de terror durante a madrugada.',
    type: 'investigation', coordinates: { x: 62, y: 36 }, danger: 0.3, policePresence: 0.5, crowdLevel: 0.3,
    exposure: { publicAccess: true, crowdLevel: 0.3, policePresence: 0.5, soundIsolation: 0.45, hostilePresence: 0 },
    requiresFlag: 'luckyStarUnlocked', arrivalScene: 'vesuvius_david_meeting',
  },

  dennis_warehouse: {
    id: 'dennis_warehouse', name: 'Galpão de Dennis', district: 'Limão',
    description: 'Um galpão clandestino próximo à Marginal Tietê, identificado pelas pistas encontradas nas roupas de Mercurio.',
    type: 'investigation', coordinates: { x: 22, y: 24 }, danger: 0.8, policePresence: 0.2, crowdLevel: 0.1,
    exposure: { publicAccess: false, crowdLevel: 0.1, policePresence: 0.2, soundIsolation: 0.7, hostilePresence: 0.8 },
    requiresFlag: 'dennisWarehouseUnlocked', arrivalScene: 'mercurio_warehouse',
  },

  gallery_noir: {
    id: 'gallery_noir', name: 'Galeria Noir', district: 'Jardins',
    description: 'Uma galeria de arte contemporânea que recebe uma inauguração beneficente frequentada pela elite paulistana.',
    type: 'investigation', coordinates: { x: 73, y: 48 }, danger: 0.55, policePresence: 0.55, crowdLevel: 0.85,
    exposure: { publicAccess: true, crowdLevel: 0.85, policePresence: 0.55, soundIsolation: 0.35, hostilePresence: 0.15 },
    requiresFlag: 'galleryNoirUnlocked', arrivalScene: 'gallery_noir_infiltration',
  },

  ocean_house_sp: {
    id: 'ocean_house_sp', name: 'Ocean House Hotel', district: 'Santos',
    description: 'Um hotel incendiado e abandonado no litoral, agora assombrado por uma presença que impede os planos imobiliários de Therese.',
    type: 'investigation', coordinates: { x: 80, y: 78 }, danger: 0.7, policePresence: 0.1, crowdLevel: 0,
    exposure: { publicAccess: false, crowdLevel: 0, policePresence: 0.1, soundIsolation: 0.8, hostilePresence: 0.5 },
    requiresFlag: 'oceanHouseUnlocked', arrivalScene: 'ocean_house_investigation',
  },

  surfside_diner: {
    id: 'surfside_diner', name: 'Surfside Diner', district: 'Santa Monica',
    description: 'Uma lanchonete quase vazia perto da orla. A cabine dos fundos fica ao lado dos telefones públicos.',
    type: 'contact', coordinates: { x: 77, y: 72 }, danger: 0.3, policePresence: 0.3, crowdLevel: 0.35,
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
      'Um bairro marcado por comércio, restaurantes, cultura e uma intensa movimentação noturna.',

    type:
      'district',

    coordinates: {
      x: 55,
      y: 46,
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
      'Região próxima à Paulista, com bares, teatros, restaurantes e ruas residenciais.',

    type:
      'district',

    coordinates: {
      x: 44,
      y: 52,
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
      'Região boêmia e movimentada, com bares, restaurantes, casas noturnas e uma população diversificada.',

    type:
      'district',

    coordinates: {
      x: 39,
      y: 48,
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
      'Bairro conhecido pela vida noturna, arte urbana, bares e intensa atividade cultural.',

    type:
      'district',

    coordinates: {
      x: 36,
      y: 46,
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
      'Região da Zona Norte com forte circulação de moradores, comércio e acesso ao metrô.',

    type:
      'district',

    coordinates: {
      x: 50,
      y: 29,
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
      'Uma região de mata e áreas residenciais afastadas do centro urbano.',

    type:
      'district',

    coordinates: {
      x: 52,
      y: 17,
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
      'Bairro tradicional da Zona Leste, com áreas residenciais, comércio e antigas construções.',

    type:
      'district',

    coordinates: {
      x: 65,
      y: 48,
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
      'Região movimentada da Zona Leste, com comércio, bares e áreas residenciais.',

    type:
      'district',

    coordinates: {
      x: 72,
      y: 44,
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
      'Região histórica de São Paulo, com áreas residenciais e importantes pontos culturais.',

    type:
      'district',

    coordinates: {
      x: 58,
      y: 58,
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
      'Região residencial e universitária próxima ao centro expandido.',

    type:
      'district',

    coordinates: {
      x: 49,
      y: 60,
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
      'Bairro da Zona Sul conectado ao restante da cidade por metrô e grandes avenidas.',

    type:
      'district',

    coordinates: {
      x: 49,
      y: 67,
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
      'Importante região da Zona Sul, com comércio, transporte e áreas empresariais.',

    type:
      'district',

    coordinates: {
      x: 37,
      y: 69,
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
      'Região extensa e densamente povoada da Zona Sul.',

    type:
      'district',

    coordinates: {
      x: 24,
      y: 75,
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
      'Região de grandes avenidas, áreas residenciais e contrastes sociais marcantes.',

    type:
      'district',

    coordinates: {
      x: 30,
      y: 59,
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
      'Importante área de transporte, eventos, comércio e acesso à Zona Oeste.',

    type:
      'district',

    coordinates: {
      x: 42,
      y: 39,
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
      'Hospital particular que aparece repetidamente nos arquivos deixados por Lívia. Durante a madrugada, parte de sua movimentação não corresponde aos registros oficiais.',

    type:
      'hospital',

    coordinates: {
      x: 55,
      y: 65,
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
      'Região tradicional da Zona Oeste, com comércio e importantes conexões de transporte.',

    type:
      'district',

    coordinates: {
      x: 32,
      y: 40,
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
