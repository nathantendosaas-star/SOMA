import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { useAuthStore } from '../store/authStore';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    if (!currentUser || (currentUser.role !== 'principal' && currentUser.role !== 'admin')) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedUsers: User[] = (data || []).map(d => ({
        id: d.id,
        email: d.email || '',
        full_name: d.full_name,
        school_name: d.school_name,
        district: d.district,
        subjects_taught: d.subjects,
        classes_taught: d.classes,
        teacher_id: d.teacher_id,
        role: d.role,
        status: d.status
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const updateUserStatus = async (userId: string, status: 'approved' | 'blocked') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    } catch (err) {
      console.error("Error updating user status:", err);
      throw err;
    }
  };

  return { users, fetchUsers, updateUserStatus, isLoading };
};
