import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'projects')
    .order('position', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { id, title, body: contentBody, bg_color } = body;

  // Если строка пустая после обрезки пробелов, записываем null
  const updateData = {
    title: title?.trim() || null,
    body: contentBody?.trim() || null,
    bg_color: bg_color || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('page_content')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('PATCH PROJECTS ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}