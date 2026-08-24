import {
  getDisciplineLevel,
} from './disciplineEngine'

import {
  getActiveDisciplineEffect,
} from './disciplineEffectEngine'

function safeNumber(
  value,
  fallback = 0
) {
  const parsed =
    Number(value)

  return Number.isNaN(
    parsed
  )
    ? fallback
    : parsed
}

function clamp(
  value,
  min,
  max
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  )
}

/*
  ========================================
  TIPOS DE DANO
  ========================================
*/

export const DAMAGE_TYPES = {
  bashing: {
    id:
      'bashing',

    label:
      'Contusão',
  },

  lethal: {
    id:
      'lethal',

    label:
      'Letal',
  },

  aggravated: {
    id:
      'aggravated',

    label:
      'Agravado',
  },
}

/*
  ========================================
  POTÊNCIA

  Na Revised, Potência é progressiva.

  Mantemos o nível diretamente disponível
  para o sistema de combate.

  O combatEngine decidirá exatamente
  em qual fase os dados entram.
  ========================================
*/

export function getPotencyCombatBonus(
  game
) {
  const level =
    getDisciplineLevel(
      game,
      'potency'
    )

  if (
    level <= 0
  ) {
    return {
      active: false,

      level: 0,

      strengthBonus: 0,

      damageBonus: 0,
    }
  }

  return {
    active: true,

    level,

    /*
      Mantemos os dois campos porque
      diferentes ataques poderão usar
      Potência de maneiras diferentes.
    */

    strengthBonus:
      level,

    damageBonus:
      level,
  }
}

/*
  ========================================
  FORTITUDE

  Fortitude deve funcionar mesmo sem
  o jogador apertar um botão.

  Também será a Disciplina que permite
  absorção sobrenatural de agravado.
  ========================================
*/

export function getFortitudeCombatBonus(
  game
) {
  const level =
    getDisciplineLevel(
      game,
      'fortitude'
    )

  if (
    level <= 0
  ) {
    return {
      active: false,

      level: 0,

      soakBonus: 0,

      aggravatedSoakDice: 0,
    }
  }

  return {
    active: true,

    level,

    soakBonus:
      level,

    aggravatedSoakDice:
      level,
  }
}

/*
  ========================================
  CELERIDADE

  Diferentemente de Potência e Fortitude,
  nosso sistema exige ativação.

  disciplineEffectEngine gera:

  disciplineEffects.celerity = {
    active: true,
    level,
    extraActions
  }
  ========================================
*/

export function getCelerityCombatBonus(
  game
) {
  const disciplineLevel =
    getDisciplineLevel(
      game,
      'celerity'
    )

  const effect =
    getActiveDisciplineEffect(
      game,
      'celerity'
    )

  if (
    disciplineLevel <= 0 ||
    !effect?.active
  ) {
    return {
      learned: disciplineLevel > 0,

      active: false,

      level:
        disciplineLevel,

      extraActions: 0,

      totalActions: 1,
    }
  }

  const activeLevel =
    clamp(
      safeNumber(
        effect.level,
        disciplineLevel
      ),
      1,
      disciplineLevel
    )

  const extraActions =
    Math.max(
      0,
      safeNumber(
        effect.extraActions,
        activeLevel
      )
    )

  return {
    learned: true,

    active: true,

    level:
      activeLevel,

    extraActions,

    totalActions:
      1 +
      extraActions,
  }
}

/*
  ========================================
  PROTEANISMO — GARRAS DA BESTA
  ========================================
*/

export function getFeralClawsState(
  game
) {
  const level =
    getDisciplineLevel(
      game,
      'protean'
    )

  const effect =
    getActiveDisciplineEffect(
      game,
      'feralClaws'
    )

  if (
    level < 2 ||
    !effect?.active
  ) {
    return {
      available:
        level >= 2,

      active: false,

      weapon: null,
    }
  }

  return {
    available: true,

    active: true,

    weapon: {
      id:
        'feral_claws',

      name:
        'Garras da Besta',

      type:
        'natural',

      category:
        'melee',

      skill:
        'brawl',

      /*
        A parada de ataque continua sendo
        Destreza + Briga.

        O dano usa Força + modificador.
      */

      damageAttribute:
        'strength',

      damageBonus:
        safeNumber(
          effect.damageBonus,
          1
        ),

      damageType:
        'aggravated',

      aggravated:
        true,

      concealable:
        false,

      supernatural:
        true,

      requiresHands:
        true,
    },
  }
}

/*
  ========================================
  ARMA NATURAL ATUAL

  Depois podemos adicionar:
  mordida,
  forma da besta,
  outras transformações.
  ========================================
*/

export function getActiveNaturalWeapon(
  game
) {
  const claws =
    getFeralClawsState(
      game
    )

  if (
    claws.active
  ) {
    return claws.weapon
  }

  return null
}

/*
  ========================================
  MODIFICADOR DE FORÇA
  ========================================
*/

export function getEffectiveStrength(
  game,
  {
    includePotency = true,
  } = {}
) {
  const baseStrength =
    Math.max(
      0,
      safeNumber(
        game?.attributes
          ?.physical
          ?.strength,
        0
      )
    )

  const potency =
    getPotencyCombatBonus(
      game
    )

  const potencyBonus =
    includePotency
      ? potency.strengthBonus
      : 0

  return {
    base:
      baseStrength,

    potency:
      potencyBonus,

    total:
      baseStrength +
      potencyBonus,
  }
}

/*
  ========================================
  DANO DE ATAQUE CORPO A CORPO

  Retorna a PARADA DE DANO.

  Não rola os dados ainda.
  ========================================
*/

export function getMeleeDamagePool(
  game,
  weapon = null,
  {
    extraDamage = 0,
  } = {}
) {
  const strength =
    getEffectiveStrength(
      game
    )

  const weaponDamage =
    safeNumber(
      weapon?.damageBonus ??
      weapon?.damage ??
      0,
      0
    )

  const additional =
    safeNumber(
      extraDamage,
      0
    )

  return {
    strength:
      strength.base,

    potency:
      strength.potency,

    weaponDamage,

    extraDamage:
      additional,

    total:
      Math.max(
        1,
        strength.total +
          weaponDamage +
          additional
      ),

    damageType:
      weapon?.damageType ??
      'bashing',

    weapon:
      weapon?.id ??
      null,
  }
}

/*
  ========================================
  ATAQUE COM GARRAS
  ========================================
*/

export function getFeralClawsDamagePool(
  game
) {
  const claws =
    getFeralClawsState(
      game
    )

  if (
    !claws.active
  ) {
    return null
  }

  return getMeleeDamagePool(
    game,
    claws.weapon
  )
}

/*
  ========================================
  ABSORÇÃO DE DANO

  Bashing/letal:
  Vigor + Fortitude.

  Agravado:
  Fortitude fornece os dados sobrenaturais
  permitidos pelo nosso motor.
  ========================================
*/

export function getSoakPool(
  game,
  damageType = 'bashing',
  {
    armorSoak = 0,
    situationalBonus = 0,
  } = {}
) {
  const stamina =
    Math.max(
      0,
      safeNumber(
        game?.attributes
          ?.physical
          ?.stamina,
        0
      )
    )

  const fortitude =
    getFortitudeCombatBonus(
      game
    )

  const armor =
    Math.max(
      0,
      safeNumber(
        armorSoak,
        0
      )
    )

  const situation =
    safeNumber(
      situationalBonus,
      0
    )

  /*
    AGRAVADO
  */

  if (
    damageType ===
    'aggravated'
  ) {
    return {
      damageType,

      stamina: 0,

      fortitude:
        fortitude.aggravatedSoakDice,

      armor,

      situational:
        situation,

      total:
        Math.max(
          0,
          fortitude.aggravatedSoakDice +
            armor +
            situation
        ),
    }
  }

  /*
    CONTUSÃO / LETAL
  */

  return {
    damageType,

    stamina,

    fortitude:
      fortitude.soakBonus,

    armor,

    situational:
      situation,

    total:
      Math.max(
        0,
        stamina +
          fortitude.soakBonus +
          armor +
          situation
      ),
  }
}

/*
  ========================================
  ARMADURA / COLETE

  O inventário poderá fornecer armorSoak.
  ========================================
*/

export function getArmorSoakFromInventory(
  game
) {
  const inventory =
    Array.isArray(
      game?.inventory
    )
      ? game.inventory
      : Object.values(
          game?.inventory ??
          {}
        )

  let highestArmor = 0

  let selectedArmor = null

  for (
    const item of inventory
  ) {
    if (
      !item ||
      typeof item !==
        'object'
    ) {
      continue
    }

    const equipped =
      item.equipped ??
      item.isEquipped ??
      false

    if (!equipped) {
      continue
    }

    const armorValue =
      safeNumber(
        item.armor ??
        item.soakBonus ??
        item.armorSoak,
        0
      )

    if (
      armorValue >
      highestArmor
    ) {
      highestArmor =
        armorValue

      selectedArmor =
        item
    }
  }

  return {
    value:
      highestArmor,

    item:
      selectedArmor,
  }
}

/*
  ========================================
  ABSORÇÃO COMPLETA

  Já inclui colete/armadura equipada.
  ========================================
*/

export function getCharacterSoakPool(
  game,
  damageType =
    'bashing'
) {
  const armor =
    getArmorSoakFromInventory(
      game
    )

  return {
    ...getSoakPool(
      game,
      damageType,
      {
        armorSoak:
          armor.value,
      }
    ),

    armorItem:
      armor.item,
  }
}

/*
  ========================================
  RESUMO DO TURNO
  ========================================
*/

export function getDisciplineCombatState(
  game
) {
  const potency =
    getPotencyCombatBonus(
      game
    )

  const fortitude =
    getFortitudeCombatBonus(
      game
    )

  const celerity =
    getCelerityCombatBonus(
      game
    )

  const claws =
    getFeralClawsState(
      game
    )

  return {
    potency,

    fortitude,

    celerity,

    feralClaws:
      claws,

    naturalWeapon:
      getActiveNaturalWeapon(
        game
      ),

    effectiveStrength:
      getEffectiveStrength(
        game
      ),

    actions:
      celerity.totalActions,
  }
}

/*
  ========================================
  FIM DO TURNO DE CELERIDADE

  Quando o turno termina, consumimos
  as ações adicionais.

  A ativação será limpa pelo combatEngine
  no momento apropriado.
  ========================================
*/

export function consumeCelerityAction(
  game
) {
  const effect =
    game?.disciplineEffects
      ?.celerity

  if (
    !effect?.active
  ) {
    return game
  }

  const remaining =
    Math.max(
      0,
      safeNumber(
        effect.extraActions,
        0
      ) - 1
    )

  return {
    ...game,

    disciplineEffects: {
      ...(game.disciplineEffects ??
        {}),

      celerity: {
        ...effect,

        extraActions:
          remaining,

        active:
          remaining > 0,
      },
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'celerity-action-consumed',

        remaining,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

/*
  ========================================
  DESATIVAR GARRAS
  ========================================
*/

export function retractFeralClaws(
  game
) {
  const effects = {
    ...(game.disciplineEffects ??
      {}),
  }

  delete effects.feralClaws

  return {
    ...game,

    disciplineEffects:
      effects,

    flags: {
      ...(game.flags ?? {}),

      proteanClawsActive:
        false,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'feral-claws-retracted',

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export default {
  DAMAGE_TYPES,

  getPotencyCombatBonus,
  getFortitudeCombatBonus,
  getCelerityCombatBonus,

  getFeralClawsState,
  getActiveNaturalWeapon,

  getEffectiveStrength,

  getMeleeDamagePool,
  getFeralClawsDamagePool,

  getSoakPool,
  getArmorSoakFromInventory,
  getCharacterSoakPool,

  getDisciplineCombatState,

  consumeCelerityAction,
  retractFeralClaws,
}