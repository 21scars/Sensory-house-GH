// app/api/admin/posts/route.ts
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

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ posts })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, excerpt, content, category, coverImage } = body

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)

  const post = await prisma.post.create({
    data: { 
      title, 
      slug, 
      excerpt, 
      content, 
      category, 
      coverImage,
      authorId: (session.user as any).id
    },
  })

  return NextResponse.json({ post }, { status: 201 })
}
