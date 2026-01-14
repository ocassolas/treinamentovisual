import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Sector, Tutorial, AppState } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

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

  // Load sectors and tutorials from Firestore
  useEffect(() => {
    try {
      const sectorsUnsubscribe = onSnapshot(collection(db, 'sectors'), (snapshot) => {
        const sectorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sector));
        setSectors(sectorsData);
      });

      const tutorialsUnsubscribe = onSnapshot(collection(db, 'tutorials'), (snapshot) => {
        const tutorialsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial));
        setTutorials(tutorialsData);
      });

      return () => {
        sectorsUnsubscribe();
        tutorialsUnsubscribe();
      };
    } catch (error) {
      console.warn('Firebase not configured, using local data only.', error);
      // Fallback to local data if Firebase fails
      setSectors([
        { id: '1', name: 'Produção' },
        { id: '2', name: 'Qualidade' },
        { id: '3', name: 'Limpeza' },
        { id: '4', name: 'Expedição' },
      ]);
      setTutorials([
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
      ]);
    }
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
    try {
      const newSector = { name };
      await addDoc(collection(db, 'sectors'), newSector);
    } catch (error) {
      console.warn('Firebase not configured, sector not saved to cloud.', error);
      // Fallback: add locally
      const localSector = { id: Date.now().toString(), name };
      setSectors(prev => [...prev, localSector]);
    }
  };

  const deleteSector = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'sectors', id));
    } catch (error) {
      console.warn('Firebase not configured, sector not deleted from cloud.', error);
      setSectors(prev => prev.filter(s => s.id !== id));
    }
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      viewedTutorials: [],
    };
    setUsers(prev => [...prev, newUser]);
    // Users remain local
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ...userData } : u
    ));
    // Users remain local
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    // Users remain local
  };

  const addTutorial = async (tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!currentUser) return;
    try {
      const newTutorial = {
        ...tutorialData,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'tutorials'), newTutorial);
    } catch (error) {
      console.warn('Firebase not configured, tutorial not saved to cloud.', error);
      const localTutorial = {
        ...tutorialData,
        id: Date.now().toString(),
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      setTutorials(prev => [...prev, localTutorial]);
    }
  };

  const updateTutorial = async (id: string, tutorialData: Partial<Tutorial>) => {
    try {
      await updateDoc(doc(db, 'tutorials', id), tutorialData);
    } catch (error) {
      console.warn('Firebase not configured, tutorial not updated in cloud.', error);
      setTutorials(prev => prev.map(t => 
        t.id === id ? { ...t, ...tutorialData } : t
      ));
    }
  };

  const deleteTutorial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tutorials', id));
    } catch (error) {
      console.warn('Firebase not configured, tutorial not deleted from cloud.', error);
      setTutorials(prev => prev.filter(t => t.id !== id));
    }
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
