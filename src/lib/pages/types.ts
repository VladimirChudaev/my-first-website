export interface Page {
  id: string;
  slug: string;
  title: string;
  body: string;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePageInput {
  slug: string;
  title: string;
  body: string;
  is_visible?: boolean;
}

export interface UpdatePageInput {
  title?: string;
  body?: string;
  is_visible?: boolean;
}
