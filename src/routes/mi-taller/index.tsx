import React from 'react';
import { useEffect } from 'react';
import useArtisanProducts from '../../hooks/useArtisanProducts';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

export default function MiTallerIndex() {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    removeProduct,
    generating,
  } = useArtisanProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tus productos</h2>
        <a
          href="/mi-taller/new"
          className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-md"
        >
          Crear producto
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 && (
          <div className="p-6 border rounded">No tienes productos aún.</div>
        )}

        {products.map((p) => (
          <article key={p.id} className="border rounded p-3 bg-white shadow-sm">
            <div className="h-48 mb-3 bg-gray-50 flex items-center justify-center">
              {p.media?.[0]?.url ? (
                <img src={p.media[0].url} alt={p.title} className="max-h-44 object-contain" />
              ) : (
                <span className="text-gray-400">Sin imagen</span>
              )}
            </div>

            <h3 className="font-medium">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.materials}</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-lg font-semibold">COP {p.price}</span>
                <div className="text-xs text-gray-500">Inventario: {p.inventory}</div>
              </div>

              <div className="flex gap-2">
                <a
                  className="px-3 py-1 bg-sky-600 text-white rounded"
                  href={`/mi-taller/edit/${p.id}`}
                >
                  Editar
                </a>
                <ConfirmDeleteModal onConfirm={() => removeProduct(p.id)} />
                <a
                  className="px-3 py-1 bg-gray-100 rounded text-sm"
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    location.origin + `/producto/${p.id}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  QR
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
