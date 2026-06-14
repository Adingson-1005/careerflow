'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import '@/styles/home.css'

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']

export default function HomePage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [totalJobs, setTotalJobs] = useState(0)

  useEffect(() => {
    fetchJobs()
  }, [type])

  const fetchJobs = async (searchQuery = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (type) params.append('type', type)

      const res = await fetch(`/api/jobs?${params}`)
      const data = await res.json()
      setJobs(data)
      setTotalJobs(data.length)
    } catch (error) {
      console.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(search)
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">CareerFlow</div>
        <div className="navbar-links">
          {session ? (
            <>
              <Link href={session.user.role === 'EMPLOYER' ? '/employer/dashboard' : '/dashboard'} className="nav-link-plain">
                Dashboard
              </Link>
              <Link href={session.user.role === 'EMPLOYER' ? '/employer/dashboard' : '/dashboard'} className="nav-link-solid">
                Go to App
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link-outline">Sign In</Link>
              <Link href="/register" className="nav-link-solid">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>Find Your <span>Dream Job</span><br />with CareerFlow</h1>
        <p>Browse thousands of job opportunities and manage your entire job search in one place.</p>

        <form onSubmit={handleSearch} className="hero-search">
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="hero-search-btn">Search Jobs</button>
        </form>

        <div className="hero-stats">
          <div>
            <div className="hero-stat-value">{totalJobs}+</div>
            <div className="hero-stat-label">Jobs Available</div>
          </div>
          <div>
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-label">Free to Use</div>
          </div>
          <div>
            <div className="hero-stat-value">AI</div>
            <div className="hero-stat-label">Interview Prep</div>
          </div>
        </div>
      </section>

      <section className="jobs-section">
        <div className="jobs-section-header">
          <h2>Latest Job Openings</h2>
        </div>

        <div className="jobs-filters">
          <select
            className="filter-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="empty-jobs">
            <div className="empty-jobs-icon">⏳</div>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.length > 0 ? jobs.map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="job-card">
                <div className="job-card-header">
                  <div className="job-company-logo">
                    {(job.employer?.company || job.employer?.name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <span className="job-type-badge">{job.type}</span>
                </div>
                <div className="job-title">{job.title}</div>
                <div className="job-company">{job.employer?.company || job.employer?.name}</div>
                <div className="job-meta">
                  <span className="job-meta-item">📍 {job.location}</span>
                  {job.salary && <span className="job-meta-item">💰 {job.salary}</span>}
                </div>
                <div className="job-card-footer">
                  <span className="job-applicants">{job._count?.applications || 0} applicants</span>
                  <span className="job-date">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            )) : (
              <div className="empty-jobs">
                <div className="empty-jobs-icon">🔍</div>
                <p>No jobs found. Try a different search.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="footer">
        <p>© 2026 CareerFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}