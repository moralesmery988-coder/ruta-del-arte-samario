import React from 'react';

export default function ConfirmDeleteModal({ onConfirm }: { onConfirm: () => void }) {
  function handleClick() {
    if (confirm('¿Confirma que desea eliminar este producto? Esta acción no se puede deshacer.')) {
      onConfirm();
    }
  }

  return (
    <button onClick={handleClick} className="px-3 py-1 bg-red-600 text-white rounded">
      Eliminar
    </button>
  );
}
