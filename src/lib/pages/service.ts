import { Page, CreatePageInput, UpdatePageInput } from './types';

/* PUBLIC */

export async function getPagesList(): Promise<{ data: Page[] }> {
  return { data: [] };
}

export async function getPageById(
  _id: string
): Promise<{ data: Page | null }> {
  return { data: null };
}

/* ADMIN (CRUD — заглушки) */

export async function createPage(
  _input: CreatePageInput
): Promise<{ data: Page | null }> {
  return { data: null };
}

export async function updatePage(
  _id: string,
  _input: UpdatePageInput
): Promise<{ data: Page | null }> {
  return { data: null };
}

export async function deletePage(
  _id: string
): Promise<{ success: true }> {
  return { success: true };
}
