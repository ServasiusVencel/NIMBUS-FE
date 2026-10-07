/**
 * Domain Service: FireRiskEngine (OOP Pattern)
 * Calculates Fire Weather Index (FWI) proxy scores, assesses peatland groundwater
 * coupling hazards, and forecasts multi-day fire danger trajectories.
 */
export class FireRiskEngine {
  static calculatePseudoFWI({
    air_temperature_c = 30.0,
    relative_humidity_pct = 60.0,
    solar_radiation_wm2 = 600.0,
    rainfall_intensity_mmh = 0.0
  }) {
    // 1. Normalized Temperature sub-score (High temp > 33C = high fire risk)
    const tempScore = air_temperature_c > 34 ? 1.0 :
      air_temperature_c > 31 ? 0.75 :
        air_temperature_c > 28 ? 0.45 : 0.2;

    // 2. Normalized Humidity sub-score (Low RH < 50% = high drying rate)
    const rhScore = relative_humidity_pct < 45 ? 1.0 :
      relative_humidity_pct < 55 ? 0.75 :
        relative_humidity_pct < 70 ? 0.40 : 0.15;

    // 3. Normalized Solar Radiation sub-score (Solar > 750 W/m2 = intense drying)
    const solarScore = solar_radiation_wm2 > 750 ? 1.0 :
      solar_radiation_wm2 > 600 ? 0.70 :
        solar_radiation_wm2 > 400 ? 0.40 : 0.15;

    // 4. Normalized Rainfall sub-score (0 rain = high combustible factor)
    const rainScore = rainfall_intensity_mmh === 0 ? 1.0 :
      rainfall_intensity_mmh < 2.0 ? 0.5 :
        rainfall_intensity_mmh < 10.0 ? 0.15 : 0.0;

    const weights = {
      temperature: 0.35,
      humidity: 0.35,
      solar_radiation: 0.20,
      rainfall: 0.10
    };

    const rawScore = (weights.temperature * tempScore) +
      (weights.humidity * rhScore) +
      (weights.solar_radiation * solarScore) +
      (weights.rainfall * rainScore);

    const fwiScore = parseFloat(rawScore.toFixed(3));

    let riskClass = 0;
    let riskLabel = 'Rendah (Low)';
    let levelCode = 'Low';

    if (fwiScore >= 0.75) {
      riskClass = 3;
      riskLabel = 'Sangat Tinggi / Ekstrim (Extreme)';
      levelCode = 'Extreme';
    } else if (fwiScore >= 0.52) {
      riskClass = 2;
      riskLabel = 'Tinggi / Bahaya (High Risk)';
      levelCode = 'High';
    } else if (fwiScore >= 0.35) {
      riskClass = 1;
      riskLabel = 'Sedang / Waspada (Moderate)';
      levelCode = 'Moderate';
    }

    return {
      pseudo_fwi_score: fwiScore,
      risk_class: riskClass,
      risk_label: riskLabel,
      level_code: levelCode,
      sub_scores: {
        temperature_score: tempScore,
        humidity_score: rhScore,
        solar_radiation_score: solarScore,
        rainfall_score: rainScore
      },
      weights
    };
  }

  /**
   * Evaluates Peatland Subsurface Smoldering Fire Hazard by fusing FWI score with TMAT depth
   */
  static evaluatePeatlandCoupling(fwiScore, waterTableDepthCm) {
    if (waterTableDepthCm === null || waterTableDepthCm === undefined) {
      return {
        hasTmat: false,
        hazardLevel: 'STANDARD',
        message: 'Stasiun tidak dilengkapi sensor kedalaman gambut.'
      };
    }

    const isBelowRegulatoryThreshold = waterTableDepthCm < -40.0;
    const isSevereDrawdown = waterTableDepthCm < -60.0;

    if (isSevereDrawdown && fwiScore > 0.5) {
      return {
        hasTmat: true,
        hazardLevel: 'CRITICAL_COMBUSTION',
        title: '🚨 DARURAT KEBAKARAN BAWAH PERMUKAAN (PEAT FIRE EMERGENCY)',
        message: `Muka air tanah (${waterTableDepthCm} cm) surut drastis jauh di bawah ambang batas -40 cm. Lapisan gambut kering rentan menyulut kebakaran bawah tanah (smoldering fire) yang sulit dipadamkan.`
      };
    }

    if (isBelowRegulatoryThreshold) {
      return {
        hasTmat: true,
        hazardLevel: 'ELEVATED_RISK',
        title: '⚠️ AMBANG BATAS REGULASI TERLAMPAUI',
        message: `Muka air tanah (${waterTableDepthCm} cm) melampaui batas aman nasional (-40.0 cm). Lakukan penutupan sekat kanal (canal blocking) untuk menaikkan muka air.`
      };
    }

    return {
      hasTmat: true,
      hazardLevel: 'STABLE',
      title: '✓ TATA AIR GAMBUT TERJAGA',
      message: `Muka air tanah gambut (${waterTableDepthCm} cm) dalam kondisi aman terlindungi air.`
    };
  }

  /**
   * Generates a 10-day FWI multi-horizon forecast trend based on current score
   */
  static generate10DayFwiTrend(fwiScore = 0.50) {
    const multipliers = [0.70, 0.80, 1.0, 1.15, 1.35, 1.20, 0.95, 0.75, 0.60, 0.55];
    return multipliers.map((mult, idx) => {
      const raw = fwiScore * mult;
      const score = Math.max(0.15, Math.min(1.0, raw)).toFixed(2);
      const scoreNum = parseFloat(score);
      const level = scoreNum >= 0.75 ? 'Extreme' : scoreNum >= 0.52 ? 'High' : scoreNum >= 0.35 ? 'Moderate' : 'Low';
      const color = scoreNum >= 0.75 ? 'var(--red)' : scoreNum >= 0.52 ? 'var(--red)' : scoreNum >= 0.35 ? 'var(--amber)' : 'var(--green)';
      return {
        day: `Day ${idx + 1}`,
        dayLabel: `D${idx + 1}${idx === 4 ? ' (Peak)' : ''}`,
        score,
        level,
        color
      };
    });
  }
}

export default FireRiskEngine;
