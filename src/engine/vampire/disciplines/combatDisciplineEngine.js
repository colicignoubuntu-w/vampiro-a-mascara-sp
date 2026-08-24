import {
  canUseDisciplinePower,
  getDisciplineDefinition,
  getDisciplineLevel,
  getDisciplinePower,
  payDisciplineCost,
} from './disciplineEngine'

import {
  applyDisciplineEffect,
} from './disciplineEffectEngine'

import {
  buildDisciplineTest,
} from './disciplineTestEngine'

import {
  triggerNpcFrenzy,
} from '../frenzy/npcFrenzyEngine'

function safeNumber(
  value,
  fallback = 0
) {
  const parsed =
    Number(value)

  return Number.isNaN(parsed)
    ? fallback
    : parsed
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
          new Date().toISOString(),
      },
    ],
  }
}

function getEnemyTarget(
  combat
) {
  const enemy =
    combat?.enemy ?? {}

  return {
    id:
      enemy.id ??
      combat?.encounterId ??
      'combat_enemy',

    name:
      enemy.name ??
      'Inimigo',

    type:
      enemy.type ??
      (
        enemy.vampire
          ? 'vampire'
          : 'human'
      ),

    generation:
      enemy.generation ??
      null,

    willpower:
      enemy.willpower ??
      6,

    humanity:
      enemy.humanity ??
      7,

    intelligence:
      enemy.attributes
        ?.mental
        ?.intelligence ??
      enemy.intelligence ??
      2,

    selfControl:
      enemy.virtues
        ?.selfControl ??
      3,

    requiresEyeContact:
      true,

    eyeContact:
      true,
  }
}

function buildAction({
  game,
  combat,
  id,
  powerId,
  text,
  description,
  target = 'enemy',
  consumesAction = true,
}) {
  const power =
    getDisciplinePower(
      powerId
    )

  if (!power) {
    return null
  }

  const targetData =
    target === 'self'
      ? {
          type:
            'self',
        }
      : getEnemyTarget(
          combat
        )

  const check =
    canUseDisciplinePower(
      game,
      powerId,
      {
        target:
          targetData,
      }
    )

  if (!check.allowed) {
    return null
  }

  return {
    id,
    powerId,

    discipline:
      power.discipline,

    level:
      power.level,

    label:
      power.label,

    text,
    description,

    target:
      targetData,

    bloodCost:
      safeNumber(
        power.bloodCost,
        0
      ),

    requiresTest:
      Boolean(
        power.requiresTest
      ),

    consumesAction,

    type:
      power.requiresTest
        ? 'test'
        : 'activation',
  }
}

export function getPassiveCombatDisciplines(
  game
) {
  return {
    potency: {
      active:
        getDisciplineLevel(
          game,
          'potency'
        ) > 0,

      level:
        getDisciplineLevel(
          game,
          'potency'
        ),
    },

    fortitude: {
      active:
        getDisciplineLevel(
          game,
          'fortitude'
        ) > 0,

      level:
        getDisciplineLevel(
          game,
          'fortitude'
        ),
    },
  }
}

function getCelerityAction(
  game,
  combat
) {
  const level =
    getDisciplineLevel(
      game,
      'celerity'
    )

  if (
    level <= 0 ||
    game?.disciplineEffects
      ?.celerity
      ?.active
  ) {
    return null
  }

  return buildAction({
    game,
    combat,

    id:
      'combat_celerity',

    powerId:
      `celerity_${Math.min(
        5,
        level
      )}`,

    text:
      'Liberar sua velocidade sobrenatural.',

    description:
      `${level} ação(ões) extra(s) durante o turno.`,

    target:
      'self',

    consumesAction:
      false,
  })
}

function getProteanActions(
  game,
  combat
) {
  const result = []

  const level =
    getDisciplineLevel(
      game,
      'protean'
    )

  if (
    level >= 1 &&
    !game?.disciplineEffects
      ?.eyesOfBeast
      ?.active
  ) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_eyes_of_beast',

        powerId:
          'protean_1',

        text:
          'Ativar Olhos da Besta.',

        description:
          'Enxergar perfeitamente mesmo na escuridão.',

        target:
          'self',

        consumesAction:
          false,
      })

    if (action) {
      result.push(action)
    }
  }

  if (
    level >= 2 &&
    !game?.disciplineEffects
      ?.feralClaws
      ?.active
  ) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_feral_claws',

        powerId:
          'protean_2',

        text:
          'Manifestar Garras da Besta.',

        description:
          'Libera ataques naturais de dano agravado.',

        target:
          'self',

        consumesAction:
          false,
      })

    if (action) {
      result.push(action)
    }
  }

  return result
}

function getAuspexActions(
  game,
  combat
) {
  if (
    getDisciplineLevel(
      game,
      'auspex'
    ) < 1 ||
    game?.disciplineEffects
      ?.heightenedSenses
      ?.active
  ) {
    return []
  }

  const action =
    buildAction({
      game,
      combat,

      id:
        'combat_auspex_1',

      powerId:
        'auspex_1',

      text:
        'Aguçar os sentidos.',

      description:
        'Aumentar sua percepção durante o confronto.',

      target:
        'self',

      consumesAction:
        false,
    })

  return action
    ? [action]
    : []
}

function getDominateActions(
  game,
  combat
) {
  const result = []

  const level =
    getDisciplineLevel(
      game,
      'dominate'
    )

  if (level >= 1) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_dominate_command',

        powerId:
          'dominate_1',

        text:
          '"Largue a arma."',

        description:
          'Usar Comando para obrigar o inimigo a largar a arma.',

        consumesAction:
          true,
      })

    if (action) {
      result.push(action)
    }
  }

  if (level >= 2) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_dominate_stop',

        powerId:
          'dominate_2',

        text:
          '"Pare de lutar."',

        description:
          'Tentar implantar uma instrução mais complexa.',

        consumesAction:
          true,
      })

    if (action) {
      result.push(action)
    }
  }

  return result
}

function getPresenceActions(
  game,
  combat
) {
  const result = []

  const level =
    getDisciplineLevel(
      game,
      'presence'
    )

  if (level >= 2) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_dread_gaze',

        powerId:
          'presence_2',

        text:
          'Usar Olhar Aterrorizante.',

        description:
          'Tentar fazer o inimigo recuar ou fugir.',

        consumesAction:
          true,
      })

    if (action) {
      result.push(action)
    }
  }

  if (
    level >= 5 &&
    !game?.disciplineEffects
      ?.majesty
      ?.active
  ) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_majesty',

        powerId:
          'presence_5',

        text:
          'Manifestar Majestade.',

        description:
          'Dominar o ambiente com presença sobrenatural.',

        target:
          'self',

        consumesAction:
          false,
      })

    if (action) {
      result.push(action)
    }
  }

  return result
}

function getDementiaActions(
  game,
  combat
) {
  const result = []

  const level =
    getDisciplineLevel(
      game,
      'dementia'
    )

  if (level >= 1) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_dementia_fear',

        powerId:
          'dementia_1',

        text:
          'Amplificar o medo do inimigo.',

        description:
          'Usar Paixão para aumentar o medo já existente.',

        consumesAction:
          true,
      })

    if (action) {
      result.push(action)
    }
  }

  if (level >= 4) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_voice_of_madness',

        powerId:
          'dementia_4',

        text:
          'Usar Voz da Loucura.',

        description:
          'Tentar provocar terror ou frenesi sobrenatural.',

        consumesAction:
          true,
      })

    if (action) {
      result.push(action)
    }
  }

  return result
}

function getAnimalismActions(
  game,
  combat
) {
  if (
    getDisciplineLevel(
      game,
      'animalism'
    ) < 3
  ) {
    return []
  }

  const action =
    buildAction({
      game,
      combat,

      id:
        'combat_quell_beast',

      powerId:
        'animalism_3',

      text:
        'Acalmar a Besta do inimigo.',

      description:
        'Tentar suprimir seus impulsos agressivos e bestiais.',

      consumesAction:
        true,
    })

  return action
    ? [action]
    : []
}

function getThaumaturgyActions(
  game,
  combat
) {
  const result = []

  const level =
    getDisciplineLevel(
      game,
      'thaumaturgy'
    )

  if (level >= 4) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_theft_of_vitae',

        powerId:
          'thaumaturgy_4',

        text:
          'Roubar vitae à distância.',

        description:
          'Extrair sangue sobrenaturalmente do inimigo.',

        consumesAction:
          true,
      })

    if (action) {
      result.push(action)
    }
  }

  if (level >= 5) {
    const action =
      buildAction({
        game,
        combat,

        id:
          'combat_cauldron_of_blood',

        powerId:
          'thaumaturgy_5',

        text:
          'Usar Caldeirão de Sangue.',

        description:
          'Fazer o sangue da vítima ferver dentro do próprio corpo.',

        consumesAction:
          true,
      })

    if (action) {
      result.push(action)
    }
  }

  return result
}

export function getCombatDisciplineActions(
  game,
  combat
) {
  if (
    !game ||
    !combat ||
    combat.status !==
      'active'
  ) {
    return []
  }

  return [
    getCelerityAction(
      game,
      combat
    ),

    ...getProteanActions(
      game,
      combat
    ),

    ...getAuspexActions(
      game,
      combat
    ),

    ...getDominateActions(
      game,
      combat
    ),

    ...getPresenceActions(
      game,
      combat
    ),

    ...getDementiaActions(
      game,
      combat
    ),

    ...getAnimalismActions(
      game,
      combat
    ),

    ...getThaumaturgyActions(
      game,
      combat
    ),
  ].filter(Boolean)
}

export function getCombatDisciplineAction(
  game,
  combat,
  actionId
) {
  return (
    getCombatDisciplineActions(
      game,
      combat
    ).find(
      (action) =>
        action.id ===
        actionId
    ) ??
    null
  )
}

export function buildCombatDisciplineEvaluation(
  game,
  combat,
  action
) {
  if (!action) {
    return null
  }

  const power =
    getDisciplinePower(
      action.powerId
    )

  if (!power) {
    return null
  }

  return {
    available: true,

    power,

    discipline:
      getDisciplineDefinition(
        power.discipline
      ),

    disciplineLevel:
      getDisciplineLevel(
        game,
        power.discipline
      ),

    choice: {
      id:
        action.id,

      powerId:
        power.id,

      text:
        action.text,

      description:
        action.description,

      target:
        action.target,

      context: {
        combat:
          true,

        visible:
          isCombatDisciplineVisible(
            power.id
          ),
      },
    },
  }
}

export function prepareCombatDisciplineAction({
  game,
  combat,
  actionId,
}) {
  const action =
    getCombatDisciplineAction(
      game,
      combat,
      actionId
    )

  if (!action) {
    return {
      success: false,

      reason:
        'Poder indisponível.',
    }
  }

  const evaluation =
    buildCombatDisciplineEvaluation(
      game,
      combat,
      action
    )

  if (!evaluation) {
    return {
      success: false,

      reason:
        'Não foi possível preparar a Disciplina.',
    }
  }

  return {
    success: true,

    action,

    evaluation,

    test:
      buildDisciplineTest(
        game,
        evaluation
      ),
  }
}

export function resolveCombatDisciplineAction({
  game,
  combat,
  action,
  evaluation,
  roll,
}) {
  if (
    !action ||
    !evaluation
  ) {
    return {
      success: false,
      game,
      combat,
      log: [],
    }
  }

  const result =
    roll?.result ??
    'success'

  let updatedGame =
    payDisciplineCost(
      game,
      action.powerId
    )

  const effectResult =
    applyDisciplineEffect(
      updatedGame,
      evaluation,
      roll ?? {
        result:
          'success',

        successes: 1,

        dice: [],
      }
    )

  updatedGame =
    effectResult.game

  let updatedCombat = {
    ...combat,
  }

  if (
    result === 'success'
  ) {
    updatedCombat =
      applyCombatSuccess({
        combat:
          updatedCombat,

        action,

        roll,
      })
  }

  if (
    result === 'botch'
  ) {
    updatedCombat = {
      ...updatedCombat,

      flags: {
        ...(updatedCombat.flags ??
          {}),

        disciplineBotch:
          true,

        lastDisciplineBotch:
          action.powerId,
      },
    }
  }

  updatedGame =
    addHistory(
      updatedGame,
      {
        type:
          'combat-discipline',

        actionId:
          action.id,

        powerId:
          action.powerId,

        result,

        successes:
          roll?.successes ??
          (
            result ===
              'success'
              ? 1
              : 0
          ),
      }
    )

  const extraLog =
    updatedCombat
      ?.pendingDisciplineLog ??
    []

  if (
    updatedCombat
      ?.pendingDisciplineLog
  ) {
    const cleanedCombat = {
      ...updatedCombat,
    }

    delete cleanedCombat
      .pendingDisciplineLog

    updatedCombat =
      cleanedCombat
  }

  return {
    success: true,

    game:
      updatedGame,

    combat:
      updatedCombat,

    consumesAction:
      Boolean(
        action.consumesAction
      ),

    result,

    effect:
      effectResult.effect,

    log: [
      {
        type:
          result ===
            'botch'
            ? 'discipline-botch'
            : 'discipline',

        text:
          getCombatResultText(
            action,
            result,
            roll
          ),
      },

      ...extraLog,
    ],
  }
}

function applyCombatSuccess({
  combat,
  action,
  roll,
}) {
  let updatedCombat = {
    ...combat,
  }

  const successes =
    Math.max(
      1,
      safeNumber(
        roll?.successes,
        1
      )
    )

  if (
    action.discipline ===
    'celerity'
  ) {
    const extra =
      action.level

    updatedCombat = {
      ...updatedCombat,

      turn: {
        ...(updatedCombat.turn ??
          {}),

        celerityActionsRemaining:
          extra,

        playerActionsRemaining:
          Math.max(
            safeNumber(
              updatedCombat
                ?.turn
                ?.playerActionsRemaining,
              1
            ),
            1 + extra
          ),
      },
    }
  }

  /*
    DOMINAÇÃO ●
    Corrigido para weaponId,
    que é o campo usado por combatEngine.
  */

  if (
    action.id ===
    'combat_dominate_command'
  ) {
    updatedCombat = {
      ...updatedCombat,

      enemy: {
        ...updatedCombat.enemy,

        weaponId:
          'fists',

        flags: {
          ...(updatedCombat.enemy
            ?.flags ??
            {}),

          disarmedByDominate:
            true,
        },
      },
    }
  }

  if (
    action.id ===
    'combat_dominate_stop'
  ) {
    updatedCombat = {
      ...updatedCombat,

      enemy: {
        ...updatedCombat.enemy,

        status: {
          ...(updatedCombat.enemy
            ?.status ??
            {}),

          dominated:
            true,

          skipActions:
            Math.max(
              1,
              successes
            ),
        },
      },
    }
  }

  if (
    action.id ===
    'combat_dread_gaze'
  ) {
    updatedCombat = {
      ...updatedCombat,

      enemy: {
        ...updatedCombat.enemy,

        status: {
          ...(updatedCombat.enemy
            ?.status ??
            {}),

          frightened:
            true,

          fearLevel:
            successes,
        },
      },
    }

    if (
      successes >= 3
    ) {
      updatedCombat = {
        ...updatedCombat,

        status:
          'finished',

        winner:
          'player',

        endingReason:
          'enemy-fled',
      }
    }
  }

  if (
    action.id ===
    'combat_dementia_fear'
  ) {
    updatedCombat = {
      ...updatedCombat,

      enemy: {
        ...updatedCombat.enemy,

        status: {
          ...(updatedCombat.enemy
            ?.status ??
            {}),

          dementiaFear:
            true,

          fearLevel:
            successes,
        },
      },
    }
  }

  if (
    action.id ===
    'combat_voice_of_madness'
  ) {
    const enemyIsVampire =
      Boolean(
        updatedCombat.enemy
          ?.vampire ||
        updatedCombat.enemy
          ?.type ===
          'vampire'
      )

    if (enemyIsVampire) {
      const frenzyResult =
        triggerNpcFrenzy({
          combat:
            updatedCombat,

          triggerType:
            'madness',

          severity:
            Math.min(
              5,
              successes + 1
            ),

          source:
            'dementia_voice_of_madness',
        })

      updatedCombat =
        frenzyResult.combat

      updatedCombat = {
        ...updatedCombat,

        pendingDisciplineLog: [
          ...(frenzyResult.log ?? []),

          ...(frenzyResult.roll
            ? [
                {
                  type:
                    'frenzy-test',

                  text:
                    `Teste da Besta: ${frenzyResult.roll.dice.join(', ')} · ${frenzyResult.roll.result}.`,
                },
              ]
            : []),
        ],
      }
    } else {
      updatedCombat = {
        ...updatedCombat,

        enemy: {
          ...updatedCombat.enemy,

          status: {
            ...(updatedCombat.enemy
              ?.status ??
              {}),

            madness:
              true,

            skipActions:
              Math.max(
                1,
                successes
              ),
          },
        },
      }
    }
  }

  if (
    action.id ===
    'combat_quell_beast'
  ) {
    updatedCombat = {
      ...updatedCombat,

      enemy: {
        ...updatedCombat.enemy,

        status: {
          ...(updatedCombat.enemy
            ?.status ??
            {}),

          beastQuelled:
            true,

          aggressionPenalty:
            successes,
        },
      },
    }
  }

  if (
    action.id ===
    'combat_theft_of_vitae'
  ) {
    updatedCombat = {
      ...updatedCombat,

      enemy: {
        ...updatedCombat.enemy,

        blood: {
          ...(updatedCombat.enemy
            ?.blood ??
            {}),

          current:
            Math.max(
              0,
              safeNumber(
                updatedCombat.enemy
                  ?.blood
                  ?.current,
                10
              ) -
                successes
            ),
        },
      },
    }
  }

  if (
    action.id ===
    'combat_cauldron_of_blood'
  ) {
    const health =
      updatedCombat.enemy
        ?.health ??
      {}

    const aggravated =
      safeNumber(
        health.aggravated,
        0
      ) +
      successes

    const currentLevel =
      safeNumber(
        health.bashing,
        0
      ) +
      safeNumber(
        health.lethal,
        0
      ) +
      aggravated

    updatedCombat = {
      ...updatedCombat,

      enemy: {
        ...updatedCombat.enemy,

        health: {
          ...health,

          aggravated,

          currentLevel,
        },
      },
    }

    if (
      currentLevel >=
      (
        updatedCombat.enemy
          ?.health
          ?.maximum ??
        7
      )
    ) {
      updatedCombat = {
        ...updatedCombat,

        status:
          'finished',

        winner:
          'player',

        endingReason:
          'enemy-incapacitated',
      }
    }
  }

  return updatedCombat
}

export function isCombatDisciplineVisible(
  powerId
) {
  return [
    'celerity_1',
    'celerity_2',
    'celerity_3',
    'celerity_4',
    'celerity_5',

    'protean_1',
    'protean_2',

    'presence_2',
    'presence_5',

    'dementia_4',

    'thaumaturgy_4',
    'thaumaturgy_5',
  ].includes(powerId)
}

function getCombatResultText(
  action,
  result,
  roll
) {
  if (
    result === 'botch'
  ) {
    return (
      `${action.label}: falha crítica. ` +
      'A situação se torna ainda mais perigosa.'
    )
  }

  if (
    result === 'failure'
  ) {
    return (
      `${action.label}: o poder não consegue afetar o alvo.`
    )
  }

  const successes =
    roll?.successes ??
    1

  if (
    action.id ===
    'combat_dominate_command'
  ) {
    return (
      'Sua voz atravessa a vontade do inimigo. Ele larga a arma.'
    )
  }

  if (
    action.id ===
    'combat_dominate_stop'
  ) {
    return (
      `O inimigo perde ${Math.max(
        1,
        successes
      )} ação(ões), preso à sua ordem.`
    )
  }

  if (
    action.id ===
    'combat_dread_gaze'
  ) {
    return (
      successes >= 3
        ? 'O terror é absoluto. O inimigo abandona o confronto e foge.'
        : 'O inimigo recua, tomado pelo medo sobrenatural.'
    )
  }

  if (
    action.id ===
    'combat_dementia_fear'
  ) {
    return (
      'O medo dentro do inimigo cresce além do controle.'
    )
  }

  if (
    action.id ===
    'combat_voice_of_madness'
  ) {
    return (
      `A Voz da Loucura domina a mente do inimigo por ${Math.max(
        1,
        successes
      )} ação(ões).`
    )
  }

  if (
    action.id ===
    'combat_quell_beast'
  ) {
    return (
      `A Besta do alvo é reprimida. Ele sofre -${Math.max(
        1,
        successes
      )} dado(s) em ataques enquanto o efeito persistir.`
    )
  }

  if (
    action.id ===
    'combat_theft_of_vitae'
  ) {
    return (
      `Você arranca ${successes} ponto(s) de vitae do inimigo.`
    )
  }

  if (
    action.id ===
    'combat_cauldron_of_blood'
  ) {
    return (
      `O sangue do inimigo ferve: ${successes} nível(is) de dano agravado.`
    )
  }

  return (
    `${action.label}: sucesso.`
  )
}

export default {
  getPassiveCombatDisciplines,

  getCombatDisciplineActions,
  getCombatDisciplineAction,

  buildCombatDisciplineEvaluation,
  prepareCombatDisciplineAction,
  resolveCombatDisciplineAction,

  isCombatDisciplineVisible,
}