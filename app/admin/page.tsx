'use client'

// app/admin/page.tsx
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Plus, BookOpen, GraduationCap, Users, TrendingUp, 
  Edit, Trash2, Link2, LayoutDashboard, MessageSquare, X, Upload, Shield, 
  CheckCircle, XCircle, Clock, Package, FileText, ShoppingBag
} from 'lucide-react'

type Stats = { totalUsers: number; totalRevenue: number; totalPurchases: number; totalRegistrations: number }

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplace' | 'academy' | 'membership' | 'resources' | 'users'>('overview')
  const [showModal, setShowModal] = useState<'product' | 'session' | 'post' | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return }
    if (status === 'authenticated' && (session.user as any)?.role !== 'ADMIN') { router.push('/dashboard') }
  }, [status, session, router])

  useEffect(() => {
    if ((session?.user as any)?.role === 'ADMIN') {
      fetch('/api/admin/stats').then(r => r.json()).then(setStats)
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-sensory-off-white">
        <div className="w-10 h-10 border-4 border-sensory-purple/20 border-t-sensory-purple rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-sensory-off-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-sensory-purple-dark text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                System Admin
              </span>
            </div>
            <h1 className="display-heading text-5xl">Control Panel</h1>
            <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">Manage your digital ecosystem</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowModal('product')}
              className="btn-ghost px-6 py-3 text-xs bg-white border-2 border-sensory-purple/20"
            >
               <Plus className="w-4 h-4" /> New Product
            </button>
            <button 
              onClick={() => setShowModal('session')}
              className="btn-primary px-6 py-3 text-xs"
            >
               <Plus className="w-4 h-4" /> New Course
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? '0', icon: Users, color: 'text-sensory-purple' },
            { label: 'Revenue', value: stats ? `$${stats.totalRevenue.toFixed(2)}` : '$0.00', icon: TrendingUp, color: 'text-sensory-green-dark' },
            { label: 'Marketplace Sales', value: stats?.totalPurchases ?? '0', icon: ShoppingBag, color: 'text-sensory-yellow' },
            { label: 'Course Enrollments', value: stats?.totalRegistrations ?? '0', icon: GraduationCap, color: 'text-sensory-purple-dark' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card-light p-6 text-center border-none shadow-sm group">
              <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                 <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="font-display text-4xl text-sensory-purple-dark font-bold">{value}</div>
              <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
            { id: 'academy', label: 'Academy', icon: GraduationCap },
            { id: 'membership', label: 'Hive (Subs)', icon: Shield },
            { id: 'resources', label: 'Resources', icon: MessageSquare },
            { id: 'users', label: 'Users', icon: Users },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-sensory-purple border-b-4 border-sensory-purple'
                  : 'text-gray-400 hover:text-sensory-purple-dark'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            {/* Quick actions */}
            <div className="card-light p-8 bg-white">
              <h2 className="font-display text-2xl text-sensory-purple-dark font-bold mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {[
                  { label: 'Add Product/Resource', desc: 'Digital guides or physical tools', icon: ShoppingBag, type: 'product' },
                  { label: 'Schedule Academy Course', desc: 'Create a new training module or workshop', icon: GraduationCap, type: 'session' },
                  { label: 'Publish Blog Article', desc: 'Add a new post to the Resource Center', icon: MessageSquare, type: 'post' },
                  { label: 'Manage All Users', desc: 'View and control user roles & access', icon: Users, tab: 'users' },
                ].map(({ label, desc, icon: Icon, type, tab }) => (
                  <button 
                    key={label}
                    onClick={() => {
                        if (type) setShowModal(type as any)
                        if (tab) setActiveTab(tab as any)
                    }}
                    className="w-full flex items-center gap-6 p-4 rounded-2xl border-2 border-gray-50 hover:border-sensory-purple/20 hover:bg-gray-50 transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-sensory-purple" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-sensory-purple-dark uppercase tracking-widest mb-1">{label}</div>
                      <div className="text-xs text-gray-400 font-medium">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="card-light p-8 bg-sensory-purple-dark text-white border-none">
              <h2 className="font-display text-2xl font-bold mb-6">System Guide</h2>
              <div className="space-y-6">
                {[
                  { title: 'Marketplace Items', text: 'Sell digital PDFs or physical sensory tools. For physical items, ensure you set the stock levels.' },
                  { title: 'Learning Academy', text: 'Pre-recorded modules should be hosted on a secure CDN. Link them here for members.' },
                  { title: 'Membership Hive', text: 'Control the "All-Access" pass. One subscription, complete ecosystem access.' },
                  { title: 'Live Events', text: 'Add Google Meet links 24 hours before any scheduled session to trigger notifications.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 font-bold text-sensory-yellow text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-widest mb-1 text-sensory-yellow">{item.title}</h3>
                      <p className="text-white/70 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academy' && <AdminSessionsTab />}
        {activeTab === 'marketplace' && <AdminProductsTab />}
        {activeTab === 'resources' && <AdminResourcesTab />}
        {activeTab === 'users' && <AdminUsersTab />}
        {activeTab === 'membership' && <AdminMembershipTab />}
      </div>

      {/* ── MODALS ── */}
      {showModal === 'product' && <ProductModal onClose={() => setShowModal(null)} />}
      {showModal === 'session' && <SessionModal onClose={() => setShowModal(null)} />}
      {showModal === 'post' && <PostModal onClose={() => setShowModal(null)} />}
    </div>
  )
}

// --- REUSABLE COMPONENTS ---

function ImageUpload({ value, onChange, label }: { value: string, onChange: (url: string) => void, label: string }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) onChange(data.url)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="md:col-span-2">
      <label className="section-label mb-2 block">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-sensory-purple/10">
            <img src={value} className="w-full h-full object-cover" alt="Preview" />
          </div>
        )}
        <label className="flex-1 cursor-pointer">
          <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors ${
            uploading ? 'bg-gray-50 border-gray-200' : 'border-sensory-purple/20 hover:border-sensory-purple hover:bg-sensory-purple/5'
          }`}>
            <Upload className={`w-6 h-6 mb-2 ${uploading ? 'animate-bounce text-gray-400' : 'text-sensory-purple'}`} />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {uploading ? 'Uploading...' : value ? 'Change Image' : 'Select Image File'}
            </span>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  )
}

function ProductModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', price: '', category: 'Wooden & Activity Boards', type: 'PHYSICAL',
    description: '', longDesc: '', coverImage: '', fileUrl: '', stock: '10', author: '',
    tags: '', pageCount: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          price: parseFloat(form.price),
          stock: form.type === 'PHYSICAL' ? parseInt(form.stock) : null,
          pageCount: form.pageCount ? parseInt(form.pageCount) : null
        })
      })
      if (res.ok) { window.location.reload() }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const categories = [
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-sensory-purple-dark/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-up">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-sensory-purple transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="p-10">
          <h2 className="font-display text-3xl font-bold text-sensory-purple-dark mb-8">Add New Product</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Product Title</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-light" placeholder="e.g. Deluxe Wooden Activity Board" />
            </div>
            
            <div>
              <label className="section-label mb-2 block">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-light">
                <option value="PHYSICAL">Physical Product</option>
                <option value="DIGITAL">Digital Resource (Ebook/PDF)</option>
              </select>
            </div>

            <div>
              <label className="section-label mb-2 block">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-light">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="section-label mb-2 block">Price (USD)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-light" placeholder="0.00" />
            </div>

            {form.type === 'PHYSICAL' ? (
              <div>
                <label className="section-label mb-2 block">Stock Level</label>
                <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input-light" placeholder="10" />
              </div>
            ) : (
              <div>
                <label className="section-label mb-2 block">Author (Optional)</label>
                <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="input-light" placeholder="Ama Osei" />
              </div>
            )}

            {form.type === 'DIGITAL' && (
              <div>
                <label className="section-label mb-2 block">Page Count</label>
                <input type="number" value={form.pageCount} onChange={e => setForm({...form, pageCount: e.target.value})} className="input-light" placeholder="e.g. 50" />
              </div>
            )}

            <div className={form.type === 'DIGITAL' ? 'md:col-span-1' : 'md:col-span-2'}>
              <label className="section-label mb-2 block">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="input-light" placeholder="educational, fun, sensory" />
            </div>

            <ImageUpload 
              label="Product Image"
              value={form.coverImage}
              onChange={(url) => setForm({...form, coverImage: url})}
            />

            {form.type === 'DIGITAL' && (
              <div className="md:col-span-2">
                <label className="section-label mb-2 block">Download URL (PDF)</label>
                <input required value={form.fileUrl} onChange={e => setForm({...form, fileUrl: e.target.value})} className="input-light" placeholder="Link to private bucket" />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Short Description</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-light min-h-[80px]" />
            </div>

            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Long Description (Detailed)</label>
              <textarea value={form.longDesc} onChange={e => setForm({...form, longDesc: e.target.value})} className="input-light min-h-[150px]" />
            </div>

            <div className="md:col-span-2 pt-4">
              <button disabled={loading} type="submit" className="btn-primary w-full justify-center py-4">
                {loading ? 'Saving...' : 'Add to Marketplace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function AdminProductsTab() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/products').then(r => r.json()).then(d => setProducts(d.products || []))
  }, [])

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {products.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold text-sm uppercase tracking-widest">
          No products in marketplace.
        </div>
      )}
      {products.map(p => (
        <div key={p.id} className="card-light p-6 bg-white flex items-center gap-6 group hover:border-sensory-purple transition-colors">
          <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
             <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                p.type === 'DIGITAL' ? 'bg-sensory-yellow/20 text-sensory-purple-dark' : 'bg-sensory-green-light/20 text-sensory-green-dark'
              }`}>
                {p.type}
              </span>
              <h3 className="font-display text-2xl text-sensory-purple-dark font-bold truncate">{p.title}</h3>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               <span>{p.category}</span>
               <span className="text-sensory-purple">•</span>
               <span className="text-sensory-purple-dark">${p.price}</span>
               <span className="text-sensory-purple">•</span>
               {p.type === 'PHYSICAL' ? (
                 <span className={p.stock > 5 ? 'text-sensory-green-dark' : 'text-red-500'}>{p.stock} in stock</span>
               ) : (
                 <span className="text-sensory-green-dark">{p._count?.purchases ?? 0} Downloads</span>
               )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sensory-purple hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
            <button onClick={() => deleteProduct(p.id)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ... rest of the file (AdminSessionsTab, AdminResourcesTab, AdminUsersTab, AdminMembershipTab, etc.) remains the same but ensure they use the correct types if needed.
// Actually I'll just write the full file to be safe.

// --- SUBSCRIPTIONS TAB ---
function AdminMembershipTab() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/subscriptions').then(r => r.json()).then(d => {
      setSubscriptions(d.subscriptions || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-400 uppercase tracking-widest text-xs font-bold animate-pulse">Loading Subscriptions...</div>

  return (
    <div className="space-y-6 animate-fade-in">
      {subscriptions.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold text-sm uppercase tracking-widest">
          No active Hive subscriptions found.
        </div>
      )}
      <div className="grid gap-4">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="card-light p-6 bg-white flex items-center justify-between group border-l-4 border-sensory-green-light">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sensory-purple/10 flex items-center justify-center font-bold text-sensory-purple">
                {sub.user?.name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-sensory-purple-dark text-lg">{sub.user?.name}</h3>
                <p className="text-xs text-gray-400 font-medium">{sub.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Plan</div>
                <div className="bg-sensory-yellow/20 text-sensory-purple-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-sensory-yellow">
                  {sub.plan}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</div>
                <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                  sub.status === 'active' ? 'bg-sensory-green-light/20 text-sensory-green-dark border-sensory-green-light' : 'bg-red-50 text-red-500 border-red-100'
                }`}>
                  {sub.status}
                </div>
              </div>
              <div className="text-right min-w-[120px]">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Renews</div>
                <div className="text-xs font-bold text-sensory-purple-dark">
                  {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminUsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => {
      setUsers(d.users || [])
      setLoading(false)
    })
  }, [])

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure? This will delete all user data.')) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) setUsers(prev => prev.filter(u => u.id !== id))
  }

  const updateRole = async (id: string, role: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    })
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
  }

  const updateAccountType = async (id: string, accountType: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountType })
    })
    setUsers(prev => prev.map(u => u.id === id ? { ...u, accountType } : u))
  }

  if (loading) return <div className="text-center py-12 text-gray-400 uppercase tracking-widest text-xs font-bold animate-pulse">Loading Users...</div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-4">
          <thead>
            <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              <th className="px-6 py-2">User</th>
              <th className="px-6 py-2">Role</th>
              <th className="px-6 py-2">Account Type</th>
              <th className="px-6 py-2">Activity</th>
              <th className="px-6 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white rounded-2xl group transition-all hover:shadow-md border border-transparent hover:border-sensory-purple/10">
                <td className="px-6 py-5 rounded-l-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-sensory-purple text-xs">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-sensory-purple-dark">{user.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <select 
                    value={user.role} 
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="text-[10px] font-bold border-2 border-gray-50 rounded-lg px-2 py-1 bg-white outline-none focus:border-sensory-purple"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-6 py-5">
                   <select 
                    value={user.accountType} 
                    onChange={(e) => updateAccountType(user.id, e.target.value)}
                    className="text-[10px] font-bold border-2 border-gray-50 rounded-lg px-2 py-1 bg-white outline-none focus:border-sensory-purple uppercase"
                  >
                    <option value="KID">KID</option>
                    <option value="PARENT">PARENT</option>
                    <option value="TEACHER">TEACHER</option>
                    <option value="ORGANIZATION">ORGANIZATION</option>
                  </select>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-4 text-[10px] font-bold text-gray-400">
                    <div className="flex items-center gap-1.5"><ShoppingBag className="w-3 h-3" /> {user._count.purchases}</div>
                    <div className="flex items-center gap-1.5"><GraduationCap className="w-3 h-3" /> {user._count.registrations}</div>
                  </div>
                </td>
                <td className="px-6 py-5 rounded-r-2xl text-right">
                  <button onClick={() => deleteUser(user.id)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all ml-auto">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PostModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', category: 'Parenting', excerpt: '', content: '', coverImage: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) { window.location.reload() }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-sensory-purple-dark/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-up">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-sensory-purple transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="p-10">
          <h2 className="font-display text-3xl font-bold text-sensory-purple-dark mb-8">New Resource Center Post</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Article Title</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-light" placeholder="e.g. 5 Tips for Sensory Development" />
            </div>
            <div>
              <label className="section-label mb-2 block">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-light">
                <option>Parenting</option>
                <option>Education</option>
                <option>Administrative</option>
                <option>Trends</option>
              </select>
            </div>
            
            <ImageUpload 
              label="Article Cover Image"
              value={form.coverImage}
              onChange={(url) => setForm({...form, coverImage: url})}
            />

            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Short Excerpt</label>
              <input required value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="input-light" />
            </div>
            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Article Content (Markdown supported)</label>
              <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-light min-h-[200px]" />
            </div>
            <div className="md:col-span-2 pt-4">
              <button disabled={loading} type="submit" className="btn-primary w-full justify-center py-4">
                {loading ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function SessionModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', price: '', host: '', scheduledAt: '', duration: '60', maxSlots: '50', description: '', coverImage: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          price: parseFloat(form.price),
          duration: parseInt(form.duration),
          maxSlots: parseInt(form.maxSlots)
        })
      })
      if (res.ok) { window.location.reload() }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-sensory-purple-dark/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-up">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-sensory-purple transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="p-10">
          <h2 className="font-display text-3xl font-bold text-sensory-purple-dark mb-8">Schedule Academy Course</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Course Title</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-light" placeholder="e.g. Inclusive Classroom Strategies" />
            </div>
            <div>
              <label className="section-label mb-2 block">Price (USD)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-light" placeholder="0.00" />
            </div>
            <div>
              <label className="section-label mb-2 block">Host / Instructor</label>
              <input required value={form.host} onChange={e => setForm({...form, host: e.target.value})} className="input-light" />
            </div>
            <div>
              <label className="section-label mb-2 block">Date & Time</label>
              <input required type="datetime-local" value={form.scheduledAt} onChange={e => setForm({...form, scheduledAt: e.target.value})} className="input-light" />
            </div>
            <div>
              <label className="section-label mb-2 block">Duration (mins)</label>
              <input required type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="input-light" />
            </div>

            <ImageUpload 
              label="Course Banner Image"
              value={form.coverImage}
              onChange={(url) => setForm({...form, coverImage: url})}
            />

            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Brief Description</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-light min-h-[100px]" />
            </div>
            <div className="md:col-span-2 pt-4">
              <button disabled={loading} type="submit" className="btn-primary w-full justify-center py-4">
                {loading ? 'Creating...' : 'Schedule Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function AdminSessionsTab() {
  const [sessions, setSessions] = useState<any[]>([])
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [meetLink, setMeetLink] = useState('')

  useEffect(() => {
    fetch('/api/admin/sessions').then(r => r.json()).then(d => setSessions(d.sessions || []))
  }, [])

  const saveMeetLink = async (sessionId: string) => {
    await fetch(`/api/admin/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetLink }),
    })
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, meetLink } : s))
    setEditingLink(null)
    setMeetLink('')
  }

  const deleteSession = async (id: string) => {
    if (!confirm('Are you sure? This will remove all enrollments for this course.')) return
    const res = await fetch(`/api/admin/sessions/${id}`, { method: 'DELETE' })
    if (res.ok) setSessions(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {sessions.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold text-sm uppercase tracking-widest">
          No courses scheduled yet.
        </div>
      )}
      {sessions.map(s => (
        <div key={s.id} className="card-light p-6 bg-white border-l-8 border-l-sensory-yellow">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1">
              <h3 className="font-display text-2xl text-sensory-purple-dark font-bold mb-2">{s.title}</h3>
              <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                <span>{new Date(s.scheduledAt).toLocaleString()}</span>
                <span className="text-sensory-purple">•</span>
                <span>{s.host}</span>
                <span className="text-sensory-purple">•</span>
                <span>${s.price}</span>
                <span className="text-sensory-purple">•</span>
                <span className="text-sensory-purple-dark">{s._count?.registrations ?? 0} Enrolled</span>
              </div>
              {s.meetLink ? (
                <div className="inline-flex items-center gap-2 bg-sensory-green-light/10 text-sensory-green-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">✓ Meet link set</div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">⚠ No Meet link yet</div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingLink(s.id); setMeetLink(s.meetLink || '') }} className="btn-ghost px-6 py-2.5 text-[10px]"><Link2 className="w-3.5 h-3.5" /> {s.meetLink ? 'Update Link' : 'Add Link'}</button>
              <button onClick={() => deleteSession(s.id)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          {editingLink === s.id && (
            <div className="mt-6 flex gap-3 p-4 bg-gray-50 rounded-2xl animate-fade-up">
              <input type="url" value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="https://meet.google.com/xxx-yyyy-zzz" className="input-light flex-1 text-sm bg-white" />
              <button onClick={() => saveMeetLink(s.id)} className="btn-primary text-xs px-6">Save</button>
              <button onClick={() => setEditingLink(null)} className="btn-ghost text-xs px-6">Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function AdminResourcesTab() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/posts').then(r => r.json()).then(d => setPosts(d.posts || []))
  }, [])

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure?')) return
    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {posts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold text-sm uppercase tracking-widest">
          No articles published yet.
        </div>
      )}
      {posts.map(p => (
        <div key={p.id} className="card-light p-6 bg-white flex items-center gap-6 group hover:border-sensory-purple transition-colors">
          <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
             <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-2xl text-sensory-purple-dark font-bold mb-1">{p.title}</h3>
            <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               <span>{p.category}</span>
               <span className="text-sensory-purple">•</span>
               <span>{new Date(p.createdAt).toLocaleDateString()}</span>
               <span className="text-sensory-purple">•</span>
               <span className={p.published ? 'text-sensory-green-dark' : 'text-amber-400'}>
                 {p.published ? 'Published' : 'Draft'}
               </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sensory-purple hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
            <button onClick={() => deletePost(p.id)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  )
}
