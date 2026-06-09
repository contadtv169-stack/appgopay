import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Clock, Play, CheckCircle, Shield, Copy } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useLinksStore } from '../../stores/linksStore'
import { formatCurrency } from '../../utils/format'

const defaultReviews = [
  { name: 'Carlos S.', stars: 5, text: 'Pagamento super rápido! Recebi na hora.', time: 'Há 2 dias' },
  { name: 'Ana M.', stars: 5, text: 'Muito prático, amei a facilidade.', time: 'Há 5 dias' },
  { name: 'Pedro R.', stars: 4, text: 'Funcionou perfeitamente. Recomendo!', time: 'Há 1 semana' },
  { name: 'Juliana L.', stars: 5, text: 'Primeira vez usando e foi tranquilo.', time: 'Há 1 semana' },
  { name: 'Lucas F.', stars: 5, text: 'Melhor forma de pagamento online.', time: 'Há 2 semanas' },
]

const quizQuestions = [
  { q: 'Este produto atende suas necessidades?', options: ['Sim, com certeza', 'Parcialmente', 'Não tenho certeza'] },
  { q: 'Você já conhecia este tipo de serviço?', options: ['Sim, já usei', 'Já ouvi falar', 'É a primeira vez'] },
]

export default function CheckoutPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { links } = useLinksStore()
  const link = slug ? links.find((l: any) => l.slug === slug) : undefined
  const [copied, setCopied] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)
  const [showPix, setShowPix] = useState(false)

  const c: any = link?.checkout

  useEffect(() => {
    if (!link) return
    const expires = link.expiration ? new Date(link.expiration).getTime() : Date.now() + 900000
    const timer = setInterval(() => {
      const left = Math.max(0, Math.floor((expires - Date.now()) / 1000))
      setTimeLeft(left)
    }, 1000)
    return () => clearInterval(timer)
  }, [link])

  if (!link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link não encontrado</h2>
          <p className="text-gray-500 text-sm">Este link de pagamento não existe ou expirou.</p>
        </div>
      </div>
    )
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleQuizAnswer = () => {
    if (quizStep < quizQuestions.length - 1) setQuizStep(quizStep + 1)
    else { setQuizDone(true); setShowQuiz(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gopay-blue flex items-center justify-center text-white text-xs font-bold">G</div>
          <span className="font-bold text-sm text-gray-900">{c?.logoText || 'GoPay'}</span>
        </div>
        <button onClick={() => navigate('/')} className="text-xs text-gray-500 font-medium">Voltar ao início</button>
      </div>

      <div className="max-w-[420px] mx-auto px-4 py-6 pb-24">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-40 rounded-2xl bg-gradient-to-br from-gopay-blue to-gopay-dark overflow-hidden mb-4"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative p-5 flex flex-col justify-center h-full">
            <p className="text-blue-200 text-xs font-medium mb-1">{c?.bannerTitle || 'Pagamento seguro via'}</p>
            <p className="text-white text-lg font-bold">{c?.bannerSubtitle || 'KryptGateway'}</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield size={14} className="text-blue-200" />
              <span className="text-blue-200 text-xs">Compra 100% protegida</span>
            </div>
          </div>
        </motion.div>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm mb-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gopay-blue to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">G</div>
            <div>
              <p className="text-xs text-gray-500">GoPay</p>
              <p className="font-bold text-gray-900">{link.description || 'Link de Pagamento'}</p>
            </div>
          </div>

          {/* Video */}
          {c?.videoUrl && (
            <div className="rounded-xl bg-gray-900 aspect-video mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <a href={c.videoUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors z-10">
                <Play size={28} className="text-white ml-1" fill="white" />
              </a>
              <p className="absolute bottom-3 left-3 text-white text-xs font-medium">Vídeo do produto</p>
            </div>
          )}

          <h1 className="text-xl font-bold text-gray-900 mb-2">{link.description || `gopay.me/${link.slug}`}</h1>
          <p className="text-3xl font-bold text-gopay-blue mb-3">{formatCurrency(link.amount)}</p>

          {/* Countdown */}
          {c?.showCountdown !== false && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-100 mb-4">
              <Clock size={16} className="text-orange-500 shrink-0" />
              <span className="text-sm text-orange-700 font-medium">Oferta expira em {formatTime(timeLeft)}</span>
            </div>
          )}

          {/* Reviews */}
          {c?.showReviews !== false && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{Array(5).fill(0).map((_, i) => <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />)}</div>
                <span className="text-sm font-semibold text-gray-900">4.8</span>
                <span className="text-xs text-gray-400">(128 avaliações)</span>
              </div>
              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {defaultReviews.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{r.name}</span>
                      <div className="flex">{Array(r.stars).fill(0).map((_, si) => <Star key={si} size={10} className="text-yellow-400" fill="currentColor" />)}</div>
                      <span className="text-[10px] text-gray-400 ml-auto">{r.time}</span>
                    </div>
                    <p className="text-xs text-gray-600">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz */}
          {c?.showQuiz !== false && !quizDone && (
            <button onClick={() => setShowQuiz(!showQuiz)} className="w-full py-2.5 text-sm text-gopay-blue font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors mb-3">
              {showQuiz ? 'Fechar perguntas' : 'Responda algumas perguntas (opcional)'}
            </button>
          )}

          <AnimatePresence>
            {showQuiz && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <p className="text-sm font-semibold text-gray-900 mb-3">{quizQuestions[quizStep].q}</p>
                  <div className="space-y-2">
                    {quizQuestions[quizStep].options.map((opt, oi) => (
                      <button key={oi} onClick={handleQuizAnswer} className="w-full text-left p-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:border-gopay-blue hover:text-gopay-blue transition-all">{opt}</button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">{quizStep + 1} de {quizQuestions.length}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {quizDone && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-green-700">Obrigado por responder!</span>
            </div>
          )}

          <button onClick={() => setShowPix(true)} className="w-full py-4 bg-gopay-blue text-white font-bold text-lg rounded-2xl shadow-[0_4px_20px_rgba(0,102,255,0.35)] hover:shadow-[0_6px_25px_rgba(0,102,255,0.45)] transition-all active:scale-[0.98] mb-3">
            Pagar via PIX
          </button>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Shield size={12} /> Seguro</span>
            <span className="flex items-center gap-1"><CheckCircle size={12} /> Rápido</span>
            <span className="flex items-center gap-1"><Copy size={12} /> Prático</span>
          </div>
        </motion.div>

        {/* PIX Modal */}
        <AnimatePresence>
          {showPix && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setShowPix(false)}>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="bg-white rounded-3xl p-6 w-full max-w-[400px] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-5">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3"><CheckCircle size={36} className="text-green-500" /></div>
                  <h2 className="text-xl font-bold text-gray-900">Pedido gerado!</h2>
                  <p className="text-sm text-gray-500">Escaneie o QR Code abaixo para pagar</p>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <QRCodeCanvas value={link.url} size={180} bgColor="#FFFFFF" fgColor="#0066FF" level="M" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(link.amount)}</p>
                  <p className="text-xs text-gray-400">via PIX</p>
                </div>
                {link.copyPaste && (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 mb-4">
                    <p className="text-[10px] text-gray-500 mb-1.5 font-medium">Código PIX (copia e cola)</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] text-gray-700 font-mono truncate flex-1">{link.copyPaste}</p>
                      <button onClick={() => { navigator.clipboard.writeText(link.copyPaste || ''); setCopied(true) }} className="shrink-0 px-3 py-1.5 bg-gopay-blue text-white text-xs font-semibold rounded-lg">{copied ? 'Copiado!' : 'Copiar'}</button>
                    </div>
                  </div>
                )}
                <button onClick={() => setShowPix(false)} className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-sm">Fechar</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-6 pb-8">
          <p className="text-[10px] text-gray-400">Pagamento processado via KryptGateway • GoPay © 2026</p>
        </div>
      </div>
    </div>
  )
}
