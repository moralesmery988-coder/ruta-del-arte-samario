import React, { useState } from 'react';
import MultiMediaUploader from './MultiMediaUploader';

type Props = {
  initial?: any;
  onSubmit: (data: any) => Promise<void> | void;
};

export default function ProductForm({ initial, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [materials, setMaterials] = useState(initial?.materials || '');
  const [dimensions, setDimensions] = useState(initial?.dimensions || '');
  const [price, setPrice] = useState(initial?.price || 0);
  const [inventory, setInventory] = useState(initial?.inventory || 1);
  const [availability, setAvailability] = useState(initial?.availability ?? true);
  const [media, setMedia] = useState(initial?.media || []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title,
      description,
      materials,
      dimensions,
      price,
      inventory,
      availability,
      media,
    };
    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Materiales</label>
          <input
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Dimensiones</label>
          <input
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">Precio (COP)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Inventario</label>
          <input
            type="number"
            value={inventory}
            onChange={(e) => setInventory(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Disponible</label>
          <select
            value={availability ? 'yes' : 'no'}
            onChange={(e) => setAvailability(e.target.value === 'yes')}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Multimedia</label>
        <MultiMediaUploader value={media} onChange={setMedia} />
      </div>

      <div className="pt-4">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded">Guardar</button>
      </div>
    </form>
  );
}
