import {
  acknowledgeCamarillaResponse,
} from '../../engine/consequences/consequenceEngine'

import './CamarillaEvent.css'

export default function CamarillaEvent({
  game,
  event,
  onGameChange,
  onClose,
}) {
  function continueEvent() {
    const updatedGame =
      acknowledgeCamarillaResponse(
        game,
        event
      )

    onGameChange(
      updatedGame
    )

    onClose()
  }

  return (
    <div className="camarilla-event-overlay">
      <section className="camarilla-event-modal">
        <span className="camarilla-event-kicker">
          CAMARILLA
        </span>

        <h2>
          {event.title}
        </h2>

        <p className="camarilla-event-description">
          {event.text}
        </p>

        <div className="camarilla-event-dialogue">
          <span>
            {event.speaker}
          </span>

          <p>
            “{event.dialogue}”
          </p>
        </div>

        <div className="camarilla-event-consequence">
          <span>
            CONSEQUÊNCIA
          </span>

          <p>
            {event.consequence}
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={
            continueEvent
          }
        >
          Continuar
        </button>
      </section>
    </div>
  )
}