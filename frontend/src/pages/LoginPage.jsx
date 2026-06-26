import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      const routes = {
        ADMIN:          '/dashboard/admin',
        BRANCH_MANAGER: '/dashboard/manager',
        TELLER:         '/dashboard/teller',
        MEMBER:         '/dashboard/member',
      }
      navigate(routes[user.role] || '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const onKey = e => { if (e.key === 'Enter') submit() }

  return (
    <div className="login">
      <div className="login__left">
        <div className="login__brand">
          <div className="login__stamp">US</div>
          <span className="login__brand-name">Unity SACCO</span>
        </div>
        <h2 className="login__tagline">
          Your savings,<br /><em>working for you.</em>
        </h2>
        <p className="login__desc">
          Secure access to your account, loan history, statements, and more.
        </p>
      </div>

      <div className="login__right">
        <div className="login__card">
          <h1 className="login__title">Welcome back</h1>
          <p className="login__subtitle">Sign in to your Unity SACCO account</p>

          {error && <div className="login__error">{error}</div>}

          <div className="login__field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handle}
              onKeyDown={onKey}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="login__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              onKeyDown={onKey}
              autoComplete="current-password"
            />
          </div>

          <button
            className="login__submit"
            onClick={submit}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="login__back">
            <a href="/">← Back to home</a>
          </p>
        </div>
      </div>
    </div>
  )
}