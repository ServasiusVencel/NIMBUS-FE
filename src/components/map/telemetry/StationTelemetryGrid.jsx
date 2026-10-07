import React from 'react';
import { Thermometer, Droplets, Gauge, Wind, Sun, CloudRain } from 'lucide-react';
import { calculateDewPoint, getCompassDirection } from '../../../utils/meteorology';

/**
 * StationTelemetryGrid: Multi-channel live telemetry grid displaying core microclimate channels:
 * Air Temp, Dew Point, Humidity, Barometric Pressure, Wind Speed & Compass, Solar Radiation, and Rainfall.
 */
export const StationTelemetryGrid = ({ sensor }) => {
  if (!sensor) return null;

  const r = sensor.currentReadings || {};
  const temp = r.air_temperature_c ?? 31.0;
  const rh = r.relative_humidity_pct ?? 65.0;
  const dewPoint = calculateDewPoint(temp, rh);
  const pressure = r.air_pressure_hpa ?? 1011.2;
  const windSpeed = r.wind_speed_ms ?? 2.0;
  const windDir = r.wind_direction_deg ?? 95;
  const solarRad = r.solar_radiation_wm2 ?? 620;
  const rainfall = r.rainfall_intensity_mmh ?? 0.0;

  return (
    <div className="space-y-2.5 my-3.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span>Kanal Sensor Telemetri Real-Time</span>
        <span className="text-[10px] text-slate-400 font-mono">Sampling Aktif</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Suhu Udara & Titik Embun */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px] font-medium text-slate-600">Suhu Udara</span>
            <Thermometer size={13} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-slate-900">{temp}</span>
            <span className="text-xs text-slate-400">°C</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Dew Point: {dewPoint}°C</span>
        </div>

        {/* Kelembaban Relatif (RH) */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px] font-medium text-slate-600">Kelembaban</span>
            <Droplets size={13} className="text-sky-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-slate-900">{rh}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">RH Udara Ambien</span>
        </div>

        {/* Tekanan Barometrik Udara */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px] font-medium text-slate-600">Tekanan Udara</span>
            <Gauge size={13} className="text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-slate-900">{pressure}</span>
            <span className="text-xs text-slate-400">hPa</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Barometrik Permukaan</span>
        </div>

        {/* Arah & Kecepatan Angin */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px] font-medium text-slate-600">Angin & Arah</span>
            <Wind size={13} className="text-teal-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-slate-900">{windSpeed}</span>
            <span className="text-xs text-slate-400">m/s</span>
          </div>
          <span className="text-[10px] text-teal-700 font-mono font-medium">
            {windDir}° ({getCompassDirection(windDir)})
          </span>
        </div>

        {/* Radiasi Surya */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px] font-medium text-slate-600">Radiasi Surya</span>
            <Sun size={13} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-slate-900">{solarRad}</span>
            <span className="text-xs text-slate-400">W/m²</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Solar Pyranometer</span>
        </div>

        {/* Curah Hujan Intensitas */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px] font-medium text-slate-600">Curah Hujan</span>
            <CloudRain size={13} className="text-sky-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-slate-900">{rainfall}</span>
            <span className="text-xs text-slate-400">mm/j</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Tipping Bucket Gauge</span>
        </div>
      </div>
    </div>
  );
};

export default StationTelemetryGrid;
