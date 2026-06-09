import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, LogOut, Shield, HelpCircle, MessageSquare, FileText, Lock, Bell, RefreshCw, Unlink } from 'lucide-react'
import BottomNav from '../../components/BottomNav'
import { useAuthStore } from '../../stores/authStore'
import { useGatewayStore } from '../../stores/gatewayStore'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { connectedGateway, disconnect } = useGatewayStore()
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/welcome')
  }

  const sections = [
    {
      title: 'Configurações',
      items: [
        { icon: Lock, label: 'Alterar senha' },
        { icon: Bell, label: 'Notificações' },
        { icon: Shield, label: 'Privacidade' },
      ],
    },
    {
      title: 'Gateway',
      items: [
        { icon: RefreshCw, label: 'Reconectar', color: 'text-gopay-blue' as const, onClick: () => navigate('/connect-gateway') },
        { icon: Unlink, label: 'Desconectar', color: 'text-red-500' as const, onClick: () => { disconnect(); navigate('/connect-gateway') } },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { icon: HelpCircle, label: 'Ajuda' },
        { icon: MessageSquare, label: 'Falar com suporte' },
        { icon: FileText, label: 'Termos de uso' },
        { icon: Shield, label: 'Política de privacidade' },
      ],
    },
  ]

  return (
    <div className="phone-frame">
      <div className="phone-content min-h-screen bg-gopay-light pb-24">
        <div className="px-6 pt-14 pb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Conta</h1>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white shadow-sm mb-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gopay-blue text-white text-3xl font-bold flex items-center justify-center mx-auto mb-3 shadow-[0_4px_15px_rgba(0,102,255,0.25)]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name || 'Usuário'}</h2>
            <p className="text-sm text-gray-500 mb-3">{user?.email || 'usuario@email.com'}</p>
            {connectedGateway && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                <Shield size={12} /> Gateway: {connectedGateway === 'krypt' ? 'KryptGateway' : 'AbacatePay'} ✓
              </span>
            )}
          </motion.div>

          {/* Sections */}
          {sections.map((section, si) => (
            <div key={si} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">{section.title}</h3>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {(section.items as Array<{ icon: any; label: string; color?: string; onClick?: () => void }>).map((item, ii) => (
                  <button
                    key={ii}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between px-4 py-3.5 ${
                      ii < section.items.length - 1 ? 'border-b border-gray-50' : ''
                    } active:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={item.color || 'text-gray-500'} />
                      <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          {!showLogout ? (
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-semibold text-sm rounded-2xl bg-white shadow-sm active:bg-gray-50 transition-colors"
            >
              <LogOut size={18} /> Sair
            </button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-red-50 border border-red-100">
              <p className="text-sm text-red-700 mb-3 text-center">Tem certeza que deseja sair?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl text-sm"
                >
                  Sim, sair
                </button>
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-3 bg-white text-gray-700 font-semibold rounded-xl text-sm border border-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </div>
        <BottomNav />
      </div>
    </div>
  )
}
