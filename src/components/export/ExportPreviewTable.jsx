import React from 'react';

/**
 * ExportPreviewTable: Renders an interactive tabular preview of the first
 * rows of telemetry data matching active filters and parameters.
 */
export const ExportPreviewTable = ({ rows = [] }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">
          Pratinjau Data
        </h3>
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          {rows.length} Baris Sampel
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Station_ID</th>
              <th className="py-2.5 px-3">Air_Temp_C</th>
              <th className="py-2.5 px-3">RH_Pct</th>
              <th className="py-2.5 px-3">Solar_Wm2</th>
              <th className="py-2.5 px-3">Rain_mm</th>
              <th className="py-2.5 px-3">Wind_ms</th>
              <th className="py-2.5 px-3">Water_Table_cm</th>
              <th className="py-2.5 px-3">Soil_Pct</th>
              <th className="py-2.5 px-3">Batt_V</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition">
                <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{row.time}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800">{row.id}</td>
                <td className="py-2.5 px-3">{row.temp}</td>
                <td className="py-2.5 px-3">{row.rh}%</td>
                <td className="py-2.5 px-3">{row.solar}</td>
                <td className="py-2.5 px-3">{row.rain}</td>
                <td className="py-2.5 px-3">{row.wind}</td>
                <td className={`py-2.5 px-3 font-semibold ${row.tmat !== 'N/A' && parseFloat(row.tmat) < -40 ? 'text-red-600' : 'text-teal-700'}`}>
                  {row.tmat}
                </td>
                <td className="py-2.5 px-3">{row.soil}%</td>
                <td className="py-2.5 px-3">{row.volt}V</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="py-6 text-center text-slate-400">
                  Tidak ada baris pratinjau yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExportPreviewTable;
