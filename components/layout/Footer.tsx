// components/layout/Footer.tsx
import Link from 'next/link'
import { Users, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-sensory-purple-dark text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-sensory-purple rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl text-white font-bold tracking-tight">
                Sensory House
              </span>
            </Link>
            <p className="text-white/70 font-body text-sm leading-relaxed max-w-sm mb-8">
              Providing parents, teachers, and school owners with the tools to nurture the next generation. Freedom to explore, freedom to grow.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-sensory-yellow hover:text-sensory-gray transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sensory-yellow font-bold text-xs uppercase tracking-[0.2em] mb-6">Explore</h4>
            <ul className="space-y-4">
              {[
                { name: 'Marketplace', href: '/shop' },
                { name: 'Learning Academy', href: '/academy' },
                { name: 'Membership Hive', href: '/membership' },
                { name: 'Resource Center', href: '/blog' },
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.href}
                    className="text-white/70 hover:text-sensory-yellow font-bold text-sm transition-colors uppercase tracking-widest">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sensory-yellow font-bold text-xs uppercase tracking-[0.2em] mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-sensory-yellow" /> hello@sensoryhousegh.com
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-sensory-yellow" /> +233 (0) 123 456 789
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-sensory-yellow" /> Accra, Ghana
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} Sensory House GH. Freedom to explore ®
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest">Privacy Policy</Link>
            <Link href="/terms" className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
