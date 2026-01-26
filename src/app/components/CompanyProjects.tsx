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

const fallbackProjects: ProjectBlock[] = [
  {
    id: 'art',
    title: 'Художественное кино',
    bgColor: 'bg-[#f0f7ff]',
    content:
      'Мы специализируемся на создании художественных фильмов и сериалов — от социальных драм до исторических альманахов. Наша цель — снимать фильмы, которые затрагивают душу зрителя и становятся событием в киномире.',
    href: '/projects#art',
  },
  {
    id: 'documentary',
    title: 'Документальное кино',
    bgColor: 'bg-[#fffaf0]',
    content:
      'За время творческой деятельности нашей командой снято более двух десятков документальных лент, демонстрировавшихся в кинозалах и в телеэфире. Наша документальная линейка посвящена важным социальным, историческим и культурным темам.',
    href: '/projects#documentary',
  },
  {
    id: 'tv',
    title: 'Телевизионные проекты',
    bgColor: 'bg-[#f0fff4]',
    content:
      'Мы имеем богатый опыт работы в производстве телевизионного контента для ведущих телекомпаний России. В их числе — работы, получившие премию ТЭФИ. Наша команда создает яркий и запоминающийся видеоконтент.',
    href: '/projects#tv',
  },
  {
    id: 'business',
    title: 'Кино для бизнеса',
    bgColor: 'bg-[#f5f5f7]',
    content:
      'Презентационные фильмы — еще одно направление работы нашей компании. Наши фильмы регулярно используются на презентационных площадках в ходе различных выставок на стендах предприятий и корпораций.',
    href: '/projects#business',
  },
];

export default function CompanyProjects() {
  const [projects, setProjects] = useState<ProjectBlock[]>(fallbackProjects);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/content?page=projects', {
          cache: 'no-store',
        });
        if (!res.ok) return;

        const json = await res.json();
        if (!cancelled && Array.isArray(json.data) && json.data.length > 0) {
          setProjects(
            json.data.map((item: any) => ({
              id: item.slug,
              title: item.title,
              content: item.body,
              href: `/projects#${item.slug}`,
              bgColor: item.bgColor ?? 'bg-[#f5f5f7]',
            }))
          );
        }
      } catch {
        // fallback already applied
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white pb-12 md:pb-20">
      <div className="w-full border-t border-gray-100 mb-10 md:mb-16"></div>

      <div className="container mx-auto px-5 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto mb-12 md:mb-20 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-900 leading-tight">
            Кинокомпания V&amp;T Agency
          </h2>
          <p className="text-gray-600 text-base md:text-xl leading-relaxed font-light">
            Более 25 лет мы уверенно развиваемся в мире кино- и телеиндустрии,
            создавая художественные, документальные и презентационные фильмы, а
            также работая над сериалами.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className={`${project.bgColor ?? ''} p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-center min-h-[250px] md:min-h-[300px] transition-all hover:shadow-md hover:-translate-y-1 duration-300 block cursor-pointer`}
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
