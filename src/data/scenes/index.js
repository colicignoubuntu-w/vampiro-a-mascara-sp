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
    Fica depois de policeScenes de propósito.

    Assim a versão nova de police_force
    substitui a versão antiga.
  */

  ...policeForceScenes,
}

export default scenes