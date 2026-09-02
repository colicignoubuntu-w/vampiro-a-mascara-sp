export const AUDIO_CATALOG = {
  music: {
    main_menu: {
      title: 'Menu Principal',
      src: '/audio/music/main-menu.mp3',
      volume: 0.5,
      loop: true,
      stream: true,
    },
    awakening: {
      title: 'Despertar',
      src: '/audio/music/awakening.mp3',
      volume: 0.48,
      loop: true,
      stream: true,
    },
    judgment: {
      title: 'Julgamento',
      src: '/audio/music/judgment.mp3',
      volume: 0.55,
      loop: true,
      stream: true,
    },
    investigation: {
      title: 'Investigação',
      src: '/audio/music/investigation.mp3',
      volume: 0.45,
      loop: true,
      stream: true,
    },
    city_night: {
      title: 'Noite na Cidade',
      src: '/audio/music/city-night.mp3',
      volume: 0.42,
      loop: true,
      stream: true,
    },
    police_tension: {
      title: 'Tensão Policial',
      src: '/audio/music/police-tension.mp3',
      volume: 0.5,
      loop: true,
      stream: true,
    },
  },

  ambience: {
    hospital: {
      src: '/audio/ambience/ambience.mp3',
      volume: 0.5,
      loop: true,
      stream: true,
    },
    city_night: {
      src: '/audio/ambience/city-night.mp3',
      volume: 0.3,
      loop: true,
      stream: true,
    },
    apartment: {
      src: '/audio/ambience/apartment.mp3',
      volume: 0.28,
      loop: true,
      stream: true,
    },
    court: {
      src: '/audio/ambience/court.mp3',
      volume: 0.3,
      loop: true,
      stream: true,
    },
  },

  sfx: {
    police_siren: {
      src: '/audio/sfx/police-siren.mp3',
      volume: 0.8,
    },
    door_open: {
      src: '/audio/sfx/door-open.mp3',
      volume: 0.75,
    },
    dice_roll: {
      src: '/audio/sfx/dice-roll.mp3',
      volume: 0.65,
    },
    gunshot: {
      src: '/audio/sfx/gunshot.mp3',
      volume: 0.85,
    },
  },
}

export const SCENE_AUDIO = {
  main_menu: {
    music: 'main_menu',
  },
  awakening: {
    music: 'awakening',
    ambience: 'hospital',
  },
  judgment_arrival: {
    music: 'judgment',
    ambience: 'court',
    sfx: ['door_open'],
  },
  livia_apartment_arrival: {
    music: 'investigation',
    ambience: 'apartment',
    sfx: ['door_open'],
  },
  free_roam: {
    music: 'city_night',
    ambience: 'city_night',
  },
  police_stop: {
    music: 'police_tension',
    ambience: 'city_night',
    sfx: ['police_siren'],
  },
}

export function getSceneAudio(
  sceneId,
  scene
) {
  if (scene?.audio) {
    return scene.audio
  }

  if (SCENE_AUDIO[sceneId]) {
    return SCENE_AUDIO[sceneId]
  }

  if (sceneId?.startsWith('judgment_')) {
    return {
      music: 'judgment',
      ambience: 'court',
    }
  }

  if (sceneId?.startsWith('livia_apartment')) {
    return {
      music: 'investigation',
      ambience: 'apartment',
    }
  }

  if (
    sceneId?.startsWith('police_')
  ) {
    return {
      music: 'police_tension',
      ambience: 'city_night',
    }
  }

  return null
}
