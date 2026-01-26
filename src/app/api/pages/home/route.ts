// app/api/pages/home/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('page', 'home')
    .order('position', { ascending: true });

  if (error) throw error;
  return NextResponse.json({ data });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const { error } = await supabase
    .from('content')
    .upsert(body, { onConflict: 'id' });

  if (error) throw error;
  return NextResponse.json({ ok: true });
}
