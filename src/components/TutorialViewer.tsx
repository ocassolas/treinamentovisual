import { Tutorial } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';

interface TutorialViewerProps {
  tutorial: Tutorial;
  onClose: () => void;
}

export function TutorialViewer({ tutorial, onClose }: TutorialViewerProps) {
  const { getSectorName, markTutorialAsViewed } = useApp();
  const [currentImage, setCurrentImage] = useState(0);

  const handleConfirm = async () => {
    await markTutorialAsViewed(tutorial.id);
    onClose();
  };

  const nextImage = () => {
    if (currentImage < tutorial.images.length - 1) {
      setCurrentImage(currentImage + 1);
    }
  };

  const prevImage = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1">
            {getSectorName(tutorial.sectorId)}
          </span>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 flex items-center justify-center bg-secondary hover:bg-border transition-colors"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Image Carousel */}
        {tutorial.images.length > 0 && (
          <div className="relative bg-muted">
            <div className="aspect-video">
              <img
                src={tutorial.images[currentImage]}
                alt={`Imagem ${currentImage + 1} de ${tutorial.images.length}`}
                className="w-full h-full object-contain"
              />
            </div>
            
            {tutorial.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImage === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 bg-card/90 flex items-center justify-center disabled:opacity-30 transition-opacity"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentImage === tutorial.images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 bg-card/90 flex items-center justify-center disabled:opacity-30 transition-opacity"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {tutorial.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`h-3 w-3 ${
                        idx === currentImage ? 'bg-primary' : 'bg-card/70'
                      }`}
                      aria-label={`Ir para imagem ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Text Content */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-3">{tutorial.title}</h2>
          <p className="text-base text-foreground leading-relaxed">{tutorial.description}</p>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleConfirm}
          className="w-full h-14 bg-accent text-accent-foreground font-bold text-lg flex items-center justify-center gap-3 hover:bg-accent/90 transition-colors"
        >
          <Check size={24} />
          Entendi
        </button>
      </div>
    </div>
  );
}
