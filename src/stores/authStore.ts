import { create } from 'zustand'
import { supabase } from '../utils/supabase'
import type { User } from '../utils/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  initialized: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  initSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,

  initSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', session.user.id)
        .single()
      const name = profile?.name || session.user.email?.split('@')[0] || 'Usuário'
      set({ user: { name, email: session.user.email! }, isAuthenticated: true, initialized: true })
    } else {
      set({ initialized: true })
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', session.user.id)
          .single()
        const name = profile?.name || session.user.email?.split('@')[0] || 'Usuário'
        set({ user: { name, email: session.user.email! }, isAuthenticated: true })
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false })
      }
    })
  },

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.user) {
        set({ loading: false })
        return false
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', data.user.id)
        .single()
      const name = profile?.name || data.user.email?.split('@')[0] || 'Usuário'
      set({ user: { name, email: data.user.email! }, isAuthenticated: true, loading: false })
      return true
    } catch {
      set({ loading: false })
      return false
    }
  },

  register: async (name, email, password) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error || !data.user) {
        set({ loading: false })
        return false
      }
      await supabase.from('profiles').upsert({ id: data.user.id, name, email })
      set({ user: { name, email }, isAuthenticated: true, loading: false })
      return true
    } catch {
      set({ loading: false })
      return false
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },
}))
