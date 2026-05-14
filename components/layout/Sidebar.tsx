import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, FileQuestion, Calendar, FileText, History, Settings, LogOut, Users, Printer, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../ui/Button';

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['principal', 'admin', 'teacher', 'secretary', 'super_admin'] },
    
    // Super Admin Management
    { name: 'Admin Portal', path: '/admin-portal', icon: Shield, roles: ['super_admin'] },
    
    // Admin/Principal Management
    { name: 'Manage Users', path: '/manage-users', icon: Users, roles: ['principal', 'admin'] },
    
    // Teacher Tools
    { name: 'Lesson Plan', path: '/generate/lesson', icon: BookOpen, roles: ['principal', 'admin', 'teacher'] },
    { name: 'Questions', path: '/generate/questions', icon: FileQuestion, roles: ['principal', 'admin', 'teacher'] },
    { name: 'Scheme of Work', path: '/generate/scheme', icon: Calendar, roles: ['principal', 'admin', 'teacher'] },
    { name: 'Exam Paper', path: '/generate/exam', icon: FileText, roles: ['principal', 'admin', 'teacher'] },
    
    // Secretary printing
    { name: 'Print Queue', path: '/print-queue', icon: Printer, roles: ['secretary'] },
    
    // General
    { name: 'History', path: '/history', icon: History, roles: ['principal', 'admin', 'teacher', 'secretary', 'super_admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['principal', 'admin', 'teacher', 'secretary', 'super_admin'] },
  ];

  const roleNavItems = navItems.filter(item => item.roles.includes(user?.role || 'teacher'));

  const menuItems = roleNavItems.filter(i => ['Dashboard', 'Manage Users', 'Print Queue', 'Admin Portal'].includes(i.name));
  const generateItems = roleNavItems.filter(i => ['Lesson Plan', 'Questions', 'Scheme of Work', 'Exam Paper'].includes(i.name));
  const manageItems = roleNavItems.filter(i => ['History', 'Settings'].includes(i.name));

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white dark:bg-surface-card border-r border-border min-h-[100vh]">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">S</span>
          </div>
          <span className="font-display font-bold text-xl text-primary dark:text-primary-foreground">Soma</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.length > 0 && (
          <>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 mt-4 px-2">Menu</div>
            {menuItems.map(item => (
              <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
            ))}
          </>
        )}
        
        {generateItems.length > 0 && (
          <>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 mt-6 px-2">Generate</div>
            {generateItems.map(item => (
              <NavItem key={item.path} item={item} isActive={location.pathname.startsWith(item.path)} />
            ))}
          </>
        )}
        
        {manageItems.length > 0 && (
          <>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 mt-6 px-2">Manage</div>
            {manageItems.map(item => (
              <NavItem key={item.path} item={item} isActive={location.pathname.startsWith(item.path)} />
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-2 pb-3">
          <p className="text-xs font-medium text-content capitalize">{user?.role || 'Teacher'}</p>
          <p className="text-xs text-content-muted truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-content-muted hover:text-error hover:bg-error/10 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

function NavItem({ item, isActive }: { item: any; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1",
        isActive 
          ? "bg-primary/10 text-primary-foreground" 
          : "text-content hover:bg-surface hover:text-primary-foreground"
      )}
    >
      <Icon size={18} className={isActive ? "text-primary-foreground" : "text-content-muted"} />
      {item.name}
    </Link>
  );
}
