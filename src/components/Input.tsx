import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface InputProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  error?: string
  required?: boolean
  prefix?: string
  maskCurrency?: boolean
}

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required,
  prefix,
  maskCurrency,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  const isPassword = type === 'password'

  const handleChange = (val: string) => {
    if (maskCurrency) {
      const nums = val.replace(/\D/g, '')
      const padded = nums.padStart(3, '0')
      const int = padded.slice(0, -2)
      const dec = padded.slice(-2)
      const formatted = `${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`
      onChange(formatted)
      return
    }
    onChange(val)
  }

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div
        className={`flex items-center bg-gopay-light rounded-xl border-1.5 transition-all duration-200 ${
          focused ? 'border-gopay-blue shadow-[0_0_0_3px_rgba(0,102,255,0.1)]' : 'border-transparent'
        } ${error ? 'border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
      >
        {prefix && (
          <span className="pl-4 text-gray-500 font-medium text-sm">{prefix}</span>
        )}
        <input
          type={inputType}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent px-4 py-3.5 text-base text-gray-900 placeholder-gray-400 outline-none"
          inputMode={maskCurrency ? 'numeric' : undefined}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  )
}
