import { useState, useRef } from 'react';
import { Tutorial } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { X, Camera, ImageIcon, Plus } from 'lucide-react';

interface EditTutorialModalProps {
  tutorial: Tutorial;
  onClose: () => void;
}

export function EditTutorialModal({ tutorial, onClose }: EditTutorialModalProps) {
  const { sectors, updateTutorial } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  
  const [formData, setFormData] = useState({
    title: tutorial.title,
    description: tutorial.description,
    sectorId: tutorial.sectorId,
    images: [...tutorial.images],
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
    if (formData.title.trim() && formData.sectorId && formData.images.length > 0) {
      await updateTutorial(tutorial.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sectorId: formData.sectorId,
        images: formData.images,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-bold">Editar Tutorial</h3>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center bg-secondary hover:bg-border transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Título <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-12 px-4 border border-input bg-background"
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Descrição (máx. 1000 caracteres)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 1000) })}
              className="w-full h-32 px-4 py-3 border border-input bg-background resize-none"
              placeholder="Descrição do tutorial"
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
              <div className="grid grid-cols-3 gap-2 mb-3">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative aspect-square bg-muted">
                    <img 
                      src={url} 
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 h-6 w-6 bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X size={12} />
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
                className="w-full h-12 border-2 border-dashed border-input bg-background flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus size={18} />
                Adicionar Imagem
              </button>

              {/* Image Options */}
              {showImageOptions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input z-10">
                  <button
                    type="button"
                    onClick={handleTakePhoto}
                    className="w-full h-12 flex items-center gap-3 px-4 hover:bg-secondary transition-colors border-b border-input"
                  >
                    <Camera size={20} className="text-primary" />
                    <span className="font-medium">Tirar Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadFile}
                    className="w-full h-12 flex items-center gap-3 px-4 hover:bg-secondary transition-colors"
                  >
                    <ImageIcon size={20} className="text-primary" />
                    <span className="font-medium">Enviar da Galeria</span>
                  </button>
                </div>
              )}
            </div>
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
