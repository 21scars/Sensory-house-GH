// app/academy/page.tsx
import { GraduationCap, PlayCircle, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AcademyPage() {
  const sessions = await prisma.session.findMany({
    where: { published: true },
    orderBy: { scheduledAt: 'asc' },
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  })

  return (
    <div className="min-h-screen pt-32 pb-20 bg-sensory-off-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="section-label mb-4 block">The Learning Academy</span>
        <h1 className="display-heading text-5xl md:text-6xl mb-6">Transformative Training</h1>
        <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-12">
          Pre-recorded video modules, coaching series, and specialized workshops designed for parents and teachers.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {sessions.map(course => (
            <div key={course.id} className="card-light p-8 bg-white flex flex-col group hover:border-sensory-purple transition-all shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 bg-sensory-yellow rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                 <PlayCircle className="w-6 h-6 text-sensory-gray" />
              </div>
              <h3 className="font-display text-2xl font-bold text-sensory-purple-dark mb-2">{course.title}</h3>
              <div className="text-[10px] font-bold text-sensory-purple uppercase tracking-[0.2em] mb-4">
                {new Date(course.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">{course.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <CheckCircle className="w-4 h-4 text-sensory-green-dark" /> Instructor: {course.host}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <CheckCircle className="w-4 h-4 text-sensory-green-dark" /> {course.duration} Minutes Duration
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <CheckCircle className="w-4 h-4 text-sensory-green-dark" /> {course.maxSlots - course._count.registrations} Slots Available
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                <span className="font-display text-3xl font-bold text-sensory-purple">${course.price.toFixed(2)}</span>
                <Link href={`/sessions/${course.id}`} className="btn-primary text-xs px-6 py-3">Enroll Now</Link>
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
               <GraduationCap className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No courses scheduled at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
