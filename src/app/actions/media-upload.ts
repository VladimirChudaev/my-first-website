'use server';

import { MediaAdminService } from '@/lib/services/MediaAdminService';
import { MediaDomain } from '@/lib/media/types';

export async function uploadMediaAction(
  formData: FormData
) {
  const file = formData.get('file') as File;
  const category = formData.get('category') as MediaDomain;

  if (!file || !category) {
    throw new Error('file or category missing');
  }

  const service = new MediaAdminService();

  await service.upload({
    file,
    category,
  });
}
