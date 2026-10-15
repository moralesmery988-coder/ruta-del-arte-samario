import React from 'react';
import { Outlet } from '@tanstack/react-router';

export default function ArtisanLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b py-4 px-6 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Mi Taller</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
