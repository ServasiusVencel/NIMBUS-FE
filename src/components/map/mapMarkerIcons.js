import L from 'leaflet';

/**
 * Creates custom vector HTML pin markers for Leaflet map with pulsing active ring.
 */
export const createCustomMarker = (sensor, isActive = false) => {
  const statusColor = sensor.status === 'online' ? '#10b981' : sensor.status === 'warning' ? '#f59e0b' : '#ef4444';
  const activeRing = isActive 
    ? 'box-shadow: 0 0 0 4px #0284c7, 0 10px 20px rgba(2,132,199,0.45); transform: scale(1.15); z-index: 1000;' 
    : 'box-shadow: 0 4px 12px rgba(0,0,0,0.18);';

  return L.divIcon({
    className: 'nimbus-map-marker-wrapper',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: #ffffff;
        border-radius: 50%;
        border: 3.5px solid ${statusColor};
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        ${activeRing}
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: ${statusColor};
          border-radius: 50%;
        "></div>
        <span style="
          position: absolute;
          bottom: -22px;
          left: 50%;
          transform: translateX(-50%);
          background: #0f172a;
          color: #ffffff;
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          white-space: nowrap;
          letter-spacing: 0.02em;
          pointer-events: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        ">${sensor.id}</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};
