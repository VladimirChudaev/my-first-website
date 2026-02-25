// src/lib/services/filmReserve.service.ts
import { createClient } from '@/lib/server'

export type FilmReserveSectionKey = 'intro' | 'contact' | 'legal'

export interface FilmReserveSection {
  id: string
  page: string
  section_key: FilmReserveSectionKey
  title: string | null
  body: string | null
  bg_color: string | null
  position: number | null
  is_visible: boolean
}

export interface FilmReservePhoto {
  id: string
  filename: string
  url: string | null
  alt_text: string | null
  width: number | null
  height: number | null
  position: number | null
}

export async function getFilmReserveSections(): Promise<FilmReserveSection[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'film-reserve')
    .eq('is_visible', true)
    .order('position', { ascending: true })

  if (error) {
    console.error('FilmReserveSections error:', error.message)
    return []
  }

  return (data ?? []) as FilmReserveSection[]
}

export async function getFilmReservePhotos(): Promise<FilmReservePhoto[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('media')
    .select('id, filename, url, alt_text, width, height, position')
    .eq('category', 'photo')
    .eq('is_visible', true)
    .order('position', { ascending: true })

  if (error) {
    console.error('FilmReservePhotos error:', error.message)
    return []
  }

  return (data ?? []) as FilmReservePhoto[]
}