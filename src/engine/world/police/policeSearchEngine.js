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

function normalizeText(
  value
) {
  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
}

function containsAny(
  text,
  terms
) {
  const normalized =
    normalizeText(
      text
    )

  return terms.some(
    (term) =>
      normalized.includes(
        normalizeText(
          term
        )
      )
  )
}

/*
  ========================================
  CLASSIFICAÇÃO POLICIAL

  Isso é uma classificação narrativa
  para o RPG.

  Não representa legislação real.
  ========================================
*/

const ITEM_RULES = [
  {
    id:
      'firearm',

    severity:
      4,

    terms: [
      'pistola',
      'revolver',
      'revólver',
      'gun',
      'firearm',
      '9mm',
      '38',
    ],

    label:
      'Arma de fogo',

    description:
      'Uma arma de fogo durante uma abordagem muda imediatamente o nível de atenção dos policiais.',
  },

  {
    id:
      'stake',

    severity:
      3,

    terms: [
      'estaca',
      'stake',
    ],

    label:
      'Estaca',

    description:
      'Uma estaca de madeira é incomum e pode exigir uma explicação convincente.',
  },

  {
    id:
      'large_blade',

    severity:
      3,

    terms: [
      'facão',
      'facao',
      'machado',
      'axe',
      'machete',
    ],

    label:
      'Arma branca grande',

    description:
      'Um objeto cortante de grande porte chama atenção imediata.',
  },

  {
    id:
      'knife',

    severity:
      2,

    terms: [
      'faca',
      'knife',
      'canivete',
    ],

    label:
      'Faca',

    description:
      'Uma lâmina pode aumentar a suspeita dependendo do contexto.',
  },

  {
    id:
      'blunt_weapon',

    severity:
      2,

    terms: [
      'taco',
      'bastao',
      'bastão',
      'bat',
      'cassetete',
    ],

    label:
      'Objeto contundente',

    description:
      'O objeto pode ser interpretado como arma dependendo da situação.',
  },

  {
    id:
      'ammunition',

    severity:
      2,

    terms: [
      'municao',
      'munição',
      'ammo',
      'cartucho',
      'balas',
    ],

    label:
      'Munição',

    description:
      'Munição encontrada durante uma revista pode levar os policiais a procurar uma arma.',
  },

  {
    id:
      'armor',

    severity:
      2,

    terms: [
      'colete',
      'bulletproof',
      'armadura',
    ],

    label:
      'Colete balístico',

    description:
      'Um colete balístico pode aumentar a suspeita sobre o que o personagem estava fazendo.',
  },
]

function getInventoryArray(
  game
) {
  const inventory =
    game?.inventory

  if (
    Array.isArray(
      inventory
    )
  ) {
    return inventory
  }

  if (
    inventory &&
    typeof inventory ===
      'object'
  ) {
    return Object.values(
      inventory
    )
  }

  return []
}

function getItemName(
  item
) {
  if (
    typeof item ===
    'string'
  ) {
    return item
  }

  return (
    item?.name ??
    item?.label ??
    item?.title ??
    item?.id ??
    'Item desconhecido'
  )
}

function getItemId(
  item,
  index
) {
  if (
    typeof item ===
    'string'
  ) {
    return (
      `${normalizeText(item)
        .replace(
          /\s+/g,
          '-'
        )}-${index}`
    )
  }

  return (
    item?.id ??
    item?.itemId ??
    `inventory-item-${index}`
  )
}

function getItemQuantity(
  item
) {
  if (
    typeof item ===
    'string'
  ) {
    return 1
  }

  return Math.max(
    1,
    safeNumber(
      item?.quantity ??
      item?.amount ??
      1,
      1
    )
  )
}

function classifyItem(
  item
) {
  const itemName =
    getItemName(
      item
    )

  const itemId =
    typeof item ===
      'object'
      ? item?.id
      : ''

  const itemType =
    typeof item ===
      'object'
      ? (
          item?.type ??
          item?.category ??
          item?.weaponType ??
          ''
        )
      : ''

  const searchText =
    `${itemName} ${itemId} ${itemType}`

  /*
    Tenta aproveitar metadados
    já existentes no inventário.
  */

  if (
    item?.type ===
      'weapon' &&
    item?.category ===
      'firearm'
  ) {
    return {
      ...ITEM_RULES[0],
    }
  }

  for (
    const rule of ITEM_RULES
  ) {
    if (
      containsAny(
        searchText,
        rule.terms
      )
    ) {
      return {
        ...rule,
      }
    }
  }

  return {
    id:
      'ordinary',

    severity: 0,

    label:
      'Objeto comum',

    description:
      'O objeto não parece particularmente relevante para a abordagem.',
  }
}

export function inspectInventoryForPolice(
  game
) {
  const inventory =
    getInventoryArray(
      game
    )

  return inventory.map(
    (
      item,
      index
    ) => {
      const classification =
        classifyItem(
          item
        )

      return {
        inventoryId:
          getItemId(
            item,
            index
          ),

        name:
          getItemName(
            item
          ),

        quantity:
          getItemQuantity(
            item
          ),

        classification:
          classification.id,

        classificationLabel:
          classification.label,

        severity:
          classification.severity,

        description:
          classification.description,

        original:
          item,
      }
    }
  )
}

export function getPoliceSearchSummary(
  game
) {
  const items =
    inspectInventoryForPolice(
      game
    )

  const suspiciousItems =
    items.filter(
      (item) =>
        item.severity > 0
    )

  const highestSeverity =
    suspiciousItems.reduce(
      (
        highest,
        item
      ) =>
        Math.max(
          highest,
          item.severity
        ),
      0
    )

  const firearms =
    suspiciousItems.filter(
      (item) =>
        item.classification ===
        'firearm'
    )

  const stakes =
    suspiciousItems.filter(
      (item) =>
        item.classification ===
        'stake'
    )

  return {
    items,

    suspiciousItems,

    suspiciousCount:
      suspiciousItems.length,

    highestSeverity,

    hasSuspiciousItems:
      suspiciousItems.length >
      0,

    hasFirearm:
      firearms.length > 0,

    hasStake:
      stakes.length > 0,

    dangerLevel:
      getPoliceDangerLevel(
        highestSeverity
      ),
  }
}

export function getPoliceDangerLevel(
  severity
) {
  const value =
    safeNumber(
      severity,
      0
    )

  if (
    value >= 4
  ) {
    return 'critical'
  }

  if (
    value >= 3
  ) {
    return 'high'
  }

  if (
    value >= 2
  ) {
    return 'medium'
  }

  if (
    value >= 1
  ) {
    return 'low'
  }

  return 'none'
}

export function getPoliceDangerLabel(
  dangerLevel
) {
  const labels = {
    none:
      'Nenhum problema evidente',

    low:
      'Suspeita baixa',

    medium:
      'Situação delicada',

    high:
      'Situação grave',

    critical:
      'Situação crítica',
  }

  return (
    labels[
      dangerLevel
    ] ??
    'Desconhecido'
  )
}

export function createPoliceSearch(
  game
) {
  const summary =
    getPoliceSearchSummary(
      game
    )

  return {
    id:
      `police-search-${Date.now()}`,

    status:
      'active',

    phase:
      'search',

    result:
      null,

    items:
      summary.items,

    suspiciousItems:
      summary.suspiciousItems,

    highestSeverity:
      summary.highestSeverity,

    dangerLevel:
      summary.dangerLevel,

    hasFirearm:
      summary.hasFirearm,

    hasStake:
      summary.hasStake,

    log: [
      {
        type:
          'police',

        text:
          'O policial inicia a revista.',
      },
    ],
  }
}

export function resolvePoliceSearch(
  game,
  search
) {
  if (
    !game ||
    !search
  ) {
    return {
      game,
      search,
    }
  }

  const suspiciousItems =
    search.suspiciousItems ??
    []

  /*
    ========================================
    NADA SUSPEITO
    ========================================
  */

  if (
    suspiciousItems.length ===
    0
  ) {
    const updatedSearch = {
      ...search,

      status:
        'finished',

      result:
        'clear',

      log: [
        ...(search.log ??
          []),

        {
          type:
            'success',

          text:
            'O policial termina a revista sem encontrar nada que desperte atenção imediata.',
        },
      ],
    }

    const updatedGame = {
      ...game,

      flags: {
        ...(game.flags ??
          {}),

        policeSearchClear:
          true,
      },

      history: [
        ...(game.history ??
          []),

        {
          type:
            'police-search',

          result:
            'clear',

          suspiciousItems: [],

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    return {
      game:
        updatedGame,

      search:
        updatedSearch,
    }
  }

  /*
    ========================================
    ALGO SUSPEITO
    ========================================
  */

  const foundNames =
    suspiciousItems.map(
      (item) =>
        item.name
    )

  const critical =
    search.dangerLevel ===
      'critical'

  const high =
    search.dangerLevel ===
      'high'

  let result =
    'suspicious'

  if (
    critical
  ) {
    result =
      'critical'
  } else if (
    high
  ) {
    result =
      'serious'
  }

  const updatedSearch = {
    ...search,

    status:
      'finished',

    result,

    log: [
      ...(search.log ??
        []),

      {
        type:
          'found',

        text:
          `O policial encontra: ${foundNames.join(', ')}.`,
      },

      {
        type:
          result,

        text:
          getResultText(
            result
          ),
      },
    ],
  }

  const updatedGame = {
    ...game,

    flags: {
      ...(game.flags ??
        {}),

      policeFoundSuspiciousItem:
        true,

      policeFoundWeapon:
        suspiciousItems.some(
          (item) =>
            [
              'firearm',
              'knife',
              'large_blade',
              'stake',
              'blunt_weapon',
            ].includes(
              item.classification
            )
        ),

      policeFoundFirearm:
        Boolean(
          search.hasFirearm
        ),

      policeFoundStake:
        Boolean(
          search.hasStake
        ),

      policeEscalation:
        result ===
          'critical' ||
        result ===
          'serious',

      possibleMasqueradeRisk:
        result ===
          'critical'
          ? true
          : Boolean(
              game.flags
                ?.possibleMasqueradeRisk
            ),
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'police-search',

        result,

        dangerLevel:
          search.dangerLevel,

        suspiciousItems:
          suspiciousItems.map(
            (item) => ({
              id:
                item.inventoryId,

              name:
                item.name,

              classification:
                item.classification,

              severity:
                item.severity,
            })
          ),

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    game:
      updatedGame,

    search:
      updatedSearch,
  }
}

function getResultText(
  result
) {
  if (
    result ===
    'critical'
  ) {
    return (
      'A descoberta muda completamente o tom da abordagem. Os policiais passam a tratar você como uma ameaça potencial.'
    )
  }

  if (
    result ===
    'serious'
  ) {
    return (
      'O objeto exige uma explicação e aumenta significativamente a tensão da abordagem.'
    )
  }

  return (
    'O policial demonstra interesse no objeto e começa a fazer mais perguntas.'
  )
}

export function getPoliceSearchNextScene(
  search
) {
  if (!search) {
    return null
  }

  switch (
    search.result
  ) {
    case 'clear':
      return 'police_released'

    case 'critical':
      return 'police_weapon_found'

    case 'serious':
      return 'police_weapon_questions'

    case 'suspicious':
      return 'police_item_questions'

    default:
      return null
  }
}