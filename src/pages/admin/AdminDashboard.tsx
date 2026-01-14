import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { SectorCard } from '@/components/SectorCard';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Users, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  const { sectors, tutorials, users } = useApp();
  const navigate = useNavigate();

  const stats = [
    { label: 'Setores', value: sectors.length, icon: <FolderOpen size={24} />, path: '/admin/setores' },
    { label: 'Usuários', value: users.filter(u => u.role === 'user').length, icon: <Users size={24} />, path: '/admin/usuarios' },
    { label: 'Tutoriais', value: tutorials.length, icon: <BookOpen size={24} />, path: '/admin/tutoriais' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="main-content">
        <h2 className="text-xl font-bold mb-4">Painel do Administrador</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat) => (
            <button
              key={stat.label}
              onClick={() => navigate(stat.path)}
              className="card-industrial flex flex-col items-center py-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="text-primary mb-2">{stat.icon}</div>
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </button>
          ))}
        </div>

        {/* Sectors List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Setores</h3>
            <button
              onClick={() => navigate('/admin/setores')}
              className="text-sm text-primary font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {sectors.slice(0, 3).map((sector) => (
              <SectorCard 
                key={sector.id} 
                sector={sector}
                onClick={() => navigate(`/admin/tutoriais?setor=${sector.id}`)}
              />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
