import { NextRequest, NextResponse } from 'next/server';
import {
  getNewsById,
  updateNewsById,
  deleteNewsById,
} from '@/lib/news/service';

type Params = { id: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const result = await getNewsById(id);
  
  if (!result.data) {
    return NextResponse.json({ error: 'News not found' }, { status: 404 });
  }
  
  return NextResponse.json(result);
}

// PATCH теперь корректно обработает created_at, так как мы передаем весь body в сервис
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await updateNewsById(id, body);
    
    if (!result.data) {
      return NextResponse.json({ error: 'Update failed' }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const result = await deleteNewsById(id);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}