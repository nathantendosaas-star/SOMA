import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BookOpen, FileQuestion, Calendar, FileText, Users, Printer, History, Settings } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useEffect } from 'react';

export const Dashboard = () => {
  const { user, generationCount } = useAuth();
  const { documents, fetchDocuments } = useDocuments();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const stats = {
    total: documents.length,
    lessons: documents.filter(d => d.type === 'lesson_plan').length,
    exams: documents.filter(d => d.type === 'exam').length,
  };

  const isManagement = user?.role === 'principal' || user?.role === 'admin';
  const isSecretary = user?.role === 'secretary';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-content capitalize">
          Good morning, {user?.role || 'Teacher'}
        </h1>
        {isManagement ? (
          <p className="text-content-muted mt-2 text-lg">Here is your school administrative overview.</p>
        ) : isSecretary ? (
          <p className="text-content-muted mt-2 text-lg">Check pending document prints from teachers.</p>
        ) : (
          <p className="text-content-muted mt-2 text-lg">What are we creating for your students today?</p>
        )}
      </header>

      {/* What's new banner */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">
          <BookOpen size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">What's new in Soma</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">We've just added support for A-Level schemes of work! You can now generate comprehensive term plans for S5 and S6 subjects.</p>
        </div>
      </div>

      {!isManagement && !isSecretary && generationCount >= 5 && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Free Tier Limit Reached</h3>
            <p className="text-sm">You have used all 5 of your free generations for this month. Upgrade to continue creating curriculum materials.</p>
          </div>
          <Link to="/settings" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition">
            Upgrade
          </Link>
        </div>
      )}

      {/* Quick Actions (Role contextual) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isManagement ? (
          <>
            <ActionCard title="Manage Users" icon={Users} to="/manage-users" color="bg-indigo-50 text-indigo-600" />
            <ActionCard title="Print Queue" icon={Printer} to="/print-queue" color="bg-emerald-50 text-emerald-600" />
            <ActionCard title="School History" icon={History} to="/history" color="bg-blue-50 text-blue-600" />
            <ActionCard title="Settings" icon={Settings} to="/settings" color="bg-gray-50 text-gray-600" />
          </>
        ) : isSecretary ? (
          <>
            <ActionCard title="Print Queue" icon={Printer} to="/print-queue" color="bg-emerald-50 text-emerald-600" />
            <ActionCard title="All Documents" icon={FileText} to="/history" color="bg-blue-50 text-blue-600" />
          </>
        ) : (
          <>
            <ActionCard title="Lesson Plan" icon={BookOpen} to="/generate/lesson" color="bg-blue-50 text-blue-600" />
            <ActionCard title="Questions" icon={FileQuestion} to="/generate/questions" color="bg-green-50 text-green-600" />
            <ActionCard title="Scheme of Work" icon={Calendar} to="/generate/scheme" color="bg-purple-50 text-purple-600" />
            <ActionCard title="Exam Paper" icon={FileText} to="/generate/exam" color="bg-orange-50 text-orange-600" />
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                {isManagement ? 'Recent School Documents' : isSecretary ? 'Latest For Printing' : 'Recent Documents'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted">No documents yet.</div>
              ) : (
                <div className="space-y-4">
                  {documents.slice(0, 5).map(doc => (
                    <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:bg-surface dark:hover:bg-surface/10 hover:border-border transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-surface dark:bg-surface-card flex items-center justify-center text-primary-foreground">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-semibold text-sm text-content truncate">{doc.title}</h4>
                         <p className="text-xs text-content-muted truncate">{doc.subject} • {doc.class_level}</p>
                      </div>
                      <div className="text-xs text-content-muted whitespace-nowrap">
                         {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {isManagement ? 'School Activity' : 'Your Activity'}
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                   <div className="flex justify-between items-center bg-surface dark:bg-surface/50 p-4 rounded-xl">
                      <span className="text-sm font-medium text-content">Total Generated</span>
                      <span className="text-xl font-bold font-display text-primary-foreground">
                        {isManagement ? stats.total * 4 + 12 : stats.total}
                      </span>
                   </div>
                   {isManagement && (
                    <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 p-4 rounded-xl mt-2">
                        <span className="text-sm font-medium">Active Teachers</span>
                        <span className="text-xl font-bold font-display">24</span>
                    </div>
                   )}
                   <div className="flex justify-between items-center p-2 border-b border-border">
                      <span className="text-sm text-content-muted">Lesson Plans</span>
                      <span className="text-sm font-semibold text-content">{isManagement ? stats.lessons * 4 + 5 : stats.lessons}</span>
                   </div>
                   <div className="flex justify-between items-center p-2">
                      <span className="text-sm text-content-muted">Exam Papers</span>
                      <span className="text-sm font-semibold text-content">{isManagement ? stats.exams * 4 + 2 : stats.exams}</span>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function ActionCard({ title, icon: Icon, to, color }: any) {
  return (
    <Link to={to} className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-surface-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
      <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${color} dark:bg-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <h3 className="font-semibold text-content text-center">{title}</h3>
    </Link>
  );
}
