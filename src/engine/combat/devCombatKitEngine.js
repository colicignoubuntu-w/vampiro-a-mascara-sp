import {
  getAllWeapons,
  getAmmoByType,
} from '../../data/items'

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

function addInventoryItem(
  inventory,
  newItem
) {
  const index =
    inventory.findIndex(
      (item) =>
        item.id ===
        newItem.id
    )

  if (
    index === -1
  ) {
    return [
      ...inventory,
      newItem,
    ]
  }

  return inventory.map(
    (
      item,
      itemIndex
    ) => {
      if (
        itemIndex !==
        index
      ) {
        return item
      }

      return {
        ...item,

        ...newItem,

        quantity:
          Math.max(
            safeNumber(
              item.quantity,
              1
            ),

            safeNumber(
              newItem.quantity,
              1
            )
          ),
      }
    }
  )
}

export function grantDevCombatArsenal(
  game,
  ammoQuantity = 60
) {
  if (!game) {
    return game
  }

  let inventory = [
    ...(game.inventory ??
      []),
  ]

  let weaponState = {
    ...(game.weaponState ??
      {}),
  }

  const weapons =
    getAllWeapons()
      .filter(
        (weapon) =>
          ![
            'fists',
            'kick',
            'vampireBite',
            'claws',
          ].includes(
            weapon.id
          ) &&
          weapon.category !==
            'natural'
      )

  for (
    const weapon of weapons
  ) {
    inventory =
      addInventoryItem(
        inventory,
        {
          id:
            weapon.id,

          name:
            weapon.name,

          type:
            'weapon',

          quantity: 1,
        }
      )

    if (
      weapon.category !==
      'firearm'
    ) {
      continue
    }

    const magazine =
      Math.max(
        0,
        safeNumber(
          weapon.ammunition
            ?.magazine,
          0
        )
      )

    weaponState = {
      ...weaponState,

      [weapon.id]: {
        ...(weaponState[
          weapon.id
        ] ??
          {}),

        ammo:
          magazine,
      },
    }

    const ammoType =
      weapon.ammunition
        ?.ammoType

    const ammoDefinition =
      getAmmoByType(
        ammoType
      )

    if (!ammoDefinition) {
      continue
    }

    inventory =
      addInventoryItem(
        inventory,
        {
          ...ammoDefinition,

          quantity:
            ammoQuantity,
        }
      )
  }

  return {
    ...game,

    inventory,

    weaponState,

    history: [
      ...(game.history ??
        []),

      {
        type:
          'dev-combat-arsenal',

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

export function grantDevAmmo(
  game,
  quantity = 60
) {
  if (!game) {
    return game
  }

  let inventory = [
    ...(game.inventory ??
      []),
  ]

  const ammoTypes =
    new Set(
      getAllWeapons()
        .filter(
          (weapon) =>
            weapon.category ===
              'firearm'
        )
        .map(
          (weapon) =>
            weapon.ammunition
              ?.ammoType
        )
        .filter(
          Boolean
        )
    )

  for (
    const ammoType of
    ammoTypes
  ) {
    const ammo =
      getAmmoByType(
        ammoType
      )

    if (!ammo) {
      continue
    }

    inventory =
      addInventoryItem(
        inventory,
        {
          ...ammo,

          quantity,
        }
      )
  }

  return {
    ...game,

    inventory,
  }
}

export default {
  grantDevCombatArsenal,
  grantDevAmmo,
}