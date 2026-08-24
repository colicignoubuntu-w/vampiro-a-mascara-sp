import {
  getArmor,
  getWeapon,
} from '../data/items'

export function normalizeInventory(
  game
) {
  const inventory =
    Array.isArray(
      game?.inventory
    )
      ? game.inventory
      : []

  return {
    ...game,

    inventory,

    equipment: {
      weapon:
        game?.equipment
          ?.weapon ??
        'fists',

      armor:
        game?.equipment
          ?.armor ??
        'none',
    },

    weaponState: {
      ...(game?.weaponState ??
        {}),
    },
  }
}

export function addInventoryItem(
  game,
  item
) {
  const normalized =
    normalizeInventory(
      game
    )

  const existingIndex =
    normalized.inventory
      .findIndex(
        (entry) =>
          entry.id ===
          item.id
      )

  if (
    existingIndex >= 0
  ) {
    const inventory = [
      ...normalized.inventory,
    ]

    inventory[
      existingIndex
    ] = {
      ...inventory[
        existingIndex
      ],

      quantity:
        (
          inventory[
            existingIndex
          ].quantity ??
          1
        ) +
        (
          item.quantity ??
          1
        ),
    }

    return {
      ...normalized,

      inventory,
    }
  }

  return {
    ...normalized,

    inventory: [
      ...normalized.inventory,

      {
        ...item,

        quantity:
          item.quantity ??
          1,
      },
    ],
  }
}

export function hasInventoryItem(
  game,
  itemId
) {
  return Boolean(
    game?.inventory
      ?.some(
        (item) =>
          item.id ===
            itemId &&
          (
            item.quantity ??
            1
          ) > 0
      )
  )
}

export function equipWeapon(
  game,
  weaponId
) {
  const normalized =
    normalizeInventory(
      game
    )

  const weapon =
    getWeapon(
      weaponId
    )

  if (!weapon) {
    return {
      success: false,
      game,
    }
  }

  if (
    weaponId !==
      'fists' &&
    !hasInventoryItem(
      normalized,
      weaponId
    )
  ) {
    return {
      success: false,
      game,
    }
  }

  let updatedGame = {
    ...normalized,

    equipment: {
      ...normalized
        .equipment,

      weapon:
        weaponId,
    },
  }

  /*
    Inicializa o carregador na primeira
    vez que uma arma de fogo é usada.
  */

  if (
    weapon.category ===
      'firearm' &&
    typeof updatedGame
      ?.weaponState
      ?.[weaponId]
      ?.ammo !==
      'number'
  ) {
    updatedGame = {
      ...updatedGame,

      weaponState: {
        ...(updatedGame
          .weaponState ??
          {}),

        [weaponId]: {
          ammo:
            weapon.ammunition
              ?.magazine ??
            0,
        },
      },
    }
  }

  return {
    success: true,

    game:
      updatedGame,
  }
}

export function equipArmor(
  game,
  armorId
) {
  const normalized =
    normalizeInventory(
      game
    )

  const armor =
    getArmor(
      armorId
    )

  if (!armor) {
    return {
      success: false,
      game,
    }
  }

  if (
    armorId !==
      'none' &&
    !hasInventoryItem(
      normalized,
      armorId
    )
  ) {
    return {
      success: false,
      game,
    }
  }

  return {
    success: true,

    game: {
      ...normalized,

      equipment: {
        ...normalized
          .equipment,

        armor:
          armorId,
      },
    },
  }
}

export function giveCombatTestItems(
  game
) {
  let updatedGame =
    normalizeInventory(
      game
    )

  const items = [
    {
      id:
        'baseballBat',
      category:
        'weapon',
      quantity: 1,
    },

    {
      id:
        'knife',
      category:
        'weapon',
      quantity: 1,
    },

    {
      id:
        'stake',
      category:
        'weapon',
      quantity: 2,
    },

    {
      id:
        'revolver38',
      category:
        'weapon',
      quantity: 1,
    },

    {
      id:
        'pistol9mm',
      category:
        'weapon',
      quantity: 1,
    },

    {
      id:
        'shotgun',
      category:
        'weapon',
      quantity: 1,
    },

    {
      id:
        'ballisticVest',
      category:
        'armor',
      quantity: 1,
    },

    {
      id:
        'ammo38',
      category:
        'ammunition',
      quantity: 24,
    },

    {
      id:
        'ammo9mm',
      category:
        'ammunition',
      quantity: 45,
    },

    {
      id:
        'ammo12Gauge',
      category:
        'ammunition',
      quantity: 15,
    },
  ]

  items.forEach(
    (item) => {
      if (
        item.category ===
        'ammunition'
      ) {
        updatedGame =
          addInventoryItem(
            updatedGame,
            item
          )

        return
      }

      if (
        !hasInventoryItem(
          updatedGame,
          item.id
        )
      ) {
        updatedGame =
          addInventoryItem(
            updatedGame,
            item
          )
      }
    }
  )

  return updatedGame
}