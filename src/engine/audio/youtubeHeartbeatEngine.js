import { audioEngine } from './audioEngine'

const HEARTBEAT_VIDEO_ID = '57zZeRiowDM'
const HEARTBEAT_MAX_VOLUME = 45

let apiPromise = null
let host = null
let player = null
let ready = false
let wanted = false
let creating = false
let unsubscribeAudio = null

function loadYoutubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT)
    }

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.head.appendChild(script)
    }
  })

  return apiPromise
}

function ensureHost() {
  if (host?.isConnected) return host

  host = document.createElement('div')
  host.id = 'vampiro-heartbeat-youtube'
  Object.assign(host.style, {
    position: 'fixed',
    width: '1px',
    height: '1px',
    left: '-10000px',
    top: '-10000px',
    opacity: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
  })
  host.setAttribute('aria-hidden', 'true')
  document.body.appendChild(host)
  return host
}

function getTargetVolume() {
  const settings = audioEngine.getSnapshot()
  if (settings?.muted) return 0
  const sfx = Number(settings?.sfx ?? 1)
  return Math.max(0, Math.min(100, Math.round(sfx * HEARTBEAT_MAX_VOLUME)))
}

function syncVolume() {
  if (!player || !ready) return
  const volume = getTargetVolume()

  try {
    player.setVolume?.(volume)
    if (volume <= 0) player.mute?.()
    else player.unMute?.()
  } catch {}
}

function playWantedHeartbeat() {
  if (!player || !ready || !wanted) return

  try {
    syncVolume()
    player.seekTo?.(0, true)
    player.playVideo?.()
  } catch {}
}

async function ensurePlayer() {
  if (player || creating) return
  creating = true

  try {
    const YT = await loadYoutubeApi()
    const target = ensureHost()

    player = new YT.Player(target, {
      videoId: HEARTBEAT_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        loop: 1,
        playlist: HEARTBEAT_VIDEO_ID,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady: (event) => {
          player = event.target
          ready = true
          syncVolume()
          if (wanted) playWantedHeartbeat()
        },
        onStateChange: (event) => {
          if (wanted && event.data === YT.PlayerState.ENDED) {
            try {
              event.target.seekTo?.(0, true)
              event.target.playVideo?.()
            } catch {}
          }
        },
        onError: () => {},
      },
    })
  } catch (error) {
    console.warn('[heartbeat] Falha ao carregar YouTube:', error)
    player = null
    ready = false
  } finally {
    creating = false
  }
}

async function start() {
  wanted = true

  if (!unsubscribeAudio) {
    unsubscribeAudio = audioEngine.subscribe(syncVolume)
  }

  if (!player) await ensurePlayer()
  playWantedHeartbeat()
}

function stop() {
  wanted = false
  if (!player || !ready) return

  try {
    player.stopVideo?.()
  } catch {}
}

function destroy() {
  wanted = false
  ready = false
  unsubscribeAudio?.()
  unsubscribeAudio = null

  try {
    player?.destroy?.()
  } catch {}

  player = null
  if (host?.isConnected) host.remove()
  host = null
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', destroy)
}

export const youtubeHeartbeatEngine = {
  start,
  stop,
  destroy,
}
