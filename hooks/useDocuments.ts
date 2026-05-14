import { useState, useEffect } from 'react';
import { GeneratedDocument } from '../types';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const fetchDocuments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const saveDocument = async (doc: Omit<GeneratedDocument, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...doc,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setDocuments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Error saving document:", err);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
      throw err;
    }
  };

  return { documents, fetchDocuments, saveDocument, deleteDocument, isLoading };
};
