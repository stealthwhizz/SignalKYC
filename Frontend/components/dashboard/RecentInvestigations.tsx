// components/dashboard/RecentInvestigations.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Eye, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Investigation } from '@/types'

// Mock recent investigations
const mockRecentInvestigations: Investigation[] = [
  {
    id: 'inv_001',
    userName: 'John Doe',
    riskScore: 78,
    decision: 'MANUAL_REVIEW',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    graph: { nodes: [], edges: [] },
    agentSteps: [],
    finalExplanation: [],
  },
  {
    id: 'inv_002',
    userName: 'Jane Smith',
    riskScore: 42,
    decision: 'STEP_UP',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    graph: { nodes: [], edges: [] },
    agentSteps: [],
    finalExplanation: [],
  },
  {
    id: 'inv_003',
    userName: 'Alice Chen',
    riskScore: 23,
    decision: 'APPROVE',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    graph: { nodes: [], edges: [] },
    agentSteps: [],
    finalExplanation: [],
  },
]

function getDecisionColor(decision: string) {
  switch (decision) {
    case 'APPROVE':
      return 'bg-green-500/20 text-green-400 border-green-500'
    case 'STEP_UP':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
    case 'MANUAL_REVIEW':
      return 'bg-red-500/20 text-red-400 border-red-500'
    default:
      return ''
  }
}

export default function RecentInvestigations() {
  const [investigations, setInvestigations] = useState<Investigation[]>([])

  useEffect(() => {
    setInvestigations(mockRecentInvestigations)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Investigations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investigations.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
              <div>
                <p className="font-medium">{inv.userName}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(inv.timestamp).toLocaleString()}
                  </span>
                  <span>Risk: {inv.riskScore}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getDecisionColor(inv.decision)}>
                  {inv.decision.replace('_', ' ')}
                </Badge>
                <Link href={`/investigation/${inv.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
