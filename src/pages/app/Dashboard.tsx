import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Bell, Plus, Link2, Activity, Settings, Calendar, DollarSign, CreditCard } from 'lucide-react'
import BottomNav from '../../components/BottomNav'
import { useGatewayStore } from '../../stores/gatewayStore'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationsStore } from '../../stores/notificationsStore'
import { useLinksStore } from '../../stores/linksStore'
import { formatCurrency, timeAgo } from '../../utils/format'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { connectedGateway, balance, fetchBalance, mode } = useGatewayStore()
  const { unreadCount } = useNotificationsStore()
  const { links } = useLinksStore()
  const [showBalance, setShowBalance] = useState(true)
  useEffect(() => {
    if (connectedGateway) fetchBalance()
  }, [connectedGateway, fetchBalance])
  const totalPayments = links.reduce((acc, l) => acc + l.payments, 0)

  const recentLinks = [...links].slice(0, 5)

  const todayAmount = links.filter(l => {
    const d = new Date(l.createdAt); const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length > 0 ? balance?.balance ? balance.balance * 0.02 : 0 : 0

  const metrics = [
    { icon: DollarSign, label: 'Recebimentos hoje', value: formatCurrency(todayAmount), color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Calendar, label: 'Recebimentos do mês', value: formatCurrency(balance?.totalReceived || 0), color: 'text-gopay-blue', bg: 'bg-blue-50' },
    { icon: Link2, label: 'Total de links', value: String(links.length), color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: CreditCard, label: 'Total de pagamentos', value: String(totalPayments), color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  if (!connectedGateway) {
    return (
      <div className="phone-frame">
        <div className="phone-content min-h-screen bg-gopay-light">
          <div className="px-6 pt-14 pb-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋</h1>
              </div>
              <button onClick={() => navigate('/app/notifications')} className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gopay-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                <Link2 size={20} className="text-gopay-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Conecte um gateway</h3>
                <p className="text-xs text-gray-500 mb-3">Conecte um gateway para começar a receber pagamentos.</p>
                <button
                  onClick={() => navigate('/connect-gateway')}
                  className="px-4 py-2 bg-gopay-blue text-white text-sm font-semibold rounded-xl shadow-[0_4px_15px_rgba(0,102,255,0.3)]"
                >
                  Conectar agora
                </button>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    )
  }

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-gopay-light" onTouchEnd={() => {
        if (connectedGateway) fetchBalance()
      }}>
        <div className="px-6 pt-14 pb-24">
          {/* Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user?.name?.split(' ')[0] || 'Usuário'}! 👋</h1>
            </div>
            <button onClick={() => navigate('/app/notifications')} className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-gopay-blue to-gopay-dark mb-5"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-200 text-sm font-medium">Saldo disponível</p>
                <button onClick={() => setShowBalance(!showBalance)} className="text-blue-200/70 hover:text-white transition-colors">
                  {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">
                {showBalance ? formatCurrency(balance?.availableBalance || 0) : 'R$ ••••••'}
              </h2>
              <p className="text-blue-200 text-xs">
                via {connectedGateway === 'krypt' ? 'KryptGateway' : connectedGateway === 'pixgo' ? 'PixGo API' : connectedGateway === 'pixkey' ? 'PIX Local' : 'AbacatePay'}
                {mode === 'offline' ? ' 🔒 offline' : ''}
              </p>
            </div>
          </motion.div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="p-4 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center`}>
                    <m.icon size={16} className={m.color} />
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">{m.value}</p>
                <p className="text-[11px] text-gray-500">{m.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">Ações rápidas</h3>
          <div className="flex gap-4 mb-6 px-1">
            {[
              { icon: Plus, label: 'Novo Link', path: '/app/create', color: 'text-gopay-blue', bg: 'bg-blue-50' },
              { icon: Link2, label: 'Links', path: '/app/links', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: Activity, label: 'Extrato', path: '/app/activity', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Settings, label: 'Config', path: '/app/profile', color: 'text-gray-600', bg: 'bg-gray-100' },
            ].map((a, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate(a.path)}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div className={`w-12 h-12 rounded-2xl ${a.bg} flex items-center justify-center shadow-sm`}>
                  <a.icon size={20} className={a.color} />
                </div>
                <span className="text-[11px] text-gray-600 font-medium">{a.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-semibold text-gray-700">Atividade recente</h3>
            <button onClick={() => navigate('/app/activity')} className="text-xs text-gopay-blue font-medium">Ver todas</button>
          </div>

          <div className="space-y-2">
            {recentLinks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white text-center">
                <p className="text-gray-400 text-sm">Nenhuma atividade ainda</p>
                <button onClick={() => navigate('/app/create')} className="text-gopay-blue text-sm font-medium mt-2">Criar seu primeiro link</button>
              </div>
            ) : (
              recentLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-[0_1px_5px_rgba(0,0,0,0.03)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <DollarSign size={18} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">Link criado</p>
                    <p className="text-xs text-gray-500">{link.description || link.slug} • {timeAgo(link.createdAt)}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(link.amount)}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    </div>
  )
}
