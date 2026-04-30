// app/api/cron/session-reminders/route.ts
// Triggered by Vercel Cron every hour: */60 * * * *
// Add to vercel.json: { "crons": [{ "path": "/api/cron/session-reminders", "schedule": "0 * * * *" }] }

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSessionReminder, sendMeetLink } from '@/lib/email'

export async function GET(req: NextRequest) {
  // Secure with a secret header to prevent unauthorized calls
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000)
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000)

  let remindersSent = 0
  let linksSent = 0

  try {
    // ── 24-HOUR REMINDERS ──
    const sessionsNeedingReminder = await prisma.sessionRegistration.findMany({
      where: {
        reminderSent: false,
        session: {
          scheduledAt: {
            gte: in24Hours,
            lte: new Date(in24Hours.getTime() + 60 * 60 * 1000), // within the next hour window
          },
          published: true,
        },
      },
      include: {
        session: true,
        user: true,
      },
    })

    for (const reg of sessionsNeedingReminder) {
      await sendSessionReminder({
        userName: reg.user.name,
        userEmail: reg.user.email,
        gmail: reg.gmail,
        sessionTitle: reg.session.title,
        scheduledAt: reg.session.scheduledAt,
        host: reg.session.host,
        duration: reg.session.duration,
      })

      await prisma.sessionRegistration.update({
        where: { id: reg.id },
        data: { reminderSent: true },
      })

      remindersSent++
    }

    // ── MEET LINK DELIVERY (1 hour before session) ──
    const sessionsNeedingLink = await prisma.sessionRegistration.findMany({
      where: {
        linkSent: false,
        session: {
          scheduledAt: {
            gte: inOneHour,
            lte: in2Hours,
          },
          published: true,
          meetLink: { not: null },
        },
      },
      include: {
        session: true,
        user: true,
      },
    })

    for (const reg of sessionsNeedingLink) {
      if (!reg.session.meetLink) continue

      await sendMeetLink({
        userName: reg.user.name,
        userEmail: reg.user.email,
        gmail: reg.gmail,
        sessionTitle: reg.session.title,
        scheduledAt: reg.session.scheduledAt,
        meetLink: reg.session.meetLink,
        host: reg.session.host,
      })

      await prisma.sessionRegistration.update({
        where: { id: reg.id },
        data: { linkSent: true },
      })

      linksSent++
    }

    return NextResponse.json({
      success: true,
      remindersSent,
      linksSent,
      processedAt: now.toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
