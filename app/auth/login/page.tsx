'use client'
// app/auth/login/page.tsx
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, ArrowRight, AlertCircle, Users } from 'lucide-react'
import Logo from '@/components/layout/Logo'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push(callbackUrl)
      router.refresh()
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
          <div className="flex items-center justify-between mb-2">
            <label className="section-label">Password</label>
            <Link href="/auth/forgot-password" className="text-sensory-purple font-bold text-xs hover:underline transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="input-light pr-12"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sensory-purple transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed py-4">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-center text-gray-500 font-body text-sm mt-6">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-sensory-purple font-bold hover:underline transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
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
          <h1 className="font-display text-4xl text-sensory-purple-dark font-bold mb-2">Welcome back</h1>
          <p className="text-gray-500 font-body">Sign in to access your library</p>
        </div>

        <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
