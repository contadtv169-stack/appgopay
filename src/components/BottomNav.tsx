import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Link2, Activity, User, Plus } from 'lucide-react'

const tabs = [
  { path: '/app/dashboard', icon: Home, label: 'Início' },
  { path: '/app/links', icon: Link2, label: 'Links' },
  { path: '/app/create', icon: Plus, label: 'Novo', center: true },
  { path: '/app/activity', icon: Activity, label: 'Atividade' },
  { path: '/app/profile', icon: User, label: 'Conta' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
    >
      <div className="flex items-center justify-around h-[72px] relative max-w-[393px] mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          const isCenter = tab.center

          if (isCenter) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative -top-4 flex items-center justify-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-gopay-blue flex items-center justify-center shadow-[0_4px_15px_rgba(0,102,255,0.4)]"
                >
                  <Plus size={26} color="white" strokeWidth={2.5} />
                </motion.div>
              </button>
            )
          }

          const Icon = tab.icon
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 w-16 py-1"
            >
              <motion.div
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? 'text-gopay-blue' : 'text-gray-400'}
                />
              </motion.div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-gopay-blue' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
