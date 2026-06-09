import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Trophy, Lock } from 'lucide-react'
import { useBadgesStore } from '../../stores/badgesStore'
import { formatDate } from '../../utils/format'

export default function Badges() {
  const navigate = useNavigate()
  const { badges } = useBadgesStore()

  const unlocked = badges.filter((b) => b.unlockedAt)
  const locked = badges.filter((b) => !b.unlockedAt)

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-gopay-light">
        <div className="px-6 pt-6 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <ChevronLeft size={22} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Conquistas</h1>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-gradient-to-br from-gopay-blue to-gopay-dark text-white mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Trophy size={24} className="text-yellow-300" />
              <h2 className="text-lg font-bold">Suas Conquistas</h2>
            </div>
            <p className="text-blue-200 text-sm">
              {unlocked.length} de {badges.length} desbloqueadas
            </p>
            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all"
                style={{ width: `${(unlocked.length / badges.length) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Unlocked */}
          {unlocked.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-3">Desbloqueadas</h3>
              <div className="space-y-2">
                {unlocked.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-white shadow-sm flex items-center gap-3"
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{badge.name}</p>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">{badge.unlockedAt ? formatDate(badge.unlockedAt) : ''}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Locked */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-3">Para desbloquear</h3>
            <div className="space-y-2">
              {locked.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-2xl bg-white/50 shadow-sm flex items-center gap-3 opacity-60"
                >
                  <span className="text-3xl relative">
                    {badge.icon}
                    <Lock size={10} className="absolute bottom-0 -right-1 text-gray-400" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600">{badge.name}</p>
                    <p className="text-xs text-gray-400">{badge.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400">{badge.progress}/{badge.maxProgress}</span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full" style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
