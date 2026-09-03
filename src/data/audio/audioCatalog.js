function musicTrack(
  title,
  file,
  volume = 0.5
) {
  return {
    title,
    src:
      `/audio/music/${encodeURIComponent(file)}`,
    volume,
    loop: false,
    stream: true,
  }
}

const music = {
  main_menu: musicTrack('Main Menu', 'main-menu.mp3'),
  santa_monica: musicTrack('Santa Monica Theme', '02 - Santa Monica Theme.mp3'),
  creepy_ambience_1: musicTrack('Creepy Ambience 1', '03 - Creepy Ambience 1.mp3'),
  the_asylum: musicTrack('The Asylum', '04 - The Asylum ~ {Chiasm - Isolated}.mp3'),
  disturbed_twisted: musicTrack('Disturbed and Twisted', '05 - Disturbed and Twisted.mp3'),
  police_alert: musicTrack('Police Alert', '06 - Police Alert.mp3'),
  disturbed_combat: musicTrack('Disturbed and Twisted Combat', '07 - Disturbed and Twisted Combat.mp3'),
  generic_combat: musicTrack('Generic Combat', '08 - Generic Combat.mp3'),
  short_cutscene_1: musicTrack('Short Cutscene 1', '09 - Short Cutscene 1.mp3'),
  downtown_theme: musicTrack('Downtown Theme', '10 - Downtown Theme.mp3'),
  creepy_ambience_2: musicTrack('Creepy Ambience 2', '11 - Creepy Ambience 2.mp3'),
  downtown_alternate: musicTrack('Downtown Hub — Alternativa', '12 - Downtown Hub (Unused Alternate).mp3'),
  club_confession: musicTrack('Club Confession', '13 - Club Confession ~ {Ministry - Bloodlines}.mp3'),
  dangerous_places: musicTrack('Dangerous Places', '14 - Dangerous Places.mp3'),
  empire_hotel: musicTrack('Empire Hotel Banquet', '15 - Empire Hotel Banquet ~ {Darling Violetta - Smaller God}.mp3'),
  dangerous_combat: musicTrack('Dangerous Places Combat', '16 - Dangerous Places Combat.mp3'),
  last_round: musicTrack('The Last Round', '17 - The Last Round ~ {Genitorturers - Lecher Bitch}.mp3'),
  short_cutscene_2: musicTrack('Short Cutscene 2', '18 - Short Cutscene 2.mp3'),
  hollywood_theme: musicTrack('Hollywood Theme', '19 - Hollywood Theme.mp3'),
  creepy_ambience_3: musicTrack('Creepy Ambience 3', '20 - Creepy Ambience 3.mp3'),
  vesuvius: musicTrack('Vesuvius', '21 - Vesuvius.mp3'),
  luckee_star: musicTrack('Luckee Star', '22 - Luckee Star.mp3'),
  asp_hole: musicTrack('The Asp Hole', '23 - The Asp Hole ~ {Tiamat - Cain}.mp3'),
  theater_gargoyle: musicTrack('Theater Gargoyle', '24 - Theater Gargoyle.mp3'),
  vesuvius_alternate: musicTrack('Vesuvius — Alternativa', '25 - Vesuvius (Unused Alternate).mp3'),
  short_cutscene_3: musicTrack('Short Cutscene 3', '26 - Short Cutscene 3.mp3'),
  chinatown_theme: musicTrack('Chinatown Theme', '27 - Chinatown Theme.mp3'),
  creepy_ambience_combat: musicTrack('Creepy Ambience Combat', '28 - Creepy Ambience Combat.mp3'),
  the_crypt: musicTrack('The Crypt', '29 - The Crypt.mp3'),
  glaze_club_pound: musicTrack('Glaze Club — Pound', '30 - Glaze Club ~ {Aerial - Pound}.mp3'),
  crypt_combat: musicTrack('Crypt Combat', '31 - Crypt Combat.mp3'),
  tikal_jungle: musicTrack('Tikal Jungle', '32 - Tikal Jungle (Unused).mp3'),
  dark_asia: musicTrack('Dark Asia', '33 - Dark Asia.mp3'),
  glaze_club_come_alive: musicTrack('Glaze Club — Come Alive', '34 - Glaze Club ~ {Daniel Ash - Come Alive}.mp3'),
  dark_asia_combat: musicTrack('Dark Asia Combat', '35 - Dark Asia Combat.mp3'),
  moldy_old_world: musicTrack('Moldy Old World', '36 - Moldy Old World.mp3'),
  china_boss: musicTrack('China Boss Battle', '37 - China Boss Battle.mp3'),
  prince_dream: musicTrack("The Prince's Dream", "38 - The Prince's Dream (Unused).mp3"),
  mission_impossible: musicTrack('Mission Impossible', '39 - Mission Impossible.mp3'),
  radio_needles_eye: musicTrack("Radio — Needle's Eye", "40 - Radio ~ {Die My Darling - Needle's Eye}.mp3"),
  mission_combat: musicTrack('Mission Impossible Combat', '41 - Mission Impossible Combat.mp3'),
  end_credits: musicTrack('End Credits', '42 - End Credits ~ {Lacuna Coil - Swamped}.mp3'),
  come_around: musicTrack('Come Around', '43 - Come Around (Unused).mp3'),
}

export const MUSIC_PLAYLIST =
  Object.keys(music)

export const AUDIO_CATALOG = {
  music,

  ambience: {
    hospital: {
      src: '/audio/ambience/ambience.mp3',
      volume: 0.5,
      loop: true,
      stream: true,
    },
    city_night: {
      src: '/audio/ambience/ambience.mp3',
      volume: 0.3,
      loop: true,
      stream: true,
    },
    apartment: {
      src: '/audio/ambience/ambience.mp3',
      volume: 0.28,
      loop: true,
      stream: true,
    },
    court: {
      src: '/audio/ambience/ambience.mp3',
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

  const locationId =
    scene?.location?.id ?? ''

  if (
    locationId.includes('hospital') ||
    sceneId === 'awakening'
  ) {
    return {
      music: 'creepy_ambience_1',
      ambience: 'hospital',
    }
  }

  if (
    locationId.includes('court') ||
    sceneId?.startsWith('judgment_') ||
    sceneId?.startsWith('court_')
  ) {
    return {
      music: 'prince_dream',
      ambience: 'court',
    }
  }

  if (
    locationId.includes('vesuvius')
  ) {
    return { music: 'vesuvius' }
  }

  if (
    locationId.includes('asylum')
  ) {
    return { music: 'the_asylum' }
  }

  if (
    locationId.includes('liberdade')
  ) {
    return {
      music: 'chinatown_theme',
      ambience: 'city_night',
    }
  }

  if (scene) {
    return {
      music: 'downtown_theme',
      ambience: 'city_night',
    }
  }

  return null
}
