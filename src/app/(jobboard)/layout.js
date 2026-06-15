'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import '@/styles/dashboard.css'
import '@/styles/jobboard.css'

export default function JobBoardLayout({ children }) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const seekerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/applications', label: 'My Applications', icon: '📋' },
    { href: '/dashboard/calendar', label: 'Calendar', icon: '📅' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
    { href: '/dashboard/ai-prep', label: 'AI Interview Prep', icon: '🤖' },
  ]

  const employerLinks = [
    { href: '/employer/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/employer/jobs', label: 'My Job Posts', icon: '💼' },
    { href: '/employer/jobs/new', label: 'Post a Job', icon: '➕' },
    { href: '/employer/applicants', label: 'All Applicants', icon: '👥' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 200, transition: 'all 0.2s'
          }}
        />
      )}

      {/* Sliding Sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '280px', background: '#0f172a', color: 'white',
        zIndex: 300, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column',
        padding: '24px 16px', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#93c5fd' }}>CareerFlow</div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {session && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px', background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px', marginBottom: '24px'
          }}>
            <div style={{
              width: '38px', height: '38px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: '16px', flexShrink: 0
            }}>
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.user.name}
              </p>
              <p style={{ fontSize: '11px', color: '#93c5fd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        {session ? (
          <>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px', marginBottom: '8px' }}>
              Job Seeker
            </div>
            {seekerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '8px',
                  color: pathname === link.href ? 'white' : '#94a3b8',
                  background: pathname === link.href ? '#2563eb' : 'none',
                  textDecoration: 'none', fontSize: '14px', marginBottom: '2px',
                  transition: 'all 0.2s'
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            <div style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px', margin: '16px 0 8px' }}>
              Employer
            </div>
            {employerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '8px',
                  color: pathname === link.href ? 'white' : '#94a3b8',
                  background: pathname === link.href ? '#2563eb' : 'none',
                  textDecoration: 'none', fontSize: '14px', marginBottom: '2px',
                  transition: 'all 0.2s'
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  padding: '10px 12px', background: 'none',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                  color: '#94a3b8', fontSize: '14px', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit', display: 'flex',
                  alignItems: 'center', gap: '10px'
                }}
              >
                🚪 Sign Out
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <Link
              href="/login"
              onClick={() => setSidebarOpen(false)}
              style={{
                padding: '11px', background: '#2563eb', color: 'white',
                borderRadius: '8px', textDecoration: 'none', fontWeight: 600,
                fontSize: '14px', textAlign: 'center'
              }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setSidebarOpen(false)}
              style={{
                padding: '11px', background: 'none', color: '#93c5fd',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                textDecoration: 'none', fontWeight: 600, fontSize: '14px', textAlign: 'center'
              }}
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '64px',
        background: 'white', borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px'
            }}
          >
            <span style={{ width: '22px', height: '2px', background: '#374151', display: 'block', borderRadius: '2px' }}></span>
            <span style={{ width: '22px', height: '2px', background: '#374151', display: 'block', borderRadius: '2px' }}></span>
            <span style={{ width: '22px', height: '2px', background: '#374151', display: 'block', borderRadius: '2px' }}></span>
          </button>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e3a5f' }}>CareerFlow</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '34px', height: '34px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px'
              }}>
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                {session.user.name}
              </span>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-link-outline">Sign In</Link>
              <Link href="/register" className="nav-link-solid">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ paddingTop: '64px' }}>
        {children}
      </div>
    </div>
  )
}