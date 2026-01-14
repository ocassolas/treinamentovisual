import { Sector } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Trash2, BookOpen } from 'lucide-react';

interface SectorCardProps {
  sector: Sector;
  onDelete?: () => void;
  onClick?: () => void;
}

export function SectorCard({ sector, onDelete, onClick }: SectorCardProps) {
  const { tutorials } = useApp();
  const tutorialCount = tutorials.filter(t => t.sectorId === sector.id).length;

  return (
    <div 
      className="card-industrial flex items-center justify-between animate-fade-in cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{sector.name}</h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <BookOpen size={16} />
          <span>{tutorialCount} {tutorialCount === 1 ? 'tutorial' : 'tutoriais'}</span>
        </div>
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-10 w-10 flex items-center justify-center bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          aria-label="Apagar setor"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
