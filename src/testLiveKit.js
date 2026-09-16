import {
  supabase,
} from './lib/supabaseClient.js'

export async function testLiveKit() {
  console.log(
    '[VOICE] solicitando token...'
  )

  const {
    data,
    error,
  } =
    await supabase.functions.invoke(
      'livekit-token',
      {
        body: {},
      }
    )

  if (error) {
    console.error(
      '[VOICE] erro:',
      error
    )

    return
  }

  console.log(
    '[VOICE] servidor respondeu:',
    {
      room:
        data?.room,

      area:
        data?.area,

      participant:
        data?.participant,

      hasToken:
        Boolean(
          data?.token
        ),

      hasUrl:
        Boolean(
          data?.url
        ),
    }
  )
}
