const FIELD_CHECKS = [
  { field: 'Email', result: 'Valid format', pass: true },
  { field: 'Phone', result: 'Active number', pass: true },
  { field: 'Device', result: 'No blocklist match', pass: true },
  { field: 'IP', result: 'Not in deny list', pass: true },
  { field: 'Document', result: 'Passes OCR check', pass: true },
]

const GRAPH_FINDINGS = [
  { finding: 'Email domain created 4 hours ago', severity: 'high' },
  { finding: 'Device shared with 3 prior fraud cases', severity: 'high' },
  { finding: 'IP linked to known proxy ASN', severity: 'high' },
  { finding: 'Phone reused across 2 flagged accounts', severity: 'medium' },
  { finding: 'Prior case cluster: device_farm_ring_001', severity: 'high' },
]

export default function WhyGraph() {
  return (
    <section id="why-graph" style={{ padding: '96px 24px', borderTop: '1px solid #1C1C1F', borderBottom: '1px solid #1C1C1F', background: '#09090B' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            Why graph-based review
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#FAFAFA', maxWidth: 600, margin: '0 auto' }}>
            Same applicant. Two completely different pictures.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Field-by-field */}
          <div style={{ border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ background: '#111113', borderBottom: '1px solid #27272A', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#52525B', display: 'inline-block' }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#71717A' }}>Field-by-field verification</p>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22C55E', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>All pass</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {FIELD_CHECKS.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: i < FIELD_CHECKS.length - 1 ? '1px solid #1C1C1F' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#A1A1AA', minWidth: 80 }}>{c.field}</span>
                  <span style={{ fontSize: 13, color: '#52525B', flex: 1 }}>{c.result}</span>
                  <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>✓</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#111113', borderTop: '1px solid #27272A', padding: '14px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12 }}>✓</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#22C55E' }}>Decision: Approve</p>
                  <p style={{ fontSize: 11, color: '#52525B' }}>All fields passed — applicant onboarded</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graph-based */}
          <div style={{ border: '1px solid rgba(99,102,241,0.3)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 0 40px rgba(99,102,241,0.05)' }}>
            <div style={{ background: '#111113', borderBottom: '1px solid #27272A', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#A1A1AA' }}>SignalKYC — graph investigation</p>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#EF4444', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>5 signals</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {GRAPH_FINDINGS.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 24px', borderBottom: i < GRAPH_FINDINGS.length - 1 ? '1px solid #1C1C1F' : 'none' }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: f.severity === 'high' ? '#EF4444' : '#EAB308',
                    boxShadow: f.severity === 'high' ? '0 0 6px #EF4444' : '0 0 6px #EAB308',
                  }} />
                  <span style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.5 }}>{f.finding}</span>
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, fontWeight: 600, flexShrink: 0,
                    color: f.severity === 'high' ? '#EF4444' : '#EAB308',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {f.severity}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(239,68,68,0.04)', borderTop: '1px solid rgba(239,68,68,0.15)', padding: '14px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12 }}>⚠</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#EF4444' }}>Decision: Manual Review</p>
                  <p style={{ fontSize: 11, color: '#52525B' }}>Fraud ring membership detected — routing to analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 15, color: '#52525B', maxWidth: 480, margin: '32px auto 0' }}>
          The applicant above passes every standard verification check. SignalKYC catches the fraud ring because it investigates connections, not just fields.
        </p>
      </div>
    </section>
  )
}
