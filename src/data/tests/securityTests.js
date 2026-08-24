const securityTests = {
  'security_approaches.say_fight': {
    id: 'security-say-fight',

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
          'security_charm_success',

        timeMinutes: 1,

        flags: {
          convincedSecurity: true,
        },
      },

      failure: {
        nextScene:
          'security_charm_failure',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
        },
      },

      botch: {
        nextScene:
          'security_charm_botch',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
          masqueradeRisk: 1,
        },
      },
    },

    successText:
      'Sua resposta parece simples e plausível.',

    failureText:
      'O segurança percebe alguma coisa estranha na sua história.',

    botchText:
      'Sua tentativa de parecer normal só faz a situação parecer ainda mais suspeita.',
  },

  'security_approaches.girlfriend_story': {
    id: 'security-girlfriend-story',

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
          'security_manipulation_success',

        timeMinutes: 1,

        flags: {
          liedToSecurity: true,
        },
      },

      failure: {
        nextScene:
          'security_charm_failure',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
        },
      },

      botch: {
        nextScene:
          'security_charm_botch',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
          masqueradeRisk: 1,
        },
      },
    },

    successText:
      'A mentira sai natural o suficiente para preencher as lacunas que o segurança esperava ouvir.',

    failureText:
      'A história não fecha completamente.',

    botchText:
      'Você se contradiz e chama ainda mais atenção.',
  },

  'security_approaches.act_casual': {
    id: 'security-act-casual',

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
          'security_charm_success',

        timeMinutes: 1,

        flags: {
          handledSecurityCasually: true,
        },
      },

      failure: {
        nextScene:
          'security_charm_failure',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
        },
      },

      botch: {
        nextScene:
          'security_charm_botch',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
          masqueradeRisk: 1,
        },
      },
    },

    successText:
      'Você age como alguém acostumado a situações ruins e faz o incidente parecer menor do que realmente é.',

    failureText:
      'Sua tentativa de parecer casual parece forçada.',

    botchText:
      'Sua tranquilidade diante de tanto sangue parece completamente anormal.',
  },

  'security_approaches.intimidate': {
    id: 'security-intimidate',

    label:
      'Manipulação + Intimidação',

    attributeGroup: 'social',
    attribute: 'manipulation',
    attributeLabel: 'Manipulação',

    ability: 'intimidation',
    abilityLabel: 'Intimidação',

    difficulty: 7,

    outcomes: {
      success: {
        nextScene:
          'security_intimidation_success',

        timeMinutes: 1,

        flags: {
          intimidatedSecurity: true,
          securitySuspicious: true,
        },
      },

      failure: {
        nextScene:
          'security_backup',

        timeMinutes: 1,

        flags: {
          securitySuspicious: true,
        },
      },

      botch: {
        nextScene:
          'security_charm_botch',

        timeMinutes: 1,

        flags: {
          securitySuspicious: true,
          masqueradeRisk: 1,
          securityCalledSupport: true,
        },
      },
    },

    successText:
      'Sua ameaça é sutil o suficiente para fazê-lo hesitar.',

    failureText:
      'Ele não se intimida e passa a tratar você como uma possível ameaça.',

    botchText:
      'Sua ameaça confirma exatamente o que ele temia.',
  },

  'security_approaches.scan_exit': {
    id: 'security-scan-exit',

    label: 'Raciocínio + Manha',

    attributeGroup: 'mental',
    attribute: 'wits',
    attributeLabel: 'Raciocínio',

    ability: 'streetwise',
    abilityLabel: 'Manha',

    difficulty: 6,

    outcomes: {
      success: {
        nextScene:
          'security_scan_success',

        timeMinutes: 1,

        flags: {
          foundSafeExit: true,
        },
      },

      failure: {
        nextScene:
          'security_charm_failure',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
        },
      },

      botch: {
        nextScene:
          'security_backup',

        timeMinutes: 2,

        flags: {
          securitySuspicious: true,
        },
      },
    },

    successText:
      'Você lê rapidamente o ambiente e encontra uma rota de saída melhor.',

    failureText:
      'Você perde tempo procurando uma saída e o segurança percebe sua intenção.',

    botchText:
      'Você olha diretamente para a saída e denuncia que está pensando em fugir.',
  },
}

export function getSecurityChoiceTest(
  sceneId,
  choiceId
) {
  const key =
    `${sceneId}.${choiceId}`

  return (
    securityTests[key] ??
    null
  )
}

export default securityTests