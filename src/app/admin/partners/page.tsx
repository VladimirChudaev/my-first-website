// src/app/admin/partners/page.tsx
import Link from 'next/link';
import { PartnersService } from '@/lib/services/PartnersService';
import PartnersTable from '@/components/admin/tables/PartnersTable'; // Создадим этот компонент

export default async function AdminPartnersPage() {
  // Данные загружаются на сервере через сервис [cite: 10, 69]
  const initialPartners = await PartnersService.getAll();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Управление партнёрами</h1>
        <Link 
          href="/admin/partners/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
        >
          + Добавить партнёра
        </Link>
      </div>

      {/* Передаем данные в клиентский компонент для интерактивности */}
      <PartnersTable initialData={initialPartners} />
    </div>
  );
}