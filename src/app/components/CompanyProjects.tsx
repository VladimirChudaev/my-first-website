'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type ProjectBlock = {
  id: string;
  title: string;
  content: string;
  href: string;
  bgColor?: string;
};

type AboutSection = {
  title: string;
  body: string;
};

const fallbackProjects: ProjectBlock[] = [
  { id: 'h', title: 'Художественное кино', bgColor: 'bg-[#f0f7ff]', content: 'Мы специализируемся на создании художественных фильмов и сериалов...', href: '/projects#h' },
  { id: 'd', title: 'Документальное кино', bgColor: 'bg-[#fffaf0]', content: 'За время творческой деятельности нашей командой снято более двух десятков документальных лент...', href: '/projects#d' },
  { id: 't', title: 'Телевизионные проекты', bgColor: 'bg-[#f0fff4]', content: 'Мы имеем богатый опыт работы в производстве телевизионного контента...', href: '/projects#t' },
  { id: 'b', title: 'Кино для бизнеса', bgColor: 'bg-[#f5f5f7]', content: 'Презентационные фильмы — еще одно направление работы нашей компании...', href: '/projects#b' },
];

export default function CompanyProjects() {
  const [projects, setProjects] = useState<ProjectBlock[]>(fallbackProjects);
  const [about, setAbout] = useState<AboutSection>({
    title: 'Кинокомпания V&T Agency',
    body: 'Более 25 лет мы уверенно развиваемся в мире кино- и телеиндустрии, создавая художественные, документальные и презентационные фильмы, а также работая над сериалами.'
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        // 1. Загружаем блоки проектов для карточек
        const resProjects = await fetch('/api/pages/projects');
        const jsonProjects = await resProjects.json();

        // 2. Загружаем текст "О компании" для заголовка
        const resHome = await fetch('/api/pages/home');
        const jsonHome = await resHome.json();

        if (cancelled) return;

        // Обновляем карточки проектов
        if (Array.isArray(jsonProjects.data) && jsonProjects.data.length > 0) {
          setProjects(
            jsonProjects.data.map((item: any) => ({
              id: item.section_key,
              title: item.title,
              content: item.body,
              href: `/projects#${item.section_key}`,
              bgColor: item.bg_color ?? 'bg-[#f5f5f7]',
            }))
          );
        }

        // Обновляем заголовок "О компании"
        const aboutData = jsonHome.data?.find((b: any) => b.section_key === 'about_company');
        if (aboutData) {
          setAbout({
            title: aboutData.title,
            body: aboutData.body
          });
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-white pb-12 md:pb-20">
      <div className="w-full border-t border-gray-100 mb-10 md:mb-16"></div>

      <div className="container mx-auto px-5 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto mb-12 md:mb-20 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-900 leading-tight">
            {about.title}
          </h2>
          <p className="text-gray-600 text-base md:text-xl leading-relaxed font-light">
            {about.body}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className={`${project.bgColor} p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-center min-h-[250px] md:min-h-[300px] transition-all hover:shadow-md hover:-translate-y-1 duration-300 block cursor-pointer`}
            >
              <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 uppercase tracking-wider">
                {project.title}
              </h3>
              <p className="text-gray-700 text-sm md:text-lg leading-relaxed opacity-90">
                {project.content}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}