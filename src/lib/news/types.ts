export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  cover_image_url: string | null; // Добавлено
  is_visible: boolean;
  created_at: string;
}

export interface CreateNewsInput {
  slug: string;
  title: string;
  body?: string;
  cover_image_url?: string;
  is_visible?: boolean;
}

export interface UpdateNewsInput {
  slug?: string;
  title?: string;
  body?: string;
  cover_image_url?: string;
  is_visible?: boolean;
}