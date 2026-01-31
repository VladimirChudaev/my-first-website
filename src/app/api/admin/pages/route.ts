import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return NextResponse.json({ data: [] });
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ data: null });
}
