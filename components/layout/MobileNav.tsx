import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, History, Menu, X, BookOpen, FileQuestion, Calendar, FileText, Settings, LogOut, Users, Printer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const MobileNav = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['principal', 'admin', 'teacher', 'secretary'] },
    { name: 'Manage Users', path: '/manage-users', icon: Users, roles: ['principal', 'admin'] },
    { name: 'Lesson Plan', path: '/generate/lesson', icon: BookOpen, roles: ['principal', 'admin', 'teacher'] },
    { name: 'Questions', path: '/generate/questions', icon: FileQuestion, roles: ['principal', 'admin', 'teacher'] },
    { name: 'Scheme of Work', path: '/generate/scheme', icon: Calendar, roles: ['principal', 'admin', 'teacher'] },
    { name: 'Exam Paper', path: '/generate/exam', icon: FileText, roles: ['principal', 'admin', 'teacher'] },
    { name: 'Print Queue', path: '/print-queue', icon: Printer, roles: ['secretary'] },
    { name: 'History', path: '/history', icon: History, roles: ['principal', 'admin', 'teacher', 'secretary'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['principal', 'admin', 'teacher', 'secretary'] },
  ];

  const roleNavItems = navItems.filter(item => item.roles.includes(user?.role || 'teacher'));

  const menuItems = roleNavItems.filter(i => ['Dashboard', 'Manage Users', 'Print Queue'].includes(i.name));
  const generateItems = roleNavItems.filter(i => ['Lesson Plan', 'Questions', 'Scheme of Work', 'Exam Paper'].includes(i.name));
  const manageItems = roleNavItems.filter(i => ['History', 'Settings'].includes(i.name));

  return (
    <>
      <div className="md:hidden fixed top-0 w-full bg-white/80 dark:bg-surface-card/80 backdrop-blur-md border-b border-border z-30 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">S</span>
          </div>
          <span className="font-display font-bold text-xl text-primary dark:text-primary-foreground">Soma</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className="text-content hover:bg-surface p-2 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div 
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-white dark:bg-surface-card z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setIsOpen(false)}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">S</span>
            </div>
            <span className="font-display font-bold text-xl text-primary dark:text-primary-foreground">Soma</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-content hover:bg-surface p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {menuItems.length > 0 && (
            <>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">Menu</div>
              {menuItems.map(item => (
                <DrawerItem 
                  key={item.path} 
                  item={item} 
                  isActive={location.pathname === item.path} 
                  onClick={() => setIsOpen(false)} 
                />
              ))}
            </>
          )}
          
          {generateItems.length > 0 && (
            <>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 mt-6 px-2">Generate</div>
              {generateItems.map(item => (
                <DrawerItem 
                  key={item.path} 
                  item={item} 
                  isActive={location.pathname.startsWith(item.path)} 
                  onClick={() => setIsOpen(false)} 
                />
              ))}
            </>
          )}
          
          {manageItems.length > 0 && (
            <>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 mt-6 px-2">Manage</div>
              {manageItems.map(item => (
                <DrawerItem 
                  key={item.path} 
                  item={item} 
                  isActive={location.pathname.startsWith(item.path)} 
                  onClick={() => setIsOpen(false)} 
                />
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="px-2 pb-3">
            <p className="text-xs font-medium text-content capitalize">{user?.role || 'Teacher'}</p>
            <p className="text-xs text-content-muted truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-error hover:bg-error/10 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

function DrawerItem({ item, isActive, onClick }: { item: any; isActive: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-colors mb-1",
        isActive 
          ? "bg-primary/10 text-primary-foreground" 
          : "text-content hover:bg-surface hover:text-primary-foreground"
      )}
    >
      <Icon size={20} className={isActive ? "text-primary-foreground" : "text-content-muted"} />
      {item.name}
    </Link>
  );
}
