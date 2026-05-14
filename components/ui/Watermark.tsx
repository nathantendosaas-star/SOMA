import React from 'react';

export const Watermark = ({ text }: { text: string }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
      <div className="text-9xl font-bold -rotate-45 whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};
