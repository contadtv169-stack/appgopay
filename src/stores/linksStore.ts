import { create } from 'zustand'
import { supabase } from '../utils/supabase'
import type { Link } from '../utils/types'

interface LinksState {
  links: Link[]
  loaded: boolean
  userId: string | null
  loadLinks: (userId: string) => Promise<void>
  createLink: (link: Link) => Promise<void>
  updateLink: (id: string, data: Partial<Link>) => Promise<void>
  deleteLink: (id: string) => Promise<void>
  getLink: (id: string) => Link | undefined
}

export const useLinksStore = create<LinksState>()((set, get) => ({
  links: [],
  loaded: false,
  userId: null,

  loadLinks: async (userId) => {
    try {
      const { data } = await supabase
        .from('payment_links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (data) {
        set({ links: data as Link[], loaded: true, userId })
      } else {
        set({ loaded: true, userId })
      }
    } catch {
      set({ loaded: true, userId })
    }
  },

  createLink: async (link) => {
    const { userId } = get()
    if (!userId) return
    const { error } = await supabase.from('payment_links').insert({
      ...link,
      user_id: userId,
    })
    if (!error) {
      set((state) => ({ links: [link, ...state.links] }))
    }
  },

  updateLink: async (id, data) => {
    await supabase.from('payment_links').update(data).eq('id', id)
    set((state) => ({
      links: state.links.map((l) => (l.id === id ? { ...l, ...data } : l)),
    }))
  },

  deleteLink: async (id) => {
    await supabase.from('payment_links').delete().eq('id', id)
    set((state) => ({
      links: state.links.filter((l) => l.id !== id),
    }))
  },

  getLink: (id) => {
    return get().links.find((l) => l.id === id)
  },
}))
