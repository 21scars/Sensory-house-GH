// app/blog/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, MessageSquare } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true }
      }
    }
  })

  return (
    <div className="min-h-screen pt-32 pb-20 bg-sensory-off-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label mb-4 block">Resource Center</span>
          <h1 className="display-heading text-5xl md:text-6xl mb-6">Expert Insights</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Tips, trends, and support for the Sensory House GH community. Stay informed on parenting and educational best practices.
          </p>
        </div>

        {/* Featured Post (if any) */}
        {posts.length > 0 && (
          <div className="mb-20">
            <Link href={`/blog/${posts[0].id}`} className="group relative block aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl bg-sensory-purple-dark">
              <Image 
                src={posts[0].coverImage} 
                alt={posts[0].title} 
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sensory-purple-dark via-sensory-purple-dark/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10 md:p-16 max-w-3xl">
                <span className="bg-sensory-yellow text-sensory-purple-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">
                  Latest Insight
                </span>
                <h2 className="display-heading text-white text-4xl md:text-5xl mb-6 group-hover:text-sensory-yellow transition-colors leading-tight">
                  {posts[0].title}
                </h2>
                <div className="flex items-center gap-6 text-white/70 text-sm font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-sensory-yellow" /> {new Date(posts[0].createdAt).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-sensory-yellow" /> {posts[0].author.name}</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.slice(1).map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-sensory-purple/10">
              <div className="relative aspect-video overflow-hidden">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-sensory-purple text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-widest">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="text-sensory-purple">•</span>
                  <span>{post.author.name}</span>
                </div>
                <h3 className="font-display text-2xl text-sensory-purple-dark font-bold mb-4 group-hover:text-sensory-purple transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto inline-flex items-center text-sensory-purple font-bold text-xs uppercase tracking-[0.2em] group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
               <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-6" />
               <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Our resource center is being populated. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
