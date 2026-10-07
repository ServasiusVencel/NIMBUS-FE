import React from 'react';
import { Sprout, CheckCircle2, AlertOctagon } from 'lucide-react';

/**
 * DailyAgronomyCard: Renders field analysis and microclimatic parameters
 * for the selected operational day.
 * Migrated to pure Tailwind CSS v4.
 */
export const DailyAgronomyCard = ({ activeDay, activeActivity, activityLabel = '' }) => {
  if (!activeDay) return null;

  const isSafe = activeDay.isOperationSafe ? activeDay.isOperationSafe(activeActivity) : true;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sprout className="text-blue" size={18} />
          <h3 className="text-base font-bold text-slate-800">
            Analisis Lapangan Harian · {activeDay.dayName}, {activeDay.date}
          </h3>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
          isSafe 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {isSafe ? <CheckCircle2 size={13} /> : <AlertOctagon size={13} />}
          <span>{isSafe ? 'AMAN DILAKUKAN' : 'TUNDA OPERASI'}</span>
        </span>
      </div>

      <p className="mt-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {isSafe
          ? `Kondisi atmosferik sangat mendukung untuk ${activityLabel.toLowerCase()}. Probabilitas hujan rendah (${activeDay.rainProbability}%) sehingga pupuk/bahan kimia tidak akan hanyut (runoff).`
          : `Potensi hujan tinggi (${activeDay.rainProbability}%, ${activeDay.rainfallMm} mm). Hindari ${activityLabel.toLowerCase()} untuk mencegah pencucian zat aktif dan pemadatan tanah basah.`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 block">Suhu Maks / Min</span>
          <p className="mt-1 font-mono font-bold text-sm text-slate-800">{activeDay.temperatureMax}°C / {activeDay.temperatureMin}°C</p>
        </div>
        <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 block">Peluang Hujan (PoP)</span>
          <p className={`mt-1 font-mono font-bold text-sm ${activeDay.rainProbability > 50 ? 'text-red-600' : 'text-emerald-600'}`}>
            {activeDay.rainProbability}% ({activeDay.rainfallMm} mm)
          </p>
        </div>
        <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 block">Kelembaban Relatif (RH)</span>
          <p className="mt-1 font-mono font-bold text-sm text-slate-800">{activeDay.humidity}%</p>
        </div>
        <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 block">Radiasi Surya</span>
          <p className="mt-1 font-mono font-bold text-sm text-slate-800">{activeDay.solarRadiation} W/m²</p>
        </div>
      </div>
    </div>
  );
};

