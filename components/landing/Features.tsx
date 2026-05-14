import React, { useEffect, useRef } from 'react';
import { BookOpen, FileQuestion, Calendar, FileText, History, Zap, CheckCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.from(cardsRef.current.children, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
        },
      });
    }
  }, []);

  const features = [
    {
      title: "Lesson Plan Generation",
      description: "Generate detailed, structured lesson plans in seconds. SMART objectives, teaching activities, and learner competencies mapped to the Uganda curriculum.",
      icon: BookOpen,
      color: "bg-blue-500",
      lightColor: "bg-blue-50"
    },
    {
      title: "Exam & Question Papers",
      description: "Build balanced assessments and revision questions with marking schemes. Formatted for Section A and B requirements.",
      icon: FileQuestion,
      color: "bg-purple-500",
      lightColor: "bg-purple-50"
    },
    {
      title: "Curriculum Aligned",
      description: "Outputs are strictly organized by class level, subject, and topic based on NCDC and UNEB standards.",
      icon: Calendar,
      color: "bg-green-500",
      lightColor: "bg-green-50"
    },
    {
      title: "Professional PDF Export",
      description: "Download ready-to-print documents with clean typography and layout. No more formatting headaches.",
      icon: FileText,
      color: "bg-orange-500",
      lightColor: "bg-orange-50"
    },
    {
      title: "Saved History & Reuse",
      description: "Full history of your generations. Easily access, edit, and redownload past work anytime.",
      icon: History,
      color: "bg-cyan-500",
      lightColor: "bg-cyan-50"
    },
    {
      title: "Teacher-Led Workflow",
      description: "Designed around how teachers actually work. Simple prompts, powerful results. No technical skills needed.",
      icon: Zap,
      color: "bg-red-500",
      lightColor: "bg-red-50"
    }
  ];

  return (
    <section id="features" ref={sectionRef} className="py-24 bg-white dark:bg-surface">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Powerful Features</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-content mb-6 leading-tight">Everything a school need to excel</h3>
          <p className="text-lg text-content/60 leading-relaxed">
            Stop spending weekends on paperwork. Soma is trained on NCDC syllabi to give you back your most valuable resource: time.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-8 rounded-3xl border border-border bg-white dark:bg-surface-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className={`h-14 w-14 rounded-2xl ${feature.lightColor} dark:bg-opacity-10 flex items-center justify-center mb-6 text-white overflow-hidden relative`}>
                <div className={`absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-500 ${feature.color}`} />
                <feature.icon className={`h-7 w-7 ${feature.color.replace('bg-', 'text-')}`} />
              </div>
              <h4 className="text-xl font-bold text-content mb-3 group-hover:text-primary transition-colors">{feature.title}</h4>
              <p className="text-content/60 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits section */}
        <div className="mt-24 p-12 rounded-[2.5rem] bg-surface-dark text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">90%</div>
              <div className="text-lg font-semibold mb-2">Time Saved</div>
              <p className="text-sm text-gray-400">Average time saved on lesson plan preparation.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">100%</div>
              <div className="text-lg font-semibold mb-2">NCDC Aligned</div>
              <p className="text-sm text-gray-400">Strictly follows Ugandan curriculum standards.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">AI Assistance</div>
              <p className="text-sm text-gray-400">Always available to help you build better lessons.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">Free</div>
              <div className="text-lg font-semibold mb-2">To Start</div>
              <p className="text-sm text-gray-400">Try it today with 5 free generations each month.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
