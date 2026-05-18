// store/investigationStore.ts
import { create } from 'zustand'
import { Investigation, AgentStep } from '@/types'

interface InvestigationState {
  currentInvestigation: Investigation | null
  activeStepIndex: number
  isLoading: boolean
  setCurrentInvestigation: (inv: Investigation) => void
  setActiveStepIndex: (idx: number) => void
  setIsLoading: (loading: boolean) => void
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
  currentInvestigation: null,
  activeStepIndex: 0,
  isLoading: false,
  setCurrentInvestigation: (inv) => set({ currentInvestigation: inv, activeStepIndex: 0 }),
  setActiveStepIndex: (idx) => set({ activeStepIndex: idx }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
