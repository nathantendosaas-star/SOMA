import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export const GenerateLayout = ({ form, output }: { form: React.ReactNode; output: React.ReactNode }) => {
  const { generationCount } = useAuth();
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
      <div className="w-full lg:w-[40%] flex flex-col bg-white rounded-2xl border border-border overflow-hidden shadow-sm relative">
        {generationCount >= 5 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Free Tier Limit Reached</h3>
              <p className="text-sm mb-4">You have used all 5 of your free generations for this month.</p>
              <Link to="/settings" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition">
                Upgrade to Continue
              </Link>
            </div>
          </div>
        )}
        <div className="p-6 border-b border-border bg-surface/50">
          <h2 className="font-display text-xl text-surface-dark">Settings</h2>
          <p className="text-sm text-muted">Configure your generation preferences.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {form}
        </div>
      </div>
      
      <div className="w-full lg:w-[60%] flex flex-col bg-white rounded-2xl border border-border shadow-sm overflow-hidden relative">
        <div className="flex-1 overflow-y-auto" id="output-container">
          {output}
        </div>
      </div>
    </div>
  );
};
