import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'home')
    .order('position', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { id, title, body, is_visible } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('page_content')
      .update({ 
        title, 
        body,
        is_visible 
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('PATCH error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}