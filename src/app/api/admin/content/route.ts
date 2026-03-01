import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Запрещаем кэширование, чтобы изменения в базе сразу были видны в админке
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    /**
     * Исключаем страницы, у которых есть свои специализированные редакторы.
     * Используем точные значения из твоей базы: "projects" и "film-reserve"
     */
    .not('page', 'in', '("projects","film-reserve")') 
    .order('page', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from('page_content')
    .insert([{
      title: body.title,
      page: body.page,
      section_key: body.section_key,
      body: body.body,
      is_visible: body.is_visible
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}