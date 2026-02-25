'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        }
      ) => void
    }
  }
}

interface Props {
  onVerify: (token: string) => void
}

export default function TurnstileWidget({ onVerify }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scriptId = 'cf-turnstile-script'

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }

    const interval = setInterval(() => {
      if (window.turnstile && ref.current) {
        clearInterval(interval)

        window.turnstile.render(ref.current, {
          // ИСПРАВЛЕНО: Добавлено CLOUDFLARE в название переменной
          sitekey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!, 
          callback: (token: string) => {
            onVerify(token)
          },
          'expired-callback': () => {
            onVerify('')
          },
          'error-callback': () => {
            onVerify('')
          },
        })
      }
    }, 200)

    return () => clearInterval(interval)
  }, [onVerify])

  // Добавил минимальную высоту, чтобы виджет не "дергал" верстку при загрузке
  return <div ref={ref} className="min-h-[65px]" />
}