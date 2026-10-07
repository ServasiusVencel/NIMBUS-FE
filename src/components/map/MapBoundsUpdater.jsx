import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * MapBoundsUpdater: Dynamically adjusts Leaflet map view bounds
 * to fit all visible telemetry station coordinates.
 */
export function MapBoundsUpdater({ sensors = [] }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!sensors || sensors.length === 0) return;
    map.invalidateSize();
    const validCoords = sensors
      .filter(s => typeof s.latitude === 'number' && typeof s.longitude === 'number' && !isNaN(s.latitude) && !isNaN(s.longitude))
      .map(s => [s.latitude, s.longitude]);
    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });
    }
  }, [sensors, map]);

  return null;
}
