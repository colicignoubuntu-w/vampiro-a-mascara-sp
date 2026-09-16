import { createClient } from 'npm:@supabase/supabase-js@2'
import { AccessToken } from 'npm:livekit-server-sdk@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':
    'POST, OPTIONS',
}

function json(
  body: unknown,
  status = 200,
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    },
  )
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(
      'ok',
      {
        headers: corsHeaders,
      },
    )
  }

  if (req.method !== 'POST') {
    return json(
      {
        error: 'Método não permitido.',
      },
      405,
    )
  }

  try {
    const authorization =
      req.headers.get('Authorization')

    if (!authorization) {
      return json(
        {
          error:
            'Usuário não autenticado.',
        },
        401,
      )
    }

    const supabaseUrl =
      Deno.env.get('SUPABASE_URL')

    const supabaseAnonKey =
      Deno.env.get('SUPABASE_ANON_KEY')

    const livekitUrl =
      Deno.env.get('LIVEKIT_URL')

    const livekitApiKey =
      Deno.env.get('LIVEKIT_API_KEY')

    const livekitApiSecret =
      Deno.env.get(
        'LIVEKIT_API_SECRET',
      )

    if (
      !supabaseUrl ||
      !supabaseAnonKey
    ) {
      console.error(
        'Configuração Supabase ausente.',
      )

      return json(
        {
          error:
            'Configuração do servidor incompleta.',
        },
        500,
      )
    }

    if (
      !livekitUrl ||
      !livekitApiKey ||
      !livekitApiSecret
    ) {
      console.error(
        'Configuração LiveKit ausente.',
      )

      return json(
        {
          error:
            'LiveKit não configurado.',
        },
        500,
      )
    }

    /*
     * Cliente executado como o próprio
     * usuário.
     *
     * Assim as políticas RLS continuam
     * sendo aplicadas.
     */
    const supabase =
      createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          global: {
            headers: {
              Authorization:
                authorization,
            },
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      )

    const {
      data: userData,
      error: userError,
    } =
      await supabase.auth.getUser()

    if (
      userError ||
      !userData?.user
    ) {
      console.error(
        'Falha de autenticação:',
        userError,
      )

      return json(
        {
          error:
            'Sessão inválida.',
        },
        401,
      )
    }

    const user =
      userData.user

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from('player_profiles')
        .select(
          [
            'id',
            'display_name',
            'current_location',
            'current_area',
          ].join(','),
        )
        .eq(
          'id',
          user.id,
        )
        .single()

    if (
      profileError ||
      !profile
    ) {
      console.error(
        'Perfil não encontrado:',
        profileError,
      )

      return json(
        {
          error:
            'Perfil do jogador não encontrado.',
        },
        403,
      )
    }

    /*
     * PRIMEIRO LOCAL COM VOZ:
     * Último Gole.
     *
     * Depois podemos adicionar
     * Vesuvius, Asylum etc.
     */
    if (
      profile.current_location !==
      'ultimo_gole'
    ) {
      return json(
        {
          error:
            'Você precisa estar no Último Gole para entrar nesta voz.',
        },
        403,
      )
    }

    const allowedAreas =
      new Set([
        'main',
        'stage',
        'bar',
        'vip',
        'stairs',
        'basement',
      ])

    const area =
      String(
        profile.current_area || '',
      )

    if (
      !allowedAreas.has(area)
    ) {
      return json(
        {
          error:
            'Área atual sem canal de voz.',
        },
        403,
      )
    }

    /*
     * Não usamos nome/email como
     * identity.
     *
     * O UUID do Supabase é usado
     * como identidade opaca.
     */
    const identity =
      user.id

    const displayName =
      String(
        profile.display_name ||
        'Desconhecido',
      ).slice(
        0,
        40,
      )

    /*
     * Exemplo:
     *
     * voice:ultimo_gole:stage
     * voice:ultimo_gole:main
     */
    const roomName =
      `voice:ultimo_gole:${area}`

    const accessToken =
      new AccessToken(
        livekitApiKey,
        livekitApiSecret,
        {
          identity,
          name: displayName,

          /*
           * Token curto.
           * É usado para entrar na sala.
           */
          ttl: '15m',

          metadata:
            JSON.stringify({
              location:
                'ultimo_gole',
              area,
            }),
        },
      )

    accessToken.addGrant({
      roomJoin: true,
      room: roomName,

      /*
       * Voz nos dois sentidos.
       */
      canPublish: true,
      canSubscribe: true,

      /*
       * O chat continua no Supabase.
       */
      canPublishData: false,
    })

    const token =
      await accessToken.toJwt()

    return json({
      token,
      url: livekitUrl,
      room: roomName,

      participant: {
        id: identity,
        name: displayName,
      },

      location:
        'ultimo_gole',

      area,
    })
  } catch (error) {
    console.error(
      'Erro livekit-token:',
      error,
    )

    return json(
      {
        error:
          'Erro interno ao gerar token de voz.',
      },
      500,
    )
  }
})
