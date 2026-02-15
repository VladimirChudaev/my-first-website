import { NextResponse } from 'next/server'
import { createClient } from '@/lib/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('awards')
    .select(`
      id,
      created_at,
      title,
      festival,
      status,
      description,
      position,
      is_visible,
      media_id,
      media!awards_media_id_fkey (
        id,
        filename
      )
    `)
    .order('position', { ascending: true })

  if (error) {
    console.error('AWARDS GET ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('awards')
    .insert([body])
    .select()

  if (error) {
    console.error('AWARDS POST ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { id, ...updates } = await request.json()

  const { data, error } = await supabase
    .from('awards')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('AWARDS PATCH ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { id } = await request.json()

  const { error } = await supabase
    .from('awards')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('AWARDS DELETE ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}