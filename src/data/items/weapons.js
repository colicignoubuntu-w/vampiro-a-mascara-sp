const weapons = {
  fists: {
    id: 'fists',

    name: 'Punhos',

    category: 'unarmed',

    attackAbility: 'brawl',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'strength',

    damageBonus: 0,

    damageType: 'bashing',

    sourceType: 'unarmed',

    range: 'melee',
  },

  kick: {
    id: 'kick',

    name: 'Chute',

    category: 'unarmed',

    attackAbility: 'brawl',

    attackAttribute: 'dexterity',

    difficulty: 7,

    damageMode: 'strength',

    damageBonus: 1,

    damageType: 'bashing',

    sourceType: 'unarmed',

    range: 'melee',
  },

  baseballBat: {
    id: 'baseballBat',

    name: 'Taco de Baseball',

    category: 'melee',

    attackAbility: 'melee',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'strength',

    damageBonus: 2,

    damageType: 'bashing',

    sourceType: 'blunt',

    range: 'melee',

    concealability: 'large',
  },

  policeBaton: {
    id: 'policeBaton',

    name: 'Cassetete',

    category: 'melee',

    attackAbility: 'melee',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'strength',

    damageBonus: 1,

    damageType: 'bashing',

    sourceType: 'blunt',

    range: 'melee',

    concealability: 'medium',
  },

  knife: {
    id: 'knife',

    name: 'Faca',

    category: 'melee',

    attackAbility: 'melee',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'strength',

    damageBonus: 1,

    damageType: 'lethal',

    sourceType: 'blade',

    range: 'melee',

    concealability: 'small',
  },

  machete: {
    id: 'machete',

    name: 'Facão',

    category: 'melee',

    attackAbility: 'melee',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'strength',

    damageBonus: 2,

    damageType: 'lethal',

    sourceType: 'blade',

    range: 'melee',

    concealability: 'large',
  },

  axe: {
    id: 'axe',

    name: 'Machado',

    category: 'melee',

    attackAbility: 'melee',

    attackAttribute: 'dexterity',

    difficulty: 7,

    damageMode: 'strength',

    damageBonus: 3,

    damageType: 'lethal',

    sourceType: 'blade',

    range: 'melee',

    concealability: 'large',
  },

  stake: {
    id: 'stake',

    name: 'Estaca de Madeira',

    category: 'stake',

    attackAbility: 'melee',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'strength',

    damageBonus: 1,

    damageType: 'lethal',

    sourceType: 'stake',

    range: 'melee',

    concealability: 'medium',

    stakeRules: {
      enabled: true,

      heartDifficulty: 9,

      requiredAttackSuccesses: 3,

      onlyAffectsVampires: true,

      paralyzes: true,
    },
  },

  revolver38: {
    id: 'revolver38',

    name: 'Revólver .38',

    category: 'firearm',

    attackAbility: 'firearms',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'fixed',

    damagePool: 4,

    damageType: 'lethal',

    sourceType: 'firearm',

    range: 'ranged',

    ammunition: {
      magazine: 6,

      current: 6,

      ammoType: '.38',
    },
  },

  pistol9mm: {
    id: 'pistol9mm',

    name: 'Pistola 9mm',

    category: 'firearm',

    attackAbility: 'firearms',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'fixed',

    damagePool: 4,

    damageType: 'lethal',

    sourceType: 'firearm',

    range: 'ranged',

    ammunition: {
      magazine: 15,

      current: 15,

      ammoType: '9mm',
    },
  },

  shotgun: {
    id: 'shotgun',

    name: 'Escopeta',

    category: 'firearm',

    attackAbility: 'firearms',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'fixed',

    damagePool: 8,

    damageType: 'lethal',

    sourceType: 'firearm',

    range: 'ranged',

    ammunition: {
      magazine: 5,

      current: 5,

      ammoType: '12 gauge',
    },
  },

  vampireBite: {
    id: 'vampireBite',

    name: 'Mordida Vampírica',

    category: 'natural',

    attackAbility: 'brawl',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'strength',

    damageBonus: 1,

    damageType: 'aggravated',

    sourceType: 'vampire-bite',

    range: 'melee',

    requiresGrapple: true,
  },

  claws: {
    id: 'claws',

    name: 'Garras Sobrenaturais',

    category: 'natural',

    attackAbility: 'brawl',

    attackAttribute: 'dexterity',

    difficulty: 6,

    damageMode: 'strength',

    damageBonus: 1,

    damageType: 'aggravated',

    sourceType: 'supernatural',

    range: 'melee',
  },
}

export function getWeapon(
  weaponId
) {
  return (
    weapons[weaponId] ??
    null
  )
}

export function getAllWeapons() {
  return Object.values(
    weapons
  )
}

export default weapons