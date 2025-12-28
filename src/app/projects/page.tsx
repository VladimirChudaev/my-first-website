import InnerPageHeader from '@/components/InnerPageHeader';
import ProjectCarousel from '@/components/ProjectCarousel';

export default function ProjectsPage() {
  // Данные проектов с правильной структурой
  const projects = {
    art: [
      {
        title: "Агитбригада",
        author: "Александр Борисов",
        description: "Короткометражная драма, открывающая серию фильмов, повествующих об истории агитбригад, действовавших в период Великой Отечественной войны на различных участках советско-германского фронта. Фильм посвящен истории любви молодых ребят, на пути у которых встала война.",
        image: "/h_agitbrigada.png"
      },
      {
        title: "Угрюмка",
        author: "Екатерина Тимошенко",
        description: "Комедийная драма, раскрывающая сложные аспекты отношений людей и животных, а также затрагивающая актуальные проблемы российской повседневности, которые при определенных обстоятельствах могут вылиться в мощный социальный конфликт. Выход из него можно найти только если поймешь, кто твой истинный друг.",
        image: "/h_ugryumka.png"
      },
      {
        title: "Волшебные валенки Деда Мороза",
        author: "Вероника Новоселова",
        description: "Это добрая история для самых юных зрителей, о том как старинные герои новогодних праздников: Дед Мороз, Снегурочка, Волк и Лиса, а также примкрувшие к ним братцы Кролики встречаются с современными детьми, живущими в мире, где на помощь приходит голосовой помощник \"Алиса\".",
        image: "/h_valenki.png"
      },
      {
        title: "Осторожно! Работает лифт!",
        author: "",
        description: "Компания готовится к производству сериала, в основе которого лежит тема искусственного интеллекта. Фильм покажет, как люди приспосабливаются к новому явлению, как нейросети могут влиять на нашу жизнь. Завершается работа над сценарием, формируется съемочная группа, заканчиваются переговоры с инвесторами.",
        image: "/h_lift.png"
      }
    ],
    documentary: [
      {
        title: "Муслюмовский эксперимент",
        author: "Роберт Карапетян",
        description: "Муслюмово - расселенная деревня в Челябинской области на берегу смертельно опасной реки Теча. Постоянные болезни местных жителей привели к созданию специализированного научного центра только через несколько десятков лет. Муслюмовцы задаются вопросом: это умышленные опыты над людьми или преступная халатность чиновников? Работа отмечена премией \"ТЭФИ Регион\".",
        image: "/d_Muslumovo.png"
      },
      {
        title: "Дорога Жизни",
        author: "Роберт Карапетян",
        description: "Фильм про Алапаевскую узкоколейную железную дорогу, которая считается самой протяженной пассажирской узкоколейкой в России. Власти датируют убыточный проект, так как железная дорога в этих местах остается единственным путем в цивилизацию для нескольких тысяч жителей Урала. Авторы проехали в самые отдаленные поселки, куда невозможно добраться другим транспортом, чтобы встретиться с обитателями этих мест.",
        image: "/d_doroga.png"
      },
      {
        title: "Три жены",
        author: "Юлия Ершова",
        description: "Фильм рассказывает о женах служителей трех конфессий. Традиционные устои их семей не мешают им добиваться успеха в общественной жизни. Жена священника учит детей музыке, жена раввина — успешная бизнес-вумен, жена муллы — модельер. Любовь и уважение — источник силы и залог успеха. Фильм награжден в 2019 году специальным призом в рамках кинофестиваля \"Человек, познающий мир\" в Крыму.",
        image: "/d_tri_zhenyi.png"
      }
    ],
    tv: [
      {
        title: "",
        author: "",
        description: "Социальная проблематика — одно из основных направлений работы нашей команды. Наши усилия отмечены профессиональными наградами и премиями, в том числе «Профессия — репортер».",
        image: "/t_reporter_pro.png"
      },
      {
        title: "",
        author: "",
        description: "В рамках развития проектов в сфере культуры компания активно сотрудничает с государственными и частными организациями: музеями, театрами для которых снято множество фильмов и передач, многие из которых высоко оценены заказчиками.",
        image: "/t_diploms.png"
      },
      {
        title: "",
        author: "",
        description: "Материалы о культурных событиях уральского региона, подготовленные нами, регулярно выходят в эфире ведущих федеральных телевизионных каналов, вызывая интерес зрителей и признание профессионального сообщества.",
        image: "/t_TEFI_r.png"
      }
    ],
    business: [
      {
        title: "Государственные учреждения",
        author: "",
        description: "Компания много лет работает с государственными учреждениями и организациями, создавая различный видеоконтент для корпоративных задач партнеров.",
        image: "/b_organs.png"
      },
      {
        title: "Презентационные фильмы",
        author: "",
        description: "Презентационные фильмы, снятые нами, используются заказчиками из различных отраслей экономики для демонстрации на выставках и для внутренних мероприятий.",
        image: "/b_kino_from_biz.png"
      },
      {
        title: "Культурные проекты",
        author: "",
        description: "Проекты, подготовленные для учреждений культуры, в том числе и частных — одно из основных направлений нашей деятельности.",
        image: "/b_Theater_projects.png"
      }
    ]
  };

  return (
    <>
      <InnerPageHeader />
      <main className="min-h-screen bg-white py-12 md:py-24">

        {/* Блок 1: Художественное кино */}
        <section id="art" className="mb-16 md:mb-24 bg-[#f0f7ff] py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8 md:mb-12">
              <div className="md:w-1/2 pr-0 md:pr-8">
                <h2 className="text-3xl font-bold">ХУДОЖЕСТВЕННОЕ КИНО</h2>
              </div>
              <div className="hidden md:block w-px bg-black mx-4 my-2 h-12"></div>
              <div className="md:w-1/2 pl-0 md:pl-8 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                <p className="text-lg leading-relaxed">
                  Мы специализируемся на создании художественных фильмов и сериалов — социальных драм до исторических альманахов. Наша цель — снимать фильмы, которые затрагивают душу зрителя и становятся событием в киномире.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <ProjectCarousel projects={projects.art} />
              </div>
            </div>
          </div>
        </section>

        {/* Блок 2: Документальное кино */}
        <section id="documentary" className="mb-16 md:mb-24 bg-[#fffaf0] py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8 md:mb-12">
              <div className="md:w-1/2 pr-0 md:pr-8">
                <h2 className="text-3xl font-bold">ДОКУМЕНТАЛЬНОЕ КИНО</h2>
              </div>
              <div className="hidden md:block w-px bg-black mx-4 my-2 h-12"></div>
              <div className="md:w-1/2 pl-0 md:pl-8 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                <p className="text-lg leading-relaxed">
                  За время творческой деятельности нашей командой снято более двух десятков документальных лент, демонстрировавшихся в кинозалах и в телеэфире. Наша документальная линейка посвящена важным социальным, историческим и культурным темам. Мы стремимся к глубокому, всестороннему исследованию вопросов и представлению их с новой, неожиданной точки зрения.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <ProjectCarousel projects={projects.documentary} />
              </div>
            </div>
          </div>
        </section>

        {/* Блок 3: Телевизионные проекты */}
        <section id="tv" className="mb-16 md:mb-24 bg-[#f0fff4] py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8 md:mb-12">
              <div className="md:w-1/2 pr-0 md:pr-8">
                <h2 className="text-3xl font-bold">ТЕЛЕВИЗИОННЫЕ ПРОЕКТЫ</h2>
              </div>
              <div className="hidden md:block w-px bg-black mx-4 my-2 h-12"></div>
              <div className="md:w-1/2 pl-0 md:pl-8 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                <p className="text-lg leading-relaxed">
                  Мы имеем богатый опыт работы в производстве телевизионного контента для ведущих телекомпаний России. Всего было сделано несколько сотен репортажей и телепередач. В их числе — работы, получившие премию ТЭФИ. Наша команда креативных специалистов создаёт яркий и запоминающийся видеоконтент.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <ProjectCarousel projects={projects.tv} isTvCarousel={true} />
              </div>
            </div>
          </div>
        </section>

        {/* Блок 4: Кино для бизнеса */}
        <section id="business" className="mb-16 md:mb-24 bg-[#f5f5f7] py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8 md:mb-12">
              <div className="md:w-1/2 pr-0 md:pr-8">
                <h2 className="text-3xl font-bold">КИНО ДЛЯ БИЗНЕСА</h2>
              </div>
              <div className="hidden md:block w-px bg-black mx-4 my-2 h-12"></div>
              <div className="md:w-1/2 pl-0 md:pl-8 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                <p className="text-lg leading-relaxed">
                  Презентационные фильмы — еще одно направление работы нашей компании. Наши фильмы регулярно используются на презентационных площадках в ходе различных выставок на стендах предприятий и корпораций.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <ProjectCarousel projects={projects.business} />
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}