import { UserPlus, Zap, ScanSearch, ClipboardCheck, CheckCircle2 } from 'lucide-react'

const STEPS = [
  {
    icon: UserPlus,
    actor: 'Customer',
    title: 'Submits application',
    detail: 'Name, email, phone, device, ID document uploaded through your onboarding form.',
    color: '#6366F1',
  },
  {
    icon: Zap,
    actor: 'SignalKYC',
    title: 'Builds identity graph',
    detail: 'Every signal is linked to prior entities. Graph grows in real time across all cases.',
    color: '#818CF8',
  },
  {
    icon: ScanSearch,
    actor: 'SignalKYC',
    title: 'Investigates connections',
    detail: 'Walkers traverse the graph, match fraud clusters, evaluate signal combinations.',
    color: '#A78BFA',
  },
  {
    icon: ClipboardCheck,
    actor: 'Risk analyst',
    title: 'Reviews flagged case',
    detail: 'Cases routed to manual review arrive with full evidence — no separate investigation needed.',
    color: '#C4B5FD',
  },
  {
    icon: CheckCircle2,
    actor: 'Platform',
    title: 'Takes final action',
    detail: 'Approve, step-up, or reject. Decision logged with reasoning for compliance records.',
    color: '#22C55E',
  },
]

export default function Workflow() {
  return (
    <section id="workflow" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left: copy */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              Workflow
            </p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, color: '#FAFAFA', marginBottom: 20 }}>
              From signup to decision — without building the investigation layer yourself
            </h2>
            <p style={{ fontSize: 16, color: '#71717A', lineHeight: 1.75 }}>
              SignalKYC sits between your onboarding form and your risk team. It handles the evidence-gathering so analysts spend time deciding, not chasing.
            </p>
          </div>

          {/* Right: flow steps */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 19,
              top: 20,
              bottom: 20,
              width: 1,
              background: 'linear-gradient(to bottom, #27272A 0%, #27272A 80%, transparent 100%)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} style={{ display: 'flex', gap: 20, paddingBottom: i < STEPS.length - 1 ? 28 : 0 }}>
                    {/* Icon dot */}
                    <div style={{ position: 'relative', flexShrink: 0, zIndex: 1 }}>
                      <div style={{
                        width: 38, height: 38,
                        background: '#111113',
                        border: `1px solid ${step.color}40`,
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={16} color={step.color} />
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ paddingTop: 6 }}>
                      <p style={{ fontSize: 11, color: '#52525B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                        {step.actor}
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 600, color: '#FAFAFA', marginBottom: 6, letterSpacing: '-0.01em' }}>{step.title}</p>
                      <p style={{ fontSize: 13, color: '#71717A', lineHeight: 1.6 }}>{step.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
