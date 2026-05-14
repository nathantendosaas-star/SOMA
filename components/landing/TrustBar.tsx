import React from 'react';
import { motion } from 'framer-motion';

export const TrustBar = () => {
  return (
    <div className="py-12 bg-white/50 backdrop-blur-sm border-y border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted mb-8">
          Trusted by Educators in 146 Districts across Uganda
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
          <SchoolLogo name="Kampala Parents" />
          <SchoolLogo name="Buddo SS" />
          <SchoolLogo name="Gayaza High" />
          <SchoolLogo name="St. Mary's Kitende" />
          <SchoolLogo name="Namilyango" />
        </div>
      </div>
    </div>
  );
};

const SchoolLogo = ({ name }: { name: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
      {name.charAt(0)}
    </div>
    <span className="font-display font-bold text-lg text-content">{name}</span>
  </div>
);
