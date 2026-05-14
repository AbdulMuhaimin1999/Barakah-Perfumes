const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export const BRAND_IMAGE = '/branding/barakah-perfumes.jpeg';

const PLACEHOLDER = BRAND_IMAGE;

export function imageUrl(path, fallback = PLACEHOLDER) {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path}`;
}

export const HERO_IMAGES = [BRAND_IMAGE];

export const CATEGORY_IMAGES = {
  men: '/categories/men.jpg',
  women: '/categories/women.jpg',
  luxury: '/categories/luxury.jpg',
  arabic: '/categories/arabic.jpg',
};
