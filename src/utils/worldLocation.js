const FALLBACK_LOCATION = {
  id: 'centro',
  name: 'Centro',
  district: 'Centro',
}

export function isTransientPoliceLocation(location) {
  const id =
    typeof location === 'string'
      ? location
      : location?.id

  return Boolean(
    id === 'street_after_police' ||
    id?.startsWith('street_police_')
  )
}

export function resolveNarrativeLocation(
  currentLocation,
  sceneLocation
) {
  if (
    isTransientPoliceLocation(
      sceneLocation
    )
  ) {
    return currentLocation ?? null
  }

  return sceneLocation ?? currentLocation ?? null
}

export function recoverPoliceLocation(
  savedLocation,
  policeReturnLocation
) {
  if (
    !isTransientPoliceLocation(
      savedLocation
    )
  ) {
    return savedLocation
  }

  return (
    policeReturnLocation ??
    FALLBACK_LOCATION
  )
}
