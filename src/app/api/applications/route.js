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
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { company, position, status, jobLink, notes } = await request.json()

    if (!company || !position) {
      return NextResponse.json({ error: 'Company and position are required' }, { status: 400 })
    }

    const application = await prisma.application.create({
      data: {
        company,
        position,
        status: status || 'Wishlist',
        jobLink,
        notes,
        userId: session.user.id
      }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}