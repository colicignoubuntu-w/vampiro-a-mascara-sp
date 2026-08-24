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

function rollDie() {
  return (
    Math.floor(
      Math.random() * 10
    ) + 1
  )
}

function rollDice(
  amount
) {
  const pool =
    Math.max(
      1,
      safeNumber(
        amount,
        1
      )
    )

  return Array.from(
    {
      length: pool,
    },
    () => rollDie()
  )
}

/*
  ========================================
  SISTEMA DE D10

  Cada dado >= dificuldade = sucesso.
  Cada resultado 1 cancela um sucesso.

  Falha crítica:
  nenhum sucesso bruto + pelo menos um 1.
  ========================================
*/

function resolveDice(
  dice,
  difficulty
) {
  const diff =
    clamp(
      safeNumber(
        difficulty,
        6
      ),
      2,
      10
    )

  let rawSuccesses = 0
  let ones = 0

  for (
    const die of dice
  ) {
    if (
      die >= diff
    ) {
      rawSuccesses += 1
    }

    if (
      die === 1
    ) {
      ones += 1
    }
  }

  const netSuccesses =
    rawSuccesses -
    ones

  if (
    netSuccesses > 0
  ) {
    return {
      result:
        'success',

      successes:
        netSuccesses,

      rawSuccesses,

      ones,
    }
  }

  if (
    rawSuccesses === 0 &&
    ones > 0
  ) {
    return {
      result:
        'botch',

      successes: 0,

      rawSuccesses: 0,

      ones,
    }
  }

  return {
    result:
      'failure',

    successes: 0,

    rawSuccesses,

    ones,
  }
}

/*
  ========================================
  ATRIBUTOS
  ========================================
*/

function getAttribute(
  game,
  group,
  name
) {
  return Math.max(
    0,
    safeNumber(
      game?.attributes
        ?.[group]
        ?.[name],
      0
    )
  )
}

/*
  ========================================
  HABILIDADES
  ========================================
*/

function getAbility(
  game,
  name
) {
  return Math.max(
    0,
    safeNumber(
      game?.abilities
        ?.[name],
      0
    )
  )
}

/*
  ========================================
  VIRTUDES
  ========================================
*/

function getVirtue(
  game,
  name
) {
  return Math.max(
    0,
    safeNumber(
      game?.virtues
        ?.[name],
      0
    )
  )
}

/*
  ========================================
  DADOS DO ALVO
  ========================================
*/

function getTargetWillpower(
  evaluation
) {
  const target =
    evaluation?.choice
      ?.target ??
    {}

  return clamp(
    safeNumber(
      target.willpower,
      6
    ),
    2,
    10
  )
}

function getTargetHumanity(
  evaluation
) {
  const target =
    evaluation?.choice
      ?.target ??
    {}

  return clamp(
    safeNumber(
      target.humanity,
      7
    ),
    1,
    10
  )
}

function getTargetIntelligence(
  evaluation
) {
  return Math.max(
    1,
    safeNumber(
      evaluation?.choice
        ?.target
        ?.intelligence,
      2
    )
  )
}

function getTargetSelfControl(
  evaluation
) {
  return Math.max(
    1,
    safeNumber(
      evaluation?.choice
        ?.target
        ?.selfControl,
      3
    )
  )
}

/*
  ========================================
  CRIADOR DE TESTE
  ========================================
*/

function createTest({
  power,
  attribute = null,
  ability = null,
  attributeValue = 0,
  abilityValue = 0,
  bonusDice = 0,
  difficulty = 6,
  requiresTest = true,
  opposed = false,
  resistance = null,
  notes = [],
  special = null,
}) {
  const pool =
    requiresTest
      ? Math.max(
          1,
          safeNumber(
            attributeValue,
            0
          ) +
            safeNumber(
              abilityValue,
              0
            ) +
            safeNumber(
              bonusDice,
              0
            )
        )
      : 0

  return {
    id:
      `discipline-test-${power.id}`,

    powerId:
      power.id,

    discipline:
      power.discipline,

    label:
      power.label,

    requiresTest,

    attribute,

    ability,

    attributeValue,

    abilityValue,

    bonusDice,

    pool,

    difficulty:
      requiresTest
        ? clamp(
            difficulty,
            2,
            10
          )
        : 0,

    opposed,

    resistance,

    notes,

    special,
  }
}

/*
  ========================================
  ANIMALISMO
  ========================================
*/

function buildAnimalismTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  /*
    ● Sussurros Selvagens

    Manipulação + Empatia com Animais
  */

  if (
    power.id ===
    'animalism_1'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const animalKen =
      getAbility(
        game,
        'animalKen'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Empatia com Animais',

      attributeValue:
        manipulation,

      abilityValue:
        animalKen,

      difficulty: 6,

      notes: [
        'A dificuldade pode variar conforme o temperamento e a espécie do animal.',
      ],
    })
  }

  /*
    ●● O Chamado

    Carisma + Sobrevivência
  */

  if (
    power.id ===
    'animalism_2'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const survival =
      getAbility(
        game,
        'survival'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Sobrevivência',

      attributeValue:
        charisma,

      abilityValue:
        survival,

      difficulty: 6,

      special:
        'animal-summoning',
    })
  }

  /*
    ●●● Acalmar a Besta

    Manipulação + Intimidação
  */

  if (
    power.id ===
    'animalism_3'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const intimidation =
      getAbility(
        game,
        'intimidation'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Intimidação',

      attributeValue:
        manipulation,

      abilityValue:
        intimidation,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      notes: [
        'A dificuldade considera a Força de Vontade do alvo.',
      ],

      special:
        'quell-beast',
    })
  }

  /*
    ●●●● Comunhão de Espíritos
  */

  if (
    power.id ===
    'animalism_4'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const animalKen =
      getAbility(
        game,
        'animalKen'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Empatia com Animais',

      attributeValue:
        charisma,

      abilityValue:
        animalKen,

      difficulty: 8,

      special:
        'animal-possession',
    })
  }

  /*
    ●●●●● Expulsar a Besta
  */

  if (
    power.id ===
    'animalism_5'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const selfControl =
      getVirtue(
        game,
        'selfControl'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Autocontrole',

      attributeValue:
        manipulation,

      abilityValue:
        selfControl,

      difficulty: 8,

      special:
        'draw-out-beast',
    })
  }

  return null
}

/*
  ========================================
  AUSPÍCIOS
  ========================================
*/

function buildAuspexTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  /*
    ● Sentidos Aguçados

    Ativação contextual.
  */

  if (
    power.id ===
    'auspex_1'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      notes: [
        'Sentidos Aguçados modifica testes de percepção feitos depois da ativação.',
      ],

      special:
        'heightened-senses',
    })
  }

  /*
    ●● Percepção da Aura

    Percepção + Empatia
  */

  if (
    power.id ===
    'auspex_2'
  ) {
    const perception =
      getAttribute(
        game,
        'mental',
        'perception'
      )

    const empathy =
      getAbility(
        game,
        'empathy'
      )

    return createTest({
      power,

      attribute:
        'Percepção',

      ability:
        'Empatia',

      attributeValue:
        perception,

      abilityValue:
        empathy,

      difficulty: 8,

      special:
        'aura-perception',
    })
  }

  /*
    ●●● O Toque do Espírito

    Percepção + Empatia
  */

  if (
    power.id ===
    'auspex_3'
  ) {
    const perception =
      getAttribute(
        game,
        'mental',
        'perception'
      )

    const empathy =
      getAbility(
        game,
        'empathy'
      )

    return createTest({
      power,

      attribute:
        'Percepção',

      ability:
        'Empatia',

      attributeValue:
        perception,

      abilityValue:
        empathy,

      difficulty: 7,

      special:
        'psychometry',
    })
  }

  /*
    ●●●● Telepatia

    Inteligência + Lábia/Subterfúgio
  */

  if (
    power.id ===
    'auspex_4'
  ) {
    const intelligence =
      getAttribute(
        game,
        'mental',
        'intelligence'
      )

    const subterfuge =
      getAbility(
        game,
        'subterfuge'
      )

    return createTest({
      power,

      attribute:
        'Inteligência',

      ability:
        'Lábia',

      attributeValue:
        intelligence,

      abilityValue:
        subterfuge,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'telepathy',
    })
  }

  /*
    ●●●●● Projeção Psíquica

    Percepção + Ocultismo
  */

  if (
    power.id ===
    'auspex_5'
  ) {
    const perception =
      getAttribute(
        game,
        'mental',
        'perception'
      )

    const occult =
      getAbility(
        game,
        'occult'
      )

    return createTest({
      power,

      attribute:
        'Percepção',

      ability:
        'Ocultismo',

      attributeValue:
        perception,

      abilityValue:
        occult,

      difficulty: 7,

      special:
        'psychic-projection',
    })
  }

  return null
}

/*
  ========================================
  CELERIDADE
  ========================================
*/

function buildCelerityTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  return createTest({
    power,

    requiresTest:
      false,

    notes: [
      `Celeridade ${power.level} será processada pelo sistema de combate e ações.`,
    ],

    special:
      'celerity',
  })
}

/*
  ========================================
  DEMÊNCIA
  ========================================
*/

function buildDementiaTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  /*
    ● Paixão

    Carisma + Empatia
  */

  if (
    power.id ===
    'dementia_1'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const empathy =
      getAbility(
        game,
        'empathy'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Empatia',

      attributeValue:
        charisma,

      abilityValue:
        empathy,

      difficulty:
        getTargetHumanity(
          evaluation
        ),

      special:
        'passion',
    })
  }

  /*
    ●● A Assombração

    Manipulação + Lábia
  */

  if (
    power.id ===
    'dementia_2'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const subterfuge =
      getAbility(
        game,
        'subterfuge'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Lábia',

      attributeValue:
        manipulation,

      abilityValue:
        subterfuge,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'haunting',
    })
  }

  /*
    ●●● Olhos do Caos

    Percepção + Ocultismo
  */

  if (
    power.id ===
    'dementia_3'
  ) {
    const perception =
      getAttribute(
        game,
        'mental',
        'perception'
      )

    const occult =
      getAbility(
        game,
        'occult'
      )

    return createTest({
      power,

      attribute:
        'Percepção',

      ability:
        'Ocultismo',

      attributeValue:
        perception,

      abilityValue:
        occult,

      difficulty: 7,

      special:
        'eyes-of-chaos',
    })
  }

  /*
    ●●●● Voz da Loucura

    Manipulação + Empatia
  */

  if (
    power.id ===
    'dementia_4'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const empathy =
      getAbility(
        game,
        'empathy'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Empatia',

      attributeValue:
        manipulation,

      abilityValue:
        empathy,

      difficulty: 7,

      special:
        'voice-of-madness',
    })
  }

  /*
    ●●●●● Insanidade Total

    Manipulação + Intimidação
  */

  if (
    power.id ===
    'dementia_5'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const intimidation =
      getAbility(
        game,
        'intimidation'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Intimidação',

      attributeValue:
        manipulation,

      abilityValue:
        intimidation,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'total-insanity',
    })
  }

  return null
}

/*
  ========================================
  DOMINAÇÃO
  ========================================
*/

function buildDominateTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  /*
    ● Comando

    Manipulação + Intimidação.

    A dificuldade usa a Força
    de Vontade do alvo.
  */

  if (
    power.id ===
    'dominate_1'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const intimidation =
      getAbility(
        game,
        'intimidation'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Intimidação',

      attributeValue:
        manipulation,

      abilityValue:
        intimidation,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'dominate-command',

      notes: [
        'A ordem precisa ser curta e compreensível.',
      ],
    })
  }

  /*
    ●● Mesmerizar

    Manipulação + Liderança
  */

  if (
    power.id ===
    'dominate_2'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const leadership =
      getAbility(
        game,
        'leadership'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Liderança',

      attributeValue:
        manipulation,

      abilityValue:
        leadership,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'dominate-mesmerize',
    })
  }

  /*
    ●●● A Mente Esquecida

    Raciocínio + Lábia
  */

  if (
    power.id ===
    'dominate_3'
  ) {
    const wits =
      getAttribute(
        game,
        'mental',
        'wits'
      )

    const subterfuge =
      getAbility(
        game,
        'subterfuge'
      )

    return createTest({
      power,

      attribute:
        'Raciocínio',

      ability:
        'Lábia',

      attributeValue:
        wits,

      abilityValue:
        subterfuge,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'forgetful-mind',

      notes: [
        'A quantidade de sucessos determinará quanto da memória pode ser alterado.',
      ],
    })
  }

  /*
    ●●●● Condicionamento

    Carisma + Liderança
  */

  if (
    power.id ===
    'dominate_4'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const leadership =
      getAbility(
        game,
        'leadership'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Liderança',

      attributeValue:
        charisma,

      abilityValue:
        leadership,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'conditioning',

      notes: [
        'Condicionamento exige usos repetidos e não produz submissão completa em uma única cena.',
      ],
    })
  }

  /*
    ●●●●● Possessão

    Carisma + Intimidação
  */

  if (
    power.id ===
    'dominate_5'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const intimidation =
      getAbility(
        game,
        'intimidation'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Intimidação',

      attributeValue:
        charisma,

      abilityValue:
        intimidation,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      opposed:
        true,

      resistance: {
        type:
          'willpower',

        value:
          getTargetWillpower(
            evaluation
          ),
      },

      special:
        'possession',
    })
  }

  return null
}

/*
  ========================================
  FORTITUDE
  ========================================
*/

function buildFortitudeTest(
  game,
  evaluation
) {
  return createTest({
    power:
      evaluation.power,

    requiresTest:
      false,

    special:
      'fortitude',

    notes: [
      'Fortitude será aplicada automaticamente pelo sistema de dano e absorção.',
    ],
  })
}

/*
  ========================================
  OFUSCAÇÃO
  ========================================
*/

function buildObfuscateTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  /*
    ● Manto de Sombras
  */

  if (
    power.id ===
    'obfuscate_1'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'cloak-of-shadows',
    })
  }

  /*
    ●● Presença Invisível
  */

  if (
    power.id ===
    'obfuscate_2'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'unseen-presence',
    })
  }

  /*
    ●●● Máscara das Mil Faces

    Manipulação + Performance
  */

  if (
    power.id ===
    'obfuscate_3'
  ) {
    const manipulation =
      getAttribute(
        game,
        'social',
        'manipulation'
      )

    const performance =
      getAbility(
        game,
        'performance'
      )

    return createTest({
      power,

      attribute:
        'Manipulação',

      ability:
        'Performance',

      attributeValue:
        manipulation,

      abilityValue:
        performance,

      difficulty: 7,

      special:
        'mask-thousand-faces',
    })
  }

  /*
    ●●●● Desaparecer da Mente

    Carisma + Furtividade
  */

  if (
    power.id ===
    'obfuscate_4'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const stealth =
      getAbility(
        game,
        'stealth'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Furtividade',

      attributeValue:
        charisma,

      abilityValue:
        stealth,

      difficulty: 7,

      special:
        'vanish-minds-eye',
    })
  }

  /*
    ●●●●● Encobrir o Grupo

    Sem teste próprio.
    Usa o nível de Ofuscação.
  */

  if (
    power.id ===
    'obfuscate_5'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'cloak-gathering',
    })
  }

  return null
}

/*
  ========================================
  POTÊNCIA
  ========================================
*/

function buildPotencyTest(
  game,
  evaluation
) {
  return createTest({
    power:
      evaluation.power,

    requiresTest:
      false,

    special:
      'potency',

    notes: [
      'Potência será integrada diretamente aos testes e ao dano físico.',
    ],
  })
}

/*
  ========================================
  PRESENÇA
  ========================================
*/

function buildPresenceTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  /*
    ● Fascínio

    Carisma + Performance
  */

  if (
    power.id ===
    'presence_1'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const performance =
      getAbility(
        game,
        'performance'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Performance',

      attributeValue:
        charisma,

      abilityValue:
        performance,

      difficulty: 7,

      special:
        'awe',
    })
  }

  /*
    ●● Olhar Aterrorizante

    Carisma + Intimidação
  */

  if (
    power.id ===
    'presence_2'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const intimidation =
      getAbility(
        game,
        'intimidation'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Intimidação',

      attributeValue:
        charisma,

      abilityValue:
        intimidation,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'dread-gaze',
    })
  }

  /*
    ●●● Transe

    Aparência + Empatia
  */

  if (
    power.id ===
    'presence_3'
  ) {
    const appearance =
      getAttribute(
        game,
        'social',
        'appearance'
      )

    const empathy =
      getAbility(
        game,
        'empathy'
      )

    return createTest({
      power,

      attribute:
        'Aparência',

      ability:
        'Empatia',

      attributeValue:
        appearance,

      abilityValue:
        empathy,

      difficulty:
        getTargetWillpower(
          evaluation
        ),

      special:
        'entrancement',
    })
  }

  /*
    ●●●● Convocação

    Carisma + Lábia
  */

  if (
    power.id ===
    'presence_4'
  ) {
    const charisma =
      getAttribute(
        game,
        'social',
        'charisma'
      )

    const subterfuge =
      getAbility(
        game,
        'subterfuge'
      )

    return createTest({
      power,

      attribute:
        'Carisma',

      ability:
        'Lábia',

      attributeValue:
        charisma,

      abilityValue:
        subterfuge,

      difficulty: 5,

      special:
        'summon',
    })
  }

  /*
    ●●●●● Majestade

    Ativação direta.
  */

  if (
    power.id ===
    'presence_5'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'majesty',

      notes: [
        'Alvos que desejem resistir poderão precisar de testes próprios.',
      ],
    })
  }

  return null
}

/*
  ========================================
  PROTEANISMO
  ========================================
*/

function buildProteanTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  /*
    ● Olhos da Besta
  */

  if (
    power.id ===
    'protean_1'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'eyes-of-beast',
    })
  }

  /*
    ●● Garras da Besta
  */

  if (
    power.id ===
    'protean_2'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'feral-claws',

      notes: [
        'As garras serão tratadas pelo sistema de combate como arma natural de dano agravado.',
      ],
    })
  }

  /*
    ●●● Fusão com a Terra
  */

  if (
    power.id ===
    'protean_3'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'earth-meld',
    })
  }

  /*
    ●●●● Forma da Besta
  */

  if (
    power.id ===
    'protean_4'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'shape-of-beast',
    })
  }

  /*
    ●●●●● Forma de Névoa
  */

  if (
    power.id ===
    'protean_5'
  ) {
    return createTest({
      power,

      requiresTest:
        false,

      special:
        'mist-form',
    })
  }

  return null
}

/*
  ========================================
  TAUMATURGIA
  CAMINHO DO SANGUE
  ========================================
*/

function buildThaumaturgyTest(
  game,
  evaluation
) {
  const power =
    evaluation.power

  /*
    Regra-base do nosso motor:
    Força de Vontade como parada.

    A dificuldade poderá ser alterada
    por caminho, ritual e contexto.
  */

  const willpower =
    Math.max(
      1,
      safeNumber(
        game?.willpower
          ?.current ??
        game?.willpower
          ?.maximum,
        1
      )
    )

  /*
    ● Um Gosto por Sangue
  */

  if (
    power.id ===
    'thaumaturgy_1'
  ) {
    return createTest({
      power,

      attribute:
        'Força de Vontade',

      ability:
        null,

      attributeValue:
        willpower,

      abilityValue: 0,

      difficulty: 4,

      special:
        'taste-for-blood',
    })
  }

  /*
    ●● Fúria do Sangue
  */

  if (
    power.id ===
    'thaumaturgy_2'
  ) {
    return createTest({
      power,

      attribute:
        'Força de Vontade',

      ability:
        null,

      attributeValue:
        willpower,

      abilityValue: 0,

      difficulty: 5,

      special:
        'blood-rage',
    })
  }

  /*
    ●●● Sangue Potente
  */

  if (
    power.id ===
    'thaumaturgy_3'
  ) {
    return createTest({
      power,

      attribute:
        'Força de Vontade',

      ability:
        null,

      attributeValue:
        willpower,

      abilityValue: 0,

      difficulty: 6,

      special:
        'blood-of-potency',
    })
  }

  /*
    ●●●● Roubo de Vitae
  */

  if (
    power.id ===
    'thaumaturgy_4'
  ) {
    return createTest({
      power,

      attribute:
        'Força de Vontade',

      ability:
        null,

      attributeValue:
        willpower,

      abilityValue: 0,

      difficulty: 7,

      special:
        'theft-of-vitae',
    })
  }

  /*
    ●●●●● Caldeirão de Sangue
  */

  if (
    power.id ===
    'thaumaturgy_5'
  ) {
    return createTest({
      power,

      attribute:
        'Força de Vontade',

      ability:
        null,

      attributeValue:
        willpower,

      abilityValue: 0,

      difficulty: 8,

      special:
        'cauldron-of-blood',
    })
  }

  return null
}

/*
  ========================================
  CONSTRUÇÃO PRINCIPAL
  ========================================
*/

export function buildDisciplineTest(
  game,
  evaluation
) {
  const power =
    evaluation?.power

  if (!power) {
    return null
  }

  if (
    power.discipline ===
    'animalism'
  ) {
    return buildAnimalismTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'auspex'
  ) {
    return buildAuspexTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'celerity'
  ) {
    return buildCelerityTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'dementia'
  ) {
    return buildDementiaTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'dominate'
  ) {
    return buildDominateTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'fortitude'
  ) {
    return buildFortitudeTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'obfuscate'
  ) {
    return buildObfuscateTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'potency'
  ) {
    return buildPotencyTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'presence'
  ) {
    return buildPresenceTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'protean'
  ) {
    return buildProteanTest(
      game,
      evaluation
    )
  }

  if (
    power.discipline ===
    'thaumaturgy'
  ) {
    return buildThaumaturgyTest(
      game,
      evaluation
    )
  }

  return createTest({
    power,

    attribute:
      'Atributo',

    ability:
      'Habilidade',

    attributeValue: 1,

    abilityValue: 0,

    difficulty: 6,

    notes: [
      'Este poder ainda não possui uma regra específica.',
    ],
  })
}

/*
  ========================================
  EXECUTAR TESTE
  ========================================
*/

export function executeDisciplineTest(
  game,
  evaluation
) {
  const test =
    buildDisciplineTest(
      game,
      evaluation
    )

  if (!test) {
    return null
  }

  /*
    Poder automático.
  */

  if (
    !test.requiresTest
  ) {
    return {
      ...test,

      dice: [],

      result:
        'success',

      successes: 1,

      rawSuccesses: 1,

      ones: 0,

      automatic:
        true,
    }
  }

  const dice =
    rollDice(
      test.pool
    )

  const resolution =
    resolveDice(
      dice,
      test.difficulty
    )

  return {
    ...test,

    dice,

    ...resolution,

    automatic:
      false,
  }
}

/*
  ========================================
  QUALIDADE DO SUCESSO
  ========================================
*/

export function getDisciplineSuccessLevel(
  roll
) {
  if (
    !roll
  ) {
    return 'none'
  }

  if (
    roll.result ===
    'botch'
  ) {
    return 'botch'
  }

  if (
    roll.result ===
    'failure'
  ) {
    return 'failure'
  }

  const successes =
    safeNumber(
      roll.successes,
      0
    )

  if (
    successes >= 5
  ) {
    return 'extraordinary'
  }

  if (
    successes >= 3
  ) {
    return 'strong'
  }

  if (
    successes >= 2
  ) {
    return 'good'
  }

  return 'minimal'
}

/*
  ========================================
  DURAÇÃO GENÉRICA POR SUCESSOS

  Alguns poderes usarão isto.
  Outros terão regras próprias.
  ========================================
*/

export function getGenericDisciplineDuration(
  roll
) {
  const successes =
    Math.max(
      0,
      safeNumber(
        roll?.successes,
        0
      )
    )

  if (
    successes <= 0
  ) {
    return {
      value: 0,
      unit: 'none',
      label: 'Sem efeito',
    }
  }

  if (
    successes === 1
  ) {
    return {
      value: 1,
      unit: 'scene',
      label: 'Uma cena',
    }
  }

  if (
    successes === 2
  ) {
    return {
      value: 1,
      unit: 'hour',
      label: 'Uma hora',
    }
  }

  if (
    successes === 3
  ) {
    return {
      value: 1,
      unit: 'night',
      label: 'Uma noite',
    }
  }

  if (
    successes === 4
  ) {
    return {
      value: 1,
      unit: 'week',
      label: 'Uma semana',
    }
  }

  return {
    value: 1,
    unit: 'month',
    label: 'Um mês',
  }
}

/*
  ========================================
  DADOS PARA DEBUG
  ========================================
*/

export function getDisciplineTestDebug(
  game,
  evaluation
) {
  const test =
    buildDisciplineTest(
      game,
      evaluation
    )

  if (!test) {
    return null
  }

  return {
    powerId:
      test.powerId,

    discipline:
      test.discipline,

    label:
      test.label,

    requiresTest:
      test.requiresTest,

    attribute:
      test.attribute,

    attributeValue:
      test.attributeValue,

    ability:
      test.ability,

    abilityValue:
      test.abilityValue,

    bonusDice:
      test.bonusDice,

    pool:
      test.pool,

    difficulty:
      test.difficulty,

    opposed:
      test.opposed,

    resistance:
      test.resistance,

    special:
      test.special,

    notes:
      test.notes,
  }
}

export default {
  buildDisciplineTest,
  executeDisciplineTest,
  getDisciplineSuccessLevel,
  getGenericDisciplineDuration,
  getDisciplineTestDebug,
}