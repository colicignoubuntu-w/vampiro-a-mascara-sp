import { useMemo, useState } from 'react'

import {
  RELATIONSHIP_NPCS,
} from '../../data/npcs/relationships/index.js'

import {
  apologizeForLatestRelationshipHarm,
  recordRelationshipEvent,
  relationshipMemorySummary,
} from '../../engine/relationships/relationshipMemoryEngine'

import {
  getRelationshipPersonality,
  personalityLabel,
} from '../../engine/relationships/relationshipPersonality'

import {
  DOMINATION_STATES,
  PRESENCE_STATES,
  RELATIONSHIP_METRIC_CONFIG,
  RELATIONSHIP_STATUS,
  adjustRelationshipMetric,
  getRelationshipState,
  relationshipPresentation,
  resetAllRelationships,
  resetRelationship,
  setRelationshipContact,
  setRelationshipInfluence,
  setRelationshipStatus,
} from '../../engine/relationships/relationshipModel'

import './RelationshipDevPanel.css'

function MetricControl({
  label,
  value,
  min,
  max,
  onAdjust,
}) {
  return (
    <div className="relationship-dev-metric">
      <div className="relationship-dev-metric-heading">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="relationship-dev-scale">
        <div
          style={{
            width:
              `${Math.max(
                0,
                Math.min(
                  100,
                  ((value - min) /
                    (max - min)) *
                    100
                )
              )}%`,
          }}
        />
      </div>

      <div className="relationship-dev-buttons">
        <button
          type="button"
          onClick={() =>
            onAdjust(-10)
          }
          disabled={
            value <= min
          }
        >
          -10
        </button>

        <button
          type="button"
          onClick={() =>
            onAdjust(-1)
          }
          disabled={
            value <= min
          }
        >
          -1
        </button>

        <button
          type="button"
          onClick={() =>
            onAdjust(1)
          }
          disabled={
            value >= max
          }
        >
          +1
        </button>

        <button
          type="button"
          onClick={() =>
            onAdjust(10)
          }
          disabled={
            value >= max
          }
        >
          +10
        </button>
      </div>
    </div>
  )
}

export default function RelationshipDevPanel({
  game,
  onChange,
}) {
  const ids =
    useMemo(
      () =>
        Object.keys(
          RELATIONSHIP_NPCS
        ),
      []
    )

  const [npcId, setNpcId] =
    useState(
      ids[0] ??
      ''
    )

  const npc =
    RELATIONSHIP_NPCS[
      npcId
    ]

  const state =
    npc
      ? getRelationshipState(
          game,
          npcId
        )
      : null

  const presentation =
    state
      ? relationshipPresentation(
          state
        )
      : null

  const memorySummary =
    state
      ? relationshipMemorySummary(
          game,
          npcId
        )
      : null

  const personality =
    state
      ? getRelationshipPersonality(
          npcId
        )
      : null

  function persist(nextGame) {
    onChange?.(
      nextGame
    )
  }

  function adjust(
    key,
    amount
  ) {
    persist(
      adjustRelationshipMetric(
        game,
        npcId,
        key,
        amount
      )
    )
  }

  function changeStatus(
    event
  ) {
    persist(
      setRelationshipStatus(
        game,
        npcId,
        event.target.value
      )
    )
  }

  function changeBloodBond(
    amount
  ) {
    persist(
      setRelationshipInfluence(
        game,
        npcId,
        {
          bloodBond:
            (
              state
                ?.influence
                ?.bloodBond ??
              0
            ) +
            amount,
        }
      )
    )
  }

  function simulateEvent(
    eventType
  ) {
    try {
      persist(
        recordRelationshipEvent(
          game,
          npcId,
          eventType
        )
      )
    } catch (error) {
      window.alert(
        error?.message ??
        'Não foi possível simular o evento.'
      )
    }
  }

  function simulateApology() {
    persist(
      apologizeForLatestRelationshipHarm(
        game,
        npcId
      )
    )
  }

  function warpToRelationshipScene(
    nodeId
  ) {
    const targetScene =
      npc?.scenes?.[
        nodeId
      ]

    if (
      !targetScene ||
      !state
    ) {
      window.alert(
        'Cena de relacionamento inválida.'
      )

      return
    }

    const currentLocation =
      game.world?.location ??
      {}

    const isUltimoGole =
      targetScene.venueId ===
      'ultimo_gole'

    const updated = {
      ...game,

      relationships: {
        ...(game.relationships ?? {}),

        [npcId]: {
          ...state,

          node:
            nodeId,

          readyAt:
            0,

          completed:
            false,

          ending:
            null,

          deadlineAt:
            null,
        },
      },

      world: {
        ...(game.world ?? {}),

        ...(isUltimoGole
          ? {
              location: {
                ...currentLocation,

                id:
                  'ultimo_gole',

                name:
                  'Último Gole',

                district:
                  'Pinheiros',
              },

              hour:
                22,

              minute:
                30,
            }
          : {}),
      },

      venueState: {
        ...(game.venueState ?? {}),

        ...(isUltimoGole
          ? {
              ultimoGoleArea:
                'stage',
            }
          : {}),
      },

      ...(isUltimoGole
        ? {
            story: {
              ...(game.story ?? {}),
              previousScene:
                game.story?.scene ?? null,
              scene:
                'free_roam',
            },

            devRelationshipWarp: {
              npcId,
              nodeId,
              venueId:
                'ultimo_gole',
              areaId:
                'stage',
              token:
                `${npcId}:${nodeId}:${Date.now()}`,
            },
          }
        : {}),

      history: [
        ...(game.history ?? []),

        {
          type:
            'dev-relationship-scene-warp',

          npcId,

          nodeId,

          timestamp:
            new Date()
              .toISOString(),
        },
      ],
    }

    persist(
      updated
    )
  }


  function resetOne() {
    const confirmed =
      window.confirm(
        `Resetar completamente a relação com ${npc.name}? Diário, flags, prazos, contato e progresso serão zerados.`
      )

    if (!confirmed) {
      return
    }

    persist(
      resetRelationship(
        game,
        npcId
      )
    )
  }

  function resetAll() {
    const confirmed =
      window.confirm(
        'Resetar TODAS as relações? Isso reinicia Clara, Mara, Elisa, Íris e Helena.'
      )

    if (!confirmed) {
      return
    }

    persist(
      resetAllRelationships(
        game
      )
    )
  }

  if (
    !npc ||
    !state
  ) {
    return null
  }

  return (
    <section className="relationship-dev">
      <header className="relationship-dev-title">
        <div>
          <small>
            RELACIONAMENTOS
          </small>

          <strong>
            Editor de estado
          </strong>
        </div>

        <span>
          DEV
        </span>
      </header>

      <label className="relationship-dev-field">
        <span>
          Personagem
        </span>

        <select
          value={npcId}
          onChange={
            event =>
              setNpcId(
                event.target.value
              )
          }
        >
          {ids.map(id => (
            <option
              key={id}
              value={id}
            >
              {
                RELATIONSHIP_NPCS[
                  id
                ].name
              }
            </option>
          ))}
        </select>
      </label>

      <div className="relationship-dev-summary">
        <strong>
          {npc.name}
        </strong>

        <span>
          {presentation.status}
          {' · '}
          {presentation.mood}
        </span>

        <small>
          Nó atual: {state.node}
          {state.completed
            ? ' · concluído'
            : ''}
        </small>
      </div>

      <div className="relationship-dev-block">
        <strong>
          Ir para cena
        </strong>

        <small>
          DEV · ignora a espera entre encontros
        </small>

        <select
          value={
            state.node
          }
          onChange={
            event =>
              warpToRelationshipScene(
                event.target.value
              )
          }
        >
          {Object.entries(
            npc.scenes ??
            {}
          ).map(
            ([
              nodeId,
              scene,
            ]) => (
              <option
                key={
                  nodeId
                }
                value={
                  nodeId
                }
              >
                {
                  scene?.title
                    ? `${scene.title} · ${nodeId}`
                    : nodeId
                }
              </option>
            )
          )}
        </select>

        {npcId === 'clara' &&
          npc.scenes?.second_night && (
          <button
            type="button"
            onClick={() =>
              warpToRelationshipScene(
                'second_night'
              )
            }
          >
            War Pigs — Segundo encontro
          </button>
        )}
      </div>


      <label className="relationship-dev-field">
        <span>
          Estado social
        </span>

        <select
          value={
            state.status
          }
          onChange={
            changeStatus
          }
        >
          {Object.entries(
            RELATIONSHIP_STATUS
          ).map(
            ([
              id,
              label,
            ]) => (
              <option
                key={id}
                value={id}
              >
                {label}
              </option>
            )
          )}
        </select>
      </label>

      <div className="relationship-dev-metrics">
        {Object.entries(
          RELATIONSHIP_METRIC_CONFIG
        ).map(
          ([
            key,
            config,
          ]) => (
            <MetricControl
              key={key}
              label={
                config.label
              }
              value={
                state
                  .relationshipMetrics
                  ?.[key] ??
                0
              }
              min={
                config.min
              }
              max={
                config.max
              }
              onAdjust={
                amount =>
                  adjust(
                    key,
                    amount
                  )
              }
            />
          )
        )}
      </div>

      <div className="relationship-dev-block">
        <span className="relationship-dev-block-label">
          Laço de Sangue
        </span>

        <div className="relationship-dev-bond">
          <button
            type="button"
            onClick={() =>
              changeBloodBond(
                -1
              )
            }
            disabled={
              (
                state
                  .influence
                  ?.bloodBond ??
                0
              ) <= 0
            }
          >
            −
          </button>

          <strong>
            {
              state
                .influence
                ?.bloodBond ??
              0
            }/3
          </strong>

          <button
            type="button"
            onClick={() =>
              changeBloodBond(
                1
              )
            }
            disabled={
              (
                state
                  .influence
                  ?.bloodBond ??
                0
              ) >= 3
            }
          >
            +
          </button>
        </div>
      </div>

      <label className="relationship-dev-field">
        <span>
          Dominação
        </span>

        <select
          value={
            state
              .influence
              ?.domination ??
            'none'
          }
          onChange={
            event =>
              persist(
                setRelationshipInfluence(
                  game,
                  npcId,
                  {
                    domination:
                      event
                        .target
                        .value,
                  }
                )
              )
          }
        >
          {Object.entries(
            DOMINATION_STATES
          ).map(
            ([
              id,
              label,
            ]) => (
              <option
                key={id}
                value={id}
              >
                {label}
              </option>
            )
          )}
        </select>
      </label>

      <label className="relationship-dev-field">
        <span>
          Presença
        </span>

        <select
          value={
            state
              .influence
              ?.presence ??
            'none'
          }
          onChange={
            event =>
              persist(
                setRelationshipInfluence(
                  game,
                  npcId,
                  {
                    presence:
                      event
                        .target
                        .value,
                  }
                )
              )
          }
        >
          {Object.entries(
            PRESENCE_STATES
          ).map(
            ([
              id,
              label,
            ]) => (
              <option
                key={id}
                value={id}
              >
                {label}
              </option>
            )
          )}
        </select>
      </label>

      <div className="relationship-dev-block">
        <span className="relationship-dev-block-label">
          Telefone
        </span>

        <label className="relationship-dev-check">
          <input
            type="checkbox"
            checked={
              Boolean(
                state
                  .contact
                  ?.known
              )
            }
            onChange={
              event =>
                persist(
                  setRelationshipContact(
                    game,
                    npcId,
                    {
                      known:
                        event
                          .target
                          .checked,
                    }
                  )
                )
            }
          />

          <span>
            Número conhecido
          </span>
        </label>

        <label className="relationship-dev-check">
          <input
            type="checkbox"
            checked={
              Boolean(
                state
                  .contact
                  ?.blocked
              )
            }
            onChange={
              event =>
                persist(
                  setRelationshipContact(
                    game,
                    npcId,
                    {
                      blocked:
                        event
                          .target
                          .checked,
                    }
                  )
                )
            }
          />

          <span>
            Bloqueou o personagem
          </span>
        </label>

        <label className="relationship-dev-field">
          <span>
            Número / identificação
          </span>

          <input
            type="text"
            value={
              state
                .contact
                ?.number ??
              ''
            }
            placeholder="Número salvo"
            onChange={
              event =>
                persist(
                  setRelationshipContact(
                    game,
                    npcId,
                    {
                      number:
                        event
                          .target
                          .value ||
                        null,
                    }
                  )
                )
            }
          />
        </label>
      </div>

      <div className="relationship-dev-block">
        <span className="relationship-dev-block-label">
          Simular acontecimentos
        </span>

        <div className="relationship-dev-event-grid">
          <button
            type="button"
            onClick={() =>
              simulateEvent(
                'cheatingSeen'
              )
            }
          >
            Viu traição
          </button>

          <button
            type="button"
            onClick={() =>
              simulateEvent(
                'lieDiscovered'
              )
            }
          >
            Descobriu mentira
          </button>

          <button
            type="button"
            onClick={() =>
              simulateEvent(
                'aggression'
              )
            }
          >
            Sofreu agressão
          </button>

          <button
            type="button"
            onClick={() =>
              simulateEvent(
                'abandonment'
              )
            }
          >
            Abandono
          </button>

          <button
            type="button"
            onClick={() =>
              simulateEvent(
                'boundaryRespected'
              )
            }
          >
            Respeitou limite
          </button>

          <button
            type="button"
            onClick={() =>
              simulateEvent(
                'protected'
              )
            }
          >
            Protegeu NPC
          </button>

          <button
            type="button"
            onClick={() =>
              simulateEvent(
                'thoughtfulGesture'
              )
            }
          >
            Gesto de cuidado
          </button>

          <button
            type="button"
            onClick={
              simulateApology
            }
          >
            Pedir desculpas
          </button>
        </div>
      </div>

      {memorySummary && (
        <div className="relationship-dev-block">
          <span className="relationship-dev-block-label">
            Memória
          </span>

          <div className="relationship-dev-memory-summary">
            <div>
              <span>Total</span>
              <strong>{memorySummary.total}</strong>
            </div>

            <div>
              <span>Feridas abertas</span>
              <strong>{memorySummary.unresolved}</strong>
            </div>
          </div>

          {memorySummary.strongest ? (
            <div className="relationship-dev-memory-card">
              <strong>
                {memorySummary.strongest.eventType}
              </strong>

              <p>
                {memorySummary.strongest.text}
              </p>

              <small>
                Intensidade: {memorySummary.strongest.intensity}
                {memorySummary.strongest.permanent
                  ? ' · permanente'
                  : ''}
              </small>
            </div>
          ) : (
            <small className="relationship-dev-muted">
              Nenhuma ferida emocional importante em aberto.
            </small>
          )}
        </div>
      )}

      {personality && (
        <details className="relationship-dev-personality">
          <summary>
            Personalidade social
          </summary>

          <div className="relationship-dev-personality-grid">
            {Object.entries(
              personality
            ).map(
              ([key, value]) => (
                <div key={key}>
                  <span>
                    {personalityLabel(key)}
                  </span>

                  <strong>
                    {value}
                  </strong>
                </div>
              )
            )}
          </div>
        </details>
      )}

      <details className="relationship-dev-legacy">
        <summary>
          Compatibilidade antiga
        </summary>

        <div>
          <span>
            Confiança antiga
          </span>
          <strong>
            {
              state
                .metrics
                ?.trust ??
              0
            }
          </strong>
        </div>

        <div>
          <span>
            Afinidade antiga
          </span>
          <strong>
            {
              state
                .metrics
                ?.affinity ??
              0
            }
          </strong>
        </div>

        <div>
          <span>
            Respeito antigo
          </span>
          <strong>
            {
              state
                .metrics
                ?.respect ??
              0
            }
          </strong>
        </div>

        <small>
          Estes três valores continuam existindo porque as cenas antigas ainda os usam para requisitos e escolhas. O novo sistema é atualizado junto com eles.
        </small>
      </details>

      <div className="relationship-dev-reset">
        <button
          type="button"
          onClick={
            resetOne
          }
        >
          Resetar {npc.name.split(' ')[0]}
        </button>

        <button
          type="button"
          className="relationship-dev-danger"
          onClick={
            resetAll
          }
        >
          Resetar todas
        </button>
      </div>
    </section>
  )
}
