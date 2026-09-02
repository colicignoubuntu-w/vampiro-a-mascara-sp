const NPC_VISUALS = {
  Vi: {
    src: '/images/npcs/vi/portrait.png',
    alt: 'Vi',
  },

  'Janette Voerman': {
    src:
      '/images/npcs/janette-voerman/portrait.png',
    alt: 'Janette Voerman',
  },

  'Jeanette Voerman': {
    src:
      '/images/npcs/janette-voerman/portrait.png',
    alt: 'Janette Voerman',
  },

  Janette: {
    src:
      '/images/npcs/janette-voerman/portrait.png',
    alt: 'Janette Voerman',
  },

  'Therese Voerman': {
    src:
      '/images/npcs/therese-voerman/portrait.png',
    alt: 'Therese Voerman',
  },

  Therese: {
    src:
      '/images/npcs/therese-voerman/portrait.png',
    alt: 'Therese Voerman',
  },

  'Therese e Janette': {
    src:
      '/images/npcs/voerman-sisters/portrait.png',
    alt: 'Therese e Janette Voerman',
  },

  Jack: {
    src: '/images/npcs/jack/portrait.png',
    alt: 'Jack',
  },

  Mercurio: {
    src:
      '/images/npcs/mercurio/portrait.png',
    alt: 'Mercurio',
  },

  Marina: {
    src: '/images/npcs/marina/portrait.png',
    alt: 'Marina',
  },

  'O Príncipe': {
    src: '/images/npcs/prince/portrait.png',
    alt: 'O Príncipe',
  },

  'David Hatter': {
    src:
      '/images/npcs/david-hatter/portrait.png',
    alt: 'David Hatter',
  },

  Adder: {
    src: '/images/npcs/adder/portrait.png',
    alt: 'Adder',
  },

  Segurança: {
    src:
      '/images/npcs/security/portrait.png',
    alt: 'Segurança',
  },

  'Segundo Segurança': {
    src:
      '/images/npcs/security/portrait.png',
    alt: 'Segurança',
  },

  'Vampiro Desconhecido': {
    src:
      '/images/npcs/unknown-vampire/portrait.png',
    alt: 'Vampiro desconhecido',
  },

  Desconhecido: {
    src:
      '/images/npcs/unknown-vampire/portrait.png',
    alt: 'Desconhecido',
  },

  '???': {
    src:
      '/images/npcs/unknown-vampire/portrait.png',
    alt: 'Figura desconhecida',
  },
}

export function getNpcVisual(
  speaker
) {
  return (
    NPC_VISUALS[speaker] ?? null
  )
}

export default NPC_VISUALS
