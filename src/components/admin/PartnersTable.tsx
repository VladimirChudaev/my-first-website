'use client'; // Интерактив разрешен только здесь [cite: 26]

import { useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';

interface Props {
  initialData: PartnerDTO[];
}

export default function PartnersTable({ initialData }: Props) {
  const [partners, setPartners] = useState<PartnerDTO[]>(initialData);

  const handleToggleVisibility = async (partner: PartnerDTO) => {
    try {
      await PartnersService.update(partner.id, { is_visible: !partner.is_visible });
      // После обновления перерисовываем стейт
      setPartners(prev => prev.map(p => p.id === partner.id ? {...p, is_visible: !p.is_visible} : p));
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
        {/* Скопируйте сюда всё содержимое <table> ... </table> из старой админки */}
        {/* Используйте стейт `partners` для рендера строк <tr> */}
      </table>
    </div>
  );
}