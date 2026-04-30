// app/api/admin/sessions/route.ts
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
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const sessions = await prisma.session.findMany({
    include: { _count: { select: { registrations: true } } },
    orderBy: { scheduledAt: 'asc' },
  })

  return NextResponse.json({ sessions })
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, description, price, scheduledAt, duration, maxSlots, host, coverImage } = body

  // Auto-generate slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)

  const session = await prisma.session.create({
    data: { title, slug, description, price, scheduledAt: new Date(scheduledAt), duration, maxSlots, host, coverImage },
  })

  return NextResponse.json({ session }, { status: 201 })
}
