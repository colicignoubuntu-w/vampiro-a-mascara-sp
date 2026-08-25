import {
  useState,
  useSyncExternalStore,
} from 'react'

import {
  audioEngine,
} from '../../engine/audio/audioEngine'

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
