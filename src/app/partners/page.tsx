export default function ProjectsPage() {
    return (
      <main
        className="min-h-screen"
        style={{
          backgroundImage: "url('/photo/header-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000',
        }}
      >
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white uppercase mb-8 text-center">
            Партнеры
          </h1>
          <p className="text-white/90 text-lg text-center mb-12 max-w-3xl mx-auto">
            Здесь будут представлены наши ключевые кинопроекты: от полнометражных фильмов до рекламных роликов.
          </p>
  
          {/* Сюда добавишь карточки проектов позже */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Название проекта</h2>
              <p>Описание проекта...</p>
            </div>
            {/* и т.д. */}
          </div>
        </div>
      </main>
    );
  }