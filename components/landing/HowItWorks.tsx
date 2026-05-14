import React from 'react';
import { motion } from 'motion/react';
import { PencilLine, Sparkles, FileDown, Rocket } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      title: "Choose Subject",
      description: "Select the subject and grade level you're teaching. From Primary to A-Level.",
      icon: PencilLine
    },
    {
      title: "Enter Topic",
      description: "Provide the topic or learning objective. Soma knows the Ugandan syllabus inside out.",
      icon: Sparkles
    },
    {
      title: "AI Generates",
      description: "Wait seconds as our AI builds a structured, curriculum-ready document for you.",
      icon: Rocket
    },
    {
      title: "Review & Export",
      description: "Make any final tweaks, and export to a professionally formatted PDF or Word file.",
      icon: FileDown
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface dark:bg-surface relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Simple Process</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-content mb-6">How it Works</h3>
          <p className="text-lg text-content/60 leading-relaxed">
            Going from a blank page to a printable school document in under a minute without zero technical expertise.
          </p>
        </div>

        <div className="relative mt-20">
          {/* Connector Line */}
          <div className="absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 hidden lg:block" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center flex flex-col items-center"
              >
                <div className="h-20 w-20 rounded-2xl bg-white dark:bg-surface-card border border-border mt-[-40px] shadow-sm flex items-center justify-center text-primary-foreground mb-8 relative z-10 transition-transform hover:scale-110 duration-300">
                  <step.icon size={32} />
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary-foreground text-surface-dark flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-content mb-3">{step.title}</h4>
                <p className="text-content/60 text-sm leading-relaxed max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dashboard preview placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-5xl mx-auto rounded-3xl border border-border bg-white dark:bg-surface-card p-6 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b dark:border-white/10">
             <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary-foreground">
                  <PencilLine size={20} />
                </div>
                <div>
                   <div className="text-sm font-bold text-content">Generate Lesson Plan</div>
                   <div className="text-xs text-content-muted">Primary Science • Unit 4</div>
                </div>
             </div>
             <div className="flex gap-2">
                <div className="h-8 w-24 bg-surface rounded-full animate-pulse" />
                <div className="h-8 w-24 bg-primary/20 rounded-full animate-pulse" />
             </div>
          </div>
          
          <div className="space-y-6">
             <div className="h-4 w-1/4 bg-surface rounded animate-pulse" />
             <div className="space-y-3">
                <div className="h-3 w-full bg-surface rounded animate-pulse" />
                <div className="h-3 w-full bg-surface rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-surface rounded animate-pulse" />
             </div>
             <div className="h-32 w-full bg-primary/5 rounded-xl border border-dashed border-primary/20 flex items-center justify-center">
                <span className="text-primary/40 font-semibold italic text-sm">Real-time content generation...</span>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
