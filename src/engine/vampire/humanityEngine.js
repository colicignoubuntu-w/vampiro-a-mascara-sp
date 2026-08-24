import {
  rollDicePool,
} from '../dice/rollTest'

import {
  detectViolationFromGame,
  getDegenerationDifficulty,
  shouldCheckHumanity,
} from './moralityHierarchy'

/*
  ============================================
  EXISTE TESTE DE DEGENERAÇÃO?
  ============================================
*/

export function needsDegenerationCheck(
  game
) {
  if (
    !game?.flags
      ?.humanityCheckRequired
  ) {
    return false
  }

  const violation =
    detectViolationFromGame(
      game
    )

  /*
    Mantemos compatibilidade com cenas
    antigas que possuem apenas
    humanityCheckRequired.
  */

  if (!violation) {
    return true
  }

  const humanity =
    game?.humanity
      ?.current ?? 0

  return shouldCheckHumanity({
    humanity,

    violationLevel:
      violation.level,
  })
}

/*
  ============================================
  CRIA O GATILHO
  ============================================
*/

export function createDegenerationTrigger(
  game
) {
  const humanity =
    game?.humanity
      ?.current ?? 0

  const violation =
    detectViolationFromGame(
      game
    )

  /*
    Fallback para cenas antigas.
  */

  if (!violation) {
    return {
      id:
        'generic-degeneration',

      violationId:
        'unknown',

      violationLevel: 5,

      title:
        'Sua Humanidade foi colocada à prova',

      description:
        'Você fez algo que entra em conflito com aquilo que ainda resta da sua moral humana.',

      memory:
        'Alguma parte de você sabe que ultrapassou um limite.',

      difficulty: 8,
    }
  }

  const difficulty =
    getDegenerationDifficulty({
      humanity,

      violationLevel:
        violation.level,
    })

  return {
    id:
      `degeneration-${violation.id}`,

    violationId:
      violation.id,

    violationLevel:
      violation.level,

    title:
      violation.title ??
      violation.label,

    description:
      violation.description,

    memory:
      violation.memory ??
      violation.description,

    difficulty,
  }
}

/*
  ============================================
  EXECUTA TESTE DE CONSCIÊNCIA
  ============================================
*/

export function executeDegenerationTest(
  game,
  trigger
) {
  const conscience =
    Math.max(
      1,
      Number(
        game?.virtues
          ?.conscience ??
        1
      )
    )

  const difficulty =
    Math.max(
      2,
      Math.min(
        10,
        Number(
          trigger?.difficulty ??
          8
        )
      )
    )

  const humanityBefore =
    game?.humanity
      ?.current ?? 0

  const roll =
    rollDicePool({
      pool:
        conscience,

      difficulty,
    })

  return {
    ...roll,

    type:
      'degeneration',

    triggerId:
      trigger?.id ??
      'unknown',

    violationId:
      trigger
        ?.violationId ??
      'unknown',

    violationLevel:
      trigger
        ?.violationLevel ??
      null,

    conscience,

    difficulty,

    humanityBefore,

    timestamp:
      new Date()
        .toISOString(),
  }
}

/*
  ============================================
  APLICA RESULTADO
  ============================================
*/

export function applyDegenerationResult(
  game,
  trigger,
  roll
) {
  const currentHumanity =
    Number(
      game?.humanity
        ?.current ?? 0
    )

  /*
    Sucesso:
    mantém Humanidade.

    Falha:
    perde 1.

    Falha crítica:
    também perde 1, porém grava
    consequência narrativa mais grave.

    Mais tarde poderemos criar
    perturbações temporárias aqui.
  */

  const losesHumanity =
    roll.result !==
    'success'

  const humanityAfter =
    losesHumanity
      ? Math.max(
          0,
          currentHumanity - 1
        )
      : currentHumanity

  const severe =
    roll.result ===
    'botch'

  const degenerationRecord = {
    trigger:
      trigger.id,

    violationId:
      trigger.violationId,

    violationLevel:
      trigger.violationLevel,

    title:
      trigger.title,

    result:
      roll.result,

    difficulty:
      roll.difficulty,

    dice:
      roll.dice,

    successes:
      roll.successes,

    humanityBefore:
      currentHumanity,

    humanityAfter,

    humanityLost:
      currentHumanity -
      humanityAfter,

    severe,

    gameTime:
      game?.world
        ? `${String(
            game.world.hour ?? 0
          ).padStart(
            2,
            '0'
          )}:${String(
            game.world.minute ?? 0
          ).padStart(
            2,
            '0'
          )}`
        : null,

    timestamp:
      new Date()
        .toISOString(),
  }

  return {
    ...game,

    humanity: {
      ...(game.humanity ?? {}),

      current:
        humanityAfter,

      maximum:
        game.humanity
          ?.maximum ??
        humanityAfter,
    },

    flags: {
      ...(game.flags ?? {}),

      humanityCheckRequired:
        false,

      ...(losesHumanity
        ? {
            humanityLost:
              true,

            resistedDegeneration:
              false,
          }
        : {
            humanityLost:
              false,

            resistedDegeneration:
              true,
          }),

      ...(severe
        ? {
            severeDegeneration:
              true,

            psychologicalScarPending:
              true,
          }
        : {}),
    },

    morality: {
      ...(game.morality ??
        {}),

      lastDegeneration:
        degenerationRecord,

      degenerationHistory: [
        ...(game.morality
          ?.degenerationHistory ??
          []),

        degenerationRecord,
      ],
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'degeneration',

        trigger:
          trigger.id,

        violationId:
          trigger.violationId,

        violationLevel:
          trigger.violationLevel,

        result:
          roll.result,

        difficulty:
          roll.difficulty,

        dice:
          roll.dice,

        successes:
          roll.successes,

        humanityBefore:
          currentHumanity,

        humanityAfter,

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}

/*
  ============================================
  LIMPA O ATO JULGADO
  ============================================
*/

export function clearHumanityTriggerFlags(
  game
) {
  return {
    ...game,

    flags: {
      ...(game.flags ?? {}),

      humanityCheckRequired:
        false,

      killedHumanByFeeding:
        false,

      possibleVictimDeath:
        false,

      violentAssault:
        false,

      endangeredHumanByFeeding:
        false,

      seriouslyDrainedVictim:
        false,

      moralityViolation:
        null,

      moralityViolationTitle:
        null,

      moralityViolationMemory:
        null,
    },
  }
}

/*
  ============================================
  IGNORA TESTE DESNECESSÁRIO
  ============================================

  Isso é importante.

  Se o personagem já tem Humanidade
  tão baixa que determinado ato não
  viola mais sua Hierarquia atual,
  precisamos limpar a flag para que
  o Game.jsx não fique tentando abrir
  o teste eternamente.
*/

export function clearIrrelevantDegeneration(
  game
) {
  if (
    !game?.flags
      ?.humanityCheckRequired
  ) {
    return game
  }

  const violation =
    detectViolationFromGame(
      game
    )

  if (!violation) {
    return game
  }

  const humanity =
    game?.humanity
      ?.current ?? 0

  const required =
    shouldCheckHumanity({
      humanity,

      violationLevel:
        violation.level,
    })

  if (required) {
    return game
  }

  return {
    ...game,

    flags: {
      ...(game.flags ?? {}),

      humanityCheckRequired:
        false,

      moralityViolation:
        null,

      moralityViolationTitle:
        null,

      moralityViolationMemory:
        null,

      killedHumanByFeeding:
        false,

      possibleVictimDeath:
        false,

      violentAssault:
        false,

      endangeredHumanByFeeding:
        false,

      seriouslyDrainedVictim:
        false,
    },

    history: [
      ...(game.history ?? []),

      {
        type:
          'morality-no-check',

        violationId:
          violation.id,

        violationLevel:
          violation.level,

        humanity,

        reason:
          'O ato está acima do limite moral atual do personagem e não provoca nova degeneração.',

        timestamp:
          new Date()
            .toISOString(),
      },
    ],
  }
}