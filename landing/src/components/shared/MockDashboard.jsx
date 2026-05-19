// Fake but realistic investigation dashboard used in the Hero section

const CASES = [
  { id: 'inv_0040', name: 'Maria Santos', risk: 12, status: 'APPROVE', time: '2m ago' },
  { id: 'inv_0041', name: 'Wei Zhang', risk: 58, status: 'STEP_UP', time: '4m ago' },
  { id: 'inv_0042', name: 'Bob Okafor', risk: 94, status: 'MANUAL_REVIEW', time: 'Now', active: true },
]

const STATUS_CONFIG = {
  APPROVE: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', label: 'Approve' },
  STEP_UP: { color: '#EAB308', bg: 'rgba(234,179,8,0.1)', label: 'Step-up' },
  MANUAL_REVIEW: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Manual Review' },
}

const NODES = [
  { id: 'user', x: 220, y: 140, type: 'user', label: 'bob_okafor', suspicious: true },
  { id: 'email', x: 100, y: 60, type: 'email', label: 'bob99@darkweb.com', suspicious: true },
  { id: 'phone', x: 340, y: 60, type: 'phone', label: '+1 555 000 0001', suspicious: false },
  { id: 'device', x: 80, y: 220, type: 'device', label: 'fp_emulator_xyz', suspicious: true },
  { id: 'ip', x: 360, y: 220, type: 'ip', label: '45.33.22.100', suspicious: true },
  { id: 'linked', x: 220, y: 270, type: 'user', label: 'fraud_ring_acct', suspicious: true },
]

const EDGES = [
  { from: 'user', to: 'email', sus: true },
  { from: 'user', to: 'phone', sus: false },
  { from: 'user', to: 'device', sus: true },
  { from: 'user', to: 'ip', sus: true },
  { from: 'device', to: 'linked', sus: true },
]

const NODE_COLORS = {
  user: '#6366F1',
  email: '#3B82F6',
  phone: '#10B981',
  device: '#F59E0B',
  ip: '#8B5CF6',
}

function GraphNode({ x, y, type, label, suspicious }) {
  const color = suspicious ? '#EF4444' : NODE_COLORS[type]
  return (
    <g>
      <circle cx={x} cy={y} r={22} fill={`${color}18`} stroke={color} strokeWidth={suspicious ? 2 : 1.5} />
      {suspicious && <circle cx={x} cy={y} r={28} fill="none" stroke={`${color}30`} strokeWidth={1} strokeDasharray="3 3" />}
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={color} fontWeight="600" fontFamily="monospace">
        {type[0].toUpperCase()}
      </text>
      <text x={x} y={y + 36} textAnchor="middle" fontSize={9} fill="#71717A" fontFamily="monospace">
        {label.length > 16 ? label.slice(0, 14) + '…' : label}
      </text>
    </g>
  )
}

function getNodePos(id) {
  return NODES.find(n => n.id === id) ?? { x: 0, y: 0 }
}

export default function MockDashboard() {
  return (
    <div style={{ display: 'flex', background: '#0D0D0F', minHeight: 440 }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: '1px solid #1C1C1F', flexShrink: 0, padding: '16px 0' }}>
        <div style={{ padding: '0 16px 12px', borderBottom: '1px solid #1C1C1F', marginBottom: 8 }}>
          <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent cases</p>
        </div>
        {CASES.map(c => {
          const cfg = STATUS_CONFIG[c.status]
          return (
            <div key={c.id} style={{
              padding: '10px 16px',
              background: c.active ? '#18181B' : 'transparent',
              borderLeft: c.active ? '2px solid #6366F1' : '2px solid transparent',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: c.active ? '#FAFAFA' : '#A1A1AA' }}>{c.name}</span>
                <span style={{ fontSize: 10, color: '#52525B' }}>{c.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#52525B', fontFamily: 'monospace' }}>{c.id}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: cfg.color,
                  background: cfg.bg, padding: '2px 6px', borderRadius: 4,
                }}>
                  {c.risk}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Graph area */}
      <div style={{ flex: 1, position: 'relative', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <p style={{ fontSize: 12, color: '#FAFAFA', fontWeight: 600 }}>inv_0042 — Bob Okafor</p>
            <p style={{ fontSize: 11, color: '#52525B' }}>Identity graph · 6 nodes · 5 edges · 3 fraud signals</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Graph', 'Timeline', 'Evidence'].map(t => (
              <span key={t} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 5, cursor: 'pointer',
                background: t === 'Graph' ? '#27272A' : 'transparent',
                color: t === 'Graph' ? '#FAFAFA' : '#52525B',
                border: '1px solid',
                borderColor: t === 'Graph' ? '#3F3F46' : 'transparent',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* SVG graph */}
        <div style={{ background: '#0A0A0B', borderRadius: 10, border: '1px solid #1C1C1F', flex: 1, overflow: 'hidden' }}>
          <svg width="100%" height="320" viewBox="0 0 460 310" style={{ display: 'block' }}>
            {/* Edges */}
            {EDGES.map((e, i) => {
              const from = getNodePos(e.from)
              const to = getNodePos(e.to)
              return (
                <line key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={e.sus ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.25)'}
                  strokeWidth={e.sus ? 1.5 : 1}
                  strokeDasharray={e.sus ? '4 3' : 'none'}
                />
              )
            })}
            {NODES.map(n => (
              <GraphNode key={n.id} {...n} />
            ))}
          </svg>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 220, borderLeft: '1px solid #1C1C1F', padding: 16, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
        {/* Risk score */}
        <div>
          <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Risk score</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: '#EF4444', letterSpacing: '-0.04em', lineHeight: 1 }}>94</span>
            <span style={{ fontSize: 14, color: '#52525B' }}>/100</span>
          </div>
          <div style={{ height: 4, background: '#27272A', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '94%', height: '100%', background: 'linear-gradient(90deg, #F97316, #EF4444)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Decision */}
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 12px' }}>
          <p style={{ fontSize: 10, color: '#EF4444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Decision</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>Manual Review</p>
          <p style={{ fontSize: 11, color: '#71717A', marginTop: 4, lineHeight: 1.5 }}>3 fraud signals detected</p>
        </div>

        {/* Signals */}
        <div>
          <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Fraud signals</p>
          {['Suspicious email domain', 'Known emulator device', 'High-risk IP ASN'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#A1A1AA', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Confidence */}
        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #1C1C1F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#52525B' }}>Confidence</span>
            <span style={{ fontSize: 11, color: '#A1A1AA', fontWeight: 500 }}>92%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#52525B' }}>Duration</span>
            <span style={{ fontSize: 11, color: '#A1A1AA', fontWeight: 500, fontFamily: 'monospace' }}>1.4s</span>
          </div>
        </div>
      </div>
    </div>
  )
}
