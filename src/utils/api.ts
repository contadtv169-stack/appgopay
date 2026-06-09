const KRYPT_BASE = 'https://kryptgateway.netlify.app'
const PIXGO_BASE = 'https://pixgo.org/api/v1'

export async function testKryptConnection(ci: string, cs: string) {
  const res = await fetch(`${KRYPT_BASE}/api/gateway/balance`, {
    headers: { ci, cs, 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || `Erro ${res.status}: falha ao conectar`)
  }
  return res.json()
}

export async function fetchBalance(ci: string, cs: string) {
  const res = await fetch(`${KRYPT_BASE}/api/gateway/balance`, {
    headers: { ci, cs, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Erro ao buscar saldo')
  return res.json()
}

export async function createPixCharge(
  ci: string,
  cs: string,
  amount: number,
  description: string
) {
  const res = await fetch(`${KRYPT_BASE}/api/gateway/pix-create`, {
    method: 'POST',
    headers: { ci, cs, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, payerName: 'Link GoPay', payerDocument: '00000000000', description }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || `Erro ${res.status}: falha ao criar cobrança`)
  }
  return res.json()
}

export async function fetchPixStatus(ci: string, cs: string, transactionId: string) {
  const res = await fetch(`${KRYPT_BASE}/api/gateway/pix-status?transactionId=${transactionId}`, {
    headers: { ci, cs, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Erro ao buscar status')
  return res.json()
}

export async function pixgoCreatePayment(apiKey: string, amount: number, description: string, externalId: string) {
  const res = await fetch(`${PIXGO_BASE}/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify({ amount, description, external_id: externalId }),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message || json.error || 'Erro PixGo')
  return {
    transactionId: json.data.payment_id,
    qrCodeBase64: '',
    qrImageUrl: json.data.qr_image_url || '',
    copyPaste: json.data.qr_code || '',
    pixCode: json.data.qr_code || '',
    status: json.data.status || 'pending',
    expiresAt: json.data.expires_at || '',
  }
}
