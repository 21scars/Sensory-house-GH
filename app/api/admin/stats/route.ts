// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [totalUsers, purchases, registrations] = await Promise.all([
    prisma.user.count(),
    prisma.purchase.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.sessionRegistration.aggregate({ _sum: { amount: true }, _count: true }),
  ])

  return NextResponse.json({
    totalUsers,
    totalPurchases: purchases._count,
    totalRegistrations: registrations._count,
    totalRevenue: (purchases._sum.amount || 0) + (registrations._sum.amount || 0),
  })
}
