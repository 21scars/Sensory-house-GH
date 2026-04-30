'use client'
// components/layout/Navbar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, Users, ShoppingBag, GraduationCap, MessageSquare } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Academy', href: '/academy', icon: GraduationCap },
    { name: 'Membership', href: '/membership', icon: Users },
    { name: 'Blog', href: '/blog', icon: MessageSquare },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-gray-500 hover:text-sensory-purple font-bold text-sm tracking-wide transition-colors uppercase"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-sensory-purple flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xs">
                    {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                </div>
                <span className="text-sensory-purple-dark text-sm font-bold">{session.user?.name}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 overflow-hidden">
                  <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-sensory-purple hover:bg-gray-50 text-sm font-medium transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> My Dashboard
                  </Link>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-sensory-purple hover:bg-gray-50 text-sm font-medium transition-colors">
                      <ShieldCheck className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <hr className="border-gray-50 my-1" />
                  <button onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 w-full px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-sensory-purple font-bold text-sm px-4 py-2 hover:opacity-80 transition-all uppercase tracking-widest">Sign In</Link>
              <Link href="/auth/register" className="btn-primary px-6 py-2.5 text-xs">Join Us</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-sensory-purple-dark" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-6 flex flex-col gap-6 shadow-2xl animate-fade-in">
          {navLinks.map((link) => (
             <Link 
              key={link.name}
              href={link.href} 
              className="flex items-center gap-4 text-gray-600 font-bold text-sm uppercase tracking-widest" 
              onClick={() => setMenuOpen(false)}
             >
               <link.icon className="w-5 h-5 text-sensory-purple" />
               {link.name}
             </Link>
          ))}
          <hr className="border-gray-100" />
          {session ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-4 text-gray-600 font-bold text-sm uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard className="w-5 h-5 text-sensory-purple" /> Dashboard
              </Link>
              <button onClick={() => signOut()} className="flex items-center gap-4 text-red-500 font-bold text-sm uppercase tracking-widest">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/auth/login" className="btn-ghost text-center py-3" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/auth/register" className="btn-primary text-center py-3" onClick={() => setMenuOpen(false)}>Join Us</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
