import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { EditUserModal } from '@/components/EditUserModal';
import { User } from '@/types';
import { Plus, Trash2, FolderOpen, Pencil } from 'lucide-react';

export default function Usuarios() {
  const { users, sectors, addUser, deleteUser, getSectorName } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    sectorId: '',
  });

  const regularUsers = users.filter(u => u.role === 'user');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim() && formData.password.trim() && formData.sectorId) {
      addUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: 'user',
        sectorId: formData.sectorId,
      });
      setFormData({ name: '', email: '', password: '', sectorId: '' });
      setShowForm(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja apagar este usuário?')) {
      deleteUser(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="main-content">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Usuários</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="h-12 px-4 bg-primary text-primary-foreground flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Novo Usuário
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleAddUser} className="card-industrial mb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-12 px-4 border border-input bg-background"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 px-4 border border-input bg-background"
                placeholder="email@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-12 px-4 border border-input bg-background"
                placeholder="Senha do usuário"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Setor</label>
              <select
                value={formData.sectorId}
                onChange={(e) => setFormData({ ...formData, sectorId: e.target.value })}
                className="w-full h-12 px-4 border border-input bg-background"
              >
                <option value="">Selecione o setor</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
            >
              Salvar Usuário
            </button>
          </form>
        )}

        {/* Users List */}
        <div className="space-y-3">
          {regularUsers.length === 0 ? (
            <div className="card-industrial text-center py-8 text-muted-foreground">
              Nenhum usuário cadastrado
            </div>
          ) : (
            regularUsers.map((user) => (
              <div key={user.id} className="card-industrial flex items-center justify-between animate-fade-in">
                <div className="flex-1">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.sectorId && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                      <FolderOpen size={14} />
                      <span>{getSectorName(user.sectorId)}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="h-10 w-10 flex items-center justify-center bg-secondary text-foreground hover:bg-border transition-colors"
                    aria-label="Editar usuário"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="h-10 w-10 flex items-center justify-center bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    aria-label="Apagar usuário"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
