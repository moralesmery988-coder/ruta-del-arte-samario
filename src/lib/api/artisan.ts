// Simple localStorage-backed mock API for artisan products.

type Media = { url: string; type: 'image' | 'video' };
export type Product = {
  id: string;
  title: string;
  description?: string;
  materials?: string;
  dimensions?: string;
  price: number;
  inventory: number;
  availability: boolean;
  media?: Media[];
  createdAt: string;
};

function key(artisanId: string) {
  return `artisan:${artisanId}:products`;
}

function read(artisanId: string): Product[] {
  const raw = localStorage.getItem(key(artisanId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Product[];
  } catch (e) {
    return [];
  }
}

function write(artisanId: string, data: Product[]) {
  localStorage.setItem(key(artisanId), JSON.stringify(data));
}

export async function getProducts(artisanId: string) {
  await new Promise((r) => setTimeout(r, 200));
  return read(artisanId);
}

export async function createProduct(artisanId: string, payload: any) {
  const items = read(artisanId);
  const id = `p_${Date.now()}`;
  const product: Product = {
    id,
    title: payload.title || 'Sin título',
    description: payload.description || '',
    materials: payload.materials || '',
    dimensions: payload.dimensions || '',
    price: Number(payload.price || 0),
    inventory: Number(payload.inventory || 0),
    availability: !!payload.availability,
    media: payload.media || [],
    createdAt: new Date().toISOString(),
  };
  items.unshift(product);
  write(artisanId, items);
  return product;
}

export async function updateProduct(artisanId: string, id: string, payload: any) {
  const items = read(artisanId);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...payload };
  write(artisanId, items);
  return items[idx];
}

export async function deleteProduct(artisanId: string, id: string) {
  const items = read(artisanId).filter((i) => i.id !== id);
  write(artisanId, items);
  return true;
}
