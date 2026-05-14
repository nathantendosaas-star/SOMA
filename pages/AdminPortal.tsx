import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Key, 
  BarChart3, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../components/ui/Toast';

export const AdminPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'vouchers' | 'feedback'>('overview');

  // Guard: Only Super Admin
  if (user?.role !== 'super_admin') {
     return (
       <div className="p-20 text-center flex flex-col items-center gap-4">
         <XCircle size={48} className="text-error" />
         <h2 className="text-2xl font-bold">Unauthorized Access</h2>
         <p className="text-content-muted">This portal is restricted to SOMA Platform Administrators.</p>
         <Button onClick={() => window.location.href = '/dashboard'}>Return to Dashboard</Button>
       </div>
     );
  }

  const stats = [
    { label: 'Total Schools', value: '42', change: '+12%', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Generations', value: '12,840', change: '+25%', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'MRR (Estimated)', value: 'Shs 4.2M', change: '+18%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Feedback', value: '8', change: '-2', icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const mockSchools = [
    { name: 'St. Mary\'s College Kisubi', district: 'Wakiso', plan: 'institutional', usage: 1240, status: 'active' },
    { name: 'Gayaza High School', district: 'Wakiso', plan: 'institutional', usage: 980, status: 'active' },
    { name: 'Mengo Senior School', district: 'Kampala', plan: 'pro', usage: 450, status: 'active' },
    { name: 'Jinja College', district: 'Jinja', plan: 'free', usage: 45, status: 'pending' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-content">Super-Admin Portal</h1>
          <p className="text-content-muted">Welcome back, Nate. Here is the SOMA network status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download size={16} className="mr-2" /> Export Report
          </Button>
          <Button size="sm">
            <Filter size={16} className="mr-2" /> Filter Data
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-white border border-border shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-content">{stat.value}</div>
            <div className="text-sm text-content-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {['overview', 'schools', 'vouchers', 'feedback'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 px-2 text-sm font-bold transition-all capitalize ${
              activeTab === tab 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-content-muted hover:text-content'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {activeTab === 'schools' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-content-muted">School Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-content-muted">District</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-content-muted">Plan</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-content-muted">Total Usage</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-content-muted">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-content-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockSchools.map((school) => (
                  <tr key={school.name} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-content">{school.name}</td>
                    <td className="px-6 py-4 text-content-muted">{school.district}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        school.plan === 'institutional' ? 'bg-purple-100 text-purple-700' :
                        school.plan === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {school.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-content-muted">{school.usage} docs</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${school.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm capitalize">{school.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpRight size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="p-8 text-center space-y-4">
             <div className="h-40 w-full bg-surface rounded-xl border border-dashed border-border flex items-center justify-center">
                <p className="text-content-muted italic">Global Generation Graph Coming Soon...</p>
             </div>
             <p className="text-sm text-content-muted max-w-lg mx-auto">
               The overview tab will provide real-time charts of user activity, revenue growth, and technical health of the SOMA AI API.
             </p>
          </div>
        )}

        {activeTab === 'vouchers' && (
          <div className="p-8">
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <Key className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">Voucher Factory</h3>
                <p className="text-sm text-content-muted">Generate new license keys for institutional partners.</p>
              </div>
              <div className="space-y-4">
                <select className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-sm">
                  <option>Select Package</option>
                  <option>Pro (Individual)</option>
                  <option>Institutional (School-wide)</option>
                </select>
                <input type="number" placeholder="Number of keys" className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-sm" />
                <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/20">Generate Keys</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="p-8 text-center text-content-muted italic">
            No pending feedback from the community.
          </div>
        )}
      </div>
    </div>
  );
};
