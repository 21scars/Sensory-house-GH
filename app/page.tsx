'use client'
// app/page.tsx
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BookOpen, GraduationCap, Users, MessageSquare, PlayCircle, Star } from 'lucide-react'
import Logo from '@/components/layout/Logo'

const sections = [
  {
    title: 'Marketplace',
    description: 'Quick solutions for specific problems. Sensory tools, workbooks, and administrative tools.',
    icon: BookOpen,
    href: '/shop',
    color: 'bg-sensory-purple',
    items: ['Parenting Guides', 'Phonics Workbooks', 'School Admin Templates']
  },
  {
    title: 'Learning Academy',
    description: 'Transformative educational experiences. Deep dive courses and professional training.',
    icon: GraduationCap,
    href: '/academy',
    color: 'bg-sensory-yellow',
    textColor: 'text-sensory-gray',
    items: ['Teacher Certification', 'Parent Coaching', 'Development Workshops']
  },
  {
    title: 'Membership Hive',
    description: 'Your recurring revenue engine. Join a loyal community with an all-access pass.',
    icon: Users,
    href: '/membership',
    color: 'bg-sensory-green-light',
    textColor: 'text-sensory-gray',
    items: ['All-Access Pass', 'Live Webinars', 'Exclusive Community']
  },
  {
    title: 'Resource Center',
    description: 'The front door of our business. Expert articles on parenting and education trends.',
    icon: MessageSquare,
    href: '/blog',
    color: 'bg-sensory-green-dark',
    items: ['Parenting Tips', 'Teacher Support', 'Education Trends']
  }
]

const paths = [
  { name: 'I am a Parent', href: '/auth/register?type=PARENT', description: 'Find resources for your child' },
  { name: 'I am a Teacher', href: '/auth/register?type=TEACHER', description: 'Professional development tools' },
  { name: 'I am a School Owner', href: '/auth/register?type=ORGANIZATION', description: 'Manage your institution' }
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && (session.user as any)?.role === 'ADMIN') {
      router.push('/admin')
    }
  }, [status, session, router])

  if (status === 'loading') return null

  return (
    <div className="bg-sensory-off-white">
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-block">
             <Logo iconSize={32} textSize="text-4xl" />
          </div>
          
          <h1 className="display-heading text-5xl md:text-7xl mb-6">
            Freedom to <span className="italic">explore.</span>
          </h1>
          <p className="text-sensory-gray font-body text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Providing parents, teachers, and school owners with the tools to nurture the next generation.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {paths.map((path) => (
              <Link 
                key={path.name} 
                href={path.href}
                className="group p-8 bg-white rounded-2xl border-2 border-transparent hover:border-sensory-purple transition-all shadow-sm hover:shadow-xl text-center"
              >
                <h3 className="font-display text-2xl font-bold text-sensory-purple-dark mb-2">{path.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{path.description}</p>
                <span className="inline-flex items-center text-sensory-purple font-bold group-hover:gap-2 transition-all">
                  Start Here <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FOUR PILLARS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label mb-4 block">Our Ecosystem</span>
            <h2 className="display-heading text-4xl md:text-5xl">Everything you need to thrive</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col h-full">
                <div className={`p-8 rounded-3xl ${section.color} ${section.textColor || 'text-white'} flex-1 shadow-lg`}>
                  <section.icon className="w-12 h-12 mb-6" />
                  <h3 className="font-display text-2xl font-bold mb-4">{section.title}</h3>
                  <p className="opacity-90 text-sm mb-8 leading-relaxed">
                    {section.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {section.items.map(item => (
                      <li key={item} className="flex items-center text-xs font-bold uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={section.href}
                    className={`mt-auto inline-flex items-center font-bold text-sm uppercase tracking-widest hover:gap-2 transition-all`}
                  >
                    Explore {section.title} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSFORMATIONAL SECTION ── */}
      <section className="py-24 px-6 bg-sensory-off-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-sensory-yellow rounded-full opacity-20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sensory-purple rounded-full opacity-10 blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-sensory-gray aspect-video flex items-center justify-center">
               <PlayCircle className="w-20 h-20 text-white opacity-50" />
               <span className="absolute bottom-4 left-4 text-white/70 text-xs font-bold uppercase tracking-widest">Sensory House Academy Preview</span>
            </div>
          </div>
          <div>
            <span className="section-label mb-4 block">Learning Academy</span>
            <h2 className="display-heading text-4xl mb-6">More than just books. It's an experience.</h2>
            <p className="text-sensory-gray font-body text-lg mb-8 leading-relaxed">
              Our training programs are designed to be transformative. From pre-recorded modules to live engagement sessions, we provide the depth needed for real change in child development and educational strategies.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sensory-green-light flex items-center justify-center">
                   <Star className="w-5 h-5 text-sensory-green-dark" />
                </div>
                <span className="font-bold text-sm">Expert Coaching</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sensory-purple flex items-center justify-center">
                   <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-sm">Certification</span>
              </div>
            </div>
            <Link href="/academy" className="btn-primary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-sensory-purple-dark text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="display-heading text-white text-4xl md:text-5xl mb-6">Ready to start your journey?</h2>
          <p className="opacity-80 text-lg mb-12">
            Join the Sensory House GH community today and get access to our complete ecosystem of educational resources.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/register" className="btn-secondary px-10 py-4">
              Join the Hive <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/shop" className="px-10 py-4 border-2 border-white/20 rounded-md font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
