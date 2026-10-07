import React from 'react';
import { Waves } from 'lucide-react';

/**
 * PeatlandTmatGauge: Visual gauge for peatland water table depth (TMAT)
 * with national PP 71/2014 regulatory threshold marker (-40 cm).
 */
export const PeatlandTmatGauge = ({ sensor, isDroughtCritical = false }) => {
  if (!sensor) return null;

  const hasTmat = sensor.isTmatEquipped ? sensor.isTmatEquipped() : !!sensor.capabilities?.groundwater_tmat;
  const depth = sensor.currentReadings?.water_table_depth_cm;
  const isCritical = isDroughtCritical || (depth !== null && depth !== undefined && depth < -40.0);

  if (!hasTmat) {
    return (
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2 text-xs text-slate-500">
        <Waves size={14} className="text-slate-400 shrink-0" />
        <span>Stasiun AWS Standar tanpa Piezometer TMAT.</span>
      </div>
    );
  }

  const fillWidth = Math.min(100, Math.max(10, Math.abs(depth || 0) * 1.25));

  return (
    <div className={`p-3.5 rounded-xl border transition-all ${
      isCritical 
        ? 'bg-rose-50/60 border-rose-200' 
        : 'bg-teal-50/60 border-teal-200'
    }`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Waves size={15} className={isCritical ? 'text-rose-600' : 'text-teal-600'} />
          <span className="text-xs font-bold text-slate-800">Muka Air Gambut (TMAT)</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
          isCritical 
            ? 'bg-rose-100 text-rose-800 border-rose-300' 
            : 'bg-teal-100 text-teal-800 border-teal-300'
        }`}>
          {isCritical ? 'KRITIS (< -40cm)' : 'NORMAL AMAN'}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-extrabold font-mono text-slate-900">
          {depth !== null && depth !== undefined ? depth : 'N/A'}
        </span>
        <span className="text-xs text-slate-500 font-mono">cm di bawah permukaan</span>
      </div>

      {/* Depth progress bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full relative overflow-hidden my-2">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isCritical ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${fillWidth}%` }}
        />
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
          style={{ left: '50%' }} 
          title="Batas PP 71/2014 (-40 cm)" 
        />
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>Ambang Batas PP: <strong>-40.0 cm</strong></span>
        <span className={isCritical ? 'text-rose-600 font-bold' : 'text-emerald-700 font-semibold'}>
          {isCritical ? '⚠️ Pelanggaran Regulasi' : '✓ Hidrologi Gambut Basah'}
        </span>
      </div>
    </div>
  );
};

export default PeatlandTmatGauge;
