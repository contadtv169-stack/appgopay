import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, Clock, XCircle } from 'lucide-react'
import BottomNav from '../../components/BottomNav'
import EmptyState from '../../components/EmptyState'
import { useLinksStore } from '../../stores/linksStore'
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/format'

export default function Activity() {
  const navigate = useNavigate()
  const { links } = useLinksStore()
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'all'>('all')

  const filtered = useMemo(() => {
    const now = Date.now()
    switch (period) {
      case 'today':
        return links.filter((l) => now - new Date(l.createdAt).getTime() < 86400000)
      case '7days':
        return links.filter((l) => now - new Date(l.createdAt).getTime() < 7 * 86400000)
      case '30days':
        return links.filter((l) => now - new Date(l.createdAt).getTime() < 30 * 86400000)
      default:
        return links
    }
  }, [links, period])

  const totalAmount = useMemo(() => filtered.reduce((acc, l) => acc + l.amount, 0), [filtered])

  const getIcon = (status: string) => {
    switch (status) {
      case 'active': return <DollarSign size={16} className="text-green-500" />
      case 'expired': return <XCircle size={16} className="text-gray-400" />
      default: return <Clock size={16} className="text-yellow-500" />
    }
  }

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-gopay-light pb-24">
        <div className="px-6 pt-14 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Atividade</h1>
            {filtered.length > 0 && (
              <span className="text-sm font-bold text-gopay-blue">{formatCurrency(totalAmount)}</span>
            )}
          </div>

          {/* Period filters */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {[
              { key: 'today' as const, label: 'Hoje' },
              { key: '7days' as const, label: '7 dias' },
              { key: '30days' as const, label: '30 dias' },
              { key: 'all' as const, label: 'Tudo' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setPeriod(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  period === f.key
                    ? 'bg-gopay-blue text-white shadow-[0_2px_8px_rgba(0,102,255,0.25)]'
                    : 'bg-white text-gray-600 shadow-sm'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 space-y-2">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Clock size={36} className="text-gray-300" />}
              title="Nenhuma atividade"
              description="Seus links de pagamento aparecerão aqui"
              action="Criar link"
              onAction={() => navigate('/app/create')}
            />
          ) : (
            filtered.map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-[0_1px_5px_rgba(0,0,0,0.03)]"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getStatusColor(link.status)}`}>
                  {getIcon(link.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{link.description || `Link gopay.me/${link.slug}`}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(link.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(link.amount)}</p>
                  <p className={`text-[10px] font-medium ${link.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                    {getStatusLabel(link.status)}
                  </p>
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
