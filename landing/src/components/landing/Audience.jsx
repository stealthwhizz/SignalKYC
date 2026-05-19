import { Rocket, Shield, Scale, Code2 } from 'lucide-react'

const SEGMENTS = [
  {
    icon: Rocket,
    title: 'Fintech founders',
    subtitle: 'Onboarding teams',
    body: 'Ship a smarter KYC flow without building the risk infrastructure yourself. SignalKYC gives you investigation-grade signal linking from day one.',
    tags: ['Fast integration', 'No ML team needed'],
  },
  {
    icon: Shield,
    title: 'Fraud ops',
    subtitle: 'Risk and trust teams',
    body: 'Give your analysts a complete picture at decision time — not a score they have to reverse-engineer. Every flagged case arrives with full evidence.',
    tags: ['Fewer false positives', 'Explainable decisions'],
  },
  {
    icon: Scale,
    title: 'Compliance',
    subtitle: 'Risk and regulatory teams',
    body: 'Every SignalKYC decision includes a full reasoning trace. You can demonstrate exactly why an application was approved, escalated, or denied.',
    tags: ['Audit-ready output', 'Decision documentation'],
  },
  {
    icon: Code2,
    title: 'Risk product teams',
    subtitle: 'Platform engineering',
    body: 'Add investigation intelligence to your onboarding API. Flexible enough to extend with your own signals, thresholds, and decision logic.',
    tags: ['REST API', 'Configurable thresholds'],
  },
]

export default function Audience() {
  return (
    <section id="who-it's-for" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            Who it's for
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#FAFAFA' }}>
            Built for teams that care about getting it right
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {SEGMENTS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} style={{
                background: '#0D0D0F',
                border: '1px solid #27272A',
                borderRadius: 14,
                padding: 28,
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#27272A'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color="#6366F1" />
                  </div>
                </div>

                <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  {s.subtitle}
                </p>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#FAFAFA', marginBottom: 12, letterSpacing: '-0.02em' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.7, marginBottom: 20 }}>
                  {s.body}
                </p>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, color: '#52525B', background: '#18181B',
                      border: '1px solid #27272A', borderRadius: 6, padding: '3px 9px',
                      fontWeight: 500,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
