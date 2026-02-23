import { NextResponse } from 'next/server';
import { HomeCarouselRepository } from '@/lib/repositories/HomeCarouselRepository';

export async function PATCH(req: Request) {
  try {
    const items = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Data must be an array' }, { status: 400 });
    }

    // Формируем чистый массив данных для upsert
    // Используем переданный position или индекс массива как запасной вариант
    const updateData = items.map((item: { id: string; position?: number }, index: number) => ({
      id: item.id,
      position: typeof item.position === 'number' ? item.position : index,
    }));

    await HomeCarouselRepository.reorder(updateData);

    return NextResponse.json({ 
      success: true, 
      updatedCount: updateData.length 
    });
  } catch (error: any) {
    console.error('API REORDER Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}