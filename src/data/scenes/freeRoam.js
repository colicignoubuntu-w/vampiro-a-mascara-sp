const freeRoamScenes = {
  free_roam: {
    id:
      'free_roam',

    chapter:
      'NOITE LIVRE',

    title:
      'São Paulo',

    location: null,

    narration: [
      'Você chegou ao destino.',

      'A noite continua.',
    ],

    choices: [
      {
        id:
          'return_haven',

        text:
          'Voltar para o apartamento de Lívia',

        nextScene:
          'free_roam',

        timeMinutes: 0,

        flags: {
          openMapRequested:
            true,
        },
      },
    ],
  },
}

export default freeRoamScenes