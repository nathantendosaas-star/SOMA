import React from 'react';
import { useUsers } from '../hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, XCircle, Clock, User as UserIcon } from 'lucide-react';
import { toast } from '../components/ui/Toast';

export const ManageUsers = () => {
  const { users, updateUserStatus, isLoading } = useUsers();

  const handleStatusChange = async (userId: string, status: 'approved' | 'blocked') => {
    try {
      await updateUserStatus(userId, status);
      toast(`Teacher status updated to ${status}.`);
    } catch (err) {
      toast("Failed to update status", "error");
    }
  };

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'approved');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-content">Manage Institutional Access</h1>
        <p className="text-content-muted mt-2">Approve new teachers or manage existing staff permissions.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Pending Approvals */}
          <Card className="border-orange-100 bg-orange-50/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="text-orange-500" size={20} />
                <CardTitle className="text-lg">Pending Approvals ({pendingUsers.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-center py-4 text-muted">No pending approval requests.</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map(u => (
                    <div key={u.id} className="bg-white p-4 rounded-xl border border-orange-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {u.full_name?.charAt(0) || <UserIcon size={18} />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-content">{u.full_name}</h4>
                          <p className="text-xs text-muted">{u.school_name} • {u.district}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {u.subjects_taught?.map(s => (
                              <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-100 hover:bg-red-50"
                          onClick={() => handleStatusChange(u.id, 'blocked')}
                        >
                          <XCircle size={16} className="mr-1" /> Deny
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary-dark"
                          onClick={() => handleStatusChange(u.id, 'approved')}
                        >
                          <CheckCircle size={16} className="mr-1" /> Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Staff */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Staff Directory ({activeUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-semibold text-content-muted">Name</th>
                      <th className="text-left py-3 px-2 font-semibold text-content-muted">Role</th>
                      <th className="text-left py-3 px-2 font-semibold text-content-muted">Subjects</th>
                      <th className="text-right py-3 px-2 font-semibold text-content-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activeUsers.map(u => (
                      <tr key={u.id} className="hover:bg-surface/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="font-medium text-content">{u.full_name}</div>
                          <div className="text-[10px] text-muted">{u.email}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="capitalize px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-1">
                            {u.subjects_taught?.slice(0, 2).map(s => (
                              <span key={s} className="text-[9px] px-1.5 py-0.5 bg-gray-100 rounded text-content-muted">
                                {s}
                              </span>
                            ))}
                            {(u.subjects_taught?.length || 0) > 2 && <span className="text-[9px] text-muted">+{u.subjects_taught!.length - 2} more</span>}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button 
                            className="text-xs text-red-600 hover:underline font-medium"
                            onClick={() => handleStatusChange(u.id, 'blocked')}
                          >
                            Block
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-white">
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Institutional Pulse</h3>
              <p className="text-primary-foreground/80 text-sm mb-6">You are managing access for <strong>{schoolName || 'Your School'}</strong>.</p>
              <div className="space-y-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <div className="text-xs text-primary-foreground/60 uppercase font-bold mb-1">Approved Staff</div>
                  <div className="text-2xl font-bold">{activeUsers.length}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <div className="text-xs text-primary-foreground/60 uppercase font-bold mb-1">Pending Requests</div>
                  <div className="text-2xl font-bold text-orange-200">{pendingUsers.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
