import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../utils/supabase'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        navigate('/app/dashboard', { replace: true })
      } else {
        navigate('/welcome', { replace: true })
      }
    }, 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="phone-frame">
      <div className="phone-content flex flex-col items-center justify-center min-h-screen bg-gopay-blue">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'backOut' }}
            className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-lg"
          >
            <svg viewBox="0 0 40 40" width="56" height="56" fill="none">
              <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2.5" />
              <path d="M13 20 C13 16, 16 13, 20 13 C24 13, 27 16, 27 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M27 20 L27 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22 24 L27 27 L32 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="2.5" fill="white" />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-4xl font-bold text-white tracking-tight"
          >
            GoPay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-blue-200 text-base mt-2 font-light tracking-wide"
          >
            Receba. Conecte. Cresça.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
