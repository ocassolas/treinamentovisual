import { useState } from 'react';
import { User } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { X } from 'lucide-react';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
  const { sectors, updateUser } = useApp();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: user.password,
    sectorId: user.sectorId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim() && formData.password.trim()) {
      await updateUser(user.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        sectorId: formData.sectorId || null,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-bold">Editar Usuário</h3>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center bg-secondary hover:bg-border transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
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
              type="text"
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
          
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 bg-secondary text-secondary-foreground font-medium hover:bg-border transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-12 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
