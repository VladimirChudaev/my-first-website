// lib/news/types.ts

export type NewsStatus = 'draft' | 'published';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  status: NewsStatus;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNewsInput {
  title: string;
  slug: string;
  body: string;
  status?: NewsStatus;
  published_at?: string | null;
}

export interface UpdateNewsInput {
  title?: string;
  body?: string;
  status?: NewsStatus;
  published_at?: string | null;
}
