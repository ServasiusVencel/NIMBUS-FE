import React from 'react';
import { Bug, ShieldCheck } from 'lucide-react';

/**
 * PestRadarCard: Displays bioclimatic fungal & insect pathogen radar warnings.
 * Migrated to pure Tailwind CSS v4.
 */
export const PestRadarCard = ({ pestAlerts = [], activeSensorId = '' }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2.5 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Bug className="text-blue" size={18} />
            <h3 className="text-base font-bold text-slate-800">Pest & Pathogen Early Warning Radar</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algoritma bioklimatik memprediksi masa inkubasi spora jamur dan serangga hama berdasarkan anomali kelembaban.
          </p>
        </div>
        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          AI Model v2.4 Active
        </span>
      </div>

      <div className="space-y-3 mt-4">
        {pestAlerts.map(alert => {
          const badge = alert.getBadge ? alert.getBadge() : { bg: '#fee2e2', color: '#dc2626', label: 'BAHAYA' };
          const isHigh = alert.isHighRisk ? alert.isHighRisk() : false;
          const isRelevant = alert.affectsStation ? alert.affectsStation(activeSensorId) : false;

          return (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                isHigh 
                  ? 'border-red-200 bg-red-50/40' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="text-2xl select-none">{isHigh ? '🚨' : '🌾'}</div>
                  <div>
                    <b className="text-sm font-bold text-slate-800">{alert.diseaseName}</b>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Komoditas: <b className="text-slate-700">{alert.commodity}</b> · <span className="text-slate-400 font-mono text-[11px]">{alert.incubationForecast}</span>
                    </div>
                  </div>
                </div>
                <span 
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    isHigh 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {badge.label} (Skor: {alert.riskScore})
                </span>
              </div>

              <div className="mt-3 text-xs bg-slate-50/70 p-3 rounded-lg border border-slate-200/50 space-y-1 text-slate-700">
                <div>
                  <span className="font-semibold text-slate-800">Faktor Pemicu Cuaca:</span> {alert.weatherTrigger}
                </div>
                <div className="text-sky-800">
                  <span className="font-semibold">Rekomendasi Tindakan Lapangan:</span> {alert.recommendedAction}
                </div>
              </div>

              {isRelevant && (
                <div className="mt-2.5 text-[11px] text-blue font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Terdeteksi aktif di area pantau stasiun ini ({activeSensorId}).</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

