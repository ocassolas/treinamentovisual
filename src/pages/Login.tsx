import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, currentUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (currentUser) {
    navigate(currentUser.role === 'admin' ? '/admin' : '/app');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    const success = login(email, password);
    if (success) {
      // Navigation will happen via useEffect
    } else {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold">Treinamento Visual</h1>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="max-w-sm mx-auto w-full">
          <h2 className="text-xl font-semibold mb-6">Entrar no sistema</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 border border-input bg-background text-lg"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-4 border border-input bg-background text-lg"
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-14 bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors mt-6"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
