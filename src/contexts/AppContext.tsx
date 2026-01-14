import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Sector, Tutorial, AppState } from '@/types';
import { db, initializeDatabase } from '@/lib/database';

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addSector: (name: string) => Promise<void>;
  deleteSector: (id: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addTutorial: (tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  updateTutorial: (id: string, tutorial: Partial<Tutorial>) => Promise<void>;
  deleteTutorial: (id: string) => Promise<void>;
  markTutorialAsViewed: (tutorialId: string) => Promise<void>;
  getSectorName: (sectorId: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Inicializar banco de dados e carregar dados
  useEffect(() => {
    const loadData = async () => {
      await initializeDatabase();
      const loadedSectors = await db.sectors.toArray();
      const loadedTutorials = await db.tutorials.toArray();
      const loadedUsers = await db.users.toArray();
      setSectors(loadedSectors);
      setTutorials(loadedTutorials);
      setUsers(loadedUsers);
    };
    loadData();
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple mock login - in production, this would validate against a backend
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addSector = async (name: string) => {
    const newSector: Sector = {
      id: Date.now().toString(),
      name,
    };
    setSectors(prev => [...prev, newSector]);
    await db.sectors.add(newSector);
  };

  const deleteSector = async (id: string) => {
    setSectors(prev => prev.filter(s => s.id !== id));
    await db.sectors.delete(id);
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      viewedTutorials: [],
    };
    setUsers(prev => [...prev, newUser]);
    await db.users.add(newUser);
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ...userData } : u
    ));
    await db.users.update(id, userData);
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    await db.users.delete(id);
  };

  const addTutorial = async (tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!currentUser) return;
    const newTutorial: Tutorial = {
      ...tutorialData,
      id: Date.now().toString(),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setTutorials(prev => [...prev, newTutorial]);
    await db.tutorials.add(newTutorial);
  };

  const updateTutorial = async (id: string, tutorialData: Partial<Tutorial>) => {
    setTutorials(prev => prev.map(t => 
      t.id === id ? { ...t, ...tutorialData } : t
    ));
    await db.tutorials.update(id, tutorialData);
  };

  const deleteTutorial = async (id: string) => {
    setTutorials(prev => prev.filter(t => t.id !== id));
    await db.tutorials.delete(id);
  };

  const markTutorialAsViewed = async (tutorialId: string) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser };
    const viewedTutorials = updatedUser.viewedTutorials || [];
    if (!viewedTutorials.includes(tutorialId)) {
      updatedUser.viewedTutorials = [...viewedTutorials, tutorialId];
      setCurrentUser(updatedUser);
      await db.users.update(currentUser.id, { viewedTutorials: updatedUser.viewedTutorials });
    }

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const viewed = u.viewedTutorials || [];
        if (!viewed.includes(tutorialId)) {
          return { ...u, viewedTutorials: [...viewed, tutorialId] };
        }
      }
      return u;
    }));
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
      updateUser,
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
