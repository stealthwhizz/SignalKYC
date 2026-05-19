// app/settings/page.tsx
'use client'

import { useSettingsStore } from '@/store/settingsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Slider } from '@/components/ui/Slider'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  const { riskSensitivity, fraudIntensity, simulationSpeed, setRiskSensitivity, setFraudIntensity, setSimulationSpeed } = useSettingsStore()

  const handleSave = () => {
    // Settings are persisted automatically via Zustand persist middleware
    alert('Settings saved')
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulation Controls</h1>
        <p className="text-muted-foreground">Adjust agent behavior and fraud scenario intensity.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Sensitivity</CardTitle>
          <CardDescription>Higher values make the agent more likely to flag suspicious patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={[riskSensitivity]}
              onValueChange={(val) => setRiskSensitivity(val[0])}
              min={0}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>{riskSensitivity}</span>
              <span>Aggressive</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Intensity</CardTitle>
          <CardDescription>Simulates more fraud rings, device reuse, and suspicious clusters.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={[fraudIntensity]}
              onValueChange={(val) => setFraudIntensity(val[0])}
              min={0}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Clean</span>
              <span>{fraudIntensity}</span>
              <span>Heavy Fraud</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulation Speed</CardTitle>
          <CardDescription>Controls how fast the agent reasoning steps animate.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={[simulationSpeed]}
              onValueChange={(val) => setSimulationSpeed(val[0])}
              min={500}
              max={3000}
              step={100}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fast (500ms)</span>
              <span>{simulationSpeed} ms</span>
              <span>Slow (3000ms)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save & Apply</Button>
    </div>
  )
}
