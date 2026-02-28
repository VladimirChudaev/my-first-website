'use client';

import { useEffect, useState } from 'react';
import { PartnersService, PartnerDTO } from '@/lib/services/PartnersService';
import InnerPageHeader from '@/app/components/InnerPageHeader';
// Импортируем твою функцию создания клиента
import { createClient } from '@/lib/client'; 

export default function PartnersPage() {
  // Инициализируем клиент внутри компонента
  const supabase = createClient();
  
  const [partners, setPartners] = useState<PartnerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [pageContent, setPageContent] = useState({
    title: 'Наши партнеры',
    is_visible: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Запрос заголовка
        const { data: content } = await supabase
          .from('page_content')
          .select('title, is_visible')
          .eq('page', 'partners')
          .eq('section_key', 'header')
          .single();

        if (content) {
          setPageContent({
            title: content.title || 'Наши партнеры',
            is_visible: content.is_visible
          });
        }

        // Загрузка логотипов
        const data = await PartnersService.getVisible();
        setPartners(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Пустой массив зависимостей, так как supabase клиент стабилен

  return (
    <>
      <InnerPageHeader />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-10 md:py-16 max-w-6xl">
          
          {pageContent.is_visible && (
            <h1 className="text-2xl md:text-3xl font-bold text-black text-center mb-12 uppercase tracking-[0.3em]">
              {pageContent.title}
            </h1>
          )}

          {loading ? (
            <div className="text-center py-10 text-gray-400">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {partners.map((partner) => (
                <div key={partner.id} className="w-full flex items-center justify-center">
                  <img
                    src={partner.imageUrl || '/placeholder.png'}
                    alt={partner.name}
                    className="max-w-full max-h-12 md:max-h-16 object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}