export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  body?: string | null;
  is_visible?: boolean;
  created_at?: string;

  cover_image_id?: string | null;

  media?: {
    id: string;
    path: string;
    bucket: string;
  } | null;
};
