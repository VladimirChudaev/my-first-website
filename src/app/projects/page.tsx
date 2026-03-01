import { ProjectsService } from '@/lib/services/ProjectsService';
import ProjectCarousel from '../components/ProjectCarousel';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { createClient } from '@/lib/server';

export const revalidate = 0;

export default async function ProjectsPage() {
  const supabase = await createClient();
  const allMedia = await ProjectsService.getProjectsWithMedia();
  
  // Запрашиваем ВСЕ блоки для этой страницы без фильтрации по visibility (пока тестим)
  const { data: contentBlocks } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'projects');

  const getBlock = (key: string) => contentBlocks?.find(b => b.section_key === key) || {};

  const transformProject = (item: any) => ({
    id: String(item.id),
    title: item.title || '', 
    description: item.description || item.alt_text || '',
    author: item.credits || '',
    // Возвращаю твой оригинальный способ формирования ссылки
    imageUrl: `https://hdrxoowpnhrschlonivc.supabase.co/storage/v1/object/public/${item.bucket}/${item.filename}`
  });

  const projectsOnly = allMedia.filter(m => m.category === 'project');

  const sections = [
    { key: 'h', data: projectsOnly.filter(m => m.filename?.startsWith('h_')).map(transformProject) },
    { key: 'd', data: projectsOnly.filter(m => m.filename?.startsWith('d_')).map(transformProject) },
    { key: 't', data: projectsOnly.filter(m => m.filename?.startsWith('t_')).map(transformProject), isTv: true },
    { key: 'b', data: projectsOnly.filter(m => m.filename?.startsWith('b_')).map(transformProject) },
  ];

  return (
    <>
      <InnerPageHeader />
      <main className="bg-white min-h-screen">
        {sections.map((section) => {
          const block = getBlock(section.key);
          if (section.data.length === 0) return null;

          // Возвращаю твою логику цвета
          const colorMatch = (block.bg_color || '').match(/#[a-fA-F0-9]{3,6}/);
          const cleanHex = colorMatch ? colorMatch[0] : null;

          return (
            <section 
              key={section.key} 
              id={section.key} 
              // Возвращаю оригинальные стили и подложки
              style={cleanHex ? { backgroundColor: cleanHex } : {}}
              className="py-16 md:py-24 border-b border-gray-100 transition-colors duration-500"
            >
              <div className="max-w-[1440px] mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start mb-16">
                  <div className="w-full md:w-1/3">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-gray-900 leading-tight">
                      {block.title || 'Загрузка...'}
                    </h2>
                  </div>

                  {/* Вертикальная черта (разделитель) */}
                  {block.title && (
                    <div className="hidden md:block w-px h-20 bg-gray-300 self-center"></div>
                  )}

                  <div className="w-full md:w-2/3">
                    <div 
                      className="text-base md:text-lg text-gray-700 leading-relaxed font-light prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: block.body || '' }}
                    />
                  </div>
                </div>
                {/* Карусель проектов */}
                <ProjectCarousel projects={section.data} isTvCarousel={section.isTv} />
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}