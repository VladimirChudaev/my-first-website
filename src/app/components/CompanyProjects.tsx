'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type ProjectBlock = {
  id: string;
  title: string;
  content: string;
  href: string;
  bgColor: string; 
};

interface CompanyProjectsProps {
  content?: {
    title: string;
    body: string;
  };
}

export default function CompanyProjects({ content }: CompanyProjectsProps) {
  const [projects, setProjects] = useState<ProjectBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const t = Date.now();
        const resProjects = await fetch(`/api/pages/projects?t=${t}`, { cache: 'no-store' });
        const jsonProjects = await resProjects.json();

        if (Array.isArray(jsonProjects.data)) {
          const mapped = jsonProjects.data.map((item: any) => {
            const rawColor = item.bg_color || '#f5f5f7';
            const match = rawColor.match(/#[a-fA-F0-9]{3,6}/);
            const cleanHex = match ? match[0] : '#f5f5f7';

            return {
              id: item.section_key,
              title: item.title,
              content: item.body,
              href: `/projects#${item.section_key}`,
              bgColor: cleanHex,
            };
          });
          setProjects(mapped);
        }
      } catch (error) {
        console.error('Ошибка загрузки плиток проектов:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return null;

  return (
    <section className="bg-white pb-12 md:pb-20">
      <div className="w-full border-t border-gray-100 mb-10 md:mb-16"></div>
      <div className="container mx-auto px-5 md:px-10 lg:px-20">
        
        {/* Блок "О компании": исчезнет полностью, если is_visible: false */}
        {content && (
          <div className="max-w-5xl mx-auto mb-12 md:mb-20 text-center">
            {content.title && (
              <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-900 leading-tight">
                {content.title}
              </h2>
            )}
            {content.body && (
              <div 
                className="text-gray-600 text-base md:text-xl leading-relaxed font-light prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: content.body }}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              style={{ backgroundColor: project.bgColor }}
              className="p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-center min-h-[250px] md:min-h-[300px] transition-all hover:shadow-md hover:-translate-y-1 duration-300 block cursor-pointer"
            >
              <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 uppercase tracking-wider">
                {project.title}
              </h3>
              <div 
                className="text-gray-700 text-sm md:text-lg leading-relaxed opacity-90 prose prose-slate prose-sm max-w-none prose-p:m-0"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}