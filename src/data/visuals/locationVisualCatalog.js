const LOCATION_VISUALS = {
  malkavian_hospital: {
    background:
      '/images/hospital-abandonado/hospital-interior.png',
  },

  malkavian_hospital_corridor: {
    background:
      '/images/hospital-abandonado/hospital-interior.png',
    characters: {
      Desconhecido: {
        src:
          '/images/npcs/jack/portrait.png',
        alt: 'Homem desconhecido',
      },
    },
  },

  camarilla_court: {
    background:
      '/images/teatro-municipal/teatro-municipal-interior.png',
  },

  centro: {
    video: {
      id: '-8fLx-nPLdk',
      title: 'Centrão de São Paulo à noite',
    },
  },

  paulista: {
    video: {
      id: 'g6_-IdZauh8',
      title: 'Avenida Paulista à noite',
    },
  },

  liberdade: {
    video: {
      id: 'JHB7Tr7Q6W8',
      title: 'Noite no bairro da Liberdade',
    },
  },

  bela_vista: {
    video: {
      id: 'tQjLj65j1dI',
      title: 'Vida noturna na Rua Augusta',
    },
  },

  pinheiros: {
    video: {
      id: 'HBo9otQY4mc',
      title: 'Caminhada por Pinheiros',
    },
  },

  vila_madalena: {
    video: {
      id: 'IDi6TUKMVBE',
      title: 'Noite na Vila Madalena',
    },
  },

  vila_mariana: {
    video: {
      id: '_dQlIAor0co',
      title: 'Caminhada pela Vila Mariana',
    },
  },

  morumbi: {
    video: {
      id: 'UrVCkXGlnDs',
      title: 'Ruas e mansões do Morumbi',
    },
  },

  barra_funda: {
    video: {
      id: '2JWRrC19fiY',
      title: 'Praça Marechal Deodoro à noite',
    },
  },
}

export function getLocationVisual(
  locationId
) {
  return (
    LOCATION_VISUALS[locationId] ??
    null
  )
}

export default LOCATION_VISUALS
