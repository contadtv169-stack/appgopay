import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuthStore } from '../../stores/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, loading: storeLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/app/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Preencha todos os campos')
      return
    }
    setLoading(true)
    setError('')
    try {
      const ok = await login(email.trim(), password)
      if (ok) {
        navigate('/app/dashboard', { replace: true })
      } else {
        setError('E-mail ou senha incorretos')
      }
    } catch {
      setError('Erro ao conectar. Tente novamente.')
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Entrar</h1>
            <p className="text-gray-500 text-sm mb-8">Acesse sua conta</p>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-red-50 border border-red-100 mb-4 text-red-600 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Input label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Input label="Senha" type="password" value={password} onChange={setPassword} placeholder="Sua senha" required />
            </motion.div>

            <div className="text-right">
              <button className="text-sm text-gray-500 hover:text-gopay-blue transition-colors">Esqueci minha senha</button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="pt-2">
              <Button type="submit" loading={loading || storeLoading}>Entrar</Button>
            </motion.div>
          </form>

          <div className="text-center mt-6">
            <Link to="/register" className="text-sm text-gopay-blue font-medium hover:underline">Criar conta</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
