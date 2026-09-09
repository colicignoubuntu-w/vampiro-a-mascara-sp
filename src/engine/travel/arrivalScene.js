function getLiviaApartmentScene(
  currentGame
) {
  const questStatus =
    currentGame?.quests
      ?.livia_legacy
      ?.status

  const hospitalDiscovered =
    Boolean(
      currentGame?.flags
        ?.discoveredHospitalConnection ||
      currentGame?.flags
        ?.liviaHospitalConnection
    )

  const alreadyVisited =
    Boolean(
      currentGame?.flags
        ?.visitedLiviaApartment
    )

  /*
    ========================================
    REFÚGIO JÁ ESTABELECIDO
    ========================================

    Depois que a investigação principal
    avançou, não usamos mais a cena
    narrativa livia_apartment_haven.

    Vamos direto para free_roam mantendo
    a localização no apartamento.

    O Game.jsx então renderiza o componente
    Haven automaticamente.
  */

  if (
    questStatus ===
      'completed' ||
    hospitalDiscovered
  ) {
    return 'free_roam'
  }

  /*
    O jogador já entrou anteriormente,
    mas ainda não terminou a investigação.
  */

  if (
    alreadyVisited
  ) {
    return 'livia_apartment_inside'
  }

  /*
    Primeira visita.
  */

  return 'livia_apartment_arrival'
}

export function getTravelArrivalScene(currentGame, destination) {
  if (destination.id === 'asylum') return 'asylum_lobby'
  if (destination.id === 'livia_apartment') return getLiviaApartmentScene(currentGame)
  let arrivalScene =
    destination.arrivalScene ?? 'free_roam'

  if (
    destination.id === 'mercurio_apartment' &&
    currentGame?.flags?.astroliteRecovered
  ) {
    arrivalScene = 'mercurio_return'
  }

  if (
    destination.id === 'vesuvius' &&
    currentGame?.flags?.adderIdentified &&
    !currentGame?.flags?.hatterScriptDestroyed
  ) {
    arrivalScene = 'vesuvius_hatter_return'
  }

  return arrivalScene

}
