import { create } from 'zustand';
import { User, UserRole } from '../types';

export interface StaffMember extends User {
  name: string;
  status: 'Active' | 'Inactive';
}

interface UserState {
  users: StaffMember[];
  addUser: (user: Omit<StaffMember, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, data: Partial<StaffMember>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [
    { id: '1', email: 'principal@school.ac.ug', name: 'Dr. Mukasa Isaac', role: 'principal', status: 'Active' },
    { id: '2', email: 'admin@school.ac.ug', name: 'Namatovu Sarah', role: 'admin', status: 'Active' },
    { id: '3', email: 'teacher@school.ac.ug', name: 'Okello James', role: 'teacher', status: 'Active' },
    { id: '4', email: 'secretary@school.ac.ug', name: 'Atwine Patience', role: 'secretary', status: 'Active' },
  ],
  addUser: (user) => set((state) => ({ 
    users: [...state.users, { ...user, id: Math.random().toString(36).substr(2, 9) } as StaffMember] 
  })),
  deleteUser: (id) => set((state) => ({ users: state.users.filter(u => u.id !== id) })),
  updateUser: (id, data) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...data } : u) as StaffMember[]
  })),
}));
