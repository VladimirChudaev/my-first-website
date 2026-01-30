import { NextRequest, NextResponse } from 'next/server';
import { getContentById } from '@/lib/content/service';

type Params = {
  id: string;
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  const result = await getContentById(id);

  return NextResponse.json(result);
}
