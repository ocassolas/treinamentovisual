import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { SectorCard } from '@/components/SectorCard';
import { Plus } from 'lucide-react';

export default function Setores() {
  const { sectors, addSector, deleteSector } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newSectorName, setNewSectorName] = useState('');

  const handleAddSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectorName.trim()) {
      await addSector(newSectorName.trim());
      setNewSectorName('');
      setShowForm(false);
    }
  };

  const handleDeleteSector = async (id: string) => {
    if (confirm('Tem certeza que deseja apagar este setor?')) {
      await deleteSector(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="main-content">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Setores</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="h-12 px-4 bg-primary text-primary-foreground flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Novo Setor
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleAddSector} className="card-industrial mb-4">
            <label className="block text-sm font-medium mb-2">Nome do setor</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSectorName}
                onChange={(e) => setNewSectorName(e.target.value)}
                className="flex-1 h-12 px-4 border border-input bg-background"
                placeholder="Ex: Manutenção"
                autoFocus
              />
              <button
                type="submit"
                className="h-12 px-6 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        )}

        {/* Sectors List */}
        <div className="space-y-3">
          {sectors.length === 0 ? (
            <div className="card-industrial text-center py-8 text-muted-foreground">
              Nenhum setor cadastrado
            </div>
          ) : (
            sectors.map((sector) => (
              <SectorCard
                key={sector.id}
                sector={sector}
                onDelete={() => handleDeleteSector(sector.id)}
              />
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
