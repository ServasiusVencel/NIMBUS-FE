import React from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Waves,
  MapPin,
  Radio
} from 'lucide-react';
export const CurrentWeatherOverview = ({ sensor }) => {
  if (!sensor) return null;

  const currentReadings = sensor.currentReadings || {};
  const coords = sensor.formatCoordinates
    ? sensor.formatCoordinates()
    : `${sensor.latitude?.toFixed(4)}, ${sensor.longitude?.toFixed(4)}`;
  const hasTmat = sensor.isTmatEquipped ? sensor.isTmatEquipped() : sensor.capabilities?.groundwater_tmat;
  const isTmatCrit = sensor.isTmatCritical ? sensor.isTmatCritical() : false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
      {/* Current Main Observation Card */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100">
            <span className="font-medium text-slate-600">Stasiun: {sensor.name}</span>
            <span className="font-mono">14:00 WIB</span>
          </div>

          <div className="flex items-center gap-5 my-5">
            <div className="text-5xl select-none">
              {sensor.weatherIcon === 'sun' ? '☀️' : sensor.weatherIcon === 'rain' ? '🌧️' : '⛅'}
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight font-mono">
                {currentReadings.air_temperature_c?.toFixed(1) || '32.5'}°C
              </div>
              <div className="text-sm font-bold text-slate-500 mt-1">{sensor.condition || 'Clear Sky'}</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-mono">
            <Radio size={13} className="text-blue" />
            <b>{sensor.id}</b>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <MapPin size={13} className="text-slate-400" />
            <span>{coords}</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ONLINE
          </span>
        </div>
      </div>

      {/* Telemetry Sensor Variables Card */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 mb-2">Sensor Telemetry Variables</h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-slate-600">
              <Thermometer size={15} className="text-amber-500" /> Suhu Udara
            </span>
            <b className="font-mono text-slate-800">{currentReadings.air_temperature_c || '32.5'}°C</b>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-slate-600">
              <Droplets size={15} className="text-sky-500" /> Kelembaban Udara (RH)
            </span>
            <b className="font-mono text-slate-800">{currentReadings.relative_humidity_pct || '68'}%</b>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-slate-600">
              <Sun size={15} className="text-amber-500" /> Radiasi Matahari
            </span>
            <b className="font-mono text-slate-800">{currentReadings.solar_radiation_wm2 || '820'} W/m²</b>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-slate-600">
              <Wind size={15} className="text-slate-500" /> Kecepatan Angin
            </span>
            <b className="font-mono text-slate-800">{currentReadings.wind_speed_ms || '2.0'} m/s</b>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-slate-600">
              <CloudRain size={15} className="text-sky-500" /> Intensitas Hujan
            </span>
            <b className="font-mono text-slate-800">{currentReadings.rainfall_intensity_mmh || '0'} mm/jam</b>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-slate-600">
              <Waves size={15} className="text-teal-600" /> Muka Air Gambut (TMAT)
            </span>
            <b className={`font-mono ${isTmatCrit ? 'text-red-600' : 'text-emerald-600'}`}>
              {hasTmat ? `${currentReadings.water_table_depth_cm} cm` : 'Tidak Terpasang'}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

