'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  daysLeft: number;
}

export default function DetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      fetch('/api/projects')
        .then(res => res.json())
        .then((data: Project[]) => {
          const match = data.find(p => p.id === Number(id));
          setProject(match || null);
        });
    }
  }, [id]);

  const handleDonate = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project?.id,
        projectTitle: project?.title,
        amount: 10,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Fehler beim Start des Bezahlvorgangs');
    }
  };

  if (!project) {
    return <div className="p-8 text-white">Projekt nicht gefunden.</div>;
  }

  const progress = Math.min((project.raised / project.goal) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto p-8 text-white">
      <img src={project.image} alt={project.title} className="w-full h-64 object-cover rounded-xl mb-4" />
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-300 mb-4">{project.description}</p>

      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden mb-2">
        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-sm text-gray-400 mb-1">{project.raised} € von {project.goal} € gesammelt</p>
      <p className="text-xs text-gray-500">{project.daysLeft} Tage übrig</p>

      <button onClick={handleDonate} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
        Jetzt 10 € spenden
      </button>
    </div>
  );
}