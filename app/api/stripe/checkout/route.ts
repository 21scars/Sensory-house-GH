// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'You must be logged in to purchase' }, { status: 401 })
    }

    const body = await req.json()
    const { type, id, gmail } = body // type: 'product' | 'session'
    const userId = (session.user as any).id
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (type === 'product') {
      const product = await prisma.product.findUnique({ where: { id } })
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

      // Check if already purchased
      const existing = await prisma.purchase.findFirst({
        where: { userId, productId: id },
      })
      if (existing && product.type === 'DIGITAL') {
        return NextResponse.json({ error: 'You already own this digital resource' }, { status: 409 })
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: session.user.email!,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.type === 'DIGITAL' ? `Digital Resource by ${product.author}` : `Physical Tool: ${product.category}`,
              images: [product.coverImage],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        }],
        metadata: { type: 'product', productId: id, userId },
        success_url: `${appUrl}/dashboard?purchase=success&type=product`,
        cancel_url: `${appUrl}/shop/${id}?cancelled=true`,
      })

      return NextResponse.json({ url: checkoutSession.url })
    }

    if (type === 'session') {
      if (!gmail || !gmail.includes('@gmail.com')) {
        return NextResponse.json({ error: 'A valid Gmail address is required' }, { status: 400 })
      }

      const liveSession = await prisma.session.findUnique({ where: { id } })
      if (!liveSession) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

      // Check if already registered
      const existing = await prisma.sessionRegistration.findFirst({
        where: { userId, sessionId: id },
      })
      if (existing) {
        return NextResponse.json({ error: 'You are already registered for this session' }, { status: 409 })
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: session.user.email!,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Live Session: ${liveSession.title}`,
              description: `With ${liveSession.host} via Google Meet`,
            },
            unit_amount: Math.round(liveSession.price * 100),
          },
          quantity: 1,
        }],
        metadata: { type: 'session', sessionId: id, userId, gmail },
        success_url: `${appUrl}/dashboard?purchase=success&type=session`,
        cancel_url: `${appUrl}/sessions/${id}?cancelled=true`,
      })

      return NextResponse.json({ url: checkoutSession.url })
    }

    return NextResponse.json({ error: 'Invalid purchase type' }, { status: 400 })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
