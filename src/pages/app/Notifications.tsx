import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, CheckCheck, Bell, DollarSign, Link2, XCircle, ShieldCheck } from 'lucide-react'
import { useNotificationsStore } from '../../stores/notificationsStore'
import { timeAgo } from '../../utils/format'

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  payment_received: { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  link_created: { icon: Link2, color: 'text-gopay-blue', bg: 'bg-blue-50' },
  link_expired: { icon: XCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  gateway_connected: { icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
}

export default function Notifications() {
  const navigate = useNavigate()
  const { notifications, markAllAsRead, markAsRead } = useNotificationsStore()

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-gopay-light">
        <div className="px-6 pt-6 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <ChevronLeft size={22} className="text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Notificações</h1>
            </div>
            {notifications.length > 0 && (
              <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs text-gopay-blue font-semibold">
                <CheckCheck size={14} /> Marcar todas
              </button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Bell size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((n, i) => {
                const config = typeConfig[n.type] || typeConfig.gateway_connected
                const Icon = config.icon
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => markAsRead(n.id)}
                    className={`flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer ${
                      n.read ? 'bg-white' : 'bg-blue-50/50 border border-blue-100/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-gopay-blue shrink-0 mt-2" />}
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
