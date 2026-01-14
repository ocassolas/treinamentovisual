export interface Sector {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  sectorId: string | null;
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
