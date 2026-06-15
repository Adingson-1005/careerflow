'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import '@/styles/dashboard.css'

export default function SeekerLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/')
  }, [status, router])

  if (status === 'loading') return <div className="loading-screen">Loading...</div>
  if (!session) return null

 const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/browse', label: 'Browse Jobs', icon: '🔍' },
  { href: '/dashboard/applications', label: 'My Applications', icon: '📋' },
  { href: '/dashboard/calendar', label: 'Calendar', icon: '📅' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { href: '/dashboard/ai-prep', label: 'AI Interview Prep', icon: '🤖' },
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
            <p className="user-email">{session.user.email}</p>
            <span className="user-role-badge">Job Seeker</span>
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
        </nav>

        <div className="sidebar-bottom">
          <button
            className="mode-switch-btn"
            onClick={() => router.push('/employer/dashboard')}
          >
            <span>🏢</span>
            <span>Switch to Employer Mode</span>
          </button>
          <button
            className="signout-btn"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            🚪 <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}