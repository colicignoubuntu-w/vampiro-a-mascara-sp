import {
  getDisciplinePower,
} from './disciplineEngine'

import {
  getDisciplineSuccessLevel,
  getGenericDisciplineDuration,
} from './disciplineTestEngine'

import {
  markWitnessMemoryAltered,
  raiseMasqueradeExposure,
} from '../masqueradeEngine'

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

function safeArray(
  value
) {
  return Array.isArray(
    value
  )
    ? value
    : []
}

function getTarget(
  evaluation
) {
  return (
    evaluation?.choice
      ?.target ??
    {}
  )
}

function addHistory(
  game,
  entry
) {
  return {
    ...game,

    history: [
      ...(game.history ?? []),

      {
        ...entry,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

function setFlag(
  game,
  key,
  value = true
) {
  return {
    ...game,

    flags: {
      ...(game.flags ?? {}),

      [key]:
        value,
    },
  }
}

function setEffect(
  game,
  key,
  value
) {
  return {
    ...game,

    disciplineEffects: {
      ...(game.disciplineEffects ??
        {}),

      [key]:
        value,
    },
  }
}

/*
  ========================================
  TESTEMUNHA DA MÁSCARA
  ========================================
*/

function findWitness(
  game,
  target
) {
  const witnesses =
    safeArray(
      game?.masquerade
        ?.witnesses
    )

  if (
    target.witnessId
  ) {
    return (
      witnesses.find(
        (witness) =>
          witness.id ===
          target.witnessId
      ) ??
      null
    )
  }

  if (
    target.id
  ) {
    return (
      witnesses.find(
        (witness) =>
          witness.id ===
          target.id
      ) ??
      null
    )
  }

  if (
    target.name
  ) {
    return (
      witnesses.find(
        (witness) =>
          witness.name ===
          target.name
      ) ??
      null
    )
  }

  return null
}

/*
  ========================================
  EFEITO PRINCIPAL
  ========================================
*/

export function applyDisciplineEffect(
  game,
  evaluation,
  roll = null
) {
  if (
    !game ||
    !evaluation?.power
  ) {
    return {
      game,
      effect: null,
    }
  }

  const power =
    getDisciplinePower(
      evaluation.power.id
    )

  if (!power) {
    return {
      game,
      effect: null,
    }
  }

  const result =
    roll?.result ??
    'success'

  if (
    result !== 'success'
  ) {
    return applyFailedDisciplineEffect(
      game,
      evaluation,
      roll
    )
  }

  switch (
    power.discipline
  ) {
    case 'animalism':
      return applyAnimalism(
        game,
        evaluation,
        roll
      )

    case 'auspex':
      return applyAuspex(
        game,
        evaluation,
        roll
      )

    case 'celerity':
      return applyCelerity(
        game,
        evaluation,
        roll
      )

    case 'dementia':
      return applyDementia(
        game,
        evaluation,
        roll
      )

    case 'dominate':
      return applyDominate(
        game,
        evaluation,
        roll
      )

    case 'fortitude':
      return applyFortitude(
        game,
        evaluation,
        roll
      )

    case 'obfuscate':
      return applyObfuscate(
        game,
        evaluation,
        roll
      )

    case 'potency':
      return applyPotency(
        game,
        evaluation,
        roll
      )

    case 'presence':
      return applyPresence(
        game,
        evaluation,
        roll
      )

    case 'protean':
      return applyProtean(
        game,
        evaluation,
        roll
      )

    case 'thaumaturgy':
      return applyThaumaturgy(
        game,
        evaluation,
        roll
      )

    default:
      return {
        game,
        effect: null,
      }
  }
}

/*
  ========================================
  FALHA / FALHA CRÍTICA
  ========================================
*/

function applyFailedDisciplineEffect(
  game,
  evaluation,
  roll
) {
  const power =
    evaluation.power

  const botch =
    roll?.result ===
    'botch'

  let updatedGame =
    addHistory(
      game,
      {
        type:
          'discipline-effect-failed',

        powerId:
          power.id,

        discipline:
          power.discipline,

        result:
          roll?.result ??
          'failure',

        dice:
          roll?.dice ??
          [],
      }
    )

  if (
    botch
  ) {
    updatedGame =
      setFlag(
        updatedGame,
        `discipline_botch_${power.id}`,
        true
      )
  }

  return {
    game:
      updatedGame,

    effect: {
      success:
        false,

      botch,

      powerId:
        power.id,

      message:
        botch
          ? 'O uso da Disciplina saiu dramaticamente errado.'
          : 'A Disciplina não produziu o efeito desejado.',
    },
  }
}

/*
  ========================================
  ANIMALISMO
  ========================================
*/

function applyAnimalism(
  game,
  evaluation,
  roll
) {
  const power =
    evaluation.power

  const target =
    getTarget(
      evaluation
    )

  let updatedGame =
    game

  if (
    power.id ===
    'animalism_1'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'animalCommunication',
        {
          active: true,

          targetId:
            target.id ??
            null,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'animalism_2'
  ) {
    updatedGame =
      setFlag(
        updatedGame,
        'animalismAnimalsCalled',
        true
      )
  }

  if (
    power.id ===
    'animalism_3'
  ) {
    updatedGame =
      setFlag(
        updatedGame,
        'targetBeastQuelled',
        true
      )
  }

  if (
    power.id ===
    'animalism_4'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'animalPossession',
        {
          active: true,

          targetId:
            target.id ??
            null,
        }
      )
  }

  if (
    power.id ===
    'animalism_5'
  ) {
    updatedGame =
      setFlag(
        updatedGame,
        'beastTransferred',
        true
      )
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'animalism-effect',

        powerId:
          power.id,

        target:
          target.id ??
          null,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,
    },
  }
}

/*
  ========================================
  AUSPÍCIOS
  ========================================
*/

function applyAuspex(
  game,
  evaluation,
  roll
) {
  const power =
    evaluation.power

  const target =
    getTarget(
      evaluation
    )

  let updatedGame =
    game

  if (
    power.id ===
    'auspex_1'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'heightenedSenses',
        {
          active: true,

          perceptionBonus: 2,

          startedAt:
            new Date()
              .toISOString(),
        }
      )
  }

  if (
    power.id ===
    'auspex_2'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'lastAuraRead',
        {
          targetId:
            target.id ??
            null,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'auspex_3'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'lastPsychometry',
        {
          objectId:
            target.id ??
            null,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'auspex_4'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'telepathy',
        {
          targetId:
            target.id ??
            null,

          active: true,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'auspex_5'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'psychicProjection',
        {
          active: true,

          bodyLocation:
            game.world
              ?.location ??
            null,
        }
      )
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'auspex-effect',

        powerId:
          power.id,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,
    },
  }
}

/*
  ========================================
  CELERIDADE
  ========================================
*/

function applyCelerity(
  game,
  evaluation
) {
  const power =
    evaluation.power

  const level =
    safeNumber(
      power.progressiveValue ??
      power.level,
      1
    )

  let updatedGame =
    setEffect(
      game,
      'celerity',
      {
        active: true,

        level,

        extraActions:
          level,

        scene:
          game.story
            ?.scene ??
          null,
      }
    )

  updatedGame =
    setFlag(
      updatedGame,
      'celerityActive',
      true
    )

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'celerity-activated',

        level,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,

      extraActions:
        level,
    },
  }
}

/*
  ========================================
  DEMÊNCIA
  ========================================
*/

function applyDementia(
  game,
  evaluation,
  roll
) {
  const power =
    evaluation.power

  const target =
    getTarget(
      evaluation
    )

  const duration =
    getGenericDisciplineDuration(
      roll
    )

  let updatedGame =
    game

  if (
    power.id ===
    'dementia_1'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'dementiaPassion',
        {
          targetId:
            target.id ??
            null,

          active: true,

          duration,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'dementia_2'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'dementiaHaunting',
        {
          targetId:
            target.id ??
            null,

          active: true,

          duration,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'dementia_3'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'eyesOfChaos',
        {
          active: true,

          successes:
            roll?.successes ??
            1,

          context:
            evaluation.choice
              ?.context ??
            {},
        }
      )
  }

  if (
    power.id ===
    'dementia_4'
  ) {
    updatedGame =
      setFlag(
        updatedGame,
        'dementiaVoiceOfMadness',
        true
      )
  }

  if (
    power.id ===
    'dementia_5'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'totalInsanity',
        {
          targetId:
            target.id ??
            null,

          active: true,

          duration,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'dementia-effect',

        powerId:
          power.id,

        target:
          target.id ??
          null,

        successes:
          roll?.successes ??
          1,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,

      duration,
    },
  }
}

/*
  ========================================
  DOMINAÇÃO
  ========================================
*/

function applyDominate(
  game,
  evaluation,
  roll
) {
  const power =
    evaluation.power

  const target =
    getTarget(
      evaluation
    )

  let updatedGame =
    game

  /*
    ● Comando
  */

  if (
    power.id ===
    'dominate_1'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'lastDominateCommand',
        {
          targetId:
            target.id ??
            null,

          command:
            evaluation.choice
              ?.text ??
            '',

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  /*
    ●● Mesmerizar
  */

  if (
    power.id ===
    'dominate_2'
  ) {
    const duration =
      getGenericDisciplineDuration(
        roll
      )

    updatedGame =
      setEffect(
        updatedGame,
        'mesmerize',
        {
          targetId:
            target.id ??
            null,

          instruction:
            evaluation.choice
              ?.text ??
            '',

          duration,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  /*
    ●●● A Mente Esquecida

    Se o alvo corresponder a uma
    testemunha registrada da Máscara,
    a testemunha é marcada como contida.
  */

  if (
    power.id ===
    'dominate_3'
  ) {
    const witness =
      findWitness(
        updatedGame,
        target
      )

    if (witness) {
      updatedGame =
        markWitnessMemoryAltered(
          updatedGame,
          witness.id,
          'Memória alterada com A Mente Esquecida.'
        )
    }

    updatedGame =
      setEffect(
        updatedGame,
        'forgetfulMind',
        {
          targetId:
            target.id ??
            null,

          witnessId:
            witness?.id ??
            null,

          successes:
            roll?.successes ??
            1,

          memoryContained:
            Boolean(
              witness
            ),
        }
      )
  }

  /*
    ●●●● Condicionamento
  */

  if (
    power.id ===
    'dominate_4'
  ) {
    const conditioning =
      game.disciplineEffects
        ?.conditioning ??
      {}

    const targetId =
      target.id ??
      'unknown'

    const previous =
      safeNumber(
        conditioning[
          targetId
        ]?.points,
        0
      )

    updatedGame =
      setEffect(
        updatedGame,
        'conditioning',
        {
          ...conditioning,

          [targetId]: {
            points:
              previous +
              Math.max(
                1,
                roll?.successes ??
                  1
              ),

            updatedAt:
              new Date()
                .toISOString(),
          },
        }
      )
  }

  /*
    ●●●●● Possessão
  */

  if (
    power.id ===
    'dominate_5'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'possession',
        {
          active: true,

          targetId:
            target.id ??
            null,

          successes:
            roll?.successes ??
            1,

          originalBodyLocation:
            game.world
              ?.location ??
            null,
        }
      )
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'dominate-effect',

        powerId:
          power.id,

        target:
          target.id ??
          null,

        successes:
          roll?.successes ??
          1,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,

      targetId:
        target.id ??
        null,
    },
  }
}

/*
  ========================================
  FORTITUDE
  ========================================
*/

function applyFortitude(
  game,
  evaluation
) {
  const power =
    evaluation.power

  const level =
    safeNumber(
      power.progressiveValue ??
      power.level,
      1
    )

  let updatedGame =
    setEffect(
      game,
      'fortitude',
      {
        active: true,

        level,

        soakBonus:
          level,

        aggravatedSoakDice:
          level,
      }
    )

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'fortitude-active',

        level,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,

      soakBonus:
        level,

      aggravatedSoakDice:
        level,
    },
  }
}

/*
  ========================================
  OFUSCAÇÃO
  ========================================
*/

function applyObfuscate(
  game,
  evaluation,
  roll
) {
  const power =
    evaluation.power

  let updatedGame =
    game

  if (
    power.id ===
    'obfuscate_1'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'obfuscate',
        {
          active: true,

          level: 1,

          mode:
            'cloak-of-shadows',

          movementAllowed:
            false,
        }
      )
  }

  if (
    power.id ===
    'obfuscate_2'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'obfuscate',
        {
          active: true,

          level: 2,

          mode:
            'unseen-presence',

          movementAllowed:
            true,
        }
      )
  }

  if (
    power.id ===
    'obfuscate_3'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'obfuscateDisguise',
        {
          active: true,

          level: 3,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'obfuscate_4'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'obfuscate',
        {
          active: true,

          level: 4,

          mode:
            'vanish',

          movementAllowed:
            true,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'obfuscate_5'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'obfuscate',
        {
          active: true,

          level: 5,

          mode:
            'cloak-group',

          movementAllowed:
            true,

          group:
            true,
        }
      )
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'obfuscate-effect',

        powerId:
          power.id,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,
    },
  }
}

/*
  ========================================
  POTÊNCIA
  ========================================
*/

function applyPotency(
  game,
  evaluation
) {
  const power =
    evaluation.power

  const level =
    safeNumber(
      power.progressiveValue ??
      power.level,
      1
    )

  let updatedGame =
    setEffect(
      game,
      'potency',
      {
        active: true,

        level,

        strengthBonus:
          level,

        damageBonus:
          level,
      }
    )

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'potency-active',

        level,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,

      strengthBonus:
        level,

      damageBonus:
        level,
    },
  }
}

/*
  ========================================
  PRESENÇA
  ========================================
*/

function applyPresence(
  game,
  evaluation,
  roll
) {
  const power =
    evaluation.power

  const target =
    getTarget(
      evaluation
    )

  const duration =
    getGenericDisciplineDuration(
      roll
    )

  let updatedGame =
    game

  if (
    power.id ===
    'presence_1'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'awe',
        {
          active: true,

          targetId:
            target.id ??
            null,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'presence_2'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'dreadGaze',
        {
          targetId:
            target.id ??
            null,

          successes:
            roll?.successes ??
            1,

          active:
            true,
        }
      )
  }

  if (
    power.id ===
    'presence_3'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'entrancement',
        {
          targetId:
            target.id ??
            null,

          duration,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'presence_4'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'summon',
        {
          targetId:
            target.id ??
            null,

          active: true,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  if (
    power.id ===
    'presence_5'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'majesty',
        {
          active: true,

          scene:
            game.story
              ?.scene ??
            null,
        }
      )
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'presence-effect',

        powerId:
          power.id,

        target:
          target.id ??
          null,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,

      duration,
    },
  }
}

/*
  ========================================
  PROTEANISMO
  ========================================
*/

function applyProtean(
  game,
  evaluation
) {
  const power =
    evaluation.power

  let updatedGame =
    game

  if (
    power.id ===
    'protean_1'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'eyesOfBeast',
        {
          active: true,

          darkVision:
            true,
        }
      )
  }

  if (
    power.id ===
    'protean_2'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'feralClaws',
        {
          active: true,

          weaponType:
            'natural',

          damageType:
            'aggravated',

          damageBonus: 1,
        }
      )

    updatedGame =
      setFlag(
        updatedGame,
        'proteanClawsActive',
        true
      )
  }

  if (
    power.id ===
    'protean_3'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'earthMeld',
        {
          active: true,

          protectedFromSun:
            true,

          immobilized:
            true,
        }
      )
  }

  if (
    power.id ===
    'protean_4'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'beastForm',
        {
          active: true,

          transformed:
            true,
        }
      )
  }

  if (
    power.id ===
    'protean_5'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'mistForm',
        {
          active: true,

          transformed:
            true,

          physicalAttackImmune:
            true,
        }
      )
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'protean-effect',

        powerId:
          power.id,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,
    },
  }
}

/*
  ========================================
  TAUMATURGIA — CAMINHO DO SANGUE
  ========================================
*/

function applyThaumaturgy(
  game,
  evaluation,
  roll
) {
  const power =
    evaluation.power

  const target =
    getTarget(
      evaluation
    )

  let updatedGame =
    game

  /*
    ● Um Gosto por Sangue
  */

  if (
    power.id ===
    'thaumaturgy_1'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'tasteForBlood',
        {
          sampleId:
            target.id ??
            null,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  /*
    ●● Fúria do Sangue
  */

  if (
    power.id ===
    'thaumaturgy_2'
  ) {
    updatedGame =
      setEffect(
        updatedGame,
        'bloodRage',
        {
          targetId:
            target.id ??
            null,

          successes:
            roll?.successes ??
            1,
        }
      )
  }

  /*
    ●●● Sangue Potente
  */

  if (
    power.id ===
    'thaumaturgy_3'
  ) {
    const successes =
      Math.max(
        1,
        roll?.successes ??
          1
      )

    updatedGame =
      setEffect(
        updatedGame,
        'bloodOfPotency',
        {
          active: true,

          generationReduction:
            Math.min(
              3,
              successes
            ),

          successes,
        }
      )
  }

  /*
    ●●●● Roubo de Vitae
  */

  if (
    power.id ===
    'thaumaturgy_4'
  ) {
    const amount =
      Math.max(
        1,
        roll?.successes ??
          1
      )

    const currentBlood =
      safeNumber(
        updatedGame.blood
          ?.current,
        0
      )

    const maxBlood =
      safeNumber(
        updatedGame.blood
          ?.maximum,
        currentBlood
      )

    updatedGame = {
      ...updatedGame,

      blood: {
        ...(updatedGame.blood ??
          {}),

        current:
          Math.min(
            maxBlood,
            currentBlood +
              amount
          ),
      },

      disciplineEffects: {
        ...(updatedGame.disciplineEffects ??
          {}),

        theftOfVitae: {
          targetId:
            target.id ??
            null,

          amount,
        },
      },
    }
  }

  /*
    ●●●●● Caldeirão de Sangue
  */

  if (
    power.id ===
    'thaumaturgy_5'
  ) {
    const aggravatedDamage =
      Math.max(
        1,
        roll?.successes ??
          1
      )

    updatedGame =
      setEffect(
        updatedGame,
        'cauldronOfBlood',
        {
          targetId:
            target.id ??
            null,

          aggravatedDamage,
        }
      )
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'thaumaturgy-effect',

        powerId:
          power.id,

        target:
          target.id ??
          null,

        successes:
          roll?.successes ??
          1,
      }
    )

  return {
    game:
      updatedGame,

    effect: {
      success: true,

      powerId:
        power.id,
    },
  }
}

/*
  ========================================
  RISCO DA MÁSCARA APÓS USO
  ========================================
*/

export function applyDisciplineMasqueradeRisk(
  game,
  evaluation,
  context = {}
) {
  const power =
    evaluation?.power

  if (!power) {
    return game
  }

  const visible =
    Boolean(
      context.visible
    )

  if (!visible) {
    return game
  }

  const witnesses =
    safeArray(
      context.witnesses
    )

  const risk =
    power.masqueradeRisk ??
    'none'

  if (
    risk === 'none'
  ) {
    return game
  }

  let amount = 1

  if (
    risk === 'medium'
  ) {
    amount = 2
  }

  if (
    risk === 'high'
  ) {
    amount = 3
  }

  if (
    risk === 'severe'
  ) {
    amount = 4
  }

  return raiseMasqueradeExposure(
    game,
    {
      amount,

      reason:
        `${power.label} foi usado de forma perceptível diante de testemunhas.`,

      witnesses,

      sceneId:
        game.story
          ?.scene ??
        null,
    }
  )
}

/*
  ========================================
  CONSULTAR EFEITO ATIVO
  ========================================
*/

export function getActiveDisciplineEffect(
  game,
  effectId
) {
  return (
    game?.disciplineEffects
      ?.[effectId] ??
    null
  )
}

export function hasActiveDisciplineEffect(
  game,
  effectId
) {
  const effect =
    getActiveDisciplineEffect(
      game,
      effectId
    )

  return Boolean(
    effect?.active
  )
}

/*
  ========================================
  LIMPAR EFEITO
  ========================================
*/

export function clearDisciplineEffect(
  game,
  effectId
) {
  if (
    !game?.disciplineEffects
  ) {
    return game
  }

  const effects = {
    ...game.disciplineEffects,
  }

  delete effects[
    effectId
  ]

  return {
    ...game,

    disciplineEffects:
      effects,

    history: [
      ...(game.history ??
        []),

      {
        type:
          'discipline-effect-ended',

        effectId,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

/*
  ========================================
  LIMPAR EFEITOS DE CENA
  ========================================
*/

export function clearSceneDisciplineEffects(
  game
) {
  if (
    !game?.disciplineEffects
  ) {
    return game
  }

  const persistent = {}

  /*
    Estes efeitos podem sobreviver à
    troca de cena.
  */

  const persistentKeys = [
    'conditioning',
    'entrancement',
    'totalInsanity',
    'dementiaHaunting',
    'possession',
    'bloodOfPotency',
  ]

  for (
    const key of persistentKeys
  ) {
    if (
      game.disciplineEffects[
        key
      ]
    ) {
      persistent[key] =
        game.disciplineEffects[
          key
        ]
    }
  }

  return {
    ...game,

    disciplineEffects:
      persistent,
  }
}

export default {
  applyDisciplineEffect,
  applyDisciplineMasqueradeRisk,

  getActiveDisciplineEffect,
  hasActiveDisciplineEffect,

  clearDisciplineEffect,
  clearSceneDisciplineEffects,
}