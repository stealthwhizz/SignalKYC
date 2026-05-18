// lib/mockData.ts
import { IdentityGraph, Investigation, AgentStep } from '@/types'

const generateRandomId = () => Math.random().toString(36).substring(2, 10)

const randomSuspicion = () => Math.random() > 0.7

export function generateGraphForInvestigation(): IdentityGraph {
  const userId = `user_${generateRandomId()}`
  const email = `email_${generateRandomId()}@example.com`
  const phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
  const device = `device_fp_${generateRandomId()}`
  const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

  const nodes = [
    { id: userId, type: 'user' as const, label: 'Current Applicant', riskScore: Math.random() * 100, suspicious: randomSuspicion() },
    { id: email, type: 'email' as const, label: email, suspicious: randomSuspicion() },
    { id: phone, type: 'phone' as const, label: phone, suspicious: randomSuspicion() },
    { id: device, type: 'device' as const, label: `Device ${device.slice(-6)}`, suspicious: randomSuspicion() },
    { id: ip, type: 'ip' as const, label: ip, suspicious: randomSuspicion() },
  ]

  const extraFraudNodes = randomSuspicion()
    ? [
        { id: `linked_user_${generateRandomId()}`, type: 'user' as const, label: 'Linked Suspicious Account', riskScore: 85, suspicious: true },
        { id: `fraud_email_${generateRandomId()}`, type: 'email' as const, label: 'fraud@darkweb.net', suspicious: true },
      ]
    : []

  const allNodes = [...nodes, ...extraFraudNodes]

  const edges = [
    { id: `e1_${userId}`, source: userId, target: email, label: 'uses', suspicious: nodes.find(n => n.id === email)?.suspicious },
    { id: `e2_${userId}`, source: userId, target: phone, label: 'uses', suspicious: nodes.find(n => n.id === phone)?.suspicious },
    { id: `e3_${userId}`, source: userId, target: device, label: 'logged from', suspicious: nodes.find(n => n.id === device)?.suspicious },
    { id: `e4_${userId}`, source: userId, target: ip, label: 'request from', suspicious: nodes.find(n => n.id === ip)?.suspicious },
  ]

  if (extraFraudNodes.length > 0) {
    edges.push({
      id: `e5_extra`,
      source: extraFraudNodes[0].id,
      target: device,
      label: 'shared device',
      suspicious: true,
    })
    edges.push({
      id: `e6_extra`,
      source: extraFraudNodes[0].id,
      target: extraFraudNodes[1].id,
      label: 'linked email',
      suspicious: true,
    })
  }

  return { nodes: allNodes, edges }
}

export function mockFetchInvestigation(id: string): Investigation {
  const graph = generateGraphForInvestigation()
  const riskScore = Math.floor(Math.random() * 100)
  let decision: 'APPROVE' | 'STEP_UP' | 'MANUAL_REVIEW' = 'APPROVE'
  if (riskScore > 70) decision = 'MANUAL_REVIEW'
  else if (riskScore > 40) decision = 'STEP_UP'
  else decision = 'APPROVE'

  // dummy agent steps - will be overridden by simulation engine, but placeholder
  const agentSteps: AgentStep[] = [
    { step: 1, message: 'Initializing identity graph...', highlightNodes: [], highlightEdges: [] },
  ]

  return {
    id,
    userName: `Applicant_${id.slice(-4)}`,
    riskScore,
    decision,
    timestamp: new Date().toISOString(),
    graph,
    agentSteps,
    finalExplanation: [],
  }
}
