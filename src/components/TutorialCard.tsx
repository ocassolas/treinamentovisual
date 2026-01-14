import { Tutorial } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Trash2, Eye } from 'lucide-react';

interface TutorialCardProps {
  tutorial: Tutorial;
  onView: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function TutorialCard({ tutorial, onView, onDelete, showDelete = false }: TutorialCardProps) {
  const { getSectorName } = useApp();

  return (
    <div className="card-industrial animate-fade-in">
      <div 
        className="cursor-pointer" 
        onClick={onView}
      >
        {tutorial.images[0] && (
          <div className="aspect-video bg-muted mb-3 overflow-hidden">
            <img 
              src={tutorial.images[0]} 
              alt={tutorial.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1">
            {getSectorName(tutorial.sectorId)}
          </span>
        </div>
        <h3 className="font-semibold mb-1">{tutorial.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{tutorial.description}</p>
      </div>
      
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          <Eye size={18} />
          Ver
        </button>
        {showDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex items-center justify-center gap-2 h-12 px-4 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            aria-label="Apagar tutorial"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
