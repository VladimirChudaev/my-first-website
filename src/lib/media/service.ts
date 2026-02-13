import { createClient } from '@/lib/server';

// Получение списка
export async function getMediaList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return { data: data || [] };
}

// Получение по ID
export async function getMediaById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
}

// Создание
export async function createMedia(input: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('media')
    .insert([input])
    .select()
    .single();
  if (error) throw error;
  return { data };
}

// Обновление
export async function updateMedia(id: string, input: any) {
  const supabase = await createClient();
  const cleanId = id.trim();

  const updateData = {
    title: input.title,
    description: input.description,
    credits: input.credits,
    alt_text: input.alt_text,
    link: input.link,
    is_visible: input.is_visible,
    filename: input.filename
  };

  const { data, error } = await supabase
    .from('media')
    .update(updateData)
    .eq('id', cleanId)
    .select();

  if (error) {
    console.error('Supabase Error:', error.message);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`Запись с ID ${cleanId} не найдена.`);
  }

  return data[0];
}

// Удаление
export async function deleteMediaById(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { success: true };
}