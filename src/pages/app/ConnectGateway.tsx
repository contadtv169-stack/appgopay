import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Shield } from 'lucide-react'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Input from '../../components/Input'
import { useGatewayStore } from '../../stores/gatewayStore'
import { useNotificationsStore } from '../../stores/notificationsStore'
import { testKryptConnection } from '../../utils/api'
import { generateId } from '../../utils/format'

export default function ConnectGateway() {
  const navigate = useNavigate()
  const { connect, connectedGateway } = useGatewayStore()
  const addNotification = useNotificationsStore((s) => s.addNotification)

  const [kryptModal, setKryptModal] = useState(false)
  const [abacateModal, setAbacateModal] = useState(false)
  const [ci, setCi] = useState('')
  const [cs, setCs] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [abacateUrl, setAbacateUrl] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [kryptError, setKryptError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleConnectKrypt = async () => {
    if (!ci.trim() || !cs.trim()) {
      setKryptError('Preencha todos os campos')
      return
    }
    setConnecting(true)
    setKryptError('')
    try {
      await testKryptConnection(ci.trim(), cs.trim())
      connect('krypt', { ci: ci.trim(), cs: cs.trim() })
      addNotification({
        id: generateId(),
        type: 'gateway_connected',
        title: 'Gateway conectado',
        message: 'KryptGateway conectado com sucesso!',
        read: false,
        createdAt: new Date().toISOString(),
      })
      setSuccessMsg('Conta conectada com sucesso!')
      setKryptModal(false)
      setCi('')
      setCs('')
    } catch (err: any) {
      setKryptError(err.message || 'Erro ao conectar. Verifique suas credenciais.')
    } finally {
      setConnecting(false)
    }
  }

  const handleConnectAbacate = () => {
    if (!apiKey.trim()) return
    connect('abacate', { apiKey: apiKey.trim(), baseUrl: abacateUrl || 'https://api.abacatepay.com' })
    addNotification({
      id: generateId(),
      type: 'gateway_connected',
      title: 'Gateway conectado',
      message: 'AbacatePay conectado com sucesso!',
      read: false,
      createdAt: new Date().toISOString(),
    })
    setSuccessMsg('Conta conectada com sucesso!')
    setAbacateModal(false)
    setApiKey('')
  }

  const isConnected = connectedGateway !== null

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-white">
        <div className="px-6 pt-6 pb-10">
          <button onClick={() => navigate(-1)} className="mb-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <ChevronLeft size={22} className="text-gray-700" />
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Conectar Gateway</h1>
            <p className="text-gray-500 text-sm mb-2">Conecte o GoPay ao seu provedor para receber pagamentos.</p>
          </motion.div>

          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-green-50 border border-green-100 mb-4 text-green-700 text-sm font-medium">
              ✓ {successMsg}
            </motion.div>
          )}

          <div className="space-y-4 my-6">
            {/* KryptGateway Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl border border-gray-100 hover:border-gopay-blue/20 transition-all cursor-pointer"
              onClick={() => setKryptModal(true)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-gopay-blue font-bold text-xl">
                  K
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">KryptGateway</h3>
                  <p className="text-xs text-gray-500">PIX, cripto e mais</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    connectedGateway === 'krypt'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-orange-50 text-orange-500'
                  }`}
                >
                  {connectedGateway === 'krypt' ? 'Conta conectada' : 'Conectar'}
                </span>
              </div>
            </motion.div>

            {/* AbacatePay Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 rounded-2xl border border-gray-100 hover:border-green-200 transition-all cursor-pointer"
              onClick={() => setAbacateModal(true)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-xl">
                  A
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">AbacatePay</h3>
                  <p className="text-xs text-gray-500">Pagamentos via PIX</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    connectedGateway === 'abacate'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-orange-50 text-orange-500'
                  }`}
                >
                  {connectedGateway === 'abacate' ? 'Conta conectada' : 'Conectar'}
                </span>
              </div>
            </motion.div>
          </div>

          <p className="text-center text-sm text-gray-400 mb-4">Mais opções em breve!</p>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-xs text-gray-600 mb-6">
            <Shield size={14} className="text-gopay-blue shrink-0" />
            Seus dados estão protegidos com criptografia de ponta.
          </div>

          <Button onClick={() => navigate('/app/dashboard')} disabled={!isConnected}>
            Ir para o painel
          </Button>

          {!isConnected && (
            <div className="flex items-center gap-2 mt-3 justify-center">
              <button
                onClick={() => navigate('/app/dashboard')}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Pular por agora
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Krypt Modal */}
      <Modal open={kryptModal} onClose={() => { setKryptModal(false); setKryptError('') }} title="Conectar KryptGateway">
        <div className="space-y-4">
          <Input label="Client ID (ci)" value={ci} onChange={setCi} placeholder="krypt_ci_..." required />
          <Input label="Client Secret (cs)" value={cs} onChange={setCs} placeholder="krypt_cs_..." required type="password" />
          {kryptError && <p className="text-red-500 text-sm">{kryptError}</p>}
          <Button onClick={handleConnectKrypt} loading={connecting}>Conectar</Button>
        </div>
      </Modal>

      {/* Abacate Modal */}
      <Modal open={abacateModal} onClose={() => setAbacateModal(false)} title="Conectar AbacatePay">
        <div className="space-y-4">
          <Input label="API Key" value={apiKey} onChange={setApiKey} placeholder="Sua API Key" required />
          <Input label="Base URL (opcional)" value={abacateUrl} onChange={setAbacateUrl} placeholder="https://api.abacatepay.com" />
          <Button onClick={handleConnectAbacate} disabled={!apiKey.trim()}>Conectar</Button>
        </div>
      </Modal>
    </div>
  )
}
