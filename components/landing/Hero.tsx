import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export const Hero = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const floatingRef1 = useRef<HTMLDivElement>(null);
  const floatingRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current.querySelectorAll('.bg-shape'), {
        y: (i, target) => -100 * (i + 1),
        ease: 'none',
        scrollTrigger: {
          trigger: bgRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    gsap.to(floatingRef1.current, {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    gsap.to(floatingRef2.current, {
      y: 20,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: 0.5
    });
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden hero-gradient" id="home">
      {/* Background decoration */}
      <div ref={bgRef} className="absolute inset-0 -z-10 pointer-events-none">
        <div className="bg-shape absolute top-0 right-0 w-1/2 h-full opacity-5 blur-3xl bg-primary transform translate-x-1/2 -translate-y-1/2" />
        <div className="bg-shape absolute bottom-0 left-0 w-1/3 h-full opacity-5 blur-3xl bg-secondary transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full glass border border-primary/10 text-primary font-bold text-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
            Leading AI Platform for Ugandan Institutions
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-content leading-[1.05] tracking-tight mb-10"
          >
            Modernize your school <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-foreground">with SOMA AI.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            The all-in-one assistant for Ugandan teachers. Generate NCDC-standard lesson plans, UNEB-style exams, and schemes of work in seconds. Designed for institutional efficiency.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:px-12 h-16 rounded-2xl text-xl shadow-2xl premium-shadow bg-primary hover:bg-primary/90 transition-all group">
                Register Your School
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:px-10 h-16 rounded-2xl text-lg glass border border-border group">
                <Play className="mr-3 h-5 w-5 fill-primary text-primary" />
                Explore Features
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Dashboard Mockup Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto px-4 md:px-0"
        >
          <div className="relative rounded-2xl border border-content/10 bg-white dark:bg-surface-card p-2 md:p-4 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 mb-2 md:mb-4 px-2">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <div className="h-2 w-2 rounded-full bg-yellow-400" />
                <div className="h-2 w-2 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 px-4">
                <div className="h-4 md:h-6 w-full max-w-[200px] md:max-w-md mx-auto bg-surface dark:bg-surface/50 rounded-full border border-border" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 h-[300px] md:h-[500px]">
              <div className="hidden md:block col-span-3 bg-surface dark:bg-surface/50 rounded-xl border border-border p-4 space-y-4">
                <div className="h-8 w-full bg-white dark:bg-surface-card rounded border border-border" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/60 dark:bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/60 dark:bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-white/60 dark:bg-white/10 rounded" />
                </div>
              </div>
              <div className="col-span-12 md:col-span-9 space-y-2 md:space-y-4">
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="h-16 md:h-24 bg-primary/5 rounded-xl border border-primary/10" />
                  <div className="h-16 md:h-24 bg-accent/5 rounded-xl border border-accent/10" />
                  <div className="h-16 md:h-24 bg-surface dark:bg-surface/50 rounded-xl border border-border" />
                </div>
                <div className="flex-1 bg-surface dark:bg-surface/50 rounded-xl border border-border p-4 md:p-6 h-full min-h-0 overflow-hidden">
                   <div className="space-y-4">
                      <div className="h-8 md:h-10 w-1/2 md:w-1/3 bg-white dark:bg-surface-card rounded border border-border" />
                      <div className="space-y-2 md:block hidden">
                         <div className="h-4 w-full bg-white/60 dark:bg-white/10 rounded" />
                         <div className="h-4 w-full bg-white/60 dark:bg-white/10 rounded" />
                      </div>
                      <div className="h-32 md:h-40 w-full bg-white dark:bg-surface-card rounded border border-border flex items-center justify-center text-content/20 dark:text-white/10 font-bold text-base md:text-xl text-center px-4">
                        Document Preview Ready
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div ref={floatingRef1} className="absolute -top-10 -right-10 hidden lg:block">
            <div className="bg-white dark:bg-surface-card p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-100/10 flex items-center justify-center text-green-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div>
                <div className="text-xs text-content-muted font-sans">Lesson Plan</div>
                <div className="text-sm font-bold font-sans dark:text-white">Successfully Generated</div>
              </div>
            </div>
          </div>

          <div ref={floatingRef2} className="absolute bottom-20 -left-12 hidden lg:block">
            <div className="bg-white dark:bg-surface-card p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <div className="text-xs text-content-muted font-sans">S.2 Biology</div>
                <div className="text-sm font-bold font-sans dark:text-white">UNEB Mock Ready</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
