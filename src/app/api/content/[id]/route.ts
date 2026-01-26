import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: null });
}

export async function PATCH() {
  return NextResponse.json({ data: null });
}

export async function DELETE() {
  return NextResponse.json(null, { status: 204 });
}
