// src/components/SearchBox.tsx
'use client';

import { useState } from 'react';

export default function SearchBox() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim() === '') return;
    alert(`Mencari: ${query}`);
    // Nanti bisa diganti dengan router push atau fetch API
  };

  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2 shadow-sm w-full max-w-md">
      {/* Kotak input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari sesuatu..."
        className="flex-1 outline-none px-2 py-1 text-gray-700"
      />

      {/* Button Cari */}
      <button
        onClick={handleSearch}
        className="ml-2 bg-teal-700 text-white px-4 py-1 rounded-lg hover:bg-teal-800 transition-colors"
      >
        Cari
      </button>
    </div>
  );
}