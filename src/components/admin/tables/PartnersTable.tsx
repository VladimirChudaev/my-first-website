'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

interface Props {
  initialData: PartnerDTO[];
}

export default function PartnersTable({ initialData }: Props) {
  const [partners, setPartners] = useState<PartnerDTO[]>(initialData);

  // Функция переключения видимости
  const toggleVisibility = async (partner: PartnerDTO) => {
    try {
      const newStatus = !partner.is_visible;
      await PartnersService.update(partner.id, { is_visible: newStatus });
      
      setPartners(partners.map(p => 
        p.id === partner.id ? { ...p, is_visible: newStatus } : p
      ));
    } catch (err) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить партнёра?')) return;
    try {
      await PartnersService.delete(id);
      setPartners(partners.filter(p => p.id !== id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const moveOrder = async (id: string, direction: 'up' | 'down') => {
    const index = partners.findIndex(p => p.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === partners.length - 1)) return;

    const newPartners = [...partners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPartners[index], newPartners[targetIndex]] = [newPartners[targetIndex], newPartners[index]];

    setPartners(newPartners);
    // Здесь можно добавить вызов API для сохранения нового порядка в БД
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Порядок</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Лого</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Статус</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {partners.map((partner) => (
            <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 w-20">
                <div className="flex flex-col items-center">
                  <button onClick={() => moveOrder(partner.id, 'up')} className="p-0.5 hover:text-blue-600 transition-colors">
                    <ChevronUp size={20} />
                  </button>
                  <button onClick={() => moveOrder(partner.id, 'down')} className="p-0.5 hover:text-blue-600 transition-colors">
                    <ChevronDown size={20} />
                  </button>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded flex items-center justify-center overflow-hidden">
                  <img 
                    src={partner.imageUrl || 'https://placehold.co/48x48?text=No+Logo'} 
                    alt={partner.name}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
              </td>
              <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                {partner.name}
              </td>
              <td className="px-4 py-4 text-center">
                <button 
                  onClick={() => toggleVisibility(partner)}
                  className={`p-2 rounded-full transition-colors ${
                    partner.is_visible ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 hover:bg-gray-50'
                  }`}
                  title={partner.is_visible ? 'Скрыть' : 'Показать'}
                >
                  {partner.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <Link 
                    href={`/admin/partners/${partner.id}`} 
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Pencil size={20} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(partner.id)} 
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}