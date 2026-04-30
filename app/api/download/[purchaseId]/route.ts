// app/api/download/[purchaseId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { purchaseId } = params

    // Verify ownership
    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, userId },
      include: { product: true },
    })

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found or unauthorized' }, { status: 404 })
    }

    if (purchase.product.type !== 'DIGITAL' || !purchase.product.fileUrl) {
      return NextResponse.json({ error: 'This product is not a downloadable resource' }, { status: 400 })
    }

    // Generate a signed URL valid for 15 minutes (900 seconds)
    const { data, error } = await supabaseAdmin.storage
      .from('ebooks')
      .createSignedUrl(purchase.product.fileUrl, 900, {
        download: `${purchase.product.title}.pdf`,
      })

    if (error || !data?.signedUrl) {
      console.error('Supabase signed URL error:', error)
      return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 })
    }

    // Track download count
    await prisma.purchase.update({
      where: { id: purchaseId },
      data: { downloadCount: { increment: 1 } },
    })

    return NextResponse.json({ url: data.signedUrl })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
