import React from 'react';
import { CloudRain, Flame, Sprout, ArrowRight } from 'lucide-react';

/**
 * IntelligenceModulesSection: Reusable section displaying the three core
 * Nimbus predictive intelligence modules (Weather, Fire FWI, Agriculture).
 */
export const IntelligenceModulesSection = ({ onNavigate }) => {
  return (
    <div className="pt-2">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Nimbus Intelligence Modules
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Akses modul analisis cerdas untuk pemantauan mikroklimat, pencegahan bencana, dan agroklimatologi presisi:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
        {/* Module 1: General Weather */}
        <div className="bg-white border border-slate-200/90 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 transition-transform group-hover:scale-105">
                <CloudRain size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-sky-600 font-mono">MODUL 01</span>
                <h4 className="text-sm font-bold text-slate-800">General Weather</h4>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Proyeksi ramalan 10 hari, telemetri mikroklimat aktual multi-parameter, dan ekspor dataset CSV historis stasiun.
            </p>
          </div>
          <button 
            type="button"
            className="mt-4 w-full py-2.5 px-3.5 bg-slate-50 hover:bg-sky-50/80 border border-slate-200 hover:border-sky-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-700 transition flex items-center justify-between cursor-pointer group/btn"
            onClick={() => onNavigate('weather')}
          >
            <span>Buka General Weather</span>
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>

        {/* Module 2: Fire Warning Index */}
        <div className="bg-white border border-slate-200/90 hover:border-red-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 transition-transform group-hover:scale-105">
                <Flame size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-red-600 font-mono">MODUL 02</span>
                <h4 className="text-sm font-bold text-slate-800">Fire Warning Index</h4>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Model prediksi karhutla & gambut berbasis Canadian FWI yang terkopel dengan dinamika kedalaman muka air tanah (TMAT).
            </p>
          </div>
          <button 
            type="button"
            className="mt-4 w-full py-2.5 px-3.5 bg-slate-50 hover:bg-red-50/80 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-700 transition flex items-center justify-between cursor-pointer group/btn"
            onClick={() => onNavigate('fire')}
          >
            <span>Buka Fire Warning Index</span>
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>

        {/* Module 3: Climate Agriculture */}
        <div className="bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-105">
                <Sprout size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 font-mono">MODUL 03</span>
                <h4 className="text-sm font-bold text-slate-800">Climate Agriculture</h4>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kalender kesesuaian operasional kebun (penyemprotan, pemupukan, panen), radar patogen penyakit, dan kalkulasi GDD/VPD.
            </p>
          </div>
          <button 
            type="button"
            className="mt-4 w-full py-2.5 px-3.5 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 transition flex items-center justify-between cursor-pointer group/btn"
            onClick={() => onNavigate('agri')}
          >
            <span>Buka Climate Agriculture</span>
            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
