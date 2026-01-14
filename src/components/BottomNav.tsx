import { useApp } from '@/contexts/AppContext';
import { Home, FolderOpen, Users, BookOpen } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/admin', label: 'Início', icon: <Home size={22} />, adminOnly: true },
  { path: '/admin/setores', label: 'Setores', icon: <FolderOpen size={22} />, adminOnly: true },
  { path: '/admin/usuarios', label: 'Usuários', icon: <Users size={22} />, adminOnly: true },
  { path: '/admin/tutoriais', label: 'Tutoriais', icon: <BookOpen size={22} />, adminOnly: true },
];

const USER_NAV_ITEMS: NavItem[] = [
  { path: '/app', label: 'Tutoriais', icon: <BookOpen size={22} /> },
];

export function BottomNav() {
  const { currentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const items = currentUser.role === 'admin' ? NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <nav className="bottom-nav">
      <div className="flex">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
