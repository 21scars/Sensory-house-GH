'use client'
// components/layout/Logo.tsx
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export default function Logo({ 
  className = '', 
  size = 40, 
  showText = true 
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <div className="relative overflow-hidden rounded-xl group-hover:scale-110 transition-transform" style={{ width: size, height: size }}>
        <Image 
          src="/logo.jpg" 
          alt="Sensory House GH" 
          fill 
          className="object-contain"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col -space-y-1">
          <span className="font-display text-xl text-sensory-purple-dark font-bold tracking-tight">
            Sensory House GH
          </span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-0.5">
            Freedom to Explore
          </span>
        </div>
      )}
    </div>
  )
}
