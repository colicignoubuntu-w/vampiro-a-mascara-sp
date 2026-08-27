const routes = [
  /*
    ========================================
    CENTRO
    ========================================
  */

  {
    from: 'centro',
    to: 'paulista',

    distance: 3,

    walking: {
      minutes: 35,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 20,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 12,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 12,
      cost: 10,
      risk: 'low',
    },
  },

  {
    from: 'centro',
    to: 'liberdade',

    distance: 2,

    walking: {
      minutes: 20,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 12,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 8,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 8,
      cost: 8,
      risk: 'low',
    },
  },

  {
    from: 'centro',
    to: 'barra_funda',

    distance: 5,

    walking: {
      minutes: 60,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 30,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 18,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 18,
      cost: 15,
      risk: 'low',
    },
  },

  /*
    ========================================
    PAULISTA
    ========================================
  */

  {
    from: 'paulista',
    to: 'bela_vista',

    distance: 1,

    walking: {
      minutes: 12,
      cost: 0,
      risk: 'low',
    },

    bus: {
      minutes: 8,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 6,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 6,
      cost: 6,
      risk: 'low',
    },
  },

  {
    from: 'paulista',
    to: 'vesuvius',

    distance: 1,

    walking: {
      minutes: 10,
      cost: 0,
      risk: 'low',
    },

    bus: {
      minutes: 7,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 8,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 5,
      cost: 6,
      risk: 'low',
    },
  },

  {
    from: 'paulista',
    to: 'asylum',
    distance: 2,
    walking: { minutes: 18, cost: 0, risk: 'low' },
    bus: { minutes: 12, cost: 5, risk: 'low' },
    subway: { minutes: 10, cost: 5, risk: 'low' },
    car: { minutes: 8, cost: 8, risk: 'low' },
  },

  {
    from: 'centro',
    to: 'mercurio_apartment',
    distance: 5,
    walking: { minutes: 55, cost: 0, risk: 'medium' },
    bus: { minutes: 28, cost: 5, risk: 'medium' },
    subway: { minutes: 18, cost: 5, risk: 'low' },
    car: { minutes: 16, cost: 14, risk: 'low' },
  },

  {
    from: 'paulista',
    to: 'vila_mariana',

    distance: 4,

    walking: {
      minutes: 50,
      cost: 0,
      risk: 'low',
    },

    bus: {
      minutes: 30,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 15,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 15,
      cost: 12,
      risk: 'low',
    },
  },

  {
    from: 'paulista',
    to: 'pinheiros',

    distance: 5,

    walking: {
      minutes: 60,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 35,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 20,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 18,
      cost: 15,
      risk: 'low',
    },
  },

  /*
    ========================================
    PINHEIROS
    ========================================
  */

  {
    from: 'pinheiros',
    to: 'vila_madalena',

    distance: 2,

    walking: {
      minutes: 25,
      cost: 0,
      risk: 'low',
    },

    bus: {
      minutes: 15,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 10,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 8,
      cost: 8,
      risk: 'low',
    },
  },

  {
    from: 'pinheiros',
    to: 'lapa',

    distance: 4,

    walking: {
      minutes: 50,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 30,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 15,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 15,
      cost: 12,
      risk: 'low',
    },
  },

  /*
    ========================================
    ZONA NORTE
    ========================================
  */

  {
    from: 'centro',
    to: 'santana',

    distance: 7,

    walking: {
      minutes: 90,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 40,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 25,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 25,
      cost: 20,
      risk: 'low',
    },
  },

  {
    from: 'santana',
    to: 'cantareira',

    distance: 8,

    walking: {
      minutes: 100,
      cost: 0,
      risk: 'high',
    },

    bus: {
      minutes: 45,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 35,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 25,
      cost: 20,
      risk: 'medium',
    },
  },

  /*
    ========================================
    ZONA LESTE
    ========================================
  */

  {
    from: 'centro',
    to: 'mooca',

    distance: 5,

    walking: {
      minutes: 60,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 30,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 18,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 18,
      cost: 12,
      risk: 'low',
    },
  },

  {
    from: 'mooca',
    to: 'tatuape',

    distance: 4,

    walking: {
      minutes: 50,
      cost: 0,
      risk: 'low',
    },

    bus: {
      minutes: 25,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 15,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 12,
      cost: 10,
      risk: 'low',
    },
  },

  /*
    ========================================
    ZONA SUL
    ========================================
  */

  {
    from: 'vila_mariana',
    to: 'saude',

    distance: 4,

    walking: {
      minutes: 50,
      cost: 0,
      risk: 'low',
    },

    bus: {
      minutes: 30,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 15,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 12,
      cost: 10,
      risk: 'low',
    },
  },

  {
    from: 'saude',
    to: 'santo_amaro',

    distance: 8,

    walking: {
      minutes: 100,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 45,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 30,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 25,
      cost: 20,
      risk: 'low',
    },
  },

  {
    from: 'santo_amaro',
    to: 'capao_redondo',

    distance: 10,

    walking: {
      minutes: 130,
      cost: 0,
      risk: 'high',
    },

    bus: {
      minutes: 60,
      cost: 5,
      risk: 'high',
    },

    subway: {
      minutes: 35,
      cost: 5,
      risk: 'medium',
    },

    car: {
      minutes: 30,
      cost: 25,
      risk: 'medium',
    },
  },

  {
    from: 'santo_amaro',
    to: 'morumbi',

    distance: 6,

    walking: {
      minutes: 75,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 40,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 25,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 20,
      cost: 15,
      risk: 'low',
    },
  },

  /*
    ========================================
    LIGAÇÕES EXTRAS
    ========================================
  */

  {
    from: 'barra_funda',
    to: 'lapa',

    distance: 4,

    walking: {
      minutes: 45,
      cost: 0,
      risk: 'medium',
    },

    bus: {
      minutes: 25,
      cost: 5,
      risk: 'medium',
    },

    subway: {
      minutes: 12,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 12,
      cost: 10,
      risk: 'low',
    },
  },

  {
    from: 'bela_vista',
    to: 'liberdade',

    distance: 2,

    walking: {
      minutes: 20,
      cost: 0,
      risk: 'low',
    },

    bus: {
      minutes: 12,
      cost: 5,
      risk: 'low',
    },

    subway: {
      minutes: 8,
      cost: 5,
      risk: 'low',
    },

    car: {
      minutes: 8,
      cost: 8,
      risk: 'low',
    },
  },
]

export default routes
