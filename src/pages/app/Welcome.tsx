import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Link2, Wallet } from 'lucide-react'
import Button from '../../components/Button'

const benefits = [
  { icon: Zap, text: 'Links de pagamento rápidos e personalizados' },
  { icon: Link2, text: 'Conexão com gateways segura e prática' },
  { icon: Wallet, text: 'Saque fácil direto no app conectado' },
]

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="phone-frame">
      <div className="phone-content flex flex-col min-h-screen bg-white">
        {/* Wave header */}
        <div className="relative h-48 bg-gopay-blue overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-24"
            viewBox="0 0 393 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 48C40 72 80 24 120 48C160 72 200 24 240 48C280 72 320 24 360 48C380 60 393 54 393 54V96H0V48Z" fill="white" />
          </svg>
          <div className="absolute top-12 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
                  <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2.5" />
                  <path d="M13 20 C13 16, 16 13, 20 13 C24 13, 27 16, 27 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M27 20 L27 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M22 24 L27 27 L32 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="20" r="2.5" fill="white" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">GoPay</span>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pt-8 pb-10 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao GoPay</h1>
            <p className="text-gray-500 text-sm">A maneira mais simples de criar links de pagamento.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mb-10"
          >
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gopay-light"
              >
                <div className="w-10 h-10 rounded-xl bg-gopay-blue/10 flex items-center justify-center shrink-0">
                  <b.icon size={20} className="text-gopay-blue" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{b.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-auto space-y-4">
            <Button onClick={() => navigate('/register')}>Começar</Button>
            <button
              onClick={() => navigate('/login')}
              className="w-full text-center text-sm text-gray-500 font-medium py-2 hover:text-gopay-blue transition-colors"
            >
              Já tenho uma conta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
