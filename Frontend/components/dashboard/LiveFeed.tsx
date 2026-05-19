'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, AlertTriangle, ShieldAlert, Loader2, Radio, Pause, ExternalLink } from 'lucide-react'
import { ingestSignup, investigateSignup } from '@/lib/api'

// ── Simulated signup pool ─────────────────────────────────────────────────────
const POOL = [
  { name: 'Alice Chen',    email: 'alice.chen@gmail.com',        phone: '+14155551234', device_fp: 'fp_chrome_ios_001',     ip: '192.168.1.100' },
  { name: 'Bob Smith',     email: 'bob.smith@yahoo.com',         phone: '+12125559876', device_fp: 'fp_firefox_win_002',    ip: '10.0.0.50'     },
  { name: 'Charlie Doe',   email: 'charlie@temp-mail.org',       phone: '+13105553344', device_fp: 'fp_safari_mac_003',     ip: '172.16.0.1'    },
  { name: 'Diana Ross',    email: 'diana@throwaway.email',       phone: '+16175557788', device_fp: 'fp_bad_emulator_001',   ip: '8.8.8.8'       },
  { name: 'Eve Turner',    email: 'eve99@darkweb.com',           phone: '+19175550001', device_fp: 'fp_bad_emulator_xyz',   ip: '45.33.22.100'  },
  { name: 'Frank Burns',   email: 'frank.burns@outlook.com',     phone: '+17185554321', device_fp: 'fp_chrome_android_004', ip: '192.168.2.55'  },
  { name: 'Grace Lee',     email: 'grace.lee@gmail.com',         phone: '+14085556789', device_fp: 'fp_edge_win_005',       ip: '10.0.1.20'     },
  { name: 'Hiro Tanaka',   email: 'fraud_hiro@10minutemail.net', phone: '+18185559999', device_fp: 'fp_bot_crawler_001',    ip: '45.33.44.55'   },
  { name: 'Ivan Petrov',   email: 'ivan.petrov@proton.me',       phone: '+79161234567', device_fp: 'fp_chrome_desktop_006', ip: '185.220.101.1' },
  { name: 'Julia Souza',   email: 'julia.souza@gmail.com',       phone: '+5511987654321', device_fp: 'fp_safari_ios_007',  ip: '177.24.1.1'    },
]

// ── Mock scoring when backend is down ─────────────────────────────────────────
function mockScore(email: string, device_fp: string, ip: string) {
  let risk = 20
  if (['fraud','temp','darkweb','10minute','throwaway'].some(k => email.includes(k))) risk += 30
  if (['emulator','fp_bad','farm','bot'].some(k => device_fp.includes(k))) risk += 35
  if (ip.startsWith('45.33')) risk += 20
  if (risk > 100) risk = 100
  const decision: 'APPROVE' | 'STEP_UP' | 'MANUAL_REVIEW' =
    risk >= 70 ? 'MANUAL_REVIEW' : risk >= 40 ? 'STEP_UP' : 'APPROVE'
  return { riskScore: risk, decision }
}

type FeedEntry = {
  key: string
  name: string
  email: string
  decision: 'APPROVE' | 'STEP_UP' | 'MANUAL_REVIEW'
  riskScore: number
  latencyMs: number
  investigationId: string
}

const DECISION_CONFIG = {
  APPROVE:       { icon: CheckCircle2,  color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30',  label: 'Approve'       },
  STEP_UP:       { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'Step-up'       },
  MANUAL_REVIEW: { icon: ShieldAlert,   color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30',      label: 'Manual Review' },
}

export default function LiveFeed() {
  const [running, setRunning] = useState(false)
  const [entries, setEntries] = useState<FeedEntry[]>([])
  const [processing, setProcessing] = useState<string | null>(null)
  const [stats, setStats] = useState({ total: 0, approve: 0, stepUp: 0, manual: 0 })
  const poolRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runNext = useCallback(async () => {
    const signup = POOL[poolRef.current % POOL.length]
    poolRef.current += 1
    const uid = `live_${signup.name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`
    const invId = `inv_live_${uid.slice(-6)}`

    setProcessing(signup.email)

    const t0 = Date.now()
    let riskScore: number
    let decision: 'APPROVE' | 'STEP_UP' | 'MANUAL_REVIEW'

    try {
      const result = await ingestSignup({
        user_id: uid,
        email: signup.email,
        phone: signup.phone,
        device_fp: signup.device_fp,
        ip: signup.ip,
        source: 'webhook',
      })
      riskScore = result.riskScore
      decision = result.decision
    } catch {
      // Backend down — use mock scoring so the feed always works
      const mock = mockScore(signup.email, signup.device_fp, signup.ip)
      riskScore = mock.riskScore
      decision = mock.decision
    }

    const latencyMs = Date.now() - t0

    setProcessing(null)
    setEntries(prev => [
      { key: uid, name: signup.name, email: signup.email, decision, riskScore, latencyMs, investigationId: invId },
      ...prev.slice(0, 9),
    ])
    setStats(prev => ({
      total: prev.total + 1,
      approve: prev.approve + (decision === 'APPROVE' ? 1 : 0),
      stepUp: prev.stepUp + (decision === 'STEP_UP' ? 1 : 0),
      manual: prev.manual + (decision === 'MANUAL_REVIEW' ? 1 : 0),
    }))
  }, [])

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }
    const schedule = () => {
      timerRef.current = setTimeout(async () => {
        await runNext()
        if (running) schedule()
      }, 3500)
    }
    schedule()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [running, runNext])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            Live Ingest Feed
            {running && (
              <span className="flex items-center gap-1.5 text-xs font-normal text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                LIVE
              </span>
            )}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Simulating real-time signup webhook traffic
          </p>
        </div>
        <Button
          size="sm"
          variant={running ? 'outline' : 'default'}
          onClick={() => setRunning(r => !r)}
          className="gap-2"
        >
          {running ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Radio className="h-3.5 w-3.5" /> Start Feed</>}
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Processing indicator */}
        <AnimatePresence>
          {processing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-accent/30 text-sm"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
              <span className="text-muted-foreground">Investigating</span>
              <span className="font-mono text-xs truncate">{processing}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed entries */}
        <div className="space-y-1.5 min-h-[120px]">
          {entries.length === 0 && !processing && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Radio className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Press Start Feed to begin auto-ingesting signups</p>
            </div>
          )}
          <AnimatePresence initial={false}>
            {entries.map((entry) => {
              const cfg = DECISION_CONFIG[entry.decision]
              const Icon = cfg.icon
              return (
                <motion.div
                  key={entry.key}
                  initial={{ opacity: 0, x: -16, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm"
                  style={{ borderColor: 'rgba(63,63,70,0.5)', background: 'rgba(24,24,27,0.4)' }}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${cfg.color}`} />
                  <span className="font-medium w-28 shrink-0 truncate">{entry.name}</span>
                  <span className="text-muted-foreground font-mono text-xs flex-1 truncate">{entry.email}</span>
                  <span className="text-xs text-muted-foreground w-16 text-right shrink-0">score {entry.riskScore}</span>
                  <span className={`text-xs font-semibold w-24 text-right shrink-0 ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-muted-foreground/60 w-14 text-right shrink-0">{entry.latencyMs}ms</span>
                  <Link href={`/investigation/${entry.investigationId}`} className="shrink-0">
                    <ExternalLink className="h-3 w-3 text-muted-foreground/50 hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Stats bar */}
        {stats.total > 0 && (
          <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-muted-foreground flex-wrap">
            <span>{stats.total} processed</span>
            <span className="text-green-400">✓ {stats.approve} approved</span>
            <span className="text-yellow-400">△ {stats.stepUp} step-up</span>
            <span className="text-red-400">✗ {stats.manual} manual review</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
