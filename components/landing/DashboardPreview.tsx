import React from 'react';
import { motion } from 'motion/react';
import { Plus, Clock, FileText, Search, User } from 'lucide-react';
import { Button } from '../ui/Button';

export const DashboardPreview = () => {
  return (
    <section className="py-24 bg-surface/50 border-y border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Behind the Scenes</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-content mb-6 dark:text-white">Experience the Teacher Dashboard</h3>
          <p className="text-lg text-content-muted leading-relaxed dark:text-white/60">
            A clean, modular interface designed to keep your focus on teaching, not navigating software.
          </p>
        </div>

        <div className="max-w-6xl mx-auto rounded-3xl border border-border bg-white dark:bg-surface-dark shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-auto md:h-[700px]">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-surface/50 dark:bg-surface-dark flex flex-row md:flex-col p-4 overflow-x-auto no-scrollbar">
             <div className="flex items-center gap-3 mb-0 md:mb-10 px-2 mr-6 md:mr-0">
                <div className="h-8 w-8 rounded bg-primary shrink-0" />
                <div className="h-4 w-24 bg-content/10 rounded hidden md:block" />
             </div>
             
             <div className="flex flex-row md:flex-col gap-4 flex-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="h-6 w-6 rounded bg-content/5 group-hover:bg-primary/20 shrink-0" />
                    <div className="h-3 w-24 md:w-32 bg-content/5 rounded hidden lg:block" />
                  </div>
                ))}
             </div>
             
             <div className="hidden md:flex pt-4 border-t border-border items-center gap-3 px-2">
                <div className="h-8 w-8 rounded-full bg-content/10 shrink-0" />
                <div className="hidden md:block">
                  <div className="h-3 w-20 bg-content/10 rounded mb-1" />
                  <div className="h-2 w-10 bg-content/5 rounded" />
                </div>
             </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-[400px]">
             <header className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-white/50 dark:bg-surface/50 backdrop-blur-md">
                <div className="flex items-center gap-2 bg-surface/50 dark:bg-surface-card px-4 py-1.5 md:py-2 rounded-full border border-border w-1/2 md:w-1/3">
                  <Search size={14} className="text-content-muted" />
                  <div className="h-2.5 w-20 md:w-32 bg-content/10 rounded" />
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-content/10" />
                  <div className="h-6 w-16 md:h-8 md:w-24 bg-primary rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer" />
                </div>
             </header>

             <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-8 max-h-[500px] md:max-h-none bg-white dark:bg-surface-card/50">
                <div className="flex items-center justify-between">
                   <div className="h-6 md:h-8 w-32 md:w-48 bg-content/10 rounded" />
                   <div className="h-8 md:h-10 w-32 md:w-40 bg-primary/10 rounded-xl" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                   {['Mathematics', 'English', 'Science'].map((subject, idx) => (
                      <div key={subject} className={`p-4 md:p-6 rounded-2xl border border-border bg-white dark:bg-surface shadow-sm hover:shadow-md transition-shadow ${idx > 0 ? 'hidden sm:block' : ''}`}>
                         <div className="flex justify-between items-start mb-4">
                            <div className="h-8 md:h-10 w-8 md:w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">{subject[0]}</div>
                            <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-surface" />
                         </div>
                         <div className="h-3 md:h-4 w-3/4 bg-surface-dark/10 rounded mb-2" />
                         <div className="h-2 w-1/2 bg-surface-dark/5 rounded" />
                      </div>
                   ))}
                </div>

                <div className="bg-white dark:bg-surface rounded-2xl border border-border shadow-sm p-4 md:p-6 overflow-hidden">
                   <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div className="h-3 md:h-4 w-24 md:w-32 bg-surface-dark/10 rounded" />
                      <div className="h-2 md:h-3 w-12 md:w-16 bg-surface-dark/5 rounded" />
                   </div>
                   <div className="space-y-3 md:space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between py-2 md:py-3 border-b border-surface last:border-0">
                           <div className="flex items-center gap-3 md:gap-4">
                              <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-surface flex items-center justify-center">
                                 <FileText size={16} className="text-surface-dark/20" />
                              </div>
                              <div>
                                 <div className="h-3 md:h-4 w-24 md:w-40 bg-surface-dark/10 rounded mb-1" />
                                 <div className="h-2 w-12 md:w-20 bg-surface-dark/5 rounded" />
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <div className="h-6 md:h-8 w-14 md:w-20 bg-surface rounded" />
                              <div className="h-6 w-6 md:h-8 md:w-8 bg-surface rounded" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </main>
          </div>

          {/* Floating Action Button */}
          <div className="absolute bottom-10 right-10 flex h-14 w-14 rounded-full bg-primary text-white items-center justify-center shadow-2xl shadow-primary/40 cursor-pointer animate-pulse transition-transform hover:scale-110">
             <Plus size={24} />
          </div>
        </div>

        <div className="mt-16 bg-white dark:bg-surface-dark overflow-hidden rounded-[2rem] border border-border py-8 px-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto shadow-sm">
           <div className="space-y-2 text-center md:text-left">
              <h4 className="text-xl font-bold dark:text-white">Ready to see it in action?</h4>
              <p className="text-surface-dark/60 dark:text-white/60">Our platform is currently being used by 50+ schools across Uganda.</p>
           </div>
           <div className="flex gap-4">
              <Button variant="secondary" className="rounded-full">View Demos</Button>
              <Button className="rounded-full">Join the Waitlist</Button>
           </div>
        </div>
      </div>
    </section>
  );
};
