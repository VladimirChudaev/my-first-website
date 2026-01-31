export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  body?: string;
  is_visible?: boolean;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNewsInput {
  slug: string;
  title: string;
  body?: string;
  is_visible?: boolean;
  published_at?: string | null;
}

export interface UpdateNewsInput {
  title?: string;
  body?: string;
  is_visible?: boolean;
  published_at?: string | null;
}
