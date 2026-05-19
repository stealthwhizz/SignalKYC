import { Upload, Share2, Search, CheckCircle, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Upload,
    title: 'Ingest',
    subtitle: 'Submit onboarding data',
    body: 'Send a new signup via API or webhook. Include email, phone, device fingerprint, IP, document metadata — whatever you have.',
    detail: 'POST /investigate_signup',
    detailType: 'code',
  },
  {
    number: '02',
    icon: Share2,
    title: 'Link',
    subtitle: 'Build the identity graph',
    body: 'SignalKYC creates entity nodes and links them to every prior case that shares any signal. The graph grows with every investigation.',
    detail: '6 entity types · persistent graph',
    detailType: 'label',
  },
  {
    number: '03',
    icon: Search,
    title: 'Investigate',
    subtitle: 'Traverse suspicious paths',
    body: 'Graph walkers follow linked entities, check fraud cluster membership, gather evidence, and build a reasoning trace — automatically.',
    detail: '< 2s per investigation',
    detailType: 'label',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Decide',
    subtitle: 'Return a structured outcome',
    body: 'Every investigation returns a decision — Approve, Step-up, or Manual Review — with a risk score, confidence level, and full explanation.',
    detail: 'Approve · Step-up · Manual review',
    detailType: 'label',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '96px 24px', background: '#0A0A0B', borderTop: '1px solid #1C1C1F', borderBottom: '1px solid #1C1C1F' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            How it works
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#FAFAFA' }}>
            Four steps from signup to decision
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, position: 'relative' }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} style={{ position: 'relative' }}>
                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 28, right: -12, zIndex: 10,
                    display: 'none',
                  }} className="md:block">
                    <ArrowRight size={16} color="#3F3F46" />
                  </div>
                )}

                <div style={{
                  background: '#111113',
                  border: '1px solid #27272A',
                  borderRadius: 14,
                  padding: 28,
                  height: '100%',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#3F3F46'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#27272A'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#3F3F46', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{step.number}</span>
                    <div style={{ width: 36, height: 36, background: '#18181B', border: '1px solid #27272A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color="#6366F1" />
                    </div>
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FAFAFA', marginBottom: 4, letterSpacing: '-0.02em' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#52525B', marginBottom: 14, fontWeight: 500 }}>{step.subtitle}</p>
                  <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.7, marginBottom: 20 }}>
                    {step.body}
                  </p>

                  {step.detailType === 'code' ? (
                    <code style={{
                      display: 'block', fontSize: 12, color: '#818CF8',
                      background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
                      padding: '6px 10px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {step.detail}
                    </code>
                  ) : (
                    <p style={{ fontSize: 12, color: '#52525B', fontFamily: 'monospace' }}>{step.detail}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
