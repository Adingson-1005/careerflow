'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import '@/styles/employer.css'
import '@/styles/dashboard.css'

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/employer/jobs')
      const data = await res.json()
      setJobs(data)
    } catch (error) {
      console.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (job) => {
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !job.isActive })
      })
      const updated = await res.json()
      setJobs(jobs.map(j => j.id === updated.id ? { ...j, isActive: updated.isActive } : j))
    } catch (error) {
      console.error('Failed to update job')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job post?')) return
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
      setJobs(jobs.filter(j => j.id !== id))
    } catch (error) {
      console.error('Failed to delete job')
    }
  }

  if (loading) return <div className="loading-screen">Loading...</div>

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Job Posts</h1>
          <p>Manage your active and closed job postings.</p>
        </div>
        <Link href="/employer/jobs/new" className="primary-btn">+ Post a Job</Link>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          {jobs.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                    <td>{job.type}</td>
                    <td>{job.location}</td>
                    <td>{job._count?.applications || 0}</td>
                    <td>
                      <span className={`badge ${job.isActive ? 'badge-green' : 'badge-gray'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link href={`/employer/jobs/${job.id}`} className="btn-sm btn-sm-primary">
                          View
                        </Link>
                        <button
                          className="btn-sm btn-sm-gray"
                          onClick={() => handleToggleActive(job)}
                        >
                          {job.isActive ? 'Close' : 'Reopen'}
                        </button>
                        <button
                          className="btn-sm btn-sm-danger"
                          onClick={() => handleDelete(job.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="table-empty">
              <p>No job posts yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}