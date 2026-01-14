export interface Sector {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  sectorId: string | null;
  viewedTutorials?: string[];
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  images: string[];
  audioUrl?: string;
  sectorId: string;
  createdBy: string;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  sectors: Sector[];
  tutorials: Tutorial[];
  users: User[];
}
