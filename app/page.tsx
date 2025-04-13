'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  daysLeft: number;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="bg-gray-900 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-400">SpendenApp</div>
          <nav className="space-x-6 text-sm">
            <Link href="/" className="hover:text-green-400">Projekte</Link>
            <Link href="/projekt-erstellen" className="hover:text-green-400">Projekt erstellen</Link>
          </nav>
        </div>
      </header>

      <section className="bg-cover bg-center h-96 flex items-center justify-center text-white" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
        <div className="text-center bg-black bg-opacity-60 p-8 rounded">
          <h1 className="text-4xl font-bold">Gemeinsam Gutes tun</h1>
          <p className="mt-4 text-lg">Unterstütze Projekte, die die Welt verändern.</p>
          <Link href="/projekt-erstellen">
            <span className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer">
              Projekt starten
            </span>
          </Link>
        </div>
      </section>

      <main className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {projects.map((project) => {
          const progress = Math.min((project.raised / project.goal) * 100, 100);

          return (
            <div key={project.id} className="bg-gray-800 p-4 rounded-xl shadow-md">
              <Link href={`/project/${project.id}`}>
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer" />
              </Link>
              <Link href={`/project/${project.id}`}>
                <h2 className="text-xl font-semibold hover:underline cursor-pointer">{project.title}</h2>
              </Link>
              <p className="text-sm text-gray-300 mb-2">{project.description}</p>
              <div className="w-full bg-gray-600 rounded-full h-2.5 mb-2 overflow-hidden">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-sm text-gray-400">{project.raised} € von {project.goal} € gesammelt</p>
              <p className="text-xs text-gray-500 mb-4">{project.daysLeft} Tage übrig</p>
              <Link href={`/project/${project.id}`}>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                  Jetzt spenden
                </button>
              </Link>
            </div>
          );
        })}
      </main>
    </div>
  );
}