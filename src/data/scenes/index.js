import prologueScenes from './prologue'
import jackIntroScenes from './jackIntro'
import freeRoamScenes from './freeRoam'
import securityEncounterScenes from './securityEncounter'
import hungerScenes from './hungerScenes'
import frenzyDemoScenes from './frenzyDemoScenes'
import huntingScenes from './huntingScenes'
import combatScenes from './combatScenes'
import hazardScenes from './hazardScenes'
import daySleepScenes from './daySleepScenes'
import policeScenes from './policeScenes'
import policeForceScenes from './policeForceScenes'
import liviaApartmentScenes from './liviaApartmentScenes'

const scenes = {
  ...prologueScenes,
  ...jackIntroScenes,
  ...freeRoamScenes,
  ...securityEncounterScenes,
  ...hungerScenes,
  ...frenzyDemoScenes,
  ...huntingScenes,
  ...combatScenes,
  ...hazardScenes,
  ...daySleepScenes,
  ...policeScenes,

  /*
    ========================================
    APARTAMENTO DE LÍVIA
    ========================================

    Sequência narrativa da investigação
    das coisas deixadas por Lívia.

    Esta sequência também serve como
    primeira missão investigativa real
    da campanha.
  */

  ...liviaApartmentScenes,

  /*
    ========================================
    POLÍCIA
    ========================================

    Fica depois de policeScenes de propósito.

    Assim a versão nova de police_force
    substitui a versão antiga.
  */

  ...policeForceScenes,
}

export default scenes