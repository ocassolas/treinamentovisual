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
    const newSector = { name };
    const docRef = await addDoc(collection(db, 'sectors'), newSector);
    // Firestore will update via onSnapshot
  };

  const deleteSector = async (id: string) => {
    await deleteDoc(doc(db, 'sectors', id));
    // Firestore will update via onSnapshot
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
    const newTutorial = {
      ...tutorialData,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, 'tutorials'), newTutorial);
    // Firestore will update via onSnapshot
  };

  const updateTutorial = async (id: string, tutorialData: Partial<Tutorial>) => {
    await updateDoc(doc(db, 'tutorials', id), tutorialData);
    // Firestore will update via onSnapshot
  };

  const deleteTutorial = async (id: string) => {
    await deleteDoc(doc(db, 'tutorials', id));
    // Firestore will update via onSnapshot
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
