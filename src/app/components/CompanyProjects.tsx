'use client';

import React from 'react';

const projects = [
  {
    id: 1,
    title: "Художественное кино",
    bgColor: "bg-[#f0f7ff]", // Нежно-синий
    content: "Мы специализируемся на создании художественных фильмов и сериалов — от социальных драм до исторических альманахов. Наша цель — снимать фильмы, которые затрагивают душу зрителя и становятся событием в киномире."
  },
  {
    id: 2,
    title: "Документальное кино",
    bgColor: "bg-[#fffaf0]", // Песочный
    content: "За время творческой деятельности нашей командой снято более двух десятков документальных лент, демонстрировавшихся в кинозалах и в телеэфире. Наша документальная линейка посвящена важным социальным, историческим и культурным темам."
  },
  {
    id: 3,
    title: "Телевизионные проекты",
    bgColor: "bg-[#f0fff4]", // Мятно-зеленый
    content: "Мы имеем богатый опыт работы в производстве телевизионного контента для ведущих телекомпаний России. В их числе — работы, получившие премию ТЭФИ. Наша команда создает яркий и запоминающийся видеоконтент."
  },
  {
    id: 4,
    title: "Кино для бизнеса",
    bgColor: "bg-[#f5f5f7]", // Светло-серый
    content: "Презентационные фильмы — еще одно направление работы нашей компании. Наши фильмы регулярно используются на презентационных площадках в ходе различных выставок на стендах предприятий и корпораций."
  }
];

export default function CompanyProjects() {
  return (
    <section className="bg-white pb-20">
      {/* 1. Тонкая разделительная линия */}
      <div className="w-full border-t border-gray-100 mb-16"></div>

      <div className="container mx-auto px-4 lg:px-20">
        {/* 2. Текст о компании (без рамки, на чистом белом фоне) */}
        <div className="max-w-5xl mx-auto mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Кинокомпания V&T Agency
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light">
            Более 25 лет мы уверенно развиваемся в мире кино- и телеиндустрии, создавая художественные, 
            документальные и презентационные фильмы, а также работая над сериалами. Мы — признанные 
            члены профессионального сообщества, победители многочисленных международных и всероссийских 
            кино- и телефестивалей. Мы уверенно реализуем все этапы кино- и телепроизводства — 
            от рождения идеи до её воплощения на экране.
          </p>
        </div>

        {/* 3. Блоки в две колонки (grid-cols-2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className={`${project.bgColor} p-10 rounded-[2.5rem] flex flex-col justify-center min-h-[300px] transition-all hover:shadow-sm`}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 uppercase tracking-wider">
                {project.title}
              </h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed opacity-90">
                {project.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}