import {
  audioEngine,
} from '../audio/audioEngine'

const DEFAULT_VOLUME = 0

function clampVolume(value) {
  return Math.max(
    0,
    Math.min(100, Number(value) || 0)
  )
}

class YoutubeEngine {
  constructor() {
    this.player = null
    this.listeners = new Set()
    this.snapshot = {
      available: false,
      ready: false,
      watching: false,
      playing: false,
      volume: DEFAULT_VOLUME,
      title: '',
    }
  }

  subscribe = (listener) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot = () => this.snapshot

  emit(patch = {}) {
    this.snapshot = {
      ...this.snapshot,
      ...patch,
    }
    for (const listener of this.listeners) {
      listener()
    }
  }

  connect(player, title = '') {
    this.player = player
    this.emit({
      available: true,
      ready: true,
      title,
    })
    this.applyVolume()
  }

  disconnect(player) {
    if (this.player !== player) return
    this.player = null
    this.setWatching(false)
    this.emit({
      available: false,
      ready: false,
      playing: false,
      title: '',
    })
  }

  setPlaying(playing) {
    this.emit({ playing: Boolean(playing) })
  }

  applyVolume() {
    if (!this.player) return
    this.player.setVolume?.(this.snapshot.volume)
    if (this.snapshot.volume > 0) {
      this.player.unMute?.()
    } else {
      this.player.mute?.()
    }
  }

  setVolume(volume) {
    const nextVolume = clampVolume(volume)
    this.emit({ volume: nextVolume })
    this.applyVolume()

    const intensity = nextVolume / 100
    audioEngine.setExternalMix({
      music: 1 - intensity * 0.9375,
      ambience: 1 - intensity * 0.75,
    })
  }

  setWatching(watching) {
    const nextWatching = Boolean(watching)
    this.emit({ watching: nextWatching })

    if (nextWatching) {
      if (this.snapshot.volume === 0) {
        this.setVolume(80)
      }
      this.player?.playVideo?.()
    } else {
      this.setVolume(0)
    }
  }

  toggleWatching() {
    this.setWatching(!this.snapshot.watching)
  }

  togglePlayback() {
    if (!this.player) return
    if (this.snapshot.playing) {
      this.player.pauseVideo?.()
    } else {
      this.player.playVideo?.()
    }
  }
}

export const youtubeEngine =
  new YoutubeEngine()
