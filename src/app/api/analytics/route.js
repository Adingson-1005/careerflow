import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role === 'EMPLOYER') {
      const jobs = await prisma.jobPosting.findMany({
        where: { employerId: session.user.id },
        include: { _count: { select: { applications: true } } }
      })

      const totalJobs = jobs.length
      const totalApplicants = jobs.reduce((sum, job) => sum + job._count.applications, 0)
      const activeJobs = jobs.filter(j => j.isActive).length

      return NextResponse.json({ totalJobs, totalApplicants, activeJobs })
    }

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id }
    })

    const interviews = await prisma.interview.findMany({
      where: { userId: session.user.id }
    })

    const total = applications.length
    const totalInterviews = interviews.length
    const offered = applications.filter(a => ['Offer', 'Accepted'].includes(a.status)).length
    const rejected = applications.filter(a => a.status === 'Rejected').length
    const responseRate = total > 0 ? Math.round((totalInterviews / total) * 100) : 0
    const offerRate = total > 0 ? Math.round((offered / total) * 100) : 0

    const byStatus = {}
    applications.forEach(app => {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1
    })
    const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }))

    const monthly = {}
    applications.forEach(app => {
      const month = new Date(app.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' })
      monthly[month] = (monthly[month] || 0) + 1
    })
    const monthlyData = Object.entries(monthly).map(([month, count]) => ({ month, count }))

    return NextResponse.json({
      total, totalInterviews, offered, rejected,
      responseRate, offerRate, statusData, monthlyData
    })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}