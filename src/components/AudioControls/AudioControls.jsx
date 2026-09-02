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

import './AudioControls.css'

const CHANNELS = [
  ['music', 'Música'],
  ['ambience', 'Ambiente'],
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
  const currentMusic =
    AUDIO_CATALOG.music[
      settings.playback.musicKey
    ]

  return (
    <div className="audio-controls">
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

      {open && (
        <section className="audio-controls-panel">
          <button
            type="button"
            className="audio-controls-mute"
            onClick={() =>
              audioEngine.toggleMuted()
            }
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
                <span>{label}</span>
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
        </section>
      )}
    </div>
  )
}
