import { create } from 'zustand'

// type
type UIState = {
  uiHidden: boolean
  hideCenterContentOnly: boolean
  setUiHidden: (value: boolean) => void
  setHideCenterContentOnly: (value: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  uiHidden: false,
  hideCenterContentOnly: false,
  setUiHidden: (value: boolean) => set({ uiHidden: value, hideCenterContentOnly: false }),
  setHideCenterContentOnly: (value: boolean) => set({ hideCenterContentOnly: value }),
}))
