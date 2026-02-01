import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export function FirestoreExample() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar dados em tempo real
  useEffect(() => {
    const colRef = collection(db, 'items');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
      setItems(data);
    }, (error) => {
      console.error('Erro ao carregar itens:', error);
    });

    return () => unsubscribe();
  }, []);

  // Adicionar novo item
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const colRef = collection(db, 'items');
      await addDoc(colRef, {
        name: name.trim(),
        description: description.trim(),
        createdAt: Date.now()
      });
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Erro ao adicionar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar item
  const handleUpdate = async (id: string) => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'items', id);
      await updateDoc(docRef, {
        name: name.trim(),
        description: description.trim()
      });
      setName('');
      setDescription('');
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Deletar item
  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(db, 'items', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  // Carregar para edição
  const handleEdit = (item: Item) => {
    setName(item.name);
    setDescription(item.description);
    setEditingId(item.id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Firestore CRUD de Exemplo</h2>
        
        <Card className="p-4 mb-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            editingId ? handleUpdate(editingId) : handleAdd(e);
          }} className="space-y-3">
            <Input
              placeholder="Nome do item"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {editingId ? 'Atualizar' : 'Adicionar'} Item
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setDescription('');
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Itens ({items.length})</h3>
          {items.length === 0 ? (
            <p className="text-gray-500">Nenhum item adicionado. Crie um para começar!</p>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-base">{item.name}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Deletar
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p>💾 <strong>Offline:</strong> Os dados são sincronizados com o navegador via IndexedDB.</p>
        <p>🌐 <strong>Online:</strong> Conectado ao Firebase Firestore em tempo real.</p>
      </div>
    </div>
  );
}
