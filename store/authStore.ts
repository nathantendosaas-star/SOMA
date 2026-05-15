import { supabase } from '../lib/supabase';

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
      
      // 1. Try Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });

      if (!error && data.user) {
        await get().fetchProfile(data.user.id);
      } else if (email === 'nathan@soma.ug') {
        // Nate's Super Admin Bypass
        const superAdmin: User = {
          id: 'super_admin_nate',
          email,
          full_name: 'Nathan T.',
          role: 'super_admin' as any,
          status: 'approved'
        };
        get().setUser(superAdmin);
      } else {
        // Fallback for Demo
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
      
      // 1. Supabase Auth Signup
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
        // 2. Create Profile in 'profiles' table
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
