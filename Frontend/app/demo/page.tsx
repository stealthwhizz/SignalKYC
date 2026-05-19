'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { investigateSignup, InvestigateResult } from '@/lib/api'
import { ArrowLeft, ArrowRight, Play, RotateCcw, CheckCircle2, ShieldAlert, AlertTriangle, Zap, User, Mail, Phone, Cpu, Globe, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ── The suspicious demo case ──────────────────────────────────────────────────
const DEMO_INPUT = {
  user_id: 'demo_marcus_webb',
  email: 'marcus99@darkweb.com',
  phone: '+15550000001',
  device_fp: 'fp_bad_emulator_xyz',
  ip: '45.33.22.100',
}

const APPLICANT = {
  name: 'Marcus Webb',
  dob: '1991-04-14',
  document: 'Passport · GBR · Expires 2028',
  session: 'Mobile Safari · 3 tabs · 14s form fill',
}

// ── Signal rows shown in stage 1 ─────────────────────────────────────────────
const SIGNALS = [
  { icon: User, label: 'Name', value: APPLICANT.name, status: 'ok' },
  { icon: Mail, label: 'Email', value: DEMO_INPUT.email, status: 'warn', note: 'darkweb.com domain' },
  { icon: Phone, label: 'Phone', value: DEMO_INPUT.phone, status: 'warn', note: 'seen in prior case' },
  { icon: Cpu, label: 'Device', value: DEMO_INPUT.device_fp, status: 'bad', note: 'matches 2 accounts' },
  { icon: Globe, label: 'IP', value: DEMO_INPUT.ip, status: 'bad', note: 'high-risk ASN' },
  { icon: FileText, label: 'Document', value: APPLICANT.document, status: 'ok' },
]

// ── Graph for stage 2 ─────────────────────────────────────────────────────────
const GRAPH_NODES = [
  { id: 'user', x: 240, y: 130, type: 'user', label: 'Marcus Webb', sus: true, color: '#6366F1' },
  { id: 'email', x: 100, y: 50, type: 'email', label: 'darkweb.com', sus: true, color: '#EF4444' },
  { id: 'phone', x: 380, y: 50, type: 'phone', label: '+1 555 000 0001', sus: true, color: '#EF4444' },
  { id: 'device', x: 80, y: 210, type: 'device', label: 'fp_emulator_xyz', sus: true, color: '#EF4444' },
  { id: 'ip', x: 400, y: 210, type: 'ip', label: '45.33.22.100', sus: true, color: '#EF4444' },
  { id: 'linked1', x: 170, y: 265, type: 'user', label: 'Prior acct #1', sus: true, color: '#F97316' },
  { id: 'linked2', x: 310, y: 265, type: 'user', label: 'Prior acct #2', sus: true, color: '#F97316' },
  { id: 'flagged', x: 380, y: 140, type: 'user', label: 'Flagged case', sus: true, color: '#EF4444' },
]
const GRAPH_EDGES = [
  { from: 'user', to: 'email', sus: true, label: 'uses' },
  { from: 'user', to: 'phone', sus: true, label: 'uses' },
  { from: 'user', to: 'device', sus: true, label: 'device' },
  { from: 'user', to: 'ip', sus: true, label: 'from' },
  { from: 'device', to: 'linked1', sus: true, label: 'shared' },
  { from: 'device', to: 'linked2', sus: true, label: 'shared' },
  { from: 'phone', to: 'flagged', sus: true, label: 'linked' },
]

// ── Investigation log lines (stage 3) ─────────────────────────────────────────
const LOG_LINES = [
  { delay: 0, text: 'Opening case for applicant: demo_marcus_webb', type: 'info' },
  { delay: 400, text: 'Ingesting signals: email, phone, device, IP...', type: 'info' },
  { delay: 900, text: 'Building identity graph...', type: 'info' },
  { delay: 1400, text: '⚠  Email domain "darkweb.com" flagged as high-risk', type: 'warn' },
  { delay: 1900, text: '⚠  Device fp_bad_emulator_xyz matches 2 prior accounts', type: 'warn' },
  { delay: 2400, text: '⚠  IP 45.33.22.100 linked to known proxy ASN', type: 'warn' },
  { delay: 2900, text: '⚠  Phone +15550000001 appears in flagged case inv_0038', type: 'warn' },
  { delay: 3400, text: 'Checking fraud cluster membership...', type: 'info' },
  { delay: 3800, text: '✗  Device is member of cluster: device_farm_ring_001', type: 'bad' },
  { delay: 4200, text: 'Computing risk score from 4 active signals...', type: 'info' },
  { delay: 4600, text: 'Risk score: 94 / 100 · Confidence: 92%', type: 'result' },
  { delay: 5000, text: 'Decision threshold exceeded → MANUAL_REVIEW', type: 'decision' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function getNodePos(id: string) {
  return GRAPH_NODES.find(n => n.id === id) ?? { x: 0, y: 0 }
}

const STATUS_COLORS = { ok: '#22C55E', warn: '#EAB308', bad: '#EF4444' }
const LOG_COLORS = { info: '#71717A', warn: '#EAB308', bad: '#EF4444', result: '#818CF8', decision: '#EF4444' }

// ── Stage components ──────────────────────────────────────────────────────────

function Stage0Idle({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ width: 56, height: 56, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Zap size={24} color="#6366F1" />
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: '#FAFAFA', marginBottom: 12, letterSpacing: '-0.02em' }}>
        Live investigation demo
      </h2>
      <p style={{ fontSize: 16, color: '#71717A', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
        A suspicious signup just arrived. Walk through SignalKYC's full investigation — from raw signals to decision — in under 30 seconds.
      </p>
      <div style={{ background: '#111113', border: '1px solid #27272A', borderRadius: 12, padding: '20px 24px', maxWidth: 400, margin: '0 auto 40px', textAlign: 'left' }}>
        <p style={{ fontSize: 12, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Incoming application</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#71717A' }}>Applicant</span>
            <span style={{ fontSize: 13, color: '#FAFAFA', fontWeight: 500 }}>Marcus Webb</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#71717A' }}>Email</span>
            <span style={{ fontSize: 13, color: '#EF4444', fontFamily: 'monospace' }}>marcus99@darkweb.com</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#71717A' }}>Device</span>
            <span style={{ fontSize: 13, color: '#EF4444', fontFamily: 'monospace' }}>fp_emulator_xyz</span>
          </div>
        </div>
      </div>
      <button onClick={onStart} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#6366F1', color: 'white', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#4F46E5'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#6366F1'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}>
        <Play size={16} fill="white" /> Start investigation
      </button>
    </div>
  )
}

function Stage1Signals() {
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    if (visible < SIGNALS.length) {
      const t = setTimeout(() => setVisible(v => v + 1), 250)
      return () => clearTimeout(t)
    }
  }, [visible])

  return (
    <div>
      <StageHeader step={1} title="Application received" sub="Signals extracted from the incoming signup" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SIGNALS.slice(0, visible).map((s, i) => {
          const Icon = s.icon
          const color = STATUS_COLORS[s.status as keyof typeof STATUS_COLORS]
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#111113', border: `1px solid ${s.status !== 'ok' ? color + '30' : '#27272A'}`, borderRadius: 10, padding: '12px 16px' }}>
              <Icon size={15} color={color} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#52525B', minWidth: 60, fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 13, color: '#A1A1AA', fontFamily: 'monospace', flex: 1 }}>{s.value}</span>
              {s.note && (
                <span style={{ fontSize: 11, color, background: `${color}15`, border: `1px solid ${color}30`, padding: '2px 8px', borderRadius: 5, fontWeight: 600, flexShrink: 0 }}>
                  {s.note}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function Stage2Graph() {
  const [visibleNodes, setVisibleNodes] = useState(1)
  const [visibleEdges, setVisibleEdges] = useState(0)

  useEffect(() => {
    if (visibleNodes < GRAPH_NODES.length) {
      const t = setTimeout(() => setVisibleNodes(v => v + 1), 280)
      return () => clearTimeout(t)
    }
  }, [visibleNodes])

  useEffect(() => {
    if (visibleNodes >= 5 && visibleEdges < GRAPH_EDGES.length) {
      const t = setTimeout(() => setVisibleEdges(v => v + 1), 220)
      return () => clearTimeout(t)
    }
  }, [visibleEdges, visibleNodes])

  return (
    <div>
      <StageHeader step={2} title="Identity graph built" sub="Signals linked to prior entities in the graph" />
      <div style={{ background: '#0A0A0B', border: '1px solid #1C1C1F', borderRadius: 12, overflow: 'hidden' }}>
        <svg width="100%" viewBox="0 0 480 310" style={{ display: 'block' }}>
          {/* Edges */}
          {GRAPH_EDGES.slice(0, visibleEdges).map((e, i) => {
            const from = getNodePos(e.from)
            const to = getNodePos(e.to)
            return (
              <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="rgba(239,68,68,0.35)" strokeWidth={1.5} strokeDasharray="4 3"
                style={{ transition: 'all 0.3s' }} />
            )
          })}
          {/* Nodes */}
          {GRAPH_NODES.slice(0, visibleNodes).map((n, i) => (
            <g key={n.id} style={{ transition: 'all 0.3s' }}>
              {n.sus && <circle cx={n.x} cy={n.y} r={30} fill="none" stroke={`${n.color}20`} strokeWidth={1} strokeDasharray="3 3" />}
              <circle cx={n.x} cy={n.y} r={20} fill={`${n.color}15`} stroke={n.color} strokeWidth={n.sus ? 2 : 1.5} />
              <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={n.color} fontWeight="700" fontFamily="monospace">
                {n.type[0].toUpperCase()}
              </text>
              <text x={n.x} y={n.y + 32} textAnchor="middle" fontSize={9} fill="#71717A">
                {n.label.length > 14 ? n.label.slice(0, 12) + '…' : n.label}
              </text>
            </g>
          ))}
        </svg>
        <div style={{ borderTop: '1px solid #1C1C1F', padding: '10px 16px', display: 'flex', gap: 20 }}>
          {[['Nodes', GRAPH_NODES.slice(0, visibleNodes).length], ['Edges', visibleEdges], ['Suspicious', GRAPH_NODES.slice(0, visibleNodes).filter(n => n.sus).length]].map(([l, v]) => (
            <div key={l as string}>
              <span style={{ fontSize: 11, color: '#52525B' }}>{l} </span>
              <span style={{ fontSize: 11, color: '#A1A1AA', fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stage3Investigation({ onComplete }: { onComplete: (r: InvestigateResult | null) => void }) {
  const [lines, setLines] = useState<typeof LOG_LINES>([])
  const [apiResult, setApiResult] = useState<InvestigateResult | null>(null)
  const [done, setDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    LOG_LINES.forEach(line => {
      setTimeout(() => {
        setLines(prev => [...prev, line])
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, line.delay)
    })
    // Call real API in parallel
    investigateSignup(DEMO_INPUT).then(r => setApiResult(r)).catch(() => setApiResult(null))
    const t = setTimeout(() => setDone(true), LOG_LINES[LOG_LINES.length - 1].delay + 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (done) onComplete(apiResult)
  }, [done, apiResult])

  return (
    <div>
      <StageHeader step={3} title="Investigation running" sub="Graph walkers traversing linked entities and checking patterns" />
      <div style={{ background: '#0A0A0B', border: '1px solid #1C1C1F', borderRadius: 12, padding: '20px', fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: 12, maxHeight: 320, overflowY: 'auto' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: LOG_COLORS[line.type as keyof typeof LOG_COLORS], lineHeight: 1.8, display: 'flex', gap: 16 }}>
            <span style={{ color: '#3F3F46', flexShrink: 0, fontSize: 11 }}>
              {String(Math.floor(line.delay / 1000)).padStart(2, '0')}:{String(line.delay % 1000).padStart(3, '0')}
            </span>
            <span>{line.text}</span>
          </div>
        ))}
        {!done && (
          <div style={{ color: '#52525B', display: 'flex', gap: 16 }}>
            <span style={{ color: '#3F3F46', fontSize: 11 }}>···</span>
            <span className="animate-pulse">▊</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function Stage4Decision({ result }: { result: InvestigateResult | null }) {
  const risk = result?.riskScore ?? 94
  const decision = result?.decision ?? 'MANUAL_REVIEW'
  const signals = result?.fraudSignals ?? ['suspicious_email_domain', 'suspicious_device_fingerprint', 'suspicious_ip']
  const reasoning = result?.reasoningSteps ?? [
    'Email domain flagged as high-risk disposable/fraud domain',
    'Device fingerprint matches known emulator or fraud farm pattern',
    'IP address associated with known proxy or fraud ASN',
    'Phone number linked to prior flagged account',
  ]

  const decisionConfig = {
    APPROVE: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', icon: CheckCircle2, label: 'Approve' },
    STEP_UP: { color: '#EAB308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)', icon: AlertTriangle, label: 'Step-up verification' },
    MANUAL_REVIEW: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: ShieldAlert, label: 'Manual review' },
  }
  const cfg = decisionConfig[decision]
  const Icon = cfg.icon

  return (
    <div>
      <StageHeader step={4} title="Investigation complete" sub="Decision ready with full evidence trail" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Decision card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: 24 }}>
          <p style={{ fontSize: 11, color: cfg.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Decision</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Icon size={28} color={cfg.color} />
            <span style={{ fontSize: 24, fontWeight: 800, color: cfg.color, letterSpacing: '-0.02em' }}>{cfg.label}</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 42, fontWeight: 800, color: cfg.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{risk}</span>
              <span style={{ fontSize: 16, color: '#52525B' }}>/ 100 risk</span>
            </div>
            <div style={{ height: 5, background: '#27272A', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${risk}%` }} transition={{ duration: 1, delay: 0.3 }}
                style={{ height: '100%', background: `linear-gradient(90deg, #F97316, ${cfg.color})`, borderRadius: 3 }} />
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#71717A' }}>
            Confidence: <span style={{ color: '#A1A1AA', fontWeight: 600 }}>{Math.round((result?.confidence ?? 0.92) * 100)}%</span>
          </div>
        </motion.div>

        {/* Signals */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: '#111113', border: '1px solid #27272A', borderRadius: 12, padding: 24 }}>
          <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Fraud signals triggered</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {signals.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', flexShrink: 0, boxShadow: '0 0 6px #EF4444' }} />
                <span style={{ fontSize: 13, color: '#A1A1AA' }}>{s.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reasoning */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ gridColumn: '1 / -1', background: '#111113', border: '1px solid #27272A', borderRadius: 12, padding: 24 }}>
          <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Why this decision</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reasoning.filter(r => r.toLowerCase().includes('flag') || r.toLowerCase().includes('match') || r.toLowerCase().includes('link') || r.toLowerCase().includes('detect') || r.toLowerCase().includes('exceed')).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 8, borderBottom: i < reasoning.length - 1 ? '1px solid #1C1C1F' : 'none' }}>
                <span style={{ fontSize: 13, color: '#EF4444', flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.55 }}>{r}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #1C1C1F', display: 'flex', gap: 12 }}>
            <a href="/investigation/demo_marcus_webb"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#6366F1', color: 'white', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Open full investigation <ArrowRight size={14} />
            </a>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#18181B', color: '#71717A', padding: '10px 18px', borderRadius: 8, fontSize: 13, border: '1px solid #27272A' }}>
              Route to analyst queue
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── Shared stage header ───────────────────────────────────────────────────────
function StageHeader({ step, title, sub }: { step: number; title: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
      <div style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#818CF8', fontFamily: 'monospace' }}>{String(step).padStart(2, '0')}</span>
      </div>
      <div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.01em' }}>{title}</p>
        <p style={{ fontSize: 12, color: '#52525B' }}>{sub}</p>
      </div>
    </div>
  )
}

// ── Pipeline step indicator ───────────────────────────────────────────────────
const PIPELINE = [
  'Incoming application',
  'Signals extracted',
  'Graph built',
  'Investigation',
  'Decision',
]

function Pipeline({ stage }: { stage: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, overflowX: 'auto', paddingBottom: 4 }}>
      {PIPELINE.map((label, i) => {
        const active = i + 1 === stage
        const done = i + 1 < stage
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: active ? '#6366F1' : done ? '#18181B' : '#111113',
                border: active ? '2px solid #6366F1' : done ? '2px solid #3F3F46' : '2px solid #27272A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}>
                {done
                  ? <CheckCircle2 size={14} color="#52525B" />
                  : <span style={{ fontSize: 11, fontWeight: 700, color: active ? 'white' : '#3F3F46' }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontSize: 10, color: active ? '#A1A1AA' : done ? '#3F3F46' : '#2A2A2E', fontWeight: active ? 600 : 400, textAlign: 'center', maxWidth: 72, lineHeight: 1.3 }}>
                {label}
              </span>
            </div>
            {i < PIPELINE.length - 1 && (
              <div style={{ width: 40, height: 1, background: done ? '#27272A' : '#1C1C1F', margin: '0 4px', marginBottom: 20, flexShrink: 0, transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DemoPage() {
  const [stage, setStage] = useState(0)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [apiResult, setApiResult] = useState<InvestigateResult | null>(null)

  const STAGE_DURATIONS = [0, 4000, 5500, 0, 0]

  useEffect(() => {
    if (!autoAdvance || stage === 0 || stage === 3 || stage === 4) return
    const dur = STAGE_DURATIONS[stage]
    if (!dur) return
    const t = setTimeout(() => setStage(s => s + 1), dur)
    return () => clearTimeout(t)
  }, [stage, autoAdvance])

  const reset = () => { setStage(0); setApiResult(null) }

  return (
    <div style={{ minHeight: '100vh', background: '#09090B', color: '#FAFAFA' }}>
      {/* Top bar */}
      <div style={{ borderBottom: '1px solid #1C1C1F', padding: '0 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#71717A', textDecoration: 'none', fontSize: 14 }}>
            <ArrowLeft size={15} /> Back
          </Link>
          <span style={{ color: '#27272A' }}>|</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>SignalKYC — Live demo</span>
          <button onClick={reset} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #27272A', color: '#71717A', padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {stage > 0 && <Pipeline stage={stage} />}

        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Stage0Idle onStart={() => setStage(1)} />
            </motion.div>
          )}
          {stage === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <Stage1Signals />
            </motion.div>
          )}
          {stage === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <Stage2Graph />
            </motion.div>
          )}
          {stage === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <Stage3Investigation onComplete={(r) => { setApiResult(r); setTimeout(() => setStage(4), 800) }} />
            </motion.div>
          )}
          {stage === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <Stage4Decision result={apiResult} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual nav */}
        {stage > 0 && stage < 4 && stage !== 3 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button onClick={() => setStage(s => s + 1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#18181B', border: '1px solid #27272A', color: '#A1A1AA', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Next step <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
