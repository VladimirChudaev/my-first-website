// src/lib/content/service.ts

// базовые функции (как есть)
export async function getContentById(id: string) {
  return { data: null };
}

export async function getContentList() {
  return { data: [] };
}

// CRUD-заглушки
export async function createContentBlock(input: any) {
  return { data: null };
}

export async function updateContentBlock(id: string, input: any) {
  return { data: null };
}

export async function deleteContentBlock(id: string) {
  return { data: null };
}

// алиасы под API (НЕ ЛОМАЮТ существующий код)
export const createContent = createContentBlock;
export const updateContentById = updateContentBlock;
export const deleteContentById = deleteContentBlock;
