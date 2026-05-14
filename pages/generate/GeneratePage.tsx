import React from 'react';
import { GenerateLayout } from '../../components/dashboard/GenerateLayout';
import { OutputPanel } from '../../components/dashboard/OutputPanel';
import { ActionBar } from '../../components/layout/ActionBar';
import { useGenerateStore } from '../../store/generateStore';
import { useGenerate } from '../../hooks/useGenerate';
import { useDocuments } from '../../hooks/useDocuments';
import { toast } from '../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export const GeneratePage = ({ Form, type, title }: { Form: any, type: string, title: string }) => {
  const { isGenerating, output, setGenerating, setOutput } = useGenerateStore();
  const { saveDocument } = useDocuments();
  const navigate = useNavigate();

  const { generate, error } = useGenerate();

  const handleGenerate = async (data: any) => {
    await generate(type, data);
  };

  const handleSave = async () => {
    if (!output) return;
    try {
      const doc = await saveDocument({
        type: type as any,
        title: `${title}: New Document`,
        subject: "General",
        class_level: "P1",
        content: output,
      });
      if (doc) {
        toast('Document saved successfully!');
        navigate(`/documents/${doc.id}`);
      }
    } catch (err) {
      toast('Failed to save document', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-dark">{title}</h1>
          <p className="text-muted text-sm">Fill in the details below to generate your material.</p>
        </div>
        {output && !isGenerating && (
          <ActionBar 
            onSave={handleSave} 
            onRegenerate={() => handleGenerate({})} 
            outputName={title} 
            docInfo={{}}
          />
        )}
      </div>

      <GenerateLayout 
        form={<Form onGenerate={handleGenerate} />}
        output={<OutputPanel isGenerating={isGenerating} output={output} type={type} />}
      />
    </div>
  );
};
