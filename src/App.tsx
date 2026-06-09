import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Splash from './pages/app/Splash'
import Welcome from './pages/app/Welcome'
import Register from './pages/app/Register'
import Login from './pages/app/Login'
import ConnectGateway from './pages/app/ConnectGateway'
import Dashboard from './pages/app/Dashboard'
import CreateLink from './pages/app/CreateLink'
import LinkGenerated from './pages/app/LinkGenerated'
import LinksList from './pages/app/LinksList'
import LinkDetail from './pages/app/LinkDetail'
import LinkEdit from './pages/app/LinkEdit'
import Activity from './pages/app/Activity'
import Withdraw from './pages/app/Withdraw'
import Profile from './pages/app/Profile'
import Notifications from './pages/app/Notifications'
import NotificationPermission from './pages/app/NotificationPermission'
import Badges from './pages/app/Badges'
import CheckoutPage from './pages/app/CheckoutPage'
import { supabase } from './utils/supabase'
import { useAuthStore } from './stores/authStore'
import { useGatewayStore } from './stores/gatewayStore'
import { useLinksStore } from './stores/linksStore'
import { useNotificationsStore } from './stores/notificationsStore'
import { useBadgesStore } from './stores/badgesStore'

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useAuthStore()
  if (!initialized) return null
  if (!isAuthenticated) return <Navigate to="/splash" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated, initialized, initSession } = useAuthStore()
  const { loadGateway } = useGatewayStore()
  const { loadLinks } = useLinksStore()
  const { loadNotifications } = useNotificationsStore()
  const { checkBadges } = useBadgesStore()
  const { links } = useLinksStore()

  useEffect(() => {
    initSession()
  }, [initSession])

  useEffect(() => {
    if (isAuthenticated) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const uid = session?.user?.id
        if (uid) {
          loadGateway(uid)
          loadLinks(uid)
          loadNotifications(uid)
        }
      })
    }
  }, [isAuthenticated, loadGateway, loadLinks, loadNotifications])

  useEffect(() => {
    if (isAuthenticated) {
      const totalPayments = links.reduce((a, l) => a + l.payments, 0)
      const totalReceived = links.reduce((a, l) => a + l.amount * l.payments, 0)
      checkBadges(links.length, totalPayments, Math.round(totalReceived))
    }
  }, [isAuthenticated, links, checkBadges])

  if (!initialized) {
    return (
      <div className="phone-frame">
        <div className="phone-content min-h-screen bg-gopay-blue flex items-center justify-center">
          <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to="/splash" replace />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/connect-gateway" element={<AuthGate><ConnectGateway /></AuthGate>} />
          <Route path="/app/dashboard" element={<AuthGate><Dashboard /></AuthGate>} />
          <Route path="/app/create" element={<AuthGate><CreateLink /></AuthGate>} />
          <Route path="/app/link-generated/:id" element={<AuthGate><LinkGenerated /></AuthGate>} />
          <Route path="/app/links" element={<AuthGate><LinksList /></AuthGate>} />
          <Route path="/app/link-detail/:id" element={<AuthGate><LinkDetail /></AuthGate>} />
          <Route path="/app/link-edit/:id" element={<AuthGate><LinkEdit /></AuthGate>} />
          <Route path="/app/activity" element={<AuthGate><Activity /></AuthGate>} />
          <Route path="/app/withdraw" element={<AuthGate><Withdraw /></AuthGate>} />
          <Route path="/app/profile" element={<AuthGate><Profile /></AuthGate>} />
          <Route path="/app/notifications" element={<AuthGate><Notifications /></AuthGate>} />
          <Route path="/app/badges" element={<AuthGate><Badges /></AuthGate>} />
          <Route path="/checkout/:slug" element={<CheckoutPage />} />
          <Route path="/app" element={<Navigate to="/splash" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>

      {isAuthenticated && <NotificationPermission />}
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}
