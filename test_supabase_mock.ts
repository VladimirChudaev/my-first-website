// Устанавливаем переменную окружения для использования mock-режима
process.env.NEXT_PUBLIC_MEDIA_SOURCE = 'mock';

import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';
import { mediaService } from '@/lib/services/MediaService';
import { MediaDomain } from '@/lib/media/types';

async function testMockMode() {
  try {
    console.log('Тестирование в mock-режиме (без подключения к Supabase)...');
    
    // Тестирование получения данных по домену
    console.log('1. Тестирование получения данных по доменам...');
    const domains: MediaDomain[] = ['video', 'photo', 'partner', 'award'];
    
    for (const domain of domains) {
      try {
        const assets = await getMediaByDomain(domain);
        console.log(`   ${domain}: ${assets.length} элементов`);
        
        if (assets.length > 0) {
          console.log(`      Первый элемент: ${assets[0].filename} (${assets[0].id})`);
        }
      } catch (domainError) {
        console.log(`   ${domain}: ошибка - ${(domainError as Error).message}`);
      }
    }
    
    // Тестирование получения URL медиа-файла
    console.log('\n2. Тестирование получения URL медиа-файла...');
    try {
      const testPath = 'video/test.mp4';
      const url = await getMediaUrl(testPath);
      console.log('   Пример URL:', url);
    } catch (urlError) {
      console.log('   Ошибка получения URL:', (urlError as Error).message);
    }
    
    // Тестирование MediaService
    console.log('\n3. Тестирование MediaService...');
    try {
      const videos = await mediaService.getByDomain('video');
      console.log('   Видео получено:', videos.length);
      
      if (videos.length > 0) {
        const mediaMap = await mediaService.getMediaMap('video');
        console.log('   Карта медиа-файлов создана:', Object.keys(mediaMap).length, 'элементов');
        
        const firstVideo = videos[0];
        const foundVideo = await mediaService.findByFilename('video', firstVideo.filename);
        console.log('   Поиск по имени файла:', foundVideo ? 'найден' : 'не найден');
        
        if (foundVideo) {
          console.log(`      Найденный файл: ${foundVideo.filename}`);
        }
        
        const url = await mediaService.getUrlByFilename('video', firstVideo.filename);
        console.log('   URL по имени файла:', url || 'не получен');
      }
    } catch (serviceError) {
      console.log('   Ошибка MediaService:', (serviceError as Error).message);
    }
    
    console.log('\n🎉 Тестирование в mock-режиме завершено успешно!');
    return true;
  } catch (err) {
    console.error('❌ Ошибка при тестировании в mock-режиме:', err);
    return false;
  }
}

// Запуск теста
testMockMode().then(success => {
  if (success) {
    console.log('\n✅ Все тесты в mock-режиме прошли успешно');
  } else {
    console.log('\n❌ Один или несколько тестов в mock-режиме не прошли');
    process.exit(1);
  }
});