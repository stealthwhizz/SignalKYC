import { ArrowRight, Play, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react'
import MockDashboard from '../shared/MockDashboard'

export default function Hero() {
  return (
    <section style={{ paddingTop: 140, paddingBottom: 80, padding: '140px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            color: '#818CF8', padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Built for fintech risk teams
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          maxWidth: 840,
          margin: '0 auto 24px',
          color: '#FAFAFA',
        }}>
          Stop making fraud decisions with half the picture
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: '#A1A1AA',
          textAlign: 'center',
          maxWidth: 580,
          margin: '0 auto 44px',
          lineHeight: 1.65,
          fontWeight: 400,
        }}>
          SignalKYC builds a live identity graph for every new signup — linking email, phone, device, IP, and case history — so your risk team can investigate, not just score.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
          <a
            href="#demo"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#6366F1', color: 'white', padding: '12px 24px',
              borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.15s', boxShadow: '0 0 0 1px rgba(99,102,241,0.5)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Request demo <ArrowRight size={16} />
          </a>
          <a
            href="#how-it-works"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: '#A1A1AA', padding: '12px 24px',
              borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: 'none',
              border: '1px solid #27272A', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FAFAFA'; e.currentTarget.style.borderColor = '#3F3F46' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#A1A1AA'; e.currentTarget.style.borderColor = '#27272A' }}
          >
            <Play size={14} fill="currentColor" /> View sample case
          </a>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 64 }}>
          {[
            { label: 'avg. investigation time', value: '< 2s' },
            { label: 'signals linked per case', value: '5–12' },
            { label: 'decision outcomes', value: '3' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: '#FAFAFA' }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#52525B', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mock Dashboard */}
        <div style={{
          border: '1px solid #27272A',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px #1C1C1F, 0 32px 80px rgba(0,0,0,0.6)',
          position: 'relative',
        }}>
          {/* Browser chrome */}
          <div style={{ background: '#18181B', borderBottom: '1px solid #27272A', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444', opacity: 0.7, display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#EAB308', opacity: 0.7, display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22C55E', opacity: 0.7, display: 'inline-block' }} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#27272A', borderRadius: 6, padding: '4px 16px', fontSize: 12, color: '#52525B', fontFamily: 'monospace' }}>
                app.signalkyc.io/investigation/inv_0042
              </div>
            </div>
          </div>
          <MockDashboard />
        </div>
      </div>
    </section>
  )
}
