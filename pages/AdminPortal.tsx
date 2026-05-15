import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Key,
  ArrowUpRight,
  Download,
  Copy,
  CheckCircle2,
  XCircle,
  Users,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui/Toast';

interface SchoolRow {
  id: string;
  name: string;
  district: string;
  plan: string;
  generations_used: number;
  generations_limit: number;
  max_teachers: number;
  is_active: boolean;
  created_at: string;
  teacher_count?: number;
}

interface VoucherRow {
  id: string;
  code: string;
  plan: string;
  redeemed_by: string | null;
  redeemed_at: string | null;
  created_at: string;
  school_name?: string;
}

export const AdminPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'vouchers' | 'feedback'>('overview');
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [vouchers, setVouchers] = useState<VoucherRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Voucher Factory state
  const [voucherPlan, setVoucherPlan] = useState('pro');
  const [voucherCount, setVoucherCount] = useState(1);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);

  // Guard: Only Super Admin
  if (user?.role !== 'super_admin') {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <XCircle size={48} className="text-error" />
        <h2 className="text-2xl font-bold text-content">Unauthorized Access</h2>
        <p className="text-content-muted">This portal is restricted to SOMA Platform Administrators.</p>
        <Button onClick={() => (window.location.href = '/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);

    // Fetch schools
    const { data: schoolData } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });

    if (schoolData) {
      // For each school, count teachers
      const schoolsWithCounts = await Promise.all(
        schoolData.map(async (s: any) => {
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', s.id);
          return { ...s, teacher_count: count || 0 };
        })
      );
      setSchools(schoolsWithCounts);
    }

    // Fetch vouchers with school names
    const { data: voucherData } = await supabase
      .from('vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (voucherData) {
      const vouchersWithSchools = await Promise.all(
        voucherData.map(async (v: any) => {
          let school_name = null;
          if (v.redeemed_by) {
            const { data: s } = await supabase.from('schools').select('name').eq('id', v.redeemed_by).single();
            school_name = s?.name;
          }
          return { ...v, school_name };
        })
      );
      setVouchers(vouchersWithSchools);
    }

    setLoading(false);
  };

  // Stats calculations
  const totalSchools = schools.length;
  const activeSchools = schools.filter((s) => s.is_active).length;
  const paidSchools = schools.filter((s) => s.plan !== 'free').length;
  const totalGenerations = schools.reduce((sum, s) => sum + s.generations_used, 0);
  const totalTeachers = schools.reduce((sum, s) => sum + (s.teacher_count || 0), 0);
  const estimatedMRR =
    schools.filter((s) => s.plan === 'pro').length * 50000 +
    schools.filter((s) => s.plan === 'institutional').length * 200000;

  const stats = [
    { label: 'Total Schools', value: totalSchools.toString(), icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Total Teachers', value: totalTeachers.toString(), icon: Users, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' },
    { label: 'AI Generations', value: totalGenerations.toLocaleString(), icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { label: 'Est. MRR', value: `Shs ${(estimatedMRR / 1000).toFixed(0)}k`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  ];

  // Generate voucher keys
  const generateVoucherKeys = async () => {
    const keys: string[] = [];
    for (let i = 0; i < voucherCount; i++) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const segments = Array.from({ length: 4 }, () =>
        Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
      );
      keys.push(segments.join('-'));
    }

    // Insert into Supabase
    const rows = keys.map((code) => ({ code, plan: voucherPlan }));
    const { error } = await supabase.from('vouchers').insert(rows);

    if (error) {
      toast('Failed to generate vouchers: ' + error.message, 'error');
    } else {
      setGeneratedKeys(keys);
      toast(`${keys.length} ${voucherPlan} voucher(s) generated!`);
      fetchAllData();
    }
  };

  const copyKeys = () => {
    navigator.clipboard.writeText(generatedKeys.join('\n'));
    toast('Keys copied to clipboard!');
  };

  // Toggle school active status
  const toggleSchoolStatus = async (schoolId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('schools').update({ is_active: !currentStatus }).eq('id', schoolId);
    if (!error) {
      toast(currentStatus ? 'School deactivated.' : 'School reactivated.');
      fetchAllData();
    }
  };

  // Manually upgrade school
  const upgradeSchool = async (schoolId: string, plan: string) => {
    const limits: Record<string, { limit: number; teachers: number }> = {
      pro: { limit: 200, teachers: 10 },
      institutional: { limit: 999999, teachers: 999 },
    };
    const l = limits[plan] || { limit: 20, teachers: 2 };

    const { error } = await supabase
      .from('schools')
      .update({ plan, generations_limit: l.limit, max_teachers: l.teachers })
      .eq('id', schoolId);

    if (!error) {
      toast(`School upgraded to ${plan}!`);
      fetchAllData();
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-content">Super-Admin Portal</h1>
          <p className="text-content-muted">
            {totalSchools} schools · {totalTeachers} teachers · {paidSchools} paying
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchAllData}>
            <RefreshCw size={16} className="mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 rounded-2xl bg-white dark:bg-surface-card border border-border shadow-sm"
          >
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} w-fit mb-3`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-content">{loading ? '...' : stat.value}</div>
            <div className="text-xs text-content-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border overflow-x-auto">
        {(['overview', 'schools', 'vouchers', 'feedback'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 text-sm font-bold transition-all capitalize whitespace-nowrap ${
              activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-content-muted hover:text-content'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-border overflow-hidden shadow-sm">
        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <h3 className="font-bold text-content">Revenue Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-surface/50 border border-border">
                <div className="text-sm text-content-muted mb-1">Free Schools</div>
                <div className="text-2xl font-bold text-content">{schools.filter((s) => s.plan === 'free').length}</div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-600 mb-1">Pro Schools</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{schools.filter((s) => s.plan === 'pro').length}</div>
                <div className="text-xs text-blue-500">× UGX 50,000/mo</div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-purple-600 mb-1">Institutional Schools</div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{schools.filter((s) => s.plan === 'institutional').length}</div>
                <div className="text-xs text-purple-500">× UGX 200,000/term</div>
              </div>
            </div>

            <h3 className="font-bold text-content pt-4">Top Schools by Usage</h3>
            <div className="space-y-2">
              {schools
                .sort((a, b) => b.generations_used - a.generations_used)
                .slice(0, 5)
                .map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 dark:bg-surface/30">
                    <div>
                      <span className="font-bold text-content text-sm">{s.name}</span>
                      <span className="text-content-muted text-xs ml-2">({s.district})</span>
                    </div>
                    <span className="text-sm font-mono text-content-muted">{s.generations_used} gens</span>
                  </div>
                ))}
              {schools.length === 0 && <p className="text-content-muted italic text-sm">No schools registered yet.</p>}
            </div>
          </div>
        )}

        {/* ── SCHOOLS CRM ── */}
        {activeTab === 'schools' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface/50 dark:bg-surface/30 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">School</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">District</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Plan</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Teachers</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Usage</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-content text-sm">{school.name}</td>
                    <td className="px-4 py-3 text-content-muted text-sm">{school.district}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          school.plan === 'institutional'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : school.plan === 'pro'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {school.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-content-muted text-sm">
                      {school.teacher_count}/{school.max_teachers === 999 ? '∞' : school.max_teachers}
                    </td>
                    <td className="px-4 py-3 text-content-muted text-sm">
                      {school.generations_used}/{school.generations_limit >= 999999 ? '∞' : school.generations_limit}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${school.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs">{school.is_active ? 'Active' : 'Blocked'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {school.plan === 'free' && (
                          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => upgradeSchool(school.id, 'pro')}>
                            → Pro
                          </Button>
                        )}
                        {school.plan !== 'institutional' && (
                          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => upgradeSchool(school.id, 'institutional')}>
                            → Inst
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-xs h-7 ${school.is_active ? 'text-red-500' : 'text-green-500'}`}
                          onClick={() => toggleSchoolStatus(school.id, school.is_active)}
                        >
                          {school.is_active ? 'Block' : 'Unblock'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {schools.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-content-muted italic">
                      No schools registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── VOUCHER FACTORY ── */}
        {activeTab === 'vouchers' && (
          <div className="p-6 space-y-8">
            {/* Generator */}
            <div className="max-w-md mx-auto space-y-5">
              <div className="text-center">
                <Key className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold text-content">Voucher Factory</h3>
                <p className="text-sm text-content-muted">Generate license keys for school partnerships.</p>
              </div>
              <div className="space-y-3">
                <select
                  value={voucherPlan}
                  onChange={(e) => setVoucherPlan(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-white dark:bg-surface text-sm text-content"
                >
                  <option value="pro">Pro (UGX 50,000/mo)</option>
                  <option value="institutional">Institutional (UGX 200,000/term)</option>
                </select>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={voucherCount}
                  onChange={(e) => setVoucherCount(Number(e.target.value))}
                  placeholder="Number of keys"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-white dark:bg-surface text-sm text-content"
                />
                <Button className="w-full h-12 rounded-xl" onClick={generateVoucherKeys}>
                  Generate {voucherCount} Key{voucherCount > 1 ? 's' : ''}
                </Button>
              </div>

              {/* Generated Keys Output */}
              {generatedKeys.length > 0 && (
                <div className="bg-surface/50 dark:bg-surface/30 rounded-xl border border-border p-4 space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-content-muted">GENERATED KEYS</span>
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={copyKeys}>
                      <Copy size={12} className="mr-1" /> Copy All
                    </Button>
                  </div>
                  {generatedKeys.map((key) => (
                    <div key={key} className="font-mono text-sm text-primary bg-white dark:bg-surface-card px-3 py-2 rounded-lg border border-border">
                      {key}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Existing Vouchers Table */}
            <div>
              <h3 className="font-bold text-content mb-3">All Vouchers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface/50 dark:bg-surface/30 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Code</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Plan</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Status</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-content-muted">Redeemed By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {vouchers.map((v) => (
                      <tr key={v.id}>
                        <td className="px-4 py-3 font-mono text-sm text-content">{v.code}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              v.plan === 'institutional'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {v.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {v.redeemed_by ? (
                            <span className="text-xs text-green-600 font-bold">Redeemed</span>
                          ) : (
                            <span className="text-xs text-content-muted">Available</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-content-muted">{v.school_name || '—'}</td>
                      </tr>
                    ))}
                    {vouchers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-content-muted italic">
                          No vouchers generated yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {activeTab === 'feedback' && (
          <div className="p-8 text-center text-content-muted italic">No pending feedback from the community.</div>
        )}
      </div>
    </div>
  );
};
