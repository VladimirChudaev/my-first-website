import { NextRequest, NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories/MediaRepository';

type Params = { id: string };

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    
    // Обновляем категорию через репозиторий
    const result = await MediaRepository.update(id, body);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    await MediaRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}