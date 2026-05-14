import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      description: "Ideal for small schools or individual teachers starting out.",
      price: "0",
      credits: "5",
      userType: "Individual teachers",
      features: [
        "5 Generations per month",
        "Lesson Plan Generator",
        "Exam Paper Generator",
        "Basic PDF Export",
        "Standard Templates"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Standard",
      description: "Perfect for active teachers needing regular classroom materials.",
      price: "300,000",
      credits: "Unlimited",
      userType: "Active school use",
      features: [
        "Unlimited Generations",
        "All 4 Major Generators",
        "Save Document History",
        "Priority AI Queue",
        "Mobile App Access"
      ],
      cta: "Sign Up Pro",
      highlighted: false
    },
    {
      name: "Plus",
      description: "Heavier school use for departments or small schools.",
      price: "600,000",
      credits: "Unlimited",
      userType: "Education teams",
      features: [
        "Everything in Standard",
        "Department Collaboration",
        "Custom School Branding",
        "Advanced PDF Formatting",
        "Answer Guide Generation"
      ],
      cta: "Choose Plus",
      highlighted: false
    },
    {
      name: "Super Plus",
      description: "Comprehensive solution for growing educational institutions.",
      price: "750,000",
      credits: "Unlimited",
      userType: "Large school use",
      features: [
        "Everything in Plus",
        "Multi-School Support",
        "Advanced Analytics",
        "Bulk Printing Support",
        "API Integration"
      ],
      cta: "Get Super Plus",
      highlighted: true
    },
    {
      name: "Enterprise",
      description: "Custom school deployments for large educational institutions.",
      price: "Custom",
      credits: "Unlimited",
      userType: "Custom deployments",
      features: [
        "Unlimited Teacher Accounts",
        "Full Admin Dashboard",
        "School Print Queue System",
        "Custom API Access",
        "Dedicated Support"
      ],
      cta: "Contact Sales",
      highlighted: false,
      isCustom: true
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-surface dark:bg-surface relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Transparent Plans</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-surface-dark dark:text-white mb-6">Simple Pricing for Schools</h3>
          <p className="text-lg text-surface-dark/60 dark:text-white/60 leading-relaxed">
            Choose a plan that fits your school's needs. All plans include NCDC curriculum-aligned AI outputs.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory lg:grid lg:grid-cols-5 gap-6 px-4 -mx-4 md:px-0 md:mx-0 no-scrollbar">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-6 rounded-3xl border snap-center min-w-[280px] sm:min-w-[320px] lg:min-w-0 ${
                plan.highlighted 
                  ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 md:scale-105 z-10' 
                  : 'bg-white dark:bg-surface-card border-border text-content'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-20">
                  Best Value
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="text-lg font-bold mb-1">{plan.name}</h4>
                <p className={`text-xs ${plan.highlighted ? 'text-white/70' : 'text-content/50'}`}>
                  {plan.description}
                </p>
              </div>
              
              <div className="mb-8 flex items-baseline flex-wrap">
                <span className="text-lg font-bold leading-none">{plan.isCustom ? '' : 'UGX '}</span>
                <span className="text-2xl font-bold leading-none mx-0.5">{plan.price}</span>
                {plan.price !== 'Custom' && (
                   <span className={`text-[10px] ${plan.highlighted ? 'text-white/60' : 'text-content/50'} ml-1`}>/month</span>
                )}
              </div>
              
              <div className="flex-1 space-y-4 mb-10">
                 <div className={`text-xs font-bold uppercase tracking-wider ${plan.highlighted ? 'text-white/80' : 'text-primary'}`}>
                    Key Features
                 </div>
                 {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                       <Check size={16} className={`shrink-0 mt-0.5 ${plan.highlighted ? 'text-accent' : 'text-primary'}`} />
                       <span className={plan.highlighted ? 'text-white' : 'text-content'}>{feature}</span>
                    </div>
                 ))}
              </div>
              
              <Link to="/auth" className="block w-full mt-auto">
                 <Button 
                   className={`w-full rounded-full group ${
                     plan.highlighted 
                       ? 'bg-white text-primary hover:bg-surface' 
                       : 'bg-primary text-white hover:bg-primary-dark'
                   }`}
                 >
                   {plan.cta}
                   <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                 </Button>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center text-sm text-surface-dark/50 italic">
          * Mobile Money (MTN & Airtel) payments accepted for all premium plans.
        </div>
      </div>
    </section>
  );
};
