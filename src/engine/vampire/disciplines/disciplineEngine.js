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

function clamp(
  value,
  min,
  max
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  )
}

/*
  ========================================
  DISCIPLINAS
  VAMPIRO: A MÁSCARA — REVISED / 3ª ED.
  ========================================
*/

export const DISCIPLINES = {
  animalism: {
    id: 'animalism',

    label:
      'Animalismo',

    names: [
      'animalismo',
      'animalism',
    ],

    type:
      'mental',

    supernatural:
      true,
  },

  auspex: {
    id: 'auspex',

    label:
      'Auspícios',

    names: [
      'auspicios',
      'auspícios',
      'auspex',
    ],

    type:
      'sensory',

    supernatural:
      true,
  },

  celerity: {
    id: 'celerity',

    label:
      'Celeridade',

    names: [
      'celeridade',
      'celerity',
    ],

    type:
      'physical',

    supernatural:
      true,

    progressive:
      true,
  },

  dementia: {
    id: 'dementia',

    label:
      'Demência',

    names: [
      'demencia',
      'demência',
      'dementation',
      'dementia',
    ],

    type:
      'mental',

    supernatural:
      true,
  },

  dominate: {
    id: 'dominate',

    label:
      'Dominação',

    names: [
      'dominacao',
      'dominação',
      'dominate',
    ],

    type:
      'mental',

    supernatural:
      true,
  },

  fortitude: {
    id: 'fortitude',

    label:
      'Fortitude',

    names: [
      'fortitude',
    ],

    type:
      'physical',

    supernatural:
      true,

    progressive:
      true,
  },

  obfuscate: {
    id: 'obfuscate',

    label:
      'Ofuscação',

    names: [
      'ofuscacao',
      'ofuscação',
      'obfuscate',
    ],

    type:
      'stealth',

    supernatural:
      true,
  },

  potency: {
    id: 'potency',

    label:
      'Potência',

    names: [
      'potencia',
      'potência',
      'potence',
    ],

    type:
      'physical',

    supernatural:
      true,

    progressive:
      true,
  },

  presence: {
    id: 'presence',

    label:
      'Presença',

    names: [
      'presenca',
      'presença',
      'presence',
    ],

    type:
      'social',

    supernatural:
      true,
  },

  protean: {
    id: 'protean',

    label:
      'Proteanismo',

    names: [
      'proteanismo',
      'protean',
    ],

    type:
      'physical',

    supernatural:
      true,
  },

  thaumaturgy: {
    id: 'thaumaturgy',

    label:
      'Taumaturgia',

    names: [
      'taumaturgia',
      'thaumaturgy',
    ],

    type:
      'blood-magic',

    supernatural:
      true,
  },
}

/*
  ========================================
  CATÁLOGO COMPLETO ● — ●●●●●
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

    originalName:
      'Feral Whispers',

    summary:
      'Permite estabelecer comunicação sobrenatural com animais.',

    category:
      'communication',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'animal',
    ],

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
      'O Chamado',

    originalName:
      'The Beckoning',

    summary:
      'Permite convocar animais de uma determinada espécie nas proximidades.',

    category:
      'summoning',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'animal',
      'environment',
    ],

    masqueradeRisk:
      'medium',
  },

  animalism_3: {
    id:
      'animalism_3',

    discipline:
      'animalism',

    level: 3,

    label:
      'Acalmar a Besta',

    originalName:
      'Quell the Beast',

    summary:
      'Suprime temporariamente os impulsos bestiais e emocionais de uma criatura.',

    category:
      'beast-control',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
      'animal',
    ],

    masqueradeRisk:
      'low',
  },

  animalism_4: {
    id:
      'animalism_4',

    discipline:
      'animalism',

    level: 4,

    label:
      'Comunhão de Espíritos',

    originalName:
      'Subsume the Spirit',

    summary:
      'Permite projetar a consciência para dentro do corpo de um animal.',

    category:
      'possession',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'animal',
    ],

    masqueradeRisk:
      'medium',
  },

  animalism_5: {
    id:
      'animalism_5',

    discipline:
      'animalism',

    level: 5,

    label:
      'Expulsar a Besta',

    originalName:
      'Drawing Out the Beast',

    summary:
      'Permite projetar a própria Besta para outra criatura durante uma situação de frenesi.',

    category:
      'beast-control',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'high',
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

    originalName:
      'Heightened Senses',

    summary:
      'Eleva os sentidos do vampiro a níveis sobrenaturais.',

    category:
      'perception',

    bloodCost: 0,

    requiresTest:
      false,

    targetTypes: [
      'self',
      'environment',
    ],

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

    originalName:
      'Aura Perception',

    summary:
      'Permite perceber informações emocionais e sobrenaturais através da aura de uma criatura.',

    category:
      'perception',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
      'supernatural',
    ],

    masqueradeRisk:
      'none',
  },

  auspex_3: {
    id:
      'auspex_3',

    discipline:
      'auspex',

    level: 3,

    label:
      'O Toque do Espírito',

    originalName:
      "The Spirit's Touch",

    summary:
      'Permite captar impressões psíquicas deixadas em objetos.',

    category:
      'psychometry',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'object',
    ],

    masqueradeRisk:
      'none',
  },

  auspex_4: {
    id:
      'auspex_4',

    discipline:
      'auspex',

    level: 4,

    label:
      'Telepatia',

    originalName:
      'Telepathy',

    summary:
      'Permite sondar pensamentos ou transmitir mensagens mentalmente.',

    category:
      'telepathy',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
      'supernatural',
    ],

    masqueradeRisk:
      'low',
  },

  auspex_5: {
    id:
      'auspex_5',

    discipline:
      'auspex',

    level: 5,

    label:
      'Projeção Psíquica',

    originalName:
      'Psychic Projection',

    summary:
      'Permite que a consciência abandone temporariamente o corpo e viaje em forma astral.',

    category:
      'astral',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'medium',
  },

  /*
    ======================================
    CELERIDADE

    Revised:
    não existem cinco poderes separados.
    Cada ponto aumenta o domínio da mesma
    capacidade sobrenatural de velocidade.

    Mantemos IDs 1–5 para o motor.
    ======================================
  */

  celerity_1: {
    id:
      'celerity_1',

    discipline:
      'celerity',

    level: 1,

    label:
      'Celeridade I',

    originalName:
      'Celerity',

    summary:
      'Primeiro grau de velocidade sobrenatural.',

    category:
      'speed',

    bloodCost: 1,

    requiresTest:
      false,

    progressiveValue: 1,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  celerity_2: {
    id:
      'celerity_2',

    discipline:
      'celerity',

    level: 2,

    label:
      'Celeridade II',

    originalName:
      'Celerity',

    summary:
      'Segundo grau de velocidade sobrenatural.',

    category:
      'speed',

    bloodCost: 1,

    requiresTest:
      false,

    progressiveValue: 2,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  celerity_3: {
    id:
      'celerity_3',

    discipline:
      'celerity',

    level: 3,

    label:
      'Celeridade III',

    originalName:
      'Celerity',

    summary:
      'Terceiro grau de velocidade sobrenatural.',

    category:
      'speed',

    bloodCost: 1,

    requiresTest:
      false,

    progressiveValue: 3,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  celerity_4: {
    id:
      'celerity_4',

    discipline:
      'celerity',

    level: 4,

    label:
      'Celeridade IV',

    originalName:
      'Celerity',

    summary:
      'Quarto grau de velocidade sobrenatural.',

    category:
      'speed',

    bloodCost: 1,

    requiresTest:
      false,

    progressiveValue: 4,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  celerity_5: {
    id:
      'celerity_5',

    discipline:
      'celerity',

    level: 5,

    label:
      'Celeridade V',

    originalName:
      'Celerity',

    summary:
      'Quinto grau de velocidade sobrenatural.',

    category:
      'speed',

    bloodCost: 1,

    requiresTest:
      false,

    progressiveValue: 5,

    targetTypes: [
      'self',
    ],

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

    originalName:
      'Passion',

    summary:
      'Amplifica ou reduz uma emoção que já esteja presente no alvo.',

    category:
      'emotion',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'low',
  },

  dementia_2: {
    id:
      'dementia_2',

    discipline:
      'dementia',

    level: 2,

    label:
      'A Assombração',

    originalName:
      'The Haunting',

    summary:
      'Provoca percepções perturbadoras e manifestações sensoriais na vítima.',

    category:
      'mental',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'low',
  },

  dementia_3: {
    id:
      'dementia_3',

    discipline:
      'dementia',

    level: 3,

    label:
      'Olhos do Caos',

    originalName:
      'Eyes of Chaos',

    summary:
      'Permite encontrar padrões e significados escondidos no aparente caos.',

    category:
      'perception',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'environment',
      'person',
      'object',
      'pattern',
    ],

    masqueradeRisk:
      'none',
  },

  dementia_4: {
    id:
      'dementia_4',

    discipline:
      'dementia',

    level: 4,

    label:
      'Voz da Loucura',

    originalName:
      'Voice of Madness',

    summary:
      'Pode despertar violentamente os impulsos da Besta e provocar pânico ou frenesi.',

    category:
      'frenzy',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
      'group',
    ],

    masqueradeRisk:
      'high',
  },

  dementia_5: {
    id:
      'dementia_5',

    discipline:
      'dementia',

    level: 5,

    label:
      'Insanidade Total',

    originalName:
      'Total Insanity',

    summary:
      'Submerge a mente da vítima em um estado extremo de perturbação.',

    category:
      'mental',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'medium',
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

    originalName:
      'Command',

    summary:
      'Impõe uma ordem curta e direta a um único alvo.',

    category:
      'command',

    bloodCost: 0,

    requiresTest:
      true,

    requiresEyeContact:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

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

    originalName:
      'Mesmerize',

    summary:
      'Permite implantar instruções mais complexas na mente do alvo.',

    category:
      'command',

    bloodCost: 0,

    requiresTest:
      true,

    requiresEyeContact:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

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

    originalName:
      'The Forgetful Mind',

    summary:
      'Permite alterar, apagar ou reconstruir partes da memória do alvo.',

    category:
      'memory',

    bloodCost: 0,

    requiresTest:
      true,

    requiresEyeContact:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'low',
  },

  dominate_4: {
    id:
      'dominate_4',

    discipline:
      'dominate',

    level: 4,

    label:
      'Condicionamento',

    originalName:
      'Conditioning',

    summary:
      'Submete progressivamente a vontade do alvo através de uso repetido de Dominação.',

    category:
      'conditioning',

    bloodCost: 0,

    requiresTest:
      true,

    requiresEyeContact:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'medium',
  },

  dominate_5: {
    id:
      'dominate_5',

    discipline:
      'dominate',

    level: 5,

    label:
      'Possessão',

    originalName:
      'Possession',

    summary:
      'Permite projetar a mente do vampiro para controlar completamente um corpo mortal.',

    category:
      'possession',

    bloodCost: 0,

    requiresTest:
      true,

    requiresEyeContact:
      true,

    targetTypes: [
      'human',
    ],

    masqueradeRisk:
      'high',
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
      'Fortitude I',

    originalName:
      'Fortitude',

    summary:
      'Primeiro grau de resistência sobrenatural.',

    category:
      'resistance',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 1,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'medium',
  },

  fortitude_2: {
    id:
      'fortitude_2',

    discipline:
      'fortitude',

    level: 2,

    label:
      'Fortitude II',

    originalName:
      'Fortitude',

    summary:
      'Segundo grau de resistência sobrenatural.',

    category:
      'resistance',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 2,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'medium',
  },

  fortitude_3: {
    id:
      'fortitude_3',

    discipline:
      'fortitude',

    level: 3,

    label:
      'Fortitude III',

    originalName:
      'Fortitude',

    summary:
      'Terceiro grau de resistência sobrenatural.',

    category:
      'resistance',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 3,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'medium',
  },

  fortitude_4: {
    id:
      'fortitude_4',

    discipline:
      'fortitude',

    level: 4,

    label:
      'Fortitude IV',

    originalName:
      'Fortitude',

    summary:
      'Quarto grau de resistência sobrenatural.',

    category:
      'resistance',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 4,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'medium',
  },

  fortitude_5: {
    id:
      'fortitude_5',

    discipline:
      'fortitude',

    level: 5,

    label:
      'Fortitude V',

    originalName:
      'Fortitude',

    summary:
      'Quinto grau de resistência sobrenatural.',

    category:
      'resistance',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 5,

    targetTypes: [
      'self',
    ],

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

    originalName:
      'Cloak of Shadows',

    summary:
      'Permite permanecer oculto enquanto imóvel e adequadamente encoberto.',

    category:
      'stealth',

    bloodCost: 0,

    requiresTest:
      false,

    targetTypes: [
      'self',
    ],

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

    originalName:
      'Unseen Presence',

    summary:
      'Permite mover-se enquanto as pessoas inconscientemente ignoram sua presença.',

    category:
      'stealth',

    bloodCost: 0,

    requiresTest:
      false,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'low',
  },

  obfuscate_3: {
    id:
      'obfuscate_3',

    discipline:
      'obfuscate',

    level: 3,

    label:
      'Máscara das Mil Faces',

    originalName:
      'Mask of a Thousand Faces',

    summary:
      'Altera sobrenaturalmente a aparência percebida do vampiro.',

    category:
      'disguise',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'low',
  },

  obfuscate_4: {
    id:
      'obfuscate_4',

    discipline:
      'obfuscate',

    level: 4,

    label:
      'Desaparecer da Mente',

    originalName:
      "Vanish from the Mind's Eye",

    summary:
      'Permite desaparecer da percepção mesmo enquanto está sendo observado.',

    category:
      'stealth',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'self',
      'observers',
    ],

    masqueradeRisk:
      'medium',
  },

  obfuscate_5: {
    id:
      'obfuscate_5',

    discipline:
      'obfuscate',

    level: 5,

    label:
      'Encobrir o Grupo',

    originalName:
      'Cloak the Gathering',

    summary:
      'Estende os efeitos de Ofuscação a outras pessoas próximas.',

    category:
      'stealth',

    bloodCost: 0,

    requiresTest:
      false,

    targetTypes: [
      'self',
      'group',
    ],

    masqueradeRisk:
      'medium',
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
      'Potência I',

    originalName:
      'Potence',

    summary:
      'Primeiro grau de força sobrenatural.',

    category:
      'strength',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 1,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  potency_2: {
    id:
      'potency_2',

    discipline:
      'potency',

    level: 2,

    label:
      'Potência II',

    originalName:
      'Potence',

    summary:
      'Segundo grau de força sobrenatural.',

    category:
      'strength',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 2,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  potency_3: {
    id:
      'potency_3',

    discipline:
      'potency',

    level: 3,

    label:
      'Potência III',

    originalName:
      'Potence',

    summary:
      'Terceiro grau de força sobrenatural.',

    category:
      'strength',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 3,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  potency_4: {
    id:
      'potency_4',

    discipline:
      'potency',

    level: 4,

    label:
      'Potência IV',

    originalName:
      'Potence',

    summary:
      'Quarto grau de força sobrenatural.',

    category:
      'strength',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 4,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  potency_5: {
    id:
      'potency_5',

    discipline:
      'potency',

    level: 5,

    label:
      'Potência V',

    originalName:
      'Potence',

    summary:
      'Quinto grau de força sobrenatural.',

    category:
      'strength',

    bloodCost: 0,

    requiresTest:
      false,

    passive:
      true,

    progressiveValue: 5,

    targetTypes: [
      'self',
    ],

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

    originalName:
      'Awe',

    summary:
      'Torna o vampiro sobrenaturalmente atraente e persuasivo para quem está próximo.',

    category:
      'social',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
      'group',
    ],

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

    originalName:
      'Dread Gaze',

    summary:
      'Projeta terror sobrenatural sobre uma vítima.',

    category:
      'fear',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'medium',
  },

  presence_3: {
    id:
      'presence_3',

    discipline:
      'presence',

    level: 3,

    label:
      'Transe',

    originalName:
      'Entrancement',

    summary:
      'Cria uma forte ligação emocional que faz o alvo desejar agradar ao vampiro.',

    category:
      'social',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'low',
  },

  presence_4: {
    id:
      'presence_4',

    discipline:
      'presence',

    level: 4,

    label:
      'Convocação',

    originalName:
      'Summon',

    summary:
      'Permite chamar sobrenaturalmente alguém conhecido para que procure o vampiro.',

    category:
      'summoning',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'medium',
  },

  presence_5: {
    id:
      'presence_5',

    discipline:
      'presence',

    level: 5,

    label:
      'Majestade',

    originalName:
      'Majesty',

    summary:
      'Projeta autoridade sobrenatural esmagadora sobre todos ao redor.',

    category:
      'social',

    bloodCost: 0,

    requiresTest:
      false,

    targetTypes: [
      'group',
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'high',
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

    originalName:
      'Eyes of the Beast',

    summary:
      'Permite enxergar perfeitamente mesmo em completa escuridão.',

    category:
      'perception',

    bloodCost: 0,

    requiresTest:
      false,

    targetTypes: [
      'self',
    ],

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

    originalName:
      'Feral Claws',

    summary:
      'Transforma as unhas em garras sobrenaturais capazes de causar dano agravado.',

    category:
      'combat',

    bloodCost: 1,

    requiresTest:
      false,

    aggravatedDamage:
      true,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  protean_3: {
    id:
      'protean_3',

    discipline:
      'protean',

    level: 3,

    label:
      'Fusão com a Terra',

    originalName:
      'Earth Meld',

    summary:
      'Permite afundar sobrenaturalmente no solo e permanecer protegido dentro da terra.',

    category:
      'survival',

    bloodCost: 1,

    requiresTest:
      false,

    targetTypes: [
      'self',
      'earth',
    ],

    masqueradeRisk:
      'high',
  },

  protean_4: {
    id:
      'protean_4',

    discipline:
      'protean',

    level: 4,

    label:
      'Forma da Besta',

    originalName:
      'Shape of the Beast',

    summary:
      'Permite assumir formas animais predatórias características da Disciplina.',

    category:
      'transformation',

    bloodCost: 1,

    requiresTest:
      false,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  protean_5: {
    id:
      'protean_5',

    discipline:
      'protean',

    level: 5,

    label:
      'Forma de Névoa',

    originalName:
      'Mist Form',

    summary:
      'Transforma o corpo em uma névoa sobrenatural e quase intangível.',

    category:
      'transformation',

    bloodCost: 1,

    requiresTest:
      false,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'high',
  },

  /*
    ======================================
    TAUMATURGIA
    CAMINHO DO SANGUE

    O nível da Taumaturgia representa
    também o avanço no caminho primário.

    Outros Caminhos e Rituais serão
    implementados separadamente.
    ======================================
  */

  thaumaturgy_1: {
    id:
      'thaumaturgy_1',

    discipline:
      'thaumaturgy',

    path:
      'path_of_blood',

    level: 1,

    label:
      'Um Gosto por Sangue',

    originalName:
      'A Taste for Blood',

    summary:
      'Analisa propriedades sobrenaturais presentes em uma amostra de sangue.',

    category:
      'blood-magic',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'blood',
    ],

    masqueradeRisk:
      'low',
  },

  thaumaturgy_2: {
    id:
      'thaumaturgy_2',

    discipline:
      'thaumaturgy',

    path:
      'path_of_blood',

    level: 2,

    label:
      'Fúria do Sangue',

    originalName:
      'Blood Rage',

    summary:
      'Manipula sobrenaturalmente o sangue de outro vampiro através do toque.',

    category:
      'blood-magic',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'vampire',
    ],

    masqueradeRisk:
      'medium',
  },

  thaumaturgy_3: {
    id:
      'thaumaturgy_3',

    discipline:
      'thaumaturgy',

    path:
      'path_of_blood',

    level: 3,

    label:
      'Sangue Potente',

    originalName:
      'Blood of Potency',

    summary:
      'Aumenta temporariamente a potência do próprio sangue vampírico.',

    category:
      'blood-magic',

    bloodCost: 1,

    requiresTest:
      true,

    targetTypes: [
      'self',
    ],

    masqueradeRisk:
      'medium',
  },

  thaumaturgy_4: {
    id:
      'thaumaturgy_4',

    discipline:
      'thaumaturgy',

    path:
      'path_of_blood',

    level: 4,

    label:
      'Roubo de Vitae',

    originalName:
      'Theft of Vitae',

    summary:
      'Extrai sobrenaturalmente sangue de uma vítima à distância.',

    category:
      'blood-magic',

    bloodCost: 0,

    requiresTest:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'high',
  },

  thaumaturgy_5: {
    id:
      'thaumaturgy_5',

    discipline:
      'thaumaturgy',

    path:
      'path_of_blood',

    level: 5,

    label:
      'Caldeirão de Sangue',

    originalName:
      'Cauldron of Blood',

    summary:
      'Faz o sangue da vítima ferver sobrenaturalmente dentro de seu próprio corpo.',

    category:
      'blood-magic',

    bloodCost: 0,

    requiresTest:
      true,

    aggravatedDamage:
      true,

    targetTypes: [
      'human',
      'vampire',
    ],

    masqueradeRisk:
      'severe',
  },
}

/*
  ========================================
  DEFINIÇÃO DE DISCIPLINA
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
      normalizeText(
        discipline.id
      ) ===
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
  NÍVEL DO PERSONAGEM
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
      return clamp(
        safeNumber(
          value,
          0
        ),
        0,
        10
      )
    }
  }

  return 0
}

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
  VERIFICAR ALVO
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
    DOMINAÇÃO
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
          'Não há contato visual suficiente para usar Dominação.',
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

      if (
        comparison ===
        'target-stronger'
      ) {
        return {
          allowed: false,

          reason:
            'O sangue do alvo é mais poderoso e resiste à Dominação deste vampiro.',
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
  OBTER PODER
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
  VERIFICAR USO
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

  const definition =
    getDisciplineDefinition(
      power.discipline
    )

  if (!definition) {
    return {
      allowed: false,

      reason:
        'Disciplina desconhecida.',
    }
  }

  const currentLevel =
    getDisciplineLevel(
      game,
      power.discipline
    )

  if (
    currentLevel <
    power.level
  ) {
    return {
      allowed: false,

      reason:
        `É necessário ${definition.label} ${'●'.repeat(
          power.level
        )}.`,
    }
  }

  const currentBlood =
    safeNumber(
      game?.blood
        ?.current,
      0
    )

  const bloodCost =
    safeNumber(
      power.bloodCost,
      0
    )

  if (
    bloodCost >
    currentBlood
  ) {
    return {
      allowed: false,

      reason:
        'Sangue insuficiente.',
    }
  }

  const target =
    {
      ...(context.target ??
        {}),

      requiresEyeContact:
        power.requiresEyeContact ??
        context.target
          ?.requiresEyeContact ??
        false,
    }

  /*
    Caso o poder declare tipos de alvo,
    podemos impedir usos absurdos.
  */

  if (
    target.type &&
    Array.isArray(
      power.targetTypes
    ) &&
    power.targetTypes.length >
      0
  ) {
    const generalAliases = {
      person: [
        'human',
        'vampire',
        'supernatural',
      ],

      observers: [
        'human',
        'vampire',
        'group',
      ],
    }

    const directMatch =
      power.targetTypes.includes(
        target.type
      )

    const aliasMatch =
      power.targetTypes.some(
        (allowedType) =>
          generalAliases[
            allowedType
          ]?.includes(
            target.type
          )
      )

    if (
      !directMatch &&
      !aliasMatch &&
      target.type !==
        'environment'
    ) {
      return {
        allowed: false,

        reason:
          `${power.label} não pode ser usado nesse tipo de alvo.`,
      }
    }
  }

  const targetCheck =
    canTargetWithDiscipline(
      game,
      power.discipline,
      target
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

    discipline:
      definition,

    disciplineLevel:
      currentLevel,
  }
}

/*
  ========================================
  PAGAR CUSTO
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
    Math.max(
      0,
      safeNumber(
        power.bloodCost,
        0
      )
    )

  if (
    cost === 0
  ) {
    return game
  }

  const current =
    safeNumber(
      game?.blood
        ?.current,
      0
    )

  if (
    current <
    cost
  ) {
    return game
  }

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

        powerId:
          power.id,

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
  TODOS OS PODERES DISPONÍVEIS
  ========================================
*/

export function getAvailableDisciplinePowers(
  game,
  context = {}
) {
  return Object.values(
    DISCIPLINE_POWERS
  ).map(
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
  PODERES DE UMA DISCIPLINA
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
  SOMENTE PODERES APRENDIDOS

  Um personagem com Auspícios 3
  terá acesso a:
  Auspícios 1
  Auspícios 2
  Auspícios 3
  ========================================
*/

export function getLearnedPowersForDiscipline(
  game,
  disciplineId
) {
  const definition =
    getDisciplineDefinition(
      disciplineId
    )

  if (!definition) {
    return []
  }

  const level =
    getDisciplineLevel(
      game,
      disciplineId
    )

  return Object.values(
    DISCIPLINE_POWERS
  )
    .filter(
      (power) =>
        power.discipline ===
          definition.id &&
        power.level <=
          level
    )
    .sort(
      (
        a,
        b
      ) =>
        a.level -
        b.level
    )
}

/*
  ========================================
  PODER MÁXIMO APRENDIDO

  Especialmente útil para:
  Potência
  Fortitude
  Celeridade
  ========================================
*/

export function getHighestDisciplinePower(
  game,
  disciplineId
) {
  const powers =
    getLearnedPowersForDiscipline(
      game,
      disciplineId
    )

  if (
    powers.length === 0
  ) {
    return null
  }

  return powers[
    powers.length - 1
  ]
}

/*
  ========================================
  DISCIPLINAS DA FICHA
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
      value,
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

    const level =
      clamp(
        safeNumber(
          value,
          0
        ),
        0,
        10
      )

    if (
      level <= 0
    ) {
      continue
    }

    result.push({
      ...definition,

      level,

      dots:
        '●'.repeat(
          level
        ),

      powers:
        getLearnedPowersForDiscipline(
          game,
          definition.id
        ),
    })
  }

  return result.sort(
    (
      a,
      b
    ) =>
      a.label.localeCompare(
        b.label,
        'pt-BR'
      )
  )
}

/*
  ========================================
  CATEGORIAS ÚTEIS PARA OUTROS MOTORES
  ========================================
*/

export function isPhysicalDiscipline(
  disciplineId
) {
  return [
    'celerity',
    'fortitude',
    'potency',
    'protean',
  ].includes(
    disciplineId
  )
}

export function isMentalDiscipline(
  disciplineId
) {
  return [
    'animalism',
    'dementia',
    'dominate',
  ].includes(
    disciplineId
  )
}

export function isSocialDiscipline(
  disciplineId
) {
  return [
    'presence',
    'dominate',
    'dementia',
  ].includes(
    disciplineId
  )
}

export function isSensoryDiscipline(
  disciplineId
) {
  return [
    'auspex',
    'protean',
  ].includes(
    disciplineId
  )
}

/*
  ========================================
  RISCO VISUAL PARA A MÁSCARA
  ========================================
*/

export function getDisciplineMasqueradeRisk(
  powerId
) {
  const power =
    getDisciplinePower(
      powerId
    )

  return (
    power?.masqueradeRisk ??
    'none'
  )
}

/*
  ========================================
  EXPORT DEFAULT
  ========================================
*/

export default {
  DISCIPLINES,
  DISCIPLINE_POWERS,

  getDisciplineDefinition,
  getDisciplineLevel,
  hasDiscipline,

  parseGeneration,
  compareGenerations,

  canTargetWithDiscipline,

  getDisciplinePower,
  canUseDisciplinePower,
  payDisciplineCost,

  getAvailableDisciplinePowers,
  getPowersForDiscipline,
  getLearnedPowersForDiscipline,
  getHighestDisciplinePower,

  getCharacterDisciplines,

  isPhysicalDiscipline,
  isMentalDiscipline,
  isSocialDiscipline,
  isSensoryDiscipline,

  getDisciplineMasqueradeRisk,
}