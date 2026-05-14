import { create } from 'zustand';
import { User, UserRole, UserStatus } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  generationCount: number;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string, additionalData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  incrementGenerationCount: () => Promise<void>;
  redeemVoucher: (code: string) => Promise<void>;
}

// Demo Vouchers (Secure 16-character keys for every package)
const DEMO_VOUCHERS = [
  { code: '4K9N-1J7Z-2B6W-202', plan: 'pro' },
  { code: '8X2P-9L1V-5M7Q-499', plan: 'institutional' },
  { code: 'FREE-RESET-DEMO-0', plan: 'free' } // Added a reset key for testing
];

// Demo Data (Simulating a school database in localStorage)
const getLocalUsers = (): User[] => {
  const stored = localStorage.getItem('soma_demo_users');
  return stored ? JSON.parse(stored) : [];
};

const saveLocalUsers = (users: User[]) => {
  localStorage.setItem('soma_demo_users', JSON.stringify(users));
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUser = JSON.parse(localStorage.getItem('soma_demo_current_user') || 'null');

  return {
    user: initialUser,
    isLoading: false,
    generationCount: 0,
    
    setUser: (user) => {
      localStorage.setItem('soma_demo_current_user', JSON.stringify(user));
      set({ user });
    },
    setLoading: (isLoading) => set({ isLoading }),

    signIn: async (email, password) => {
      set({ isLoading: true });
      await new Promise(r => setTimeout(r, 500));
      
      const users = getLocalUsers();
      const found = users.find(u => u.email === email);

      if (found) {
        get().setUser(found);
      } else if (email === 'nathan@soma.ug') {
        const superAdmin: User = {
          id: 'super_admin_nate',
          email,
          full_name: 'Nathan T.',
          role: 'super_admin' as any,
          status: 'approved'
        };
        get().setUser(superAdmin);
      } else {
        // Default demo login if not found
        const demoUser: User = {
          id: 'demo_id',
          email,
          full_name: 'Demo Principal',
          role: 'principal',
          status: 'approved'
        };
        get().setUser(demoUser);
      }
      set({ isLoading: false });
    },

    signUp: async (email, password, additionalData) => {
      set({ isLoading: true });
      await new Promise(r => setTimeout(r, 500));
      
      const newUser: User = {
        id: `u_${Math.random().toString(36).substr(2, 9)}`,
        email,
        full_name: additionalData?.full_name || email.split('@')[0],
        school_name: additionalData?.school_name,
        district: additionalData?.district,
        subjects_taught: additionalData?.subjects_taught || [],
        classes_taught: additionalData?.classes_taught || [],
        teacher_id: additionalData?.teacher_id,
        role: additionalData?.role || 'teacher',
        status: 'pending' // Demo: Needs principal approval
      };

      const users = getLocalUsers();
      saveLocalUsers([...users, newUser]);
      
      // Auto-login for demo, but status is pending
      get().setUser(newUser);
      set({ isLoading: false });
    },

    signOut: async () => {
      localStorage.removeItem('soma_demo_current_user');
      set({ user: null, generationCount: 0 });
    },

    fetchProfile: async (userId) => {
      const users = getLocalUsers();
      const found = users.find(u => u.id === userId);
      if (found) {
        set({ user: found });
      }
    },

    updateUser: async (data) => {
      const { user } = get();
      if (!user) return;
      
      const updated = { ...user, ...data };
      const users = getLocalUsers().map(u => u.id === user.id ? updated : u);
      saveLocalUsers(users);
      get().setUser(updated);
    },

    incrementGenerationCount: async () => {
      set({ generationCount: get().generationCount + 1 });
    },

    redeemVoucher: async (code) => {
      set({ isLoading: true });
      await new Promise(r => setTimeout(r, 800)); // Simulating network verification

      const voucher = DEMO_VOUCHERS.find(v => v.code === code);
      if (!voucher) {
        set({ isLoading: false });
        throw new Error("Invalid voucher code. Please check and try again.");
      }

      const { user } = get();
      if (user) {
        await get().updateUser({ plan: voucher.plan as any });
      }
      set({ isLoading: false });
    },
  };
});
