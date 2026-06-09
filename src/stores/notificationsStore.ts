import { create } from 'zustand'
import { supabase } from '../utils/supabase'
import type { Notification } from '../utils/types'

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  loaded: boolean
  userId: string | null
  loadNotifications: (userId: string) => Promise<void>
  addNotification: (notification: Notification) => Promise<void>
  markAllAsRead: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  clearAll: () => Promise<void>
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loaded: false,
  userId: null,

  loadNotifications: async (userId) => {
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (data) {
        const notifs = data as Notification[]
        set({
          notifications: notifs,
          unreadCount: notifs.filter((n) => !n.read).length,
          loaded: true,
          userId,
        })
      } else {
        set({ loaded: true, userId })
      }
    } catch {
      set({ loaded: true, userId })
    }
  },

  addNotification: async (notification) => {
    const { userId } = get()
    if (!userId) return
    await supabase.from('notifications').insert({ ...notification, user_id: userId })
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },

  markAllAsRead: async () => {
    const { userId } = get()
    if (userId) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false)
    }
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  markAsRead: async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  clearAll: async () => {
    const { userId } = get()
    if (userId) {
      await supabase.from('notifications').delete().eq('user_id', userId)
    }
    set({ notifications: [], unreadCount: 0 })
  },
}))
