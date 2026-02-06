'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPartners = async () => {
    try {
      const data = await PartnersService.getAll();
      setPartners(data);
    } catch (err) {
      console.error('Failed to load partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleToggleVisibility = async (partner: PartnerDTO) => {
    try {
      await PartnersService.update(partner.id, { is_visible: !partner.is_visible });
      await loadPartners();
    } catch (err) {
      alert('Ошибка при изменении видимости');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить партнера?')) return;
    try {
      await PartnersService.delete(id);
      await loadPartners();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Партнёры</h1>
        <Link 
          href="/admin/partners/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Добавить партнёра
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Позиция</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Лого</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Видимость</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {partner.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 relative border rounded bg-gray-50">
                    <img 
                      src={partner.imageUrl || '/placeholder.png'} 
                      alt="" 
                      className="object-contain w-full h-full"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {partner.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleVisibility(partner)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      partner.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {partner.is_visible ? 'Виден' : 'Скрыт'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/partners/${partner.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                    Редактировать
                  </Link>
                  <button onClick={() => handleDelete(partner.id)} className="text-red-600 hover:text-red-900">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}