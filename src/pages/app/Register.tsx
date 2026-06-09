import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuthStore } from '../../stores/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { register, isAuthenticated, loading: storeLoading } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/connect-gateway', { replace: true })
  }, [isAuthenticated, navigate])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Nome é obrigatório'
    if (!email.trim()) errs.email = 'E-mail é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'E-mail inválido'
    if (!password) errs.password = 'Senha é obrigatória'
    else if (password.length < 6) errs.password = 'Mínimo de 6 caracteres'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const ok = await register(name.trim(), email.trim(), password)
      if (!ok) {
        setErrors({ email: 'Este e-mail já está cadastrado' })
      }
    } catch {
      setErrors({ email: 'Erro ao cadastrar. Tente novamente.' })
    }
    setLoading(false)
  }

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pt-6 pb-10">
          <button onClick={() => navigate(-1)} className="mb-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <ChevronLeft size={22} className="text-gray-700" />
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Criar conta</h1>
            <p className="text-gray-500 text-sm mb-8">Vamos começar</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Input label="Nome completo" value={name} onChange={setName} placeholder="Seu nome" error={errors.name} required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Input label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" error={errors.email} required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Input label="Senha" type="password" value={password} onChange={setPassword} placeholder="Mínimo de 6 caracteres" error={errors.password} required />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="pt-4">
              <Button type="submit" loading={loading || storeLoading}>Criar conta</Button>
            </motion.div>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-gopay-blue font-medium hover:underline">Já tem uma conta? Entrar</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
