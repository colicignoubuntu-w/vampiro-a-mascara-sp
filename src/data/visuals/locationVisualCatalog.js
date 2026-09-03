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
    videos: [
      {
        id: '-8fLx-nPLdk',
        title: 'Centrão de São Paulo à noite',
      },
      {
        id: 'PUV5Qi0-4Tc',
        title: 'Andando pelo Centro de São Paulo à noite',
      },
      {
        id: '8mYh3IuiZwg',
        title: 'Passeio pelo Centro Histórico à noite',
      },
      {
        id: 'U-hZalxOmyU',
        title: 'Caminhada pela Praça da República',
      },
      {
        id: 'jMUSBfvS7s8',
        title: 'Percurso de moto por São Paulo',
      },
      {
        id: 'mTxfYnPasVw',
        title: 'Andando de moto por São Paulo',
        startSeconds: 100,
      },
    ],
  },

  estacao_da_luz: {
    video: {
      id: '_Uhf2AXxYyU',
      title: 'Estação da Luz e arredores',
    },
  },

  paulista: {
    videos: [
      {
        id: 'g6_-IdZauh8',
        title: 'Avenida Paulista à noite',
      },
      {
        id: '1yg36LDNs2Y',
        title: 'Avenida Paulista à noite em 4K',
        startSeconds: 219,
      },
    ],
  },

  liberdade: {
    videos: [
      {
        id: 'JHB7Tr7Q6W8',
        title: 'Noite no bairro da Liberdade',
      },
      {
        id: 'FH6O5VsztQU',
        title: 'Dirigindo pela Liberdade à noite',
      },
    ],
  },

  bela_vista: {
    videos: [
      {
        id: 'tQjLj65j1dI',
        title: 'Vida noturna na Rua Augusta',
      },
    ],
    weekendVideos: [
      {
        id: '3993qD3CI_I',
        title: 'Noite badalada na Rua Augusta',
      },
    ],
  },

  pinheiros: {
    videos: [
      {
        id: 'HBo9otQY4mc',
        title: 'Caminhada por Pinheiros',
      },
      {
        id: 'EHDh2qCNwHQ',
        title: 'Caminhada pela Avenida Faria Lima',
      },
      {
        id: 'C2lhKtDMGRo',
        title: 'Caminhada por Pinheiros',
      },
    ],
  },

  avenida_sumare: {
    videos: [
      {
        id: 'FH6O5VsztQU',
        title: 'Percurso noturno de carro por São Paulo',
      },
      {
        id: 'jMUSBfvS7s8',
        title: 'Percurso de moto por São Paulo',
      },
      {
        id: 'mTxfYnPasVw',
        title: 'Andando de moto por São Paulo',
        startSeconds: 100,
      },
    ],
  },

  vila_madalena: {
    videos: [
      {
        id: 'IDi6TUKMVBE',
        title: 'Noite na Vila Madalena',
      },
      {
        id: 'VyjeVcCZB70',
        title: 'Caminhada pela Vila Madalena',
      },
    ],
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

  capao_redondo: {
    videos: [
      {
        id: '6jc7ffKOYuI',
        title: 'Caminhada pelo Capão Redondo',
      },
      {
        id: 'oH7L5_R0bHk',
        title: 'Dirigindo pelo Capão Redondo',
      },
      {
        id: 'MAt9JUrdDQo',
        title: 'Percurso de carro pelo Capão Redondo',
      },
    ],
  },

  barra_funda: {
    videos: [
      {
        id: '2JWRrC19fiY',
        title: 'Praça Marechal Deodoro à noite',
      },
      {
        id: '02BBGFxdQVQ',
        title: 'Caminhada pela Barra Funda',
      },
    ],
  },
}

export function getLocationVisual(
  locationId,
  variant = 0,
  world = null
) {
  const visual =
    LOCATION_VISUALS[locationId]

  if (!visual) return null

  const elapsedDays = Math.max(
    0,
    Math.floor(Number(world?.day) || 1) - 1
  )
  const weekday = elapsedDays % 7
  const isFridayOrSaturday =
    weekday === 5 || weekday === 6
  const videos =
    isFridayOrSaturday &&
    visual.weekendVideos?.length
      ? visual.weekendVideos
      : visual.videos

  if (!videos?.length) {
    return visual
  }

  const index =
    Math.abs(Number(variant) || 0) %
    videos.length

  return {
    ...visual,
    video: videos[index],
  }
}

export default LOCATION_VISUALS
