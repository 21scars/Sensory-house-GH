'use client'
// app/auth/register/page.tsx
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, ArrowRight, AlertCircle, Check, Users } from 'lucide-react'
import Logo from '@/components/layout/Logo'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') || 'PARENT'
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    accountType: initialType 
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialType && ['KID', 'PARENT', 'TEACHER', 'ORGANIZATION'].includes(initialType)) {
      setForm(prev => ({ ...prev, accountType: initialType }))
    }
  }, [initialType])

  const passwordChecks = [
    { label: 'At least 8 characters', pass: form.password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(form.password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(form.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Auto sign-in after registration
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="card-light p-8 shadow-2xl bg-white/80 backdrop-blur-sm">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-6 text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="font-body text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="section-label block mb-2">Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            {['PARENT', 'TEACHER', 'ORGANIZATION', 'KID'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, accountType: type })}
                className={`px-3 py-2 text-xs font-bold rounded-md border-2 transition-all ${
                  form.accountType === type
                    ? 'border-sensory-purple bg-sensory-purple text-white'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="section-label block mb-2">Full Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
            className="input-light"
          />
        </div>

        <div>
          <label className="section-label block mb-2">Email Address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="input-light"
          />
        </div>

        <div>
          <label className="section-label block mb-2">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Create a strong password"
              className="input-light pr-12"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sensory-purple transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.password && (
            <div className="mt-3 space-y-1.5">
              {passwordChecks.map(({ label, pass }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${pass ? 'bg-sensory-green-light text-sensory-green-dark' : 'bg-gray-100 text-gray-400'}`}>
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={`font-body text-xs ${pass ? 'text-sensory-green-dark' : 'text-gray-400'}`}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed py-4">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            <>Join Sensory House <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-center text-gray-500 font-body text-sm mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-sensory-purple font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-sensory-off-white flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-sensory-yellow" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sensory-purple rounded-full opacity-5 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sensory-green-light rounded-full opacity-10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-6">
             <Logo iconSize={24} textSize="text-3xl" />
          </Link>
          <h1 className="font-display text-4xl text-sensory-purple-dark font-bold mb-2">Start your journey</h1>
          <p className="text-gray-500 font-body">Choose your path and join our community</p>
        </div>

        <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Loading...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}
