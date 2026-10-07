import React from 'react';
import { Flame, Waves } from 'lucide-react';

/**
 * FwiBanners: Renders early warning Karhutla alert and Peatland TMAT hydrological coupling notification.
 * Migrated to pure Tailwind CSS v4.
 */
export const FwiBanners = ({ fwiScore = 0, isHighRisk = false, peatlandCoupling = null }) => {
  return (
    <div className="space-y-3.5 mb-5 animate-fade-in">
      {/* High-Risk Early Warning Alert Banner */}
      {isHighRisk && (
        <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 flex items-start gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-red-100/80 text-red-600 flex items-center justify-center shrink-0">
            <Flame size={20} className="animate-pulse" />
          </div>
          <div>
            <b className="text-xs sm:text-sm font-bold text-red-800 tracking-wide uppercase">
              WASPADA KEBAKARAN LAHAN TINGGI (NIMBUS 5-LAYER INTELLIGENCE)
            </b>
            <div className="text-xs text-slate-700 mt-1 leading-relaxed">
              Indeks Pseudo-FWI mencapai <b className="font-mono text-red-700">{fwiScore}</b>. Vegetasi kering dan serasah mudah tersulut. Tingkatkan patroli blok kebun dan siagakan sekat kanal.
            </div>
          </div>
        </div>
      )}

      {/* Peatland Hydrological Coupling Banner */}
      {peatlandCoupling?.hasTmat && peatlandCoupling.hazardLevel !== 'STABLE' && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
            <Waves size={20} />
          </div>
          <div>
            <b className="text-xs sm:text-sm font-bold text-amber-900">{peatlandCoupling.title}</b>
            <div className="text-xs text-slate-700 mt-1 leading-relaxed">{peatlandCoupling.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

