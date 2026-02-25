import { NextResponse } from 'next/server';
import { PageContentRepository } from '@/lib/repositories/PageContentRepository';

const PAGE = 'film-reserve';
const DEFAULT_SECTIONS = ['intro', 'contact', 'legal'];

export async function GET() {
  try {
    const data = await PageContentRepository.getByPage(PAGE);
    
    const existingKeys = new Set((data || []).map((b: any) => b.section_key));
    const missing = DEFAULT_SECTIONS.filter(key => !existingKeys.has(key));

    if (missing.length > 0) {
      const inserts = missing.map((key, index) => ({
        page: PAGE,
        section_key: key,
        title: key === 'intro' ? 'Заголовок' : '',
        body: '',
        position: (data?.length || 0) + index,
        is_visible: true,
      }));
      
      await PageContentRepository.createMany(inserts);
      const refreshed = await PageContentRepository.getByPage(PAGE);
      return NextResponse.json({ data: refreshed });
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    // Эта строка выведет реальную причину в терминал VS Code, если база ругнется
    console.error('SERVER ERROR:', e.message); 
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await PageContentRepository.update(body.id, {
      title: body.title,
      body: body.body,
      is_visible: body.is_visible,
      bg_color: body.bg_color
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}