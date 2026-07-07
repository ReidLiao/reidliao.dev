import { type NextRequest } from 'next/server'

export function getIP(request: Request | NextRequest): string {
  if ('ip' in request && request.ip) {
    return request.ip
  }

  let ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim()
  }

  if (ip === '::1') {
    return '127.0.0.1'
  }

  return ip
}
