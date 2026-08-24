import {
  getHealingState,
} from '../../engine/vampire/healingEngine'

import {
  getDamageSlots,
} from '../../engine/combat/damageEngine'

import './HealingPanel.css'

export default function HealingPanel({
  game,
  onHealBashing,
  onHealLethal,
  onPrepareAggravated,
  onClose,
}) {
  const state =
    getHealingState(
      game
    )

  const slots =
    getDamageSlots(
      game?.health,
      7
    )

  return (
    <div className="healing-overlay">
      <section className="healing-panel">
        <header className="healing-header">
          <span>
            SANGUE
          </span>

          <h2>
            Cura Vampírica
          </h2>

          <p>
            Pontos disponíveis:
            {' '}
            <strong>
              {state.blood}
            </strong>
          </p>
        </header>

        <section className="healing-health">
          <span>
            VITALIDADE
          </span>

          <div className="healing-slots">
            {slots.map(
              (
                slot,
                index
              ) => (
                <span
                  key={
                    `healing-${index}`
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

          <div className="healing-counts">
            <span>
              Contusão:
              {' '}
              {state.bashing}
            </span>

            <span>
              Letal:
              {' '}
              {state.lethal}
            </span>

            <span>
              Agravado:
              {' '}
              {state.aggravated}
            </span>
          </div>
        </section>

        <div className="healing-actions">
          <button
            type="button"
            disabled={
              !state.canHealBashing
            }
            onClick={
              onHealBashing
            }
          >
            <strong>
              Curar Contusão
            </strong>

            <small>
              1 sangue → cura 1 /
            </small>
          </button>

          <button
            type="button"
            disabled={
              !state.canHealLethal
            }
            onClick={
              onHealLethal
            }
          >
            <strong>
              Curar Letal
            </strong>

            <small>
              1 sangue → cura 1 X
            </small>
          </button>

          <button
            type="button"
            disabled={
              !state.canHealAggravated ||
              game?.healing
                ?.aggravatedPrepared
            }
            onClick={
              onPrepareAggravated
            }
          >
            <strong>
              Preparar Cura Agravada
            </strong>

            <small>
              5 sangue + repouso diurno
            </small>
          </button>
        </div>

        {game?.healing
          ?.aggravatedPrepared && (
          <div className="healing-prepared">
            <span>
              CURA PREPARADA
            </span>

            <p>
              No próximo repouso diurno,
              1 nível de dano agravado
              será curado.
            </p>
          </div>
        )}

        <button
          type="button"
          className="healing-close"
          onClick={
            onClose
          }
        >
          Voltar
        </button>
      </section>
    </div>
  )
}