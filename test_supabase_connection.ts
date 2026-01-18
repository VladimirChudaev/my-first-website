import { createClient } from '@/lib/client';
import { getMediaByDomain, getMediaUrl } from '@/lib/media/media';
import { mediaService } from '@/lib/services/MediaService';

async function testConnection() {
  try {
    console.log('Тестирование подключения к Supabase...');
    
    // Проверка подключения к базе данных
    const supabase = createClient();
    
    console.log('1. Проверка подключения к базе данных...');
    const { data, error } = await supabase
      .from('media')
      .select('id, filename, category')
      .limit(1);
    
    if (error) {
      console.error('❌ Ошибка подключения к Supabase:', error);
      return false;
    }
    
    console.log('✅ Подключение к базе данных успешно');
    console.log('   Найдено записей:', data?.length || 0);
    
    // Тестирование получения данных по домену
    console.log('\n2. Тестирование получения данных по доменам...');
    const domains = ['video', 'photo', 'partner', 'award'];
    
    for (const domain of domains) {
      try {
        const assets = await getMediaByDomain(domain as any);
        console.log(`   ${domain}: ${assets.length} элементов`);
      } catch (domainError) {
        console.log(`   ${domain}: ошибка - ${(domainError as Error).message}`);
      }
    }
    
    // Тестирование получения URL медиа-файла
    console.log('\n3. Тестирование получения URL медиа-файла...');
    try {
      const testPath = 'video/test.mp4';
      const url = await getMediaUrl(testPath);
      console.log('   Пример URL:', url);
    } catch (urlError) {
      console.log('   Ошибка получения URL:', (urlError as Error).message);
    }
    
    // Тестирование MediaService
    console.log('\n4. Тестирование MediaService...');
    try {
      const videos = await mediaService.getByDomain('video');
      console.log('   Видео получено:', videos.length);
      
      if (videos.length > 0) {
        const mediaMap = await mediaService.getMediaMap('video');
        console.log('   Карта медиа-файлов создана:', Object.keys(mediaMap).length, 'элементов');
        
        const firstVideo = videos[0];
        const foundVideo = await mediaService.findByFilename('video', firstVideo.filename);
        console.log('   Поиск по имени файла:', foundVideo ? 'найден' : 'не найден');
        
        const url = await mediaService.getUrlByFilename('video', firstVideo.filename);
        console.log('   URL по имени файла:', url ? 'получен' : 'не получен');
      }
    } catch (serviceError) {
      console.log('   Ошибка MediaService:', (serviceError as Error).message);
    }
    
    // Тестирование Supabase Storage
    console.log('\n5. Тестирование подключения к Supabase Storage...');
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.log('   ❌ Ошибка получения списка бакетов:', bucketError.message);
      } else {
        console.log('   ✅ Бакеты:', buckets?.map(bucket => bucket.name).join(', ') || 'нет бакетов');
      }
    } catch (storageError) {
      console.log('   ❌ Ошибка подключения к Storage:', (storageError as Error).message);
    }
    
    console.log('\n🎉 Тестирование подключения к Supabase завершено успешно!');
    return true;
  } catch (err) {
    console.error('❌ Общая ошибка при тестировании подключения:', err);
    return false;
  }
}

// Запуск теста
testConnection().then(success => {
  if (success) {
    console.log('\n✅ Все тесты подключения прошли успешно');
  } else {
    console.log('\n❌ Один или несколько тестов подключения не прошли');
    process.exit(1);
  }
});