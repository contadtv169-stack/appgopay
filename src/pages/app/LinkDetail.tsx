import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Copy, Edit3 } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import Button from '../../components/Button'
import { useLinksStore } from '../../stores/linksStore'
import { formatCurrency, formatDate } from '../../utils/format'
import { useState, useEffect } from 'react'
import { useGatewayStore } from '../../stores/gatewayStore'
import { fetchPixStatus } from '../../utils/api'

export default function LinkDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const link = useLinksStore((s) => s.links.find((l) => l.id === id))
  const { connectedGateway, credentials } = useGatewayStore()
  const [pixStatus, setPixStatus] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (link?.transactionId && connectedGateway === 'krypt' && credentials) {
      fetchPixStatus(credentials.ci, credentials.cs, link.transactionId)
        .then((res) => setPixStatus(res.data.status))
        .catch(() => {})
    }
  }, [link?.transactionId])

  if (!link) {
    return (
      <div className="phone-frame">
        <div className="phone-content min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-500">Link não encontrado</p>
        </div>
      </div>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-gopay-light">
        <div className="px-6 pt-6 pb-10">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <ChevronLeft size={22} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Informações do Link</h1>
            <button onClick={() => navigate(`/app/link-edit/${link.id}`)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Edit3 size={18} className="text-gray-600" />
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl bg-white shadow-sm mb-4">
            {/* URL */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">URL do link</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{link.url}</p>
              </div>
              <button onClick={() => copyToClipboard(link.url)} className="shrink-0 ml-3 w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                <Copy size={15} className={copied ? 'text-green-500' : 'text-gray-500'} />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <QRCodeCanvas value={link.url} size={120} bgColor="#FFFFFF" fgColor="#0066FF" level="M" />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Valor', value: formatCurrency(link.amount) },
                { label: 'Descrição', value: link.description || '-' },
                { label: 'Criado em', value: formatDate(link.createdAt) },
                { label: 'Expiração', value: link.expiration ? formatDate(link.expiration) : 'Não expira' },
                { label: 'Visualizações', value: String(link.views) },
                { label: 'Pagamentos', value: String(link.payments) },
                { label: 'Status', value: link.status === 'active' ? 'Ativo' : 'Expirado' },
                { label: 'PIX Status', value: pixStatus || (link.transactionId ? 'Consultando...' : '-') },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <Button variant="secondary" onClick={() => navigate(`/app/link-edit/${link.id}`)}>
            <Edit3 size={16} /> Editar link
          </Button>
        </div>
      </div>
    </div>
  )
}
