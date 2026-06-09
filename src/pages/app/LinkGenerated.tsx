import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Copy, Share2, ChevronLeft } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import Button from '../../components/Button'
import { useLinksStore } from '../../stores/linksStore'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { useState } from 'react'

export default function LinkGenerated() {
  const { id } = useParams()
  const navigate = useNavigate()
  const link = useLinksStore((s) => s.links.find((l) => l.id === id))
  const [copied, setCopied] = useState(false)

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'GoPay - Link de pagamento', text: link.url, url: link.url })
    } else {
      copyToClipboard(link.url)
    }
  }

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-white">
        <div className="px-6 pt-6 pb-10">
          <button onClick={() => navigate('/app/dashboard')} className="mb-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <ChevronLeft size={22} className="text-gray-700" />
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-5"
            >
              <CheckCircle size={48} className="text-green-500" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Link gerado com sucesso!</h1>
            <p className="text-gray-500 text-sm">Compartilhe seu link para receber pagamentos.</p>
          </div>

          {/* URL Card */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium truncate flex-1 mr-3">{link.url}</p>
              <button
                onClick={() => copyToClipboard(link.url)}
                className="shrink-0 w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm hover:shadow transition-shadow"
              >
                <Copy size={16} className={copied ? 'text-green-500' : 'text-gray-500'} />
              </button>
            </div>
            {copied && <p className="text-xs text-green-600 mt-2">✓ Link copiado!</p>}
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <QRCodeCanvas value={link.url} size={160} bgColor="#FFFFFF" fgColor="#0066FF" level="M" />
            </div>
          </div>

          {/* Pix data */}
          {link.copyPaste && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
              <p className="text-xs text-gray-500 mb-2 font-medium">Código PIX (copia e cola)</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-gray-700 font-mono truncate">{link.copyPaste}</p>
                <button onClick={() => copyToClipboard(link.copyPaste || '')} className="shrink-0 text-gopay-blue text-xs font-semibold">
                  Copiar
                </button>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500">Valor do link</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(link.amount)}</p>
            <p className="text-xs text-gray-400 mt-1">Criado em {formatDateTime(link.createdAt)}</p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleShare}>
              <Share2 size={18} /> Compartilhar
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/app/link-detail/${link.id}`)}>Ver detalhes</Button>
            <Button variant="ghost" onClick={() => navigate('/app/create')}>Criar outro link</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
