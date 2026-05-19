import { Eye, GitBranch, BarChart2, Layers } from 'lucide-react'

const PAINS = [
  {
    icon: Eye,
    title: 'Signal blindness',
    body: 'You verify email and phone in isolation. A fraudster running five accounts from the same device stays invisible across every check.',
  },
  {
    icon: GitBranch,
    title: 'Disconnected tooling',
    body: 'Device risk lives in one platform. IP data in another. Document checks in a third. Nobody on your team has a complete picture at decision time.',
  },
  {
    icon: BarChart2,
    title: 'Black-box scores',
    body: 'When a score says 73, your analyst doesn\'t know what drove it. They can\'t challenge it, tune it, or explain it to a compliance review.',
  },
  {
    icon: Layers,
    title: 'Manual review overload',
    body: 'Too many borderline applications get routed to humans because your system can\'t articulate why something looks off — only that it does.',
  },
]

export default function Problem() {
  return (
    <section id="problem" style={{ padding: '96px 24px', borderTop: '1px solid #1C1C1F' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 640, marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            The problem
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#FAFAFA', marginBottom: 20 }}>
            Most KYC tools check fields.<br />Fraud hides in connections.
          </h2>
          <p style={{ fontSize: 17, color: '#71717A', lineHeight: 1.7 }}>
            A phone number linked to three flagged accounts. A device shared across two fraud rings. An email domain created four hours ago. None of these look dangerous alone. Together, they tell a story your current stack can't read.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, border: '1px solid #1C1C1F', borderRadius: 16, overflow: 'hidden' }}>
          {PAINS.map((p, i) => {
            const Icon = p.icon
            return (
              <div key={i} style={{
                background: '#0D0D0F',
                padding: 32,
                borderRight: i % 2 === 0 ? '1px solid #1C1C1F' : 'none',
                borderBottom: i < 2 ? '1px solid #1C1C1F' : 'none',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#111113'}
                onMouseLeave={e => e.currentTarget.style.background = '#0D0D0F'}
              >
                <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={18} color="#6366F1" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#FAFAFA', marginBottom: 10, letterSpacing: '-0.01em' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.7 }}>
                  {p.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
