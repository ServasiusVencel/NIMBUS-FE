import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { ComboBox } from '../ui/combo-box';

/**
 * AddUserModal: Modal dialog for registering a new user in the platform.
 * Migrated to pure Tailwind CSS v4.
 */
export const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [role, setRole] = useState('user');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      full_name: fullName,
      email,
      password,
      role,
    });
    setFullName('');
    setEmail('');
    setPassword('Password123!');
    setRole('user');
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
              <UserPlus size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Add New User</h3>
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

        <p className="text-xs text-slate-500 mt-2.5 mb-4 leading-relaxed">
          Account will be created and activated immediately with Supabase Auth RBAC roles.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
              className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Resmi
            </label>
            <input
              type="email"
              placeholder="user@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Password123!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              Simpan Pengguna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

