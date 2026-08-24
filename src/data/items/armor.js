const armor = {
  none: {
    id: 'none',

    name: 'Sem Armadura',

    category: 'armor',

    protection: {
      bashing: 0,
      lethal: 0,
      aggravated: 0,
    },

    dexterityPenalty: 0,
  },

  reinforcedJacket: {
    id: 'reinforcedJacket',

    name: 'Jaqueta Reforçada',

    category: 'armor',

    protection: {
      bashing: 1,
      lethal: 1,
      aggravated: 0,
    },

    dexterityPenalty: 0,
  },

  lightVest: {
    id: 'lightVest',

    name: 'Colete Balístico Leve',

    category: 'armor',

    protection: {
      bashing: 2,
      lethal: 2,
      aggravated: 0,
    },

    dexterityPenalty: 0,
  },

  ballisticVest: {
    id: 'ballisticVest',

    name: 'Colete à Prova de Balas',

    category: 'armor',

    protection: {
      bashing: 2,
      lethal: 3,
      aggravated: 0,
    },

    dexterityPenalty: 1,

    firearmBonus: 1,
  },

  heavyVest: {
    id: 'heavyVest',

    name: 'Colete Balístico Pesado',

    category: 'armor',

    protection: {
      bashing: 3,
      lethal: 4,
      aggravated: 0,
    },

    dexterityPenalty: 2,

    firearmBonus: 1,
  },
}

export function getArmor(
  armorId
) {
  return (
    armor[armorId] ??
    armor.none
  )
}

export function getAllArmor() {
  return Object.values(
    armor
  )
}

export default armor