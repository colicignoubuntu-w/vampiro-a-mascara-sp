import {
  getHazardActions,
} from '../../engine/vampire/hazardEngine'

import {
  getDamageSlots,
  getTotalDamage,
} from '../../engine/combat/damageEngine'

import './HazardPanel.css'

export default function HazardPanel({
  game,
  hazard,
  onAction,
  onFinish,
}) {
  if (!hazard) {
    return null
  }

  const actions =
    getHazardActions(
      hazard
    )

  const damage =
    getTotalDamage(
      game?.health
    )

  const slots =
    getDamageSlots(
      game?.health,
      7
    )

  const isSunlight =
    hazard.type ===
    'sunlight'

  return (
    <div className="hazard-overlay">
      <section
        className={
          `hazard-panel ${hazard.type}`
        }
      >
        <header className="hazard-header">
          <span>
            {isSunlight
              ? 'LUZ SOLAR'
              : 'FOGO'}
          </span>

          <h2>
            {hazard.title}
          </h2>

          <p>
            Exposição{' '}
            {hazard.round}
          </p>
        </header>

        <div className="hazard-warning">
          <strong>
            DANO AGRAVADO
          </strong>

          <p>
            {hazard.description}
          </p>
        </div>

        <section className="hazard-health">
          <span>
            VITALIDADE
          </span>

          <div className="hazard-health-slots">
            {slots.map(
              (
                slot,
                index
              ) => (
                <span
                  key={
                    `hazard-${index}`
                  }
                  className={
                    slot.type
                  }
                >
                  {slot.symbol}
                </span>
              )
            )}
          </div>

          <div className="hazard-health-info">
            <span>
              Dano total:
              {' '}
              {damage}/7
            </span>

            <strong>
              * = Agravado
            </strong>
          </div>
        </section>

        <div className="hazard-log">
          {(hazard.log ?? [])
            .slice(-10)
            .map(
              (
                entry,
                index
              ) => (
                <p
                  key={
                    `hazard-log-${index}`
                  }
                  className={
                    `hazard-log-${entry.type}`
                  }
                >
                  {entry.text}
                </p>
              )
            )}
        </div>

        {hazard.status ===
          'active' && (
          <div className="hazard-actions">
            {actions.map(
              (action) => (
                <button
                  key={
                    action.id
                  }
                  type="button"
                  onClick={() =>
                    onAction(
                      action.id
                    )
                  }
                >
                  <strong>
                    {action.label}
                  </strong>

                  <small>
                    {
                      action.description
                    }
                  </small>
                </button>
              )
            )}
          </div>
        )}

        {hazard.status ===
          'finished' && (
          <div className="hazard-ending">
            <strong>
              {hazard.destroyed
                ? 'DESTRUÍDO'
                : 'VOCÊ ESCAPOU'}
            </strong>

            {hazard.destroyed ? (
              <p>
                Seu corpo não consegue
                suportar mais dano
                agravado.
              </p>
            ) : (
              <p>
                Você conseguiu interromper
                a exposição.
              </p>
            )}

            <button
              type="button"
              onClick={
                onFinish
              }
            >
              Continuar
            </button>
          </div>
        )}
      </section>
    </div>
  )
}