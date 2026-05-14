import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isLoading, signIn, signOut, updateUser, generationCount, redeemVoucher } = useAuthStore();

  return { 
    user, 
    session: user ? { user } : null, 
    isLoading,
    signIn,
    signOut,
    updateUser,
    generationCount,
    redeemVoucher
  };
};
