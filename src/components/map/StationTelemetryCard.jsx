import React from 'react';
import {
  StationHardwareHeader,
  StationTelemetryGrid,
  PeatlandTmatGauge,
  StationTrendSparkline,
  StationActionButtons
} from './telemetry';

export const StationTelemetryCard = ({
  selectedSensor,
  isDroughtCritical = false,
  onViewWeather,
  onViewFire,
}) => {
  if (!selectedSensor) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between animate-fade-in space-y-4">
      <div>
        <StationHardwareHeader sensor={selectedSensor} />
        <StationTelemetryGrid sensor={selectedSensor} />
        <PeatlandTmatGauge sensor={selectedSensor} isDroughtCritical={isDroughtCritical} />
        <StationTrendSparkline sensor={selectedSensor} />
      </div>

      <StationActionButtons
        sensor={selectedSensor}
        onViewWeather={onViewWeather}
        onViewFire={onViewFire}
      />
    </div>
  );
};

export default StationTelemetryCard;
