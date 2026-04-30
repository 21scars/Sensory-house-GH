// app/layout.tsx
import type { Metadata } from 'next'
import '../styles/globals.css'
import { Providers } from './providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Sensory House GH — Freedom to Explore',
  description: 'The ultimate digital ecosystem for parents, teachers, and school owners. Digital marketplace, learning academy, and membership hive.',
  keywords: ['sensory development', 'parenting guides', 'teacher training', 'school management', 'educational resources', 'ghana education'],
  openGraph: {
    title: 'Sensory House GH',
    description: 'Transformative educational resources for parents and educators.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
