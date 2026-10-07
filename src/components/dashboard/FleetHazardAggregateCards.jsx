import React from 'react';
import { Flame, Droplets, CloudRain, ArrowRight } from 'lucide-react';

/**
 * FleetHazardAggregateCards: Renders the 3 aggregate hazard & weather cards
 * across the entire IoT fleet using domain methods from FleetTelemetrySummary.
 */
export const FleetHazardAggregateCards = ({ summary, onNavigate }) => {
  const warningCount = summary.warningCount;
  const tmatCriticalSensors = summary.tmatCriticalSensors;
  const tmatEquippedCount = summary.tmatEquippedSensors.length;
  const totalCount = summary.totalCount;
  const rainingSensors = summary.rainingSensors;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      {/* Card 1: Concession Fire Danger & FWI Aggregate */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Flame size={19} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
                  VAN WAGNER FWI AGGREGATE
                </span>
                <h4 className="text-sm font-bold text-slate-800">
                  Potensi Kebakaran Armada
                </h4>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              warningCount > 0 
                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {warningCount > 0 ? `${warningCount} PERLU WASPADA` : 'AMAN TERKENDALI'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {summary.averageFireScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 1.0 Indeks FWI Rata-rata</span>
          </div>

          <div className="space-y-1 text-xs text-slate-500 mb-3">
            <div className="flex justify-between">
              <span>Rata-rata Suhu Konsesi:</span>
              <span className="font-semibold text-slate-800">{summary.averageTemperature} °C</span>
            </div>
            <div className="flex justify-between">
              <span>Kelembaban Udara (RH):</span>
              <span className="font-semibold text-slate-800">{summary.averageHumidity} %</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {warningCount > 0 
              ? 'Siagakan regu patroli di blok terdampak.' 
              : 'Kondisi serasah kebun dalam batas aman.'}
          </span>
          <button 
            type="button" 
            onClick={() => onNavigate('fire')}
            className="text-sky-600 font-semibold hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Detail FWI</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Card 2: Concession Peatland Hydrology (TMAT Multi-Station) */}
      <div className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden ${
        tmatCriticalSensors.length > 0 ? 'border-red-200/90' : 'border-slate-200/90'
      }`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full ${
          tmatCriticalSensors.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-teal-500'
        }`} />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                tmatCriticalSensors.length > 0 
                  ? 'bg-red-50 text-red-600 border border-red-100' 
                  : 'bg-teal-50 text-teal-600 border border-teal-100'
              }`}>
                <Droplets size={19} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
                  REGULASI KEMENLHK (-40 CM)
                </span>
                <h4 className="text-sm font-bold text-slate-800">
                  Hidrologi Gambut (TMAT)
                </h4>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              tmatCriticalSensors.length > 0 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-teal-50 text-teal-700 border-teal-200'
            }`}>
              {tmatCriticalSensors.length > 0 ? `${tmatCriticalSensors.length} TITIK KRITIS` : 'SEMUA AMAN'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-extrabold tracking-tight font-mono ${
              tmatCriticalSensors.length > 0 ? 'text-red-600' : 'text-slate-900'
            }`}>
              {tmatEquippedCount} / {totalCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">Stasiun Terpasang Piezometer</span>
          </div>

          <div className="space-y-1 text-xs text-slate-500 mb-3">
            <div className="flex justify-between">
              <span>Batas Regulasi PP No. 71/2014:</span>
              <span className="font-semibold text-slate-800">-40.0 cm</span>
            </div>
            <div className="flex justify-between">
              <span>Stasiun Melewati Batas:</span>
              <span className={`font-semibold ${tmatCriticalSensors.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {tmatCriticalSensors.length > 0 
                  ? tmatCriticalSensors.map(s => s.id).join(', ') 
                  : 'Tidak ada (Normal)'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {tmatCriticalSensors.length > 0 ? 'Tutup sekat kanal zona terdampak.' : 'Tata air konsesi terjaga baik.'}
          </span>
          <button 
            type="button" 
            onClick={() => onNavigate('map')}
            className="text-sky-600 font-semibold hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Pantau Peta</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Card 3: Precipitation & Atmosphere Dynamics */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <CloudRain size={19} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
                  PRESIPITASI & ATMOSFERIK
                </span>
                <h4 className="text-sm font-bold text-slate-800">
                  Cuaca & Presipitasi Armada
                </h4>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              rainingSensors.length > 0 
                ? 'bg-sky-50 text-sky-700 border-sky-200' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {rainingSensors.length > 0 ? `${rainingSensors.length} STASIUN HUJAN` : 'KERING / CERAH'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {summary.averageSolarRadiation}
            </span>
            <span className="text-xs text-slate-400 font-mono">W/m² Rata-rata Radiasi Surya</span>
          </div>

          <div className="space-y-1 text-xs text-slate-500 mb-3">
            <div className="flex justify-between">
              <span>Kecepatan Angin Rata-rata:</span>
              <span className="font-semibold text-slate-800">{summary.averageWindSpeed} m/s</span>
            </div>
            <div className="flex justify-between">
              <span>Stasiun Hujan Aktif:</span>
              <span className="font-semibold text-slate-800">
                {rainingSensors.length > 0 ? rainingSensors.map(s => s.id).join(', ') : 'Nihil (0.0 mm/jam)'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Kondisi ideal operasional panen & rawat kebun.
          </span>
          <button 
            type="button" 
            onClick={() => onNavigate('weather')}
            className="text-sky-600 font-semibold hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Ramalan 10 Hari</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

    </div>
  );
};
