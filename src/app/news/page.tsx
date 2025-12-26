import InnerPageHeader from '@/components/InnerPageHeader';

export default function NewsPage() {
  return (
    <>
      <InnerPageHeader />
      <main className="min-h-screen">
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-bold text-black text-center mb-8">
            Страница в разработке
          </h1>
        </div>
      </main>
    </>
  );
}