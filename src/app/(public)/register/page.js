'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '@/styles/auth.css'

export default function RegisterPage() {
  const router = useRouter()
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
      body: JSON.stringify(formData)
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
    <>
      <button className="back-btn" onClick={() => router.push('/')}>← Back</button>
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="auth-left-logo">CareerFlow</div>
          <h1>One Account, Two Roles</h1>
          <p>Register once and switch between Job Seeker and Employer mode anytime from your dashboard.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">💼</div>
              <span>Browse and apply for jobs as a Job Seeker</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🏢</div>
              <span>Post jobs and manage applicants as an Employer</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🔄</div>
              <span>Switch between modes anytime from your sidebar</span>
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

              <div className="form-group">
                <label>Company Name <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional — for employer mode)</span></label>
                <input
                  name="company"
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

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
    </>
  )
}