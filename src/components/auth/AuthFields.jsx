import React from 'react';

/**
 * AuthFields: Clean form fields and submit button.
 * 100% pure Tailwind CSS matching the original GitHub repository.
 */
export const AuthFields = ({
  formModel,
  onFieldChange,
  onSubmit,
  loading = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Register Fields: Full Name & Role */}
      {formModel.isRegister && (
        <>
          <div>
            <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={formModel.fullName}
              onChange={(e) => onFieldChange('fullName', e.target.value)}
              required
              className="w-full h-[46px] px-3.5 border border-[#d8dee8] rounded-lg outline-none text-sm text-slate-800 bg-white focus:border-sky-600 focus:ring-3 focus:ring-sky-600/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">
              Role
            </label>
            <select
              value={formModel.role}
              onChange={(e) => onFieldChange('role', e.target.value)}
              className="w-full h-[46px] px-3.5 border border-[#d8dee8] rounded-lg outline-none text-sm text-slate-800 bg-white focus:border-sky-600 focus:ring-3 focus:ring-sky-600/10 transition-all cursor-pointer"
            >
              <option value="user">Operator / Field Client (Role: user)</option>
              <option value="superadmin">Administrator / Owner (Role: superadmin)</option>
            </select>
          </div>
        </>
      )}

      {/* Corporate Email Field */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">
          Email
        </label>
        <input
          type="email"
          placeholder="name@company.com"
          value={formModel.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          required
          className="w-full h-[46px] px-3.5 border border-[#d8dee8] rounded-lg outline-none text-sm text-slate-800 bg-white focus:border-sky-600 focus:ring-3 focus:ring-sky-600/10 transition-all"
        />
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={formModel.password}
          onChange={(e) => onFieldChange('password', e.target.value)}
          required
          className="w-full h-[46px] px-3.5 border border-[#d8dee8] rounded-lg outline-none text-sm text-slate-800 bg-white focus:border-sky-600 focus:ring-3 focus:ring-sky-600/10 transition-all"
        />
      </div>

      {/* Forgot Password Link (Login mode only) */}
      {formModel.isLogin && (
        <div className="flex justify-end -mt-1 mb-4">
          <span
            className="text-[13px] text-sky-600 hover:underline cursor-pointer"
            onClick={() => alert('Fitur reset password tersedia melalui Administrator Nimbus.')}
          >
            Forgot password?
          </span>
        </div>
      )}

      {/* Primary Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-[46px] bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-lg cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center shadow-xs"
      >
        {loading
          ? 'Authenticating...'
          : formModel.isLogin
          ? 'Login'
          : 'Create & Activate Account'}
      </button>
    </form>
  );
};

export default AuthFields;
