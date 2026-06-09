import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Settings, Eye } from 'lucide-react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useGatewayStore } from '../../stores/gatewayStore'
import { useLinksStore } from '../../stores/linksStore'
import { useNotificationsStore } from '../../stores/notificationsStore'
import { createPixCharge } from '../../utils/api'
import { generateSlug, generateId } from '../../utils/format'
import type { CheckoutCustomization } from '../../utils/types'

export default function CreateLink() {
  const navigate = useNavigate()
  const { connectedGateway, credentials } = useGatewayStore()
  const { createLink: storeLink } = useLinksStore()
  const addNotification = useNotificationsStore((s) => s.addNotification)

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [expiration, setExpiration] = useState('never')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const [bannerTitle, setBannerTitle] = useState('Pagamento seguro via')
  const [bannerSubtitle, setBannerSubtitle] = useState('KryptGateway')
  const [videoUrl, setVideoUrl] = useState('')
  const [showQuiz, setShowQuiz] = useState(true)
  const [showReviews, setShowReviews] = useState(true)
  const [showCountdown, setShowCountdown] = useState(true)

  const getRawAmount = (masked: string) => {
    const nums = masked.replace(/\D/g, '')
    const padded = nums.padStart(3, '0')
    const int = padded.slice(0, -2)
    const dec = padded.slice(-2)
    return parseFloat(`${int}.${dec}`)
  }

  const handleSubmit = async () => {
    const rawAmount = getRawAmount(amount)
    if (rawAmount <= 0) {
      setError('Informe um valor válido')
      return
    }
    if (!slug.trim()) {
      setError('Defina uma URL personalizada')
      return
    }
    setLoading(true)
    setError('')

    const finalSlug = generateSlug(slug)
    const now = new Date().toISOString()

    let expDate = ''
    if (expiration === '1day') expDate = new Date(Date.now() + 86400000).toISOString()
    else if (expiration === '7days') expDate = new Date(Date.now() + 7 * 86400000).toISOString()
    else if (expiration === '15days') expDate = new Date(Date.now() + 15 * 86400000).toISOString()
    else if (expiration === '30days') expDate = new Date(Date.now() + 30 * 86400000).toISOString()

    const id = generateId()
    const checkout: CheckoutCustomization = {
      bannerTitle: bannerTitle || 'Pagamento seguro via',
      bannerSubtitle: bannerSubtitle || 'KryptGateway',
      videoUrl,
      showQuiz,
      showReviews,
      showCountdown,
    }
    const linkData: any = {
      id,
      slug: finalSlug,
      url: `${window.location.origin}/appgopay/#/checkout/${finalSlug}`,
      amount: rawAmount,
      description: description.trim(),
      status: 'active' as const,
      expiration: expDate,
      transactionId: '',
      payments: 0,
      views: 0,
      createdAt: now,
      checkout,
    }

    if (connectedGateway === 'krypt' && credentials) {
      try {
        const pixResult = await createPixCharge(
          credentials.ci,
          credentials.cs,
          rawAmount,
          description.trim() || `Link GoPay ${finalSlug}`
        )
        linkData.transactionId = pixResult.data.transactionId
        linkData.qrCodeBase64 = pixResult.data.qrCodeBase64
        linkData.copyPaste = pixResult.data.copyPaste
        linkData.paymentLink = pixResult.data.paymentLink
      } catch (err: any) {
        setError(err.message || 'Erro ao gerar cobrança')
        setLoading(false)
        return
      }
    }

    storeLink(linkData)

    addNotification({
      id: generateId(),
      type: 'link_created',
      title: 'Link criado',
      message: `Seu link '${finalSlug}' foi criado com sucesso`,
      read: false,
      createdAt: new Date().toISOString(),
    })

    navigate(`/app/link-generated/${id}`)
  }

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-white">
        <div className="px-6 pt-6 pb-10">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <ChevronLeft size={22} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Novo Link</h1>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-red-50 border border-red-100 mb-4 text-red-600 text-sm">
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <Input label="Valor" value={amount} onChange={setAmount} maskCurrency placeholder="0,00" required />
            <Input label="Descrição (opcional)" value={description} onChange={setDescription} placeholder="Ex: Consultoria de marketing" />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL personalizada</label>
              <div className="flex items-center bg-gopay-light rounded-xl border border-transparent focus-within:border-gopay-blue focus-within:shadow-[0_0_0_3px_rgba(0,102,255,0.1)] transition-all overflow-hidden">
                <span className="pl-4 text-gray-500 text-sm font-medium shrink-0">gopay.me/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="consultoria"
                  className="flex-1 bg-transparent px-3 py-3.5 text-base text-gray-900 placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiração</label>
              <select
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full bg-gopay-light rounded-xl px-4 py-3.5 text-base text-gray-900 outline-none focus:border-gopay-blue focus:shadow-[0_0_0_3px_rgba(0,102,255,0.1)] transition-all"
              >
                <option value="never">Não expira</option>
                <option value="1day">1 dia</option>
                <option value="7days">7 dias</option>
                <option value="15days">15 dias</option>
                <option value="30days">30 dias</option>
              </select>
            </div>
          </div>

          {/* Checkout Customization */}
          <div className="mt-6 mb-4">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="flex items-center gap-2 text-sm font-semibold text-gopay-blue py-2"
            >
              <Settings size={16} />
              Personalizar página de checkout
            </button>

            {showCustom && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 space-y-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <Input label="Título do banner" value={bannerTitle} onChange={setBannerTitle} placeholder="Pagamento seguro via" />
                <Input label="Subtítulo do banner" value={bannerSubtitle} onChange={setBannerSubtitle} placeholder="KryptGateway" />
                <Input label="URL do vídeo (opcional)" value={videoUrl} onChange={setVideoUrl} placeholder="https://youtube.com/..." />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Mostrar quiz</span>
                  <button
                    onClick={() => setShowQuiz(!showQuiz)}
                    className={`w-12 h-6 rounded-full transition-colors ${showQuiz ? 'bg-gopay-blue' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showQuiz ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Mostrar avaliações</span>
                  <button
                    onClick={() => setShowReviews(!showReviews)}
                    className={`w-12 h-6 rounded-full transition-colors ${showReviews ? 'bg-gopay-blue' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showReviews ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Mostrar contador</span>
                  <button
                    onClick={() => setShowCountdown(!showCountdown)}
                    className={`w-12 h-6 rounded-full transition-colors ${showCountdown ? 'bg-gopay-blue' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showCountdown ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Preview Button */}
          <button
            onClick={() => slug.trim() && window.open(`/#/checkout/${generateSlug(slug)}`, '_blank')}
            className="w-full flex items-center justify-center gap-2 py-3 mb-4 text-sm text-gray-500 font-medium rounded-xl border border-gray-200 hover:border-gopay-blue hover:text-gopay-blue transition-all"
          >
            <Eye size={16} /> Visualizar checkout
          </button>

          <Button onClick={handleSubmit} loading={loading}>
            Gerar Link
          </Button>
        </div>
      </div>
    </div>
  )
}
