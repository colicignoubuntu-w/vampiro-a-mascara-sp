import {
  registerMasqueradeIncident,
} from '../../vampire/masqueradeEngine'

function createPoliceWitnesses() {
  const timestamp =
    Date.now()

  return [
    {
      id:
        `police-officer-1-${timestamp}`,

      name:
        'Policial 1',

      type:
        'police',

      knowsSupernatural:
        false,

      sawViolence:
        true,

      sawDiscipline:
        false,

      sawFeeding:
        false,
    },

    {
      id:
        `police-officer-2-${timestamp}`,

      name:
        'Policial 2',

      type:
        'police',

      knowsSupernatural:
        false,

      sawViolence:
        true,

      sawDiscipline:
        false,

      sawFeeding:
        false,
    },
  ]
}

export function resolvePoliceForceAction(
  game,
  actionId
) {
  if (!game) {
    return {
      success: false,

      game,

      result: null,
    }
  }

  /*
    ========================================
    ENTREGAR-SE
    ========================================
  */

  if (
    actionId ===
    'surrender'
  ) {
    const updatedGame = {
      ...game,

      flags: {
        ...(game.flags ?? {}),

        policeViolence:
          false,

        policeForceUsed:
          false,
      },

      history: [
        ...(game.history ?? []),

        {
          type:
            'police-force',

          action:
            'surrender',

          masqueradeRisk:
            false,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    return {
      success: true,

      game:
        updatedGame,

      result: {
        id:
          'surrender',

        title:
          'Você recua',

        narration: [
          'Você decide não transformar a abordagem em algo pior.',
          'As mãos permanecem visíveis.',
          'Os policiais ainda estão tensos, mas você não revela nada sobrenatural.',
        ],

        nextScene:
          'police_detained',

        masquerade:
          false,
      },
    }
  }

  /*
    ========================================
    RESISTÊNCIA HUMANA

    Aqui o personagem tenta reagir sem
    usar força claramente impossível.

    Isso pode provocar violência policial
    ou combate, mas NÃO é automaticamente
    uma quebra da Máscara.
    ========================================
  */

  if (
    actionId ===
    'normal_resistance'
  ) {
    const updatedGame = {
      ...game,

      flags: {
        ...(game.flags ?? {}),

        policeViolence:
          true,

        policeForceUsed:
          false,

        policePhysicalResistance:
          true,
      },

      history: [
        ...(game.history ?? []),

        {
          type:
            'police-force',

          action:
            'normal-resistance',

          masqueradeRisk:
            false,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    return {
      success: true,

      game:
        updatedGame,

      result: {
        id:
          'normal_resistance',

        title:
          'A situação explode',

        narration: [
          'Você reage fisicamente, mas tenta limitar cada movimento ao que um humano poderia realizar.',
          'O policial grita para você parar.',
          'O segundo policial entra na situação.',
          'Agora o problema é violência, não necessariamente a Máscara.',
        ],

        nextScene:
          'police_normal_resistance',

        masquerade:
          false,
      },
    }
  }

  /*
    ========================================
    FORÇA VAMPÍRICA

    Aqui o personagem faz algo claramente
    além do que um humano deveria conseguir.

    Dois policiais testemunham.
    ========================================
  */

  if (
    actionId ===
    'vampiric_strength'
  ) {
    const witnesses =
      createPoliceWitnesses()

    let updatedGame =
      registerMasqueradeIncident(
        game,
        'unnaturalStrength',
        {
          witnesses,

          sceneId:
            game.story
              ?.scene ??
            'police_force',
        }
      )

    updatedGame = {
      ...updatedGame,

      flags: {
        ...(updatedGame.flags ?? {}),

        policeViolence:
          true,

        policeForceUsed:
          true,

        supernaturalStrengthSeen:
          true,

        policeWitnessedSupernatural:
          true,

        possibleMasqueradeRisk:
          true,
      },

      history: [
        ...(updatedGame.history ?? []),

        {
          type:
            'police-force',

          action:
            'vampiric-strength',

          masqueradeRisk:
            true,

          witnesses:
            witnesses.map(
              (witness) => ({
                id:
                  witness.id,

                name:
                  witness.name,
              })
            ),

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    return {
      success: true,

      game:
        updatedGame,

      result: {
        id:
          'vampiric_strength',

        title:
          'Força Demais',

        narration: [
          'Você deixa de fingir fragilidade humana.',
          'O movimento acontece rápido demais e com força demais.',
          'O policial é jogado para trás como se pesasse quase nada.',
          'O outro homem congela por um instante.',
          'Ele viu.',
          'E sabe que aquilo não foi normal.',
        ],

        nextScene:
          'police_supernatural_seen',

        masquerade:
          true,
      },
    }
  }

  return {
    success: false,

    game,

    result: null,
  }
}