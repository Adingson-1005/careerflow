import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { company, position, type } = await request.json()

    if (!position || !type) {
      return NextResponse.json({ error: 'Position and type are required' }, { status: 400 })
    }

    const prompt = `You are an expert career coach and interviewer. Generate 5 ${type} interview questions for a ${position} role${company ? ` at ${company}` : ''}.

For each question, provide:
1. The question itself
2. A brief tip on how to answer it effectively

Format your response as JSON array like this:
[
  {
    "question": "question here",
    "tip": "tip here"
  }
]

Only respond with the JSON array, no extra text.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    })

    const content = completion.choices[0]?.message?.content || '[]'
    const clean = content.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(clean)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Groq error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}