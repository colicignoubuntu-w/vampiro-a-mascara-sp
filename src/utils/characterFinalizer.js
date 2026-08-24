const GAME_SAVE_KEY =
  'vampiro-sp-game-save'

const CREATION_SAVE_KEY =
  'vampiro-sp-character-creation'

const generationRules = {
  '13ª': {
    maximumBlood: 10,
    bloodPerTurn: 1,
  },

  '12ª': {
    maximumBlood: 11,
    bloodPerTurn: 1,
  },

  '11ª': {
    maximumBlood: 12,
    bloodPerTurn: 1,
  },

  '10ª': {
    maximumBlood: 13,
    bloodPerTurn: 1,
  },

  '9ª': {
    maximumBlood: 14,
    bloodPerTurn: 2,
  },

  '8ª': {
    maximumBlood: 15,
    bloodPerTurn: 3,
  },
}

function getGenerationRules(
  generation
) {
  return (
    generationRules[generation] ??
    generationRules['13ª']
  )
}

function createInitialHealth() {
  return {
    currentLevel: 0,

    levels: [
      {
        id: 'bruised',
        label: 'Escoriado',
        penalty: 0,
        damaged: false,
      },

      {
        id: 'hurt',
        label: 'Machucado',
        penalty: -1,
        damaged: false,
      },

      {
        id: 'injured',
        label: 'Ferido',
        penalty: -1,
        damaged: false,
      },

      {
        id: 'wounded',
        label: 'Ferido Gravemente',
        penalty: -2,
        damaged: false,
      },

      {
        id: 'mauled',
        label: 'Espancado',
        penalty: -2,
        damaged: false,
      },

      {
        id: 'crippled',
        label: 'Aleijado',
        penalty: -5,
        damaged: false,
      },

      {
        id: 'incapacitated',
        label: 'Incapacitado',
        penalty: null,
        damaged: false,
      },
    ],
  }
}

export function buildFinalCharacter({
  identity,
  attributes,
  abilitiesData,
  disciplinesData,
  backgroundsData,
  virtuesData,
  humanity,
  willpower,
  bonusData,
}) {
  const finalAttributes =
    bonusData?.finalAttributes ??
    attributes

  const finalAbilities =
    bonusData?.finalAbilities ??
    abilitiesData?.abilities ??
    {}

  const finalDisciplines =
    bonusData?.finalDisciplines ??
    disciplinesData?.disciplines ??
    {}

  const finalBackgrounds =
    bonusData?.finalBackgrounds ??
    backgroundsData?.backgrounds ??
    {}

  const finalVirtues =
    bonusData?.finalVirtues ??
    virtuesData?.virtues ?? {
      conscience: 1,
      selfControl: 1,
      courage: 1,
    }

  const finalHumanity =
    bonusData?.finalHumanity ??
    humanity

  const finalWillpower =
    bonusData?.finalWillpower ??
    willpower

  const generation =
    identity?.generation ||
    '13ª'

  const generationData =
    getGenerationRules(
      generation
    )

  return {
    characterComplete: true,

    createdAt:
      new Date().toISOString(),

    identity: {
      ...identity,
      generation,
    },

    attributes:
      finalAttributes,

    abilities:
      finalAbilities,

    disciplines:
      finalDisciplines,

    backgrounds:
      finalBackgrounds,

    virtues:
      finalVirtues,

    humanity: {
      current:
        finalHumanity,

      maximum:
        finalHumanity,
    },

    willpower: {
      current:
        finalWillpower,

      maximum:
        finalWillpower,
    },

    blood: {
      current:
        generationData.maximumBlood,

      maximum:
        generationData.maximumBlood,

      perTurn:
        generationData.bloodPerTurn,
    },

    health:
      createInitialHealth(),

    experience: {
      current: 0,
      spent: 0,
    },

    inventory: [],

    relationships: {},

    flags: {},

    journal: [],

    history: [],

    world: {
      night: 1,

      hour: 23,
      minute: 30,

      sunriseHour: 6,
      sunriseMinute: 30,

      location: {
        id: 'prologue',
        name: 'Prólogo',
        district: 'São Paulo',
      },
    },

    story: {
      chapter: 'prologue',

      scene: 'awakening',

      previousScene: null,
    },

    lastRoll: null,
  }
}

export function saveFinalCharacter(
  character
) {
  try {
    localStorage.setItem(
      GAME_SAVE_KEY,
      JSON.stringify(
        character
      )
    )
  } catch (error) {
    console.error(
      'Erro ao salvar personagem final:',
      error
    )

    return false
  }

  const creationSave =
    localStorage.getItem(
      CREATION_SAVE_KEY
    )

  if (creationSave) {
    try {
      const creationData =
        JSON.parse(
          creationSave
        )

      localStorage.setItem(
        CREATION_SAVE_KEY,
        JSON.stringify({
          ...creationData,

          characterComplete:
            true,

          completedAt:
            new Date()
              .toISOString(),
        })
      )
    } catch (error) {
      console.error(
        'Erro ao atualizar save da criação:',
        error
      )
    }
  }

  return true
}

export function loadFinalCharacter() {
  const saved =
    localStorage.getItem(
      GAME_SAVE_KEY
    )

  if (!saved) {
    return null
  }

  try {
    return JSON.parse(
      saved
    )
  } catch (error) {
    console.error(
      'Erro ao carregar personagem:',
      error
    )

    return null
  }
}

export function hasFinishedCharacter() {
  const character =
    loadFinalCharacter()

  return Boolean(
    character?.characterComplete
  )
}

export function deleteFinalCharacter() {
  try {
    localStorage.removeItem(
      GAME_SAVE_KEY
    )

    return true
  } catch (error) {
    console.error(
      'Erro ao apagar personagem final:',
      error
    )

    return false
  }
}

export function deleteAllCharacterSaves() {
  try {
    localStorage.removeItem(
      GAME_SAVE_KEY
    )

    localStorage.removeItem(
      CREATION_SAVE_KEY
    )

    return true
  } catch (error) {
    console.error(
      'Erro ao apagar saves:',
      error
    )

    return false
  }
}

export {
  GAME_SAVE_KEY,
  CREATION_SAVE_KEY,
}