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

  if (loading) return <div className="p-8 text-center text-gray-500">Загрузка списка партнёров...</div>;

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

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Поз.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Логотип</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partners.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  Список партнёров пуст
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 relative border border-gray-100 rounded bg-gray-50 overflow-hidden flex items-center justify-center">
                      <img 
                        src={partner.imageUrl || '/placeholder.png'} 
                        alt={partner.name} 
                        className="max-w-full max-h-full object-contain p-1"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== '/placeholder.png') {
                            target.src = '/placeholder.png';
                          }
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {partner.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleVisibility(partner)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        partner.is_visible 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {partner.is_visible ? 'Виден' : 'Скрыт'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/partners/${partner.id}`} 
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Изменить
                    </Link>
                    <button 
                      onClick={() => handleDelete(partner.id)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}