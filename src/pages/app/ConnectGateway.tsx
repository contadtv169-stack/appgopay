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
import { getKeyType } from '../../utils/pix'
import { generateId } from '../../utils/format'

export default function ConnectGateway() {
  const navigate = useNavigate()
  const { connect, connectedGateway, mode } = useGatewayStore()
  const addNotification = useNotificationsStore((s) => s.addNotification)

  const [kryptModal, setKryptModal] = useState(false)
  const [pixgoModal, setPixgoModal] = useState(false)
  const [pixkeyModal, setPixkeyModal] = useState(false)
  const [ci, setCi] = useState('')
  const [cs, setCs] = useState('')
  const [pixgoKey, setPixgoKey] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnectKrypt = async () => {
    if (!ci.trim() || !cs.trim()) return setError('Preencha todos os campos')
    setConnecting(true); setError('')
    try {
      await testKryptConnection(ci.trim(), cs.trim())
      await connect('krypt', { ci: ci.trim(), cs: cs.trim() })
      addNotification({ id: generateId(), type: 'gateway_connected', title: 'KryptGateway conectado', message: 'Conectado com sucesso!', read: false, createdAt: new Date().toISOString() })
      setKryptModal(false); setCi(''); setCs('')
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar')
    } finally { setConnecting(false) }
  }

  const handleConnectPixgo = async () => {
    if (!pixgoKey.trim()) return setError('Preencha a API Key')
    setConnecting(true); setError('')
    const r = await connect('pixgo', { apiKey: pixgoKey.trim() })
    setConnecting(false)
    if (r.success) {
      addNotification({ id: generateId(), type: 'gateway_connected', title: 'PixGo conectado', message: 'Conectado com sucesso!', read: false, createdAt: new Date().toISOString() })
      setPixgoModal(false); setPixgoKey('')
    } else {
      setError(r.error || 'Erro ao conectar')
    }
  }

  const handleConnectPixKey = async () => {
    if (!pixKey.trim()) return setError('Digite sua chave PIX')
    const kt = getKeyType(pixKey.trim())
    if (kt === 'invalid') return setError('Chave inválida. Use CPF (11 dígitos), email ou telefone.')
    setConnecting(true); setError('')
    const r = await connect('pixkey', { pixKey: pixKey.trim(), name: name.trim(), city: city.trim() })
    setConnecting(false)
    if (r.success) {
      addNotification({ id: generateId(), type: 'gateway_connected', title: 'Chave PIX configurada', message: 'Pagamentos PIX gerados offline!', read: false, createdAt: new Date().toISOString() })
      setPixkeyModal(false); setPixKey(''); setName(''); setCity('')
    } else {
      setError(r.error || 'Erro ao configurar')
    }
  }

  const isConnected = connectedGateway !== null

  const gateways = [
    {
      key: 'krypt', icon: 'K', color: 'bg-blue-50 text-gopay-blue', modal: () => setKryptModal(true),
      title: 'KryptGateway', desc: 'PIX + cripto + saldo',
    },
    {
      key: 'pixgo', icon: 'P', color: 'bg-green-50 text-green-600', modal: () => setPixgoModal(true),
      title: 'PixGo API', desc: 'API Key (pk_...)',
    },
    {
      key: 'pixkey', icon: '🔑', color: 'bg-purple-50 text-purple-600', modal: () => setPixkeyModal(true),
      title: 'Chave PIX Local', desc: 'Offline - gera PIX no app',
    },
  ]

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-white">
        <div className="px-6 pt-6 pb-10">
          <button onClick={() => navigate(-1)} className="mb-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <ChevronLeft size={22} className="text-gray-700" />
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Conectar Gateway</h1>
            <p className="text-gray-500 text-sm mb-6">Escolha como receber pagamentos PIX.</p>
          </motion.div>

          {connectedGateway && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-green-50 border border-green-100 mb-4 text-green-700 text-sm font-medium">
              ✓ Conectado: {connectedGateway === 'krypt' ? 'KryptGateway' : connectedGateway === 'pixgo' ? 'PixGo API' : 'Chave PIX Local'} ({mode === 'offline' ? 'offline' : 'api'})
            </motion.div>
          )}

          <div className="space-y-4 my-6">
            {gateways.map((g, i) => (
              <motion.div
                key={g.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-5 rounded-2xl border border-gray-100 hover:border-gopay-blue/20 transition-all cursor-pointer"
                onClick={g.modal}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${g.color} flex items-center justify-center font-bold text-xl`}>
                    {g.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{g.title}</h3>
                    <p className="text-xs text-gray-500">{g.desc}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    connectedGateway === g.key ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {connectedGateway === g.key ? 'Conectado' : 'Conectar'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-xs text-gray-600 mb-6">
            <Shield size={14} className="text-gopay-blue shrink-0" />
            Chave PIX Local gera QR Code offline sem API externa
          </div>

          <Button onClick={() => navigate('/app/dashboard')}>
            Ir para o painel
          </Button>

          {!isConnected && (
            <div className="flex items-center gap-2 mt-3 justify-center">
              <button onClick={() => navigate('/app/dashboard')} className="text-xs text-gray-400 hover:text-gray-600 underline">
                Pular por agora
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Krypt Modal */}
      <Modal open={kryptModal} onClose={() => { setKryptModal(false); setError('') }} title="🔷 Conectar KryptGateway">
        <div className="space-y-4">
          <Input label="Client ID (ci)" value={ci} onChange={setCi} placeholder="krypt_ci_..." required />
          <Input label="Client Secret (cs)" value={cs} onChange={setCs} placeholder="krypt_cs_..." required type="password" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleConnectKrypt} loading={connecting}>Conectar</Button>
        </div>
      </Modal>

      {/* PixGo Modal */}
      <Modal open={pixgoModal} onClose={() => { setPixgoModal(false); setError('') }} title="🌐 Conectar PixGo API">
        <div className="space-y-4">
          <Input label="API Key (pk_...)" value={pixgoKey} onChange={setPixgoKey} placeholder="pk_..." required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleConnectPixgo} loading={connecting}>Conectar</Button>
        </div>
      </Modal>

      {/* PIX Key Modal */}
      <Modal open={pixkeyModal} onClose={() => { setPixkeyModal(false); setError('') }} title="🔑 Configurar Chave PIX">
        <div className="space-y-4">
          <Input label="Sua chave PIX" value={pixKey} onChange={setPixKey} placeholder="CPF, email ou telefone" required />
          <Input label="Seu nome (para o QR Code)" value={name} onChange={setName} placeholder="Seu nome" />
          <Input label="Cidade (opcional)" value={city} onChange={setCity} placeholder="Sua cidade" />
          {pixKey && (
            <p className="text-xs text-gray-500">Tipo: {getKeyType(pixKey).toUpperCase()}</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleConnectPixKey} loading={connecting}>Salvar Chave PIX</Button>
        </div>
      </Modal>
    </div>
  )
}
