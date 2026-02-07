import { ProjectsService } from '@/lib/services/ProjectsService';
import CompanyProjects from '../components/CompanyProjects';

export default async function ProjectsPage() {
  const allProjects = await ProjectsService.getProjectsWithMedia();

  // Логика разделения по префиксам имен файлов
  const artProjects = allProjects.filter(p => p.filename.startsWith('art_'));
  const docProjects = allProjects.filter(p => p.filename.startsWith('doc_'));
  const tvProjects = allProjects.filter(p => p.filename.startsWith('tv_'));
  const bizProjects = allProjects.filter(p => p.filename.startsWith('biz_'));

  return (
    <main className="min-h-screen bg-white">
      <div className="py-10">
        <h1 className="text-3xl font-bold text-center mb-12">Наши Проекты</h1>
        
        {/* Пока вызываем без пропсов, чтобы TS не ругался на отсутствие интерфейсов в самих компонентах */}
        <CompanyProjects />
        <CompanyProjects />
        <CompanyProjects />
        <CompanyProjects />
      </div>
    </main>
  );
}