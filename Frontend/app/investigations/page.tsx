'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Eye, Plus, Clock, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Investigation } from '@/types'

const SEED_INVESTIGATIONS: Investigation[] = [
  { id: 'inv_001', userName: 'John Doe', riskScore: 78, decision: 'MANUAL_REVIEW', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), graph: { nodes: [], edges: [] }, agentSteps: [], finalExplanation: [] },
  { id: 'inv_002', userName: 'Jane Smith', riskScore: 42, decision: 'STEP_UP', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), graph: { nodes: [], edges: [] }, agentSteps: [], finalExplanation: [] },
  { id: 'inv_003', userName: 'Alice Chen', riskScore: 23, decision: 'APPROVE', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), graph: { nodes: [], edges: [] }, agentSteps: [], finalExplanation: [] },
  { id: 'inv_004', userName: 'Bob Okafor', riskScore: 91, decision: 'MANUAL_REVIEW', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), graph: { nodes: [], edges: [] }, agentSteps: [], finalExplanation: [] },
  { id: 'inv_005', userName: 'Maria Santos', riskScore: 15, decision: 'APPROVE', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), graph: { nodes: [], edges: [] }, agentSteps: [], finalExplanation: [] },
  { id: 'inv_006', userName: 'Wei Zhang', riskScore: 55, decision: 'STEP_UP', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), graph: { nodes: [], edges: [] }, agentSteps: [], finalExplanation: [] },
  { id: 'inv_007', userName: 'Priya Patel', riskScore: 8, decision: 'APPROVE', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), graph: { nodes: [], edges: [] }, agentSteps: [], finalExplanation: [] },
  { id: 'inv_008', userName: 'Carlos Rivera', riskScore: 82, decision: 'MANUAL_REVIEW', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), graph: { nodes: [], edges: [] }, agentSteps: [], finalExplanation: [] },
]

function DecisionBadge({ decision }: { decision: Investigation['decision'] }) {
  const config = {
    APPROVE: { label: 'Approve', className: 'bg-green-500/20 text-green-400 border-green-500', icon: ShieldCheck },
    STEP_UP: { label: 'Step Up', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500', icon: AlertTriangle },
    MANUAL_REVIEW: { label: 'Manual Review', className: 'bg-red-500/20 text-red-400 border-red-500', icon: ShieldAlert },
  }[decision]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

function RiskBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-red-500' : score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-6">{score}</span>
    </div>
  )
}

export default function InvestigationsPage() {
  const router = useRouter()
  const [investigations, setInvestigations] = useState<Investigation[]>([])
  const [filter, setFilter] = useState<'ALL' | Investigation['decision']>('ALL')

  useEffect(() => {
    setInvestigations(SEED_INVESTIGATIONS)
  }, [])

  const filtered = filter === 'ALL' ? investigations : investigations.filter(i => i.decision === filter)

  const counts = {
    ALL: investigations.length,
    APPROVE: investigations.filter(i => i.decision === 'APPROVE').length,
    STEP_UP: investigations.filter(i => i.decision === 'STEP_UP').length,
    MANUAL_REVIEW: investigations.filter(i => i.decision === 'MANUAL_REVIEW').length,
  }

  const startNew = () => {
    const id = Math.random().toString(36).substring(2, 10)
    router.push(`/investigation/${id}`)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investigations</h1>
          <p className="text-muted-foreground">All KYC investigation cases</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="mr-2 h-4 w-4" /> New Investigation
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['ALL', 'APPROVE', 'STEP_UP', 'MANUAL_REVIEW'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {f === 'ALL' ? 'All' : f === 'MANUAL_REVIEW' ? 'Manual Review' : f === 'STEP_UP' ? 'Step Up' : 'Approve'}
            <span className="ml-1.5 text-xs opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base text-muted-foreground font-normal">
            {filtered.length} case{filtered.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-0">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
              <span className="col-span-3">Applicant</span>
              <span className="col-span-2">Decision</span>
              <span className="col-span-2">Risk Score</span>
              <span className="col-span-3">Timestamp</span>
              <span className="col-span-2 text-right">Action</span>
            </div>

            {filtered.map((inv) => (
              <div
                key={inv.id}
                className="grid grid-cols-12 gap-4 items-center px-3 py-3.5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-3">
                  <p className="font-medium text-sm">{inv.userName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{inv.id}</p>
                </div>
                <div className="col-span-2">
                  <DecisionBadge decision={inv.decision} />
                </div>
                <div className="col-span-2">
                  <RiskBar score={inv.riskScore} />
                </div>
                <div className="col-span-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(inv.timestamp).toLocaleString()}
                </div>
                <div className="col-span-2 flex justify-end">
                  <Link href={`/investigation/${inv.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Eye className="h-4 w-4" /> Investigate
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
