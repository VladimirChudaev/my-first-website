import { NextRequest, NextResponse } from 'next/server';

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
      { error: 'Missing news id' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    data: null,
  });
}

