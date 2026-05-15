import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, UserCheck, Mail } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-surface">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl font-display font-bold text-content mb-2">Privacy Policy</h1>
        <p className="text-content-muted text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-10 text-content/80 leading-relaxed">
          <section>
            <div className="flex items-center gap-3 mb-3">
              <Shield size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">1. Data We Collect</h2>
            </div>
            <p>When you create an account on SOMA, we collect the following information:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Full name and email address</li>
              <li>School name and district</li>
              <li>Teaching subjects and class levels</li>
              <li>AI-generated documents (lesson plans, exams, schemes)</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <Eye size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">2. How We Use Your Data</h2>
            </div>
            <p>Your data is used exclusively to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Provide AI-generated curriculum content aligned to NCDC standards</li>
              <li>Enable your school's principal to manage staff accounts</li>
              <li>Track usage for billing and plan limits</li>
              <li>Improve the quality of our AI outputs for Ugandan schools</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <Database size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">3. Data Storage & Security</h2>
            </div>
            <p>
              All data is stored securely on <strong>Supabase</strong> (hosted on AWS infrastructure). 
              We use Row Level Security (RLS) to ensure that schools cannot access each other's data. 
              Your AI-generated documents belong to your school and are never shared with third parties.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <UserCheck size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">4. Your Rights</h2>
            </div>
            <p>Under Ugandan data protection law, you have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Request a copy of your personal data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <Mail size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">5. Contact Us</h2>
            </div>
            <p>
              For privacy-related inquiries, contact us at{' '}
              <a href="mailto:support@soma.ug" className="text-primary hover:underline font-bold">support@soma.ug</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
