import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface TestMessage {
  id: string;
  device: string;
  message: string;
  timestamp: number;
}

export function SyncTest() {
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastError, setLastError] = useState<string | null>(null);

  // Detectar nome do dispositivo
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/mobile|android|iphone|ipad/i.test(ua)) {
      setDevice('📱 Celular');
    } else {
      setDevice('💻 Computador');
    }

    // Monitorar conexão
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Carregar mensagens em tempo real
  useEffect(() => {
    const colRef = collection(db, 'sync_test');
    const q = query(colRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TestMessage[];
      setMessages(data);
    }, (error) => {
      console.error('Erro ao carregar mensagens:', error);
      setLastError(String(error));
    });

    return () => unsubscribe();
  }, []);

  // Enviar mensagem
  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'sync_test'), {
        device: device,
        message: input.trim(),
        timestamp: Date.now()
      });
      setInput('');
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setLastError(String(error));
      alert('Erro ao enviar! Verifique a conexão. Verifique console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'sync_test', id));
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h1 className="text-2xl font-bold mb-2">🔄 Teste de Sincronização Firebase</h1>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Seu dispositivo:</strong> {device}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={isOnline ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {isOnline ? '🟢 Online' : '🔴 Offline (dados salvos localmente)'}
            </span>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            💡 Abra esta página em seu celular e computador ao mesmo tempo. Envie mensagens de um dispositivo e veja aparecer instantaneamente no outro!
          </p>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="space-y-3"
        >
          <Input
            placeholder="Digite uma mensagem para testar a sincronização..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          Mensagens em Tempo Real ({messages.length})
        </h2>
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhuma mensagem ainda. Comece a testar!
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <Card key={msg.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{msg.device}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.message}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(msg.id)}
                  >
                    ✕
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p>📌 <strong>Como funciona:</strong></p>
        <ul className="mt-2 space-y-1">
          <li>• Cada dispositivo envia mensagens pro Firebase Firestore</li>
          <li>• Os dados sincronizam em <strong>tempo real</strong> entre dispositivos</li>
          <li>• Se desconectar, os dados são salvos <strong>localmente</strong> e sincronizam quando reconectar</li>
          <li>• Abra DevTools (F12) → Console para ver logs do Firebase</li>
        </ul>
      </div>
      {lastError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          <strong>Erro detectado:</strong>
          <pre className="whitespace-pre-wrap break-words mt-2">{lastError}</pre>
        </div>
      )}
    </div>
  );
}
