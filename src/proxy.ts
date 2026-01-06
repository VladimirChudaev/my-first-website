import { updateSession } from './lib/middleware'
import type { NextRequest } from 'next/server'

// Экспорт по умолчанию (Default Export)
export default async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}