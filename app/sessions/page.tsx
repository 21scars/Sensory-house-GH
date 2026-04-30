// app/sessions/page.tsx
import Link from 'next/link'
import { Calendar, Clock, Users, Video, ArrowRight } from 'lucide-react'

const sessions = [
  {
    id: '1', title: 'Mastering Personal Finance in 2025', host: 'Serena Kohl',
    description: 'A deep-dive into budgeting, investing, and building lasting wealth — live and interactive with Q&A.',
    price: 49.99, scheduledAt: '2025-03-28T10:00:00Z', duration: 90, maxSlots: 50, registeredCount: 38,
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', category: 'Finance',
  },
  {
    id: '2', title: 'The Psychology of Habit Formation', host: 'Dr. Aiden Ross',
    description: 'Understand why habits stick and how to design behaviour change that lasts. Evidence-based frameworks.',
    price: 39.99, scheduledAt: '2025-04-05T14:00:00Z', duration: 60, maxSlots: 30, registeredCount: 22,
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', category: 'Psychology',
  },
  {
    id: '3', title: 'Building a 6-Figure Content Brand', host: 'Priya Nair',
    description: 'From zero to audience. Content strategy, monetisation, and the mindset shifts that separate amateurs from pros.',
    price: 59.99, scheduledAt: '2025-04-12T16:00:00Z', duration: 120, maxSlots: 40, registeredCount: 15,
    coverImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', category: 'Marketing',
  },
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    day: d.getDate(),
    month: d.toLocaleString('default', { month: 'short' }),
    time: d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    full: d.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
  }
}

export default function SessionsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="section-label block mb-3">Live & Interactive</span>
          <h1 className="display-heading text-5xl mb-4">Online Sessions</h1>
          <p className="text-navy-400 font-body text-lg">
            Join intimate live sessions on Google Meet. Ask questions, get direct access to experts, and learn in real time.
          </p>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {[
            { step: '01', title: 'Choose a session', desc: 'Browse upcoming sessions and pick your topic' },
            { step: '02', title: 'Register with Gmail', desc: 'Pay the session fee and provide your Gmail for the invite' },
            { step: '03', title: 'Get the link', desc: 'Receive a reminder email, then the Meet link on session day' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="card-dark p-6 flex gap-4">
              <span className="font-display text-4xl text-amber-400/30 font-light flex-shrink-0">{step}</span>
              <div>
                <h3 className="font-body font-semibold text-cream-100 mb-1">{title}</h3>
                <p className="text-navy-400 font-body text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sessions list */}
        <div className="space-y-6">
          {sessions.map(session => {
            const date = formatDate(session.scheduledAt)
            const spotsLeft = session.maxSlots - session.registeredCount
            const percentFull = (session.registeredCount / session.maxSlots) * 100

            return (
              <div key={session.id} className="card-dark group hover:border-amber-400/30 transition-all duration-300 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Date sidebar */}
                  <div className="flex-shrink-0 md:w-32 bg-navy-900/80 flex md:flex-col items-center justify-center gap-4 md:gap-0 p-4 md:p-0 border-b md:border-b-0 md:border-r border-navy-700/50">
                    <div className="text-center">
                      <div className="text-amber-400 font-body text-xs uppercase tracking-wider mb-1">{date.month}</div>
                      <div className="font-display text-5xl text-cream-100 font-light">{date.day}</div>
                    </div>
                    <div className="text-center md:mt-4 md:pb-4">
                      <Clock className="w-4 h-4 text-navy-400 mx-auto mb-1" />
                      <div className="text-navy-400 font-body text-xs">{date.time}</div>
                      <div className="text-navy-500 font-body text-xs">{session.duration}min</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <span className="section-label block mb-2">{session.category}</span>
                        <h2 className="font-display text-2xl text-cream-100 mb-2 group-hover:text-amber-300 transition-colors leading-tight">
                          {session.title}
                        </h2>
                        <p className="text-navy-400 font-body text-sm mb-3">Hosted by <span className="text-cream-100/80">{session.host}</span></p>
                        <p className="text-navy-400 font-body text-sm leading-relaxed mb-4">{session.description}</p>

                        {/* Capacity bar */}
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-4 h-4 text-navy-400" />
                          <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percentFull}%` }} />
                          </div>
                          <span className="text-navy-400 font-body text-xs flex-shrink-0">
                            <span className={spotsLeft < 10 ? 'text-amber-400' : 'text-navy-300'}>{spotsLeft}</span> spots left
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="font-display text-4xl text-amber-400 mb-4">${session.price}</div>
                        <Link href={`/sessions/${session.id}`} className="btn-primary text-xs">
                          <Video className="w-4 h-4" /> Register
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
