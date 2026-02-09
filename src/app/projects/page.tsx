import { ProjectsService } from '@/lib/services/ProjectsService';
import ProjectCarousel from '../components/ProjectCarousel';

export default async function ProjectsPage() {
  const allMedia = await ProjectsService.getProjectsWithMedia();

  const transformProject = (item: any) => ({
    id: String(item.id),
    title: item.title || 'Без названия',
    description: item.description || item.alt_text || '',
    author: item.credits || '',
    imageUrl: `https://hdrxoowpnhrschlonivc.supabase.co/storage/v1/object/public/${item.bucket}/${item.filename}`
  });

  const projectsOnly = allMedia.filter(m => m.category === 'project');

  const artData = projectsOnly.filter(m => m.filename?.startsWith('h_')).map(transformProject);
  const docData = projectsOnly.filter(m => m.filename?.startsWith('d_')).map(transformProject);
  const tvData = projectsOnly.filter(m => m.filename?.startsWith('t_')).map(transformProject);
  const bizData = projectsOnly.filter(m => m.filename?.startsWith('b_')).map(transformProject);

  return (
    // Заменили py-10 на pt-32 (отступ сверху) и pb-10 (отступ снизу)
    <main className="bg-white pt-32 pb-10">
      <div className="max-w-[1440px] mx-auto space-y-20 px-6">
        
        {artData.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Художественные проекты</h2>
            <ProjectCarousel projects={artData} />
          </section>
        )}

        {docData.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Документальные проекты</h2>
            <ProjectCarousel projects={docData} />
          </section>
        )}

        {tvData.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Телепроекты</h2>
            <ProjectCarousel projects={tvData} />
          </section>
        )}

        {bizData.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Кино для бизнеса</h2>
            <ProjectCarousel projects={bizData} />
          </section>
        )}

      </div>
    </main>
  );
}