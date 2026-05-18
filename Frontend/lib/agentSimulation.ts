// lib/agentSimulation.ts
import { IdentityGraph, AgentStep, Investigation } from '@/types'

export function runAgentSimulation(
  investigation: Investigation,
  riskSensitivity: number,
  fraudIntensity: number
): { steps: AgentStep[]; finalDecision: Investigation['decision']; finalRiskScore: number; explanationBullets: string[] } {
  const graph = investigation.graph
  const suspiciousNodes = graph.nodes.filter(n => n.suspicious)
  const suspiciousEdges = graph.edges.filter(e => e.suspicious)

  let riskScore = investigation.riskScore
  // Adjust risk based on sensitivity and intensity
  riskScore = Math.min(100, riskScore + riskSensitivity * 5 + fraudIntensity * 3)

  let finalDecision: Investigation['decision'] = investigation.decision
  if (riskScore > 75) finalDecision = 'MANUAL_REVIEW'
  else if (riskScore > 45) finalDecision = 'STEP_UP'
  else finalDecision = 'APPROVE'

  const steps: AgentStep[] = []
  const explanationBullets: string[] = []

  // Step 1
  steps.push({
    step: 1,
    message: '🔍 Checking email reputation...',
    highlightNodes: graph.nodes.filter(n => n.type === 'email').map(n => n.id),
    highlightEdges: [],
  })
  const riskyEmail = graph.nodes.find(n => n.type === 'email' && n.suspicious)
  if (riskyEmail) {
    explanationBullets.push(`Email ${riskyEmail.label} appears in known breach databases.`)
  }

  // Step 2
  steps.push({
    step: 2,
    message: '📱 Analyzing device fingerprint...',
    highlightNodes: graph.nodes.filter(n => n.type === 'device').map(n => n.id),
    highlightEdges: graph.edges.filter(e => e.label === 'shared device').map(e => e.id),
  })
  if (suspiciousEdges.some(e => e.label === 'shared device')) {
    explanationBullets.push('Device linked to previously flagged accounts.')
  }

  // Step 3
  steps.push({
    step: 3,
    message: '🌐 Tracing IP addresses and geo-velocity...',
    highlightNodes: graph.nodes.filter(n => n.type === 'ip').map(n => n.id),
    highlightEdges: [],
  })

  // Step 4
  steps.push({
    step: 4,
    message: '🔗 Detecting identity clusters & fraud rings...',
    highlightNodes: suspiciousNodes.map(n => n.id),
    highlightEdges: suspiciousEdges.map(e => e.id),
  })
  if (suspiciousNodes.length > 2) {
    explanationBullets.push('Multiple suspicious signals connected in a small cluster — potential fraud ring.')
  }

  // Final step
  steps.push({
    step: 5,
    message: finalDecision === 'APPROVE' ? '✅ Low risk, approving application.' : finalDecision === 'STEP_UP' ? '⚠️ Medium risk, requesting step-up verification.' : '🚨 High risk, sending to manual review.',
    highlightNodes: [],
    highlightEdges: [],
  })

  return { steps, finalDecision, finalRiskScore: riskScore, explanationBullets }
}
