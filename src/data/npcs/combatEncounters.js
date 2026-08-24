import {
  createCombatNpc,
} from './combatNpcTemplates'

export const combatEncounters = {
  devBrujah: {
    id:
      'dev_brujah',

    label:
      'Brujah · Brigão',

    enemy:
      createCombatNpc(
        'brujahStreetFighter',
        {
          id:
            'dev_brujah_enemy',

          name:
            'Rafael',

          blood: {
            current: 8,
          },
        }
      ),

    distance:
      'close',

    environment: {
      distance:
        'close',
    },

    flags: {},
  },

  devGangrel: {
    id:
      'dev_gangrel',

    label:
      'Gangrel · Predador',

    enemy:
      createCombatNpc(
        'gangrelPredator',
        {
          id:
            'dev_gangrel_enemy',

          name:
            'Caio',

          blood: {
            current: 3,
          },
        }
      ),

    distance:
      'close',

    environment: {
      distance:
        'close',
    },

    flags: {
      visibleBlood:
        true,
    },
  },

  devMalkavian: {
    id:
      'dev_malkavian',

    label:
      'Malkaviano · Perturbador',

    enemy:
      createCombatNpc(
        'malkavianManipulator',
        {
          id:
            'dev_malkavian_enemy',

          name:
            'Davi',
        }
      ),

    distance:
      'medium',

    environment: {
      distance:
        'medium',
    },

    flags: {},
  },

  devNosferatu: {
    id:
      'dev_nosferatu',

    label:
      'Nosferatu · Emboscador',

    enemy:
      createCombatNpc(
        'nosferatuAmbusher',
        {
          id:
            'dev_nosferatu_enemy',

          name:
            'Rato',
        }
      ),

    distance:
      'close',

    environment: {
      distance:
        'close',
    },

    flags: {},
  },

  devToreador: {
    id:
      'dev_toreador',

    label:
      'Toreador · Pistoleiro',

    enemy:
      createCombatNpc(
        'toreadorGunfighter',
        {
          id:
            'dev_toreador_enemy',

          name:
            'Vicente',
        }
      ),

    distance:
      'medium',

    environment: {
      distance:
        'medium',
    },

    flags: {},
  },

  devTremere: {
    id:
      'dev_tremere',

    label:
      'Tremere · Feiticeiro',

    enemy:
      createCombatNpc(
        'tremereWarlock',
        {
          id:
            'dev_tremere_enemy',

          name:
            'Octávio',
        }
      ),

    distance:
      'medium',

    environment: {
      distance:
        'medium',
    },

    flags: {},
  },

  devVentrue: {
    id:
      'dev_ventrue',

    label:
      'Ventrue · Executor',

    enemy:
      createCombatNpc(
        'ventrueEnforcer',
        {
          id:
            'dev_ventrue_enemy',

          name:
            'Augusto',
        }
      ),

    distance:
      'medium',

    environment: {
      distance:
        'medium',
    },

    flags: {},
  },

  devGangrelFire: {
    id:
      'dev_gangrel_fire',

    label:
      'Gangrel · Fogo / Rötschreck',

    enemy:
      createCombatNpc(
        'gangrelPredator',
        {
          id:
            'dev_gangrel_fire_enemy',

          name:
            'Caio',

          blood: {
            current: 4,
          },
        }
      ),

    distance:
      'close',

    environment: {
      distance:
        'close',

      fire:
        true,

      fireSeverity: 4,
    },

    flags: {
      firePresent:
        true,

      fireSeverity: 4,
    },
  },

  devBrujahHungry: {
    id:
      'dev_brujah_hungry',

    label:
      'Brujah · Fome extrema',

    enemy:
      createCombatNpc(
        'brujahStreetFighter',
        {
          id:
            'dev_brujah_hungry_enemy',

          name:
            'Rafael',

          blood: {
            current: 1,
            maximum: 12,
          },
        }
      ),

    distance:
      'close',

    environment: {
      distance:
        'close',
    },

    flags: {
      visibleBlood:
        true,
      bloodScent:
        true,
    },
  },
}

export function getCombatEncounter(
  id
) {
  const encounter =
    combatEncounters[
      id
    ]

  if (!encounter) {
    return null
  }

  return structuredClone(
    encounter
  )
}

export function getAllCombatEncounters() {
  return Object.values(
    combatEncounters
  ).map(
    (encounter) =>
      structuredClone(
        encounter
      )
  )
}

export default combatEncounters