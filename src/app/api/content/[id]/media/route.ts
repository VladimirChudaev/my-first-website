// app/api/content/[id]/media/route.ts

import { NextResponse } from 'next/server';
import { ContentMediaService } from '@/lib/content/ContentMediaService';

const service = new ContentMediaService();

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const data = await service.list(params.id);
  return NextResponse.json({ data });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  await service.attach(params.id, body.mediaId, body.position);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  await service.detach(params.id, body.mediaId);
  return NextResponse.json(null, { status: 204 });
}
