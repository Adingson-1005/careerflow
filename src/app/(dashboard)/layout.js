'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import '@/styles/dashboard.css'

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="loading-screen">Loading...</div>
  }

  if (!session) return null

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/applications', label: 'Applications', icon: '📋' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/ai-prep', label: 'AI Interview Prep', icon: '🤖' },
  ]

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-logo">CareerFlow</div>
        <div className="sidebar-user">
          <div className="user-avatar">{session.user.name?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <p className="user-name">{session.user.name}</p>
            <p className="user-email">{session.user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((link) => (
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

        <button className="signout-btn" onClick={() => signOut({ callbackUrl: '/login' })}>
          🚪 Sign Out
        </button>
      </aside>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}