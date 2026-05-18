// types/index.ts
export interface IdentityNode {
  id: string
  type: 'user' | 'email' | 'phone' | 'device' | 'ip' | 'document'
  label: string
  riskScore?: number
  suspicious?: boolean
  metadata?: Record<string, any>
}

export interface IdentityEdge {
  id: string
  source: string
  target: string
  label?: string
  suspicious?: boolean
}

export interface IdentityGraph {
  nodes: IdentityNode[]
  edges: IdentityEdge[]
}

export interface AgentStep {
  step: number
  message: string
  highlightNodes: string[]
  highlightEdges: string[]
}

export interface Investigation {
  id: string
  userName: string
  riskScore: number
  decision: 'APPROVE' | 'STEP_UP' | 'MANUAL_REVIEW'
  timestamp: string
  graph: IdentityGraph
  agentSteps: AgentStep[]
  finalExplanation: string[]
}

export interface RiskSummary {
  riskScore: number
  riskCategory: 'Low' | 'Medium' | 'High'
  confidence: number
}
