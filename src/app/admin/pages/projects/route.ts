import { NextRequest, NextResponse } from 'next/server';
import { MediaAsset } from '@/lib/media/types';

type Params = {
  id: string;
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: 'Missing content id' },
      { status: 400 }
    );
  }

  const data: MediaAsset[] = [];

  return NextResponse.json({ data });
}
