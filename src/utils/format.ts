export function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR')
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleString('pt-BR')
}

export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Agora mesmo'
  if (mins < 60) return `Há ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Há ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `Há ${days} dia${days > 1 ? 's' : ''}`
  return formatDate(dateStr)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

let transactionCounter = 0
export function generateId(): string {
  transactionCounter++
  return `gopay_${Date.now()}_${transactionCounter}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'paid': return 'text-green-500 bg-green-50'
    case 'pending': return 'text-yellow-500 bg-yellow-50'
    case 'expired': return 'text-gray-400 bg-gray-100'
    default: return 'text-gray-400 bg-gray-100'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'paid': return 'Pago'
    case 'pending': return 'Pendente'
    case 'expired': return 'Expirado'
    default: return 'Desconhecido'
  }
}
