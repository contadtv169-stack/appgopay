export interface User {
  name: string
  email: string
}

export interface CheckoutCustomization {
  bannerTitle?: string
  bannerSubtitle?: string
  bannerColor?: string
  videoUrl?: string
  showQuiz?: boolean
  showReviews?: boolean
  showCountdown?: boolean
  primaryColor?: string
  logoText?: string
}

export type GatewayType = 'krypt' | 'abacate' | 'pixgo' | 'pixkey'

export interface Link {
  id: string
  slug: string
  url: string
  amount: number
  description: string
  status: 'active' | 'expired'
  expiration: string
  transactionId: string
  payments: number
  views: number
  qrCodeBase64?: string
  copyPaste?: string
  paymentLink?: string
  createdAt: string
  checkout?: CheckoutCustomization
}

export interface Notification {
  id: string
  type: 'payment_received' | 'link_created' | 'link_expired' | 'gateway_connected'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface BalanceData {
  balance: number
  availableBalance: number
  totalReceived: number
  totalWithdrawn: number
  totalFees: number
  transactionsCount: number
  currency: string
}

export interface PixCreateResponse {
  success: boolean
  data: {
    transactionId: string
    amount: number
    fee: number
    netAmount: number
    status: string
    qrCodeBase64: string
    qrCodeUrl?: string
    copyPaste: string
    paymentLink: string
    expiresAt: string
  }
}
