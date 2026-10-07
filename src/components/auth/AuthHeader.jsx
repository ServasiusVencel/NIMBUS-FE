import React from 'react';

/**
 * AuthHeader: Clean header with title and Sign In / Register toggle buttons.
 * 100% Tailwind CSS recreating the original GitHub repo design.
 */
export const AuthHeader = ({ formModel, onChangeMode }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {formModel.isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={`px-3 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
              formModel.isLogin
                ? 'bg-[#edf4ff] border-blue-200 text-sky-600'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => onChangeMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
              formModel.isRegister
                ? 'bg-[#edf4ff] border-blue-200 text-sky-600'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => onChangeMode('register')}
          >
            Register
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        {formModel.isLogin
          ? 'Sign in to access your Nimbus intelligence dashboard.'
          : 'Register an instant active account without email confirmation.'}
      </p>
    </div>
  );
};

export default AuthHeader;
