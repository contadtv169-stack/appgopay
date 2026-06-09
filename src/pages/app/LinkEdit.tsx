import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Trash2, Save, Settings } from 'lucide-react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useLinksStore } from '../../stores/linksStore'
import { generateSlug } from '../../utils/format'
import type { CheckoutCustomization } from '../../utils/types'

export default function LinkEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const link = useLinksStore((s) => s.links.find((l) => l.id === id))
  const { updateLink, deleteLink } = useLinksStore()

  const [amount, setAmount] = useState(link ? String(link.amount) : '')
  const [description, setDescription] = useState(link?.description || '')
  const [slug, setSlug] = useState(link?.slug || '')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showCustom, setShowCustom] = useState(false)

  const [bannerTitle, setBannerTitle] = useState(link?.checkout?.bannerTitle || 'Pagamento seguro via')
  const [bannerSubtitle, setBannerSubtitle] = useState(link?.checkout?.bannerSubtitle || 'KryptGateway')
  const [videoUrl, setVideoUrl] = useState(link?.checkout?.videoUrl || '')
  const [showQuiz, setShowQuiz] = useState(link?.checkout?.showQuiz ?? true)
  const [showReviews, setShowReviews] = useState(link?.checkout?.showReviews ?? true)
  const [showCountdown, setShowCountdown] = useState(link?.checkout?.showCountdown ?? true)

  if (!link) {
    return (
      <div className="phone-frame">
        <div className="phone-content min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-500">Link não encontrado</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    setSaving(true)
    const checkout: CheckoutCustomization = { bannerTitle, bannerSubtitle, videoUrl, showQuiz, showReviews, showCountdown }
    setTimeout(() => {
      updateLink(link.id, {
        amount: parseFloat(amount) || link.amount,
        description,
        slug: generateSlug(slug),
        checkout,
      })
      setSaving(false)
      navigate(`/app/link-detail/${link.id}`)
    }, 500)
  }

  const handleDelete = () => {
    deleteLink(link.id)
    navigate('/app/links')
  }

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-white">
        <div className="px-6 pt-6 pb-10">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <ChevronLeft size={22} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Editar Link</h1>
          </div>

          <div className="space-y-4">
            <Input label="Valor" value={amount} onChange={setAmount} placeholder="0,00" />
            <Input label="Descrição" value={description} onChange={setDescription} placeholder="Descrição do produto" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL personalizada</label>
              <div className="flex items-center bg-gopay-light rounded-xl border border-transparent focus-within:border-gopay-blue transition-all overflow-hidden">
                <span className="pl-4 text-gray-500 text-sm font-medium shrink-0">gopay.me/</span>
                <input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} className="flex-1 bg-transparent px-3 py-3.5 text-base text-gray-900 outline-none" />
              </div>
            </div>
          </div>

          {/* Checkout Customization */}
          <div className="mt-6 mb-4">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="flex items-center gap-2 text-sm font-semibold text-gopay-blue py-2"
            >
              <Settings size={16} />
              Personalizar checkout
            </button>
            {showCustom && (
              <div className="mt-3 space-y-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Input label="Título do banner" value={bannerTitle} onChange={setBannerTitle} />
                <Input label="Subtítulo do banner" value={bannerSubtitle} onChange={setBannerSubtitle} />
                <Input label="URL do vídeo" value={videoUrl} onChange={setVideoUrl} placeholder="https://youtube.com/..." />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Quiz</span>
                  <button onClick={() => setShowQuiz(!showQuiz)} className={`w-12 h-6 rounded-full transition-colors ${showQuiz ? 'bg-gopay-blue' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showQuiz ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Avaliações</span>
                  <button onClick={() => setShowReviews(!showReviews)} className={`w-12 h-6 rounded-full transition-colors ${showReviews ? 'bg-gopay-blue' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showReviews ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Contador</span>
                  <button onClick={() => setShowCountdown(!showCountdown)} className={`w-12 h-6 rounded-full transition-colors ${showCountdown ? 'bg-gopay-blue' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showCountdown ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <Button onClick={handleSave} loading={saving}>
              <Save size={18} /> Salvar Alterações
            </Button>
            {!confirmDelete ? (
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={18} /> Excluir link
              </Button>
            ) : (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                <p className="text-sm text-red-700 mb-3">Tem certeza que deseja excluir este link?</p>
                <div className="flex gap-3">
                  <Button variant="danger" size="sm" onClick={handleDelete}>Sim, excluir</Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
