'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import '@/styles/employer.css'
import '@/styles/dashboard.css'

const STATUSES = ['Applied', 'Assessment', 'Interview', 'Offer', 'Accepted', 'Rejected']

const STATUS_BADGE = {
  Applied: 'badge-blue',
  Assessment: 'badge-yellow',
  Interview: 'badge-purple',
  Offer: 'badge-green',
  Accepted: 'badge-green',
  Rejected: 'badge-red'
}

export default function JobApplicantsPage({ params }) {
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobAndApplicants()
  }, [])

  const fetchJobAndApplicants = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        fetch(`/api/jobs/${params.id}`),
        fetch(`/api/employer/jobs/${params.id}/applications`)
      ])
      const jobData = await jobRes.json()
      const appsData = await appsRes.json()
      setJob(jobData)
      setApplications(appsData)
    } catch (error) {
      console.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const updated = await res.json()
      setApplications(applications.map(a =>
        a.id === updated.id ? { ...a, status: updated.status } : a
      ))
    } catch (error) {
      console.error('Failed to update status')
    }
  }

  if (loading) return <div className="loading-screen">Loading...</div>

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>{job?.title}</h1>
          <p>{job?.location} · {job?.type} · {applications.length} applicants</p>
        </div>
        <Link href="/employer/jobs" className="btn-sm btn-sm-gray" style={{ textDecoration: 'none' }}>
          ← Back to Jobs
        </Link>
      </div>

      <div className="applicants-list">
        {applications.length > 0 ? applications.map(app => (
          <div key={app.id} className="applicant-card">
            <div className="applicant-info" style={{ flex: 1 }}>
              <h3>{app.user?.name}</h3>
              <p>{app.user?.email}</p>
              <p>Applied {new Date(app.createdAt).toLocaleDateString()}</p>
              {app.coverNote && (
                <div className="applicant-cover">
                  {app.coverNote}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <span className={`badge ${STATUS_BADGE[app.status]}`}>{app.status}</span>
              <select
                className="status-update-select"
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )) : (
          <div className="table-empty">
            <p>No applicants yet for this job.</p>
          </div>
        )}
      </div>
    </div>
  )
}