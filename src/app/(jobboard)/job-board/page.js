'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import '@/styles/home.css'

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']

export default function JobBoardPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Job Board
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Browse all available job postings from our employers.
        </p>
      </div>

      <form onSubmit={handleSearch} className="browse-search-bar">
        <input
          type="text"
          className="browse-search-input"
          placeholder="Search jobs, companies, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="browse-filter-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="submit" className="browse-search-btn">Search</button>
      </form>

      {loading ? (
        <div className="browse-empty">
          <div className="browse-empty-icon">⏳</div>
          <p>Loading jobs...</p>
        </div>
      ) : (
        <div className="browse-grid">
          {jobs.length > 0 ? jobs.map(job => (
            <Link key={job.id} href={`/job-board/${job.id}`} className="browse-job-card">
              <div className="browse-card-top">
                <div className="browse-card-logo">
                  {(job.employer?.company || job.employer?.name || 'C').charAt(0).toUpperCase()}
                </div>
                <span className="browse-card-type">{job.type}</span>
              </div>
              <div className="browse-card-title">{job.title}</div>
              <div className="browse-card-company">
                {job.employer?.company || job.employer?.name}
              </div>
              <div className="browse-card-meta">
                <span className="browse-card-meta-item">📍 {job.location}</span>
                {job.salary && (
                  <span className="browse-card-salary">
                    ₱{Number(job.salary).toLocaleString()}/mo
                  </span>
                )}
              </div>
              <div className="browse-card-footer">
                <span className="browse-card-applicants">
                  {job._count?.applications || 0} applicants
                </span>
                <span className="browse-card-date">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          )) : (
            <div className="browse-empty">
              <div className="browse-empty-icon">🔍</div>
              <p>No jobs found. Try a different search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}