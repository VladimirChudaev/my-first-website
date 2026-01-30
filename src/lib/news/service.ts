// lib/news/service.ts

import { NewsItem } from './types';

export async function getNewsList(): Promise<{ data: NewsItem[] }> {
  return { data: [] };
}

export async function getNewsById(
  id: string
): Promise<{ data: NewsItem | null }> {
  return { data: null };
}
