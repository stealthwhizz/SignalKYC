// app/case/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Skeleton } from '@/components/ui/Skeleton'
import { Investigation, IdentityGraph } from '@/types'
import GraphView from '@/components/investigation/GraphView'

// Mock function to fetch case detail
const fetchCaseDetail = async (id: string): Promise<Investigation> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    id,
    userName: `Case ${id.slice(-6)}`,
    riskScore: Math.floor(Math.random() * 100),
    decision: Math.random() > 0.6 ? 'MANUAL_REVIEW' : Math.random() > 0.3 ? 'STEP_UP' : 'APPROVE',
    timestamp: new Date().toISOString(),
    graph: {
      nodes: [
        { id: 'user1', type: 'user', label: 'Applicant', riskScore: 45, suspicious: false },
        { id: 'email1', type: 'email', label: 'user@example.com', suspicious: false },
        { id: 'device1', type: 'device', label: 'iPhone 13', suspicious: true },
      ],
      edges: [
        { id: 'e1', source: 'user1', target: 'email1', label: 'uses', suspicious: false },
        { id: 'e2', source: 'user1', target: 'device1', label: 'logged from', suspicious: true },
      ],
    },
    agentSteps: [],
    finalExplanation: ['Device fingerprint shared with flagged account', 'Email domain has low reputation'],
  }
}

export default function CaseDetailPage() {
  const { id } = useParams()
  const [investigation, setInvestigation] = useState<Investigation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCaseDetail(id as string).then((data) => {
      setInvestigation(data)
      setLoading(false)
    })
  }, [id])

  if (loading || !investigation) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Case {investigation.id}</h1>
          <p className="text-muted-foreground">Applicant: {investigation.userName}</p>
        </div>
        <Badge variant={investigation.decision === 'APPROVE' ? 'default' : investigation.decision === 'STEP_UP' ? 'secondary' : 'destructive'}>
          {investigation.decision.replace('_', ' ')}
        </Badge>
      </div>

      <Tabs defaultValue="graph" className="space-y-6">
        <TabsList>
          <TabsTrigger value="graph">Identity Graph</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
        </TabsList>
        <TabsContent value="graph">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[500px] w-full">
                <GraphView graph={investigation.graph} highlightNodes={[]} highlightEdges={[]} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">2025-05-18 10:23</span>
                  <span>Identity graph created, risk scoring started</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">2025-05-18 10:23:12</span>
                  <span>Agent detected suspicious device link</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">2025-05-18 10:23:45</span>
                  <span>Final decision: {investigation.decision}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="explanation">
          <Card>
            <CardHeader>
              <CardTitle>Investigation Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {investigation.finalExplanation.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
