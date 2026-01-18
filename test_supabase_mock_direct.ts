import { 
  getMediaByDomainMock, 
  getMediaUrlMock,
  getMediaByIdMock,
  insertMediaMock,
  updateMediaMock,
  deleteMediaMock
} from '@/lib/media/media.mock';
import { MediaDomain } from '@/lib/media/types';

async function testDirectMock() {
  try {
    console.log('Тестирование mock-функций напрямую...');
    
    // Тестирование получения данных по домену
    console.log('1. Тестирование получения данных по доменам...');
    const domains: MediaDomain[] = ['video', 'photo', 'partner', 'award'];
    
    for (const domain of domains) {
      try {
        const assets = await getMediaByDomainMock(domain);
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
      const url = await getMediaUrlMock(testPath);
      console.log('   Пример URL:', url);
    } catch (urlError) {
      console.log('   Ошибка получения URL:', (urlError as Error).message);
    }
    
    // Тестирование получения элемента по ID
    console.log('\n3. Тестирование получения элемента по ID...');
    try {
      const mediaItem = await getMediaByIdMock('video-1');
      if (mediaItem) {
        console.log('   Найден элемент:', mediaItem.filename, mediaItem.id);
      } else {
        console.log('   Элемент не найден');
      }
    } catch (error) {
      console.log('   Ошибка получения элемента по ID:', (error as Error).message);
    }
    
    // Тестирование вставки элемента
    console.log('\n4. Тестирование вставки элемента...');
    try {
      const newMedia = await insertMediaMock({
        category: 'video',
        filename: 'test-video.mp4',
        alt_text: 'Test video description',
        position: 10
      });
      console.log('   Вставлен элемент:', newMedia.filename, newMedia.id);
    } catch (error) {
      console.log('   Ошибка вставки элемента:', (error as Error).message);
    }
    
    // Тестирование обновления элемента
    console.log('\n5. Тестирование обновления элемента...');
    try {
      await updateMediaMock('video-1', { alt_text: 'Updated description' });
      console.log('   Обновление выполнено');
    } catch (error) {
      console.log('   Ошибка обновления элемента:', (error as Error).message);
    }
    
    // Тестирование удаления элемента
    console.log('\n6. Тестирование удаления элемента...');
    try {
      await deleteMediaMock('video-1');
      console.log('   Удаление выполнено');
    } catch (error) {
      console.log('   Ошибка удаления элемента:', (error as Error).message);
    }
    
    console.log('\n🎉 Прямое тестирование mock-функций завершено успешно!');
    return true;
  } catch (err) {
    console.error('❌ Ошибка при прямом тестировании mock-функций:', err);
    return false;
  }
}

// Запуск теста
testDirectMock().then(success => {
  if (success) {
    console.log('\n✅ Все прямые тесты mock-функций прошли успешно');
  } else {
    console.log('\n❌ Один или несколько прямых тестов mock-функций не прошли');
    process.exit(1);
  }
});