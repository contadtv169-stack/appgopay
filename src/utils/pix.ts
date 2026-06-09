function crc16(str: string): string {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i)
    for (let j = 0; j < 8; j++) {
      if (crc & 1) { crc = (crc >> 1) ^ 0x8408 } else { crc >>= 1 }
    }
  }
  return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4)
}

function emv(tag: string, value: string | number): string {
  const str = String(value)
  return tag + String(str.length).padStart(2, '0') + str
}

const PIX_GUI = '0014BR.GOV.BCB.PIX'

const KEY_TYPE_MAP: Record<string, string> = {
  cpf: '01', cnpj: '02', email: '03', phone: '04', random: '05',
}

export function getKeyType(key: string): string {
  if (/^\d{11}$/.test(key)) return 'cpf'
  if (/^\d{14}$/.test(key)) return 'cnpj'
  if (/^.+@.+$/.test(key)) return 'email'
  if (/^\+?\d{10,15}$/.test(key)) return 'phone'
  return 'invalid'
}

export function generatePixPayload(opts: {
  key: string
  amount?: number
  description?: string
  txid?: string
  name?: string
  city?: string
}): string {
  const keyType = getKeyType(opts.key)
  if (keyType === 'invalid') return ''

  const merchantAccount = emv('00', PIX_GUI) + emv(KEY_TYPE_MAP[keyType], opts.key)
  const merchantName = (opts.name || 'GoPay').substring(0, 25)
  const merchantCity = (opts.city || 'Brazil').substring(0, 15)
  const txId = (opts.txid || '***').substring(0, 35)

  let payload = '000201'
  payload += emv('26', merchantAccount)
  payload += '52040000'
  payload += '5303986'

  if (opts.amount && opts.amount > 0) {
    payload += emv('54', opts.amount.toFixed(2))
  }

  payload += '5802BR'
  payload += emv('59', merchantName)
  payload += emv('60', merchantCity)
  payload += emv('62', emv('05', txId))
  payload += '6304'

  return payload + crc16(payload)
}
