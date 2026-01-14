import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { TutorialCard } from '@/components/TutorialCard';
import { TutorialViewer } from '@/components/TutorialViewer';
import { EditTutorialModal } from '@/components/EditTutorialModal';
import { Tutorial } from '@/types';
import { Plus, Search, X } from 'lucide-react';

export default function Tutoriais() {
  const { tutorials, sectors, deleteTutorial } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState(searchParams.get('setor') || '');
  const [viewingTutorial, setViewingTutorial] = useState<Tutorial | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tutorial) => {
      const matchesSector = !selectedSector || tutorial.sectorId === selectedSector;
      const matchesSearch = !searchQuery || 
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesSearch;
    });
  }, [tutorials, selectedSector, searchQuery]);

  const handleDeleteTutorial = (id: string) => {
    if (confirm('Tem certeza que deseja apagar este tutorial?')) {
      deleteTutorial(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="main-content">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tutoriais</h2>
          <button
            onClick={() => navigate('/admin/tutoriais/novo')}
            className="h-12 px-4 bg-primary text-primary-foreground flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Novo
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-4">
          {/* Search */}
          <div className="relative">
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

          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full h-12 px-4 border border-input bg-background"
          >
            <option value="">Todos os setores</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tutorials Grid */}
        <div className="space-y-4">
          {filteredTutorials.length === 0 ? (
            <div className="card-industrial text-center py-8 text-muted-foreground">
              Nenhum tutorial encontrado
            </div>
          ) : (
            filteredTutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                showDelete
                showEdit
                onView={() => setViewingTutorial(tutorial)}
                onEdit={() => setEditingTutorial(tutorial)}
                onDelete={() => handleDeleteTutorial(tutorial.id)}
              />
            ))
          )}
        </div>
      </main>

      <BottomNav />

      {/* Tutorial Viewer Modal */}
      {viewingTutorial && (
        <TutorialViewer
          tutorial={viewingTutorial}
          onClose={() => setViewingTutorial(null)}
        />
      )}

      {/* Edit Tutorial Modal */}
      {editingTutorial && (
        <EditTutorialModal
          tutorial={editingTutorial}
          onClose={() => setEditingTutorial(null)}
        />
      )}
    </div>
  );
}
