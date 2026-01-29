import { NextRequest, NextResponse } from 'next/server';

type Params = {
  id?: string;
};

export async function GET(
  _req: NextRequest,
  context: { params: Params }
) {
  return NextResponse.json({ data: null });
}
