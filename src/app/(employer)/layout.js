'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import '@/styles/dashboard.css'
import '@/styles/employer.css'

export default function EmployerLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/')
  }, [status, router])

  if (status === 'loading') return <div className="loading-screen">Loading...</div>
  if (!session) return null

  const navLinks = [
    { href: '/employer/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/employer/jobs', label: 'My Job Posts', icon: '💼' },
    { href: '/employer/jobs/new', label: 'Post a Job', icon: '➕' },
    { href: '/employer/applicants', label: 'All Applicants', icon: '👥' },
  ]

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-logo">CareerFlow</div>
        <div className="sidebar-user">
          <div className="user-avatar">
            {session.user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <p className="user-name">{session.user.name}</p>
            <p className="user-email">{session.user.company || session.user.email}</p>
            <span className="user-role-badge" style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7' }}>Employer</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="sidebar-section-label">Explore</div>
          <Link href="/" className="nav-link">
            <span className="nav-icon">🌐</span>
            <span>View Job Board</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="mode-switch-btn"
            onClick={() => router.push('/dashboard')}
          >
            <span>💼</span>
            <span>Switch to Job Seeker Mode</span>
          </button>
          <button
            className="signout-btn"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            🚪 <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="employer-main">
        {children}
      </main>
    </div>
  )
}