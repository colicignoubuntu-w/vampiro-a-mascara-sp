import {
  supabase,
} from '../../lib/supabaseClient.js'

const DEFAULT_LIMIT = 50

function normalizeMessage(row) {
  return {
    id: row.id,
    channelId: row.channel_id,
    userId: row.user_id,

    displayName:
      row.display_name ||
      'Desconhecido',

    message:
      row.message || '',

    createdAt:
      row.created_at,
  }
}

export async function getChannelMessages(
  channelId = 'global',
  limit = DEFAULT_LIMIT
) {
  const safeChannel =
    String(
      channelId || 'global'
    ).trim()

  const safeLimit =
    Math.max(
      1,
      Math.min(
        Number(limit) || DEFAULT_LIMIT,
        100
      )
    )

  const {
    data,
    error,
  } = await supabase
    .from('chat_messages')
    .select(
      `
        id,
        channel_id,
        user_id,
        display_name,
        message,
        created_at
      `
    )
    .eq(
      'channel_id',
      safeChannel
    )
    .order(
      'created_at',
      {
        ascending: false,
      }
    )
    .limit(safeLimit)

  if (error) {
    throw error
  }

  return (data ?? [])
    .reverse()
    .map(normalizeMessage)
}

export async function sendChannelMessage({
  channelId = 'global',
  userId,
  displayName,
  message,
}) {
  const cleanMessage =
    String(message ?? '')
      .trim()

  const cleanChannel =
    String(
      channelId || 'global'
    ).trim()

  const cleanDisplayName =
    String(
      displayName ||
      'Desconhecido'
    )
      .trim()
      .slice(0, 40) ||
    'Desconhecido'

  if (!userId) {
    throw new Error(
      'Usuário não autenticado.'
    )
  }

  if (!cleanMessage) {
    throw new Error(
      'Escreva uma mensagem.'
    )
  }

  if (
    cleanMessage.length > 500
  ) {
    throw new Error(
      'A mensagem pode ter no máximo 500 caracteres.'
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('chat_messages')
    .insert({
      channel_id:
        cleanChannel,

      user_id:
        userId,

      display_name:
        cleanDisplayName,

      message:
        cleanMessage,
    })
    .select(
      `
        id,
        channel_id,
        user_id,
        display_name,
        message,
        created_at
      `
    )
    .single()

  if (error) {
    throw error
  }

  return normalizeMessage(data)
}

export function subscribeToChannel({
  channelId = 'global',
  onMessage,
  onStatusChange,
}) {
  const cleanChannel =
    String(
      channelId || 'global'
    ).trim()

  const realtimeChannel =
    supabase.channel(
      `chat:${cleanChannel}`
    )

  realtimeChannel
    .on(
      'postgres_changes',
      {
        event: 'INSERT',

        schema:
          'public',

        table:
          'chat_messages',

        filter:
          `channel_id=eq.${cleanChannel}`,
      },

      (payload) => {
        if (
          !payload?.new
        ) {
          return
        }

        onMessage?.(
          normalizeMessage(
            payload.new
          )
        )
      }
    )
    .subscribe(
      (status) => {
        onStatusChange?.(
          status
        )
      }
    )

  return {
    async disconnect() {
      await supabase.removeChannel(
        realtimeChannel
      )
    },
  }
}
