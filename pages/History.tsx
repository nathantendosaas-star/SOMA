import { useEffect, useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Trash2, ExternalLink } from 'lucide-react';
import { toast } from '../components/ui/Toast';

import { useNavigate } from 'react-router-dom';

export const History = () => {
  const { documents, fetchDocuments, deleteDocument, isLoading } = useDocuments();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const filtered = sortedDocuments.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
        toast('Document deleted');
      } catch {
        toast('Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-display font-bold text-surface-dark">History</h1>
           <p className="text-muted mt-1">All your generated curriculum materials</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
           <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input 
                placeholder="Search documents..." 
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           <Select 
             className="w-full sm:w-48"
             value={sortBy}
             onChange={e => setSortBy(e.target.value)}
           >
             <option value="newest">Newest First</option>
             <option value="oldest">Oldest First</option>
             <option value="title">Title (A-Z)</option>
           </Select>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20 text-muted">Loading your documents...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <h3 className="font-display text-xl text-surface-dark mb-2">No documents found</h3>
            <p className="text-muted">You haven't generated anything matching this search yet.</p>
          </div>
        ) : (
          filtered.map(doc => (
            <Card 
              key={doc.id} 
              className="hover:border-primary/30 group cursor-pointer transition-colors"
              onClick={() => navigate(`/documents/${doc.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 sm:p-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="hidden sm:flex h-12 w-12 rounded-xl bg-surface items-center justify-center text-primary shrink-0">
                      <span className="font-display font-bold text-lg">{doc.type[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg text-surface-dark truncate pr-4">{doc.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="default">{doc.type.replace('_', ' ')}</Badge>
                        <span className="text-sm text-muted">{doc.subject}</span>
                        <span className="text-sm text-muted">•</span>
                        <span className="text-sm text-muted">{doc.class_level}</span>
                        <span className="text-sm text-muted">•</span>
                        <span className="text-sm text-muted">{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="text-muted hover:text-primary" onClick={(e) => { e.stopPropagation(); navigate(`/documents/${doc.id}`); }}>
                      <ExternalLink size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-error hover:bg-error/10 hover:text-error" onClick={(e) => handleDelete(doc.id, e)}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
