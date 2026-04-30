// app/api/admin/products/route.ts
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

  const products = await prisma.product.findMany({
    include: { _count: { select: { purchases: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, description, longDesc, price, coverImage, fileUrl, category, tags, author, pageCount, type, stock } = body

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)

  const product = await prisma.product.create({
    data: { 
      title, 
      slug, 
      description, 
      longDesc, 
      price: parseFloat(price), 
      coverImage, 
      fileUrl, 
      category, 
      tags: tags && Array.isArray(tags) ? tags.join(',') : (tags || null), 
      author, 
      pageCount: pageCount ? parseInt(pageCount) : null,
      type: type || 'DIGITAL',
      stock: stock ? parseInt(stock) : null
    },
  })

  return NextResponse.json({ product }, { status: 201 })
}
