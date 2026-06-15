'use client'

import Link from 'next/link'
import '@/styles/home.css'

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <nav className="landing-nav">
        <div className="landing-nav-logo">CareerFlow</div>
        <div className="landing-nav-links">
  
          <Link href="/register" className="nav-link-solid">Get Started</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">🚀 The smarter way to job hunt</div>
          <h1>Find Your <span>Dream Job</span><br />with CareerFlow</h1>
          <p>The all-in-one platform for job seekers and employers. Track applications, prepare for interviews with AI, and land your next opportunity.</p>
          <div className="landing-cta">
            <Link href="/register" className="cta-primary">Get Started — It's Free</Link>
            <Link href="/login" className="cta-secondary">Sign In →</Link>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">
              <div className="hero-card-logo">G</div>
              <span className="hero-card-badge">Full-time</span>
            </div>
            <div className="hero-card-title">Frontend Developer</div>
            <div className="hero-card-company">Google Philippines</div>
            <div className="hero-card-meta">📍 BGC, Taguig · 💰 ₱85,000/mo</div>
            <div className="hero-card-footer">
              <span>142 applicants</span>
              <div className="hero-card-apply">Apply Now</div>
            </div>
          </div>
          <div className="hero-card hero-card-offset">
            <div className="hero-card-header">
              <div className="hero-card-logo" style={{background: 'linear-gradient(135deg, #059669, #10b981)'}}>S</div>
              <span className="hero-card-badge">Remote</span>
            </div>
            <div className="hero-card-title">UI/UX Designer</div>
            <div className="hero-card-company">Shopify APAC</div>
            <div className="hero-card-meta">📍 Remote · 💰 ₱65,000/mo</div>
            <div className="hero-card-footer">
              <span>89 applicants</span>
              <div className="hero-card-apply">Apply Now</div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-features-header">
          <h2>Everything you need to land your next job</h2>
          <p>CareerFlow combines powerful tools for both job seekers and employers in one platform.</p>
        </div>
        <div className="landing-features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Application Tracker</h3>
            <p>Kanban-style board to track every application from wishlist to offer.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Interview Prep</h3>
            <p>Generate role-specific interview questions powered by Groq AI.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Career Analytics</h3>
            <p>Visualize your job search performance with charts and insights.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Interview Calendar</h3>
            <p>Schedule and manage all your upcoming interviews in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>For Employers</h3>
            <p>Post jobs, review applicants, and manage your hiring pipeline.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Dual Mode</h3>
            <p>Switch between Job Seeker and Employer mode with one click.</p>
          </div>
        </div>
      </section>

      <section className="landing-stats">
        <div className="landing-stat">
          <div className="landing-stat-value">100%</div>
          <div className="landing-stat-label">Free to Use</div>
        </div>
        <div className="landing-stat">
          <div className="landing-stat-value">AI</div>
          <div className="landing-stat-label">Powered Interview Prep</div>
        </div>
        <div className="landing-stat">
          <div className="landing-stat-value">2</div>
          <div className="landing-stat-label">Roles in One Account</div>
        </div>
        <div className="landing-stat">
          <div className="landing-stat-value">∞</div>
          <div className="landing-stat-label">Applications to Track</div>
        </div>
      </section>

      <section className="landing-cta-section">
        <h2>Ready to take control of your career?</h2>
        <p>Join CareerFlow today and start your journey towards your dream job.</p>
        <Link href="/register" className="cta-primary">Create Free Account</Link>
      </section>

      <footer className="landing-footer">
        <p>© 2026 CareerFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}