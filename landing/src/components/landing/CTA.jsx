import { ArrowRight, Play } from 'lucide-react'

export default function CTA() {
  return (
    <section id="demo" style={{ padding: '96px 24px 80px', borderTop: '1px solid #1C1C1F' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        {/* Label */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8', padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', display: 'inline-block' }} />
          Available now for early access
        </div>

        <h2 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#FAFAFA', marginBottom: 20 }}>
          Ready to see what you've been missing?
        </h2>

        <p style={{ fontSize: 18, color: '#71717A', lineHeight: 1.7, marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
          Book a demo and walk through a live investigation on your own onboarding data. No commitment required.
        </p>

        {/* Form */}
        <form
          onSubmit={e => e.preventDefault()}
          style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto 32px', flexWrap: 'wrap' }}
        >
          <input
            type="email"
            placeholder="Work email"
            style={{
              flex: 1,
              minWidth: 200,
              background: '#111113',
              border: '1px solid #27272A',
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 15,
              color: '#FAFAFA',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#6366F1'}
            onBlur={e => e.target.style.borderColor = '#27272A'}
          />
          <button
            type="submit"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#6366F1', color: 'white', padding: '12px 24px',
              borderRadius: 10, fontSize: 15, fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Request demo <ArrowRight size={15} />
          </button>
        </form>

        <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#52525B', fontSize: 14, textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => e.target.style.color = '#A1A1AA'}
          onMouseLeave={e => e.target.style.color = '#52525B'}>
          <Play size={12} fill="currentColor" /> Or walk through a sample case first
        </a>

        {/* Trust signals */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginTop: 56, paddingTop: 40, borderTop: '1px solid #1C1C1F' }}>
          {[
            'No credit card required',
            'Setup in under 30 minutes',
            'Works with your existing stack',
          ].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 14, color: '#22C55E' }}>✓</span>
              <span style={{ fontSize: 14, color: '#52525B' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
