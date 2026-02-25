'use client'

import { useState, useRef } from 'react'
import TurnstileWidget from './TurnstileWidget'

interface Props {
  legalSection: {
    title: string | null
    body: string | null
  } | null
}

export default function FilmReserveForm({ legalSection }: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [file, setFile] = useState<File | null>(null)
  
  // Реф для очистки поля выбора файла
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Используем встроенный конструктор FormData из формы
    const formElement = e.currentTarget
    const formData = new FormData(formElement)

    // Добавляем токен капчи и файл вручную
    formData.append('turnstileToken', token)
    if (file) {
      formData.append('file', file)
    }

    try {
      const res = await fetch('/api/film-reserve', {
        method: 'POST',
        // ВАЖНО: headers с 'Content-Type' указывать НЕ НУЖНО, 
        // браузер сам установит multipart/form-data
        body: formData, 
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка отправки')
      }

      setSuccess(true)
      formElement.reset()
      setToken('')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xl font-semibold text-black">
            Заявка успешно отправлена.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-4 text-sm underline"
          >
            Отправить еще одну
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="website"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label className="block mb-2 text-black font-medium">Фамилия, Имя, Отчество полностью</label>
            <input
              name="fullName"
              required
              className="w-full border border-gray-300 px-4 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block mb-2 text-black font-medium">Контакты (телефон, email)</label>
            <input
              name="contacts"
              required
              className="w-full border border-gray-300 px-4 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block mb-2 text-black font-medium">
              Профессиональная информация
            </label>
            <textarea
              name="professionalInfo"
              required
              rows={4}
              className="w-full border border-gray-300 px-4 py-2 outline-none focus:border-black"
            />
          </div>

          {/* НОВОЕ ПОЛЕ: ЗАГРУЗКА ФАЙЛА */}
          <div>
            <label className="block mb-2 text-black font-medium">
              Резюме / Портфолио (PDF, DOCX)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-black file:text-white cursor-pointer"
            />
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" name="consent" required className="mt-1" />
            <div className="text-sm text-black">
              {legalSection?.body ? (
                <span
                  dangerouslySetInnerHTML={{ __html: legalSection.body }}
                />
              ) : (
                'Я даю согласие на обработку персональных данных'
              )}
            </div>
          </div>

          <TurnstileWidget onVerify={setToken} />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-black text-white py-3 font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </section>
  )
}