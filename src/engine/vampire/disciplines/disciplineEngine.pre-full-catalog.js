function normalizeText(
  value
) {
  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
}

function safeNumber(
  value,
  fallback = 0
) {
  const parsed =
    Number(value)

  return Number.isNaN(
    parsed
  )
    ? fallback
    : parsed
}

/*
  ========================================
  CATÁLOGO DAS DISCIPLINAS
  ========================================
*/

export const DISCIPLINES = {
  animalism: {
    id:
      'animalism',

    names: [
      'animalismo',
      'animalism',
    ],

    label:
      'Animalismo',

    type:
      'mental',

    supernatural:
      true,
  },

  auspex: {
    id:
      'auspex',

    names: [
      'auspicios',
      'auspícios',
      'auspex',
    ],

    label:
      'Auspícios',

    type:
      'sensory',

    supernatural:
      true,
  },

  celerity: {
    id:
      'celerity',

    names: [
      'celeridade',
      'celerity',
    ],

    label:
      'Celeridade',

    type:
      'physical',

    supernatural:
      true,
  },

  dementia: {
    id:
      'dementia',

    names: [
      'demencia',
      'demência',
      'dementation',
      'dementia',
    ],

    label:
      'Demência',

    type:
      'mental',

    supernatural:
      true,
  },

  dominate: {
    id:
      'dominate',

    names: [
      'dominacao',
      'dominação',
      'dominate',
    ],

    label:
      'Dominação',

    type:
      'mental',

    supernatural:
      true,
  },

  fortitude: {
    id:
      'fortitude',

    names: [
      'fortitude',
    ],

    label:
      'Fortitude',

    type:
      'physical',

    supernatural:
      true,
  },

  obfuscate: {
    id:
      'obfuscate',

    names: [
      'ofuscacao',
      'ofuscação',
      'obfuscate',
    ],

    label:
      'Ofuscação',

    type:
      'stealth',

    supernatural:
      true,
  },

  potency: {
    id:
      'potency',

    names: [
      'potencia',
      'potência',
      'potence',
    ],

    label:
      'Potência',

    type:
      'physical',

    supernatural:
      true,
  },

  presence: {
    id:
      'presence',

    names: [
      'presenca',
      'presença',
      'presence',
    ],

    label:
      'Presença',

    type:
      'social',

    supernatural:
      true,
  },

  protean: {
    id:
      'protean',

    names: [
      'proteanismo',
      'protean',
    ],

    label:
      'Proteanismo',

    type:
      'physical',

    supernatural:
      true,
  },

  thaumaturgy: {
    id:
      'thaumaturgy',

    names: [
      'taumaturgia',
      'thaumaturgy',
    ],

    label:
      'Taumaturgia',

    type:
      'blood-magic',

    supernatural:
      true,
  },
}

/*
  ========================================
  NORMALIZAR NOME
  ========================================
*/

export function getDisciplineDefinition(
  nameOrId
) {
  const normalized =
    normalizeText(
      nameOrId
    )

  for (
    const discipline of Object.values(
      DISCIPLINES
    )
  ) {
    if (
      discipline.id ===
      normalized
    ) {
      return discipline
    }

    const found =
      discipline.names.some(
        (name) =>
          normalizeText(
            name
          ) ===
          normalized
      )

    if (found) {
      return discipline
    }
  }

  return null
}

/*
  ========================================
  NÍVEL DA DISCIPLINA NO SAVE
  ========================================
*/

export function getDisciplineLevel(
  game,
  nameOrId
) {
  if (
    !game?.disciplines
  ) {
    return 0
  }

  const definition =
    getDisciplineDefinition(
      nameOrId
    )

  if (!definition) {
    return 0
  }

  for (
    const [
      key,
      value,
    ] of Object.entries(
      game.disciplines
    )
  ) {
    const keyDefinition =
      getDisciplineDefinition(
        key
      )

    if (
      keyDefinition?.id ===
      definition.id
    ) {
      return Math.max(
        0,
        safeNumber(
          value,
          0
        )
      )
    }
  }

  return 0
}

/*
  ========================================
  POSSUI DISCIPLINA?
  ========================================
*/

export function hasDiscipline(
  game,
  nameOrId,
  minimumLevel = 1
) {
  return (
    getDisciplineLevel(
      game,
      nameOrId
    ) >=
    minimumLevel
  )
}

/*
  ========================================
  GERAÇÃO
  ========================================
*/

export function parseGeneration(
  generation
) {
  const match =
    String(
      generation ?? ''
    ).match(
      /\d+/
    )

  if (!match) {
    return null
  }

  return Number(
    match[0]
  )
}

/*
  Vampiro de número MENOR
  é de geração mais baixa
  e portanto sangue mais poderoso.

  8ª é mais poderosa que 11ª.
*/

export function compareGenerations(
  actorGeneration,
  targetGeneration
) {
  const actor =
    parseGeneration(
      actorGeneration
    )

  const target =
    parseGeneration(
      targetGeneration
    )

  if (
    actor === null ||
    target === null
  ) {
    return 'unknown'
  }

  if (
    actor < target
  ) {
    return 'actor-stronger'
  }

  if (
    actor > target
  ) {
    return 'target-stronger'
  }

  return 'equal'
}

/*
  ========================================
  REGRAS DE ALVO
  ========================================
*/

export function canTargetWithDiscipline(
  game,
  disciplineId,
  target = {}
) {
  const discipline =
    getDisciplineDefinition(
      disciplineId
    )

  if (!discipline) {
    return {
      allowed: false,

      reason:
        'Disciplina desconhecida.',
    }
  }

  if (
    !hasDiscipline(
      game,
      discipline.id,
      1
    )
  ) {
    return {
      allowed: false,

      reason:
        `O personagem não possui ${discipline.label}.`,
    }
  }

  /*
    ========================================
    DOMINAÇÃO
    ========================================
  */

  if (
    discipline.id ===
    'dominate'
  ) {
    if (
      target.requiresEyeContact &&
      target.eyeContact ===
        false
    ) {
      return {
        allowed: false,

        reason:
          'Dominação exige contato visual nesta situação.',
      }
    }

    if (
      target.type ===
      'vampire'
    ) {
      const comparison =
        compareGenerations(
          game.identity
            ?.generation,
          target.generation
        )

      /*
        Pela regra que estamos adotando
        para este jogo:

        um vampiro de geração mais fraca
        não consegue Dominar um de sangue
        mais poderoso.
      */

      if (
        comparison ===
        'target-stronger'
      ) {
        return {
          allowed: false,

          reason:
            'O sangue do alvo é poderoso demais para ser submetido por Dominação.',
        }
      }
    }
  }

  return {
    allowed: true,

    reason: null,
  }
}

/*
  ========================================
  DEFINIÇÕES DOS PODERES

  Não estamos implementando todos os
  efeitos completos ainda.

  Esta tabela serve para:
  - liberar opções;
  - saber nível necessário;
  - custo;
  - necessidade de teste;
  - risco à Máscara.
  ========================================
*/

export const DISCIPLINE_POWERS = {
  /*
    ======================================
    ANIMALISMO
    ======================================
  */

  animalism_1: {
    id:
      'animalism_1',

    discipline:
      'animalism',

    level: 1,

    label:
      'Sussurros Selvagens',

    bloodCost: 0,

    requiresTest:
      true,

    masqueradeRisk:
      'low',
  },

  animalism_2: {
    id:
      'animalism_2',

    discipline:
      'animalism',

    level: 2,

    label:
      'Chamado',

    bloodCost: 0,

    requiresTest:
      true,

    masqueradeRisk:
      'medium',
  },

  /*
    ======================================
    AUSPÍCIOS
    ======================================
  */

  auspex_1: {
    id:
      'auspex_1',

    discipline:
      'auspex',

    level: 1,

    label:
      'Sentidos Aguçados',

    bloodCost: 0,

    requiresTest:
      false,

    masqueradeRisk:
      'none',
  },

  auspex_2: {
    id:
      'auspex_2',

    discipline:
      'auspex',

    level: 2,

    label:
      'Percepção da Aura',

    bloodCost: 0,

    requiresTest:
      true,

    masqueradeRisk:
      'none',
  },

  /*
    ======================================
    CELERIDADE
    ======================================
  */

  celerity_1: {
    id:
      'celerity_1',

    discipline:
      'celerity',

    level: 1,

    label:
      'Celeridade',

    bloodCost: 1,

    requiresTest:
      false,

    masqueradeRisk:
      'high',
  },

  /*
    ======================================
    DEMÊNCIA
    ======================================
  */

  dementia_1: {
    id:
      'dementia_1',

    discipline:
      'dementia',

    level: 1,

    label:
      'Paixão',

    bloodCost: 0,

    requiresTest:
      true,

    masqueradeRisk:
      'low',
  },

  /*
    ======================================
    DOMINAÇÃO
    ======================================
  */

  dominate_1: {
    id:
      'dominate_1',

    discipline:
      'dominate',

    level: 1,

    label:
      'Comando',

    bloodCost: 0,

    requiresTest:
      true,

    requiresEyeContact:
      true,

    masqueradeRisk:
      'low',
  },

  dominate_2: {
    id:
      'dominate_2',

    discipline:
      'dominate',

    level: 2,

    label:
      'Mesmerizar',

    bloodCost: 0,

    requiresTest:
      true,

    requiresEyeContact:
      true,

    masqueradeRisk:
      'low',
  },

  dominate_3: {
    id:
      'dominate_3',

    discipline:
      'dominate',

    level: 3,

    label:
      'A Mente Esquecida',

    bloodCost: 0,

    requiresTest:
      true,

    requiresEyeContact:
      true,

    masqueradeRisk:
      'low',
  },

  /*
    ======================================
    FORTITUDE
    ======================================
  */

  fortitude_1: {
    id:
      'fortitude_1',

    discipline:
      'fortitude',

    level: 1,

    label:
      'Fortitude',

    bloodCost: 0,

    requiresTest:
      false,

    masqueradeRisk:
      'medium',
  },

  /*
    ======================================
    OFUSCAÇÃO
    ======================================
  */

  obfuscate_1: {
    id:
      'obfuscate_1',

    discipline:
      'obfuscate',

    level: 1,

    label:
      'Manto de Sombras',

    bloodCost: 0,

    requiresTest:
      false,

    masqueradeRisk:
      'low',
  },

  obfuscate_2: {
    id:
      'obfuscate_2',

    discipline:
      'obfuscate',

    level: 2,

    label:
      'Presença Invisível',

    bloodCost: 0,

    requiresTest:
      false,

    masqueradeRisk:
      'low',
  },

  /*
    ======================================
    POTÊNCIA
    ======================================
  */

  potency_1: {
    id:
      'potency_1',

    discipline:
      'potency',

    level: 1,

    label:
      'Potência',

    bloodCost: 0,

    requiresTest:
      false,

    masqueradeRisk:
      'high',
  },

  /*
    ======================================
    PRESENÇA
    ======================================
  */

  presence_1: {
    id:
      'presence_1',

    discipline:
      'presence',

    level: 1,

    label:
      'Fascínio',

    bloodCost: 0,

    requiresTest:
      true,

    masqueradeRisk:
      'low',
  },

  presence_2: {
    id:
      'presence_2',

    discipline:
      'presence',

    level: 2,

    label:
      'Olhar Aterrorizante',

    bloodCost: 0,

    requiresTest:
      true,

    masqueradeRisk:
      'medium',
  },

  /*
    ======================================
    PROTEANISMO
    ======================================
  */

  protean_1: {
    id:
      'protean_1',

    discipline:
      'protean',

    level: 1,

    label:
      'Olhos da Besta',

    bloodCost: 0,

    requiresTest:
      false,

    masqueradeRisk:
      'medium',
  },

  protean_2: {
    id:
      'protean_2',

    discipline:
      'protean',

    level: 2,

    label:
      'Garras da Besta',

    bloodCost: 1,

    requiresTest:
      false,

    masqueradeRisk:
      'high',
  },

  /*
    ======================================
    TAUMATURGIA
    ======================================
  */

  thaumaturgy_1: {
    id:
      'thaumaturgy_1',

    discipline:
      'thaumaturgy',

    level: 1,

    label:
      'Taumaturgia',

    bloodCost: 1,

    requiresTest:
      true,

    masqueradeRisk:
      'high',
  },
}

/*
  ========================================
  CONSULTAR PODER
  ========================================
*/

export function getDisciplinePower(
  powerId
) {
  return (
    DISCIPLINE_POWERS[
      powerId
    ] ??
    null
  )
}

/*
  ========================================
  PODE USAR PODER?
  ========================================
*/

export function canUseDisciplinePower(
  game,
  powerId,
  context = {}
) {
  const power =
    getDisciplinePower(
      powerId
    )

  if (!power) {
    return {
      allowed: false,

      reason:
        'Poder desconhecido.',
    }
  }

  const level =
    getDisciplineLevel(
      game,
      power.discipline
    )

  if (
    level <
    power.level
  ) {
    return {
      allowed: false,

      reason:
        `É necessário ${getDisciplineDefinition(
          power.discipline
        )?.label ?? power.discipline} ${power.level}.`,
    }
  }

  const blood =
    safeNumber(
      game?.blood?.current,
      0
    )

  if (
    power.bloodCost >
    blood
  ) {
    return {
      allowed: false,

      reason:
        'Sangue insuficiente.',
    }
  }

  const targetCheck =
    canTargetWithDiscipline(
      game,
      power.discipline,
      {
        ...(context.target ??
          {}),

        requiresEyeContact:
          power.requiresEyeContact ??
          false,
      }
    )

  if (
    !targetCheck.allowed
  ) {
    return targetCheck
  }

  return {
    allowed: true,

    reason: null,

    power,

    disciplineLevel:
      level,
  }
}

/*
  ========================================
  GASTAR SANGUE
  ========================================
*/

export function payDisciplineCost(
  game,
  powerId
) {
  const power =
    getDisciplinePower(
      powerId
    )

  if (!power) {
    return game
  }

  const cost =
    safeNumber(
      power.bloodCost,
      0
    )

  if (
    cost <= 0
  ) {
    return game
  }

  const current =
    safeNumber(
      game?.blood?.current,
      0
    )

  return {
    ...game,

    blood: {
      ...(game.blood ??
        {}),

      current:
        Math.max(
          0,
          current - cost
        ),
    },

    history: [
      ...(game.history ??
        []),

      {
        type:
          'discipline-cost',

        powerId,

        discipline:
          power.discipline,

        bloodCost:
          cost,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

/*
  ========================================
  LISTAR PODERES DISPONÍVEIS
  ========================================
*/

export function getAvailableDisciplinePowers(
  game,
  context = {}
) {
  return Object.values(
    DISCIPLINE_POWERS
  )
    .map(
      (power) => {
        const check =
          canUseDisciplinePower(
            game,
            power.id,
            context
          )

        return {
          ...power,

          available:
            check.allowed,

          unavailableReason:
            check.reason,
        }
      }
    )
}

/*
  ========================================
  PODERES DE UMA DISCIPLINA ESPECÍFICA
  ========================================
*/

export function getPowersForDiscipline(
  game,
  disciplineId,
  context = {}
) {
  const definition =
    getDisciplineDefinition(
      disciplineId
    )

  if (!definition) {
    return []
  }

  return Object.values(
    DISCIPLINE_POWERS
  )
    .filter(
      (power) =>
        power.discipline ===
        definition.id
    )
    .map(
      (power) => {
        const check =
          canUseDisciplinePower(
            game,
            power.id,
            context
          )

        return {
          ...power,

          available:
            check.allowed,

          unavailableReason:
            check.reason,
        }
      }
    )
}

/*
  ========================================
  RESUMO DAS DISCIPLINAS DO PERSONAGEM
  ========================================
*/

export function getCharacterDisciplines(
  game
) {
  if (
    !game?.disciplines
  ) {
    return []
  }

  const result = []

  for (
    const [
      name,
      level,
    ] of Object.entries(
      game.disciplines
    )
  ) {
    const definition =
      getDisciplineDefinition(
        name
      )

    if (!definition) {
      continue
    }

    result.push({
      ...definition,

      level:
        safeNumber(
          level,
          0
        ),
    })
  }

  return result
}