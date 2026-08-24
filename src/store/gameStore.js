import { create } from 'zustand'

export const useGameStore = create((set) => ({
  character: {
    name: 'Daniel',

    clan: 'Malkavian',

    attributes: {
      physical: {
        strength: 1,
        dexterity: 2,
        stamina: 2,
      },

      social: {
        charisma: 3,
        manipulation: 2,
        appearance: 2,
      },

      mental: {
        perception: 3,
        intelligence: 3,
        wits: 3,
      },
    },

    abilities: {
      // TALENTOS
      alertness: 2,
      athletics: 1,
      brawl: 1,
      dodge: 1,
      empathy: 2,
      expression: 1,
      intimidation: 0,
      leadership: 0,
      streetwise: 1,
      subterfuge: 2,

      // PERÍCIAS
      animalKen: 0,
      crafts: 0,
      drive: 1,
      etiquette: 0,
      firearms: 0,
      melee: 0,
      performance: 1,
      security: 1,
      stealth: 1,
      survival: 0,

      // CONHECIMENTOS
      academics: 1,
      computer: 2,
      finance: 0,
      investigation: 1,
      law: 0,
      linguistics: 0,
      medicine: 0,
      occult: 0,
      politics: 0,
      science: 2,
    },

    disciplines: {
      auspex: 1,
      dementation: 1,
      obfuscate: 1,
    },

    backgrounds: {},

    virtues: {
      conscience: 3,
      selfControl: 3,
      courage: 4,
    },

    humanity: 6,

    willpower: 4,

    blood: 10,

    maxBlood: 10,

    health: {
      bruised: false,
      hurt: false,
      injured: false,
      wounded: false,
      mauled: false,
      crippled: false,
      incapacitated: false,
    },
  },

  world: {
    day: 1,

    hour: 23,
    minute: 30,

    sunriseHour: 6,
    sunriseMinute: 30,

    location: {
      id: 'unknown',
      name: 'Local desconhecido',
      district: 'São Paulo',
    },
  },

  relationships: {
    jack: 0,
    janette: 0,
    velvet: 0,
    prince: 0,
  },

  flags: {
    liviaDead: false,
    metJack: false,
    metJanette: false,
    metVelvet: false,
    survivedTrial: false,
  },

  inventory: [],

  history: [],

  lastRoll: null,

  advanceTime: (minutes) =>
    set((state) => {
      let total =
        state.world.hour * 60 +
        state.world.minute +
        minutes

      let day = state.world.day

      while (total >= 1440) {
        total -= 1440
        day += 1
      }

      return {
        world: {
          ...state.world,

          day,

          hour: Math.floor(total / 60),

          minute: total % 60,
        },
      }
    }),

  setLocation: (location) =>
    set((state) => ({
      world: {
        ...state.world,
        location,
      },
    })),

  setLastRoll: (roll) =>
    set({
      lastRoll: roll,
    }),

  changeRelationship: (npc, amount) =>
    set((state) => ({
      relationships: {
        ...state.relationships,

        [npc]:
          (state.relationships[npc] ?? 0) +
          amount,
      },
    })),

  setFlag: (flag, value = true) =>
    set((state) => ({
      flags: {
        ...state.flags,
        [flag]: value,
      },
    })),

  addHistory: (event) =>
    set((state) => ({
      history: [
        ...state.history,

        {
          ...event,

          gameDay: state.world.day,

          time: `${String(
            state.world.hour
          ).padStart(2, '0')}:${String(
            state.world.minute
          ).padStart(2, '0')}`,
        },
      ],
    })),
}))