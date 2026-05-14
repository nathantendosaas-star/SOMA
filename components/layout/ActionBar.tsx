import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Save, Copy, FileDown, RefreshCw } from 'lucide-react';
import { exportToPDF } from '../../lib/pdf';
import { toast } from '../ui/Toast';

interface ActionBarProps {
  onSave: () => Promise<void>;
  onRegenerate: () => void;
  outputName: string;
  docInfo?: {
    subject?: string;
    classLevel?: string;
    type?: string;
  };
}

export const ActionBar = ({ onSave, onRegenerate, outputName, docInfo }: ActionBarProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = () => {
    const text = document.getElementById('document-output')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      toast('Copied to clipboard');
    }
  };

  const handleExport = (landscape: boolean) => {
    toast(`Generating PDF (${landscape ? 'Landscape' : 'Portrait'})...`);
    exportToPDF('document-output', outputName, { landscape, docInfo });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      toast('Document saved to History');
    } catch (err) {
      toast('Failed to save document', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-border p-4 flex flex-wrap gap-3 items-center justify-between z-10">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="secondary" size="sm" onClick={handleSave} disabled={isSaving}>
          <Save size={16} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          <Copy size={16} className="mr-2" />
          Copy
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleExport(false)}>
          <FileDown size={16} className="mr-2" />
          PDF (Portrait)
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleExport(true)}>
          <FileDown size={16} className="mr-2" />
          PDF (Landscape)
        </Button>
      </div>
      <div>
        <Button variant="primary" size="sm" onClick={onRegenerate}>
          <RefreshCw size={16} className="mr-2" />
          Regenerate
        </Button>
      </div>
    </div>
  );
};
