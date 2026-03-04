export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server'
import { sendFilmReserveEmail } from '@/lib/email/smtp'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { checkRateLimit } from '@/lib/security/rateLimit'

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown'

    // 1. Проверка частоты запросов
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      )
    }

    // 2. Читаем данные как FormData
    const formData = await req.formData()
    
    // Honeypot (защита от простейших ботов)
    if (formData.get('website')) {
      return NextResponse.json({ success: true })
    }

    const fullName = String(formData.get('fullName') || '').trim()
    const contacts = String(formData.get('contacts') || '').trim()
    const professionalInfo = String(formData.get('professionalInfo') || '').trim()
    const token = String(formData.get('turnstileToken') || '').trim()
    const file = formData.get('file') as File | null

    // 3. Валидация
    if (!fullName || !contacts || !professionalInfo) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: 'Подтвердите, что вы не робот' }, { status: 400 })
    }

    const isValidCaptcha = await verifyTurnstile(token)
    if (!isValidCaptcha) {
      return NextResponse.json({ error: 'Капча не пройдена' }, { status: 400 })
    }

    // 4. Обработка файла
    let attachment = null
    if (file && file.size > 0) {
      // Лимит 10 МБ
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'Файл слишком большой (макс. 10МБ)' }, { status: 400 })
      }
      
      const arrayBuffer = await file.arrayBuffer()
      attachment = {
        filename: file.name,
        content: Buffer.from(arrayBuffer),
      }
    }

    // 5. Отправка
    await sendFilmReserveEmail({
      fullName,
      contacts,
      professionalInfo,
      attachment,
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('--- ПОЛНАЯ ОШИБКА API ---')
    console.error(error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}