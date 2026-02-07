'use client';

import { useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

interface PartnersTableProps {
  initialData: PartnerDTO[];
}

export default function PartnersTable({ initialData }: PartnersTableProps) {
  const [partners, setPartners] = useState<PartnerDTO[]>(initialData);

  const handleToggleVisibility = async (partner: PartnerDTO) => {
    try {
      await PartnersService.update(partner.id, { is_visible: !partner.is_visible });
      setPartners(prev =>
        prev.map(p => (p.id === partner.id ? { ...p, is_visible: !p.is_visible } : p))
      );
    } catch (err) {
      alert('Ошибка при изменении видимости');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить партнера?')) return;
    try {
      await PartnersService.delete(id);
      setPartners(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Поз.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Логотип</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {partners.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Список пуст</td>
            </tr>
          ) : (
            partners.map((partner) => (
              <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">{partner.position}</td>
                <td className="px-6 py-4">
                  <div className="w-12 h-12 relative border border-gray-100 rounded bg-gray-50 overflow-hidden flex items-center justify-center">
                    <img 
                      src={partner.imageUrl || '/placeholder.png'} 
                      alt={partner.name} 
                      className="max-w-full max-h-full object-contain p-1"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{partner.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleVisibility(partner)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      partner.is_visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {partner.is_visible ? 'Виден' : 'Скрыт'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleDelete(partner.id)} className="text-red-600 hover:text-red-900">
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}