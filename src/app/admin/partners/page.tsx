import Link from 'next/link';
import { PartnersService } from '@/lib/services/PartnersService';
// Исправленный импорт: убираем лишний /app/ из пути алиаса
import PartnersTable from '@/components/admin/tables/PartnersTable'; 

export default async function AdminPartnersPage() {
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

      <PartnersTable initialData={initialPartners} />
    </div>
  );
}