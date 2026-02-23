import { NextResponse } from 'next/server';
import { HomeCarouselRepository } from '@/lib/repositories/HomeCarouselRepository';

export async function GET() {
  try {
    // Важно: Repository.getAll() должен внутри иметь .order('position', { ascending: true })
    const data = await HomeCarouselRepository.getAll();
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('API GET Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.media_id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }
    const data = await HomeCarouselRepository.create(body);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('API POST Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    const data = await HomeCarouselRepository.update(id, updates);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('API PATCH Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await HomeCarouselRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API DELETE Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}