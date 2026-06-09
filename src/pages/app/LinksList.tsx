import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Link2, ChevronRight } from 'lucide-react'
import BottomNav from '../../components/BottomNav'
import EmptyState from '../../components/EmptyState'
import { useLinksStore } from '../../stores/linksStore'
import { formatCurrency, timeAgo } from '../../utils/format'

export default function LinksList() {
  const navigate = useNavigate()
  const { links } = useLinksStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all')

  const filtered = links.filter((l) => {
    const matchSearch = l.slug.toLowerCase().includes(search.toLowerCase()) || l.description?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ? true : l.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-gopay-light pb-24">
        <div className="px-6 pt-14 pb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Links</h1>

          {/* Search */}
          <div className="flex items-center bg-white rounded-xl px-4 py-2.5 mb-4 shadow-sm">
            <Search size={18} className="text-gray-400 mr-2 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar links..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-5">
            {[
              { key: 'all' as const, label: 'Todos' },
              { key: 'active' as const, label: 'Ativos' },
              { key: 'expired' as const, label: 'Expirados' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-gopay-blue text-white shadow-[0_2px_8px_rgba(0,102,255,0.25)]'
                    : 'bg-white text-gray-600 shadow-sm'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="px-6 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Link2 size={36} className="text-gray-300" />}
              title="Nenhum link encontrado"
              description="Crie seu primeiro link de pagamento"
              action="Criar link"
              onAction={() => navigate('/app/create')}
            />
          ) : (
            filtered.map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/app/link-detail/${link.id}`)}
                className="p-4 rounded-2xl bg-white shadow-[0_1px_5px_rgba(0,0,0,0.03)] cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-gopay-blue/10 flex items-center justify-center shrink-0">
                      <Link2 size={14} className="text-gopay-blue" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 truncate">gopay.me/{link.slug}</p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2 ${
                      link.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {link.status === 'active' ? 'Ativo' : 'Expirado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(link.amount)}</p>
                    <p className="text-[11px] text-gray-500">{link.payments} pagamento(s) • {timeAgo(link.createdAt)}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </motion.div>
            ))
          )}
        </div>
        <BottomNav />
      </div>
    </div>
  )
}
