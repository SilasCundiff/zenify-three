import { create } from 'zustand'

// type
type UIState = {
  uiHidden: boolean
  setUiHidden: (value: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  uiHidden: false,
  setUiHidden: (value: boolean) => set({ uiHidden: value }),
}))
