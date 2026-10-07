import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import { ComboBox } from '../ui/combo-box';

/**
 * EditUserModal: Modal dialog for updating an existing user's profile and role.
 * Migrated to pure Tailwind CSS v4.
 */
export const EditUserModal = ({ isOpen, user, onClose, onSubmit }) => {
  if (!isOpen || !user) return null;

  return (
    <EditUserForm 
      user={user}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

// Internal form component to naturally reset state when user changes
const EditUserForm = ({ user, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [role, setRole] = useState(user.role || 'user');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = {
      full_name: fullName,
      role,
    };
    if (password.trim()) {
      updateData.password = password.trim();
    }
    onSubmit(user.id, updateData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue/10 text-blue flex items-center justify-center">
              <UserCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Edit User Access</h3>
              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            </div>
          </div>
          <button 
            type="button"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            onClick={onClose} 
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
              className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Role Akses
            </label>
            <ComboBox
              options={[
                { value: "user", label: "User / Operator Lapangan" },
                { value: "superadmin", label: "Superadmin Platform" }
              ]}
              value={role}
              onChange={(val) => val && setRole(val)}
              placeholder="Pilih Role..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              New Password (Opsional)
            </label>
            <input
              type="password"
              placeholder="Kosongkan jika tidak ingin diubah"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-5">
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer" 
              onClick={onClose}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-semibold text-white bg-blue hover:bg-blue2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

