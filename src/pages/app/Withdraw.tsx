import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Wallet, ExternalLink, Shield } from 'lucide-react'
import Button from '../../components/Button'
import { useGatewayStore } from '../../stores/gatewayStore'
import { formatCurrency } from '../../utils/format'

export default function Withdraw() {
  const navigate = useNavigate()
  const { connectedGateway, balance } = useGatewayStore()

  const gatewayName = connectedGateway === 'krypt' ? 'KryptGateway' : 'AbacatePay'
  const gatewayUrl = connectedGateway === 'krypt' ? 'https://kryptgateway.netlify.app' : '#'

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-white">
        <div className="px-6 pt-6 pb-10">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <ChevronLeft size={22} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Saque</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-blue-50 border border-blue-100 mb-6"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gopay-blue/10 flex items-center justify-center shrink-0">
                <Wallet size={24} className="text-gopay-blue" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">O saque é realizado diretamente no app do seu gateway.</p>
                <p className="text-xs text-gray-600">Você está conectado via {gatewayName}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-gopay-blue to-gopay-dark text-white text-center mb-6"
          >
            <p className="text-blue-200 text-sm mb-1">Saldo disponível</p>
            <h2 className="text-3xl font-bold mb-1">{formatCurrency(balance?.availableBalance || 0)}</h2>
            <p className="text-blue-200 text-xs">via {gatewayName}</p>
          </motion.div>

          <div className="space-y-4">
            <Button onClick={() => window.open(gatewayUrl, '_blank')}>
              <ExternalLink size={18} /> Ir para {gatewayName}
            </Button>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 text-xs text-gray-500">
              <Shield size={14} className="text-gray-400 shrink-0" />
              O GoPay não realiza saques. Gerencie seu saldo no app conectado.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
