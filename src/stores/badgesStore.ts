import { create } from 'zustand'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string | null
  progress: number
  maxProgress: number
}

interface BadgesState {
  badges: Badge[]
  isNewUnlock: boolean
  lastUnlockedBadge: Badge | null
  checkBadges: (linksCount: number, paymentsCount: number, totalReceived: number) => void
  clearNewUnlock: () => void
}

const defaultBadges: Badge[] = [
  { id: 'first_link', name: 'Primeiro Link', description: 'Crie seu primeiro link de pagamento', icon: '🔗', unlockedAt: null, progress: 0, maxProgress: 1 },
  { id: 'five_links', name: 'Criador Nato', description: 'Crie 5 links de pagamento', icon: '📎', unlockedAt: null, progress: 0, maxProgress: 5 },
  { id: 'ten_links', name: 'Profissional', description: 'Crie 10 links de pagamento', icon: '🏆', unlockedAt: null, progress: 0, maxProgress: 10 },
  { id: 'first_payment', name: 'Primeiro Recebimento', description: 'Receba seu primeiro pagamento', icon: '💰', unlockedAt: null, progress: 0, maxProgress: 1 },
  { id: 'five_payments', name: 'Negócio Roliudo', description: 'Receba 5 pagamentos', icon: '💵', unlockedAt: null, progress: 0, maxProgress: 5 },
  { id: 'ten_payments', name: 'Faturamento em Alta', description: 'Receba 10 pagamentos', icon: '📈', unlockedAt: null, progress: 0, maxProgress: 10 },
  { id: 'earn_500', name: 'Primeiros R$ 500', description: 'Acumule R$ 500 em recebimentos', icon: '🥉', unlockedAt: null, progress: 0, maxProgress: 500 },
  { id: 'earn_1000', name: 'Mil Reais', description: 'Acumule R$ 1.000 em recebimentos', icon: '🥈', unlockedAt: null, progress: 0, maxProgress: 1000 },
  { id: 'earn_5000', name: 'Cinco Mil', description: 'Acumule R$ 5.000 em recebimentos', icon: '🥇', unlockedAt: null, progress: 0, maxProgress: 5000 },
  { id: 'gateway_connected', name: 'Conectado', description: 'Conecte um gateway de pagamento', icon: '🔌', unlockedAt: null, progress: 0, maxProgress: 1 },
]

export const useBadgesStore = create<BadgesState>()((set, get) => ({
  badges: defaultBadges,
  isNewUnlock: false,
  lastUnlockedBadge: null,
  checkBadges: (linksCount, paymentsCount, totalReceived) => {
    const { badges } = get()
    let lastUnlocked: Badge | null = null
    const updated = badges.map((b) => {
      let progress = b.progress
      switch (b.id) {
        case 'first_link': progress = Math.min(1, linksCount); break
        case 'five_links': progress = Math.min(5, linksCount); break
        case 'ten_links': progress = Math.min(10, linksCount); break
        case 'first_payment': progress = Math.min(1, paymentsCount); break
        case 'five_payments': progress = Math.min(5, paymentsCount); break
        case 'ten_payments': progress = Math.min(10, paymentsCount); break
        case 'earn_500': progress = Math.min(500, totalReceived); break
        case 'earn_1000': progress = Math.min(1000, totalReceived); break
        case 'earn_5000': progress = Math.min(5000, totalReceived); break
        case 'gateway_connected': progress = Math.min(1, 1); break
      }
      const wasLocked = !b.unlockedAt
      const nowUnlocked = progress >= b.maxProgress && wasLocked
      if (nowUnlocked) {
        const badge = { ...b, progress, unlockedAt: new Date().toISOString() }
        lastUnlocked = badge
        return badge
      }
      return { ...b, progress }
    })
    set({ badges: updated, isNewUnlock: !!lastUnlocked, lastUnlockedBadge: lastUnlocked })
  },
  clearNewUnlock: () => set({ isNewUnlock: false, lastUnlockedBadge: null }),
}))
