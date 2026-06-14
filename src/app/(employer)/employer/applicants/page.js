'use client'

import { useState, useEffect } from 'react'
import '@/styles/employer.css'
import '@/styles/dashboard.css'

const STATUS_BADGE = {
  Applied: 'badge-blue',
  Assessment: 'badge-yellow',
  Interview: 'badge-purple',
  Offer: 'badge-green',
  Accepted: 'badge-green',
  Rejected: 'badge-red'
}

export default function AllApplicantsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      const jobsRes = await fetch('/api/employer/jobs')
      const jobs = await jobsRes.json()

      const allApps = await Promise.all(
        jobs.map(job =>
          fetch(`/api/employer/jobs/${job.id}/applications`)
            .then(res => res.json())
            .then(apps => apps.map(app => ({ ...app, jobTitle: job.title })))
        )
      )

      setApplications(allApps.flat().sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      ))
    } catch (error) {
      console.error('Failed to fetch applicants')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading-screen">Loading...</div>

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>All Applicants</h1>
          <p>{applications.length} total applicants across all job posts.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          {applications.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Job Applied</th>
                  <th>Status</th>
                  <th>Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>{app.user?.name}</td>
                    <td>{app.user?.email}</td>
                    <td>{app.jobTitle}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="table-empty">
              <p>No applicants yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}