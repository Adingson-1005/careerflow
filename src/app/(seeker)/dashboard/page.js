'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import '@/styles/dashboard.css'

const STATUS_COLORS = {
  Applied: '#3b82f6',
  Assessment: '#f59e0b',
  Interview: '#8b5cf6',
  Offer: '#10b981',
  Accepted: '#059669',
  Rejected: '#ef4444'
}

export default function SeekerDashboard() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState(null)
  const [recentApps, setRecentApps] = useState([])
  const [upcomingInterviews, setUpcomingInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [analyticsRes, appsRes, interviewsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/applications'),
        fetch('/api/interviews')
      ])

      const analyticsData = await analyticsRes.json()
      const appsData = await appsRes.json()
      const interviewsData = await interviewsRes.json()

      setAnalytics(analyticsData)
      setRecentApps(appsData.slice(0, 5))
      setUpcomingInterviews(
        interviewsData
          .filter(i => new Date(i.date) >= new Date())
          .slice(0, 5)
      )
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
          <h1>Welcome back, {session?.user?.name} 👋</h1>
          <p>Here's your job search overview.</p>
        </div>
        <Link href="/" className="primary-btn">Browse Jobs</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <p className="stat-label">Total Applications</p>
            <p className="stat-value">{analytics?.total || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <p className="stat-label">Interviews</p>
            <p className="stat-value">{analytics?.totalInterviews || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p className="stat-label">Offers</p>
            <p className="stat-value">{analytics?.offered || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Response Rate</p>
            <p className="stat-value">{analytics?.responseRate || 0}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <div className="section-card-header">
            <h2>Recent Applications</h2>
            <Link href="/dashboard/applications" className="see-all">See all →</Link>
          </div>
          {recentApps.length > 0 ? (
            <div className="recent-list">
              {recentApps.map(app => (
                <div key={app.id} className="recent-item">
                  <div className="recent-info">
                    <p className="recent-company">
                      {app.job?.employer?.company || app.job?.employer?.name}
                    </p>
                    <p className="recent-position">{app.job?.title}</p>
                  </div>
                  <span
                    className="recent-status"
                    style={{
                      backgroundColor: (STATUS_COLORS[app.status] || '#6b7280') + '20',
                      color: STATUS_COLORS[app.status] || '#6b7280'
                    }}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No applications yet.</p>
              <Link href="/">Browse jobs to apply →</Link>
            </div>
          )}
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <h2>Upcoming Interviews</h2>
            <Link href="/dashboard/calendar" className="see-all">See all →</Link>
          </div>
          {upcomingInterviews.length > 0 ? (
            <div className="recent-list">
              {upcomingInterviews.map(interview => (
                <div key={interview.id} className="recent-item">
                  <div className="recent-info">
                    <p className="recent-company">
                      {interview.application?.job?.employer?.company ||
                       interview.application?.job?.employer?.name}
                    </p>
                    <p className="recent-position">{interview.type} Interview</p>
                  </div>
                  <span className="interview-date">
                    {new Date(interview.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No upcoming interviews.</p>
              <Link href="/dashboard/calendar">Schedule one →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}