// app/shop/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Star, ShoppingBag, Package } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { reviews: true }
      }
    }
  })

  const categories = [
    'All', 
    'Wooden & Activity Boards',
    'Fine Motor & Coordination', 
    'Sensory Base Materials',
    'Playdough Tools & Accessories', 
    'Learning & Educational', 
    'Toys & Pretend Play',
    'Parenting Guides',
    'Workbooks',
    'Administrative Tools'
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 bg-sensory-off-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <span className="section-label block mb-3">The Marketplace</span>
          <h1 className="display-heading text-5xl mb-4 text-sensory-purple-dark">Sensory Resources & Tools</h1>
          <p className="text-gray-500 font-body text-lg max-w-xl">
            From activity boards to educational guides. Everything you need to support sensory development and learning.
          </p>
        </div>

        {/* Search + Filters (Static UI for now) */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, tools, guides..."
              className="input-light pl-11"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat}
                className={`px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider rounded-md border-2 transition-all ${
                  cat === 'All'
                    ? 'bg-sensory-purple text-white border-sensory-purple'
                    : 'border-gray-200 text-gray-400 hover:border-sensory-purple/40 hover:text-sensory-purple'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(item => (
            <Link key={item.id} href={`/shop/${item.id}`}
              className="card-light group overflow-hidden flex flex-col h-full bg-white relative">
              
              {/* Type Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm ${
                  item.type === 'DIGITAL' 
                    ? 'bg-sensory-yellow text-sensory-purple-dark' 
                    : 'bg-sensory-green-light text-sensory-green-dark'
                }`}>
                  {item.type}
                </span>
              </div>

              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={item.coverImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-sensory-purple-dark/20 to-transparent" />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-sensory-purple text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-widest">
                  {item.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display text-xl text-sensory-purple-dark font-bold mb-1 group-hover:text-sensory-purple transition-colors leading-tight min-h-[3rem]">
                  {item.title}
                </h3>
                
                {item.type === 'PHYSICAL' && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Package className="w-3 h-3 text-gray-400" />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${item.stock && item.stock > 0 ? 'text-sensory-green-dark' : 'text-red-500'}`}>
                      {item.stock && item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 text-sensory-yellow fill-sensory-yellow`} />
                  ))}
                  <span className="text-gray-400 font-body text-[10px] ml-1">({item._count.reviews})</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <span className="font-display text-2xl font-bold text-sensory-purple">${item.price.toFixed(2)}</span>
                  <div className="w-10 h-10 rounded-full bg-sensory-purple text-white flex items-center justify-center shadow-lg group-hover:bg-sensory-purple-dark transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
               <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No products available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
