import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { MapBoundsUpdater } from '../map/MapBoundsUpdater';
import { createCustomMarker } from '../map/mapMarkerIcons';
import { StationMarkerPopup } from '../map/StationMarkerPopup';
import { StationSelectorToolbar } from '../map/StationSelectorToolbar';
import { Compass, Download } from 'lucide-react';

/**
 * FleetGisMap: Geospatial overview map displaying all IoT stations with
 * interactive station selector chips and focused telemetry snapshot panel.
 */
export const FleetGisMap = ({
  sensors = [],
  selectedStation,
  onSelectStation,
  onViewStationDetail,
  onExportStationCsv
}) => {
  const currentStation = selectedStation || sensors[0];
  const r = currentStation?.currentReadings || {};
  const isTmat = currentStation?.isTmatEquipped ? currentStation.isTmatEquipped() : false;
  const isTmatCrit = currentStation?.isTmatCritical ? currentStation.isTmatCritical() : false;
  const coords = currentStation?.formatCoordinates 
    ? currentStation.formatCoordinates() 
    : `${currentStation?.latitude?.toFixed(4)}, ${currentStation?.longitude?.toFixed(4)}`;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
      {/* Map Header & Quick Station Badges */}
      <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass size={17} className="text-sky-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Sebaran Geospasial Seluruh Armada Stasiun AWS
          </h3>
          <span className="text-xs text-slate-400">
            ({sensors.length} Titik Terpantau)
          </span>
        </div>

        {/* Station selector toolbar with reusable arrows and mouse wheel support */}
        <div className="max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg min-w-0">
          <StationSelectorToolbar
            sensors={sensors}
            selectedSensorId={currentStation?.id}
            onSelectStation={(s) => onSelectStation && onSelectStation(s.id)}
            showLabel={false}
            showTmat={false}
          />
        </div>
      </div>

      {/* Map & Station Quick-Info Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* Left: Leaflet Map (8 cols on lg) */}
        <div className="lg:col-span-8 h-[360px] sm:h-[420px] w-full relative">
          <MapContainer
            center={[-0.7893, 105.0]}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBoundsUpdater sensors={sensors} />

            {sensors.map((sensor) => (
              <Marker
                key={sensor.id}
                position={[sensor.latitude, sensor.longitude]}
                icon={createCustomMarker(sensor, sensor.id === currentStation?.id)}
                eventHandlers={{
                  click: () => onSelectStation(sensor.id),
                }}
              >
                <StationMarkerPopup 
                  sensor={sensor}
                  onViewDetail={() => onViewStationDetail(sensor.id, 'map')}
                />
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right: Focused Station Snapshot (4 cols on lg) */}
        <div className="lg:col-span-4 p-5 bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
              <span className="text-[11px] font-bold font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {currentStation?.id}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                ONLINE
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-800 mb-1">
              {currentStation?.name}
            </h4>
            <p className="text-[11px] font-mono text-slate-400 mb-4">
              GPS: {coords}
            </p>

            {/* Snapshot metrics */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-medium text-slate-400 block">Suhu Udara</span>
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  {r.air_temperature_c} °C
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-medium text-slate-400 block">Kelembaban</span>
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  {r.relative_humidity_pct} %
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-medium text-slate-400 block">Radiasi Surya</span>
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  {r.solar_radiation_wm2} W/m²
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-medium text-slate-400 block">Muka Air Gambut</span>
                <span className={`text-base font-extrabold font-mono ${
                  isTmatCrit ? 'text-red-600' : 'text-slate-800'
                }`}>
                  {isTmat ? `${r.water_table_depth_cm} cm` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewStationDetail(currentStation.id, 'map')}
              className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition text-center cursor-pointer"
            >
              Detail Stasiun Ini
            </button>
            <button
              type="button"
              onClick={() => onExportStationCsv(currentStation)}
              className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition cursor-pointer"
              title="Unduh CSV Stasiun Ini"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
