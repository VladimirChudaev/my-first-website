'use client'

import { useState } from 'react';
import { PartnerDTO, PartnersService } from '@/lib/services/PartnersService';

export default function PartnersTable({ initialData }: { initialData: PartnerDTO[] }) {
  const [partners, setPartners] = useState(initialData);

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const updated = await PartnersService.update(id, { is_visible: !currentStatus });
      setPartners(partners.map(p => p.id === id ? updated : p));
    } catch (error) {
      alert('Ошибка при обновлении');
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Лого</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ссылка</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {partners.map((partner) => (
            <tr key={partner.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                {partner.imageUrl ? (
                  <img src={partner.imageUrl} alt="" className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">Нет фото</div>
                )}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">{partner.name}</td>
              <td className="px-6 py-4 text-sm text-blue-600 truncate max-w-[200px]">
                <a href={partner.url || '#'} target="_blank">{partner.url || '—'}</a>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => toggleVisibility(partner.id, partner.is_visible)}
                  className={`px-2 py-1 rounded text-xs ${partner.is_visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {partner.is_visible ? 'Видимый' : 'Скрыт'}
                </button>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-indigo-600 hover:text-indigo-900 mr-4">Редактировать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}