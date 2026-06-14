'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import '@/styles/analytics.css'

const STATUS_COLORS = {
  Applied: '#3b82f6',
  Assessment: '#f59e0b',
  Interview: '#8b5cf6',
  Offer: '#10b981',
  Accepted: '#059669',
  Rejected: '#ef4444'
}

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#059669', '#ef4444']

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading-screen">Loading analytics...</div>

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Analytics</h1>
          <p>Insights into your job search performance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <p className="stat-label">Total Applications</p>
            <p className="stat-value">{data?.total || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <p className="stat-label">Total Interviews</p>
            <p className="stat-value">{data?.totalInterviews || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Response Rate</p>
            <p className="stat-value">{data?.responseRate || 0}%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p className="stat-label">Offer Rate</p>
            <p className="stat-value">{data?.offerRate || 0}%</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Applications per Month</h2>
          {data?.monthlyData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">No data yet. Apply to jobs to see chart.</div>
          )}
        </div>

        <div className="chart-card">
          <h2>Applications by Status</h2>
          {data?.statusData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {data.statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">No data yet. Apply to jobs to see chart.</div>
          )}
        </div>
      </div>

      <div className="chart-card">
        <h2>Application Status Breakdown</h2>
        <div className="status-breakdown">
          {data?.statusData?.length > 0 ? data.statusData.map((item) => (
            <div key={item.name} className="status-row">
              <div className="status-info">
                <span className="status-dot" style={{ backgroundColor: STATUS_COLORS[item.name] }}></span>
                <span className="status-name">{item.name}</span>
              </div>
              <div className="status-bar-wrapper">
                <div
                  className="status-bar"
                  style={{
                    width: `${(item.value / data.total) * 100}%`,
                    backgroundColor: STATUS_COLORS[item.name]
                  }}
                ></div>
              </div>
              <span className="status-count">{item.value}</span>
            </div>
          )) : (
            <div className="empty-chart">No data yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}