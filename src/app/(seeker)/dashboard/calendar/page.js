'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import '@/styles/calendar.css'

const INTERVIEW_TYPES = ['Technical', 'Behavioral', 'HR', 'Final', 'Panel', 'Other']

export default function CalendarPage() {
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [formData, setFormData] = useState({
    applicationId: '', date: '', type: 'Technical', notes: ''
  })

  useEffect(() => {
    fetchInterviews()
    fetchApplications()
  }, [])

  const fetchInterviews = async () => {
    const res = await fetch('/api/interviews')
    const data = await res.json()
    setInterviews(data)
  }

  const fetchApplications = async () => {
    const res = await fetch('/api/applications')
    const data = await res.json()
    setApplications(data)
  }

  const handleDateClick = (arg) => {
    setSelectedInterview(null)
    setFormData({
      applicationId: '',
      date: arg.dateStr + 'T09:00',
      type: 'Technical',
      notes: ''
    })
    setShowModal(true)
  }

  const handleEventClick = (arg) => {
    const interview = interviews.find(i => i.id === arg.event.id)
    setSelectedInterview(interview)
    setShowModal(true)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const newInterview = await res.json()
      setInterviews([...interviews, newInterview])
      setShowModal(false)
    } catch (error) {
      console.error('Failed to save interview')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this interview?')) return
    await fetch(`/api/interviews/${id}`, { method: 'DELETE' })
    setInterviews(interviews.filter(i => i.id !== id))
    setShowModal(false)
  }

  const calendarEvents = interviews.map(i => ({
    id: i.id,
    title: `${i.type} - ${i.application?.job?.employer?.company || i.application?.job?.employer?.name || ''}`,
    date: i.date,
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8'
  }))

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Calendar</h1>
          <p>Schedule and manage your interviews.</p>
        </div>
      </div>

      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {selectedInterview ? (
              <>
                <div className="modal-header">
                  <h2>Interview Details</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                <div className="interview-details">
                  <div className="detail-row">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">
                      {selectedInterview.application?.job?.employer?.company ||
                       selectedInterview.application?.job?.employer?.name}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Position</span>
                    <span className="detail-value">
                      {selectedInterview.application?.job?.title}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{selectedInterview.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">
                      {new Date(selectedInterview.date).toLocaleString()}
                    </span>
                  </div>
                  {selectedInterview.notes && (
                    <div className="detail-row">
                      <span className="detail-label">Notes</span>
                      <span className="detail-value">{selectedInterview.notes}</span>
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button onClick={() => handleDelete(selectedInterview.id)} className="delete-btn">
                    Delete
                  </button>
                  <button onClick={() => setShowModal(false)} className="cancel-btn">Close</button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Schedule Interview</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Application</label>
                    <select
                      name="applicationId"
                      value={formData.applicationId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select application...</option>
                      {applications.map(app => (
                        <option key={app.id} value={app.id}>
                          {app.job?.employer?.company || app.job?.employer?.name} — {app.job?.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date & Time</label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Interview Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                      {INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Notes (optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Preparation notes..."
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">Schedule</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}