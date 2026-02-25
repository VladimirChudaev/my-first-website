// src/lib/security/turnstile.ts
export async function verifyTurnstile(token: string): Promise<boolean> {
  // Пытаемся взять ключ под любым из двух имен
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    console.error('Ошибка: Секретный ключ Turnstile не найден в .env.local')
    throw new Error('TURNSTILE_SECRET_KEY is not configured')
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
      }
    )

    if (!response.ok) {
      console.error('Ошибка сети при проверке Turnstile:', response.statusText)
      return false
    }

    const data = await response.json()
    
    if (!data.success) {
      console.warn('Turnstile verification failed:', data['error-codes'])
    }

    return data.success === true
  } catch (error) {
    console.error('Ошибка в функции verifyTurnstile:', error)
    return false
  }
}