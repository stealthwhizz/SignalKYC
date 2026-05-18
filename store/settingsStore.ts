// store/settingsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  riskSensitivity: number // 0-100
  fraudIntensity: number // 0-100
  simulationSpeed: number // ms per step, 500-3000
}

interface SettingsState extends Settings {
  setRiskSensitivity: (val: number) => void
  setFraudIntensity: (val: number) => void
  setSimulationSpeed: (val: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      riskSensitivity: 50,
      fraudIntensity: 50,
      simulationSpeed: 1200,
      setRiskSensitivity: (val) => set({ riskSensitivity: val }),
      setFraudIntensity: (val) => set({ fraudIntensity: val }),
      setSimulationSpeed: (val) => set({ simulationSpeed: val }),
    }),
    { name: 'signal-kyc-settings' }
  )
)
