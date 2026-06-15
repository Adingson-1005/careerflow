'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '@/styles/employer.css'
import '@/styles/dashboard.css'

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']

export default function PostJobPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '', description: '', requirements: '',
    location: '', type: 'Full-time', salary: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: formData.salary ? parseFloat(formData.salary) : null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
      } else {
        router.push('/employer/jobs')
      }
    } catch (error) {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Post a Job</h1>
          <p>Fill in the details to attract the right candidates.</p>
        </div>
      </div>

      <div className="form-card">
        {error && (
          <div style={{
            background: '#fef2f2', color: '#dc2626', padding: '12px 16px',
            borderRadius: '8px', marginBottom: '20px', fontSize: '14px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-group">
            <label>Job Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div className="form-group">
            <label>Job Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Olongapo City or Remote"
              required
            />
          </div>

          <div className="form-group">
            <label>Monthly Salary in ₱ (optional)</label>
            <input
              name="salary"
              type="number"
              min="0"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 25000"
            />
            {formData.salary && (
              <span className="form-hint">
                Display: ₱{Number(formData.salary).toLocaleString()}/mo
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              required
            />
          </div>

          <div className="form-group">
            <label>Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={5}
              placeholder="List each requirement on a new line:&#10;Bachelor's degree in Computer Science&#10;2+ years of React experience&#10;Strong communication skills"
              required
            />
            <span className="form-hint">Put each requirement on a new line.</span>
          </div>

          <div className="form-actions">
            <Link href="/employer/jobs" className="cancel-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Cancel
            </Link>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}