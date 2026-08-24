import {
  getAmmoByType,
  getWeapon,
} from '../../data/items'

function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value)

  return Number.isNaN(number)
    ? fallback
    : number
}

export function getWeaponMagazineSize(
  weaponId
) {
  const weapon =
    getWeapon(
      weaponId
    )

  if (
    !weapon ||
    weapon.category !==
      'firearm'
  ) {
    return 0
  }

  return safeNumber(
    weapon.ammunition
      ?.magazine,
    0
  )
}

export function getLoadedAmmo(
  game,
  weaponId
) {
  const weapon =
    getWeapon(
      weaponId
    )

  if (
    !weapon ||
    weapon.category !==
      'firearm'
  ) {
    return 0
  }

  const saved =
    game?.weaponState
      ?.[weaponId]
      ?.ammo

  if (
    typeof saved ===
    'number'
  ) {
    return saved
  }

  return safeNumber(
    weapon.ammunition
      ?.current ??
      weapon.ammunition
        ?.magazine,
    0
  )
}

export function getReserveAmmo(
  game,
  ammoType
) {
  if (!ammoType) {
    return 0
  }

  const ammoDefinition =
    getAmmoByType(
      ammoType
    )

  if (!ammoDefinition) {
    return 0
  }

  const inventoryItem =
    game?.inventory
      ?.find(
        (item) =>
          item.id ===
          ammoDefinition.id
      )

  return Math.max(
    0,
    safeNumber(
      inventoryItem
        ?.quantity,
      0
    )
  )
}

export function canFireWeapon(
  game,
  weaponId
) {
  const weapon =
    getWeapon(
      weaponId
    )

  if (!weapon) {
    return false
  }

  if (
    weapon.category !==
    'firearm'
  ) {
    return true
  }

  return (
    getLoadedAmmo(
      game,
      weaponId
    ) > 0
  )
}

export function consumeAmmo(
  game,
  weaponId,
  amount = 1
) {
  const weapon =
    getWeapon(
      weaponId
    )

  if (
    !weapon ||
    weapon.category !==
      'firearm'
  ) {
    return {
      success: true,
      game,
      consumed: 0,
    }
  }

  const current =
    getLoadedAmmo(
      game,
      weaponId
    )

  const requested =
    Math.max(
      1,
      safeNumber(
        amount,
        1
      )
    )

  if (
    current <
    requested
  ) {
    return {
      success: false,
      game,
      consumed: 0,
    }
  }

  const updatedGame = {
    ...game,

    weaponState: {
      ...(game.weaponState ??
        {}),

      [weaponId]: {
        ...(game.weaponState
          ?.[weaponId] ??
          {}),

        ammo:
          current -
          requested,
      },
    },
  }

  return {
    success: true,

    game:
      updatedGame,

    consumed:
      requested,
  }
}

function removeReserveAmmo({
  game,
  ammoId,
  amount,
}) {
  const inventory =
    Array.isArray(
      game?.inventory
    )
      ? game.inventory
      : []

  const updatedInventory =
    inventory
      .map(
        (item) => {
          if (
            item.id !==
            ammoId
          ) {
            return item
          }

          return {
            ...item,

            quantity:
              Math.max(
                0,
                safeNumber(
                  item.quantity,
                  0
                ) -
                  amount
              ),
          }
        }
      )
      .filter(
        (item) =>
          (
            item.quantity ??
            0
          ) > 0
      )

  return {
    ...game,

    inventory:
      updatedInventory,
  }
}

export function reloadWeapon(
  game,
  weaponId
) {
  const weapon =
    getWeapon(
      weaponId
    )

  if (
    !weapon ||
    weapon.category !==
      'firearm'
  ) {
    return {
      success: false,

      reason:
        'not-firearm',

      game,

      loaded: 0,
    }
  }

  const magazine =
    getWeaponMagazineSize(
      weaponId
    )

  const current =
    getLoadedAmmo(
      game,
      weaponId
    )

  if (
    current >=
    magazine
  ) {
    return {
      success: false,

      reason:
        'already-full',

      game,

      loaded: 0,
    }
  }

  const ammoType =
    weapon.ammunition
      ?.ammoType

  const ammoDefinition =
    getAmmoByType(
      ammoType
    )

  if (!ammoDefinition) {
    return {
      success: false,

      reason:
        'ammo-not-defined',

      game,

      loaded: 0,
    }
  }

  const reserve =
    getReserveAmmo(
      game,
      ammoType
    )

  if (
    reserve <= 0
  ) {
    return {
      success: false,

      reason:
        'no-reserve',

      game,

      loaded: 0,
    }
  }

  const missing =
    magazine -
    current

  const amountToLoad =
    Math.min(
      missing,
      reserve
    )

  let updatedGame =
    removeReserveAmmo({
      game,

      ammoId:
        ammoDefinition.id,

      amount:
        amountToLoad,
    })

  updatedGame = {
    ...updatedGame,

    weaponState: {
      ...(updatedGame
        .weaponState ??
        {}),

      [weaponId]: {
        ...(updatedGame
          .weaponState
          ?.[weaponId] ??
          {}),

        ammo:
          current +
          amountToLoad,
      },
    },

    history: [
      ...(updatedGame
        .history ??
        []),

      {
        type:
          'weapon-reload',

        weaponId,

        ammoType,

        loaded:
          amountToLoad,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }

  return {
    success: true,

    reason: null,

    game:
      updatedGame,

    loaded:
      amountToLoad,
  }
}