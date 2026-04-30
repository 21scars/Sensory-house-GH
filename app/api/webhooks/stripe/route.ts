// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendPurchaseConfirmation, sendSessionConfirmation } from '@/lib/email'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { type, productId, sessionId, userId, gmail } = session.metadata!

    try {
      if (type === 'product') {
        // Create purchase record
        const purchase = await prisma.purchase.create({
          data: {
            userId,
            productId,
            stripeSessionId: session.id,
            amount: session.amount_total! / 100,
          },
          include: {
            product: true,
            user: true,
          },
        })

        // Send confirmation email
        await sendPurchaseConfirmation({
          userName: purchase.user.name,
          userEmail: purchase.user.email,
          productTitle: purchase.product.title,
          purchaseId: purchase.id,
        })
      }

      if (type === 'session') {
        // Create registration record
        const registration = await prisma.sessionRegistration.create({
          data: {
            userId,
            sessionId,
            gmail,
            stripeSessionId: session.id,
            amount: session.amount_total! / 100,
          },
          include: {
            session: true,
            user: true,
          },
        })

        // Send confirmation email
        await sendSessionConfirmation({
          userName: registration.user.name,
          userEmail: registration.user.email,
          gmail,
          sessionTitle: registration.session.title,
          scheduledAt: registration.session.scheduledAt,
          host: registration.session.host,
        })
      }
    } catch (err) {
      console.error('Fulfillment error:', err)
      return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
