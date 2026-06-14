'use client'

import { useState } from 'react'
import '@/styles/ai-prep.css'

const QUESTION_TYPES = ['Technical', 'Behavioral', 'Situational', 'Role-Specific', 'General']

export default function AIPrepPage() {
  const [formData, setFormData] = useState({ company: '', position: '', type: 'Technical' })
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setQuestions([])
    setExpandedIndex(null)

    try {
      const res = await fetch('/api/ai-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setQuestions(data.questions)
      }
    } catch (err) {
      setError('Failed to generate questions')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>AI Interview Prep</h1>
          <p>Generate practice questions tailored to your target role.</p>
        </div>
      </div>

      <div className="ai-prep-layout">
        <div className="ai-prep-form-card">
          <h2>Generate Questions</h2>
          <form onSubmit={handleGenerate} className="ai-form">
            <div className="form-group">
              <label>Position <span className="required">*</span></label>
              <input
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>
            <div className="form-group">
              <label>Company (optional)</label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
              />
            </div>
            <div className="form-group">
              <label>Question Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? (
                <span className="loading-text">
                  <span className="spinner"></span>
                  Generating...
                </span>
              ) : '🤖 Generate Questions'}
            </button>
          </form>
        </div>

        <div className="ai-results">
          {error && <div className="ai-error">{error}</div>}
          {questions.length === 0 && !loading && !error && (
            <div className="ai-empty">
              <div className="ai-empty-icon">🤖</div>
              <p>Fill in the form and click Generate to get AI-powered interview questions.</p>
            </div>
          )}
          {loading && (
            <div className="ai-empty">
              <div className="ai-empty-icon">⏳</div>
              <p>Generating questions for you...</p>
            </div>
          )}
          {questions.length > 0 && (
            <div className="questions-list">
              <h2>{questions.length} Questions Generated</h2>
              {questions.map((q, index) => (
                <div key={index} className="question-card">
                  <div className="question-header" onClick={() => toggleExpand(index)}>
                    <div className="question-number">Q{index + 1}</div>
                    <p className="question-text">{q.question}</p>
                    <span className="expand-icon">{expandedIndex === index ? '▲' : '▼'}</span>
                  </div>
                  {expandedIndex === index && (
                    <div className="question-tip">
                      <span className="tip-label">💡 Tip</span>
                      <p>{q.tip}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}