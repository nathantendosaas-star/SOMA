import { useEffect } from 'react';
import { usePrintStore } from '../store/printStore';
import { useAuth } from '../hooks/useAuth';
import { FileText, Printer, Search, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const PrintQueue = () => {
  const { jobs, isLoading, fetchJobs, markAsPrinted } = usePrintStore();
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  if (user?.role !== 'secretary' && user?.role !== 'principal' && user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Shield className="w-16 h-16 text-muted mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-surface-dark mb-2">Access Denied</h2>
        <p className="text-muted max-w-md">You need to be a secretary or school admin to view the print queue.</p>
      </div>
    );
  }

  const pendingJobs = jobs.filter(j => j.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-dark tracking-tight mb-2">Print Queue</h1>
          <p className="text-muted">Manage printing requests from teachers.</p>
        </div>
        <div className="bg-white border border-border px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
          <Search size={16} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search pending docs..." 
            className="border-none bg-transparent outline-none ring-0 w-48"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : pendingJobs.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted col-span-full">
          <Printer size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium text-lg">No documents in print queue</p>
          <p className="text-sm mt-1">When teachers request a print, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-5 border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                  <FileText size={20} />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending Print
                </div>
              </div>
              <h3 className="font-bold text-surface-dark mb-1 line-clamp-2">{job.title}</h3>
              <div className="flex text-xs text-muted mb-2">
                Requested by: {job.requestedBy}
              </div>
              <div className="flex justify-between items-center text-xs text-muted mb-4 mt-auto pt-4">
                <span className="capitalize">{job.type.replace('_', ' ')}</span>
                <span>•</span>
                <span>{job.subject}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                <Button 
                  className="flex-1 text-sm bg-primary text-white py-2 flex items-center justify-center gap-2"
                  onClick={() => markAsPrinted(job.id)}
                >
                  <CheckCircle size={16} />
                  Mark Printed
                </Button>
                <Link to={`/documents/${job.documentId}`} className="p-2 border border-border rounded-xl text-muted hover:bg-surface transition-colors flex items-center justify-center">
                  <FileText size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
