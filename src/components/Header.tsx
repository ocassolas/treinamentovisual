import { useApp } from '@/contexts/AppContext';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  return (
    <header className="header-fixed">
      <div className="flex-1">
        <h1 className="text-lg font-bold">Treinamento Visual</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User size={18} />
          <span className="hidden sm:inline">{currentUser.name}</span>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 h-10 px-3 bg-secondary text-secondary-foreground hover:bg-border transition-colors"
          aria-label="Sair"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
