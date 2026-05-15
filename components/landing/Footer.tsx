import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="pt-24 pb-12 bg-surface-dark text-white border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-2xl">Soma</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
              Smart school software designed for Ugandan teachers and schools. Built to align with NCDC and UNEB standards.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={Facebook} href="https://facebook.com" />
              <SocialLink icon={Twitter} href="https://twitter.com" />
              <SocialLink icon={Instagram} href="https://instagram.com" />
              <SocialLink icon={Linkedin} href="https://linkedin.com" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Teacher Dashboard</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">School Portal</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="/#about" className="hover:text-primary transition-colors">Vision</a></li>
              <li><a href="/#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-0.5" />
                <a href="mailto:support@soma.ug" className="hover:text-primary transition-colors">support@soma.ug</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-0.5" />
                <a href="tel:+256700000000" className="hover:text-primary transition-colors">+256 700 000000</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5" />
                <span>Kampala, Uganda</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Soma Uganda. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon: Icon, href }: { icon: any; href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300">
    <Icon size={18} />
  </a>
);
