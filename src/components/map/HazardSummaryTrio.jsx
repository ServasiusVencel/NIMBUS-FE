import React from 'react';
import { Flame, Waves, CloudRain } from 'lucide-react';

/**
 * HazardSummaryTrio: Displays 3 dedicated microclimate hazard cards analyzing Fire Risk (FWI),
 * Peatland Groundwater Table (TMAT), and Active Precipitation.
 * Migrated to pure Tailwind CSS v4.
 */
export const HazardSummaryTrio = ({
  selectedSensor,
  fireSummary,
  tmatAssessment,
  isDroughtCritical,
  isDroughtWarning,
  hasTmat,
  tmatVal,
  rainAssessment,
  rainMm,
  isRaining,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 animate-fade-in min-w-0">
      {/* Card 1: Tingkat Kebakaran (FWI) */}
      <div className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all min-w-0 ${
        fireSummary.isHigh 
          ? 'border-red-200/90 shadow-red-500/5' 
          : fireSummary.isLow 
          ? 'border-emerald-200/90 shadow-emerald-500/5' 
          : 'border-amber-200/90 shadow-amber-500/5'
      }`}>
        <div>
          {/* Card Top */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                fireSummary.isHigh 
                  ? 'bg-red-50 border-red-100 text-red-600' 
                  : fireSummary.isLow 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                  : 'bg-amber-50 border-amber-100 text-amber-600'
              }`}>
                <Flame size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono block">
                  VAN WAGNER PSEUDO-FWI
                </span>
                <h3 className="text-sm font-bold text-slate-900">Potensi Kebakaran</h3>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border font-mono ${
              fireSummary.isHigh 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : fireSummary.isLow 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {fireSummary.level.toUpperCase()}
            </span>
          </div>

          {/* Main Metric */}
          <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                {fireSummary.score.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 1.0 (FWI)</span>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-mono space-y-0.5">
              <div>Suhu: <strong className="text-slate-800">{selectedSensor?.currentReadings?.air_temperature_c}°C</strong></div>
              <div>RH: <strong className="text-slate-800">{selectedSensor?.currentReadings?.relative_humidity_pct}%</strong></div>
            </div>
          </div>
        </div>

        {/* Message Box */}
        <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
          fireSummary.isHigh 
            ? 'bg-red-50/70 border-red-100 text-red-800' 
            : fireSummary.isLow 
            ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800' 
            : 'bg-amber-50/70 border-amber-100 text-amber-800'
        }`}>
          {fireSummary.isHigh ? (
            <p>
              🚨 <strong>WASPADA TINGGI:</strong> Serasah sangat kering akibat suhu tinggi ({selectedSensor?.currentReadings?.air_temperature_c}°C). <em>Siagakan regu pemadam & patroli blok kebun.</em>
            </p>
          ) : fireSummary.isLow ? (
            <p>
              ✓ <strong>KONDISI AMAN:</strong> Kelembapan udara cukup tinggi ({selectedSensor?.currentReadings?.relative_humidity_pct}%). Potensi rambatan api lahan rendah.
            </p>
          ) : (
            <p>
              ⚠️ <strong>POTENSI SEDANG:</strong> Fluktuasi evaporasi siang hari. Tetap monitor titik api dan buffer kanal.
            </p>
          )}
        </div>
      </div>

      {/* Card 2: Tingkat Kekeringan & Gambut (TMAT) */}
      <div className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all min-w-0 ${
        isDroughtCritical 
          ? 'border-red-200/90 shadow-red-500/5' 
          : isDroughtWarning 
          ? 'border-amber-200/90 shadow-amber-500/5' 
          : 'border-teal-200/90 shadow-teal-500/5'
      }`}>
        <div>
          {/* Card Top */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isDroughtCritical 
                  ? 'bg-red-50 border-red-100 text-red-600' 
                  : isDroughtWarning 
                  ? 'bg-amber-50 border-amber-100 text-amber-600' 
                  : 'bg-teal-50 border-teal-100 text-teal-600'
              }`}>
                <Waves size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono block">
                  HIDROLOGI GAMBUT (TMAT)
                </span>
                <h3 className="text-sm font-bold text-slate-900">Muka Air Gambut</h3>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border font-mono ${
              isDroughtCritical 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : isDroughtWarning 
                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {tmatAssessment.label}
            </span>
          </div>

          {/* Main Metric */}
          <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-baseline gap-1.5">
              {hasTmat ? (
                <>
                  <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {tmatVal}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">cm (TMAT)</span>
                </>
              ) : (
                <>
                  <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {selectedSensor?.currentReadings?.soil_moisture_pct || 80}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">% (Tanah)</span>
                </>
              )}
            </div>
            <div className="text-right text-[11px] text-slate-500 font-mono space-y-0.5">
              {hasTmat ? (
                <>
                  <div>Regulasi: <strong className="text-slate-800">-40.0 cm</strong></div>
                  <div className={isDroughtCritical ? 'text-red-600 font-bold' : 'text-emerald-600 font-semibold'}>
                    {isDroughtCritical ? '⚠️ Melewati Batas' : '✓ Di Atas Batas'}
                  </div>
                </>
              ) : (
                <div>Kelembaban: <strong className="text-slate-800">{selectedSensor?.currentReadings?.soil_moisture_pct}%</strong></div>
              )}
            </div>
          </div>
        </div>

        {/* Message Box */}
        <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
          isDroughtCritical 
            ? 'bg-red-50/70 border-red-100 text-red-800' 
            : isDroughtWarning 
            ? 'bg-amber-50/70 border-amber-100 text-amber-800' 
            : 'bg-teal-50/70 border-teal-100 text-teal-800'
        }`}>
          <p>
            {tmatAssessment.recommendation || 'Tata air gambut terjaga normal sesuai ambang batas.'}
          </p>
        </div>
      </div>

      {/* Card 3: Presipitasi Aktif (Intensitas Hujan) */}
      <div className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all min-w-0 ${
        isRaining 
          ? 'border-sky-300 shadow-sky-500/10' 
          : 'border-slate-200/90'
      }`}>
        <div>
          {/* Card Top */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <CloudRain size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono block">
                  PRESIPITASI AKTIF
                </span>
                <h3 className="text-sm font-bold text-slate-900">Intensitas Hujan</h3>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border font-mono ${
              isRaining 
                ? 'bg-sky-50 text-sky-700 border-sky-200' 
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              {rainAssessment.badge}
            </span>
          </div>

          {/* Main Metric */}
          <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                {rainMm.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-medium">mm / jam</span>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-mono space-y-0.5">
              <div>Angin: <strong className="text-slate-800">{selectedSensor?.currentReadings?.wind_speed_ms} m/s</strong></div>
              <div>Radiasi: <strong className="text-slate-800">{selectedSensor?.currentReadings?.solar_radiation_wm2} W/m²</strong></div>
            </div>
          </div>
        </div>

        {/* Message Box */}
        <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
          isRaining 
            ? 'bg-sky-50/70 border-sky-100 text-sky-800' 
            : 'bg-slate-50 border-slate-100 text-slate-600'
        }`}>
          <p>
            {rainAssessment.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
