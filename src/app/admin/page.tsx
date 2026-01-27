import InnerPageHeader from '@/components/InnerPageHeader';

export default function AdminPage() {
  return (
    <>
      <InnerPageHeader />
      <main className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          Админка в разработке
        </h1>
      </main>
    </>
  );
}
