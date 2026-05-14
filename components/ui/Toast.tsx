import React, { useState, useEffect } from 'react';

// Simple global toast system
let addToastHandler: (message: string, type?: 'success' | 'error') => void = () => {};

export const toast = (message: string, type: 'success' | 'error' = 'success') => {
  addToastHandler(message, type);
};

export const ToastProvider = () => {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

  useEffect(() => {
    addToastHandler = (message, type = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl shadow-lg border font-sans text-sm animate-in slide-in-from-right-4 fade-in duration-300 ${
            t.type === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};
