import { NextRequest, NextResponse } from 'next/server';
import {
  getNewsById,
  updateNewsById,
  deleteNewsById,
} from '@/lib/news/service';

type Params = {
  id: string;
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  const result = await getNewsById(id);
  return NextResponse.json(result);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const result = await updateNewsById(id, body);
  return NextResponse.json(result);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  await deleteNewsById(id);
  return NextResponse.json({ success: true });
}
