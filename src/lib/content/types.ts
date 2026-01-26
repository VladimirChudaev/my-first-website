// lib/content/types.ts

export type ContentScope = 'global' | 'page';

export interface ContentBlock {
  id: string;
  slug: string;
  title: string;
  body: string;
  scope: ContentScope;
  page?: string | null;
  position: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateContentBlockInput {
  slug: string;
  title: string;
  body: string;
  scope: ContentScope;
  page?: string | null;
  position?: number;
  is_visible?: boolean;
}

export interface UpdateContentBlockInput {
  title?: string;
  body?: string;
  scope?: ContentScope;
  page?: string | null;
  position?: number;
  is_visible?: boolean;
}
