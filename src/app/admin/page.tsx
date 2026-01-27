import InnerPageHeader from '@/components/InnerPageHeader';

export default function Page() {
  return (
    <>
      <InnerPageHeader />
      <main className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          Страница в разработке
        </h1>
      </main>
    </>
  );
}
