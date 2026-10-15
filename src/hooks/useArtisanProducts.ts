import { useState } from 'react';
import * as api from '../lib/api/artisan';

export default function useArtisanProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const artisanId = 'local-artisan-1'; // stub: in real app replace with auth user id

  async function fetchProducts() {
    setLoading(true);
    const data = await api.getProducts(artisanId);
    setProducts(data);
    setLoading(false);
  }

  async function createProduct(payload: any) {
    setGenerating(true);
    const created = await api.createProduct(artisanId, payload);
    await fetchProducts();
    setGenerating(false);
    return created;
  }

  async function updateProduct(id: string, payload: any) {
    setGenerating(true);
    const updated = await api.updateProduct(artisanId, id, payload);
    await fetchProducts();
    setGenerating(false);
    return updated;
  }

  async function removeProduct(id: string) {
    if (!confirm('¿Eliminar producto?')) return;
    await api.deleteProduct(artisanId, id);
    await fetchProducts();
  }

  return {
    products,
    loading,
    generating,
    fetchProducts,
    createProduct,
    updateProduct,
    removeProduct,
  };
}
