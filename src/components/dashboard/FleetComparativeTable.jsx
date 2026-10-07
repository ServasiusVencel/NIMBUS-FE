import React from 'react';
import { Download } from 'lucide-react';

/**
 * FleetComparativeTable: Tabular telemetry comparison matrix across all IoT stations.
 * Directly leverages SensorStation OOP methods for hazard evaluations and coordinates.
 */
export const FleetComparativeTable = ({
  sensors = [],
  onSelectStation,
  onExportFleetCsv,
  onExportStationCsv
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Matriks Telemetri Komparatif Seluruh Armada
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tabel perbandingan data real-time simultan lintas stasiun untuk analisis agroklimat & audit kepatuhan lingkungan:
          </p>
        </div>

        <button
          type="button"
          onClick={onExportFleetCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer self-start sm:self-auto"
        >
          <Download size={13} />
          <span>Ekspor Semua Data (CSV)</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Stasiun & Lokasi</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Suhu</th>
              <th className="py-3 px-3">Kelembaban</th>
              <th className="py-3 px-3">Radiasi</th>
              <th className="py-3 px-3">Angin</th>
              <th className="py-3 px-3">TMAT (Gambut)</th>
              <th className="py-3 px-3">Indeks FWI</th>
              <th className="py-3 px-3">Presipitasi</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sensors.map((s) => {
              const r = s.currentReadings || {};
              const isTmat = s.isTmatEquipped ? s.isTmatEquipped() : false;
              const isCrit = s.isTmatCritical ? s.isTmatCritical() : false;
              const fire = s.getFireRiskSummary ? s.getFireRiskSummary() : { level: 'Moderate', score: 0.45 };
              const rain = s.getPrecipitationAssessment ? s.getPrecipitationAssessment() : { isRaining: false, rainMm: 0 };
              const coords = s.formatCoordinates ? s.formatCoordinates() : `${s.latitude?.toFixed(4)}, ${s.longitude?.toFixed(4)}`;

              return (
                <tr 
                  key={s.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isCrit ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                        {s.id}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">{s.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {coords}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ONLINE
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                    {r.air_temperature_c} °C
                  </td>

                  <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                    {r.relative_humidity_pct} %
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-700">
                    {r.solar_radiation_wm2} W/m²
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-700">
                    {r.wind_speed_ms} m/s
                  </td>

                  <td className="py-3 px-3 font-mono">
                    {isTmat ? (
                      <span className={`font-bold px-1.5 py-0.5 rounded ${
                        isCrit 
                          ? 'bg-red-100 text-red-700 font-extrabold' 
                          : 'bg-teal-50 text-teal-700'
                      }`}>
                        {r.water_table_depth_cm} cm
                      </span>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      fire.isHigh 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {fire.level} ({fire.score})
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    {rain.isRaining ? (
                      <span className="text-sky-700 font-bold">
                        {rain.rainMm} mm/jam
                      </span>
                    ) : (
                      <span className="text-slate-400">0.0 mm/jam</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectStation(s.id, 'map')}
                        className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                      >
                        Peta
                      </button>
                      <button
                        type="button"
                        onClick={() => onExportStationCsv(s)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Unduh CSV"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
