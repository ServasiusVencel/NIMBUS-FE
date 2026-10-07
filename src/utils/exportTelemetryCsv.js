/**
 * Utility: exportTelemetryCsv
 * Generates and triggers download of CSV telemetry records for IoT AWS stations.
 */
export function exportTelemetryCsv({ sensor, startDate = '2026-09-01', endDate = '2026-09-29' }) {
  const sensorId = sensor?.id || 'AWS-STATION';
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const csvRows = [
    "Timestamp,Station_ID,Air_Temp_C,Relative_Humidity_Pct,Solar_Rad_Wm2,Rainfall_mm,Wind_Speed_ms,Water_Table_cm,Soil_Moisture_Pct"
  ];

  // Generate daily hourly records
  const current = new Date(start);
  let count = 0;
  while (current <= end && count < 100) {
    const dateStr = current.toISOString().split('T')[0];
    const hours = [8, 11, 14, 17];
    hours.forEach(h => {
      const hourStr = h < 10 ? `0${h}:00:00` : `${h}:00:00`;
      const temp = (28 + Math.sin(h / 3) * 5 + (Math.random() * 1.2)).toFixed(1);
      const rh = (75 - Math.sin(h / 3) * 18 + (Math.random() * 3)).toFixed(0);
      const solar = h === 14 ? (750 + Math.random() * 90).toFixed(0) : (450 + Math.random() * 80).toFixed(0);
      const rain = (Math.random() > 0.8 ? (Math.random() * 8.5).toFixed(1) : '0.0');
      const wind = (1.5 + Math.random() * 2.0).toFixed(1);
      const hasTmat = sensor?.isTmatEquipped ? sensor.isTmatEquipped() : sensor?.capabilities?.groundwater_tmat;
      const tmat = hasTmat 
        ? (sensor.currentReadings?.water_table_depth_cm || -45.0 + (Math.random() * 2 - 1)).toFixed(1) 
        : 'N/A';
      const soil = (75 + Math.random() * 10).toFixed(1);

      csvRows.push(`${dateStr} ${hourStr},${sensorId},${temp},${rh},${solar},${rain},${wind},${tmat},${soil}`);
    });
    current.setDate(current.getDate() + 1);
    count++;
  }

  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", `Nimbus_Telemetry_${sensorId}_${startDate}_to_${endDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
