import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          include: {
            employer: { select: { name: true, company: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId, coverNote } = await request.json()

    const existing = await prisma.application.findFirst({
      where: { jobId, userId: session.user.id }
    })

    if (existing) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 })
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        coverNote,
        userId: session.user.id
      },
      include: {
        job: {
          include: {
            employer: { select: { name: true, company: true } }
          }
        }
      }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}