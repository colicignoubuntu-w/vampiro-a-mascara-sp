const huntingTests = {
  'hunting_bar.friendly_conversation': {
    id: 'hunt-friendly-conversation',

    label: 'Carisma + Lábia',

    attributeGroup: 'social',
    attribute: 'charisma',
    attributeLabel: 'Carisma',

    ability: 'subterfuge',
    abilityLabel: 'Lábia',

    difficulty: 6,

    outcomes: {
      success: {
        nextScene:
          'hunting_charm_success',

        timeMinutes: 5,
      },

      failure: {
        nextScene:
          'hunting_failed_approach',

        timeMinutes: 5,
      },

      botch: {
        nextScene:
          'hunting_insistence',

        timeMinutes: 5,

        flags: {
          awkwardHuntingApproach:
            true,
        },
      },
    },

    successText:
      'Você consegue iniciar uma conversa sem parecer ameaçador ou desesperado.',

    failureText:
      'A abordagem não gera interesse.',

    botchText:
      'Sua tentativa soa estranha e chama mais atenção do que deveria.',
  },

  'hunting_bar.read_mood': {
    id: 'hunt-read-mood',

    label: 'Percepção + Empatia',

    attributeGroup: 'mental',
    attribute: 'perception',
    attributeLabel: 'Percepção',

    ability: 'empathy',
    abilityLabel: 'Empatia',

    difficulty: 6,

    outcomes: {
      success: {
        nextScene:
          'hunting_empathy_success',

        timeMinutes: 3,
      },

      failure: {
        nextScene:
          'hunting_failed_approach',

        timeMinutes: 4,
      },

      botch: {
        nextScene:
          'hunting_insistence',

        timeMinutes: 4,

        flags: {
          badlyMisreadVictim: true,
        },
      },
    },

    successText:
      'Você percebe o estado emocional dela e entende qual abordagem teria mais chance de funcionar.',

    failureText:
      'Você não consegue interpretar corretamente os sinais.',

    botchText:
      'Você interpreta a situação de maneira completamente errada.',
  },

  'hunting_bar.invent_story': {
    id: 'hunt-invent-story',

    label: 'Manipulação + Lábia',

    attributeGroup: 'social',
    attribute: 'manipulation',
    attributeLabel: 'Manipulação',

    ability: 'subterfuge',
    abilityLabel: 'Lábia',

    difficulty: 7,

    outcomes: {
      success: {
        nextScene:
          'hunting_manipulation_success',

        timeMinutes: 4,
      },

      failure: {
        nextScene:
          'hunting_failed_approach',

        timeMinutes: 5,
      },

      botch: {
        nextScene:
          'hunting_insistence',

        timeMinutes: 5,

        flags: {
          obviousLieDuringHunt:
            true,
        },
      },
    },

    successText:
      'Sua história parece natural e desperta curiosidade.',

    failureText:
      'A mentira não convence.',

    botchText:
      'A história parece tão artificial que ela passa a desconfiar de você.',
  },

  'hunting_bar.street_approach': {
    id: 'hunt-street-approach',

    label: 'Carisma + Manha',

    attributeGroup: 'social',
    attribute: 'charisma',
    attributeLabel: 'Carisma',

    ability: 'streetwise',
    abilityLabel: 'Manha',

    difficulty: 6,

    outcomes: {
      success: {
        nextScene:
          'hunting_street_success',

        timeMinutes: 3,
      },

      failure: {
        nextScene:
          'hunting_failed_approach',

        timeMinutes: 4,
      },

      botch: {
        nextScene:
          'hunting_insistence',

        timeMinutes: 4,
      },
    },

    successText:
      'Você entende a dinâmica do lugar e se aproxima sem despertar preocupação.',

    failureText:
      'Você não consegue encontrar uma abertura natural.',

    botchText:
      'Sua abordagem chama atenção das pessoas erradas.',
  },
}

export function getHuntingChoiceTest(
  sceneId,
  choiceId
) {
  const key =
    `${sceneId}.${choiceId}`

  return (
    huntingTests[key] ??
    null
  )
}

export default huntingTests