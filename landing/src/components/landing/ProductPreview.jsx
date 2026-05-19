import { LayoutDashboard, Share2, Clock, FileText, Link2 } from 'lucide-react'

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Case dashboard',
    body: 'All investigations in one view. Filter by decision, risk score, or signal type. Jump into any case with one click.',
  },
  {
    icon: Share2,
    title: 'Live identity graph',
    body: 'Interactive graph showing every linked entity. Suspicious nodes highlighted. Click any node to see its full history.',
  },
  {
    icon: Clock,
    title: 'Investigation timeline',
    body: 'Step-by-step reasoning trace from the agent — exactly which signals were examined, what was found, and why.',
  },
  {
    icon: FileText,
    title: 'Decision panel',
    body: 'Risk score, confidence, fraud signals, and the final decision in one panel. Ready to copy for compliance records.',
  },
  {
    icon: Link2,
    title: 'Similar case linking',
    body: 'Every investigation is automatically linked to prior cases that share signals. Pattern detection across your full case history.',
  },
]

function MiniGraph() {
  const nodes = [
    { x: 120, y: 90, label: 'User', color: '#6366F1', sus: false, r: 20 },
    { x: 50, y: 40, label: 'Email', color: '#EF4444', sus: true, r: 14 },
    { x: 190, y: 40, label: 'Phone', color: '#22C55E', sus: false, r: 14 },
    { x: 40, y: 145, label: 'Device', color: '#EF4444', sus: true, r: 14 },
    { x: 200, y: 145, label: 'IP', color: '#EF4444', sus: true, r: 14 },
    { x: 120, y: 175, label: 'Linked', color: '#EF4444', sus: true, r: 12 },
  ]
  const edges = [
    [0, 1, true], [0, 2, false], [0, 3, true], [0, 4, true], [3, 5, true],
  ]
  return (
    <svg width="240" height="200" viewBox="0 0 240 200">
      {edges.map(([a, b, sus], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke={sus ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.3)'}
          strokeWidth={sus ? 1.5 : 1}
          strokeDasharray={sus ? '3 2' : 'none'}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          {n.sus && <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke={`${n.color}20`} strokeWidth={1} strokeDasharray="2 2" />}
          <circle cx={n.x} cy={n.y} r={n.r} fill={`${n.color}18`} stroke={n.color} strokeWidth={n.sus ? 1.5 : 1} />
          <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill={n.color} fontWeight="600">{n.label[0]}</text>
          <text x={n.x} y={n.y + n.r + 9} textAnchor="middle" fontSize={7.5} fill="#52525B">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

function ReasoningTrace() {
  const steps = [
    { t: '00:00.012', msg: 'Ingesting signup signals for inv_0042', done: true },
    { t: '00:00.045', msg: 'Email domain age: 4h — flagged as suspicious', done: true, alert: true },
    { t: '00:00.089', msg: 'Device fp_emulator_xyz — matched to fraud cluster', done: true, alert: true },
    { t: '00:00.112', msg: 'IP 45.33.22.100 — proxy ASN detected', done: true, alert: true },
    { t: '00:00.134', msg: 'Computing final risk score: 94', done: true },
  ]
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: i < steps.length - 1 ? '1px solid #1C1C1F' : 'none' }}>
          <span style={{ color: '#3F3F46', flexShrink: 0 }}>{s.t}</span>
          <span style={{ color: s.alert ? '#EF4444' : '#71717A' }}>{s.msg}</span>
        </div>
      ))}
    </div>
  )
}

export default function ProductPreview() {
  return (
    <section id="product" style={{ padding: '96px 24px', borderTop: '1px solid #1C1C1F' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            Product
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#FAFAFA' }}>
            Everything your team needs to investigate, not just score
          </h2>
        </div>

        {/* Main product preview */}
        <div style={{ border: '1px solid #27272A', borderRadius: 16, overflow: 'hidden', marginBottom: 48, background: '#0D0D0F' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #1C1C1F' }}>
            {/* Graph panel */}
            <div style={{ padding: 32, borderRight: '1px solid #1C1C1F' }}>
              <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Identity graph
              </p>
              <div style={{ background: '#0A0A0B', border: '1px solid #1C1C1F', borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'center' }}>
                <MiniGraph />
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                {[['User', '#6366F1'], ['Email', '#EF4444'], ['Device', '#EF4444'], ['IP', '#EF4444']].map(([l, c]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block' }} />
                    <span style={{ fontSize: 10, color: '#52525B' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reasoning trace */}
            <div style={{ padding: 32 }}>
              <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Investigation trace
              </p>
              <div style={{ background: '#0A0A0B', border: '1px solid #1C1C1F', borderRadius: 10, padding: 16 }}>
                <ReasoningTrace />
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, background: '#18181B', border: '1px solid #27272A', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ fontSize: 10, color: '#52525B', marginBottom: 3 }}>Risk score</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#EF4444', letterSpacing: '-0.03em' }}>94</p>
                </div>
                <div style={{ flex: 1, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ fontSize: 10, color: '#EF4444', opacity: 0.7, marginBottom: 3 }}>Decision</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>Manual Review</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, border: '1px solid #1C1C1F', borderRadius: 14, overflow: 'hidden' }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} style={{
                background: '#0D0D0F',
                padding: 24,
                borderRight: (i + 1) % 5 !== 0 ? '1px solid #1C1C1F' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#111113'}
                onMouseLeave={e => e.currentTarget.style.background = '#0D0D0F'}
              >
                <Icon size={16} color="#6366F1" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA', marginBottom: 6, marginTop: 12 }}>{f.title}</p>
                <p style={{ fontSize: 13, color: '#71717A', lineHeight: 1.6 }}>{f.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
