import { NextRequest, NextResponse } from 'next/server';
import { getNewsById } from '@/lib/news/service';

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
