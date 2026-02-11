import { ProjectsService } from '@/lib/services/ProjectsService';
import ProjectCarousel from '../components/ProjectCarousel';
import InnerPageHeader from '@/app/components/InnerPageHeader';
import { createClient } from '@/lib/server'; // Проверь путь к серверному клиенту Supabase

export default async function ProjectsPage() {
  const supabase = await createClient();
  
  // 1. Загружаем проекты из Media
  const allMedia = await ProjectsService.getProjectsWithMedia();
  
  // 2. Загружаем тексты и настройки из новой таблицы page_content
  const { data: contentBlocks } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'projects');

  const getBlock = (key: string) => contentBlocks?.find(b => b.section_key === key) || {};

  const transformProject = (item: any) => ({
    id: String(item.id),
    title: item.title || 'Без названия',
    description: item.description || item.alt_text || '',
    author: item.credits || '',
    imageUrl: `https://hdrxoowpnhrschlonivc.supabase.co/storage/v1/object/public/${item.bucket}/${item.filename}`
  });

  const projectsOnly = allMedia.filter(m => m.category === 'project');

  // Группируем данные
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

          return (
            <section 
              key={section.key} 
              id={section.key} 
              className={`${block.bg_color || 'bg-white'} py-16 md:py-24 border-b border-gray-100`}
            >
              <div className="max-w-[1440px] mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start mb-16">
                  <div className="w-full md:w-1/3">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-gray-900 leading-tight">
                      {block.title || 'Заголовок не задан'}
                    </h2>
                  </div>
                  <div className="hidden md:block w-px h-20 bg-gray-300 self-center"></div>
                  <div className="w-full md:w-2/3">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed font-light">
                      {block.body || 'Описание не заполнено в админке.'}
                    </p>
                  </div>
                </div>
                <ProjectCarousel projects={section.data} isTvCarousel={section.isTv} />
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}