import {
  Howl,
  Howler,
} from 'howler'

import {
  AUDIO_CATALOG,
  MUSIC_PLAYLIST,
} from '../../data/audio/audioCatalog'
import {
  subscribeToDiceRolls,
} from '../dice/diceRollEvents'

const STORAGE_KEY =
  'vampiro-sp:audio-settings'

const SETTINGS_VERSION = 3

const DEFAULT_SETTINGS = {
  muted: false,
  music: 0.05,
  ambience: 0.5,
  sfx: 1,
}

function clamp(value) {
  return Math.max(
    0,
    Math.min(1, Number(value) || 0)
  )
}

function loadSettings() {
  try {
    const savedSettings =
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        ) ?? '{}'
      )

    if (
      savedSettings.version !==
      SETTINGS_VERSION
    ) {
      return {
        ...DEFAULT_SETTINGS,
        ...savedSettings,
        music:
          DEFAULT_SETTINGS.music,
        version:
          SETTINGS_VERSION,
      }
    }

    return {
      ...DEFAULT_SETTINGS,
      ...savedSettings,
    }
  } catch {
    return {
      ...DEFAULT_SETTINGS,
      version:
        SETTINGS_VERSION,
    }
  }
}

class AudioEngine {
  constructor() {
    this.settings = loadSettings()
    this.cache = new Map()
    this.availability = new Map()
    this.current = {
      music: null,
      ambience: null,
    }
    this.desired = {
      music: null,
      ambience: null,
    }
    this.pendingSceneAudio = null
    this.unlocked = false
    this.listeners = new Set()
    this.lastPlayedAt = new Map()
    this.playback = {
      musicKey: null,
      musicPaused: false,
      musicStopped: true,
    }
    this.snapshot = {
      ...this.settings,
      playback: this.playback,
    }

    subscribeToDiceRolls(() => {
      this.playSfx('dice_roll')
    })

  }

  subscribe = (listener) => {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => this.snapshot

  emit() {
    this.snapshot = {
      ...this.settings,
      playback: {
        ...this.playback,
      },
    }

    for (const listener of
      this.listeners) {
      listener()
    }
  }

  persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.settings)
      )
    } catch {
      // Preferências de áudio não devem interromper o jogo.
    }
  }

  unlock = async () => {
    if (this.unlocked) {
      return
    }

    this.unlocked = true
    Howler.mute(this.settings.muted)

    if (
      Howler.ctx?.state ===
      'suspended'
    ) {
      await Howler.ctx.resume()
    }

    if (this.pendingSceneAudio) {
      const pending =
        this.pendingSceneAudio
      this.pendingSceneAudio = null
      this.applySceneAudio(pending)
    }
  }

  setMuted(muted) {
    this.settings = {
      ...this.settings,
      muted: Boolean(muted),
    }
    if (this.unlocked) {
      Howler.mute(this.settings.muted)
    }
    this.persist()
    this.emit()
  }

  toggleMuted() {
    this.setMuted(
      !this.settings.muted
    )
  }

  setChannelVolume(
    channel,
    volume
  ) {
    if (!(channel in DEFAULT_SETTINGS)) {
      return
    }

    this.settings = {
      ...this.settings,
      [channel]: clamp(volume),
    }

    const active =
      this.current[channel]

    if (active?.sound) {
      active.sound.volume(
        this.getVolume(
          channel,
          active.definition
        )
      )
    }

    this.persist()
    this.emit()
  }

  getVolume(channel, definition) {
    return clamp(
      this.settings[channel] *
      (definition.volume ?? 1)
    )
  }

  async isAudioAvailable(src) {
    if (this.availability.has(src)) {
      return this.availability.get(src)
    }

    const check = fetch(src, {
      method: 'HEAD',
      cache: 'no-store',
    })
      .then((response) => {
        return response.ok
      })
      .catch(() => false)

    this.availability.set(src, check)

    const available = await check

    if (!available) {
      this.availability.delete(src)
    }

    return available
  }

  async getSound(channel, key) {
    const definition =
      AUDIO_CATALOG[channel]
        ?.[key]

    if (!definition) {
      return null
    }

    const cacheKey =
      `${channel}:${key}`

    if (this.cache.has(cacheKey)) {
      return {
        sound:
          this.cache.get(cacheKey),
        definition,
      }
    }

    const available =
      await this.isAudioAvailable(
        definition.src
      )

    if (!available) {
      return null
    }

    const sound = new Howl({
      src: [definition.src],
      loop: definition.loop ?? false,
      html5:
        definition.stream ?? false,
      preload: true,
      volume:
        this.getVolume(
          channel,
          definition
        ),
      onloaderror: () => {
        // O jogo segue normalmente quando o arquivo ainda não foi adicionado.
      },
      onplayerror: () => {
        this.unlocked = false
      },
      onend: () => {
        if (
          channel === 'music' &&
          this.current.music?.key ===
            key &&
          !this.playback.musicPaused &&
          !this.playback.musicStopped
        ) {
          this.playNextMusic()
        }
      },
    })

    this.cache.set(cacheKey, sound)

    return {
      sound,
      definition,
    }
  }

  async playLoop(channel, key) {
    this.desired[channel] = key

    if (!key) {
      this.stopChannel(channel)
      return
    }

    if (
      this.current[channel]?.key ===
      key
    ) {
      return
    }

    const entry =
      await this.getSound(
        channel,
        key
      )

    if (
      !entry ||
      this.desired[channel] !== key
    ) {
      return
    }

    const previous =
      this.current[channel]
    const targetVolume =
      this.getVolume(
        channel,
        entry.definition
      )

    entry.sound.volume(0)
    entry.sound.play()
    entry.sound.fade(
      0,
      targetVolume,
      900
    )

    this.current[channel] = {
      key,
      ...entry,
    }

    if (channel === 'music') {
      this.playback = {
        musicKey: key,
        musicPaused: false,
        musicStopped: false,
      }
      this.emit()
    }

    if (previous?.sound) {
      const oldVolume =
        previous.sound.volume()
      previous.sound.fade(
        oldVolume,
        0,
        700
      )
      window.setTimeout(() => {
        previous.sound.stop()
      }, 750)
    }
  }

  stopChannel(channel) {
    this.desired[channel] = null

    const active =
      this.current[channel]

    if (!active?.sound) {
      if (channel === 'music') {
        this.playback = {
          musicKey: null,
          musicPaused: false,
          musicStopped: true,
        }
        this.emit()
      }
      return
    }

    const volume =
      active.sound.volume()
    active.sound.fade(volume, 0, 500)
    window.setTimeout(() => {
      active.sound.stop()
    }, 550)
    this.current[channel] = null

    if (channel === 'music') {
      this.playback = {
        musicKey: null,
        musicPaused: false,
        musicStopped: true,
      }
      this.emit()
    }
  }

  async playNextMusic() {
    await this.unlock()

    const musicKeys =
      MUSIC_PLAYLIST

    if (musicKeys.length === 0) {
      return
    }

    const currentKey =
      this.current.music?.key ??
      this.desired.music
    const currentIndex =
      musicKeys.indexOf(currentKey)

    for (
      let offset = 1;
      offset <= musicKeys.length;
      offset += 1
    ) {
      const nextIndex =
        (currentIndex + offset) %
        musicKeys.length
      const nextKey =
        musicKeys[nextIndex]

      if (nextKey === currentKey) {
        continue
      }

      const entry = await this.getSound(
        'music',
        nextKey
      )

      if (entry) {
        await this.playLoop(
          'music',
          nextKey
        )
        return
      }
    }
  }

  toggleMusicPause() {
    const active = this.current.music

    if (!active?.sound) {
      return
    }

    if (this.playback.musicPaused) {
      active.sound.volume(
        this.getVolume(
          'music',
          active.definition
        )
      )
      active.sound.play()
      this.playback = {
        ...this.playback,
        musicPaused: false,
        musicStopped: false,
      }
    } else {
      active.sound.pause()
      this.playback = {
        ...this.playback,
        musicPaused: true,
      }
    }

    this.emit()
  }

  stopMusic() {
    this.stopChannel('music')
  }

  async playSfx(key) {
    const now = Date.now()
    const lastPlayed =
      this.lastPlayedAt.get(key) ?? 0

    if (now - lastPlayed < 150) {
      return
    }

    this.lastPlayedAt.set(key, now)

    if (!this.unlocked) {
      return
    }

    const entry =
      await this.getSound(
        'sfx',
        key
      )

    if (!entry) {
      return
    }

    entry.sound.volume(
      this.getVolume(
        'sfx',
        entry.definition
      )
    )
    entry.sound.play()
  }

  applySceneAudio(audio) {
    if (!this.unlocked) {
      this.pendingSceneAudio = audio
      return
    }

    if (!audio) {
      return
    }

    this.playLoop(
      'music',
      audio.music
    )
    this.playLoop(
      'ambience',
      audio.ambience
    )

    const effects = Array.isArray(
      audio.sfx
    )
      ? audio.sfx
      : audio.sfx
        ? [audio.sfx]
        : []

    for (const effect of effects) {
      this.playSfx(effect)
    }
  }
}

export const audioEngine =
  new AudioEngine()
