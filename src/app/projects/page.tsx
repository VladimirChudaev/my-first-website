'use client';

import { useState, useEffect } from 'react';
import InnerPageHeader from '@/components/InnerPageHeader';
import ProjectCarousel from '@/components/ProjectCarousel';
import { mediaService } from '@/lib/services/MediaService';

export default function ProjectsPage() {
  const [projectsWithUrls, setProjectsWithUrls] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const staticProjects = {
    art: [
      { title: "Агитбригада", author: "Александр Борисов", description: "Короткометражная драма...", image: "/h_agitbrigada.png" },
      { title: "Угрюмка", author: "Екатерина Тимошенко", description: "Комедийная драма...", image: "/h_ugryumka.png" },
      { title: "Волшебные валенки Деда Мороза", author: "Вероника Новоселова", description: "Это добрая история...", image: "/h_valenki.png" },
      { title: "Осторожно! Работает лифт!", author: "", description: "Компания готовится...", image: "/h_lift.png" }
    ],
    documentary: [
      { title: "Муслюмовский эксперимент", author: "Роберт Карапетян", description: "Муслюмово - расселенная деревня...", image: "/d_Muslumovo.png" },
      { title: "Дорога Жизни", author: "Роберт Карапетян", description: "Фильм про Алапаевскую узкоколейку...", image: "/d_doroga.png" },
      { title: "Три жены", author: "Юлия Ершова", description: "Фильм рассказывает о женах...", image: "/d_tri_zhenyi.png" }
    ],
    tv: [
      { title: "", author: "", description: "Социальная проблематика...", image: "/t_reporter_pro.png" },
      { title: "", author: "", description: "В сфере культуры...", image: "/t_diploms.png" },
      { title: "", author: "", description: "Материалы о культурных событиях...", image: "/t_TEFI_r.png" }
    ],
    business: [
      { title: "Государственные учреждения", author: "", description: "Компания много лет работает...", image: "/b_organs.png" },
      { title: "Презентационные фильмы", author: "", description: "Презентационные фильмы...", image: "/b_kino_from_biz.png" },
      { title: "Культурные проекты", author: "", description: "Проекты для учреждений культуры...", image: "/b_Theater_projects.png" }
    ]
  };

  useEffect(() => {
    const loadAndMergeData = async () => {
      try {
        // 1. Получаем все медиа из категории 'project'
        const allProjectMedia = await mediaService.getByDomain('project');

        // 2. Создаем словарь: "имя_файла" -> "публичный_URL"
        const urlDictionary: Record<string, string> = {};
        
        if (Array.isArray(allProjectMedia)) {
          allProjectMedia.forEach(item => {
            // Извлекаем имя файла (н-р: "project/h_agitbrigada.png" -> "h_agitbrigada.png")
            const fileName = item.path.split('/').pop();
            if (fileName) {
              urlDictionary[fileName] = mediaService.getPublicUrl(item.path);
            }
          });
        }

        // 3. Функция для объединения статики и данных из БД
        const merge = (list: any[]) => list.map(project => {
          const fileName = project.image.replace(/^\//, ''); // убираем "/" из "/h_agitbrigada.png"
          return {
            ...project,
            // Если нашли в БД — берем URL оттуда, иначе оставляем локальный путь
            image: urlDictionary[fileName] || project.image 
          };
        });

        setProjectsWithUrls({
          art: merge(staticProjects.art),
          documentary: merge(staticProjects.documentary),
          tv: merge(staticProjects.tv),
          business: merge(staticProjects.business)
        });
      } catch (error) {
        console.error('Ошибка маппинга проектов:', error);
        setProjectsWithUrls(staticProjects);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndMergeData();
  }, []);

  if (isLoading || !projectsWithUrls) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Загрузка проектов...</p>
      </div>
    );
  }

  return (
    <>
      <InnerPageHeader />
      <main className="min-h-screen bg-white py-12 md:py-24">
        {/* Секция: Художественное кино */}
        <section id="art" className="mb-16 md:mb-24 bg-[#f0f7ff] py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
              <div className="md:w-1/2 pr-8">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Художественное кино</h2>
              </div>
              <div className="hidden md:block w-px bg-black mx-4 h-12"></div>
              <div className="md:w-1/2 pl-8">
                <p className="text-lg text-gray-700">Мы специализируемся на создании художественных фильмов и сериалов — от социальных драм до исторических альманахов.</p>
              </div>
            </div>
            <ProjectCarousel projects={projectsWithUrls.art} />
          </div>
        </section>

        {/* Секция: Документальное кино */}
        <section id="documentary" className="mb-16 md:mb-24 bg-[#fffaf0] py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
              <div className="md:w-1/2 pr-8">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Документальное кино</h2>
              </div>
              <div className="hidden md:block w-px bg-black mx-4 h-12"></div>
              <div className="md:w-1/2 pl-8">
                <p className="text-lg text-gray-700">За время деятельности снято более двух десятков документальных лент, отмеченных премиями.</p>
              </div>
            </div>
            <ProjectCarousel projects={projectsWithUrls.documentary} />
          </div>
        </section>

        {/* Секция: ТВ */}
        <section id="tv" className="mb-16 md:mb-24 bg-[#f0fff4] py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
              <div className="md:w-1/2 pr-8">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Телевизионные проекты</h2>
              </div>
              <div className="hidden md:block w-px bg-black mx-4 h-12"></div>
              <div className="md:w-1/2 pl-8">
                <p className="text-lg text-gray-700">Богатый опыт производства контента для ведущих телеканалов России, включая работы ТЭФИ.</p>
              </div>
            </div>
            <ProjectCarousel projects={projectsWithUrls.tv} isTvCarousel={true} />
          </div>
        </section>

        {/* Секция: Бизнес */}
        <section id="business" className="bg-[#f5f5f7] py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
              <div className="md:w-1/2 pr-8">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Кино для бизнеса</h2>
              </div>
              <div className="hidden md:block w-px bg-black mx-4 h-12"></div>
              <div className="md:w-1/2 pl-8">
                <p className="text-lg text-gray-700">Презентационные фильмы для выставок и корпоративных задач наших партнеров.</p>
              </div>
            </div>
            <ProjectCarousel projects={projectsWithUrls.business} />
          </div>
        </section>
      </main>
    </>
  );
}