import React from 'react';

/**
 * AuthDemoProfiles: Quick demo 1-click credentials & SSO button.
 * 100% pure Tailwind CSS matching the original GitHub repository.
 */
export const AuthDemoProfiles = ({ onSelectProfile, onOpenSso, disabled = false }) => {
  return (
    <div>
      {/* Quick Demo Access Divider */}
      <div className="relative my-4.5 flex items-center justify-center before:h-px before:bg-slate-200 before:flex-1 after:h-px after:bg-slate-200 after:flex-1">
        <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          quick demo access
        </span>
      </div>

      {/* 2 Demo Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <button
          type="button"
          onClick={() => onSelectProfile({ email: 'operator@nimbus.earth', password: 'Password123!' })}
          disabled={disabled}
          title="Login instantly with role 'user'"
          className="p-2 sm:px-2.5 sm:py-2 border border-[#dce4f0] bg-[#fafbfd] hover:bg-[#edf4ff] hover:border-[#93c5fd] rounded-lg text-left flex flex-col gap-0.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wide">
            Operator
          </span>
          <span className="text-[11px] text-slate-500 truncate">
            operator@nimbus.earth
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectProfile({ email: 'admin@nimbus.earth', password: 'Password123!' })}
          disabled={disabled}
          title="Login instantly with role 'superadmin'"
          className="p-2 sm:px-2.5 sm:py-2 border border-[#dce4f0] bg-[#fafbfd] hover:bg-[#fefce8] hover:border-[#fde047] rounded-lg text-left flex flex-col gap-0.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
            Superadmin
          </span>
          <span className="text-[11px] text-slate-500 truncate">
            admin@nimbus.earth
          </span>
        </button>
      </div>

      {/* SSO Divider */}
      <div className="relative my-4 flex items-center justify-center before:h-px before:bg-slate-200 before:flex-1 after:h-px after:bg-slate-200 after:flex-1">
        <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          or
        </span>
      </div>

      {/* SSO Action Button */}
      <button
        type="button"
        onClick={onOpenSso}
        className="w-full h-[44px] border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-lg text-slate-800 text-[13px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-2"
      >
        <span>◉</span>
        <span>Login with SSO</span>
      </button>
    </div>
  );
};

export default AuthDemoProfiles;
