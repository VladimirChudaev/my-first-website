import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

type Params = { id: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('page_content')
    .update({
      title: body.title,
      body: body.body,
      is_visible: body.is_visible,
      cover_image_id: body.cover_image_id
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from('page_content').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}