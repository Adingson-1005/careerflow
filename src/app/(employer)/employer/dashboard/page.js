'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import '@/styles/dashboard.css'

export default function EmployerDashboard() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [analyticsRes, jobsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/employer/jobs')
      ])
      const analyticsData = await analyticsRes.json()
      const jobsData = await jobsRes.json()
      setAnalytics(analyticsData)
      setRecentJobs(jobsData.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading-screen">Loading...</div>

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Welcome, {session?.user?.name} 👋</h1>
          <p>{session?.user?.company} — Employer Dashboard</p>
        </div>
        <Link href="/employer/jobs/new" className="primary-btn">+ Post a Job</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <p className="stat-label">Total Job Posts</p>
            <p className="stat-value">{analytics?.totalJobs || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p className="stat-label">Active Jobs</p>
            <p className="stat-value">{analytics?.activeJobs || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p className="stat-label">Total Applicants</p>
            <p className="stat-value">{analytics?.totalApplicants || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Avg. Applicants/Job</p>
            <p className="stat-value">
              {analytics?.totalJobs > 0
                ? Math.round(analytics.totalApplicants / analytics.totalJobs)
                : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h2>Recent Job Posts</h2>
          <Link href="/employer/jobs" className="see-all">See all →</Link>
        </div>
        {recentJobs.length > 0 ? (
          <div className="recent-list">
            {recentJobs.map(job => (
              <div key={job.id} className="recent-item">
                <div className="recent-info">
                  <p className="recent-company">{job.title}</p>
                  <p className="recent-position">{job.location} · {job.type}</p>
                </div>
                <span className={`badge ${job.isActive ? 'badge-green' : 'badge-gray'}`}>
                  {job.isActive ? 'Active' : 'Closed'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No job posts yet.</p>
            <Link href="/employer/jobs/new">Post your first job →</Link>
          </div>
        )}
      </div>
    </div>
  )
}