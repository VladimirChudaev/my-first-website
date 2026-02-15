import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  for (const item of body) {
    const { error } = await supabase
      .from('awards')
      .update({ position: item.position })
      .eq('id', item.id);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
