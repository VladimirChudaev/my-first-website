import InnerPageHeader from '@/app/components/InnerPageHeader';
import ProjectCarousel from '@/app/components/ProjectCarousel';
import { ProjectsService } from '@/lib/services/ProjectsService';

export default async function ProjectsPage() {
  // Получаем сгруппированные проекты с сервера
  const projectsWithUrls = await ProjectsService.getProjectsWithMedia();

  // Безопасная проверка наличия данных
  const artProjects = projectsWithUrls?.art || [];
  const docProjects = projectsWithUrls?.documentary || [];
  const tvProjects = projectsWithUrls?.tv || [];
  const bizProjects = projectsWithUrls?.business || [];

  return (
    <>
      <InnerPageHeader />
      <main className="min-h-screen bg-white py-12 md:py-24">
        
        {/* Секция: Художественное кино */}
        {artProjects.length > 0 && (
          <section id="art" className="mb-16 md:mb-24 bg-[#f0f7ff] py-12">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
                <div className="md:w-1/2 pr-8">
                  <h2 className="text-3xl font-bold uppercase tracking-wider text-gray-900">Художественное кино</h2>
                </div>
                <div className="hidden md:block w-px bg-gray-300 mx-4 h-12"></div>
                <div className="md:w-1/2 pl-8">
                  <p className="text-lg text-gray-700">Мы специализируемся на создании художественных фильмов и сериалов — от социальных драм до исторических альманахов.</p>
                </div>
              </div>
              <ProjectCarousel projects={artProjects} />
            </div>
          </section>
        )}

        {/* Секция: Документальное кино */}
        {docProjects.length > 0 && (
          <section id="documentary" className="mb-16 md:mb-24 bg-[#fffaf0] py-12">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
                <div className="md:w-1/2 pr-8">
                  <h2 className="text-3xl font-bold uppercase tracking-wider text-gray-900">Документальное кино</h2>
                </div>
                <div className="hidden md:block w-px bg-gray-300 mx-4 h-12"></div>
                <div className="md:w-1/2 pl-8">
                  <p className="text-lg text-gray-700">За время деятельности снято более двух десятков документальных лент, отмеченных премиями.</p>
                </div>
              </div>
              <ProjectCarousel projects={docProjects} />
            </div>
          </section>
        )}

        {/* Секция: ТВ */}
        {tvProjects.length > 0 && (
          <section id="tv" className="mb-16 md:mb-24 bg-[#f0fff4] py-12">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
                <div className="md:w-1/2 pr-8">
                  <h2 className="text-3xl font-bold uppercase tracking-wider text-gray-900">Телевизионные проекты</h2>
                </div>
                <div className="hidden md:block w-px bg-gray-300 mx-4 h-12"></div>
                <div className="md:w-1/2 pl-8">
                  <p className="text-lg text-gray-700">Богатый опыт производства контента для ведущих телеканалов России, включая работы ТЭФИ.</p>
                </div>
              </div>
              <ProjectCarousel projects={tvProjects} isTvCarousel={true} />
            </div>
          </section>
        )}

        {/* Секция: Бизнес */}
        {bizProjects.length > 0 && (
          <section id="business" className="bg-[#f5f5f7] py-12">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
                <div className="md:w-1/2 pr-8">
                  <h2 className="text-3xl font-bold uppercase tracking-wider text-gray-900">Кино для бизнеса</h2>
                </div>
                <div className="hidden md:block w-px bg-gray-300 mx-4 h-12"></div>
                <div className="md:w-1/2 pl-8">
                  <p className="text-lg text-gray-700">Презентационные фильмы для выставок и корпоративных задач наших партнеров.</p>
                </div>
              </div>
              <ProjectCarousel projects={bizProjects} />
            </div>
          </section>
        )}

        {/* Если вообще нет проектов */}
        {[artProjects, docProjects, tvProjects, bizProjects].every(arr => arr.length === 0) && (
          <div className="text-center py-20 text-gray-500">
            Проекты загружаются или временно отсутствуют.
          </div>
        )}
      </main>
    </>
  );
}