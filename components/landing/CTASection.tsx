import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-24 bg-white dark:bg-surface relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="relative z-10 bg-primary rounded-3xl md:rounded-[3rem] p-8 md:p-20 text-center text-white overflow-hidden shadow-2xl shadow-primary/30">
          {/* Decorations */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/20 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight">
              Start using Soma to simplify school content generation.
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-8 md:mb-12 leading-relaxed">
              Join thousands of teachers across Uganda who are already using AI to save time and improve curriculum delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:px-10 bg-white text-primary hover:bg-surface text-lg rounded-full font-bold shadow-xl shadow-black/10 transition-transform hover:scale-105 py-7 md:py-6">
                  Get Started for Free
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:px-10 bg-primary-dark/30 text-white border-white/20 hover:bg-primary-dark/50 text-lg rounded-full font-bold transition-transform hover:scale-105 py-7 md:py-6">
                   Request a Demo
                   <MessageSquare size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Contact minimal form hint if needed */}
        <div className="mt-16 md:mt-20 text-center max-w-xl mx-auto px-4 md:px-0">
           <h4 className="text-lg md:text-xl font-bold text-surface-dark dark:text-white mb-4">Want to talk to our education consultants?</h4>
           <p className="text-sm md:text-base text-surface-dark/60 dark:text-white/60 mb-8">Not sure which plan is right for your school? Our team is ready to help you set up Soma for your entire staff.</p>
           <div className="flex flex-col sm:flex-row bg-surface dark:bg-surface-dark p-2 rounded-2xl sm:rounded-full border border-border gap-2">
              <input 
                type="email" 
                placeholder="school-email@edu.ug" 
                className="flex-1 bg-transparent px-6 py-3 sm:py-2 outline-none text-surface-dark dark:text-white"
              />
              <Button size="lg" className="rounded-xl sm:rounded-full px-8 py-6 sm:py-2">Talk to us</Button>
           </div>
        </div>
      </div>
    </section>
  );
};
