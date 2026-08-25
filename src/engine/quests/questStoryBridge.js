import {
  completeQuest,
  completeQuestObjective,
  getQuestState,
  revealQuestObjective,
  startQuest,
} from './questEngine'

function completeObjectiveIfNeeded(
  game,
  questId,
  objectiveId
) {
  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !quest ||
    quest.status !==
      'active'
  ) {
    return game
  }

  if (
    quest.objectives
      ?.[objectiveId]
      ?.completed
  ) {
    return game
  }

  const result =
    completeQuestObjective(
      game,
      questId,
      objectiveId
    )

  return result.success
    ? result.game
    : game
}

function startQuestIfNeeded(
  game,
  questId
) {
  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    quest?.status ===
      'active' ||
    quest?.status ===
      'completed'
  ) {
    return game
  }

  const result =
    startQuest(
      game,
      questId
    )

  return result.success
    ? result.game
    : game
}

function finishQuestIfReady(
  game,
  questId
) {
  const quest =
    getQuestState(
      game,
      questId
    )

  if (
    !quest ||
    quest.status !==
      'active'
  ) {
    return game
  }

  const result =
    completeQuest(
      game,
      questId
    )

  return result.success
    ? result.game
    : game
}

/*
  ========================================
  O LEGADO DE LÍVIA
  ========================================
*/

function applyLiviaLegacyProgress(
  game
) {
  let updatedGame =
    game

  const sceneId =
    updatedGame?.story
      ?.scene ??
    null

  const flags =
    updatedGame?.flags ??
    {}

  /*
    Início automático.

    Assim que o personagem chega à parte
    da história em que Jack o leva para
    investigar o que Lívia deixou.
  */

  const shouldStartQuest =
    [
      'livia_apartment',
      'livia_apartment_entry',
      'livia_apartment_inside',
      'jack_livia_apartment',
    ].includes(
      sceneId
    ) ||
    Boolean(
      flags
        .liviaApartmentUnlocked
    )

  if (
    shouldStartQuest
  ) {
    updatedGame =
      startQuestIfNeeded(
        updatedGame,
        'livia_legacy'
      )
  }

  /*
    Chegou ao apartamento.
  */

  const reachedApartment =
    [
      'livia_apartment',
      'livia_apartment_entry',
      'livia_apartment_inside',
      'jack_livia_apartment',
    ].includes(
      sceneId
    ) ||
    Boolean(
      flags
        .visitedLiviaApartment
    )

  if (
    reachedApartment
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'livia_legacy',
        'reach_livia_apartment'
      )
  }

  /*
    Vasculhou o apartamento.
  */

  const searchedApartment =
    Boolean(
      flags
        .searchedLiviaApartment
    ) ||
    [
      'livia_apartment_search',
      'livia_room_search',
      'livia_belongings',
    ].includes(
      sceneId
    )

  if (
    searchedApartment
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'livia_legacy',
        'search_livia_apartment'
      )
  }

  /*
    Encontrou os diários.
  */

  const foundDiary =
    Boolean(
      flags
        .foundLiviaDiary
    ) ||
    Boolean(
      flags
        .liviaDiaryFound
    ) ||
    [
      'livia_diary',
      'livia_diaries',
      'livia_diary_found',
    ].includes(
      sceneId
    )

  if (
    foundDiary
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'livia_legacy',
        'find_livia_diary'
      )
  }

  /*
    Investigou o computador.
  */

  const inspectedComputer =
    Boolean(
      flags
        .inspectedLiviaComputer
    ) ||
    Boolean(
      flags
        .liviaComputerInvestigated
    ) ||
    [
      'livia_computer',
      'livia_computer_access',
      'livia_computer_files',
    ].includes(
      sceneId
    )

  if (
    inspectedComputer
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'livia_legacy',
        'inspect_livia_computer'
      )
  }

  /*
    Descobriu a ligação com hospitais.

    Esse objetivo começa oculto.
  */

  const discoveredHospitalConnection =
    Boolean(
      flags
        .discoveredHospitalConnection
    ) ||
    Boolean(
      flags
        .liviaHospitalConnection
    ) ||
    [
      'livia_hospital_clue',
      'hospital_connection_discovered',
    ].includes(
      sceneId
    )

  if (
    discoveredHospitalConnection
  ) {
    updatedGame =
      revealQuestObjective(
        updatedGame,
        'livia_legacy',
        'discover_hospital_connection'
      )

    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'livia_legacy',
        'discover_hospital_connection'
      )
  }

  updatedGame =
    finishQuestIfReady(
      updatedGame,
      'livia_legacy'
    )

  return updatedGame
}

/*
  ========================================
  PRIMEIRA CAÇADA
  ========================================
*/

function applyFirstHuntProgress(
  game
) {
  let updatedGame =
    game

  const sceneId =
    updatedGame?.story
      ?.scene ??
    null

  const flags =
    updatedGame?.flags ??
    {}

  const shouldStart =
    Boolean(
      flags
        .huntingUnlocked
    ) ||
    [
      'first_hunt',
      'hunting_start',
      'hunt_street',
    ].includes(
      sceneId
    )

  if (
    shouldStart
  ) {
    updatedGame =
      startQuestIfNeeded(
        updatedGame,
        'first_hunt'
      )
  }

  if (
    flags.foundFirstVictim
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'first_hunt',
        'find_first_victim'
      )
  }

  if (
    flags.approachedFirstVictim
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'first_hunt',
        'approach_first_victim'
      )
  }

  if (
    Boolean(
      flags
        .fedFirstTime
    ) ||
    Boolean(
      flags
        .completedFirstFeeding
    )
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'first_hunt',
        'feed_first_time'
      )
  }

  if (
    flags.firstVictimSurvived
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'first_hunt',
        'avoid_killing_first_victim'
      )
  }

  if (
    flags.firstHuntMasqueradeSafe
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'first_hunt',
        'avoid_masquerade_breach'
      )
  }

  updatedGame =
    finishQuestIfReady(
      updatedGame,
      'first_hunt'
    )

  return updatedGame
}

/*
  ========================================
  OS MORTOS NÃO DORMEM
  ========================================
*/

function applyStrangeHospitalsProgress(
  game
) {
  let updatedGame =
    game

  const sceneId =
    updatedGame?.story
      ?.scene ??
    null

  /*
    IMPORTANTE:

    Relemos as flags depois de cada
    alteração porque os helpers de quest
    podem devolver um novo objeto game.
  */

  let flags =
    updatedGame?.flags ??
    {}

  /*
    ----------------------------------------
    INÍCIO DA MISSÃO
    ----------------------------------------

    A missão começa quando o personagem
    descobre que as pistas deixadas por
    Lívia possuem relação com hospitais.

    Também aceitamos cenas posteriores
    para saves antigos que já tenham
    avançado na investigação.
  */

  const shouldStart =
    Boolean(
      flags
        .discoveredHospitalConnection
    ) ||
    Boolean(
      flags
        .liviaHospitalConnection
    ) ||
    Boolean(
      flags
        .hospitalDisappearancesInvestigated
    ) ||
    Boolean(
      flags
        .hospitalDisappearancePatternFound
    ) ||
    Boolean(
      flags
        .hospitalVictorIdentified
    ) ||
    Boolean(
      flags
        .hospitalVictorDiscovered
    ) ||
    Boolean(
      flags
        .hospitalVictorUnlocked
    ) ||
    Boolean(
      flags
        .investigatedHospitalVictor
    ) ||
    Boolean(
      flags
        .suspiciousAmbulanceDiscovered
    ) ||
    [
      'strange_hospitals_records',
      'strange_hospitals_pattern',
      'strange_hospitals_identified',
      'hospital_victor_arrival',
      'hospital_victor_exterior',
      'hospital_victor_ambulance_bay',
    ].includes(
      sceneId
    )

  if (
    shouldStart
  ) {
    updatedGame =
      startQuestIfNeeded(
        updatedGame,
        'strange_hospitals'
      )
  }

  flags =
    updatedGame?.flags ??
    {}

  /*
    ----------------------------------------
    OBJETIVO 1
    DESCOBRIR OS DESAPARECIMENTOS
    ----------------------------------------

    Ao começar a analisar os arquivos
    de Lívia, o personagem já descobriu
    que existe um conjunto real de
    desaparecimentos a investigar.
  */

  const learnedAboutDisappearances =
    Boolean(
      flags
        .hospitalDisappearancesInvestigated
    ) ||
    Boolean(
      flags
        .hospitalDisappearancePatternFound
    ) ||
    Boolean(
      flags
        .hospitalVictorIdentified
    ) ||
    Boolean(
      flags
        .hospitalVictorDiscovered
    ) ||
    Boolean(
      flags
        .investigatedHospitalVictor
    ) ||
    Boolean(
      flags
        .suspiciousAmbulanceDiscovered
    ) ||
    [
      'strange_hospitals_pattern',
      'strange_hospitals_identified',
      'hospital_victor_arrival',
      'hospital_victor_exterior',
      'hospital_victor_ambulance_bay',
    ].includes(
      sceneId
    )

  if (
    learnedAboutDisappearances
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'strange_hospitals',
        'learn_about_disappearances'
      )
  }

  flags =
    updatedGame?.flags ??
    {}

  /*
    ----------------------------------------
    OBJETIVO 2
    IDENTIFICAR O HOSPITAL
    ----------------------------------------
  */

  const identifiedHospital =
    Boolean(
      flags
        .hospitalVictorIdentified
    ) ||
    Boolean(
      flags
        .hospitalVictorDiscovered
    ) ||
    Boolean(
      flags
        .hospitalVictorUnlocked
    ) ||
    Boolean(
      flags
        .investigatedHospitalVictor
    ) ||
    Boolean(
      flags
        .suspiciousAmbulanceDiscovered
    ) ||
    [
      'hospital_victor_arrival',
      'hospital_victor_exterior',
      'hospital_victor_ambulance_bay',
    ].includes(
      sceneId
    )

  if (
    identifiedHospital
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'strange_hospitals',
        'identify_hospital'
      )
  }

  flags =
    updatedGame?.flags ??
    {}

  /*
    ----------------------------------------
    OBJETIVO 3
    INVESTIGAR O HOSPITAL
    ----------------------------------------
  */

  const investigatedHospital =
    Boolean(
      flags
        .investigatedHospitalVictor
    ) ||
    Boolean(
      flags
        .hospitalNightOperationConfirmed
    ) ||
    Boolean(
      flags
        .suspiciousAmbulanceDiscovered
    )

  if (
    investigatedHospital
  ) {
    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'strange_hospitals',
        'investigate_hospital'
      )
  }

  flags =
    updatedGame?.flags ??
    {}

  /*
    ----------------------------------------
    OBJETIVO 4
    DESCOBRIR A AMBULÂNCIA
    ----------------------------------------

    Este objetivo começa oculto.
    Quando a ambulância é descoberta,
    primeiro revelamos e depois
    concluímos o objetivo.
  */

  const discoveredAmbulance =
    Boolean(
      flags
        .suspiciousAmbulanceDiscovered
    ) ||
    Boolean(
      flags
        .hospitalAmbulanceSeen
    )

  if (
    discoveredAmbulance
  ) {
    updatedGame =
      revealQuestObjective(
        updatedGame,
        'strange_hospitals',
        'discover_ambulance'
      )

    updatedGame =
      completeObjectiveIfNeeded(
        updatedGame,
        'strange_hospitals',
        'discover_ambulance'
      )
  }

  /*
    Se todos os objetivos obrigatórios
    estiverem concluídos, encerra a
    missão e entrega a recompensa.
  */

  updatedGame =
    finishQuestIfReady(
      updatedGame,
      'strange_hospitals'
    )

  return updatedGame
}

/*
  ========================================
  PONTE PRINCIPAL
  ========================================
*/

export function applyQuestStoryProgress(
  game
) {
  if (!game) {
    return game
  }

  let updatedGame =
    game

  updatedGame =
    applyLiviaLegacyProgress(
      updatedGame
    )

  updatedGame =
    applyFirstHuntProgress(
      updatedGame
    )

  updatedGame =
    applyStrangeHospitalsProgress(
      updatedGame
    )

  return updatedGame
}

export default {
  applyQuestStoryProgress,
}
