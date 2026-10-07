import React from 'react';
import { RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { PlatformUser } from '../../models/PlatformUser';

/**
 * UserManagementTable: Renders RBAC User list with Supabase Auth role management.
 * Migrated to pure Tailwind CSS v4.
 */
export const UserManagementTable = ({
  usersList = [],
  userRole = 'user',
  currentUser = null,
  loadingUsers = false,
  usersError = '',
  onRefresh,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-4.5">
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div>
          <h3 className="text-base font-bold text-slate-800">User RBAC Management (Supabase Auth & Roles)</h3>
          <p className="text-xs text-slate-500 mt-1">
            Authorized via JWT Bearer Token. Role-based access control for Superadmins and Operators.
          </p>
        </div>
        {userRole === 'superadmin' && (
          <button 
            type="button"
            className="h-8.5 px-3.5 text-xs font-semibold text-white bg-blue hover:bg-blue2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            onClick={onRefresh}
            disabled={loadingUsers}
          >
            <RefreshCw size={13} className={loadingUsers ? 'animate-spin' : ''} />
            <span>{loadingUsers ? 'Refreshing...' : 'Refresh Users'}</span>
          </button>
        )}
      </div>

      {userRole !== 'superadmin' ? (
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl mt-3.5 flex items-start gap-3">
          <Shield className="text-amber-600 mt-0.5 shrink-0" size={18} />
          <div>
            <b className="text-xs font-bold text-amber-800">Restricted Superadmin Access</b>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Anda saat ini masuk sebagai <b>{currentUser?.email}</b> dengan role <span className="font-mono bg-amber-100/70 px-1 py-0.5 rounded text-amber-900">{userRole}</span>. Manajemen pengguna database memerlukan hak akses <b>'superadmin'</b>.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3.5 overflow-x-auto rounded-lg border border-slate-200/80">
          {usersError && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-medium flex items-center gap-1.5 border-b border-red-100">
              <AlertTriangle size={14} />
              <span>{usersError}</span>
            </div>
          )}

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5">Nama Lengkap</th>
                <th className="py-3 px-3.5">Email</th>
                <th className="py-3 px-3.5">Role Platform</th>
                <th className="py-3 px-3.5">Terdaftar</th>
                <th className="py-3 px-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((rawUser) => {
                const u = rawUser instanceof PlatformUser ? rawUser : new PlatformUser(rawUser);
                const roleBadge = u.getRoleBadge();
                const formattedDate = u.getFormattedDate();

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-800">{u.full_name || '—'}</td>
                    <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3.5">
                      <span 
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold"
                        style={{
                          backgroundColor: roleBadge.bg,
                          color: roleBadge.color,
                        }}
                      >
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-400 text-[11px]">
                      {formattedDate}
                    </td>
                    <td className="py-3 px-3.5 text-right space-x-1.5">
                      <button
                        type="button"
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors cursor-pointer"
                        onClick={() => onEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1 text-[11px] font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-md transition-colors cursor-pointer"
                        onClick={() => onDelete(u)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

