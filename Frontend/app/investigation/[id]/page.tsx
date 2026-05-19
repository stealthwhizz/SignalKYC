'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useInvestigationStore } from '@/store/investigationStore'
import { useSettingsStore } from '@/store/settingsStore'
import { mockFetchInvestigation } from '@/lib/mockData'
import { runAgentSimulation } from '@/lib/agentSimulation'
import { investigateSignup, isBackendAlive, InvestigateResult } from '@/lib/api'
import GraphView from '@/components/investigation/GraphView'
import AgentReasoningPanel from '@/components/investigation/AgentReasoningPanel'
import RiskSummaryCard from '@/components/investigation/RiskSummaryCard'
import DecisionOutputPanel from '@/components/investigation/DecisionOutputPanel'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react'
import Link from 'next/link'
import { Investigation, AgentStep } from '@/types'

// Known demo cases that map to realistic inputs
const DEMO_CASES: Record<string, { email: string; phone: string; device_fp: string; ip: string }> = {
  inv_001: { email: 'john.doe@gmail.com', phone: '+14155551234', device_fp: 'fp_iphone13_abc', ip: '203.0.113.1' },
  inv_002: { email: 'jsmith@tempmail.com', phone: '+14155559999', device_fp: 'fp_clean_device', ip: '198.51.100.1' },
  inv_003: { email: 'alice.chen@company.com', phone: '+14155550001', device_fp: 'fp_macbook_xyz', ip: '192.168.1.1' },
  inv_004: { email: 'bob99@darkweb.com', phone: '+15550000001', device_fp: 'fp_bad_emulator_xyz', ip: '45.33.22.100' },
  inv_005: { email: 'maria.santos@outlook.com', phone: '+14155552222', device_fp: 'fp_android_clean', ip: '10.0.0.1' },
  inv_006: { email: 'wei.zhang@fraudmail.com', phone: '+14155553333', device_fp: 'fp_farm_001', ip: '45.33.22.50' },
  inv_007: { email: 'priya.patel@yahoo.com', phone: '+14155554444', device_fp: 'fp_ipad_pro', ip: '172.16.0.1' },
  inv_008: { email: 'carlos99@throwaway.com', phone: '+14155555555', device_fp: 'fp_bad_emulator_xyz', ip: '45.33.22.200' },
}

function buildStepsFromResult(result: InvestigateResult): AgentStep[] {
  return result.reasoningSteps.map((msg, i) => ({
    step: i + 1,
    message: msg,
    highlightNodes: i === result.reasoningSteps.length - 1 ? result.graph.nodes.filter(n => n.suspicious).map(n => n.id) : [],
    highlightEdges: i === result.reasoningSteps.length - 1 ? result.graph.edges.filter(e => e.suspicious).map(e => e.id) : [],
  }))
}

export default function InvestigationPage() {
  const { id } = useParams()
  const { currentInvestigation, setCurrentInvestigation, activeStepIndex, setActiveStepIndex, isLoading, setIsLoading } =
    useInvestigationStore()
  const { riskSensitivity, fraudIntensity, simulationSpeed } = useSettingsStore()
  const intervalRef = useRef<NodeJS.Timeout>()
  const [usingLiveBackend, setUsingLiveBackend] = useState<boolean | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setActiveStepIndex(0)
      const caseId = id as string

      const backendAlive = await isBackendAlive()
      setUsingLiveBackend(backendAlive)

      let finalInv: Investigation

      if (backendAlive) {
        // ── Live Jac backend path ──────────────────────────────────────────
        const demoInputs = DEMO_CASES[caseId] ?? {
          email: `user_${caseId}@example.com`,
          phone: '+14155550000',
          device_fp: `fp_device_${caseId}`,
          ip: '203.0.113.10',
        }
        try {
          const result = await investigateSignup({ user_id: caseId, ...demoInputs })
          const steps = buildStepsFromResult(result)
          finalInv = {
            id: caseId,
            userName: demoInputs.email.split('@')[0],
            riskScore: result.riskScore,
            decision: result.decision,
            timestamp: new Date().toISOString(),
            graph: result.graph,
            agentSteps: steps,
            finalExplanation: result.fraudSignals.length > 0
              ? result.fraudSignals.map(s => s.replace(/_/g, ' '))
              : ['No suspicious signals detected — graph is clean'],
          }
        } catch (err) {
          console.warn('Backend call failed, falling back to mock:', err)
          finalInv = buildMock(caseId, riskSensitivity, fraudIntensity)
        }
      } else {
        // ── Mock fallback path ────────────────────────────────────────────
        finalInv = buildMock(caseId, riskSensitivity, fraudIntensity)
      }

      setCurrentInvestigation(finalInv)
      setIsLoading(false)
    }
    load()
  }, [id, riskSensitivity, fraudIntensity])

  // Auto-play reasoning steps
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

  const currentStep = currentInvestigation.agentSteps[activeStepIndex] ?? currentInvestigation.agentSteps[0]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Investigation: {currentInvestigation.userName}</h1>
        {usingLiveBackend !== null && (
          <span className={`ml-auto flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${
            usingLiveBackend
              ? 'border-green-500 text-green-400 bg-green-500/10'
              : 'border-yellow-500 text-yellow-400 bg-yellow-500/10'
          }`}>
            {usingLiveBackend ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {usingLiveBackend ? 'Live Jac backend' : 'Mock mode'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 bg-card rounded-xl border p-2 shadow-lg">
          <GraphView
            graph={currentInvestigation.graph}
            highlightNodes={currentStep?.highlightNodes ?? []}
            highlightEdges={currentStep?.highlightEdges ?? []}
          />
        </div>
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

function buildMock(caseId: string, riskSensitivity: number, fraudIntensity: number): Investigation {
  const inv = mockFetchInvestigation(caseId)
  const { steps, finalDecision, finalRiskScore, explanationBullets } = runAgentSimulation(inv, riskSensitivity, fraudIntensity)
  return { ...inv, agentSteps: steps, decision: finalDecision, riskScore: finalRiskScore, finalExplanation: explanationBullets }
}
