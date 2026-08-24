import {
  getArmor,
} from '../../data/items/armor'

export const DAMAGE_TYPES = {
  bashing: {
    id: 'bashing',

    label: 'Contusão',

    symbol: '/',

    description:
      'Trauma contundente como socos, chutes, quedas e tacos.',
  },

  lethal: {
    id: 'lethal',

    label: 'Letal',

    symbol: 'X',

    description:
      'Ferimentos causados por lâminas, tiros e outros ataques capazes de provocar dano grave.',
  },

  aggravated: {
    id: 'aggravated',

    label: 'Agravado',

    symbol: '*',

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

export function normalizeHealth(
  health
) {
  /*
    Converte saves antigos que tinham
    apenas currentLevel para o novo
    formato.

    Assim não precisamos recriar
    o personagem.
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

export function getArmorProtection({
  armorId,
  damageType,
  sourceType,
}) {
  const equippedArmor =
    getArmor(
      armorId
    )

  let protection =
    safeNumber(
      equippedArmor
        ?.protection
        ?.[damageType],
      0
    )

  /*
    Colete balístico recebe bônus
    específico contra armas de fogo.
  */

  if (
    sourceType ===
      'firearm' &&
    equippedArmor.firearmBonus
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

    protection,
  }
}

export function getSoakPool({
  targetType,
  stamina,
  armorId,
  damageType,
  sourceType,
}) {
  const safeStamina =
    Math.max(
      0,
      safeNumber(
        stamina,
        0
      )
    )

  const armorData =
    getArmorProtection({
      armorId,
      damageType,
      sourceType,
    })

  let staminaSoak = 0

  /*
    CONTUSÃO

    Vampiros e humanos podem usar
    Vigor normalmente.
  */

  if (
    damageType ===
    'bashing'
  ) {
    staminaSoak =
      safeStamina
  }

  /*
    LETAL

    Vampiros podem usar Vigor.

    Humanos dependem principalmente
    de armadura.
  */

  if (
    damageType ===
    'lethal'
  ) {
    staminaSoak =
      targetType ===
      'vampire'
        ? safeStamina
        : 0
  }

  /*
    AGRAVADO

    Vigor comum não absorve.

    Armaduras normais também não,
    salvo se futuramente criarmos
    equipamento sobrenatural.
  */

  if (
    damageType ===
    'aggravated'
  ) {
    staminaSoak = 0
  }

  return {
    staminaSoak,

    armorSoak:
      armorData.protection,

    total:
      staminaSoak +
      armorData.protection,

    armor:
      armorData.armor,
  }
}

export function convertDamageForTarget({
  targetType,
  damageType,
  sourceType,
}) {
  /*
    Regra vampírica para tiros.

    Contra vampiros, armas de fogo
    são tratadas como contusão no
    sistema de Vitalidade.

    Isso deixa tiros perigosos, mas
    menos decisivos que fogo, sol,
    garras sobrenaturais etc.
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
    Agravado primeiro,
    depois letal,
    depois contusão.

    Isso deixa a visualização
    consistente.
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

      symbol: '',
    })
  }

  return slots.slice(
    0,
    maximum
  )
}

export function isIncapacitated(
  health
) {
  return (
    getTotalDamage(
      health
    ) >= 7
  )
}

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