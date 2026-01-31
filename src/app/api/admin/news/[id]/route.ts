import { NextRequest, NextResponse } from 'next/server';

type Params = {
  id: string;
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  return NextResponse.json({ data: null });
}

export async function PUT(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  return NextResponse.json({ data: null });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  return NextResponse.json({ success: true });
}
