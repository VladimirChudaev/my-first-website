import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Используй сервисный ключ для админки
);

type Params = { id: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const { data, error } = await supabase.from('page_content').select('*').eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const body = await req.json();
  
  // Обновляем только те поля, которые реально есть в базе
  const { data, error } = await supabase
    .from('page_content')
    .update({
      title: body.title,
      body: body.body,
      is_visible: body.is_visible,
      page: body.page,
      section_key: body.section_key
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const { error } = await supabase.from('page_content').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}