'use client'
// app/shop/[id]/page.tsx
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Star, BookOpen, Download, Shield, ArrowLeft, Package, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleBuy = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/shop/${params.id}`)
      return
    }

    setBuying(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'product', id: params.id }),
      })
      const { url, error } = await res.json()
      if (error) { alert(error); return }
      window.location.href = url
    } finally {
      setBuying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-sensory-off-white">
        <div className="w-10 h-10 border-4 border-sensory-purple/20 border-t-sensory-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-sensory-off-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="display-heading text-4xl text-sensory-purple-dark mb-4">Product Not Found</h1>
          <Link href="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-sensory-off-white">
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-sensory-purple font-bold text-xs uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Product Media */}
          <div className="relative">
            <div className="sticky top-32">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-white group">
                <Image src={product.coverImage} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-6 left-6">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg ${
                    product.type === 'DIGITAL' 
                      ? 'bg-sensory-yellow text-sensory-purple-dark' 
                      : 'bg-sensory-green-light text-sensory-green-dark'
                  }`}>
                    {product.type}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: product.type === 'DIGITAL' ? BookOpen : Package, label: product.type === 'DIGITAL' ? `${product.pageCount || 'Multi'} pages` : 'Physical Item' },
                  { icon: product.type === 'DIGITAL' ? Download : Shield, label: product.type === 'DIGITAL' ? 'Instant Access' : 'Verified Quality' },
                  { icon: CheckCircle, label: 'Secure Pay' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="card-light p-4 text-center border-none shadow-sm bg-white/50 backdrop-blur-sm">
                    <Icon className="w-5 h-5 text-sensory-purple mx-auto mb-2" />
                    <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest leading-tight block">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="animate-fade-in">
            <div className="mb-8">
              <span className="section-label inline-block mb-4">{product.category}</span>
              <h1 className="display-heading text-5xl text-sensory-purple-dark mb-4 leading-tight">{product.title}</h1>
              {product.author && <p className="text-gray-400 font-bold text-lg uppercase tracking-widest">by <span className="text-sensory-purple">{product.author}</span></p>}
            </div>

            <div className="flex items-center gap-2 mb-8 bg-white/50 w-fit px-4 py-2 rounded-full border border-gray-100">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 text-sensory-yellow fill-sensory-yellow`} />
                ))}
              </div>
              <span className="text-sensory-purple-dark font-bold text-sm ml-2">5.0</span>
              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">(24 reviews)</span>
            </div>

            <div className="prose-sensory mb-12">
              <p className="text-gray-500 font-body text-lg leading-relaxed mb-6">{product.description}</p>
              {product.longDesc && (
                <div className="space-y-4">
                  {product.longDesc.split('\n\n').map((para: string, i: number) => (
                    <p key={i} className="text-gray-400 font-body text-base leading-relaxed">{para}</p>
                  ))}
                </div>
              )}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="bg-white border-2 border-gray-50 text-gray-400 font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Buy CTA */}
            <div className="card-light p-8 bg-sensory-purple-dark text-white border-none shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-sensory-yellow text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block">Instant Enrollment</span>
                    <span className="font-display text-6xl font-bold">${product.price.toFixed(2)}</span>
                  </div>
                  {product.type === 'PHYSICAL' && (
                    <div className="text-right">
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-sensory-green-light' : 'text-red-400'}`}>
                         {product.stock > 0 ? `${product.stock} Units left` : 'Out of stock'}
                       </span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleBuy} 
                  disabled={buying || (product.type === 'PHYSICAL' && product.stock <= 0)}
                  className="btn-primary w-full justify-center text-lg py-5 bg-sensory-yellow text-sensory-purple-dark hover:bg-white hover:text-sensory-purple transition-all shadow-xl"
                >
                  {buying ? (
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 border-2 border-sensory-purple-dark/20 border-t-sensory-purple-dark rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <><ShoppingCart className="w-6 h-6" /> {product.type === 'PHYSICAL' ? 'Order Now' : 'Buy Instant Access'}</>
                  )}
                </button>
                <p className="text-center text-white/40 font-bold text-[10px] uppercase tracking-widest mt-6">
                  Secure checkout with Stripe · {product.type === 'DIGITAL' ? 'Instant Access' : 'Ships within 48 hours'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
