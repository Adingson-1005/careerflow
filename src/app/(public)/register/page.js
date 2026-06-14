'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '@/styles/auth.css'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState('JOB_SEEKER')
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', company: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, role })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-left-logo">CareerFlow</div>
        <h1>Join Thousands of Job Seekers & Employers</h1>
        <p>Whether you're looking for work or hiring talent, CareerFlow has you covered.</p>
        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">🏢</div>
            <span>Employers — post jobs and find talent fast</span>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">💼</div>
            <span>Job Seekers — track and manage applications</span>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">🚀</div>
            <span>Free to use, no credit card required</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create an account</h2>
            <p>Get started with CareerFlow today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label>I am a...</label>
              <div className="role-selector">
                <div
                  className={`role-option ${role === 'JOB_SEEKER' ? 'selected' : ''}`}
                  onClick={() => setRole('JOB_SEEKER')}
                >
                  <div className="role-option-icon">💼</div>
                  <div className="role-option-label">Job Seeker</div>
                  <div className="role-option-desc">Looking for work</div>
                </div>
                <div
                  className={`role-option ${role === 'EMPLOYER' ? 'selected' : ''}`}
                  onClick={() => setRole('EMPLOYER')}
                >
                  <div className="role-option-icon">🏢</div>
                  <div className="role-option-label">Employer</div>
                  <div className="role-option-desc">Hiring talent</div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Juan Dela Cruz"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {role === 'EMPLOYER' && (
              <div className="form-group">
                <label>Company Name</label>
                <input
                  name="company"
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}