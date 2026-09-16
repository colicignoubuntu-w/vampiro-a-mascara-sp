import {
  useState,
} from 'react'

import {
  requestPasswordReset,
  signInAnonymously,
  signInWithEmail,
  signUpWithEmail,
} from '../../engine/auth/authEngine.js'

import './AuthScreen.css'

function getFriendlyError(error) {
  const message = String(
    error?.message ?? ''
  ).toLowerCase()

  if (
    message.includes(
      'invalid login credentials'
    )
  ) {
    return 'E-mail ou senha incorretos.'
  }

  if (
    message.includes(
      'user already registered'
    )
  ) {
    return 'Já existe uma conta com este e-mail.'
  }

  if (
    message.includes(
      'email not confirmed'
    )
  ) {
    return 'Confirme seu e-mail antes de entrar.'
  }

  if (
    message.includes(
      'password should be at least'
    )
  ) {
    return 'A senha precisa ter pelo menos 6 caracteres.'
  }

  if (
    message.includes(
      'rate limit'
    )
  ) {
    return 'Muitas tentativas. Aguarde um pouco e tente novamente.'
  }

  return (
    error?.message ||
    'Ocorreu um erro. Tente novamente.'
  )
}

export default function AuthScreen({
  onAuthenticated,
}) {
  const [
    mode,
    setMode,
  ] = useState('login')

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    message,
    setMessage,
  ] = useState('')

  const isRegister =
    mode === 'register'

  function clearFeedback() {
    setError('')
    setMessage('')
  }

  function changeMode(nextMode) {
    clearFeedback()

    setPassword('')
    setConfirmPassword('')
    setMode(nextMode)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (loading) {
      return
    }

    clearFeedback()

    try {
      setLoading(true)

      if (isRegister) {
        if (
          password !==
          confirmPassword
        ) {
          throw new Error(
            'As senhas não são iguais.'
          )
        }

        const result =
          await signUpWithEmail(
            email,
            password
          )

        if (result.session) {
          onAuthenticated?.(
            result.session
          )

          return
        }

        setMessage(
          'Conta criada. Verifique seu e-mail para confirmar o cadastro.'
        )

        return
      }

      const result =
        await signInWithEmail(
          email,
          password
        )

      if (result.session) {
        onAuthenticated?.(
          result.session
        )
      }
    } catch (err) {
      setError(
        getFriendlyError(err)
      )
    } finally {
      setLoading(false)
    }
  }


  async function handleAnonymousLogin() {
    if (loading) {
      return
    }

    clearFeedback()

    try {
      setLoading(true)

      const result =
        await signInAnonymously()

      if (!result.session) {
        throw new Error(
          'Não foi possível iniciar a sessão de visitante.'
        )
      }

      onAuthenticated?.(
        result.session
      )
    } catch (err) {
      setError(
        getFriendlyError(err)
      )
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordReset() {
    if (loading) {
      return
    }

    clearFeedback()

    if (!email.trim()) {
      setError(
        'Digite seu e-mail para recuperar a senha.'
      )

      return
    }

    try {
      setLoading(true)

      await requestPasswordReset(
        email
      )

      setMessage(
        'Se existir uma conta com esse e-mail, você receberá as instruções para redefinir a senha.'
      )
    } catch (err) {
      setError(
        getFriendlyError(err)
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-screen">
      <div
        className="auth-background"
        aria-hidden="true"
      />

      <div
        className="auth-vignette"
        aria-hidden="true"
      />

      <section className="auth-content">
        <header className="auth-brand">
          <span className="auth-brand-kicker">
            VAMPIRO
          </span>

          <h1>
            <span>SÃO</span>
            <span>PAULO</span>
          </h1>

          <p>
            As noites escondem mais
            <br />
            do que a cidade permite ver.
          </p>
        </header>

        <section className="auth-panel">
          <div className="auth-tabs">
            <button
              type="button"
              className={
                mode === 'login'
                  ? 'auth-tab active'
                  : 'auth-tab'
              }
              onClick={() =>
                changeMode('login')
              }
              disabled={loading}
            >
              ENTRAR
            </button>

            <button
              type="button"
              className={
                mode === 'register'
                  ? 'auth-tab active'
                  : 'auth-tab'
              }
              onClick={() =>
                changeMode(
                  'register'
                )
              }
              disabled={loading}
            >
              CRIAR CONTA
            </button>
          </div>

          <form
            className="auth-form"
            onSubmit={
              handleSubmit
            }
          >
            <label className="auth-field">
              <span>
                E-MAIL
              </span>

              <input
                type="email"
                value={email}
                onChange={
                  (event) =>
                    setEmail(
                      event.target.value
                    )
                }
                placeholder="seu@email.com"
                autoComplete="email"
                disabled={loading}
                required
              />
            </label>

            <label className="auth-field">
              <span>
                SENHA
              </span>

              <input
                type="password"
                value={password}
                onChange={
                  (event) =>
                    setPassword(
                      event.target.value
                    )
                }
                placeholder="Sua senha"
                autoComplete={
                  isRegister
                    ? 'new-password'
                    : 'current-password'
                }
                minLength={6}
                disabled={loading}
                required
              />
            </label>

            {isRegister && (
              <label className="auth-field">
                <span>
                  CONFIRMAR SENHA
                </span>

                <input
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={
                    (event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                  }
                  placeholder="Digite novamente"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={loading}
                  required
                />
              </label>
            )}

            {!isRegister && (
              <button
                type="button"
                className="auth-forgot"
                onClick={
                  handlePasswordReset
                }
                disabled={loading}
              >
                Esqueci minha senha
              </button>
            )}

            {error && (
              <div
                className="auth-feedback error"
                role="alert"
              >
                {error}
              </div>
            )}

            {message && (
              <div
                className="auth-feedback success"
                role="status"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? 'AGUARDE...'
                : isRegister
                  ? 'CRIAR CONTA'
                  : 'ENTRAR'}
            </button>
          </form>

          <div className="auth-guest">
            <div className="auth-guest-divider">
              <span />
              <small>OU</small>
              <span />
            </div>

            <button
              type="button"
              className="auth-guest-button"
              onClick={
                handleAnonymousLogin
              }
              disabled={loading}
            >
              <strong>
                ENTRAR COMO DESCONHECIDO
              </strong>

              <span>
                Entre sem criar uma conta
              </span>
            </button>

            <p className="auth-guest-note">
              Você poderá explorar São Paulo,
              conversar com outros jogadores e
              participar das áreas sociais como
              visitante.
            </p>
          </div>
        </section>

        <footer className="auth-footer">
          <span>
            CRÔNICA DE SÃO PAULO
          </span>

          <i />

          <span>
            NOITE 1
          </span>
        </footer>
      </section>

      <div className="auth-city-caption">
        <span>
          SÃO PAULO
        </span>

        <strong>
          AINDA VIVE
        </strong>
      </div>
    </main>
  )
}