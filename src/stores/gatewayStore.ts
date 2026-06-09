import { create } from 'zustand'
import { supabase } from '../utils/supabase'
import type { BalanceData, GatewayType } from '../utils/types'
import { getKeyType } from '../utils/pix'

interface GatewayState {
  connectedGateway: GatewayType | null
  credentials: Record<string, string> | null
  balance: BalanceData | null
  loaded: boolean
  userId: string | null
  mode: 'api' | 'offline' | null
  fetchBalance: () => Promise<void>
  loadGateway: (userId: string) => Promise<void>
  connect: (gateway: GatewayType, credentials: Record<string, string>) => Promise<{success: boolean; error?: string}>
  disconnect: () => Promise<void>
}

export const useGatewayStore = create<GatewayState>()((set, get) => ({
  connectedGateway: null,
  credentials: null,
  balance: null,
  loaded: false,
  userId: null,
  mode: null,

  loadGateway: async (userId) => {
    try {
      const { data } = await supabase
        .from('gateway_connections')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (data) {
        set({
          connectedGateway: data.gateway as GatewayType,
          credentials: data.credentials,
          mode: data.mode || (data.gateway === 'pixkey' ? 'offline' : 'api'),
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
    if (!userId) return { success: false, error: 'Usuário não autenticado' }

    // PixGo test
    if (gateway === 'pixgo') {
      try {
        const res = await fetch('https://pixgo.org/api/v1/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': credentials.apiKey },
          body: JSON.stringify({ amount: 10.00, description: 'Teste GoPay', external_id: 'gopay_test_' + Date.now() })
        })
        const text = await res.text()
        let json
        try { json = JSON.parse(text) } catch { json = { success: false, message: text } }
        if (!json.success) return { success: false, error: json.message || json.error || 'API Key PixGo inválida' }
      } catch (e: any) {
        return { success: false, error: 'Erro de conexão PixGo (CORS pode bloquear). Tente modo offline.' }
      }
    }

    // pixkey - local PIX generation, no test needed
    if (gateway === 'pixkey') {
      const kt = getKeyType(credentials.pixKey)
      if (kt === 'invalid') return { success: false, error: 'Chave PIX inválida. Use CPF, email ou telefone.' }
    }

    const mode = gateway === 'pixkey' ? 'offline' : 'api'
    set({ connectedGateway: gateway, credentials, mode })
    await supabase.from('gateway_connections').upsert({
      user_id: userId,
      gateway,
      credentials,
      mode,
    })
    get().fetchBalance()
    return { success: true }
  },

  disconnect: async () => {
    const { userId } = get()
    if (userId) {
      await supabase.from('gateway_connections').delete().eq('user_id', userId)
    }
    set({ connectedGateway: null, credentials: null, balance: null, mode: null })
  },
}))
