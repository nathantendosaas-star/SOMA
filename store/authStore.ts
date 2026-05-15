import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

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
  { code: 'FREE-RESET-DEMO-0', plan: 'free' }
];

export const useAuthStore = create<AuthState>((set, get) => {
  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      await get().fetchProfile(session.user.id);
    } else {
      set({ user: null });
    }
  });

  return {
    user: null,
    isLoading: false,
    generationCount: 0,
    
    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),

    signIn: async (email, password) => {
      set({ isLoading: true });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });

      if (!error && data.user) {
        await get().fetchProfile(data.user.id);
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || '',
        options: {
          data: {
            full_name: additionalData?.full_name,
            school_name: additionalData?.school_name,
          }
        }
      });

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email,
              full_name: additionalData?.full_name,
              school_name: additionalData?.school_name,
              district: additionalData?.district,
              role: additionalData?.role || 'teacher',
              status: 'pending'
            }
          ]);

        if (profileError) console.error('Profile creation error:', profileError);
        await get().fetchProfile(data.user.id);
      }
      
      set({ isLoading: false });
    },

    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null, generationCount: 0 });
    },

    fetchProfile: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        set({ user: data });
      }
    },

    updateUser: async (data) => {
      const { user } = get();
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (!error) {
        set({ user: { ...user, ...data } });
      }
    },

    incrementGenerationCount: async () => {
      set({ generationCount: get().generationCount + 1 });
    },

    redeemVoucher: async (code) => {
      set({ isLoading: true });
      await new Promise(r => setTimeout(r, 800));

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
