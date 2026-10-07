import React from 'react';
import { Layers } from 'lucide-react';

/**
 * FwiComponentsGrid: Displays the Canadian Standard sub-index components
 * (FFMC, DMC, DC, ISI, BUI, Total FWI) and site calibration values.
 * Migrated to pure Tailwind CSS v4.
 */
export const FwiComponentsGrid = ({ fwiScore = 0.50, riskLabel = '', isHighRisk = false }) => {
  const components = [
    { title: 'FFMC (Fine Fuel)', desc: 'Moisture content serasah & daun kering', val: '88.4', color: 'text-slate-800' },
    { title: 'DMC (Duff Moisture)', desc: 'Lapisan bahan organik gambut dangkal', val: '42.1', color: 'text-slate-800' },
    { title: 'DC (Drought Code)', desc: 'Lapisan gambut tebal bawah permukaan', val: '310.5', color: 'text-slate-800' },
    { title: 'ISI (Initial Spread)', desc: 'Laju perambatan api awal terdorong angin', val: '7.8', color: 'text-slate-800' },
    { title: 'BUI (Buildup Index)', desc: 'Total bahan bakar biomassa siap terbakar', val: '58.2', color: 'text-slate-800' },
    { 
      title: 'FWI Total Index', 
      desc: 'Indeks intensitas potensi kebakaran', 
      val: `${fwiScore} (${riskLabel.split(' ')[0]})`, 
      color: isHighRisk ? 'text-red-600' : 'text-amber-600' 
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-5 animate-fade-in">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
        <Layers className="text-blue" size={18} />
        <h3 className="text-base font-bold text-slate-800">Index Components (Canadian Standard & Site Calibration)</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {components.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 transition-colors">
            <b className="text-xs font-bold text-slate-800">{item.title}</b>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
            <div className={`mt-2 font-mono font-bold text-sm ${item.color}`}>
              {item.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

