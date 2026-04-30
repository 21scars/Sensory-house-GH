// app/api/admin/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const subscriptions = await prisma.subscription.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ subscriptions })
}

export async function PATCH(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { userId, plan, status, currentPeriodEnd } = body

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    update: { plan, status, currentPeriodEnd },
    create: { userId, plan, status, currentPeriodEnd },
  })

  return NextResponse.json({ subscription })
}
