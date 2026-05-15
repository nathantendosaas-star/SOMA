import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface School {
  id: string;
  name: string;
  district: string;
  plan: string;
  max_teachers: number;
  generations_used: number;
  generations_limit: number;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  school: School | null;
  isLoading: boolean;
  generationCount: number;
  setUser: (user: User | null) => void;
  setSchool: (school: School | null) => void;
  setLoading: (isLoading: boolean) => void;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string, additionalData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  fetchSchool: (schoolId: string) => Promise<void>;
  incrementGenerationCount: () => Promise<void>;
  canGenerate: () => boolean;
  redeemVoucher: (code: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Listen for Supabase auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      await get().fetchProfile(session.user.id);
    } else if (event === 'SIGNED_OUT') {
      set({ user: null, school: null });
    }
  });

  return {
    user: null,
    school: null,
    isLoading: false,
    generationCount: 0,

    setUser: (user) => set({ user }),
    setSchool: (school) => set({ school }),
    setLoading: (isLoading) => set({ isLoading }),

    // ─── SIGN IN ─────────────────────────────────────────
    signIn: async (email, password) => {
      set({ isLoading: true });

      // 1. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });

      if (!error && data.user) {
        await get().fetchProfile(data.user.id);
      } else if (email === 'nathan@soma.ug') {
        // Super Admin bypass
        const superAdmin: User = {
          id: 'super_admin_nate',
          email,
          full_name: 'Nathan T.',
          role: 'super_admin' as any,
          status: 'approved',
        };
        set({ user: superAdmin });
      } else {
        set({ isLoading: false });
        throw new Error(error?.message || 'Invalid email or password.');
      }

      set({ isLoading: false });
    },

    // ─── SIGN UP (School-First) ──────────────────────────
    signUp: async (email, password, additionalData) => {
      set({ isLoading: true });

      // 1. Create Supabase Auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || '',
        options: {
          data: {
            full_name: additionalData?.full_name,
            school_name: additionalData?.school_name,
          },
        },
      });

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      if (!data.user) {
        set({ isLoading: false });
        throw new Error('Signup failed. Please try again.');
      }

      const isPrincipal = additionalData?.role === 'principal';
      let schoolId: string | null = null;

      if (isPrincipal) {
        // ── Principal Flow: CREATE a new school ──
        const { data: schoolData, error: schoolError } = await supabase
          .from('schools')
          .insert([{
            name: additionalData?.school_name || 'Unnamed School',
            district: additionalData?.district || '',
            plan: 'free',
            max_teachers: 2,
            generations_used: 0,
            generations_limit: 20,
          }])
          .select()
          .single();

        if (schoolError) {
          console.error('School creation error:', schoolError);
        } else {
          schoolId = schoolData.id;
        }
      } else {
        // ── Teacher/Secretary Flow: JOIN an existing school ──
        const { data: existingSchool } = await supabase
          .from('schools')
          .select('id')
          .ilike('name', additionalData?.school_name || '')
          .single();

        if (existingSchool) {
          schoolId = existingSchool.id;
        }
        // If no school found, schoolId stays null → teacher is "unassigned"
      }

      // 2. Create Profile linked to school
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          email,
          full_name: additionalData?.full_name,
          school_id: schoolId,
          school_name: additionalData?.school_name,
          district: additionalData?.district,
          role: isPrincipal ? 'principal' : (additionalData?.role || 'teacher'),
          status: isPrincipal ? 'approved' : 'pending',
          subjects: additionalData?.subjects_taught || [],
          classes: additionalData?.classes_taught || [],
          teacher_id: additionalData?.teacher_id,
        }]);

      if (profileError) console.error('Profile creation error:', profileError);

      await get().fetchProfile(data.user.id);
      set({ isLoading: false });
    },

    // ─── SIGN OUT ────────────────────────────────────────
    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null, school: null, generationCount: 0 });
    },

    // ─── FETCH PROFILE + SCHOOL ──────────────────────────
    fetchProfile: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        set({ user: data });

        // Also fetch the linked school
        if (data.school_id) {
          await get().fetchSchool(data.school_id);
        }
      }
    },

    fetchSchool: async (schoolId) => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', schoolId)
        .single();

      if (data && !error) {
        set({ school: data });
      }
    },

    // ─── GENERATION GATING ───────────────────────────────
    canGenerate: () => {
      const { school, user } = get();

      // Super admin always can
      if (user?.role === 'super_admin') return true;

      // No school linked = allow (demo/fallback)
      if (!school) return true;

      // Check if school has remaining generations
      if (school.plan === 'institutional') return true;
      return school.generations_used < school.generations_limit;
    },

    incrementGenerationCount: async () => {
      const { school } = get();
      if (!school) {
        set({ generationCount: get().generationCount + 1 });
        return;
      }

      // Increment the school's usage count in Supabase
      const { error } = await supabase
        .from('schools')
        .update({ generations_used: school.generations_used + 1 })
        .eq('id', school.id);

      if (!error) {
        set({
          school: { ...school, generations_used: school.generations_used + 1 },
          generationCount: get().generationCount + 1,
        });
      }
    },

    // ─── UPDATE PROFILE ──────────────────────────────────
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

    // ─── VOUCHER REDEMPTION (School-Level) ───────────────
    redeemVoucher: async (code) => {
      set({ isLoading: true });
      const { school, user } = get();

      if (!school) {
        set({ isLoading: false });
        throw new Error('You must be linked to a school to redeem a voucher.');
      }

      if (user?.role !== 'principal') {
        set({ isLoading: false });
        throw new Error('Only principals can redeem vouchers for their school.');
      }

      // 1. Find the voucher
      const { data: voucher, error: vErr } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', code)
        .is('redeemed_by', null)
        .single();

      if (vErr || !voucher) {
        set({ isLoading: false });
        throw new Error('Invalid or already-used voucher code.');
      }

      // 2. Determine plan limits
      const planLimits: Record<string, { limit: number; teachers: number }> = {
        pro: { limit: 200, teachers: 10 },
        institutional: { limit: 999999, teachers: 999 },
      };
      const limits = planLimits[voucher.plan] || { limit: 20, teachers: 2 };

      // 3. Upgrade the school
      const { error: schoolErr } = await supabase
        .from('schools')
        .update({
          plan: voucher.plan,
          voucher_code: code,
          generations_limit: limits.limit,
          max_teachers: limits.teachers,
        })
        .eq('id', school.id);

      // 4. Mark voucher as redeemed
      await supabase
        .from('vouchers')
        .update({ redeemed_by: school.id, redeemed_at: new Date().toISOString() })
        .eq('id', voucher.id);

      if (!schoolErr) {
        set({
          school: {
            ...school,
            plan: voucher.plan,
            generations_limit: limits.limit,
            max_teachers: limits.teachers,
          },
        });
      }

      set({ isLoading: false });
    },
  };
});
