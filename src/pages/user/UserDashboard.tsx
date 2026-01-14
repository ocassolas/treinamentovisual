import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { TutorialCard } from '@/components/TutorialCard';
import { TutorialViewer } from '@/components/TutorialViewer';
import { Tutorial } from '@/types';
import { Search, X, FolderOpen } from 'lucide-react';

export default function UserDashboard() {
  const { currentUser, tutorials, getSectorName } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingTutorial, setViewingTutorial] = useState<Tutorial | null>(null);

  const userTutorials = useMemo(() => {
    if (!currentUser?.sectorId) return [];
    
    return tutorials.filter((tutorial) => {
      const matchesSector = tutorial.sectorId === currentUser.sectorId;
      const matchesSearch = !searchQuery || 
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesSearch;
    });
  }, [tutorials, currentUser, searchQuery]);

  if (!currentUser) return null;

  const sectorName = currentUser.sectorId ? getSectorName(currentUser.sectorId) : 'Não definido';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="main-content">
        {/* Sector Banner */}
        <div className="card-industrial bg-primary text-primary-foreground mb-4">
          <div className="flex items-center gap-3">
            <FolderOpen size={24} />
            <div>
              <p className="text-sm opacity-90">Seu setor:</p>
              <p className="text-xl font-bold">{sectorName}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Tutoriais do seu setor</h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-10 border border-input bg-background"
            placeholder="Buscar tutorial..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Tutorials List */}
        <div className="space-y-4">
          {userTutorials.length === 0 ? (
            <div className="card-industrial text-center py-8 text-muted-foreground">
              {searchQuery 
                ? 'Nenhum tutorial encontrado' 
                : 'Nenhum tutorial disponível para o seu setor'
              }
            </div>
          ) : (
            userTutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                onView={() => setViewingTutorial(tutorial)}
              />
            ))
          )}
        </div>
      </main>

      {/* Tutorial Viewer Modal */}
      {viewingTutorial && (
        <TutorialViewer
          tutorial={viewingTutorial}
          onClose={() => setViewingTutorial(null)}
        />
      )}
    </div>
  );
}
