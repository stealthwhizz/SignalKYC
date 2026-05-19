import { useState, useEffect } from 'react'
import { Zap, Menu, X } from 'lucide-react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(9,9,11,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #27272A' : '1px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#6366F1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>SignalKYC</span>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
            {['How it works', 'Why graph', 'Who it\'s for', 'Outcomes'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/[' ]/g, '-').replace("'", '')}`}
                style={{ color: '#A1A1AA', fontSize: 14, textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#FAFAFA'}
                onMouseLeave={e => e.target.style.color = '#A1A1AA'}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden md:flex">
            <a href="#demo" style={{ color: '#A1A1AA', fontSize: 14, textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#FAFAFA'}
              onMouseLeave={e => e.target.style.color = '#A1A1AA'}>
              Log in
            </a>
            <a
              href="#demo"
              style={{
                background: '#6366F1', color: 'white', padding: '8px 18px',
                borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.target.style.background = '#4F46E5'}
              onMouseLeave={e => e.target.style.background = '#6366F1'}
            >
              Request demo
            </a>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A1A1AA', display: 'none' }} className="md:hidden block">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div style={{ borderTop: '1px solid #27272A', background: '#09090B', padding: '16px 24px' }}>
          {['How it works', 'Why graph', 'Who it\'s for', 'Outcomes'].map((item) => (
            <a key={item} href="#demo" onClick={() => setOpen(false)}
              style={{ display: 'block', color: '#A1A1AA', fontSize: 15, textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid #1C1C1F' }}>
              {item}
            </a>
          ))}
          <a href="#demo" style={{ display: 'block', marginTop: 16, background: '#6366F1', color: 'white', padding: '10px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', textAlign: 'center' }}>
            Request demo
          </a>
        </div>
      )}
    </header>
  )
}
