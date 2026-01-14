import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { TutorialCard } from '@/components/TutorialCard';
import { TutorialViewer } from '@/components/TutorialViewer';
import { Tutorial } from '@/types';
import { CheckCircle } from 'lucide-react';

export default function Concluidos() {
  const { currentUser, tutorials } = useApp();
  const [viewingTutorial, setViewingTutorial] = useState<Tutorial | null>(null);

  const viewedTutorials = useMemo(() => {
    if (!currentUser?.viewedTutorials) return [];
    
    return tutorials.filter((tutorial) => 
      currentUser.viewedTutorials?.includes(tutorial.id)
    );
  }, [tutorials, currentUser]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="main-content">
        {/* Header */}
        <div className="card-industrial bg-accent text-accent-foreground mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} />
            <div>
              <p className="text-xl font-bold">Tutoriais Concluídos</p>
              <p className="text-sm opacity-90">{viewedTutorials.length} tutorial(is) visualizado(s)</p>
            </div>
          </div>
        </div>

        {/* Tutorials List */}
        <div className="space-y-4">
          {viewedTutorials.length === 0 ? (
            <div className="card-industrial text-center py-8 text-muted-foreground">
              Você ainda não visualizou nenhum tutorial.
              <br />
              <span className="text-sm">Acesse a aba "Tutoriais" para começar.</span>
            </div>
          ) : (
            viewedTutorials.map((tutorial) => (
              <div key={tutorial.id} className="relative">
                <TutorialCard
                  tutorial={tutorial}
                  onView={() => setViewingTutorial(tutorial)}
                />
                <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-medium flex items-center gap-1">
                  <CheckCircle size={12} />
                  Concluído
                </div>
              </div>
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
    </div>
  );
}
