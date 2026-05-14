import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface PrintJob {
  id: string;
  documentId: string;
  title: string;
  type: string;
  subject: string;
  requestedBy: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface PrintState {
  jobs: PrintJob[];
  isLoading: boolean;
  fetchJobs: () => Promise<void>;
  addJob: (documentId: string) => Promise<void>;
  markAsPrinted: (id: string) => Promise<void>;
}

export const usePrintStore = create<PrintState>((set, get) => ({
  jobs: [],
  isLoading: false,

  fetchJobs: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('print_queue')
        .select(`
          id,
          status,
          created_at,
          document_id,
          documents (
            id,
            title,
            type,
            subject
          ),
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedJobs: PrintJob[] = (data || []).map(d => ({
        id: d.id,
        documentId: d.document_id,
        title: d.documents?.title || 'Untitled',
        type: d.documents?.type || 'lesson_plan',
        subject: d.documents?.subject || 'Unknown',
        requestedBy: d.profiles?.full_name || 'Teacher',
        status: d.status as any,
        createdAt: d.created_at
      }));

      set({ jobs: mappedJobs });
    } catch (err) {
      console.error("Error fetching print queue:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addJob: async (documentId) => {
    try {
      const { error } = await supabase
        .from('print_queue')
        .insert({ document_id: documentId, status: 'pending' });

      if (error) throw error;
      await get().fetchJobs();
    } catch (err) {
      console.error("Error adding job to queue:", err);
    }
  },

  markAsPrinted: async (id) => {
    try {
      const { error } = await supabase
        .from('print_queue')
        .update({ status: 'completed' })
        .eq('id', id);

      if (error) throw error;
      set({ jobs: get().jobs.map(j => j.id === id ? { ...j, status: 'completed' } : j) });
    } catch (err) {
      console.error("Error marking job as printed:", err);
    }
  },
}));
