'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useInvestigationStore } from '@/store/investigationStore'
import { useSettingsStore } from '@/store/settingsStore'
import { mockFetchInvestigation } from '@/lib/mockData'
import { runAgentSimulation } from '@/lib/agentSimulation'
import GraphView from '@/components/investigation/GraphView'
import AgentReasoningPanel from '@/components/investigation/AgentReasoningPanel'
import RiskSummaryCard from '@/components/investigation/RiskSummaryCard'
import DecisionOutputPanel from '@/components/investigation/DecisionOutputPanel'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function InvestigationPage() {
  const { id } = useParams()
  const { currentInvestigation, setCurrentInvestigation, activeStepIndex, setActiveStepIndex, isLoading, setIsLoading } =
    useInvestigationStore()
  const { riskSensitivity, fraudIntensity, simulationSpeed } = useSettingsStore()
  const [simulatedSteps, setSimulatedSteps] = useState<any[]>([])
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const loadInvestigation = async () => {
      setIsLoading(true)
      const inv = mockFetchInvestigation(id as string)
      const { steps, finalDecision, finalRiskScore, explanationBullets } = runAgentSimulation(
        inv,
        riskSensitivity,
        fraudIntensity
      )
      const finalInv = {
        ...inv,
        agentSteps: steps,
        decision: finalDecision,
        riskScore: finalRiskScore,
        finalExplanation: explanationBullets,
      }
      setCurrentInvestigation(finalInv)
      setSimulatedSteps(steps)
      setIsLoading(false)
    }
    loadInvestigation()
  }, [id, riskSensitivity, fraudIntensity])

  // auto-play steps
  useEffect(() => {
    if (!currentInvestigation || isLoading) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    let step = 0
    intervalRef.current = setInterval(() => {
      if (step < currentInvestigation.agentSteps.length - 1) {
        step++
        setActiveStepIndex(step)
      } else {
        clearInterval(intervalRef.current)
      }
    }, simulationSpeed)
    return () => clearInterval(intervalRef.current)
  }, [currentInvestigation, isLoading, simulationSpeed])

  if (isLoading || !currentInvestigation) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    )
  }

  const currentStep = currentInvestigation.agentSteps[activeStepIndex] || currentInvestigation.agentSteps[0]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Investigation: {currentInvestigation.userName}</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Graph View */}
        <div className="col-span-7 bg-card rounded-xl border p-2 shadow-lg">
          <GraphView
            graph={currentInvestigation.graph}
            highlightNodes={currentStep.highlightNodes}
            highlightEdges={currentStep.highlightEdges}
          />
        </div>

        {/* Right panel: reasoning and risk */}
        <div className="col-span-5 space-y-6">
          <AgentReasoningPanel steps={currentInvestigation.agentSteps} currentStepIndex={activeStepIndex} />
          <RiskSummaryCard riskScore={currentInvestigation.riskScore} />
          <DecisionOutputPanel
            decision={currentInvestigation.decision}
            explanation={currentInvestigation.finalExplanation}
          />
        </div>
      </div>
    </div>
  )
}
