'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjektErstellen() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', goal: '', daysLeft: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let imageUrl = '';

    if (imageFile) {
      const data = new FormData();
      data.append('image', imageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      imageUrl = result.url;
    }

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, goal: parseInt(form.goal), daysLeft: parseInt(form.daysLeft), image: imageUrl }),
    });

    if (response.ok) router.push('/');
    else alert('Fehler beim Speichern des Projekts');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Projekt erstellen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Titel" onChange={handleChange} required className="w-full p-2 rounded bg-gray-800 text-white" />
        <textarea name="description" placeholder="Beschreibung" onChange={handleChange} required className="w-full p-2 rounded bg-gray-800 text-white" />
        <input name="goal" type="number" placeholder="Zielbetrag (€)" onChange={handleChange} required className="w-full p-2 rounded bg-gray-800 text-white" />
        <input name="daysLeft" type="number" placeholder="Laufzeit (Tage)" onChange={handleChange} required className="w-full p-2 rounded bg-gray-800 text-white" />
        <input name="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full p-2 rounded bg-gray-800 text-white" />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full">Projekt speichern</button>
      </form>
    </div>
  );
}