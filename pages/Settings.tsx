import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { toast } from '../components/ui/Toast';

export const Settings = () => {
  const { user, updateUser, generationCount, redeemVoucher, isLoading } = useAuth();
  const [voucherCode, setVoucherCode] = useState('');
  const [isMasked, setIsMasked] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    school_name: '',
    district: '',
    teaching_level: '',
    subjects_taught: '',
    phone_number: '',
    teacher_id: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        school_name: user.school_name || '',
        district: user.district || '',
        teaching_level: user.teaching_level || '',
        subjects_taught: user.subjects_taught?.join(', ') || '',
        phone_number: user.phone_number || '',
        teacher_id: user.teacher_id || ''
      });
    }
  }, [user]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Handle leading zero - convert 07xx... to 2567xx...
    let standardized = digits;
    if (standardized.startsWith('0')) {
      standardized = '256' + standardized.substring(1);
    } else if (standardized.startsWith('7') || standardized.startsWith('3') || standardized.startsWith('4')) {
      // If it starts with a common Uganda prefix but no country code
      standardized = '256' + standardized;
    }

    // Limit to 12 digits (256 + 9 digits)
    const truncated = standardized.substring(0, 12);
    
    // Apply formatting: +256 XXX XXX XXX
    let formatted = '';
    if (truncated.length > 0) {
      formatted = '+' + truncated.substring(0, 3);
      if (truncated.length > 3) {
        formatted += ' ' + truncated.substring(3, 6);
      }
      if (truncated.length > 6) {
        formatted += ' ' + truncated.substring(6, 9);
      }
      if (truncated.length > 9) {
        formatted += ' ' + truncated.substring(9, 12);
      }
    }
    
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone_number') {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = () => {
    updateUser({
      full_name: formData.full_name,
      school_name: formData.school_name,
      district: formData.district,
      teaching_level: formData.teaching_level,
      subjects_taught: formData.subjects_taught.split(',').map(s => s.trim()).filter(Boolean),
      phone_number: formData.phone_number,
      teacher_id: formData.teacher_id
    });
    toast('Profile updated successfully!');
  };
 
  const handleRedeem = async () => {
    try {
      await redeemVoucher(voucherCode);
      toast('License activated! Welcome to SOMA Pro.');
      setVoucherCode('');
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const isPrincipal = user?.role === 'principal';
  const isAdmin = user?.role === 'admin';
  const isSecretary = user?.role === 'secretary';
  const isTeacher = user?.role === 'teacher';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold text-content">Settings</h1>
        <p className="text-muted mt-1">Manage your account and preferences.</p>
      </header>

      <Card>
        <CardContent className="p-6 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-6">
             <div>
                <h3 className="font-semibold text-lg text-content">Account Email</h3>
                <p className="text-sm text-muted">{user?.email}</p>
             </div>
             <div className="text-right">
                <span className="inline-block px-3 py-1 bg-surface-dark text-white text-xs font-semibold rounded-full capitalize">
                  {user?.role}
                </span>
             </div>
          </div>
          
          <div className="flex items-center justify-between border-b border-border pb-6">
             <div>
                <h3 className="font-semibold text-lg text-content">Subscription Plan</h3>
                <p className="text-sm text-muted capitalize">Current Plan: <strong>{user?.plan || 'Free'}</strong></p>
                <p className="text-xs text-muted mt-1">{generationCount} / 5 generations used this month</p>
             </div>
             {!user?.plan || user?.plan === 'free' ? (
               <div className="flex flex-col items-end gap-2">
                 <div className="flex gap-2">
                   <div className="relative">
                     <Input 
                       placeholder="Enter SOMA Code" 
                       className="w-48 h-9 text-xs pr-10" 
                       type={isMasked ? "text" : "password"}
                       value={isMasked ? `•••• •••• •••• •${voucherCode.slice(-3)}` : voucherCode}
                       onChange={(e) => {
                         if (isMasked) {
                           setVoucherCode('');
                           setIsMasked(false);
                         } else {
                           setVoucherCode(e.target.value);
                         }
                       }}
                       onBlur={() => {
                         if (voucherCode.length > 5) setIsMasked(true);
                       }}
                       onFocus={() => setIsMasked(false)}
                     />
                   </div>
                   <Button 
                     variant="secondary" 
                     size="sm" 
                     onClick={handleRedeem}
                     disabled={!voucherCode || isLoading}
                   >
                     {isLoading ? '...' : 'Activate'}
                   </Button>
                 </div>
               </div>
             ) : (
               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
             )}
          </div>

          {isPrincipal && (
            <div className="border-b border-border pb-6">
               <h3 className="font-semibold text-lg text-content mb-4">School Profile</h3>
               <p className="text-sm text-muted mb-6">Manage global school information.</p>
               <div className="space-y-4 max-w-lg">
                 <div>
                   <label className="block text-sm font-semibold text-content mb-1.5 font-sans">School Name</label>
                   <Input name="school_name" value={formData.school_name} onChange={handleChange} placeholder="Kampala High School" />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-content mb-1.5 font-sans">District</label>
                   <Select name="district" value={formData.district} onChange={handleChange}>
                     <option value="">Select District</option>
                     <option value="Kampala">Kampala</option>
                     <option value="Wakiso">Wakiso</option>
                     <option value="Mukono">Mukono</option>
                   </Select>
                 </div>
                 <div className="pt-2">
                   <Button onClick={handleSaveProfile}>Save School Settings</Button>
                 </div>
               </div>
            </div>
          )}

          {(isPrincipal || isAdmin) && (
            <div className="border-b border-border pb-6">
               <h3 className="font-semibold text-lg text-surface-dark mb-4">Academic Configuration</h3>
               <div className="space-y-4 max-w-lg">
                 <div>
                   <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Current Academic Year</label>
                   <Input defaultValue="2026/2027" disabled />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Current Term</label>
                   <Select defaultValue="Term 1">
                     <option>Term 1</option>
                     <option>Term 2</option>
                     <option>Term 3</option>
                   </Select>
                 </div>
                 <div className="pt-2">
                   <Button variant="secondary" onClick={() => toast('Academic configuration saved!')}>Save Configuration</Button>
                 </div>
               </div>
            </div>
          )}

          {isSecretary && (
            <div className="border-b border-border pb-6">
               <h3 className="font-semibold text-lg text-surface-dark mb-4">Printer Configuration</h3>
               <div className="space-y-4 max-w-lg">
                 <div>
                   <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Default Printer</label>
                   <Select defaultValue="staff-laser-1">
                     <option value="staff-laser-1">Staff Room Laser Printer (HP)</option>
                     <option value="office-color">Main Office Color Printer (Epson)</option>
                   </Select>
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                   <input type="checkbox" id="auto-print" className="rounded text-primary focus:ring-primary h-4 w-4" />
                   <label htmlFor="auto-print" className="text-sm text-surface-dark">Auto-print high priority requests</label>
                 </div>
                 <div className="pt-2">
                   <Button onClick={() => toast('Printer preferences saved!')}>Save Preferences</Button>
                 </div>
               </div>
            </div>
          )}

          {isTeacher && (
            <div>
               <h3 className="font-semibold text-lg text-surface-dark mb-4">Teacher Profile</h3>
               <p className="text-sm text-muted mb-6">Customize your profile. This information is used to personalize your curriculum generation.</p>
               <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Full Name</label>
                    <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Phone Number</label>
                      <Input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+256 700 000 000" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Teacher ID</label>
                      <Input name="teacher_id" value={formData.teacher_id} onChange={handleChange} placeholder="T-12345" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Teaching Level</label>
                    <Select name="teaching_level" value={formData.teaching_level} onChange={handleChange}>
                      <option value="">Select Level</option>
                      <option value="Primary">Primary</option>
                      <option value="Secondary O-Level">Secondary O-Level</option>
                      <option value="Secondary A-Level">Secondary A-Level</option>
                      <option value="Both">Both</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-dark mb-1.5 font-sans">Subjects Taught (comma separated)</label>
                    <Input name="subjects_taught" value={formData.subjects_taught} onChange={handleChange} placeholder="Mathematics, Physics" />
                  </div>
                  <div className="pt-2">
                    <Button onClick={handleSaveProfile}>Save Profile</Button>
                  </div>
               </div>
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
};

