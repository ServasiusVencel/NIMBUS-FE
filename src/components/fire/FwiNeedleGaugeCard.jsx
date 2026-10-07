import React from 'react';

/**
 * FwiNeedleGaugeCard: Renders the current FWI status with animated semi-circular gauge and needle.
 * Migrated to pure Tailwind CSS v4.
 */
export const FwiNeedleGaugeCard = ({ stationId = '', fwiScore = 0.50, riskLabel = '', isHighRisk = false }) => {
  // Rotate angle from -90deg (0.0) to +90deg (1.0)
  const needleRotation = Math.min(90, Math.max(-90, (fwiScore * 180) - 90));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100">
        <span className="font-medium text-slate-600">Stasiun: {stationId}</span>
        <span className="font-mono">14:00 WIB</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
        {/* Semi-circular Gauge */}
        <div className="w-[145px] h-[80px] rounded-t-[145px] relative shrink-0 overflow-hidden"
          style={{
            background: 'conic-gradient(from 270deg, #22c55e 0 35%, #f59e0b 35% 65%, #ef4444 65% 100%)',
          }}
        >
          {/* Inner white circle */}
          <div className="absolute inset-x-[22px] top-[22px] bottom-0 bg-white rounded-t-[100px]" />

          {/* Dynamic Needle pointer based on score */}
          <div 
            className="absolute bottom-0 left-1/2 w-1 h-[55px] bg-slate-900 origin-bottom z-10 rounded-full transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            }} 
          />
          {/* Needle pivot cap */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 rounded-full z-20" />
        </div>

        <div>
          <div className={`text-base sm:text-lg font-black tracking-tight ${isHighRisk ? 'text-red-600' : 'text-amber-600'}`}>
            {riskLabel}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            FWI Index Score: <b className="font-mono text-slate-900 text-sm">{fwiScore}</b> / 1.0
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Model menggabungkan evaporasi radiasi matahari, kelembaban serasah, dan kedalaman muka air tanah.
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Layer 3 Microclimate Inference</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
          isHighRisk 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {isHighRisk ? 'HAZARD ACTIVE' : 'MONITORING'}
        </span>
      </div>
    </div>
  );
};

