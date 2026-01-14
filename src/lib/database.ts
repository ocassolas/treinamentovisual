import Dexie, { Table } from 'dexie';
import { User, Sector, Tutorial } from '@/types';

export class AppDatabase extends Dexie {
  users!: Table<User>;
  sectors!: Table<Sector>;
  tutorials!: Table<Tutorial>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      users: 'id, name, email, password, role, sectorId, viewedTutorials',
      sectors: 'id, name',
      tutorials: 'id, title, description, images, sectorId, createdBy, createdAt',
    });
  }
}

export const db = new AppDatabase();

// Função para inicializar dados padrão se o banco estiver vazio
export async function initializeDatabase() {
  const userCount = await db.users.count();
  if (userCount === 0) {
    await db.users.bulkAdd([
      { id: 'admin', name: 'Administrador', email: 'admin@empresa.com', password: '123456', role: 'admin', sectorId: null, viewedTutorials: [] },
      { id: 'user1', name: 'João Silva', email: 'joao@empresa.com', password: '123456', role: 'user', sectorId: '1', viewedTutorials: [] },
      { id: 'user2', name: 'Maria Santos', email: 'maria@empresa.com', password: '123456', role: 'user', sectorId: '2', viewedTutorials: [] },
    ]);
  }

  const sectorCount = await db.sectors.count();
  if (sectorCount === 0) {
    await db.sectors.bulkAdd([
      { id: '1', name: 'Produção' },
      { id: '2', name: 'Qualidade' },
      { id: '3', name: 'Limpeza' },
      { id: '4', name: 'Expedição' },
    ]);
  }

  const tutorialCount = await db.tutorials.count();
  if (tutorialCount === 0) {
    await db.tutorials.bulkAdd([
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
}