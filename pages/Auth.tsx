import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { UserRole } from '../types';
import { DISTRICTS, SUBJECTS_O_LEVEL, CLASS_LEVELS } from '../lib/curriculum';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [teacherId, setTeacherId] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [role, setRole] = useState<UserRole>('teacher');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast(`Welcome back!`);
      } else {
        await signUp(email, password, {
          full_name: fullName,
          school_name: schoolName,
          district: district,
          teacher_id: teacherId,
          subjects_taught: selectedSubjects,
          classes_taught: selectedClasses,
          role: role
        });
        toast(`Account created! Awaiting Principal approval.`);
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast(error.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subj: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  const toggleClass = (cls: string) => {
    setSelectedClasses(prev => 
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 py-12">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-center mb-6">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-display font-bold text-2xl">S</span>
            </div>
          </Link>
        </div>
        <h2 className="text-2xl font-display font-bold text-center text-content mb-2">
          {isLogin ? 'Welcome back' : 'Create an institutional account'}
        </h2>
        <p className="text-center text-muted text-sm mb-8">
          {isLogin ? 'Enter your details to sign in.' : 'Register as a teacher or admin at your school.'}
        </p>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-content mb-1.5">Email</label>
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="user@school.ac.ug"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-content mb-1.5">Password</label>
              <Input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-content mb-1.5">Full Name</label>
                  <Input 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    placeholder="Musa Okello"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-content mb-1.5">School Name</label>
                  <Input 
                    value={schoolName} 
                    onChange={e => setSchoolName(e.target.value)} 
                    placeholder="Buddo SS"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-content mb-1.5">District</label>
                  <select 
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-content mb-1.5">Teacher ID (Optional)</label>
                  <Input 
                    value={teacherId} 
                    onChange={e => setTeacherId(e.target.value)} 
                    placeholder="TSC-XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-content mb-1.5">Role</label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="principal">Principal (Full Access)</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="secretary">Secretary (Print Master)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-content mb-2">Subjects Taught</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SUBJECTS_O_LEVEL.map(subj => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        selectedSubjects.includes(subj) 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-content border-border hover:border-primary/50'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-content mb-2">Classes Taught</label>
                <div className="flex flex-wrap gap-2">
                  {CLASS_LEVELS.map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => toggleClass(cls)}
                      className={`px-4 py-2 rounded-lg border text-xs font-medium transition-colors ${
                        selectedClasses.includes(cls) 
                          ? 'bg-secondary text-white border-secondary' 
                          : 'bg-white text-content border-border hover:border-secondary/50'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-content">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-primary hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};
