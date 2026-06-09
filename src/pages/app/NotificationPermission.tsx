import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'

export default function NotificationPermission() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('gopay-notif-dismissed')
    if (!dismissed && 'Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => setShow(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
    localStorage.setItem('gopay-notif-dismissed', 'true')
    setShow(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('gopay-notif-dismissed', 'true')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDismiss} />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-[360px] bg-white rounded-3xl p-6 z-10 shadow-2xl text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="w-16 h-16 rounded-2xl bg-gopay-blue/10 flex items-center justify-center mx-auto mb-4"
            >
              <Bell size={32} className="text-gopay-blue" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ativar Notificações</h2>
            <p className="text-sm text-gray-500 mb-6">Receba alertas de pagamentos em tempo real</p>
            <div className="space-y-3">
              <button
                onClick={handleAllow}
                className="w-full py-3.5 bg-gopay-blue text-white font-semibold rounded-2xl shadow-[0_4px_15px_rgba(0,102,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.4)] transition-all active:scale-[0.98]"
              >
                Permitir
              </button>
              <button
                onClick={handleDismiss}
                className="w-full py-3 text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Agora não
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
