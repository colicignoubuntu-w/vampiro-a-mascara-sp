const liviaApartmentTests = {
  'livia_apartment_inside.investigate_livia_apartment': {
    id: 'investigate-livia-apartment',
    label: 'Percepção + Investigação',
    attributeGroup: 'mental',
    attribute: 'perception',
    attributeLabel: 'Percepção',
    ability: 'investigation',
    abilityLabel: 'Investigação',
    difficulty: 6,
    outcomes: {
      success: {
        nextScene: 'livia_apartment_investigation_success',
        timeMinutes: 5,
        flags: {
          noticedCamarillaSearch: true,
          foundLiviaPhysicalLeads: true,
        },
      },
      failure: {
        nextScene: 'livia_apartment_investigation_failure',
        timeMinutes: 5,
      },
      botch: {
        nextScene: 'livia_apartment_investigation_failure',
        timeMinutes: 8,
        flags: {
          misreadApartmentSearch: true,
        },
      },
    },
    successText:
      'Você reconhece uma busca cuidadosa e encontra os fragmentos que foram deixados para trás.',
    failureText:
      'Você não consegue distinguir vestígios de busca da desordem do apartamento.',
    botchText:
      'A desordem leva você a conclusões erradas sobre o que aconteceu ali.',
  },

  'livia_computer.hack_livia_password': {
    id: 'hack-livia-password',
    label: 'Raciocínio + Computador',
    attributeGroup: 'mental',
    attribute: 'wits',
    attributeLabel: 'Raciocínio',
    ability: 'computer',
    abilityLabel: 'Computador',
    difficulty: 7,
    outcomes: {
      success: {
        nextScene: 'livia_computer_unlocked',
        timeMinutes: 10,
        flags: {
          hackedLiviaComputer: true,
          unlockedLiviaComputer: true,
        },
      },
      failure: {
        nextScene: 'livia_computer_hack_failed',
        timeMinutes: 10,
      },
      botch: {
        nextScene: 'livia_computer_hack_failed',
        timeMinutes: 15,
        flags: {
          triggeredLiviaComputerProtection: true,
        },
      },
    },
    successText:
      'Você encontra uma falha antiga no sistema e contorna a senha.',
    failureText:
      'A proteção resiste às suas tentativas.',
    botchText:
      'O sistema bloqueia suas tentativas antes que você consiga avançar.',
  },

  'livia_computer.reason_livia_password': {
    id: 'reason-livia-password',
    label: 'Raciocínio + Investigação',
    attributeGroup: 'mental',
    attribute: 'wits',
    attributeLabel: 'Raciocínio',
    ability: 'investigation',
    abilityLabel: 'Investigação',
    difficulty: 6,
    outcomes: {
      success: {
        nextScene: 'livia_password_clue_found',
        timeMinutes: 5,
        flags: {
          discoveredLiviaPassword: true,
        },
      },
      failure: {
        nextScene: 'livia_password_reasoning_failed',
        timeMinutes: 5,
      },
      botch: {
        nextScene: 'livia_password_reasoning_failed',
        timeMinutes: 8,
        flags: {
          misreadLiviaPasswordClue: true,
        },
      },
    },
    successText:
      'As lembranças e os objetos finalmente formam uma resposta coerente.',
    failureText:
      'Você ainda não consegue relacionar a dica ao que Lívia deixou.',
    botchText:
      'Uma associação errada leva você para longe da resposta.',
  },
}

export function getLiviaApartmentChoiceTest(
  sceneId,
  choiceId
) {
  return (
    liviaApartmentTests[
      `${sceneId}.${choiceId}`
    ] ?? null
  )
}

export default liviaApartmentTests
