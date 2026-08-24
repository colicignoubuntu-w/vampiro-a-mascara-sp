const daySleepScenes = {
  day_safe_demo: {
    id:
      'day_safe_demo',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Refúgio',

    daySafe:
      true,

    location: {
      id:
        'safe_haven_demo',

      name:
        'Refúgio Protegido',

      district:
        'São Paulo',
    },

    narration: [
      'A porta está trancada.',

      'As janelas foram completamente cobertas.',

      'Nenhuma fresta permite que a luz do lado de fora alcance o interior.',

      'Aqui você pode sobreviver ao dia.',
    ],

    choices: [],
  },

  day_wakeup_demo: {
    id:
      'day_wakeup_demo',

    chapter:
      'TESTE DE SISTEMA',

    title:
      'Outra Noite',

    daySafe:
      true,

    location: {
      id:
        'safe_haven_demo',

      name:
        'Refúgio Protegido',

      district:
        'São Paulo',
    },

    narration: [
      'A consciência retorna lentamente.',

      'O peso do dia desapareceu.',

      'Lá fora, São Paulo já está novamente mergulhada na noite.',

      'Você desperta.',
    ],

    choices: [],
  },
}

export default daySleepScenes