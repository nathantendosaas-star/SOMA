import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    school: store.school,
    session: store.user ? { user: store.user } : null,
    isLoading: store.isLoading,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    logout: store.signOut,
    updateUser: store.updateUser,
    generationCount: store.generationCount,
    canGenerate: store.canGenerate,
    incrementGeneration: store.incrementGenerationCount,
    redeemVoucher: store.redeemVoucher,
  };
};
