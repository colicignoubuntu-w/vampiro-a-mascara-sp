import {
  canUseDisciplinePower,
  getDisciplineDefinition,
  getDisciplineLevel,
  getDisciplinePower,
} from './disciplineEngine'

function safeArray(
  value
) {
  return Array.isArray(
    value
  )
    ? value
    : []
}

function safeObject(
  value
) {
  if (
    value &&
    typeof value ===
      'object' &&
    !Array.isArray(
      value
    )
  ) {
    return value
  }

  return {}
}

/*
  ========================================
  NORMALIZAR OPÇÃO DE DISCIPLINA
  ========================================
*/

export function normalizeDisciplineChoice(
  choice
) {
  if (
    !choice ||
    typeof choice !==
      'object'
  ) {
    return null
  }

  if (
    !choice.id ||
    !choice.powerId
  ) {
    return null
  }

  return {
    id:
      choice.id,

    powerId:
      choice.powerId,

    text:
      choice.text ??
      'Usar Disciplina',

    target:
      safeObject(
        choice.target
      ),

    nextScene:
      choice.nextScene ??
      null,

    successScene:
      choice.successScene ??
      null,

    failureScene:
      choice.failureScene ??
      null,

    botchScene:
      choice.botchScene ??
      null,

    timeMinutes:
      Number(
        choice.timeMinutes ??
        0
      ),

    flags:
      safeObject(
        choice.flags
      ),

    successFlags:
      safeObject(
        choice.successFlags
      ),

    failureFlags:
      safeObject(
        choice.failureFlags
      ),

    botchFlags:
      safeObject(
        choice.botchFlags
      ),

    description:
      choice.description ??
      '',

    hidden:
      Boolean(
        choice.hidden
      ),

    context:
      safeObject(
        choice.context
      ),
  }
}

/*
  ========================================
  VERIFICAR UMA OPÇÃO
  ========================================
*/

export function evaluateDisciplineChoice(
  game,
  choice
) {
  const normalized =
    normalizeDisciplineChoice(
      choice
    )

  if (!normalized) {
    return {
      available: false,

      reason:
        'Opção de Disciplina inválida.',

      choice: null,
    }
  }

  const power =
    getDisciplinePower(
      normalized.powerId
    )

  if (!power) {
    return {
      available: false,

      reason:
        `Poder não encontrado: ${normalized.powerId}`,

      choice:
        normalized,
    }
  }

  const check =
    canUseDisciplinePower(
      game,
      normalized.powerId,
      {
        target:
          normalized.target,

        ...normalized.context,
      }
    )

  const discipline =
    getDisciplineDefinition(
      power.discipline
    )

  const disciplineLevel =
    getDisciplineLevel(
      game,
      power.discipline
    )

  return {
    available:
      Boolean(
        check.allowed
      ),

    reason:
      check.reason ??
      null,

    choice:
      normalized,

    power,

    discipline,

    disciplineLevel,
  }
}

/*
  ========================================
  PEGAR TODAS AS OPÇÕES DA CENA
  ========================================
*/

export function getSceneDisciplineChoices(
  game,
  scene
) {
  if (!scene) {
    return []
  }

  const choices =
    safeArray(
      scene.disciplineChoices
    )

  return choices
    .map(
      (choice) =>
        evaluateDisciplineChoice(
          game,
          choice
        )
    )
    .filter(
      (entry) =>
        entry.choice
    )
}

/*
  ========================================
  SOMENTE DISPONÍVEIS

  Esse será o método principal usado
  pelo Game.jsx.
  ========================================
*/

export function getAvailableSceneDisciplineChoices(
  game,
  scene
) {
  return getSceneDisciplineChoices(
    game,
    scene
  ).filter(
    (entry) =>
      entry.available &&
      !entry.choice.hidden
  )
}

/*
  ========================================
  TODAS, INCLUSIVE BLOQUEADAS

  Útil para DEV e debug.
  ========================================
*/

export function getDebugSceneDisciplineChoices(
  game,
  scene
) {
  return getSceneDisciplineChoices(
    game,
    scene
  )
}

/*
  ========================================
  FORMATAR LABEL
  ========================================
*/

export function getDisciplineChoiceLabel(
  evaluation
) {
  if (
    !evaluation?.power
  ) {
    return 'DISCIPLINA'
  }

  const disciplineLabel =
    evaluation.discipline
      ?.label ??
    evaluation.power
      .discipline

  const dots =
    '●'.repeat(
      Math.max(
        1,
        Number(
          evaluation.power
            .level ??
          1
        )
      )
    )

  return (
    `${disciplineLabel} ${dots}`
  )
}

/*
  ========================================
  INFORMAÇÕES VISUAIS
  ========================================
*/

export function getDisciplineChoiceDisplay(
  evaluation
) {
  if (!evaluation) {
    return null
  }

  return {
    id:
      evaluation.choice
        ?.id ??
      null,

    powerId:
      evaluation.power
        ?.id ??
      null,

    label:
      getDisciplineChoiceLabel(
        evaluation
      ),

    powerLabel:
      evaluation.power
        ?.label ??
      'Poder',

    text:
      evaluation.choice
        ?.text ??
      'Usar Disciplina',

    description:
      evaluation.choice
        ?.description ??
      '',

    available:
      Boolean(
        evaluation.available
      ),

    unavailableReason:
      evaluation.reason ??
      null,

    bloodCost:
      Number(
        evaluation.power
          ?.bloodCost ??
        0
      ),

    requiresTest:
      Boolean(
        evaluation.power
          ?.requiresTest
      ),

    masqueradeRisk:
      evaluation.power
        ?.masqueradeRisk ??
      'none',

    levelRequired:
      Number(
        evaluation.power
          ?.level ??
        1
      ),

    disciplineLevel:
      Number(
        evaluation.disciplineLevel ??
        0
      ),
  }
}

/*
  ========================================
  ENCONTRAR OPÇÃO PELO ID
  ========================================
*/

export function findSceneDisciplineChoice(
  game,
  scene,
  choiceId
) {
  return (
    getSceneDisciplineChoices(
      game,
      scene
    ).find(
      (entry) =>
        entry.choice
          ?.id ===
        choiceId
    ) ??
    null
  )
}

/*
  ========================================
  VALIDAR EXECUÇÃO

  Chamamos novamente no clique para evitar
  que uma opção liberada na tela continue
  utilizável se o estado mudou.
  ========================================
*/

export function validateDisciplineChoiceExecution(
  game,
  scene,
  choiceId
) {
  const evaluation =
    findSceneDisciplineChoice(
      game,
      scene,
      choiceId
    )

  if (!evaluation) {
    return {
      allowed: false,

      reason:
        'Opção de Disciplina não encontrada.',

      evaluation:
        null,
    }
  }

  if (
    !evaluation.available
  ) {
    return {
      allowed: false,

      reason:
        evaluation.reason ??
        'Esta Disciplina não pode ser usada agora.',

      evaluation,
    }
  }

  return {
    allowed: true,

    reason: null,

    evaluation,
  }
}

/*
  ========================================
  RESOLVER DESTINO DE CENA

  Quando começarmos a rolar poderes,
  success / failure / botch terão
  destinos próprios.

  Poderes sem teste podem usar nextScene.
  ========================================
*/

export function getDisciplineChoiceNextScene(
  evaluation,
  result = 'success'
) {
  const choice =
    evaluation?.choice

  if (!choice) {
    return null
  }

  if (
    result === 'botch'
  ) {
    return (
      choice.botchScene ??
      choice.failureScene ??
      choice.nextScene ??
      null
    )
  }

  if (
    result === 'failure'
  ) {
    return (
      choice.failureScene ??
      choice.nextScene ??
      null
    )
  }

  return (
    choice.successScene ??
    choice.nextScene ??
    null
  )
}

/*
  ========================================
  FLAGS POR RESULTADO
  ========================================
*/

export function getDisciplineChoiceFlags(
  evaluation,
  result = 'success'
) {
  const choice =
    evaluation?.choice

  if (!choice) {
    return {}
  }

  if (
    result === 'botch'
  ) {
    return {
      ...choice.flags,
      ...choice.botchFlags,
    }
  }

  if (
    result === 'failure'
  ) {
    return {
      ...choice.flags,
      ...choice.failureFlags,
    }
  }

  return {
    ...choice.flags,
    ...choice.successFlags,
  }
}

export default {
  normalizeDisciplineChoice,
  evaluateDisciplineChoice,
  getSceneDisciplineChoices,
  getAvailableSceneDisciplineChoices,
  getDebugSceneDisciplineChoices,
  getDisciplineChoiceLabel,
  getDisciplineChoiceDisplay,
  findSceneDisciplineChoice,
  validateDisciplineChoiceExecution,
  getDisciplineChoiceNextScene,
  getDisciplineChoiceFlags,
}