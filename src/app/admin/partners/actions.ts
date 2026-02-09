'use server' // Это жесткая граница. Код отсюда никогда не попадет в браузер.

import { revalidatePath } from 'next/cache';
import { PartnersService } from '@/lib/services/PartnersService';

export async function updatePartnerAction(id: string, payload: any) {
  const data = await PartnersService.update(id, payload);
  revalidatePath('/'); // Проливка кэша происходит на границе действия
  return data;
}