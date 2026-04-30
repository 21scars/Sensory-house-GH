'use client'
// app/sessions/[id]/page.tsx
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Users, Video, ArrowLeft, Mail, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const mockSession = {
  id: '1',
  title: 'Mastering Personal Finance in 2025',
  description: 'A deep-dive into budgeting, investing, and building lasting wealth — live and interactive with Q&A.',
  host: 'Serena Kohl',
  price: 49.99,
  scheduledAt: '2025-03-28T10:00:00Z',
  duration: 90,
  maxSlots: 50,
  registeredCount: 38,
  category: 'Finance',
  longDesc: `Join finance expert Serena Kohl for an intimate 90-minute live session where she'll break down the exact frameworks she uses to guide high-net-worth clients toward financial independence.

This is not a lecture — it's a live, interactive session with dedicated Q&A time. Come with your questions. Leave with a plan.

Topics covered:
• Building a bulletproof budget that you'll actually stick to
• Investing basics for beginners and intermediate savers  
• Debt elimination strategies that work in the real world
• Building emergency funds and long-term wealth`,
}

export default function SessionDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [gmail, setGmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const date = new Date(mockSession.scheduledAt)
  const spotsLeft = mockSession.maxSlots - mockSession.registeredCount

  const handleRegister = async () => {
    setError('')
    if (!session) {
      router.push(`/auth/login?callbackUrl=/sessions/${params.id}`)
      return
    }

    if (!gmail || !gmail.includes('@gmail.com')) {
      setError('Please enter a valid Gmail address to receive the session link.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'session', id: params.id, gmail }),
      })
      const { url, error: apiError } = await res.json()
      if (apiError) { setError(apiError); return }
      window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/sessions" className="inline-flex items-center gap-2 text-navy-400 hover:text-amber-300 font-body text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Sessions
        </Link>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="md:col-span-2">
            <span className="section-label block mb-3">{mockSession.category}</span>
            <h1 className="display-heading text-5xl mb-4 leading-tight">{mockSession.title}</h1>
            <p className="text-navy-400 font-body text-lg mb-6">
              Hosted by <span className="text-cream-100">{mockSession.host}</span>
            </p>

            {/* Session meta */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Calendar, label: 'Date', value: date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }) },
                { icon: Clock, label: 'Time', value: date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) },
                { icon: Clock, label: 'Duration', value: `${mockSession.duration} minutes` },
                { icon: Users, label: 'Spots Left', value: `${spotsLeft} of ${mockSession.maxSlots}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="card-dark p-4 flex items-start gap-3">
                  <Icon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="section-label text-[10px] mb-0.5">{label}</div>
                    <div className="text-cream-100 font-body text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              {mockSession.longDesc.split('\n\n').map((para, i) => (
                <p key={i} className="text-navy-400 font-body text-sm leading-relaxed mb-4">{para}</p>
              ))}
            </div>

            {/* How it works */}
            <div className="card-dark p-6">
              <h3 className="font-display text-xl text-cream-100 mb-4">How it works</h3>
              <ol className="space-y-3">
                {[
                  { label: 'Register & Pay', desc: 'Enter your Gmail and complete payment via Stripe.' },
                  { label: 'Get a Reminder', desc: 'We\'ll email you 24 hours before the session.' },
                  { label: 'Receive the Link', desc: 'The Google Meet link is sent 1 hour before start time to your Gmail.' },
                  { label: 'Join & Learn', desc: 'Click the link and join the live session on Google Meet.' },
                ].map(({ label, desc }, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-5 h-5 bg-amber-400 text-navy-950 rounded-sm text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-cream-100 font-body text-sm font-medium">{label} </span>
                      <span className="text-navy-400 font-body text-sm">{desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar - Registration */}
          <div>
            <div className="sticky top-28 card-dark p-6">
              <div className="text-center mb-6">
                <div className="font-display text-5xl text-amber-400">${mockSession.price}</div>
                <div className="text-navy-400 font-body text-sm mt-1">Per person · One-time fee</div>
              </div>

              {/* Capacity */}
              <div className="mb-5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-navy-400 font-body text-xs">Availability</span>
                  <span className={`font-body text-xs font-semibold ${spotsLeft < 10 ? 'text-amber-400' : 'text-green-400'}`}>
                    {spotsLeft} spots left
                  </span>
                </div>
                <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(mockSession.registeredCount / mockSession.maxSlots) * 100}%` }} />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-sm p-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 font-body text-xs">{error}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="section-label block mb-2">Your Gmail Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                  <input
                    type="email"
                    value={gmail}
                    onChange={e => setGmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="input-dark pl-10"
                  />
                </div>
                <p className="text-navy-500 font-body text-xs mt-2">
                  The session link will be sent to this Gmail address.
                </p>
              </div>

              <button onClick={handleRegister} disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                    Redirecting...
                  </span>
                ) : (
                  <><Video className="w-4 h-4" /> Register for ${mockSession.price}</>
                )}
              </button>

              <p className="text-center text-navy-500 font-body text-xs mt-3">
                Secure payment via Stripe
              </p>

              <div className="border-t border-navy-700 mt-5 pt-5 space-y-2">
                <div className="flex items-center gap-2 text-navy-400">
                  <span className="text-green-400 text-xs">✓</span>
                  <span className="font-body text-xs">Confirmation email immediately</span>
                </div>
                <div className="flex items-center gap-2 text-navy-400">
                  <span className="text-green-400 text-xs">✓</span>
                  <span className="font-body text-xs">24-hour reminder email</span>
                </div>
                <div className="flex items-center gap-2 text-navy-400">
                  <span className="text-green-400 text-xs">✓</span>
                  <span className="font-body text-xs">Meet link sent 1 hour before</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
