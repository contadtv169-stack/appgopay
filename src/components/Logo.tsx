interface LogoProps {
  size?: number
  showText?: boolean
  variant?: 'default' | 'white'
}

export default function Logo({ size = 40, showText = true, variant = 'default' }: LogoProps) {
  const color = variant === 'white' ? '#FFFFFF' : '#0066FF'
  const textColor = variant === 'white' ? 'text-white' : 'text-gray-900'
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded-2xl font-bold text-white"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${color}, #0048CC)`,
          fontSize: size * 0.5,
          boxShadow: `0 4px 15px rgba(0,102,255,0.3)`,
        }}
      >
        <svg viewBox="0 0 40 40" width={size * 0.6} height={size * 0.6} fill="none">
          <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2.5" />
          <path d="M13 20 C13 16, 16 13, 20 13 C24 13, 27 16, 27 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M27 20 L27 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 24 L27 27 L32 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="2.5" fill="white" />
        </svg>
      </div>
      {showText && (
        <span className={`text-xl font-bold tracking-tight ${textColor}`} style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
          GoPay
        </span>
      )}
    </div>
  )
}
