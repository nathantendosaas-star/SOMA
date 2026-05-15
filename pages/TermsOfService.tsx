import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, AlertTriangle, CreditCard, FileText, Ban } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-surface">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl font-display font-bold text-content mb-2">Terms of Service</h1>
        <p className="text-content-muted text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-10 text-content/80 leading-relaxed">
          <section>
            <div className="flex items-center gap-3 mb-3">
              <Scale size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">1. Acceptance of Terms</h2>
            </div>
            <p>
              By accessing or using SOMA ("the Platform"), you agree to be bound by these Terms of Service. 
              The Platform is designed for use by educational institutions in Uganda.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <FileText size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">2. Use of AI-Generated Content</h2>
            </div>
            <ul className="list-disc ml-6 space-y-2">
              <li>AI-generated lesson plans, exams, and schemes of work are provided as drafts for professional educators to review and adapt.</li>
              <li>SOMA does not guarantee that generated content is error-free. Teachers are responsible for reviewing all outputs before use in the classroom.</li>
              <li>Generated content is aligned to NCDC/UNEB standards to the best of our AI's ability.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <CreditCard size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">3. Subscriptions & Payment</h2>
            </div>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Free Plan:</strong> 20 AI generations per month, up to 2 teachers per school.</li>
              <li><strong>Pro Plan:</strong> 200 generations per month, up to 10 teachers. Activated via voucher code.</li>
              <li><strong>Institutional Plan:</strong> Unlimited generations and teachers. Activated via voucher code or direct arrangement.</li>
              <li>Voucher codes are single-use and non-transferable between schools.</li>
              <li>Subscriptions are tied to the school, not individual teachers.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <Ban size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">4. Prohibited Use</h2>
            </div>
            <p>You may not use SOMA to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Generate content for commercial resale</li>
              <li>Share your school's login credentials with unauthorized individuals</li>
              <li>Attempt to reverse-engineer the AI system or exploit API endpoints</li>
              <li>Misrepresent AI-generated content as official UNEB/NCDC publications</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-content">5. Limitation of Liability</h2>
            </div>
            <p>
              SOMA is provided "as is" without warranty of any kind. We are not liable for any damages arising from 
              the use of AI-generated content in educational settings. The Platform may experience downtime for maintenance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
