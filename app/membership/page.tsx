// app/membership/page.tsx
import { ShieldCheck, Check, ArrowRight, Zap, Star, Users } from 'lucide-react'
import Link from 'next/link'

export default function MembershipPage() {
  const tiers = [
    {
      name: 'The Free Hive',
      price: '0',
      desc: 'Get started with our basic resources and community updates.',
      features: [
        'Weekly Newsletter',
        'Access to Blog Articles',
        'Basic Resource Previews',
        'Community Forum Access'
      ],
      button: 'Join Free',
      color: 'border-gray-100',
      icon: Users
    },
    {
      name: 'The Monthly Pass',
      price: '29',
      desc: 'Full access to the entire vault of current and future courses.',
      features: [
        'All Learning Academy Courses',
        'Exclusive Monthly Webinars',
        'Premium Marketplace Discounts',
        'Live Q&A Sessions',
        'Private Slack Community'
      ],
      button: 'Subscribe Monthly',
      featured: true,
      color: 'border-sensory-purple',
      icon: Zap
    },
    {
      name: 'The Annual Hive',
      price: '290',
      desc: 'The complete Sensory House experience with the best value.',
      features: [
        'Everything in Monthly Pass',
        '2 Months Free (Save $58)',
        'Early Access to New Products',
        'Priority Support',
        'Certificate of Excellence'
      ],
      button: 'Subscribe Yearly',
      color: 'border-sensory-yellow',
      icon: Star
    }
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 bg-sensory-off-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="section-label mb-4 block">Membership Hive</span>
          <h1 className="display-heading text-5xl md:text-6xl mb-6">The All-Access Pass</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Join a loyal community of parents and educators. One subscription to unlock our entire digital ecosystem.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div key={tier.name} className={`relative flex flex-col bg-white rounded-[2.5rem] p-10 shadow-sm border-4 ${tier.color} ${tier.featured ? 'scale-105 shadow-2xl z-10' : ''}`}>
              {tier.featured && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-sensory-purple text-white text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${tier.featured ? 'bg-sensory-purple text-white' : 'bg-gray-50 text-sensory-purple'}`}>
                   <tier.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl font-bold text-sensory-purple-dark mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-display font-bold text-sensory-purple-dark">${tier.price}</span>
                  <span className="text-gray-400 font-bold text-sm">/ {tier.name.includes('Annual') ? 'year' : 'month'}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{tier.desc}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${tier.featured ? 'bg-sensory-green-light text-sensory-green-dark' : 'bg-gray-50 text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/auth/register" 
                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                  tier.featured 
                    ? 'bg-sensory-purple text-white hover:bg-sensory-purple-dark shadow-lg' 
                    : 'bg-gray-50 text-sensory-purple-dark hover:bg-gray-100'
                }`}
              >
                {tier.button} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Proof */}
        <div className="mt-24 p-12 bg-sensory-purple-dark rounded-[3rem] text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-sensory-purple rounded-full opacity-20 -mr-32 -mt-32 blur-3xl" />
           <div className="relative z-10">
             <div className="flex justify-center -space-x-3 mb-8">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-sensory-purple-dark bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Member" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-sensory-purple-dark bg-sensory-yellow flex items-center justify-center text-sensory-purple-dark font-bold text-xs">
                  +500
                </div>
             </div>
             <h2 className="display-heading text-white text-3xl mb-4">Join 500+ educators & parents</h2>
             <p className="text-white/70 max-w-xl mx-auto mb-0 font-body">
               "The Membership Hive has been a game-changer for my classroom strategies. The webinars alone are worth the price!" 
               <span className="block mt-2 font-bold text-sensory-yellow">— Sarah Mensah, Teacher</span>
             </p>
           </div>
        </div>
      </div>
    </div>
  )
}
