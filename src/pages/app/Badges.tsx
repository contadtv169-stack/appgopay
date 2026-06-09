import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Trophy, Lock, Download, Printer } from 'lucide-react'
import { useBadgesStore } from '../../stores/badgesStore'
import { formatDate } from '../../utils/format'

export default function Badges() {
  const navigate = useNavigate()
  const { badges } = useBadgesStore()
  const badgeRef = useRef<HTMLDivElement>(null)

  const unlocked = badges.filter((b) => b.unlockedAt)
  const locked = badges.filter((b) => !b.unlockedAt)

  const downloadBadge = (badge: typeof badges[0]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0066FF"/>
          <stop offset="100%" style="stop-color:#0048CC"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" rx="30" fill="url(#bg)"/>
      <circle cx="200" cy="180" r="70" fill="rgba(255,255,255,0.15)"/>
      <text x="200" y="200" text-anchor="middle" font-size="60">${badge.icon}</text>
      <text x="200" y="310" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="bold" fill="white">${badge.name}</text>
      <text x="200" y="350" text-anchor="middle" font-family="sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">${badge.description}</text>
      <text x="200" y="420" text-anchor="middle" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.5)">GoPay - ${badge.unlockedAt ? formatDate(badge.unlockedAt) : ''}</text>
    </svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gopay-badge-${badge.id}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printBadge = (badge: typeof badges[0]) => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
      <div style="text-align:center;padding:40px;background:linear-gradient(135deg,#0066FF,#0048CC);border-radius:30px;color:white;width:400px">
        <div style="font-size:80px;margin-bottom:20px">${badge.icon}</div>
        <h1 style="font-family:sans-serif;font-size:28px;margin:0 0 8px">${badge.name}</h1>
        <p style="font-family:sans-serif;font-size:16px;opacity:0.8;margin:0 0 30px">${badge.description}</p>
        <p style="font-family:sans-serif;font-size:12px;opacity:0.5">GoPay - ${badge.unlockedAt ? formatDate(badge.unlockedAt) : ''}</p>
      </div>
      <script>window.print()</script>
    </body></html>`)
    win.document.close()
  }

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-gradient-to-br from-gopay-blue to-gopay-dark text-white mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Trophy size={24} className="text-yellow-300" />
              <h2 className="text-lg font-bold">Suas Conquistas</h2>
            </div>
            <p className="text-blue-200 text-sm">{unlocked.length} de {badges.length} desbloqueadas</p>
            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${(unlocked.length / badges.length) * 100}%` }} />
            </div>
          </motion.div>

          {unlocked.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-3">Desbloqueadas</h3>
              <div className="space-y-2" ref={badgeRef}>
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
                    <div className="flex gap-1">
                      <button onClick={() => downloadBadge(badge)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-blue-50 transition-colors" title="Baixar">
                        <Download size={14} className="text-gray-500" />
                      </button>
                      <button onClick={() => printBadge(badge)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-blue-50 transition-colors" title="Imprimir">
                        <Printer size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400">{badge.unlockedAt ? formatDate(badge.unlockedAt) : ''}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

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
