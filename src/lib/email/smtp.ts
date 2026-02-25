// src/lib/email/smtp.ts
import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    throw new Error('SMTP environment variables are not properly configured')
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    // true для 465, false для 587
    secure: Number(port) === 465, 
    auth: {
      user,
      pass,
    },
    tls: {
      // Игнорируем ошибки сертификатов для стабильной работы на localhost
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
  })

  return transporter
}

export async function sendFilmReserveEmail(payload: {
  fullName: string
  contacts: string
  professionalInfo: string
  attachment?: { filename: string, content: Buffer } | null
}) {
  const from = process.env.SMTP_FROM
  if (!from) {
    throw new Error('SMTP_FROM is not configured')
  }

  const transport = getTransporter()

  await transport.sendMail({
    from,
    to: 'info@vtagency.ru',
    subject: 'Новая заявка — Film Reserve (с вложением)',
    text: `
ФИО: ${payload.fullName}
Контакты: ${payload.contacts}
Профессиональная информация:
${payload.professionalInfo}
    `,
    html: `
      <h2>Новая заявка — Film Reserve</h2>
      <p><strong>ФИО:</strong> ${payload.fullName}</p>
      <p><strong>Контакты:</strong> ${payload.contacts}</p>
      <p><strong>Профессиональная информация:</strong></p>
      <p>${payload.professionalInfo.replace(/\n/g, '<br/>')}</p>
    `,
    // Если файл есть — прикрепляем, если нет — отправляем пустой массив
    attachments: payload.attachment ? [payload.attachment] : [],
  })
}