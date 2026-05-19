// Jac backend API client — handles auth + walker calls

const JAC_BASE = process.env.NEXT_PUBLIC_JAC_URL ?? 'http://localhost:8000'
const JAC_USER = 'signalkyc_demo'
const JAC_PASS = 'signalkyc_demo_2026'

let cachedToken: string | null = null

const AUTH_BODY = {
  identity: { type: 'username', value: JAC_USER },
  credential: { type: 'password', password: JAC_PASS },
}
const REGISTER_BODY = {
  identities: [{ type: 'username', value: JAC_USER }],
  credential: { type: 'password', password: JAC_PASS },
}

async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken

  // Try login first
  const loginRes = await fetch(`${JAC_BASE}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(AUTH_BODY),
  })

  if (loginRes.ok) {
    const data = await loginRes.json()
    cachedToken = data?.data?.token ?? null
    if (cachedToken) return cachedToken
  }

  // Login failed — register then login
  await fetch(`${JAC_BASE}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(REGISTER_BODY),
  })

  const loginRes2 = await fetch(`${JAC_BASE}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(AUTH_BODY),
  })

  const data2 = await loginRes2.json()
  cachedToken = data2?.data?.token ?? null
  if (!cachedToken) throw new Error('Could not authenticate with Jac backend')
  return cachedToken
}

async function callWalker<T>(walkerName: string, fields: Record<string, unknown> = {}): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${JAC_BASE}/walker/${walkerName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  })

  if (!res.ok) {
    // Token may have expired — clear and retry once
    if (res.status === 401) {
      cachedToken = null
      return callWalker(walkerName, fields)
    }
    throw new Error(`Walker ${walkerName} failed: ${res.status}`)
  }

  const json = await res.json()
  // Jac response shape: { ok, data: { reports: [...] } }
  return (json?.data?.reports?.[0] ?? json?.reports?.[0] ?? json?.data ?? json) as T
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface InvestigateInput {
  user_id: string
  email: string
  phone: string
  device_fp: string
  ip: string
}

export interface InvestigateResult {
  userId: string
  riskScore: number
  decision: 'APPROVE' | 'STEP_UP' | 'MANUAL_REVIEW'
  confidence: number
  reasoningSteps: string[]
  fraudSignals: string[]
  graph: {
    nodes: { id: string; type: string; label: string; suspicious: boolean; riskScore?: number }[]
    edges: { id: string; source: string; target: string; label: string; suspicious: boolean }[]
  }
}

export async function investigateSignup(input: InvestigateInput): Promise<InvestigateResult> {
  return callWalker<InvestigateResult>('investigate_signup', input)
}

export async function isBackendAlive(): Promise<boolean> {
  try {
    const res = await fetch(`${JAC_BASE}/`, { signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}
