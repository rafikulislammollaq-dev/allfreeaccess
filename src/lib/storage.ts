export const STORAGE = {
  theme: 'aurora.theme',
  settings: 'aurora.settings',
  chats: 'aurora.chats',
  images: 'aurora.images',
  history: 'aurora.history',
  prompts: 'aurora.prompts',
};

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
