import { NewsItem, CreateNewsInput, UpdateNewsInput } from './types';

/* PUBLIC */

export async function getNewsList(): Promise<{ data: NewsItem[] }> {
  return { data: [] };
}

export async function getNewsById(
  _id: string
): Promise<{ data: NewsItem | null }> {
  return { data: null };
}

/* ADMIN (CRUD — заглушки) */

export async function createNews(
  _input: CreateNewsInput
): Promise<{ data: NewsItem | null }> {
  return { data: null };
}

export async function updateNews(
  _id: string,
  _input: UpdateNewsInput
): Promise<{ data: NewsItem | null }> {
  return { data: null };
}

export async function deleteNews(
  _id: string
): Promise<{ success: true }> {
  return { success: true };
}
