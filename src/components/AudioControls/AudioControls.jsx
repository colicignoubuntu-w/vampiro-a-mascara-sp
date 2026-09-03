import {
  useState,
  useSyncExternalStore,
} from 'react'

import {
  audioEngine,
} from '../../engine/audio/audioEngine'
import {
  AUDIO_CATALOG,
} from '../../data/audio/audioCatalog'
import {
  youtubeEngine,
} from '../../engine/video/youtubeEngine'

import './AudioControls.css'

const CHANNELS = [
  ['music', 'Música'],
  ['ambience', 'Som da cidade'],
  ['sfx', 'Efeitos'],
]

export default function AudioControls() {
  const [open, setOpen] =
    useState(false)
  const settings =
    useSyncExternalStore(
      audioEngine.subscribe,
      audioEngine.getSnapshot,
      audioEngine.getSnapshot
    )
  const youtube =
    useSyncExternalStore(
      youtubeEngine.subscribe,
      youtubeEngine.getSnapshot,
      youtubeEngine.getSnapshot
    )
  const currentMusic =
    AUDIO_CATALOG.music[
      settings.playback.musicKey
    ]
  const musicPlaying =
    !settings.playback.musicPaused &&
    !settings.playback.musicStopped

  return (
    <div className="audio-controls">
      <div className="audio-controls-buttons">
        <button
          type="button"
          className="audio-controls-toggle"
          aria-label={
            settings.muted
              ? 'Ativar som'
              : 'Configurar som'
          }
          aria-expanded={open}
          onClick={() => {
            audioEngine.unlock()
            setOpen(!open)
          }}
        >
          {settings.muted ? '🔇' : '🔊'}
          <span>SOM</span>
        </button>

        <button
          type="button"
          className="audio-controls-music-button"
          aria-label={
            musicPlaying
              ? 'Pausar música'
              : 'Reproduzir música'
          }
          title={
            musicPlaying
              ? 'Pausar música'
              : 'Reproduzir música'
          }
          onClick={async () => {
            if (settings.muted) {
              audioEngine.setMuted(false)
            }

            if (musicPlaying) {
              audioEngine.toggleMusicPause()
              return
            }

            await audioEngine.resumeMusic()
          }}
        >
          <span aria-hidden="true">
            {musicPlaying ? 'Ⅱ' : '▶'}
          </span>
          <span>MÚSICA</span>
        </button>
      </div>

      {open && (
        <section className="audio-controls-panel">
          <button
            type="button"
            className="audio-controls-mute"
            onClick={() => {
              audioEngine.toggleMuted()
              if (!settings.muted) {
                youtubeEngine.setVolume(0)
              }
            }}
          >
            {settings.muted
              ? 'Ativar áudio'
              : 'Silenciar tudo'}
          </button>

          <button
            type="button"
            className="audio-controls-test"
            onClick={async () => {
              await audioEngine.unlock()
              audioEngine.playSfx(
                'dice_roll'
              )
            }}
          >
            Testar efeitos
          </button>

          <div className="audio-controls-player">
            <span className="audio-controls-track-label">
              Faixa atual
            </span>
            <strong>
              {currentMusic?.title ??
                'Nenhuma música'}
            </strong>

            <div className="audio-controls-player-actions">
              <button
                type="button"
                onClick={() =>
                  audioEngine.playNextMusic()
                }
              >
                Próxima
              </button>

              <button
                type="button"
                disabled={
                  settings.playback
                    .musicStopped
                }
                onClick={() =>
                  audioEngine
                    .toggleMusicPause()
                }
              >
                {settings.playback
                  .musicPaused
                  ? 'Continuar'
                  : 'Pausar'}
              </button>

              <button
                type="button"
                disabled={
                  settings.playback
                    .musicStopped
                }
                onClick={() =>
                  audioEngine.stopMusic()
                }
              >
                Parar
              </button>
            </div>
          </div>

          {CHANNELS.map(
            ([channel, label]) => (
              <label key={channel}>
                <span>
                  {label} — {Math.round(
                    settings[channel] * 100
                  )}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={
                    settings[channel]
                  }
                  onChange={(event) =>
                    audioEngine
                      .setChannelVolume(
                        channel,
                        event.target.value
                      )
                  }
                />
              </label>
            )
          )}

          {youtube.available && (
            <label>
              <span>
                Vídeo — {youtube.volume}%
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={youtube.volume}
                onChange={(event) =>
                  youtubeEngine.setVolume(
                    event.target.value
                  )
                }
              />
            </label>
          )}

          {youtube.available &&
            youtube.watching && (
              <button
                type="button"
                className="audio-controls-test"
                onClick={() =>
                  youtubeEngine.togglePlayback()
                }
              >
                {youtube.playing
                  ? 'Pausar vídeo'
                  : 'Reproduzir vídeo'}
              </button>
            )}
        </section>
      )}
    </div>
  )
}
