import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';
import { usePrintStore } from '../store/printStore';
import { Button } from '../components/ui/Button';
import { ArrowLeft, RefreshCw, FileDown, Copy, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { exportToPDF } from '../lib/pdf';
import { exportToWord } from '../lib/word';
import { toast } from '../components/ui/Toast';
import { Watermark } from '../components/ui/Watermark';

export const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents } = useDocuments();
  const [doc, setDoc] = useState<any>(null);

  const { user } = useAuth();
  const { addJob, jobs } = usePrintStore();

  useEffect(() => {
    if (documents.length > 0 && id) {
      const found = documents.find((d) => d.id === id);
      if (found) {
        setDoc(found);
      } else {
        toast('Document not found', 'error');
        navigate('/history');
      }
    }
  }, [documents, id, navigate]);

  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full border-2 border-primary border-t-transparent h-8 w-8" />
      </div>
    );
  }

  const handleCopy = () => {
    const text = document.getElementById('document-view-output')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      toast('Copied to clipboard');
    }
  };

  const handleExport = () => {
    toast(`Generating PDF...`);
    exportToPDF(doc, user?.school_name, user?.district);
  };

  const handleExportWord = () => {
    toast(`Generating Word Document...`);
    exportToWord('document-view-output', doc.title.replace(/\s+/g, '_'))
      .then(() => {
        toast('Word Document Generated Successfully!');
      })
      .catch((err) => {
        toast('Failed to generate Word Document.');
        console.error(err);
      });
  };

  const handleEdit = () => {
    // Determine which tool to jump to based on type
    const routeMap: Record<string, string> = {
      'lesson_plan': '/generate/lesson',
      'questions': '/generate/questions',
      'scheme': '/generate/scheme',
      'exam': '/generate/exam'
    };
    const route = routeMap[doc.type] || '/dashboard';
    navigate(route, { state: { initialData: doc } });
  };

  const isPendingPrint = jobs.some(j => j.documentId === doc.id && j.status === 'pending');

  const handlePrintRequest = async () => {
    await addJob(doc.id);
    toast('Document sent to print queue!');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/history')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-dark">{doc.title}</h1>
          <p className="text-muted text-sm capitalize">{doc.type.replace('_', ' ')} • {doc.subject} • {doc.class_level}</p>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-8 prose prose-slate max-w-none font-sans relative" id="document-view-output">
        <Watermark text={user?.school_name || 'SOMA UGANDA'} />
        <div className="markdown-body relative z-10">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {doc.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:pl-64 z-20 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md border-t border-border p-4 flex flex-wrap gap-3 items-center justify-center md:justify-between pointer-events-auto">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              <Copy size={16} className="mr-2" />
              Copy
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <FileDown size={16} className="mr-2" />
              PDF
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportWord}>
              <FileDown size={16} className="mr-2" />
              Word
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handlePrintRequest}
              disabled={isPendingPrint}
            >
              <Printer size={16} className="mr-2" />
              {isPendingPrint ? 'In Print Queue' : 'Queue Print'}
            </Button>
            <Button variant="primary" size="sm" onClick={handleEdit}>
              <RefreshCw size={16} className="mr-2" />
              Open Generator
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
