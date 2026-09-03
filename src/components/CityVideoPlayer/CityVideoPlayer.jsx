import {
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react'

import {
  youtubeEngine,
} from '../../engine/video/youtubeEngine'

import './CityVideoPlayer.css'

let apiPromise

function loadYoutubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT)
  }
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previous =
      window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT)
    }

    if (!document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    )) {
      const script = document.createElement('script')
      script.src =
        'https://www.youtube.com/iframe_api'
      script.async = true
      document.head.appendChild(script)
    }
  })

  return apiPromise
}

export default function CityVideoPlayer({
  video,
  onModeChange,
}) {
  const hostRef = useRef(null)
  const playerRef = useRef(null)
  const state = useSyncExternalStore(
    youtubeEngine.subscribe,
    youtubeEngine.getSnapshot,
    youtubeEngine.getSnapshot
  )

  useEffect(() => {
    onModeChange?.(state.watching)
  }, [onModeChange, state.watching])

  useEffect(() => {
    if (!video?.id || !hostRef.current) return
    let cancelled = false

    loadYoutubeApi().then((YT) => {
      if (cancelled || !hostRef.current) return

      const player = new YT.Player(
        hostRef.current,
        {
          videoId: video.id,
          playerVars: {
            autoplay: 1,
            controls: 1,
            disablekb: 0,
            loop: 1,
            playlist: video.id,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              event.target.mute()
              event.target.setVolume(0)
              event.target.playVideo()
              playerRef.current = event.target
              youtubeEngine.connect(
                event.target,
                video.title
              )
            },
            onStateChange: (event) => {
              youtubeEngine.setPlaying(
                event.data ===
                  YT.PlayerState.PLAYING
              )
            },
          },
        }
      )
      playerRef.current = player
    })

    return () => {
      cancelled = true
      const player = playerRef.current
      youtubeEngine.disconnect(player)
      player?.destroy?.()
      playerRef.current = null
    }
  }, [video?.id, video?.title])

  if (!video?.id) return null

  return (
    <>
      <aside
        className={[
          'city-video',
          state.watching
            ? 'is-watching'
            : '',
        ].filter(Boolean).join(' ')}
        aria-label="Vídeo da cidade"
      >
        <div className="city-video-frame">
          <div ref={hostRef} />
        </div>
      </aside>

      <div className="city-video-actions">
        <span>{video.title}</span>
        <button
          type="button"
          disabled={!state.ready}
          onClick={() =>
            youtubeEngine.toggleWatching()
          }
        >
          {state.watching
            ? 'Voltar ao jogo'
            : 'Assistir vídeo'}
        </button>
      </div>
    </>
  )
}
