/**
 * Read the single client address written by the trusted Nginx Proxy Manager.
 * Do not fall back to X-Forwarded-For: clients can supply a spoofed chain
 * unless every proxy in front is configured to overwrite it.
 */
export function getTrustedProxyIp(request: Request): string | undefined {
  const ip = request.headers.get('x-real-ip')?.trim()

  if (!ip || ip.includes(',')) return undefined

  return ip
}
