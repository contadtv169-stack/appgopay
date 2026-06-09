import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit'
  className?: string
  size?: 'md' | 'sm'
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  type = 'button',
  className = '',
  size = 'md',
}: ButtonProps) {
  const base = `relative font-semibold rounded-[14px] transition-all duration-200 flex items-center justify-center gap-2 ${
    fullWidth ? 'w-full' : 'px-6'
  } ${size === 'md' ? 'h-[54px] text-base' : 'h-11 text-sm'}`

  const variants = {
    primary: `bg-gopay-blue text-white shadow-[0_4px_15px_rgba(0,102,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.4)] active:scale-[0.98] ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    secondary: `bg-transparent text-gopay-blue border-2 border-gopay-blue active:scale-[0.98] ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    danger: `bg-transparent text-red-500 border-2 border-red-500 active:scale-[0.98] ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    ghost: `bg-transparent text-gray-600 hover:bg-gray-50 active:scale-[0.98] ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={20} className="animate-spin" />}
      {children}
    </motion.button>
  )
}
