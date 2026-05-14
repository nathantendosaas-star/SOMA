import { create } from 'zustand';

interface GenerateState {
  isGenerating: boolean;
  output: string | null;
  setGenerating: (isGenerating: boolean) => void;
  setOutput: (output: string | null) => void;
  clearOutput: () => void;
}

export const useGenerateStore = create<GenerateState>((set) => ({
  isGenerating: false,
  output: null,
  setGenerating: (isGenerating) => set({ isGenerating }),
  setOutput: (output) => set({ output }),
  clearOutput: () => set({ output: null }),
}));
