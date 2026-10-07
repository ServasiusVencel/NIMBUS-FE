
export function calculateDewPoint(tempC, humidityPct) {
  if (tempC === null || tempC === undefined || humidityPct === null || humidityPct === undefined) {
    return 0;
  }
  const t = Number(tempC);
  const rh = Math.max(1, Math.min(100, Number(humidityPct)));
  return parseFloat((t - ((100 - rh) / 5)).toFixed(1));
}

/**
 * Converts wind direction in azimuth degrees (0-360°) to Indonesian 16-point compass abbreviation.
 * @param {number} degrees
 * @returns {string}
 */
export function getCompassDirection(degrees) {
  const deg = Number(degrees) || 0;
  const val = Math.floor((deg / 22.5) + 0.5);
  const directions = [
    "U", "U-TL", "TL", "T-TL",
    "T", "T-TG", "TG", "S-TG",
    "S", "S-BD", "BD", "B-BD",
    "B", "B-BL", "BL", "U-BL"
  ];
  return directions[(val % 16)];
}
