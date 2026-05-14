import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    {
      question: "What does Soma do?",
      answer: "Soma is an AI-powered curriculum assistant built specifically for teachers. It generates lesson plans, exams, revision questions, and schemes of work that are strictly aligned with the Uganda National Curriculum (NCDC and UNEB standards)."
    },
    {
      question: "Who is it for?",
      answer: "Soma is designed for school administrators, primary teachers, and secondary teachers who want to reduce their administrative paperwork and spend more time focused on student learning."
    },
    {
      question: "Can it generate lesson plans?",
      answer: "Yes, Soma takes your subject and topic and produces a structured lesson plan including SMART objectives, introduction, main teaching activities, learner tasks, and assessment methods."
    },
    {
      question: "Can it create exams?",
      answer: "Absolutely. It can build full exam papers with Section A and Section B formatting, complete with answer guides and marking schemes based on standard UNEB patterns."
    },
    {
      question: "Does it support PDF export?",
      answer: "Yes, every document generated can be exported as a clean, professionally formatted PDF or Word document ready for immediate printing or sharing."
    },
    {
      question: "Is it built for Ugandan schools?",
      answer: "Yes. Unlike generic AI tools, Soma is specifically calibrated on the Ugandan National Curriculum Development Centre (NCDC) syllabi and requirements."
    },
    {
      question: "Can schools use it across multiple subjects?",
      answer: "Soma supports all major subjects in the Ugandan curriculum across Primary levels (P.1–P.7), O-Level (S.1–S.4), and A-Level (S.5–S.6)."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white dark:bg-surface">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Help Center</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-content mb-6">Frequently Asked Questions</h3>
          <p className="text-lg text-content/60 leading-relaxed">
            Everything you need to know about Soma and how it can help your school.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-primary/30 bg-primary/5 dark:bg-primary/20 shadow-sm' : 'border-border bg-white dark:bg-surface-card hover:border-primary/20'}`}>
      <button 
        className="w-full text-left p-6 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`font-bold text-lg ${isOpen ? 'text-primary dark:text-primary-foreground' : 'text-content'}`}>{question}</span>
        {isOpen ? <ChevronUp className="text-primary dark:text-primary-foreground" /> : <ChevronDown className="text-content-muted/40" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-content/60 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
