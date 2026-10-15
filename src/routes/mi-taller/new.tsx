import React from 'react';
import ProductForm from '../../components/ProductForm';
import useArtisanProducts from '../../hooks/useArtisanProducts';
import { useNavigate } from '@tanstack/react-router';

export default function NewProductPage() {
  const { createProduct } = useArtisanProducts();
  const navigate = useNavigate();

  async function onSubmit(data: any) {
    const created = await createProduct(data);
    if (created) {
      navigate('/mi-taller');
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Crear nuevo producto</h2>
      <ProductForm onSubmit={onSubmit} />
    </div>
  );
}
