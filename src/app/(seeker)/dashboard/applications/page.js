'use client'

import { useState, useEffect } from 'react'
import '@/styles/applications.css'

const STATUSES = ['Applied', 'Assessment', 'Interview', 'Offer', 'Accepted', 'Rejected']

const STATUS_COLORS = {
  Applied: '#3b82f6',
  Assessment: '#f59e0b',
  Interview: '#8b5cf6',
  Offer: '#10b981',
  Accepted: '#059669',
  Rejected: '#ef4444'
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      setApplications(data)
    } catch (error) {
      console.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (app, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const updated = await res.json()
      setApplications(applications.map(a => a.id === updated.id ? { ...a, status: updated.status } : a))
    } catch (error) {
      console.error('Failed to update status')
    }
  }

  const getAppsByStatus = (status) => applications.filter(a => a.status === status)

  if (loading) return <div className="loading-screen">Loading applications...</div>

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Applications</h1>
          <p>Track your job applications across all stages.</p>
        </div>
      </div>

      <div className="kanban-board">
        {STATUSES.map(status => (
          <div key={status} className="kanban-column">
            <div className="column-header">
              <span className="column-dot" style={{ backgroundColor: STATUS_COLORS[status] }}></span>
              <span className="column-title">{status}</span>
              <span className="column-count">{getAppsByStatus(status).length}</span>
            </div>

            <div className="column-cards">
              {getAppsByStatus(status).map(app => (
                <div key={app.id} className="app-card">
                  <div className="card-header">
                    <h3 className="card-company">
                      {app.job?.employer?.company || app.job?.employer?.name}
                    </h3>
                  </div>
                  <p className="card-position">{app.job?.title}</p>
                  <p className="card-position">📍 {app.job?.location}</p>
                  {app.coverNote && (
                    <p className="card-notes">{app.coverNote}</p>
                  )}
                  <div className="card-footer">
                    <span className="card-date">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value)}
                      className="status-select"
                      style={{ borderColor: STATUS_COLORS[app.status] }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {getAppsByStatus(status).length === 0 && (
                <div className="empty-column">No applications</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}