const ammunition = {
  ammo38: {
    id: 'ammo38',
    name: 'Munição .38',
    category: 'ammunition',
    ammoType: '.38',
  },

  ammo9mm: {
    id: 'ammo9mm',
    name: 'Munição 9mm',
    category: 'ammunition',
    ammoType: '9mm',
  },

  ammo12Gauge: {
    id: 'ammo12Gauge',
    name: 'Cartucho Calibre 12',
    category: 'ammunition',
    ammoType: '12 gauge',
  },
}

export function getAmmunition(
  ammoId
) {
  return (
    ammunition[ammoId] ??
    null
  )
}

export function getAmmoByType(
  ammoType
) {
  return (
    Object.values(
      ammunition
    ).find(
      (ammo) =>
        ammo.ammoType ===
        ammoType
    ) ?? null
  )
}

export function getAllAmmunition() {
  return Object.values(
    ammunition
  )
}

export default ammunition