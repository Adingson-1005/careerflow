'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import '@/styles/jobs.css'

export default function JobBoardDetailPage({ params }) {
  const { data: session } = useSession()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coverNote, setCoverNote] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJob()
  }, [])

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${params.id}`)
      const data = await res.json()
      setJob(data)
    } catch (error) {
      console.error('Failed to fetch job')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    setApplying(true)
    setError('')
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: params.id, coverNote })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
      } else {
        setApplied(true)
      }
    } catch (err) {
      setError('Failed to apply. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="loading-screen">Loading...</div>
  if (!job) return <div className="loading-screen">Job not found.</div>

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
      <Link href="/job-board" className="job-detail-back">← Back to Job Board</Link>

      <div className="job-detail-card">
        <div className="job-detail-header">
          <div>
            <div className="job-detail-title">{job.title}</div>
            <div className="job-detail-company">
              {job.employer?.company || job.employer?.name}
            </div>
            <div className="job-detail-badges">
              <span className="job-detail-badge">{job.type}</span>
              <span className="job-detail-badge gray">📍 {job.location}</span>
              {job.salary && (
                <span className="job-detail-badge green">
                  💰 ₱{Number(job.salary).toLocaleString()}/mo
                </span>
              )}
              <span className="job-detail-badge gray">
                {job._count?.applications || 0} applicants
              </span>
            </div>
          </div>
          <div className="job-detail-logo">
            {(job.employer?.company || job.employer?.name || 'C').charAt(0).toUpperCase()}
          </div>
        </div>

        <hr className="job-detail-divider" />

        <div className="job-detail-section">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-detail-section">
          <h3>Requirements</h3>
          <ul>
            {job.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="apply-card">
        <h3>Apply for this position</h3>
        {applied ? (
          <div className="apply-success">
            ✅ Application submitted! Track it in your{' '}
            <Link href="/dashboard/applications">Applications</Link> page.
          </div>
        ) : session ? (
          <>
            <p>Write a brief cover note to stand out from other applicants.</p>
            {error && <div className="apply-error">{error}</div>}
            <textarea
              className="apply-textarea"
              rows={4}
              placeholder="Tell the employer why you're a great fit..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
            />
            <button className="apply-btn" onClick={handleApply} disabled={applying}>
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </>
        ) : (
          <div className="apply-login-prompt">
            <p>You need to be signed in to apply for this position.</p>
            <br />
            <Link href="/login">Sign In</Link> or <Link href="/register">Create an Account</Link>
          </div>
        )}
      </div>
    </div>
  )
}