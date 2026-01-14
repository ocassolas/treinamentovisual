import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Sector, Tutorial, AppState } from '@/types';

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addSector: (name: string) => void;
  deleteSector: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  addTutorial: (tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'createdBy'>) => void;
  updateTutorial: (id: string, tutorial: Partial<Tutorial>) => void;
  deleteTutorial: (id: string) => void;
  markTutorialAsViewed: (tutorialId: string) => void;
  getSectorName: (sectorId: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SECTORS: Sector[] = [
  { id: '1', name: 'Produção' },
  { id: '2', name: 'Qualidade' },
  { id: '3', name: 'Limpeza' },
  { id: '4', name: 'Expedição' },
];

const INITIAL_USERS: User[] = [
  { id: 'admin', name: 'Administrador', email: 'admin@empresa.com', role: 'admin', sectorId: null },
  { id: 'user1', name: 'João Silva', email: 'joao@empresa.com', role: 'user', sectorId: '1' },
  { id: 'user2', name: 'Maria Santos', email: 'maria@empresa.com', role: 'user', sectorId: '2' },
];

const INITIAL_TUTORIALS: Tutorial[] = [
  {
    id: 't1',
    title: 'Uso correto de EPIs',
    description: 'Sempre utilize luvas e óculos de proteção antes de iniciar a operação.',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'],
    sectorId: '1',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Limpeza de equipamentos',
    description: 'Limpe os equipamentos ao final de cada turno conforme procedimento.',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'],
    sectorId: '3',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [sectors, setSectors] = useState<Sector[]>(() => {
    const saved = localStorage.getItem('sectors');
    return saved ? JSON.parse(saved) : INITIAL_SECTORS;
  });

  const [tutorials, setTutorials] = useState<Tutorial[]>(() => {
    const saved = localStorage.getItem('tutorials');
    return saved ? JSON.parse(saved) : INITIAL_TUTORIALS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('sectors', JSON.stringify(sectors));
  }, [sectors]);

  useEffect(() => {
    localStorage.setItem('tutorials', JSON.stringify(tutorials));
  }, [tutorials]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = (email: string, password: string): boolean => {
    // Simple mock login - in production, this would validate against a backend
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && password === '123456') {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addSector = (name: string) => {
    const newSector: Sector = {
      id: Date.now().toString(),
      name,
    };
    setSectors([...sectors, newSector]);
  };

  const deleteSector = (id: string) => {
    setSectors(sectors.filter(s => s.id !== id));
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const addTutorial = (tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!currentUser) return;
    const newTutorial: Tutorial = {
      ...tutorialData,
      id: Date.now().toString(),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setTutorials([...tutorials, newTutorial]);
  };

  const updateTutorial = (id: string, tutorialData: Partial<Tutorial>) => {
    setTutorials(tutorials.map(t => 
      t.id === id ? { ...t, ...tutorialData } : t
    ));
  };

  const deleteTutorial = (id: string) => {
    setTutorials(tutorials.filter(t => t.id !== id));
  };

  const markTutorialAsViewed = (tutorialId: string) => {
    // In production, this would track user progress
    console.log('Tutorial viewed:', tutorialId);
  };

  const getSectorName = (sectorId: string): string => {
    return sectors.find(s => s.id === sectorId)?.name || 'Setor não encontrado';
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      sectors,
      tutorials,
      users,
      login,
      logout,
      addSector,
      deleteSector,
      addUser,
      deleteUser,
      addTutorial,
      updateTutorial,
      deleteTutorial,
      markTutorialAsViewed,
      getSectorName,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
