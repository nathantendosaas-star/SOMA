import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Skeleton } from '../ui/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { Watermark } from '../ui/Watermark';

export const OutputPanel = ({ isGenerating, output, type }: { isGenerating: boolean; output: string | null; type: string }) => {
  const { user } = useAuth();
  
  if (isGenerating && !output) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-primary font-medium">Soma is writing your {type.replace('_', ' ')}...</span>
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <div className="pt-4 space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!output && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted p-8 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-surface flex items-center justify-center">
          <span className="text-2xl opacity-50">✨</span>
        </div>
        <h3 className="font-display text-xl mb-2 text-surface-dark">Ready to generate</h3>
        <p className="text-sm max-w-sm">Fill in the settings on the left and click Generate to see your document here.</p>
      </div>
    );
  }

  return (
    <div className="p-8 prose prose-slate max-w-none font-sans relative" id="document-output">
      {!isGenerating && output && (
        <Watermark text={user?.school_name || 'SOMA UGANDA'} />
      )}
      {isGenerating && output && (
        <div className="flex items-center gap-3 mb-6 bg-primary/5 p-4 rounded-xl border border-primary/20 relative z-10">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-primary font-medium text-sm">Generating content in real-time...</span>
        </div>
      )}
      <div className="markdown-body relative z-10">
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[rehypeKatex]}
        >
          {output}
        </ReactMarkdown>
      </div>
    </div>
  );
};
