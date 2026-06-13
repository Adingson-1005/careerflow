import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { company, position, status, jobLink, notes } = await request.json()

    const application = await prisma.application.update({
      where: { id: params.id, userId: session.user.id },
      data: { company, position, status, jobLink, notes }
    })

    return NextResponse.json(application)
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.application.delete({
      where: { id: params.id, userId: session.user.id }
    })

    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}