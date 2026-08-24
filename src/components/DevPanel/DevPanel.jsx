import {
  applyStatus,
} from '../../engine/status/statusEngine'

import {
  saveGame,
} from '../../utils/gameState'

import './DevPanel.css'

export default function DevPanel({
  game,
  onGameChange,
}) {
  function commit(
    updatedGame
  ) {
    saveGame(
      updatedGame
    )

    onGameChange(
      updatedGame
    )
  }

  function updateGame(
    changes
  ) {
    commit({
      ...game,
      ...changes,
    })
  }

  function goToLocation(
    id,
    name,
    district,
    scene = 'free_roam'
  ) {
    commit({
      ...game,

      world: {
        ...game.world,

        location: {
          id,
          name,
          district,
        },
      },

      story: {
        ...game.story,

        previousScene:
          game.story?.scene ??
          null,

        scene,
      },
    })
  }

  function setBlood(
    value
  ) {
    const maximum =
      game.blood?.maximum ??
      10

    commit({
      ...game,

      blood: {
        ...game.blood,

        current:
          Math.max(
            0,
            Math.min(
              maximum,
              value
            )
          ),
      },
    })
  }

  function addMoney(
    amount
  ) {
    updateGame({
      money:
        Number(
          game.money ?? 0
        ) +
        amount,
    })
  }

  function addStatus(
    statusId
  ) {
    commit(
      applyStatus(
        game,
        statusId
      )
    )
  }

  function clearStatuses() {
    commit({
      ...game,

      statuses: [],
    })
  }

  /* ==========================================
     ESTADO DA MÁSCARA
  ========================================== */

  function getMasquerade() {
    return {
      suspicion:
        Number(
          game.masquerade
            ?.suspicion ?? 0
        ),

      policeAttention:
        Number(
          game.masquerade
            ?.policeAttention ?? 0
        ),

      violations:
        Number(
          game.masquerade
            ?.violations ?? 0
        ),

      witnesses:
        Array.isArray(
          game.masquerade
            ?.witnesses
        )
          ? game.masquerade.witnesses
          : [],

      evidence:
        Array.isArray(
          game.masquerade
            ?.evidence
        )
          ? game.masquerade.evidence
          : [],

      exposure:
        Number(
          game.masquerade
            ?.exposure ?? 0
        ),
    }
  }

  const masquerade =
    getMasquerade()

  const activeEvidence =
    masquerade.evidence.filter(
      (item) =>
        item.active !== false
    )

  const videos =
    activeEvidence.filter(
      (item) =>
        item.type ===
        'phoneVideo'
    )

  /* ==========================================
     SUSPEITA
  ========================================== */

  function addSuspicion() {
    commit({
      ...game,

      masquerade: {
        ...masquerade,

        suspicion:
          Math.min(
            10,
            masquerade.suspicion +
              1
          ),
      },
    })
  }

  function removeSuspicion() {
    commit({
      ...game,

      masquerade: {
        ...masquerade,

        suspicion:
          Math.max(
            0,
            masquerade.suspicion -
              1
          ),
      },
    })
  }

  /* ==========================================
     POLÍCIA
  ========================================== */

  function addPoliceAttention() {
    commit({
      ...game,

      masquerade: {
        ...masquerade,

        policeAttention:
          Math.min(
            10,
            masquerade.policeAttention +
              1
          ),
      },
    })
  }

  function removePoliceAttention() {
    commit({
      ...game,

      masquerade: {
        ...masquerade,

        policeAttention:
          Math.max(
            0,
            masquerade.policeAttention -
              1
          ),
      },
    })
  }

  /* ==========================================
     VIOLAÇÃO
  ========================================== */

  function addViolation() {
    commit({
      ...game,

      masquerade: {
        ...masquerade,

        violations:
          masquerade.violations +
          1,
      },
    })
  }

  function removeViolation() {
    commit({
      ...game,

      masquerade: {
        ...masquerade,

        violations:
          Math.max(
            0,
            masquerade.violations -
              1
          ),
      },
    })
  }

  /* ==========================================
     EVIDÊNCIAS
  ========================================== */

  function createVideo() {
    const evidence = {
      id:
        `dev-video-${Date.now()}`,

      type:
        'phoneVideo',

      description:
        'Vídeo comprometedor criado pelo painel de desenvolvimento.',

      locationId:
        game.world
          ?.location
          ?.id ??
        null,

      active: true,

      timestamp:
        new Date()
          .toISOString(),
    }

    commit({
      ...game,

      masquerade: {
        ...masquerade,

        evidence: [
          ...masquerade.evidence,

          evidence,
        ],
      },
    })
  }

  function removeLastVideo() {
    const evidence =
      [...masquerade.evidence]

    const index =
      evidence
        .map(
          (item) =>
            item.type
        )
        .lastIndexOf(
          'phoneVideo'
        )

    if (index === -1) {
      return
    }

    evidence.splice(
      index,
      1
    )

    commit({
      ...game,

      masquerade: {
        ...masquerade,

        evidence,
      },
    })
  }

  /* ==========================================
     TESTEMUNHAS
  ========================================== */

  function createWitness() {
    const witness = {
      id:
        `dev-witness-${Date.now()}`,

      type:
        'civilian',

      locationId:
        game.world
          ?.location
          ?.id ??
        null,

      description:
        'Testemunha criada pelo painel de desenvolvimento.',

      timestamp:
        new Date()
          .toISOString(),
    }

    commit({
      ...game,

      masquerade: {
        ...masquerade,

        witnesses: [
          ...masquerade.witnesses,

          witness,
        ],
      },
    })
  }

  function removeLastWitness() {
    if (
      masquerade.witnesses
        .length <= 0
    ) {
      return
    }

    commit({
      ...game,

      masquerade: {
        ...masquerade,

        witnesses:
          masquerade.witnesses.slice(
            0,
            -1
          ),
      },
    })
  }

  /* ==========================================
     LIMPAR MÁSCARA
  ========================================== */

  function clearMasquerade() {
    commit({
      ...game,

      masquerade: {
        suspicion: 0,

        policeAttention: 0,

        violations: 0,

        witnesses: [],

        evidence: [],

        exposure: 0,
      },

      flags: {
        ...(game.flags ?? {}),

        camarillaResponseLevel:
          0,

        camarillaSummoned:
          false,

        sheriffWatching:
          false,

        princeDispleased:
          false,
      },
    })
  }

  function resetCamarillaWarnings() {
    commit({
      ...game,

      flags: {
        ...(game.flags ?? {}),

        camarillaResponseLevel:
          0,

        camarillaSummoned:
          false,

        sheriffWatching:
          false,

        princeDispleased:
          false,
      },
    })
  }

  /* ==========================================
     HISTÓRIA
  ========================================== */

  function resetPrologue() {
    commit({
      ...game,

      world: {
        ...game.world,

        night: 1,

        hour: 23,

        minute: 30,

        location: {
          id:
            'malkavian_hospital',

          name:
            'Hospital Abandonado',

          district:
            'São Paulo',
        },
      },

      story: {
        ...game.story,

        chapter:
          'prologue',

        previousScene:
          null,

        scene:
          'awakening',
      },

      flags: {},

      history: [],

      lastRoll: null,
    })
  }

  return (
    <aside className="dev-panel">
      <div className="dev-panel-title">
        <span>
          DEV
        </span>

        <strong>
          Testes
        </strong>
      </div>

      {/* =====================================
          RESUMO
      ===================================== */}

      <div className="dev-status-box">
        <div>
          <span>
            Sangue
          </span>

          <strong>
            {
              game.blood
                ?.current ?? 0
            }
            /
            {
              game.blood
                ?.maximum ?? 0
            }
          </strong>
        </div>

        <div>
          <span>
            Suspeita
          </span>

          <strong>
            {
              masquerade.suspicion
            }
            /10
          </strong>
        </div>

        <div>
          <span>
            Polícia
          </span>

          <strong>
            {
              masquerade.policeAttention
            }
            /10
          </strong>
        </div>

        <div>
          <span>
            Violações
          </span>

          <strong>
            {
              masquerade.violations
            }
          </strong>
        </div>

        <div>
          <span>
            Vídeos
          </span>

          <strong>
            {
              videos.length
            }
          </strong>
        </div>

        <div>
          <span>
            Testemunhas
          </span>

          <strong>
            {
              masquerade
                .witnesses
                .length
            }
          </strong>
        </div>

        <div>
          <span>
            Exposição
          </span>

          <strong>
            {
              Math.floor(
                masquerade.exposure
              )
            }
          </strong>
        </div>
      </div>

      {/* =====================================
          LOCAIS
      ===================================== */}

      <div className="dev-panel-section">
        <span>
          Locais
        </span>

        <button
          type="button"
          onClick={() =>
            goToLocation(
              'livia_apartment',
              'Apartamento de Lívia',
              'Centro'
            )
          }
        >
          Apartamento da Lívia
        </button>

        <button
          type="button"
          onClick={() =>
            goToLocation(
              'rock_bar',
              'Bar de Rock',
              'República'
            )
          }
        >
          Bar de Rock
        </button>

        <button
          type="button"
          onClick={() =>
            goToLocation(
              'centro_street',
              'Ruas do Centro',
              'Centro'
            )
          }
        >
          Ruas do Centro
        </button>

        <button
          type="button"
          onClick={() =>
            goToLocation(
              'dangerous_alley',
              'Ruas da Periferia',
              'Zona Sul'
            )
          }
        >
          Área perigosa
        </button>
      </div>

      {/* =====================================
          SANGUE
      ===================================== */}

      <div className="dev-panel-section">
        <span>
          Sangue
        </span>

        <button
          type="button"
          onClick={() =>
            setBlood(15)
          }
        >
          Sangue 15
        </button>

        <button
          type="button"
          onClick={() =>
            setBlood(8)
          }
        >
          Sangue 8
        </button>

        <button
          type="button"
          onClick={() =>
            setBlood(3)
          }
        >
          Sangue 3
        </button>

        <button
          type="button"
          onClick={() =>
            setBlood(1)
          }
        >
          Sangue 1
        </button>
      </div>

      {/* =====================================
          DINHEIRO
      ===================================== */}

      <div className="dev-panel-section">
        <span>
          Dinheiro
        </span>

        <button
          type="button"
          onClick={() =>
            addMoney(50)
          }
        >
          + R$ 50
        </button>

        <button
          type="button"
          onClick={() =>
            addMoney(500)
          }
        >
          + R$ 500
        </button>
      </div>

      {/* =====================================
          MÁSCARA
      ===================================== */}

      <div className="dev-panel-section">
        <span>
          Máscara
        </span>

        <div className="dev-inline-control">
          <button
            type="button"
            onClick={
              removeSuspicion
            }
          >
            −
          </button>

          <strong>
            Suspeita:
            {' '}
            {
              masquerade.suspicion
            }
            /10
          </strong>

          <button
            type="button"
            onClick={
              addSuspicion
            }
          >
            +
          </button>
        </div>

        <div className="dev-inline-control">
          <button
            type="button"
            onClick={
              removePoliceAttention
            }
          >
            −
          </button>

          <strong>
            Polícia:
            {' '}
            {
              masquerade.policeAttention
            }
            /10
          </strong>

          <button
            type="button"
            onClick={
              addPoliceAttention
            }
          >
            +
          </button>
        </div>

        <div className="dev-inline-control">
          <button
            type="button"
            onClick={
              removeViolation
            }
          >
            −
          </button>

          <strong>
            Violações:
            {' '}
            {
              masquerade.violations
            }
          </strong>

          <button
            type="button"
            onClick={
              addViolation
            }
          >
            +
          </button>
        </div>

        <div className="dev-inline-control">
          <button
            type="button"
            onClick={
              removeLastVideo
            }
          >
            −
          </button>

          <strong>
            Vídeos:
            {' '}
            {
              videos.length
            }
          </strong>

          <button
            type="button"
            onClick={
              createVideo
            }
          >
            +
          </button>
        </div>

        <div className="dev-inline-control">
          <button
            type="button"
            onClick={
              removeLastWitness
            }
          >
            −
          </button>

          <strong>
            Testemunhas:
            {' '}
            {
              masquerade
                .witnesses
                .length
            }
          </strong>

          <button
            type="button"
            onClick={
              createWitness
            }
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={
            resetCamarillaWarnings
          }
        >
          Repetir avisos Camarilla
        </button>

        <button
          type="button"
          onClick={
            clearMasquerade
          }
        >
          Limpar Máscara
        </button>
      </div>

      {/* =====================================
          EFEITOS
      ===================================== */}

      <div className="dev-panel-section">
        <span>
          Efeitos
        </span>

        <button
          type="button"
          onClick={() =>
            addStatus(
              'alcoholLight'
            )
          }
        >
          Álcool leve
        </button>

        <button
          type="button"
          onClick={() =>
            addStatus(
              'alcoholHeavy'
            )
          }
        >
          Álcool pesado
        </button>

        <button
          type="button"
          onClick={() =>
            addStatus(
              'stimulantBlood'
            )
          }
        >
          Estimulante
        </button>

        <button
          type="button"
          onClick={() =>
            addStatus(
              'sedativeBlood'
            )
          }
        >
          Sedativo
        </button>

        <button
          type="button"
          onClick={() =>
            addStatus(
              'hallucinogenBlood'
            )
          }
        >
          Alucinógeno
        </button>

        <button
          type="button"
          onClick={() =>
            addStatus(
              'bloodbornePathogen'
            )
          }
        >
          Contaminação
        </button>

        <button
          type="button"
          onClick={
            clearStatuses
          }
        >
          Limpar efeitos
        </button>
      </div>

      {/* =====================================
          HISTÓRIA
      ===================================== */}

      <div className="dev-panel-section">
        <span>
          História
        </span>

        <button
          type="button"
          onClick={
            resetPrologue
          }
        >
          Reiniciar prólogo
        </button>
      </div>
    </aside>
  )
}