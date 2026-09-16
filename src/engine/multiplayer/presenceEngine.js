import { supabase } from '../../lib/supabaseClient.js'

const PRESENCE_CHANNEL = 'vampiro-sp-online'

function normalizePresenceState(state) {
  return Object.values(state ?? {})
    .flat()
    .filter(Boolean)
    .reduce((players, presence) => {
      const userId = presence.user_id

      if (!userId) {
        return players
      }

      const existingIndex =
        players.findIndex(
          (player) =>
            player.userId === userId
        )

      const player = {
        userId,
        displayName:
          presence.display_name ||
          'Desconhecido',

        location:
          presence.location ||
          'menu',

        area:
          presence.area ||
          null,

        onlineAt:
          presence.online_at ||
          null,
      }

      if (existingIndex === -1) {
        players.push(player)
      } else {
        players[existingIndex] =
          player
      }

      return players
    }, [])
    .sort((a, b) =>
      a.displayName.localeCompare(
        b.displayName,
        'pt-BR'
      )
    )
}

export async function getPlayerProfile(
  userId
) {
  if (!userId) {
    return null
  }

  const {
    data,
    error,
  } = await supabase
    .from('player_profiles')
    .select(
      `
        id,
        display_name,
        current_location,
        current_area,
        location_visibility
      `
    )
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ?? null
}

export async function updatePlayerProfile(
  userId,
  changes
) {
  if (!userId) {
    throw new Error(
      'Usuário não identificado.'
    )
  }

  const payload = {
    updated_at:
      new Date().toISOString(),
  }

  if (
    typeof changes?.displayName ===
    'string'
  ) {
    const name =
      changes.displayName.trim()

    if (name) {
      payload.display_name = name
    }
  }

  if (
    typeof changes?.location ===
    'string'
  ) {
    payload.current_location =
      changes.location
  }

  if (
    Object.prototype.hasOwnProperty.call(
      changes ?? {},
      'area'
    )
  ) {
    payload.current_area =
      changes.area == null ||
      String(changes.area).trim() === ''
        ? null
        : String(changes.area).trim()
  }

  if (
    typeof changes?.locationVisibility ===
    'string'
  ) {
    payload.location_visibility =
      changes.locationVisibility
  }

  const {
    data,
    error,
  } = await supabase
    .from('player_profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export function connectPresence({
  user,
  profile,
  location = 'menu',
  area = null,
  onPlayersChange,
  onStatusChange,
}) {
  if (!user?.id) {
    throw new Error(
      'Não foi possível iniciar o Presence sem usuário.'
    )
  }

  const channel =
    supabase.channel(
      PRESENCE_CHANNEL,
      {
        config: {
          presence: {
            key: user.id,
          },
        },
      }
    )

  function emitPlayers() {
    const players =
      normalizePresenceState(
        channel.presenceState()
      )

    onPlayersChange?.(players)
  }

  channel
    .on(
      'presence',
      {
        event: 'sync',
      },
      emitPlayers
    )
    .on(
      'presence',
      {
        event: 'join',
      },
      emitPlayers
    )
    .on(
      'presence',
      {
        event: 'leave',
      },
      emitPlayers
    )

  channel.subscribe(
    async (status) => {
      onStatusChange?.(status)

      if (
        status !==
        'SUBSCRIBED'
      ) {
        return
      }

      const {
        error,
      } = await channel.track({
        user_id: user.id,

        display_name:
          profile?.display_name ||
          'Desconhecido',

        location,

        area,

        online_at:
          new Date().toISOString(),
      })

      if (error) {
        console.error(
          'Erro ao registrar Presence:',
          error
        )
      }
    }
  )

  return {
    channel,

    async updatePresence(
      nextData = {}
    ) {
      const {
        error,
      } = await channel.track({
        user_id: user.id,

        display_name:
          nextData.displayName ||
          profile?.display_name ||
          'Desconhecido',

        location:
          nextData.location ||
          location,

        area:
          Object.prototype.hasOwnProperty.call(
            nextData,
            'area'
          )
            ? nextData.area
            : area,

        online_at:
          new Date().toISOString(),
      })

      if (error) {
        throw error
      }
    },

    async disconnect() {
      try {
        await channel.untrack()
      } finally {
        await supabase.removeChannel(
          channel
        )
      }
    },
  }
}