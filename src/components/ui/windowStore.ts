import { create } from 'zustand'

export type WindowId =
  | 'article'
  | 'audiobooks'
  | 'credits'
  | 'laptop'
  | 'media'
  | 'plants'

type WindowState = {
  open: Record<WindowId, boolean>
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  toggleWindow: (id: WindowId) => void
  closeAll: () => void
}

const initialOpen: Record<WindowId, boolean> = {
  article: false,
  audiobooks: false,
  credits: false,
  laptop: false,
  media: false,
  plants: false,
}

export const useWindowStore = create<WindowState>((set) => ({
  open: initialOpen,
  openWindow: (id) => set((s) => ({ open: { ...s.open, [id]: true } })),
  closeWindow: (id) => set((s) => ({ open: { ...s.open, [id]: false } })),
  toggleWindow: (id) =>
    set((s) => ({ open: { ...s.open, [id]: !s.open[id] } })),
  closeAll: () => set({ open: initialOpen }),
}))
