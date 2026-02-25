import { NextResponse } from 'next/server'
import { sendFilmReserveEmail } from '@/lib/email/smtp'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Вызываем твою готовую функцию
    await sendFilmReserveEmail({
      fullName: body.fullName,
      contacts: `Email: ${body.email}, Тел: ${body.phone}`,
      professionalInfo: body.info
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}