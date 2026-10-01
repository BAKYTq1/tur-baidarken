import { create } from 'zustand'
import { fetchHealth } from '../../shared/api/health'

export const useAppStore = create((set) => ({
  appName: 'Baidarken',
  loading: false,
  error: null,
  backendStatus: null,

  loadBackendStatus: async () => {
    set({ loading: true, error: null })

    try {
      const response = await fetchHealth()
      set({ backendStatus: response.data, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || error.message || 'Ошибка подключения к серверу',
      })
    }
  },

  clearError: () => set({ error: null }),
}))
