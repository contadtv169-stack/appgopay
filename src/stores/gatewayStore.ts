import { create } from 'zustand'
import { supabase } from '../utils/supabase'
import type { BalanceData } from '../utils/types'

interface GatewayState {
  connectedGateway: 'krypt' | 'abacate' | null
  credentials: Record<string, string> | null
  balance: BalanceData | null
  loaded: boolean
  userId: string | null
  fetchBalance: () => Promise<void>
  loadGateway: (userId: string) => Promise<void>
  connect: (gateway: 'krypt' | 'abacate', credentials: Record<string, string>) => Promise<void>
  disconnect: () => Promise<void>
}

export const useGatewayStore = create<GatewayState>()((set, get) => ({
  connectedGateway: null,
  credentials: null,
  balance: null,
  loaded: false,
  userId: null,

  loadGateway: async (userId) => {
    try {
      const { data } = await supabase
        .from('gateway_connections')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (data) {
        set({
          connectedGateway: data.gateway as 'krypt' | 'abacate',
          credentials: data.credentials,
          userId,
          loaded: true,
        })
        get().fetchBalance()
      } else {
        set({ loaded: true, userId })
      }
    } catch {
      set({ loaded: true, userId })
    }
  },

  fetchBalance: async () => {
    const { connectedGateway, credentials } = get()
    if (!connectedGateway || !credentials) return
    try {
      if (connectedGateway === 'krypt') {
        const res = await fetch('https://kryptgateway.netlify.app/api/gateway/balance', {
          headers: { ...credentials, 'Content-Type': 'application/json' },
        })
        if (res.ok) {
          const data = await res.json()
          set({ balance: data.data })
        }
      }
    } catch {}
  },

  connect: async (gateway, credentials) => {
    const { userId } = get()
    if (!userId) return
    set({ connectedGateway: gateway, credentials })
    await supabase.from('gateway_connections').upsert({
      user_id: userId,
      gateway,
      credentials,
    })
    get().fetchBalance()
  },

  disconnect: async () => {
    const { userId } = get()
    if (userId) {
      await supabase.from('gateway_connections').delete().eq('user_id', userId)
    }
    set({ connectedGateway: null, credentials: null, balance: null })
  },
}))
