const LOCATION_VISUALS = {
  malkavian_hospital: {
    background:
      '/images/hospital-abandonado/hospital-interior.png',
  },

  malkavian_hospital_corridor: {
    background:
      '/images/hospital-abandonado/hospital-interior.png',
    characters: {
      Desconhecido: {
        src:
          '/images/npcs/jack/portrait.png',
        alt: 'Homem desconhecido',
      },
    },
  },

  camarilla_court: {
    background:
      '/images/teatro-municipal/teatro-municipal-interior.png',
  },
}

export function getLocationVisual(
  locationId
) {
  return (
    LOCATION_VISUALS[locationId] ??
    null
  )
}

export default LOCATION_VISUALS
