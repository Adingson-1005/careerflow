'use client'

import { useSession } from 'next-auth/react'
import '@/styles/dashboard.css'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Welcome back, {session?.user?.name} 👋</h1>
        <p>Here's an overview of your job search activity.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <p className="stat-label">Total Applications</p>
            <p className="stat-value">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <p className="stat-label">Interviews Scheduled</p>
            <p className="stat-value">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p className="stat-label">Offers Received</p>
            <p className="stat-value">0</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Response Rate</p>
            <p className="stat-value">0%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Recent Applications</h2>
          <div className="empty-state">
            <p>No applications yet.</p>
            <Link href="/applications">Add your first application →</Link>
          </div>
        </div>

        <div className="section-card">
          <h2>Upcoming Interviews</h2>
          <div className="empty-state">
            <p>No interviews scheduled.</p>
            <Link href="/calendar">Schedule an interview →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}