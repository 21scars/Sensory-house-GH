'use client'
// app/dashboard/page.tsx
import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Video, Download, CheckCircle, Clock, ShoppingBag, GraduationCap, Users } from 'lucide-react'

type Purchase = {
  id: string
  product: { title: string; author: string; coverImage: string; category: string; type: string }
  createdAt: string
  downloadCount: number
}

type Registration = {
  id: string
  session: { title: string; host: string; scheduledAt: string; duration: number }
  gmail: string
  linkSent: boolean
  reminderSent: boolean
  createdAt: string
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const justPurchased = searchParams.get('purchase') === 'success'

  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'resources' | 'sessions'>('resources')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login?callbackUrl=/dashboard')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/dashboard')
        .then(r => r.json())
        .then(data => {
          setPurchases(data.purchases || [])
          setRegistrations(data.registrations || [])
          setLoading(false)
        })
    }
  }, [status])

  const handleDownload = async (purchaseId: string) => {
    setDownloading(purchaseId)
    try {
      const res = await fetch(`/api/download/${purchaseId}`)
      const { url, error } = await res.json()
      if (error) { alert(error); return }
      window.open(url, '_blank')
    } finally {
      setDownloading(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sensory-off-white">
        <div className="w-10 h-10 border-4 border-sensory-purple/20 border-t-sensory-purple rounded-full animate-spin" />
      </div>
    )
  }

  const accountType = (session?.user as any)?.accountType || 'PARENT'

  return (
    <div className="min-h-screen pt-32 pb-20 bg-sensory-off-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Success toast */}
        {justPurchased && (
          <div className="flex items-center gap-3 bg-sensory-green-light/20 border-2 border-sensory-green-light rounded-xl px-6 py-4 mb-10 shadow-lg animate-fade-up">
            <CheckCircle className="w-6 h-6 text-sensory-green-dark" />
            <p className="text-sensory-green-dark font-bold text-sm">
              Payment successful! Your resource is now available in your library.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-12 flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-sensory-purple text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                {accountType} Account
              </span>
            </div>
            <h1 className="display-heading text-5xl">Hello, {session?.user?.name}!</h1>
            <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">{session?.user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/shop" className="btn-ghost px-6 py-3 text-xs bg-white">
               <ShoppingBag className="w-4 h-4" /> Marketplace
            </Link>
            <Link href="/academy" className="btn-primary px-6 py-3 text-xs">
               <GraduationCap className="w-4 h-4" /> Academy
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Resources', value: purchases.length, icon: BookOpen, color: 'text-sensory-purple' },
            { label: 'Courses', value: registrations.length, icon: GraduationCap, color: 'text-sensory-yellow' },
            { label: 'Downloads', value: purchases.reduce((a, p) => a + p.downloadCount, 0), icon: Download, color: 'text-sensory-green-dark' },
            { label: 'Live Events', value: registrations.filter(r => new Date(r.session.scheduledAt) > new Date()).length, icon: Clock, color: 'text-sensory-purple-dark' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card-light p-6 text-center border-none shadow-sm hover:shadow-md transition-all group">
              <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                 <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="font-display text-4xl text-sensory-purple-dark font-bold">{value}</div>
              <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-10 overflow-x-auto">
          {(['resources', 'sessions'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-sensory-purple border-b-4 border-sensory-purple'
                  : 'text-gray-400 hover:text-sensory-purple-dark'
              }`}>
              {tab === 'resources' ? `My Library (${purchases.length})` : `My Learning (${registrations.length})`}
            </button>
          ))}
        </div>

        {/* Resources */}
        {activeTab === 'resources' && (
          <div className="animate-fade-in">
            {purchases.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ShoppingBag className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="font-display text-3xl text-sensory-purple-dark font-bold mb-4">Your library is empty</h3>
                <p className="text-gray-400 font-bold text-sm mb-10 uppercase tracking-widest">Discover resources in the marketplace</p>
                <Link href="/shop" className="btn-primary px-10">Start Exploring</Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {purchases.map(purchase => (
                  <div key={purchase.id} className="card-light p-6 flex items-center gap-6 group hover:border-sensory-purple transition-colors">
                    <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-md">
                      <img src={purchase.product.coverImage} alt={purchase.product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sensory-purple text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 bg-sensory-purple/10 rounded-full">{purchase.product.category}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${purchase.product.type === 'DIGITAL' ? 'bg-sensory-yellow/20 text-sensory-purple-dark' : 'bg-sensory-green-light/20 text-sensory-green-dark'}`}>{purchase.product.type}</span>
                      </div>
                      <h3 className="font-display text-xl text-sensory-purple-dark font-bold mb-1 truncate">{purchase.product.title}</h3>
                      {purchase.product.author && <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">by {purchase.product.author}</p>}
                      
                      {purchase.product.type === 'DIGITAL' ? (
                        <button onClick={() => handleDownload(purchase.id)}
                          disabled={downloading === purchase.id}
                          className="mt-4 inline-flex items-center gap-2 text-sensory-purple font-bold text-xs uppercase tracking-widest hover:text-sensory-purple-dark transition-colors disabled:opacity-50">
                          {downloading === purchase.id ? (
                            <>
                              <span className="w-3 h-3 border-2 border-sensory-purple/30 border-t-sensory-purple rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <><Download className="w-4 h-4" /> Download Resource</>
                          )}
                        </button>
                      ) : (
                        <div className="mt-4 inline-flex items-center gap-2 text-sensory-green-dark font-bold text-xs uppercase tracking-widest">
                          <Package className="w-4 h-4" /> Physical Item Purchased
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sessions */}
        {activeTab === 'sessions' && (
          <div className="animate-fade-in">
            {registrations.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <GraduationCap className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="font-display text-3xl text-sensory-purple-dark font-bold mb-4">No courses yet</h3>
                <p className="text-gray-400 font-bold text-sm mb-10 uppercase tracking-widest">Transform your skills at the Learning Academy</p>
                <Link href="/academy" className="btn-primary px-10">View Academy</Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {registrations.map(reg => {
                  const isUpcoming = new Date(reg.session.scheduledAt) > new Date()
                  const dateStr = new Date(reg.session.scheduledAt).toLocaleDateString('en', {
                    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })
                  return (
                    <div key={reg.id} className="card-light p-6 flex items-start gap-6 border-l-8 border-l-sensory-yellow bg-white group">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isUpcoming ? 'bg-sensory-yellow' : 'bg-gray-100'}`}>
                        <Video className={`w-6 h-6 ${isUpcoming ? 'text-sensory-gray' : 'text-gray-300'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                           {isUpcoming ? (
                            <span className="text-sensory-green-dark text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-sensory-green-dark animate-pulse" /> Live Event
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Completed</span>
                          )}
                        </div>
                        <h3 className="font-display text-xl text-sensory-purple-dark font-bold mb-1 truncate">{reg.session.title}</h3>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">with {reg.session.host}</p>
                        
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5 text-sensory-purple" /> {dateStr}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                            <Users className="w-3.5 h-3.5 text-sensory-purple" /> {reg.session.duration}m
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-sensory-off-white"><div className="w-10 h-10 border-4 border-sensory-purple/20 border-t-sensory-purple rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  )
}
