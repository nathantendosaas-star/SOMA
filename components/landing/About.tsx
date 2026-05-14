import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, BookMarked, ShieldCheck } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-surface">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Our Vision</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-content mb-8 leading-tight">
              Reimagining education workflows for the modern classroom.
            </h3>
            <p className="text-lg text-content/60 mb-8 leading-relaxed">
              Soma is built to help teachers spend less time formatting documents and more time teaching. We believe that by automating the administrative burden of curriculum planning, we can improve educational outcomes across Uganda.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Target size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-content mb-1">Grounded and Useful</h4>
                  <p className="text-sm text-content/60">Practical tools designed for the real daily challenges of the classroom.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-content mb-1">For Teachers, By Teachers</h4>
                  <p className="text-sm text-content/60">Built with feedback from educators in both primary and secondary sectors.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="pt-12">
              <div className="bg-surface dark:bg-surface-card p-8 rounded-3xl border border-border space-y-4 mb-4">
                <BookMarked className="text-primary h-8 w-8" />
                <h4 className="font-bold text-content">Localized</h4>
                <p className="text-sm text-content/60">Specifically trained for Ugandan NCDC curriculum requirements.</p>
              </div>
              <div className="bg-surface dark:bg-surface-card p-8 rounded-3xl border border-border space-y-4">
                <ShieldCheck className="text-primary h-8 w-8" />
                <h4 className="font-bold text-content">Trustworthy</h4>
                <p className="text-sm text-content/60">A premium, academic tool you can rely on for professional school use.</p>
              </div>
            </div>
            <div className="pt-0">
               <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-4 mb-4">
                 <div className="text-4xl font-bold text-primary">100k+</div>
                 <h4 className="font-bold text-content">Words Generated</h4>
                 <p className="text-sm text-content/60">Our AI has already produced thousands of pages of educational content.</p>
              </div>
              <div className="bg-surface dark:bg-surface-card p-8 rounded-3xl border border-border h-full flex flex-col justify-center">
                 <div className="h-3 w-3 rounded-full bg-primary mb-4 animate-pulse" />
                 <h4 className="font-bold text-content">Continuous Growth</h4>
                 <p className="text-sm text-content/60">We update our AI models weekly with new syllabus data and refinements.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
