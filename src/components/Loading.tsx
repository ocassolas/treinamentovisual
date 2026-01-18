import { useEffect, useState } from 'react';

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if page is fully loaded
    const handleLoad = () => {
      setIsVisible(false);
    };

    window.addEventListener('load', handleLoad);
    
    // Auto-hide after 3 seconds as fallback
    const timer = setTimeout(() => setIsVisible(false), 3000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Animated spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-border"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>

      {/* Loading text */}
      <h2 className="text-xl font-semibold text-foreground mb-2">Carregando...</h2>
      <p className="text-sm text-muted-foreground">Aguarde alguns momentos</p>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-border rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-primary animate-pulse"></div>
      </div>
    </div>
  );
}
