import { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft, X, Camera, ImageIcon, Plus } from 'lucide-react';

export default function NovoTutorial() {
  const { sectors, addTutorial } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sectorId: '',
    images: [] as string[],
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, result],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
    setShowImageOptions(false);
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.sectorId || formData.images.length === 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    await addTutorial({
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
            <label className="block text-sm font-medium mb-2">Descrição (máx. 1000 caracteres)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 1000) })}
              className="w-full h-32 px-4 py-3 border border-input bg-background resize-none"
              placeholder="Exemplo: Sempre utilize luvas antes de iniciar a operação"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/1000 caracteres
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

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Add Image Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowImageOptions(!showImageOptions)}
                className="w-full h-14 border-2 border-dashed border-input bg-background flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus size={20} />
                Adicionar Imagem
              </button>

              {/* Image Options Modal */}
              {showImageOptions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-input z-10">
                  <button
                    type="button"
                    onClick={handleTakePhoto}
                    className="w-full h-14 flex items-center gap-3 px-4 hover:bg-secondary transition-colors border-b border-input"
                  >
                    <Camera size={22} className="text-primary" />
                    <span className="font-medium">Tirar Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadFile}
                    className="w-full h-14 flex items-center gap-3 px-4 hover:bg-secondary transition-colors"
                  >
                    <ImageIcon size={22} className="text-primary" />
                    <span className="font-medium">Enviar da Galeria</span>
                  </button>
                </div>
              )}
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
