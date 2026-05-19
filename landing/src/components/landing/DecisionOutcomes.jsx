import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react'

const OUTCOMES = [
  {
    icon: CheckCircle2,
    decision: 'Approve',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.05)',
    border: 'rgba(34,197,94,0.2)',
    tagBg: 'rgba(34,197,94,0.1)',
    conditions: [
      'Graph is clean — no suspicious links',
      'All signals are consistent with each other',
      'No matches to fraud clusters or prior flagged cases',
      'Risk score below configured threshold',
    ],
    outcome: 'Proceed with onboarding immediately.',
    riskRange: '0 – 39',
  },
  {
    icon: AlertTriangle,
    decision: 'Step-up verification',
    color: '#EAB308',
    bg: 'rgba(234,179,8,0.05)',
    border: 'rgba(234,179,8,0.2)',
    tagBg: 'rgba(234,179,8,0.1)',
    conditions: [
      'One or more signals have elevated risk',
      'Suspicious link found but no confirmed fraud ring',
      'Device or IP has borderline reputation',
      'Risk score in mid-range — resolvable with one more check',
    ],
    outcome: 'Request one additional verification step before approving.',
    riskRange: '40 – 69',
  },
  {
    icon: ShieldAlert,
    decision: 'Manual review',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.05)',
    border: 'rgba(239,68,68,0.2)',
    tagBg: 'rgba(239,68,68,0.1)',
    conditions: [
      'Multiple fraud signals detected and linked',
      'Device, email, or IP tied to confirmed fraud cluster',
      'Contradictions in identity data across signals',
      'High-risk score with strong evidence trail',
    ],
    outcome: 'Route to a fraud analyst with full investigation evidence.',
    riskRange: '70 – 100',
  },
]

export default function DecisionOutcomes() {
  return (
    <section id="outcomes" style={{ padding: '96px 24px', borderTop: '1px solid #1C1C1F', background: '#09090B' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            Decision outcomes
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#FAFAFA' }}>
            Three outcomes. Clear criteria. No ambiguity.
          </h2>
          <p style={{ fontSize: 17, color: '#71717A', marginTop: 16, maxWidth: 520, margin: '16px auto 0', lineHeight: 1.65 }}>
            Every investigation returns one of three structured decisions — each with the evidence needed to act on it confidently.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {OUTCOMES.map((o, i) => {
            const Icon = o.icon
            return (
              <div key={i} style={{
                background: o.bg,
                border: `1px solid ${o.border}`,
                borderRadius: 16,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <Icon size={22} color={o.color} />
                  <span style={{ fontSize: 11, color: '#52525B', fontFamily: 'monospace', fontWeight: 600 }}>
                    risk {o.riskRange}
                  </span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: o.color, letterSpacing: '-0.02em', marginBottom: 24 }}>
                  {o.decision}
                </h3>

                {/* Conditions */}
                <div style={{ flex: 1, marginBottom: 24 }}>
                  {o.conditions.map((c, ci) => (
                    <div key={ci} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: o.color, marginTop: 7, flexShrink: 0, opacity: 0.7,
                      }} />
                      <span style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.55 }}>{c}</span>
                    </div>
                  ))}
                </div>

                {/* Outcome */}
                <div style={{
                  background: `${o.tagBg}`,
                  border: `1px solid ${o.border}`,
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: o.color, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, marginTop: 1 }}>
                    Action
                  </span>
                  <span style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.5 }}>{o.outcome}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
