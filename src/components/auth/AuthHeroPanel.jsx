import React from 'react';

/**
 * AuthHeroPanel: Left visual panel for executive authentication.
 * 100% Tailwind CSS recreating the clean original GitHub repo design:
 * - Clean white Nimbus logo card
 * - Original bold headline & subtitle
 * - Deep oceanic blue gradient without AI slop / clutter
 */
export const AuthHeroPanel = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 xl:p-14 relative overflow-hidden select-none bg-gradient-to-br from-[#0d5fcf] to-[#123e8b]">
      {/* Subtle bottom shadow vignette from original design */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

      {/* Brand Logo Box */}
      <div className="relative z-10 w-[175px] bg-white rounded-lg px-3 py-2 inline-flex items-center shadow-sm">
        <img src="/nimbus-logo.png" alt="Nimbus logo" className="w-full h-auto block" />
      </div>

      {/* Hero Headline & Subtitle */}
      <div className="relative z-10 mt-auto mb-6">
        <h1 className="text-3xl xl:text-4xl font-bold leading-snug !text-white text-white max-w-md mb-3">
          Climate &amp; Environmental Intelligence for a Resilient Tomorrow
        </h1>
        <p className="text-sm xl:text-base !text-[#dceaff] text-[#dceaff] leading-relaxed max-w-sm font-normal">
          From data to action for people, nature and sustainable growth.
        </p>
      </div>
    </div>
  );
};

export default AuthHeroPanel;
