'use client'

import { useState, useEffect } from 'react'
import '@/styles/applications.css'

const STATUSES = ['Wishlist', 'Applied', 'Assessment', 'Interview', 'Offer', 'Accepted', 'Rejected']

const STATUS_COLORS = {
  Wishlist: '#6b7280',
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
  const [showModal, setShowModal] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [formData, setFormData] = useState({
    company: '', position: '', status: 'Wishlist', jobLink: '', notes: ''
  })

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

  const handleOpenModal = (app = null) => {
    if (app) {
      setEditingApp(app)
      setFormData({
        company: app.company,
        position: app.position,
        status: app.status,
        jobLink: app.jobLink || '',
        notes: app.notes || ''
      })
    } else {
      setEditingApp(null)
      setFormData({ company: '', position: '', status: 'Wishlist', jobLink: '', notes: '' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingApp(null)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingApp) {
        const res = await fetch(`/api/applications/${editingApp.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const updated = await res.json()
        setApplications(applications.map(a => a.id === updated.id ? updated : a))
      } else {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const newApp = await res.json()
        setApplications([newApp, ...applications])
      }
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save application')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    try {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' })
      setApplications(applications.filter(a => a.id !== id))
    } catch (error) {
      console.error('Failed to delete application')
    }
  }

  const handleStatusChange = async (app, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...app, status: newStatus })
      })
      const updated = await res.json()
      setApplications(applications.map(a => a.id === updated.id ? updated : a))
    } catch (error) {
      console.error('Failed to update status')
    }
  }

  const getAppsByStatus = (status) => applications.filter(a => a.status === status)

  if (loading) return <div className="loading-screen">Loading applications...</div>

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Track your job applications across all stages.</p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>+ Add Application</button>
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
                    <h3 className="card-company">{app.company}</h3>
                    <div className="card-actions">
                      <button onClick={() => handleOpenModal(app)} className="action-btn edit">✏️</button>
                      <button onClick={() => handleDelete(app.id)} className="action-btn delete">🗑️</button>
                    </div>
                  </div>
                  <p className="card-position">{app.position}</p>
                  {app.jobLink && (
                    <a href={app.jobLink} target="_blank" rel="noopener noreferrer" className="card-link">
                      View Job Post →
                    </a>
                  )}
                  {app.notes && <p className="card-notes">{app.notes}</p>}
                  <div className="card-footer">
                    <span className="card-date">
                      {new Date(app.appliedDate).toLocaleDateString()}
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

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingApp ? 'Edit Application' : 'Add Application'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Company</label>
                <input name="company" value={formData.company} onChange={handleChange} placeholder="Google" required />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input name="position" value={formData.position} onChange={handleChange} placeholder="Frontend Developer" required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Job Link (optional)</label>
                <input name="jobLink" value={formData.jobLink} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any notes..." rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
                <button type="submit" className="submit-btn">{editingApp ? 'Save Changes' : 'Add Application'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}