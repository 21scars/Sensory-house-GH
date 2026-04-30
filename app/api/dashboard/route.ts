// app/api/dashboard/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id

  const [purchases, registrations] = await Promise.all([
    prisma.purchase.findMany({
      where: { userId },
      include: {
        product: {
          select: { title: true, author: true, coverImage: true, category: true, type: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),

    prisma.sessionRegistration.findMany({
      where: { userId },
      include: {
        session: {
          select: { title: true, host: true, scheduledAt: true, duration: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return NextResponse.json({ purchases, registrations })
}
