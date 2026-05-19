import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #27272A', background: '#09090B', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'space-between', marginBottom: 48 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 26, height: 26, background: '#6366F1', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="white" fill="white" />
              </div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>SignalKYC</span>
            </div>
            <p style={{ color: '#71717A', fontSize: 14, lineHeight: 1.7 }}>
              Graph-based identity investigation for fintech onboarding teams.
            </p>
          </div>

          {[
            { title: 'Product', links: ['How it works', 'Outcomes', 'Integrations', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'SOC 2'] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#FAFAFA', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {col.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ color: '#71717A', fontSize: 14, textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#FAFAFA'}
                    onMouseLeave={e => e.target.style.color = '#71717A'}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1C1C1F', paddingTop: 24 }}>
          <p style={{ color: '#52525B', fontSize: 13 }}>© 2026 SignalKYC. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#18181B', border: '1px solid #27272A', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#71717A' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
