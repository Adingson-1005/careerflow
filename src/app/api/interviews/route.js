import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const interviews = await prisma.interview.findMany({
      where: { userId: session.user.id },
      include: { application: true },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(interviews)
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { applicationId, date, type, notes } = await request.json()

    if (!applicationId || !date || !type) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const interview = await prisma.interview.create({
      data: {
        applicationId,
        date: new Date(date),
        type,
        notes,
        userId: session.user.id
      },
      include: { application: true }
    })

    return NextResponse.json(interview, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}