import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const location = searchParams.get('location') || ''

    const jobs = await prisma.jobPosting.findMany({
      where: {
        isActive: true,
        AND: [
          search ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } }
            ]
          } : {},
          type ? { type } : {},
          location ? { location: { contains: location } } : {}
        ]
      },
      include: {
        employer: { select: { name: true, company: true } },
        _count: { select: { applications: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, requirements, location, type, salary } = await request.json()

    if (!title || !description || !requirements || !location || !type) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const job = await prisma.jobPosting.create({
      data: {
        title,
        description,
        requirements,
        location,
        type,
        salary,
        employerId: session.user.id
      }
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}