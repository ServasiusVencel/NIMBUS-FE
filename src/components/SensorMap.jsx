import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useApp } from '../context/AppContext';
import { MapBoundsUpdater } from './map/MapBoundsUpdater';
import { createCustomMarker } from './map/mapMarkerIcons';
import { MapOverviewHeader } from './map/MapOverviewHeader';
import { HazardSummaryTrio } from './map/HazardSummaryTrio';
import { StationTelemetryCard } from './map/StationTelemetryCard';
import { StationMarkerPopup } from './map/StationMarkerPopup';
import { StationSelectorToolbar } from './map/StationSelectorToolbar';

/**
 * SensorMap: Orchestrator component for Interactive GIS IoT Telemetry Map.
 * Integrates Leaflet OpenStreetMap, multi-hazard intelligence cards, and station telemetry panel.
 * Migrated to pure Tailwind CSS v4.
 */
export const SensorMap = () => {
  const { visibleSensors, activeSensorId, setActiveSensorId, setActiveTab } = useApp();

  // Derived selected sensor
  const selectedSensor = visibleSensors.find(s => s.id === activeSensorId) || visibleSensors[0];

  const handleSelectStation = (sensor) => {
    setActiveSensorId(sensor.id);
  };

  // OOP Domain Evaluations from SensorStation model
  const fireSummary = selectedSensor?.getFireRiskSummary
    ? selectedSensor.getFireRiskSummary()
    : { level: 'Moderate', score: 0.45, isHigh: false, isLow: false, color: '#f59e0b' };

  const tmatAssessment = selectedSensor?.getTmatAssessment
    ? selectedSensor.getTmatAssessment()
    : { equipped: false, status: 'N/A', label: 'TMAT Tidak Terpasang', color: '#64748b', recommendation: '' };

  const rainAssessment = selectedSensor?.getPrecipitationAssessment
    ? selectedSensor.getPrecipitationAssessment()
    : { isRaining: false, rainMm: 0, label: '0.0 mm/jam', badge: 'KERING', recommendation: '' };

  const isDroughtCritical = selectedSensor?.isTmatCritical ? selectedSensor.isTmatCritical() : false;
  const isDroughtWarning = selectedSensor?.isTmatWarning ? selectedSensor.isTmatWarning() : false;
  const hasTmat = selectedSensor?.isTmatEquipped ? selectedSensor.isTmatEquipped() : false;
  const tmatVal = selectedSensor?.currentReadings?.water_table_depth_cm;
  const rainMm = rainAssessment.rainMm;
  const isRaining = rainAssessment.isRaining;

  return (
    <div className="animate-fade-in w-full min-w-0">
      <MapOverviewHeader
        selectedSensor={selectedSensor}
      />
      <HazardSummaryTrio
        selectedSensor={selectedSensor}
        fireSummary={fireSummary}
        tmatAssessment={tmatAssessment}
        isDroughtCritical={isDroughtCritical}
        isDroughtWarning={isDroughtWarning}
        isDroughtWarningProp={isDroughtWarning}
        hasTmat={hasTmat}
        tmatVal={tmatVal}
        rainAssessment={rainAssessment}
        rainMm={rainMm}
        isRaining={isRaining}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 min-w-0">
        <div className="xl:col-span-8 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs flex flex-col min-w-0">
          <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100">
            <StationSelectorToolbar
              sensors={visibleSensors}
              selectedSensorId={selectedSensor?.id}
              onSelectStation={handleSelectStation}
            />
          </div>

          <div className="flex-1 min-h-[480px] w-full relative">
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

              <MapBoundsUpdater sensors={visibleSensors} />

              {visibleSensors.map((sensor) => (
                <Marker
                  key={sensor.id}
                  position={[sensor.latitude, sensor.longitude]}
                  icon={createCustomMarker(sensor, sensor.id === selectedSensor?.id)}
                  eventHandlers={{
                    click: () => handleSelectStation(sensor),
                  }}
                >
                  <StationMarkerPopup
                    sensor={sensor}
                    onViewDetail={() => {
                      handleSelectStation(sensor);
                      setActiveTab('weather');
                    }}
                  />
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col min-w-0">
          <StationTelemetryCard
            selectedSensor={selectedSensor}
            isDroughtCritical={isDroughtCritical}
            onViewWeather={() => {
              setActiveSensorId(selectedSensor.id);
              setActiveTab('weather');
            }}
            onViewFire={() => {
              setActiveSensorId(selectedSensor.id);
              setActiveTab('fire');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SensorMap;
