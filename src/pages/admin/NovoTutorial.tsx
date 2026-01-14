import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft, Upload, X, Image } from 'lucide-react';

export default function NovoTutorial() {
  const { sectors, addTutorial } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sectorId: '',
    images: [] as string[],
  });
  const [imageUrl, setImageUrl] = useState('');

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()],
      });
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.sectorId || formData.images.length === 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    addTutorial({
      title: formData.title.trim(),
      description: formData.description.trim(),
      sectorId: formData.sectorId,
      images: formData.images,
    });

    navigate('/admin/tutoriais');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="main-content">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/tutoriais')}
          className="flex items-center gap-2 mb-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <h2 className="text-xl font-bold mb-4">Novo Tutorial</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Título <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-14 px-4 border border-input bg-background text-lg"
              placeholder="Ex: Uso correto de EPIs"
            />
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Setor <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.sectorId}
              onChange={(e) => setFormData({ ...formData, sectorId: e.target.value })}
              className="w-full h-14 px-4 border border-input bg-background text-lg"
            >
              <option value="">Selecione o setor</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Descrição (máx. 140 caracteres)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 140) })}
              className="w-full h-24 px-4 py-3 border border-input bg-background resize-none"
              placeholder="Exemplo: Sempre utilize luvas antes de iniciar a operação"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/140 caracteres
            </p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imagens <span className="text-destructive">*</span>
            </label>
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative aspect-video bg-muted">
                    <img 
                      src={url} 
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 h-8 w-8 bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Image URL */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Image size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border border-input bg-background"
                  placeholder="URL da imagem"
                />
              </div>
              <button
                type="button"
                onClick={handleAddImage}
                className="h-12 px-4 bg-secondary text-secondary-foreground flex items-center gap-2 hover:bg-border transition-colors"
              >
                <Upload size={18} />
                Adicionar
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Adicione fotos reais do processo. As imagens aparecerão em sequência.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-14 bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-colors mt-6"
          >
            Salvar Tutorial
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
