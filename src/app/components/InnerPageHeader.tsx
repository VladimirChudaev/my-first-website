'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { mediaService } from '@/lib/services/MediaService'

export default function InnerPageHeader() {
  const [bgUrl, setBgUrl] = useState<string>('')

  useEffect(() => {
    const loadBg = async () => {
      try {
        const assets = await mediaService.getByCategory('photo')
        const bg = assets.find(a => a.filename.toLowerCase().includes('header_bg'))
        if (bg) {
          setBgUrl(mediaService.getPublicUrl(bg.path ?? null))
        }
      } catch (e) {
        console.error('Ошибка фона:', e)
      }
    }
    loadBg()
  }, [])

  return (
    <section className="relative w-full h-[160px] md:h-[200px] bg-gray-200 overflow-hidden">
      {bgUrl && (
        <Image
          src={bgUrl}
          alt="header background"
          fill
          priority
          className="object-cover object-center"
        />
      )}
    </section>
  )
}