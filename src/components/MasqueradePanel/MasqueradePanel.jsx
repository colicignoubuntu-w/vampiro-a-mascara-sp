import {
  getMasqueradeState,
} from '../../engine/vampire/masqueradeEngine'

import './MasqueradePanel.css'

export default function MasqueradePanel({
  game,
  onClose,
}) {
  const state =
    getMasqueradeState(
      game
    )

  const activeWitnesses =
    state.witnesses.filter(
      (witness) =>
        witness.status ===
          'active' &&
        !witness.memoryAltered
    )

  const containedWitnesses =
    state.witnesses.filter(
      (witness) =>
        witness.memoryAltered ||
        witness.status ===
          'contained'
    )

  const activeEvidence =
    state.evidence.filter(
      (evidence) =>
        evidence.status ===
        'active'
    )

  const removedEvidence =
    state.evidence.filter(
      (evidence) =>
        evidence.status ===
        'removed'
    )

  return (
    <div className="masquerade-overlay">
      <section className="masquerade-panel">
        <header className="masquerade-header">
          <div>
            <span>
              CAMARILLA
            </span>

            <h2>
              A Máscara
            </h2>

            <p>
              O segredo que separa os
              mortos-vivos do mundo humano.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
          >
            ×
          </button>
        </header>

        <div className="masquerade-status-grid">
          <div>
            <span>
              EXPOSIÇÃO
            </span>

            <strong>
              {state.exposure}
            </strong>

            <small>
              situações suspeitas
            </small>
          </div>

          <div>
            <span>
              EVIDÊNCIAS
            </span>

            <strong>
              {activeEvidence.length}
            </strong>

            <small>
              ainda ativas
            </small>
          </div>

          <div>
            <span>
              TESTEMUNHAS
            </span>

            <strong>
              {activeWitnesses.length}
            </strong>

            <small>
              não contidas
            </small>
          </div>

          <div
            className={
              state.breach > 0
                ? 'masquerade-status-breach'
                : ''
            }
          >
            <span>
              VIOLAÇÃO
            </span>

            <strong>
              {state.breach}
            </strong>

            <small>
              quebra confirmada
            </small>
          </div>
        </div>

        <section className="masquerade-section">
          <div className="masquerade-section-header">
            <span>
              TESTEMUNHAS ATIVAS
            </span>

            <strong>
              {activeWitnesses.length}
            </strong>
          </div>

          {activeWitnesses.length ===
          0 ? (
            <p className="masquerade-empty">
              Nenhuma testemunha ativa conhecida.
            </p>
          ) : (
            activeWitnesses.map(
              (witness) => (
                <article
                  key={
                    witness.id
                  }
                  className="masquerade-card"
                >
                  <div>
                    <strong>
                      {witness.name}
                    </strong>

                    <small>
                      {formatWitnessType(
                        witness.type
                      )}
                    </small>
                  </div>

                  <div className="masquerade-tags">
                    {witness.sawViolence && (
                      <span>
                        Violência
                      </span>
                    )}

                    {witness.sawUnnaturalStrength && (
                      <span>
                        Força sobrenatural
                      </span>
                    )}

                    {witness.sawDiscipline && (
                      <span>
                        Disciplina
                      </span>
                    )}

                    {witness.sawFeeding && (
                      <span>
                        Alimentação
                      </span>
                    )}
                  </div>
                </article>
              )
            )
          )}

          {containedWitnesses.length >
            0 && (
            <p className="masquerade-contained">
              {
                containedWitnesses.length
              }
              {' '}
              testemunha(s) contida(s).
            </p>
          )}
        </section>

        <section className="masquerade-section">
          <div className="masquerade-section-header">
            <span>
              EVIDÊNCIAS ATIVAS
            </span>

            <strong>
              {activeEvidence.length}
            </strong>
          </div>

          {activeEvidence.length ===
          0 ? (
            <p className="masquerade-empty">
              Nenhuma evidência permanente conhecida.
            </p>
          ) : (
            activeEvidence.map(
              (evidence) => (
                <article
                  key={
                    evidence.id
                  }
                  className="masquerade-card"
                >
                  <div>
                    <strong>
                      {evidence.label}
                    </strong>

                    <small>
                      Gravidade
                      {' '}
                      {
                        evidence.severity
                      }
                    </small>
                  </div>

                  {evidence.description && (
                    <p>
                      {
                        evidence.description
                      }
                    </p>
                  )}
                </article>
              )
            )
          )}

          {removedEvidence.length >
            0 && (
            <p className="masquerade-contained">
              {
                removedEvidence.length
              }
              {' '}
              evidência(s) já eliminada(s).
            </p>
          )}
        </section>

        <div className="masquerade-explanation">
          <strong>
            Importante
          </strong>

          <p>
            Exposição não significa
            automaticamente uma violação
            da Máscara.
          </p>

          <p>
            Testemunhas e evidências podem
            ser contidas antes que a situação
            se transforme em uma quebra real.
          </p>
        </div>

        <button
          type="button"
          className="masquerade-close"
          onClick={
            onClose
          }
        >
          Fechar
        </button>
      </section>
    </div>
  )
}

function formatWitnessType(
  type
) {
  const labels = {
    human:
      'Humano',

    police:
      'Policial',

    security:
      'Segurança',

    hunter:
      'Caçador',

    doctor:
      'Médico',
  }

  return (
    labels[
      type
    ] ??
    type ??
    'Humano'
  )
}