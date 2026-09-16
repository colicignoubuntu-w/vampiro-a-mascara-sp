import { supabase } from '../../lib/supabaseClient.js'

export async function signUpWithEmail(email, password) {
  const normalizedEmail = String(email ?? '')
    .trim()
    .toLowerCase()

  if (!normalizedEmail) {
    throw new Error('Informe um e-mail.')
  }

  if (!password) {
    throw new Error('Informe uma senha.')
  }

  if (password.length < 6) {
    throw new Error(
      'A senha precisa ter pelo menos 6 caracteres.'
    )
  }

  const { data, error } =
    await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    })

  if (error) {
    throw error
  }

  return {
    user: data.user ?? null,
    session: data.session ?? null,
  }
}

export async function signInWithEmail(
  email,
  password
) {
  const normalizedEmail = String(email ?? '')
    .trim()
    .toLowerCase()

  if (!normalizedEmail) {
    throw new Error('Informe seu e-mail.')
  }

  if (!password) {
    throw new Error('Informe sua senha.')
  }

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

  if (error) {
    throw error
  }

  return {
    user: data.user ?? null,
    session: data.session ?? null,
  }
}



export async function signInAnonymously() {
  const {
    data,
    error,
  } = await supabase.auth.signInAnonymously()

  if (error) {
    throw error
  }

  return {
    user:
      data.user ?? null,

    session:
      data.session ?? null,
  }
}

export async function signOut() {
  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getCurrentSession() {
  const { data, error } =
    await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session ?? null
}

export async function getCurrentUser() {
  const { data, error } =
    await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user ?? null
}

export function onAuthStateChange(callback) {
  if (typeof callback !== 'function') {
    throw new Error(
      'onAuthStateChange precisa receber uma função.'
    )
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback({
        event,
        session,
        user: session?.user ?? null,
      })
    }
  )

  return () => {
    subscription.unsubscribe()
  }
}

export async function requestPasswordReset(email) {
  const normalizedEmail = String(email ?? '')
    .trim()
    .toLowerCase()

  if (!normalizedEmail) {
    throw new Error('Informe seu e-mail.')
  }

  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/`
      : undefined

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo,
      }
    )

  if (error) {
    throw error
  }
}