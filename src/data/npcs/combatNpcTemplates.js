const combatNpcTemplates = {
  brujahStreetFighter: {
    id:
      'brujah_street_fighter',

    name:
      'Brujah Brigão',

    clan:
      'brujah',

    type:
      'vampire',

    vampire:
      true,

    generation:
      '11ª',

    combatPersonality:
      'aggressive',

    attributes: {
      strength: 4,
      dexterity: 3,
      stamina: 4,

      charisma: 2,
      manipulation: 2,

      wits: 3,
      intelligence: 2,
    },

    abilities: {
      brawl: 4,
      melee: 2,
      firearms: 1,
      dodge: 3,
      athletics: 3,
      intimidation: 3,
    },

    virtues: {
      conscience: 2,
      selfControl: 3,
      courage: 4,
    },

    willpower: 6,
    humanity: 5,

    disciplines: {
      celerity: 2,
      potency: 3,
      presence: 1,
    },

    blood: {
      current: 7,
      maximum: 12,
    },

    health: {
      maximum: 7,
      bashing: 0,
      lethal: 0,
      aggravated: 0,
      currentLevel: 0,
    },

    weaponId:
      'baseball_bat',

    armorId:
      'leather_jacket',

    ammo: {
      loaded: 0,
      reserve: 0,
    },

    tactics: {
      prefersMelee:
        true,

      prefersGrapple:
        true,

      retreatsAtHealth:
        0.1,
    },
  },

  gangrelPredator: {
    id:
      'gangrel_predator',

    name:
      'Gangrel Predador',

    clan:
      'gangrel',

    type:
      'vampire',

    vampire:
      true,

    generation:
      '10ª',

    combatPersonality:
      'predator',

    attributes: {
      strength: 4,
      dexterity: 4,
      stamina: 5,

      charisma: 2,
      manipulation: 1,

      wits: 4,
      intelligence: 2,
    },

    abilities: {
      brawl: 4,
      melee: 2,
      firearms: 0,
      dodge: 3,
      athletics: 4,
      intimidation: 3,
    },

    virtues: {
      conscience: 2,
      selfControl: 3,
      courage: 5,
    },

    willpower: 7,
    humanity: 4,

    disciplines: {
      animalism: 2,
      fortitude: 3,
      protean: 3,
    },

    blood: {
      current: 5,
      maximum: 13,
    },

    health: {
      maximum: 7,
      bashing: 0,
      lethal: 0,
      aggravated: 0,
      currentLevel: 0,
    },

    weaponId:
      'fists',

    armorId:
      'none',

    ammo: {
      loaded: 0,
      reserve: 0,
    },

    tactics: {
      prefersMelee:
        true,

      prefersBite:
        true,

      prefersGrapple:
        true,

      usesFeralClaws:
        true,
    },
  },

  malkavianManipulator: {
    id:
      'malkavian_manipulator',

    name:
      'Malkaviano Perturbador',

    clan:
      'malkavian',

    type:
      'vampire',

    vampire:
      true,

    generation:
      '10ª',

    combatPersonality:
      'balanced',

    attributes: {
      strength: 2,
      dexterity: 3,
      stamina: 3,

      charisma: 4,
      manipulation: 4,

      wits: 4,
      intelligence: 3,
    },

    abilities: {
      brawl: 2,
      melee: 1,
      firearms: 2,
      dodge: 3,
      athletics: 2,
      intimidation: 4,
    },

    virtues: {
      conscience: 3,
      selfControl: 3,
      courage: 3,
    },

    willpower: 8,
    humanity: 5,

    disciplines: {
      auspex: 2,
      dementia: 4,
      obfuscate: 2,
    },

    blood: {
      current: 7,
      maximum: 13,
    },

    health: {
      maximum: 7,
      bashing: 0,
      lethal: 0,
      aggravated: 0,
      currentLevel: 0,
    },

    weaponId:
      'knife',

    armorId:
      'none',

    ammo: {
      loaded: 0,
      reserve: 0,
    },

    tactics: {
      prefersDisciplines:
        true,

      avoidsMelee:
        true,

      usesFear:
        true,
    },
  },

  nosferatuAmbusher: {
    id:
      'nosferatu_ambusher',

    name:
      'Nosferatu Emboscador',

    clan:
      'nosferatu',

    type:
      'vampire',

    vampire:
      true,

    generation:
      '11ª',

    combatPersonality:
      'aggressive',

    attributes: {
      strength: 4,
      dexterity: 3,
      stamina: 4,

      charisma: 1,
      manipulation: 2,

      wits: 4,
      intelligence: 3,
    },

    abilities: {
      brawl: 4,
      melee: 3,
      firearms: 2,
      dodge: 3,
      athletics: 3,
      intimidation: 4,
    },

    virtues: {
      conscience: 2,
      selfControl: 3,
      courage: 4,
    },

    willpower: 7,
    humanity: 4,

    disciplines: {
      animalism: 2,
      obfuscate: 3,
      potency: 3,
    },

    blood: {
      current: 7,
      maximum: 12,
    },

    health: {
      maximum: 7,
      bashing: 0,
      lethal: 0,
      aggravated: 0,
      currentLevel: 0,
    },

    weaponId:
      'knife',

    armorId:
      'leather_jacket',

    ammo: {
      loaded: 0,
      reserve: 0,
    },

    tactics: {
      prefersAmbush:
        true,

      prefersMelee:
        true,

      usesObfuscate:
        true,
    },
  },

  toreadorGunfighter: {
    id:
      'toreador_gunfighter',

    name:
      'Toreador Pistoleiro',

    clan:
      'toreador',

    type:
      'vampire',

    vampire:
      true,

    generation:
      '10ª',

    combatPersonality:
      'ranged',

    attributes: {
      strength: 2,
      dexterity: 5,
      stamina: 3,

      charisma: 4,
      manipulation: 3,

      wits: 4,
      intelligence: 3,
    },

    abilities: {
      brawl: 2,
      melee: 1,
      firearms: 4,
      dodge: 4,
      athletics: 3,
      intimidation: 2,
    },

    virtues: {
      conscience: 3,
      selfControl: 4,
      courage: 3,
    },

    willpower: 7,
    humanity: 6,

    disciplines: {
      auspex: 2,
      celerity: 3,
      presence: 2,
    },

    blood: {
      current: 8,
      maximum: 13,
    },

    health: {
      maximum: 7,
      bashing: 0,
      lethal: 0,
      aggravated: 0,
      currentLevel: 0,
    },

    weaponId:
      'pistol_9mm',

    armorId:
      'bulletproof_vest',

    ammo: {
      loaded: 15,
      reserve: 30,
    },

    tactics: {
      prefersRanged:
        true,

      usesCelerity:
        true,

      keepsDistance:
        true,
    },
  },

  tremereWarlock: {
    id:
      'tremere_warlock',

    name:
      'Tremere Feiticeiro',

    clan:
      'tremere',

    type:
      'vampire',

    vampire:
      true,

    generation:
      '9ª',

    combatPersonality:
      'ranged',

    attributes: {
      strength: 2,
      dexterity: 3,
      stamina: 3,

      charisma: 3,
      manipulation: 4,

      wits: 4,
      intelligence: 5,
    },

    abilities: {
      brawl: 1,
      melee: 1,
      firearms: 2,
      dodge: 3,
      athletics: 2,
      intimidation: 3,
    },

    virtues: {
      conscience: 3,
      selfControl: 4,
      courage: 3,
    },

    willpower: 9,
    humanity: 5,

    disciplines: {
      auspex: 3,
      dominate: 3,
      thaumaturgy: 5,
    },

    blood: {
      current: 9,
      maximum: 14,
    },

    health: {
      maximum: 7,
      bashing: 0,
      lethal: 0,
      aggravated: 0,
      currentLevel: 0,
    },

    weaponId:
      'pistol_9mm',

    armorId:
      'none',

    ammo: {
      loaded: 15,
      reserve: 15,
    },

    tactics: {
      prefersDisciplines:
        true,

      avoidsMelee:
        true,

      usesThaumaturgy:
        true,

      usesDominate:
        true,
    },
  },

  ventrueEnforcer: {
    id:
      'ventrue_enforcer',

    name:
      'Ventrue Executor',

    clan:
      'ventrue',

    type:
      'vampire',

    vampire:
      true,

    generation:
      '9ª',

    combatPersonality:
      'balanced',

    attributes: {
      strength: 3,
      dexterity: 3,
      stamina: 5,

      charisma: 4,
      manipulation: 4,

      wits: 3,
      intelligence: 3,
    },

    abilities: {
      brawl: 3,
      melee: 2,
      firearms: 3,
      dodge: 2,
      athletics: 2,
      intimidation: 4,
    },

    virtues: {
      conscience: 3,
      selfControl: 4,
      courage: 4,
    },

    willpower: 8,
    humanity: 5,

    disciplines: {
      dominate: 4,
      fortitude: 4,
      presence: 3,
    },

    blood: {
      current: 10,
      maximum: 14,
    },

    health: {
      maximum: 7,
      bashing: 0,
      lethal: 0,
      aggravated: 0,
      currentLevel: 0,
    },

    weaponId:
      'pistol_9mm',

    armorId:
      'bulletproof_vest',

    ammo: {
      loaded: 15,
      reserve: 30,
    },

    tactics: {
      prefersDominate:
        true,

      durable:
        true,

      prefersRanged:
        true,
    },
  },
}

/*
  ========================================
  UTILITÁRIOS
  ========================================
*/

export function getCombatNpcTemplate(
  id
) {
  const template =
    combatNpcTemplates[
      id
    ]

  if (!template) {
    return null
  }

  return structuredClone(
    template
  )
}

export function getAllCombatNpcTemplates() {
  return Object.values(
    combatNpcTemplates
  ).map(
    (template) =>
      structuredClone(
        template
      )
  )
}

export function createCombatNpc(
  templateId,
  overrides = {}
) {
  const template =
    getCombatNpcTemplate(
      templateId
    )

  if (!template) {
    throw new Error(
      `Template de NPC não encontrado: ${templateId}`
    )
  }

  return {
    ...template,

    ...overrides,

    attributes: {
      ...template.attributes,

      ...(overrides.attributes ??
        {}),
    },

    abilities: {
      ...template.abilities,

      ...(overrides.abilities ??
        {}),
    },

    virtues: {
      ...template.virtues,

      ...(overrides.virtues ??
        {}),
    },

    disciplines: {
      ...template.disciplines,

      ...(overrides.disciplines ??
        {}),
    },

    blood: {
      ...template.blood,

      ...(overrides.blood ??
        {}),
    },

    health: {
      ...template.health,

      ...(overrides.health ??
        {}),
    },

    ammo: {
      ...template.ammo,

      ...(overrides.ammo ??
        {}),
    },

    tactics: {
      ...template.tactics,

      ...(overrides.tactics ??
        {}),
    },
  }
}

export function createRandomClanNpc(
  clan
) {
  const normalized =
    String(
      clan ?? ''
    )
      .trim()
      .toLowerCase()

  const templates =
    getAllCombatNpcTemplates()
      .filter(
        (npc) =>
          npc.clan ===
          normalized
      )

  if (
    templates.length === 0
  ) {
    return null
  }

  return templates[
    Math.floor(
      Math.random() *
      templates.length
    )
  ]
}

export {
  combatNpcTemplates,
}

export default combatNpcTemplates