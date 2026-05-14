import { useState } from 'react';
import { useGenerateStore } from '../store/generateStore';

export const useGenerate = () => {
  const [error, setError] = useState<string | null>(null);
  const { setGenerating, setOutput } = useGenerateStore();

  const generate = async (type: string, data: any) => {
    setGenerating(true);
    setOutput("");
    setError(null);

    try {
      const response = await fetch(`/api/generate/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate content');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setOutput(fullText);
      }

    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return { generate, error };
};
