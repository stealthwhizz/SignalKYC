// SignalKYC Polished Frontend - Design System and Color Tokens

export const theme = {
  // Color palette - modern fintech
  colors: {
    // Base colors
    bg: {
      primary: '#0f1219',      // Deep graphite
      secondary: '#1a1f2e',    // Slate
      tertiary: '#252d3d',     // Lighter slate
      hover: '#303844',        // Hover state
    },
    text: {
      primary: '#f8f9fa',      // Off-white
      secondary: '#b8bcc6',    // Muted gray
      tertiary: '#8a909d',     // Darker gray
    },
    // Decision states
    approve: '#10b981',        // Green
    approveBg: '#064e3b',      // Dark green
    stepUp: '#f59e0b',         // Amber
    stepUpBg: '#78350f',       // Dark amber
    manual: '#ef4444',         // Red
    manualBg: '#7f1d1d',       // Dark red
    // Neutral elements
    neutral: '#06b6d4',        // Cyan/Teal
    neutralBg: '#083344',      // Dark cyan
    // Borders
    border: '#374151',         // Mid-gray border
    borderLight: '#4b5563',    // Lighter border
  },
  // Typography
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  // Shadows
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.25)',
  },
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export const componentStyles = {
  // Card styles
  card: `
    background: ${theme.colors.bg.secondary};
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: ${theme.shadow.sm};
  `,
  
  // Button styles
  buttonBase: `
    font-family: ${theme.fonts.primary};
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: ${theme.sizes.sm};
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  `,
  buttonPrimary: `
    background: ${theme.colors.neutral};
    color: ${theme.colors.bg.primary};
  `,
  buttonPrimaryHover: `
    background: #0891b2;
    transform: translateY(-1px);
    box-shadow: ${theme.shadow.md};
  `,
  
  // Badge styles
  badge: `
    display: inline-block;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    font-size: ${theme.sizes.xs};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `,
};
