// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'Sensory House <noreply@sensoryhouse.com>'

// ─────────────────────────────────────────
// Shared HTML wrapper for all emails
// ─────────────────────────────────────────
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body { margin:0; padding:0; background:#040810; font-family: 'DM Sans', Arial, sans-serif; color:#f9f2e3; }
    .container { max-width:580px; margin:0 auto; padding:40px 20px; }
    .logo { font-size:24px; font-weight:300; letter-spacing:2px; color:#f9b830; margin-bottom:32px; }
    .card { background:#0e1c30; border:1px solid #1e3550; border-radius:4px; padding:32px; margin-bottom:24px; }
    h1 { font-size:28px; font-weight:300; color:#f9f2e3; margin:0 0 12px; line-height:1.3; }
    p { font-size:14px; line-height:1.7; color:#7e97b2; margin:0 0 16px; }
    .highlight { color:#f9f2e3; }
    .btn { display:inline-block; background:#f9b830; color:#040810; padding:14px 32px; text-decoration:none; font-size:13px; font-weight:600; letter-spacing:1px; text-transform:uppercase; border-radius:2px; margin-top:8px; }
    .detail-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #1e3550; font-size:13px; }
    .detail-label { color:#7e97b2; }
    .detail-value { color:#f9f2e3; font-weight:500; }
    .badge { display:inline-block; background:#f9b830; color:#040810; padding:4px 10px; border-radius:2px; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; }
    .footer { text-align:center; padding-top:24px; font-size:12px; color:#344f6b; }
    .meet-link { background:#152641; border:1px solid #f9b830; border-radius:4px; padding:16px 20px; margin:16px 0; word-break:break-all; color:#f9b830; font-size:13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦ Sensory House</div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} Sensory House. All rights reserved.</p>
      <p>You're receiving this because you have an account with Sensory House.</p>
    </div>
  </div>
</body>
</html>`
}

// ─────────────────────────────────────────
// 1. Product purchase confirmation
// ─────────────────────────────────────────
export async function sendPurchaseConfirmation({
  userName, userEmail, productTitle, purchaseId,
}: { userName: string; userEmail: string; productTitle: string; purchaseId: string }) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: `✦ Your purchase is ready — ${productTitle}`,
    html: emailWrapper(`
      <div class="card">
        <div class="badge">Purchase Confirmed</div>
        <h1 style="margin-top:16px;">Your product is ready.</h1>
        <p>Hi <span class="highlight">${userName}</span>, your purchase of <span class="highlight">"${productTitle}"</span> was successful. Head to your dashboard to access it anytime.</p>
        <div style="border-top:1px solid #1e3550; padding-top:16px; margin-top:16px;">
          <div class="detail-row"><span class="detail-label">Order ID</span><span class="detail-value">#${purchaseId.slice(0, 8).toUpperCase()}</span></div>
          <div class="detail-row"><span class="detail-label">Item</span><span class="detail-value">${productTitle}</span></div>
          <div class="detail-row" style="border:none"><span class="detail-label">Status</span><span style="color:#22c55e; font-weight:600;">Paid ✓</span></div>
        </div>
        <a href="${dashboardUrl}" class="btn" style="margin-top:24px; display:inline-block;">Go to My Library →</a>
      </div>
    `),
  })
}

// ─────────────────────────────────────────
// 2. Session registration confirmation
// ─────────────────────────────────────────
export async function sendSessionConfirmation({
  userName, userEmail, gmail, sessionTitle, scheduledAt, host,
}: { userName: string; userEmail: string; gmail: string; sessionTitle: string; scheduledAt: Date; host: string }) {
  const dateStr = scheduledAt.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = scheduledAt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

  await resend.emails.send({
    from: FROM,
    to: [userEmail, gmail],
    subject: `✦ You're registered — ${sessionTitle}`,
    html: emailWrapper(`
      <div class="card">
        <div class="badge">Session Registered</div>
        <h1 style="margin-top:16px;">You're in. See you there.</h1>
        <p>Hi <span class="highlight">${userName}</span>, your spot for <span class="highlight">"${sessionTitle}"</span> is confirmed. The Google Meet link will be sent to <span class="highlight">${gmail}</span> one hour before the session starts.</p>
        <div style="border-top:1px solid #1e3550; padding-top:16px; margin-top:16px;">
          <div class="detail-row"><span class="detail-label">Session</span><span class="detail-value">${sessionTitle}</span></div>
          <div class="detail-row"><span class="detail-label">Host</span><span class="detail-value">${host}</span></div>
          <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${dateStr}</span></div>
          <div class="detail-row" style="border:none"><span class="detail-label">Time</span><span class="detail-value">${timeStr}</span></div>
        </div>
        <p style="margin-top:20px; font-size:12px; color:#546e87;">📩 The meet link will be sent to <strong style="color:#f9b830">${gmail}</strong> one hour before the session. Add it to your calendar now!</p>
      </div>
    `),
  })
}

// ─────────────────────────────────────────
// 3. 24-hour session reminder
// ─────────────────────────────────────────
export async function sendSessionReminder({
  userName, userEmail, gmail, sessionTitle, scheduledAt, host, duration,
}: { userName: string; userEmail: string; gmail: string; sessionTitle: string; scheduledAt: Date; host: string; duration: number }) {
  const dateStr = scheduledAt.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })
  const timeStr = scheduledAt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

  await resend.emails.send({
    from: FROM,
    to: [userEmail, gmail],
    subject: `⏰ Tomorrow — ${sessionTitle}`,
    html: emailWrapper(`
      <div class="card">
        <div class="badge">Reminder — 24 Hours</div>
        <h1 style="margin-top:16px;">Your session is tomorrow.</h1>
        <p>Hi <span class="highlight">${userName}</span>, just a reminder that <span class="highlight">"${sessionTitle}"</span> with ${host} is happening tomorrow. The Google Meet link will arrive in your inbox one hour before it starts.</p>
        <div style="border-top:1px solid #1e3550; padding-top:16px; margin-top:16px;">
          <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${dateStr}</span></div>
          <div class="detail-row"><span class="detail-label">Time</span><span class="detail-value">${timeStr}</span></div>
          <div class="detail-row" style="border:none"><span class="detail-label">Duration</span><span class="detail-value">${duration} minutes</span></div>
        </div>
        <p style="margin-top:20px; font-size:13px; color:#7e97b2;">The Meet link will be sent to <strong style="color:#f9b830">${gmail}</strong> one hour before the session. Make sure to check that inbox.</p>
      </div>
    `),
  })
}

// ─────────────────────────────────────────
// 4. Meet link delivery (1 hour before)
// ─────────────────────────────────────────
export async function sendMeetLink({
  userName, userEmail, gmail, sessionTitle, scheduledAt, meetLink, host,
}: { userName: string; userEmail: string; gmail: string; sessionTitle: string; scheduledAt: Date; meetLink: string; host: string }) {
  const timeStr = scheduledAt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

  await resend.emails.send({
    from: FROM,
    to: [userEmail, gmail],
    subject: `🔗 Your Meet link — ${sessionTitle} starts in 1 hour`,
    html: emailWrapper(`
      <div class="card">
        <div class="badge" style="background:#22c55e;">Starting Soon</div>
        <h1 style="margin-top:16px;">"${sessionTitle}" starts in 1 hour.</h1>
        <p>Hi <span class="highlight">${userName}</span>, it's almost time! Here is your Google Meet link to join the session with <span class="highlight">${host}</span> at <span class="highlight">${timeStr}</span>.</p>
        <p style="font-size:13px; color:#7e97b2; margin-bottom:8px;">Your Google Meet link:</p>
        <div class="meet-link">${meetLink}</div>
        <a href="${meetLink}" class="btn" style="background:#22c55e; display:inline-block; margin-top:8px;">Join Session Now →</a>
        <p style="margin-top:20px; font-size:12px; color:#546e87;">This link is for your use only. Please don't share it with others. If you experience any issues, reply to this email.</p>
      </div>
    `),
  })
}
