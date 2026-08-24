import {
  getArmor,
} from '../../data/items/armor'

export const DAMAGE_TYPES = {
  bashing: {
    id:
      'bashing',

    label:
      'Contusão',

    symbol:
      '/',

    description:
      'Trauma contundente como socos, chutes, quedas e tacos.',
  },

  lethal: {
    id:
      'lethal',

    label:
      'Letal',

    symbol:
      'X',

    description:
      'Ferimentos causados por lâminas, tiros e outros ataques capazes de provocar dano grave.',
  },

  aggravated: {
    id:
      'aggravated',

    label:
      'Agravado',

    symbol:
      '*',

    description:
      'Dano sobrenatural ou extremamente perigoso para vampiros, como fogo, luz solar e certos ataques sobrenaturais.',
  },
}

function safeNumber(
  value,
  fallback = 0
) {
  const result =
    Number(value)

  return Number.isNaN(
    result
  )
    ? fallback
    : result
}

/*
  ========================================
  NORMALIZAR VITALIDADE
  ========================================
*/

export function normalizeHealth(
  health
) {
  /*
    Compatibilidade com saves antigos
    que possuíam apenas currentLevel.
  */

  if (
    health &&
    typeof health.bashing ===
      'number' &&
    typeof health.lethal ===
      'number' &&
    typeof health.aggravated ===
      'number'
  ) {
    return {
      ...health,
    }
  }

  const oldDamage =
    Math.max(
      0,
      safeNumber(
        health?.currentLevel,
        0
      )
    )

  return {
    ...(health ?? {}),

    bashing:
      oldDamage,

    lethal: 0,

    aggravated: 0,

    currentLevel:
      oldDamage,
  }
}

/*
  ========================================
  DANO TOTAL
  ========================================
*/

export function getTotalDamage(
  health
) {
  const normalized =
    normalizeHealth(
      health
    )

  return (
    normalized.bashing +
    normalized.lethal +
    normalized.aggravated
  )
}

/*
  ========================================
  SÍMBOLO DE DANO
  ========================================
*/

export function getDamageSymbol(
  damageType
) {
  return (
    DAMAGE_TYPES[
      damageType
    ]?.symbol ??
    '?'
  )
}

/*
  ========================================
  PROTEÇÃO DA ARMADURA
  ========================================
*/

export function getArmorProtection({
  armorId,
  damageType,
  sourceType,
  supernaturalArmor = false,
}) {
  const equippedArmor =
    getArmor(
      armorId
    )

  /*
    Armaduras comuns não absorvem
    dano agravado.

    No futuro poderemos cadastrar
    equipamentos sobrenaturais usando:
      supernaturalArmor: true

    ou proteção agravada explícita.
  */

  if (
    damageType ===
      'aggravated' &&
    !supernaturalArmor &&
    !equippedArmor
      ?.supernatural
  ) {
    return {
      armor:
        equippedArmor,

      protection: 0,
    }
  }

  let protection =
    safeNumber(
      equippedArmor
        ?.protection
        ?.[damageType],
      0
    )

  /*
    Colete balístico recebe bônus
    específico contra arma de fogo.
  */

  if (
    sourceType ===
      'firearm' &&
    equippedArmor
      ?.firearmBonus
  ) {
    protection +=
      safeNumber(
        equippedArmor.firearmBonus,
        0
      )
  }

  return {
    armor:
      equippedArmor,

    protection:
      Math.max(
        0,
        protection
      ),
  }
}

/*
  ========================================
  ABSORÇÃO
  ========================================

  targetType:
    human
    vampire
    supernatural

  fortitude:
    número de pontos de Fortitude.

  REGRAS DO NOSSO MOTOR:

  CONTUSÃO
  Vampiro:
    Vigor + Fortitude + armadura

  Humano:
    Vigor + armadura

  LETAL
  Vampiro:
    Vigor + Fortitude + armadura

  Humano:
    armadura

  AGRAVADO
  Vampiro:
    Fortitude
    + eventual proteção sobrenatural

  Humano:
    normalmente sem Vigor.
  ========================================
*/

export function getSoakPool({
  targetType,
  stamina,
  armorId,
  damageType,
  sourceType,

  fortitude = 0,

  supernaturalArmor = false,
}) {
  const safeStamina =
    Math.max(
      0,
      safeNumber(
        stamina,
        0
      )
    )

  const safeFortitude =
    Math.max(
      0,
      safeNumber(
        fortitude,
        0
      )
    )

  const armorData =
    getArmorProtection({
      armorId,
      damageType,
      sourceType,
      supernaturalArmor,
    })

  let staminaSoak = 0

  let fortitudeSoak = 0

  /*
    ======================================
    CONTUSÃO
    ======================================
  */

  if (
    damageType ===
    'bashing'
  ) {
    staminaSoak =
      safeStamina

    if (
      targetType ===
        'vampire'
    ) {
      fortitudeSoak =
        safeFortitude
    }
  }

  /*
    ======================================
    LETAL
    ======================================

    Vampiros podem usar Vigor.

    Humanos normalmente dependem
    da armadura.
  */

  if (
    damageType ===
    'lethal'
  ) {
    if (
      targetType ===
        'vampire'
    ) {
      staminaSoak =
        safeStamina

      fortitudeSoak =
        safeFortitude
    }
  }

  /*
    ======================================
    AGRAVADO
    ======================================

    Vigor comum não conta.

    Vampiro com Fortitude pode usar
    os dados sobrenaturais de Fortitude.
  */

  if (
    damageType ===
    'aggravated'
  ) {
    staminaSoak = 0

    if (
      targetType ===
        'vampire'
    ) {
      fortitudeSoak =
        safeFortitude
    }
  }

  const armorSoak =
    Math.max(
      0,
      safeNumber(
        armorData.protection,
        0
      )
    )

  return {
    staminaSoak,

    fortitudeSoak,

    armorSoak,

    total:
      Math.max(
        0,
        staminaSoak +
          fortitudeSoak +
          armorSoak
      ),

    armor:
      armorData.armor,

    breakdown: {
      stamina:
        staminaSoak,

      fortitude:
        fortitudeSoak,

      armor:
        armorSoak,
    },
  }
}

/*
  ========================================
  CONVERSÃO DE DANO
  ========================================
*/

export function convertDamageForTarget({
  targetType,
  damageType,
  sourceType,
}) {
  /*
    Tiros contra vampiros.

    Armas de fogo normalmente produzem
    dano letal contra mortais, mas contra
    vampiros entram como contusão no nosso
    sistema de Vitalidade.
  */

  if (
    targetType ===
      'vampire' &&
    sourceType ===
      'firearm' &&
    damageType ===
      'lethal'
  ) {
    return 'bashing'
  }

  return damageType
}

/*
  ========================================
  ADICIONAR DANO
  ========================================
*/

export function addDamage({
  health,
  damageType,
  amount,
}) {
  const normalized =
    normalizeHealth(
      health
    )

  const safeAmount =
    Math.max(
      0,
      safeNumber(
        amount,
        0
      )
    )

  if (
    safeAmount <= 0
  ) {
    return normalized
  }

  if (
    !DAMAGE_TYPES[
      damageType
    ]
  ) {
    console.warn(
      'Tipo de dano desconhecido:',
      damageType
    )

    return normalized
  }

  const updated = {
    ...normalized,

    [damageType]:
      safeNumber(
        normalized[
          damageType
        ],
        0
      ) +
      safeAmount,
  }

  updated.currentLevel =
    getTotalDamage(
      updated
    )

  return updated
}

/*
  ========================================
  SLOT VISUAL DE VITALIDADE
  ========================================
*/

export function getDamageSlots(
  health,
  maximum = 7
) {
  const normalized =
    normalizeHealth(
      health
    )

  const slots = []

  /*
    Dano mais grave aparece primeiro.
  */

  for (
    let i = 0;
    i <
    normalized.aggravated;
    i += 1
  ) {
    slots.push({
      type:
        'aggravated',

      symbol:
        DAMAGE_TYPES
          .aggravated
          .symbol,
    })
  }

  for (
    let i = 0;
    i <
    normalized.lethal;
    i += 1
  ) {
    slots.push({
      type:
        'lethal',

      symbol:
        DAMAGE_TYPES
          .lethal
          .symbol,
    })
  }

  for (
    let i = 0;
    i <
    normalized.bashing;
    i += 1
  ) {
    slots.push({
      type:
        'bashing',

      symbol:
        DAMAGE_TYPES
          .bashing
          .symbol,
    })
  }

  while (
    slots.length <
    maximum
  ) {
    slots.push({
      type:
        'empty',

      symbol:
        '',
    })
  }

  return slots.slice(
    0,
    maximum
  )
}

/*
  ========================================
  INCAPACITADO
  ========================================
*/

export function isIncapacitated(
  health
) {
  return (
    getTotalDamage(
      health
    ) >= 7
  )
}

/*
  ========================================
  LIMPAR DANO
  ========================================
*/

export function clearAllDamage(
  health
) {
  return {
    ...(health ?? {}),

    bashing: 0,

    lethal: 0,

    aggravated: 0,

    currentLevel: 0,
  }
}

export default {
  DAMAGE_TYPES,

  normalizeHealth,
  getTotalDamage,
  getDamageSymbol,

  getArmorProtection,
  getSoakPool,

  convertDamageForTarget,

  addDamage,
  getDamageSlots,

  isIncapacitated,
  clearAllDamage,
}