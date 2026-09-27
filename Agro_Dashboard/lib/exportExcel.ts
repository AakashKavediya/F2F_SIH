import * as XLSX from 'xlsx';
import { Field, PassportEvent } from '@/data/types';
import {
  farmerData,
  farmData,
  fieldsData,
  selectedPlantDetails,
  agroBotsData,
  diseaseEventsData,
  pestEventsData,
  weedEventsData,
  irrigationData,
  taskItemsData,
  alertItemsData,
  riskItemsData,
  weatherData,
  advisoryItemsData,
  govtSchemesData,
  fieldPassportEventsData,
  recentActivitiesTimeline,
} from '@/data/farmData';


export function exportFarmExcelReport(): void {
  const wb = XLSX.utils.book_new();

  // 1. Farmer Profile
  const farmerProfileData = [
    {
      'Farmer ID': farmerData.id,
      'Name': farmerData.name,
      'Mobile': farmerData.mobile,
      'State': farmerData.state,
      'District': farmerData.district,
      'Taluka': farmerData.taluka,
      'Village': farmerData.village,
      'Farm': farmerData.farm,
      'Experience': farmerData.experience,
      'Registration': farmerData.registration,
      'eKYC': farmerData.eKYC,
      'KCC Limit': farmerData.kccLimit,
      'Insurance': farmerData.insuranceStatus,
    },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(farmerProfileData), 'Farmer Profile');

  // 2. Farm Overview
  const farmOverviewData = [
    {
      'Farm ID': farmData.id,
      'Farm Name': farmData.name,
      'Area (Acres)': farmData.totalArea,
      'Cultivable Area': farmData.cultivableArea,
      'Irrigated Area': farmData.irrigatedArea,
      'Rainfed Area': farmData.rainfedArea,
      'Location': farmData.location,
      'Farm Health': `${farmData.farmHealth}/100`,
      'Crop Health': `${farmData.cropHealth}%`,
      'Water Efficiency': `${farmData.waterEfficiency}%`,
      'Robot Coverage': `${farmData.robotCoverage}%`,
      'Expected Yield': `${farmData.expectedYield.tonnes} tonnes`,
      'Yield Confidence': `${farmData.expectedYield.confidence}%`,
    },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(farmOverviewData), 'Farm Overview');

  // 3. Land Parcels
  const landParcels = [
    { 'Parcel ID': 'PARCEL-01', 'Survey No': '42/1', 'Area (Acres)': 2.8, 'Soil Type': 'Sandy Loam', 'Irrigation Source': 'Borewell 1 (Solar Pump)', 'Status': 'Cultivated' },
    { 'Parcel ID': 'PARCEL-02', 'Survey No': '42/2', 'Area (Acres)': 2.6, 'Soil Type': 'Clay Loam', 'Irrigation Source': 'Borewell 2 + Drip System', 'Status': 'Cultivated' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(landParcels), 'Land Parcels');

  // 4. Fields
  const fieldsSheetData = fieldsData.map((f) => ({
    'Field ID': f.id,
    'Field Name': f.name,
    'Crop': f.crop,
    'Variety': f.variety,
    'Area (Acres)': f.area,
    'Plant Count': f.plantCount,
    'Health (%)': f.health,
    'Growth Stage': f.growthStage,
    'Soil Moisture (%)': f.soilMoisture,
    'Disease Risk (%)': f.diseaseRisk,
    'Pest Risk (%)': f.pestRisk,
    'Weed Coverage (%)': f.weedCoverage,
    'Water Stress': f.waterStress,
    'Last AI Scan': f.lastAiScan,
    'Expected Harvest': f.expectedHarvest,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fieldsSheetData), 'Fields');

  // 5. Zones
  const zonesList: any[] = [];
  fieldsData.forEach((f) => {
    f.zones.forEach((z) => {
      zonesList.push({
        'Field ID': f.id,
        'Field Name': f.name,
        'Zone ID': z.id,
        'Zone Name': z.name,
        'Area (Acres)': z.area,
        'Soil Moisture (%)': z.soilMoisture,
        'Soil Temp (°C)': z.soilTemperature,
        'Nitrogen (mg/kg)': z.npk.n,
        'Phosphorus (mg/kg)': z.npk.p,
        'Potassium (mg/kg)': z.npk.k,
        'Health Score': z.healthScore,
        'Active Issue': z.issueDescription || 'None',
      });
    });
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(zonesList), 'Zones');

  // 6. Crops
  const cropsSheetData = [
    { 'Crop': 'Tomato', 'Variety': 'Arka Rakshak & Abhinav', 'Total Area (Acres)': 2.9, 'Plant Count': 4430, 'Avg Health': '91%', 'Primary Risk': 'Early Blight' },
    { 'Crop': 'Cotton', 'Variety': 'Phule Anmol', 'Total Area (Acres)': 1.3, 'Plant Count': 1850, 'Avg Health': '84%', 'Primary Risk': 'Soil Dryness (Zone B2)' },
    { 'Crop': 'Wheat', 'Variety': 'GW-496', 'Total Area (Acres)': 1.2, 'Plant Count': 1960, 'Avg Health': '92%', 'Primary Risk': 'Nitrogen Deficit' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cropsSheetData), 'Crops');

  // 7. Plants
  const plantsSheetData = [
    {
      'Plant ID': selectedPlantDetails.id,
      'Field': selectedPlantDetails.fieldId,
      'Zone': selectedPlantDetails.zoneId,
      'Row': selectedPlantDetails.rowId,
      'Crop': selectedPlantDetails.cropName,
      'Variety': selectedPlantDetails.variety,
      'Planted Date': selectedPlantDetails.plantedDate,
      'Age (Days)': selectedPlantDetails.ageDays,
      'Health (%)': selectedPlantDetails.health,
      'Growth Stage': selectedPlantDetails.stage,
      'Status': selectedPlantDetails.status,
      'Water Consumed (L)': selectedPlantDetails.stats.estimatedWaterLiters,
      'Fertilizer Applications': selectedPlantDetails.stats.fertilizerApplications,
      'Sprays': selectedPlantDetails.stats.sprays,
      'AI Scans': selectedPlantDetails.stats.aiScans,
    },
    {
      'Plant ID': 'PLANT-A-0412',
      'Field': 'FIELD-A',
      'Zone': 'ZONE-A1',
      'Row': 'ROW-A1-04',
      'Crop': 'Tomato',
      'Variety': 'Arka Rakshak',
      'Planted Date': '25 Jul 2026',
      'Age (Days)': 62,
      'Health (%)': 92,
      'Growth Stage': 'Fruiting',
      'Status': 'On Track',
      'Water Consumed (L)': 32.4,
      'Fertilizer Applications': 4,
      'Sprays': 1,
      'AI Scans': 58,
    },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(plantsSheetData), 'Plants');

  // 8. Crop Health
  const cropHealthList = fieldsData.map((f) => ({
    'Date': '25 Sep 2026',
    'Field': f.name,
    'Crop': f.crop,
    'Variety': f.variety,
    'Plant Count': f.plantCount,
    'Healthy Plants': Math.round(f.plantCount * (f.health / 100)),
    'Stressed Plants': Math.round(f.plantCount * (1 - f.health / 100)),
    'Health Score': `${f.health}%`,
    'Growth Stage': f.growthStage,
    'Nutrient Status': f.nutrientStatus,
    'Water Stress': f.waterStress,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cropHealthList), 'Crop Health');

  // 9. Disease Events
  const diseaseSheetData = diseaseEventsData.map((d) => ({
    'Event ID': d.id,
    'Field ID': d.fieldId,
    'Zone ID': d.zoneId,
    'Disease Name': d.diseaseName,
    'Confidence (%)': d.confidence,
    'Severity': d.severity,
    'Status': d.status,
    'Affected Plants': d.affectedPlants,
    'Affected Area (sq.m)': d.affectedAreaSqM,
    'Detected At': d.detectedAt,
    'Detection Source': d.source,
    'AI Model': d.aiModel,
    'Treatment Applied': d.treatmentDetails?.product || 'Monitoring / None',
    'Before Count': d.treatmentDetails?.beforePlants || d.affectedPlants,
    'After Count': d.treatmentDetails?.afterPlants || (d.status === 'Resolved' ? 0 : d.affectedPlants),
    'Effectiveness (%)': d.treatmentDetails?.effectivenessPct ? `${d.treatmentDetails.effectivenessPct}%` : 'N/A',
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(diseaseSheetData), 'Disease Events');

  // 10. Pest Events
  const pestSheetData = pestEventsData.map((p) => ({
    'Event ID': p.id,
    'Field ID': p.fieldId,
    'Zone ID': p.zoneId,
    'Species': p.species,
    'Count': p.count,
    'Density (/sq.m)': p.densityPerSqM,
    'Severity': p.severity,
    'Confidence (%)': p.confidence,
    'Status': p.status,
    'Trend (%)': `${p.trendPct > 0 ? '+' : ''}${p.trendPct}%`,
    'Source': p.source,
    'Acoustic Frequency (kHz)': p.acousticData?.frequencyKHz || 'N/A',
    'Acoustic Score': p.acousticData?.activityScore || 'N/A',
    'Detected At': p.detectedAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pestSheetData), 'Pest Events');

  // 11. Weed Events
  const weedSheetData = weedEventsData.map((w) => ({
    'Event ID': w.id,
    'Field ID': w.fieldId,
    'Zone ID': w.zoneId,
    'Species': w.species,
    'Coverage (%)': `${w.coveragePct}%`,
    'Density (/sq.m)': w.densityPerSqM,
    'Affected Area (Acres)': w.affectedAreaAcres,
    'Competition Risk': w.competitionRisk,
    'Recommended Intervention': w.recommendedIntervention,
    'Detected At': w.detectedAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(weedSheetData), 'Weed Events');

  // 12. Nutrient Status
  const nutrientData = [
    { 'Parameter': 'Nitrogen (N)', 'Farm Average': '89 mg/kg', 'Field A': '108 mg/kg', 'Field B': '96 mg/kg', 'Field C': '109 mg/kg', 'Field D': '72 mg/kg (Deficient)', 'Optimal Range': '95–120 mg/kg', 'Status': 'Field D Attention' },
    { 'Parameter': 'Phosphorus (P)', 'Farm Average': '45 mg/kg', 'Field A': '47 mg/kg', 'Field B': '41 mg/kg', 'Field C': '47 mg/kg', 'Field D': '45 mg/kg', 'Optimal Range': '40–60 mg/kg', 'Status': 'Normal' },
    { 'Parameter': 'Potassium (K)', 'Farm Average': '181 mg/kg', 'Field A': '188 mg/kg', 'Field B': '170 mg/kg', 'Field C': '188 mg/kg', 'Field D': '178 mg/kg', 'Optimal Range': '150–220 mg/kg', 'Status': 'Good' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(nutrientData), 'Nutrient Status');

  // 13. Fertilizer Usage
  const fertilizerUsageData = [
    { 'Date': '15 Sep 2026', 'Field': 'Field C', 'Zone': 'Zone C4', 'Type': 'NPK 19:19:19 (Water Soluble)', 'Quantity (kg)': 12.5, 'Method': 'Drip Fertigation', 'Efficiency (%)': 92 },
    { 'Date': '10 Sep 2026', 'Field': 'Field A', 'Zone': 'Zone A2', 'Type': 'Calcium Nitrate', 'Quantity (kg)': 15.0, 'Method': 'Foliar Spray', 'Efficiency (%)': 89 },
    { 'Date': '01 Sep 2026', 'Field': 'Field D', 'Zone': 'Zone D1-D3', 'Type': 'Basal DAP (Diammonium Phosphate)', 'Quantity (kg)': 50.0, 'Method': 'Soil Broadcast', 'Efficiency (%)': 84 },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fertilizerUsageData), 'Fertilizer Usage');

  // 14. Irrigation Events
  const irrigationHistoryData = irrigationData.history.map((h) => ({
    'Event ID': h.id,
    'Date': h.date,
    'Field Name': h.fieldName,
    'Zone': h.zoneId,
    'Duration (mins)': h.durationMins,
    'Flow Rate (L/min)': h.flowRate,
    'Total Volume (L)': h.liters,
    'Moisture Before (%)': h.moistureBefore,
    'Moisture After (%)': h.moistureAfter,
    'Pump Status': h.pump,
    'Valve Status': h.valve,
    'Efficiency (%)': `${h.efficiency}%`,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(irrigationHistoryData), 'Irrigation Events');

  // 15. Water Consumption
  const waterConsumptionData = [
    { 'Metric': "Today's Consumption", 'Value': `${irrigationData.todayWaterLiters} Litres` },
    { 'Metric': 'Weekly Water Consumption', 'Value': `${irrigationData.weeklyWaterLiters} Litres` },
    { 'Metric': 'Monthly Water Consumption', 'Value': `${irrigationData.monthlyWaterLiters} Litres` },
    { 'Metric': 'Water Saved via Smart Drip', 'Value': `${irrigationData.waterSavedLiters} Litres` },
    { 'Metric': 'Water Efficiency Score', 'Value': `${irrigationData.waterEfficiencyPct}%` },
    { 'Metric': 'ET0 (Reference Evapotranspiration)', 'Value': `${irrigationData.etAnalytics.et0} mm/day` },
    { 'Metric': 'ETc (Crop Evapotranspiration)', 'Value': `${irrigationData.etAnalytics.etc} mm/day` },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(waterConsumptionData), 'Water Consumption');

  // 16. Soil Data
  const soilDataTable = [
    { 'Parameter': 'Average Soil Moisture', 'Value': '42%', 'Target': '35–45%', 'Status': 'Optimal' },
    { 'Parameter': 'Soil Temperature', 'Value': '24.8 °C', 'Target': '20–28 °C', 'Status': 'Normal' },
    { 'Parameter': 'Soil pH', 'Value': '7.2', 'Target': '6.5–7.5', 'Status': 'Neutral' },
    { 'Parameter': 'Electrical Conductivity (EC)', 'Value': '0.45 dS/m', 'Target': '< 1.0 dS/m', 'Status': 'Safe Non-saline' },
    { 'Parameter': 'Organic Carbon', 'Value': '0.62%', 'Target': '> 0.75%', 'Status': 'Moderate' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(soilDataTable), 'Soil Data');

  // 17. Weather Data
  const weatherCurrentSheet = [
    { 'Parameter': 'Temperature', 'Value': `${weatherData.current.temp} °C` },
    { 'Parameter': 'Relative Humidity', 'Value': `${weatherData.current.humidity} %` },
    { 'Parameter': 'Rain Probability', 'Value': `${weatherData.current.rainProbability} %` },
    { 'Parameter': 'Expected Precipitation', 'Value': `${weatherData.current.expectedRainMm} mm` },
    { 'Parameter': 'Wind Speed', 'Value': `${weatherData.current.windSpeedKmH} km/h` },
    { 'Parameter': 'Wind Direction', 'Value': weatherData.current.windDirection },
    { 'Parameter': 'Weather Source', 'Value': weatherData.source },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(weatherCurrentSheet), 'Weather Data');

  // 18. IMD Data
  const imdSheet = [
    { 'Metric': `30-Year Rainfall Normal (${farmData.district})`, 'Value': `${weatherData.climatology.thirtyYearMeanRainfallMm} mm` },
    { 'Metric': 'Cumulative Monsoon Rainfall', 'Value': `${weatherData.climatology.cumulativeRainfallMm} mm` },
    { 'Metric': 'Rainfall Anomaly', 'Value': `+${weatherData.climatology.anomalyPct}%` },
    { 'Metric': '90th Percentile Daily Rain', 'Value': `${weatherData.climatology.percentiles.p90} mm` },
    { 'Metric': '95th Percentile Daily Rain', 'Value': `${weatherData.climatology.percentiles.p95} mm` },
    { 'Metric': '99th Percentile Daily Rain', 'Value': `${weatherData.climatology.percentiles.p99} mm` },
    { 'Metric': 'Current Consecutive Dry Spell', 'Value': `${weatherData.climatology.drySpellDays} days` },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(imdSheet), 'IMD Data');

  // 19. Risk Events
  const riskSheetData = riskItemsData.map((r) => ({
    'Risk ID': r.id,
    'Risk Type': r.riskType,
    'Probability (%)': r.probability,
    'Confidence (%)': r.confidence,
    'Trend': r.trend,
    'Affected Field': r.affectedField,
    'Affected Zone': r.affectedZone,
    'Action Required': r.action,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(riskSheetData), 'Risk Events');

  // 20. Robot Missions
  const robotMissionsSheet = [
    { 'Mission ID': 'MISSION-028', 'Robot': 'AGB-02', 'Objective': 'Disease Inspection Field C', 'Field': 'Field C', 'Coverage': '81%', 'Distance (m)': 720, 'Duration': '28 min', 'Status': 'Completed', 'Result': '17 Early Blight detections confirmed' },
    { 'Mission ID': 'MISSION-027', 'Robot': 'AGB-01', 'Objective': 'Perimeter Mapping & SLAM', 'Field': 'Field A', 'Coverage': '68%', 'Distance (m)': 950, 'Duration': '35 min', 'Status': 'In Progress', 'Result': 'Boundary point cloud aligned' },
    { 'Mission ID': 'MISSION-026', 'Robot': 'AGB-02', 'Objective': 'Soil Moisture Verification', 'Field': 'Field B', 'Coverage': '100%', 'Distance (m)': 540, 'Duration': '22 min', 'Status': 'Completed', 'Result': 'Zone B2 verified low at 24%' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(robotMissionsSheet), 'Robot Missions');

  // 21. Robot Telemetry
  const robotTelemetrySheet = agroBotsData.map((bot) => ({
    'Robot ID': bot.id,
    'Robot Name': bot.name,
    'Status': bot.status,
    'Battery (%)': bot.battery,
    'Speed (m/s)': bot.speed,
    'Heading (deg)': bot.heading,
    'GPS Lat': bot.gps.latitude,
    'GPS Lon': bot.gps.longitude,
    'GPS Satellites': bot.gps.satellites,
    'SLAM X': bot.slam.slamX,
    'SLAM Y': bot.slam.slamY,
    'SLAM Confidence (%)': bot.slam.localizationConfidence,
    'Battery Voltage (V)': bot.telemetry.batteryVoltage,
    'Motor RPM': bot.telemetry.motorRpm,
    'Motor Temp (°C)': bot.telemetry.motorTemp,
    'Camera FPS': bot.telemetry.cameraFps,
    'AI Inference FPS': bot.telemetry.inferenceFps,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(robotTelemetrySheet), 'Robot Telemetry');

  // 22. Sensor Readings
  const sensorReadingsSheet = [
    { 'Sensor ID': 'SNS-SM-A1', 'Type': 'Soil Moisture Capacitive', 'Field': 'Field A', 'Zone': 'Zone A1', 'Value': 45, 'Unit': '%', 'Status': 'Normal', 'Quality': '100%' },
    { 'Sensor ID': 'SNS-SM-B2', 'Type': 'Soil Moisture Capacitive', 'Field': 'Field B', 'Zone': 'Zone B2', 'Value': 24, 'Unit': '%', 'Status': 'Warning (Low)', 'Quality': '98%' },
    { 'Sensor ID': 'SNS-SM-C4', 'Type': 'Soil Moisture Capacitive', 'Field': 'Field C', 'Zone': 'Zone C4', 'Value': 42, 'Unit': '%', 'Status': 'Normal', 'Quality': '99%' },
    { 'Sensor ID': 'SNS-FL-01', 'Type': 'Electromagnetic Flow Sensor', 'Field': 'Main Line', 'Zone': 'Pump House', 'Value': 14.2, 'Unit': 'L/min', 'Status': 'Normal', 'Quality': '100%' },
    { 'Sensor ID': 'SNS-NPK-D1', 'Type': 'Optical NPK Spectrometer', 'Field': 'Field D', 'Zone': 'Zone D1', 'Value': 72, 'Unit': 'mg/kg (N)', 'Status': 'Warning (Deficit)', 'Quality': '95%' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sensorReadingsSheet), 'Sensor Readings');

  // 23. Spray Events
  const sprayEventsSheet = [
    { 'Event ID': 'SPRAY-011', 'Date': '18 Sep 2026', 'Field': 'Field C', 'Zone': 'Zone C4', 'Target': 'Early Blight', 'Agent': 'Copper Hydroxide 53.8%', 'Robot': 'AGB-02', 'Liters Sprayed': 4.5, 'Coverage': '18 sq.m', 'Effectiveness': '64.7%' },
    { 'Event ID': 'SPRAY-009', 'Date': '04 Sep 2026', 'Field': 'Field A', 'Zone': 'Zone A2', 'Target': 'Whitefly Suppression', 'Agent': 'Neem Oil Formulation 1500 ppm', 'Robot': 'AGB-01', 'Liters Sprayed': 8.0, 'Coverage': '0.5 acres', 'Effectiveness': '82.0%' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sprayEventsSheet), 'Spray Events');

  // 24. Treatment Effectiveness
  const treatmentEffectivenessSheet = [
    { 'Treatment ID': 'TREATMENT-011', 'Target': 'Early Blight', 'Field': 'Field C', 'Pre-Treatment Count': 17, 'Post-Treatment Count': 6, 'Reduction': 11, 'Effectiveness (%)': '64.7%', 'Status': 'Verified Effective' },
    { 'Treatment ID': 'TREATMENT-008', 'Target': 'Whitefly', 'Field': 'Field A', 'Pre-Treatment Count': 180, 'Post-Treatment Count': 32, 'Reduction': 148, 'Effectiveness (%)': '82.2%', 'Status': 'Controlled' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(treatmentEffectivenessSheet), 'Treatment Effectiveness');

  // 25. Yield Forecast
  const yieldSheet = [
    { 'Crop': 'Tomato', 'Fields': 'Field A & C', 'Area (Acres)': 2.9, 'Expected Yield (t)': 2.2, 'Benchmark (t)': 2.4, 'Confidence (%)': 88, 'Primary Factor': 'Blight suppression' },
    { 'Crop': 'Cotton', 'Fields': 'Field B', 'Area (Acres)': 1.3, 'Expected Yield (t)': 0.8, 'Benchmark (t)': 0.9, 'Confidence (%)': 84, 'Primary Factor': 'Soil moisture management' },
    { 'Crop': 'Wheat', 'Fields': 'Field D', 'Area (Acres)': 1.2, 'Expected Yield (t)': 0.8, 'Benchmark (t)': 0.9, 'Confidence (%)': 86, 'Primary Factor': 'Nitrogen top dressing' },
    { 'Crop': 'Total Farm Forecast', 'Fields': 'All 4 Fields', 'Area (Acres)': 5.4, 'Expected Yield (t)': 3.8, 'Benchmark (t)': 4.2, 'Confidence (%)': 86, 'Primary Factor': `Overall Farm Health ${farmData.farmHealth}/100` },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(yieldSheet), 'Yield Forecast');

  // 26. Farmer Advisories
  const advisorySheetData = advisoryItemsData.map((a) => ({
    'Advisory ID': a.id,
    'Priority': a.priority,
    'Recommendation': a.title,
    'Why': a.why,
    'Confidence (%)': a.confidence,
    'Action': a.action,
    'Expected Outcome': a.expectedOutcome,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(advisorySheetData), 'Farmer Advisories');

  // 27. Govt Schemes
  const schemeSheetData = govtSchemesData.map((s) => ({
    'Scheme ID': s.id,
    'Name': s.name,
    'Category': s.category,
    'Benefit': s.benefit,
    'Eligibility Score (%)': s.eligibilityScore,
    'Eligibility Status': s.eligibilityStatus,
    'Application Status': s.applicationStatus,
    'Deadline': s.deadline,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(schemeSheetData), 'Govt Schemes');

  // 28. Field Passport
  const passportSheetData = fieldPassportEventsData.map((fp) => ({
    'Event ID': fp.id,
    'Date': fp.date,
    'Time': fp.timestamp,
    'Type': fp.type,
    'Title': fp.title,
    'Field ID': fp.fieldId,
    'Zone ID': fp.zoneId || 'All',
    'Robot ID': fp.robotId || 'Manual',
    'Description': fp.description,
    'Metric Change': fp.metricChange || 'N/A',
    'Weather': fp.weatherSnippet || 'N/A',
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(passportSheetData), 'Field Passport');

  // 29. Plant Passport
  const plantPassportSheet = selectedPlantDetails.timeline.map((pt, idx) => ({
    'Step': idx + 1,
    'Date': pt.date,
    'Event': pt.event,
    'Type': pt.type,
    'Details': pt.details,
    'Target Plant': selectedPlantDetails.id,
    'Crop': selectedPlantDetails.cropName,
    'Variety': selectedPlantDetails.variety,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(plantPassportSheet), 'Plant Passport');

  // 30. Farm Timeline
  const timelineSheet = recentActivitiesTimeline.map((item) => ({
    'Timestamp': item.time,
    'Activity': item.title,
    'Category': item.category,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(timelineSheet), 'Farm Timeline');

  // 31. Summary
  const summarySheet = [
    { 'Report Title': 'FarmerOS Precision Agriculture & Robotics Master Report' },
    { 'Report Title': 'Generated on: ' + new Date().toLocaleString() },
    { 'Report Title': 'Data Mode: LIVE / Real-Time Telemetry & IMD Mausam SANKALP' },
    { 'Report Title': `Operator: ${farmerData.name} | ${farmData.name} | ${farmData.totalArea} Acres | ${farmData.location}` },
    { 'Report Title': `Farm Health: ${farmData.farmHealth}/100 | Active Issues: ${farmData.activeIssuesCount.total} | Yield Est: ${farmData.expectedYield.tonnes} tonnes` },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summarySheet), 'Summary');

  // Write and trigger browser download
  XLSX.writeFile(wb, 'FARMEROS_FARM_REPORT.xlsx');
}

/**
 * Export Individual Field Passport as a structured Excel (.xlsx) workbook.
 */
export function exportFieldPassportExcel(field: Field, events?: PassportEvent[]): void {
  const wb = XLSX.utils.book_new();

  const fieldEvents = (events && events.length > 0 ? events : fieldPassportEventsData).filter(
    (e) => !e.fieldId || e.fieldId === field.id || e.fieldId === 'ALL'
  );

  // Sheet 1: Field Digital Twin Passport Overview
  const overviewData = [
    { 'Parameter': 'Field ID', 'Value': field.id },
    { 'Parameter': 'Field Name', 'Value': field.name },
    { 'Parameter': 'Farm Location', 'Value': `${farmData.name}, ${farmData.location}` },
    { 'Parameter': 'Crop', 'Value': field.crop },
    { 'Parameter': 'Variety', 'Value': field.variety },
    { 'Parameter': 'Total Area (Acres)', 'Value': field.area },
    { 'Parameter': 'Plant Population', 'Value': field.plantCount },
    { 'Parameter': 'Health Score', 'Value': `${field.health}%` },
    { 'Parameter': 'Growth Phenology', 'Value': field.growthStage },
    { 'Parameter': 'Crop Age', 'Value': `${field.cropAgeDays} days` },
    { 'Parameter': 'Soil Moisture', 'Value': `${field.soilMoisture}%` },
    { 'Parameter': 'Disease Risk', 'Value': `${field.diseaseRisk}%` },
    { 'Parameter': 'Pest Risk', 'Value': `${field.pestRisk}%` },
    { 'Parameter': 'Weed Coverage', 'Value': `${field.weedCoverage}%` },
    { 'Parameter': 'Water Stress', 'Value': field.waterStress },
    { 'Parameter': 'Nutrient Status', 'Value': field.nutrientStatus },
    { 'Parameter': 'Last AI Scan', 'Value': field.lastAiScan },
    { 'Parameter': 'Expected Harvest', 'Value': field.expectedHarvest },
    { 'Parameter': 'GPS Latitude', 'Value': field.latitude },
    { 'Parameter': 'GPS Longitude', 'Value': field.longitude },
    { 'Parameter': 'Telemetry Status', 'Value': 'LIVE / IMD Mausam SANKALP' },
    { 'Parameter': 'Export Timestamp', 'Value': new Date().toLocaleString() },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(overviewData), 'Passport Overview');

  // Sheet 2: Chronological Ledger Events
  const eventsData = (fieldEvents.length > 0 ? fieldEvents : fieldPassportEventsData).map((evt) => ({
    'Event ID': evt.id,
    'Date': evt.date,
    'Time': evt.timestamp,
    'Type': evt.type,
    'Title': evt.title,
    'Field ID': field.id,
    'Zone ID': evt.zoneId || 'All Zones',
    'Robot / Agent ID': evt.robotId || 'Manual Intervention',
    'Description': evt.description,
    'Metric Change / Delta': evt.metricChange || 'N/A',
    'Effectiveness (%)': evt.effectivenessPct ? `${evt.effectivenessPct}%` : 'N/A',
    'Weather Snapshot': evt.weatherSnippet || 'N/A',
    'Tags': evt.tags?.join(', ') || '',
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(eventsData), 'Chronological Ledger');

  // Sheet 3: Micro-Zones & Sub-Parcels
  if (field.zones && field.zones.length > 0) {
    const zonesData = field.zones.map((z) => ({
      'Zone ID': z.id,
      'Zone Name': z.name,
      'Area (Acres)': z.area,
      'Soil Moisture (%)': z.soilMoisture,
      'Soil Temp (°C)': z.soilTemperature,
      'Nitrogen N (mg/kg)': z.npk.n,
      'Phosphorus P (mg/kg)': z.npk.p,
      'Potassium K (mg/kg)': z.npk.k,
      'Health Score (%)': z.healthScore,
      'Active Issue': z.hasActiveIssue ? z.issueDescription : 'Normal / Healthy',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(zonesData), 'Zones Telemetry');
  }

  const safeFilename = `${field.name.replace(/\s+/g, '_')}_Passport_Ledger.xlsx`;
  XLSX.writeFile(wb, safeFilename);
}

/**
 * Export Individual Field Passport as clean CSV (.csv) format.
 */
export function exportFieldPassportCsv(field: Field, events?: PassportEvent[]): void {
  const fieldEvents = (events && events.length > 0 ? events : fieldPassportEventsData).filter(
    (e) => !e.fieldId || e.fieldId === field.id || e.fieldId === 'ALL'
  );

  const rows = (fieldEvents.length > 0 ? fieldEvents : fieldPassportEventsData).map((evt) => ({
    'Field ID': field.id,
    'Field Name': field.name,
    'Crop': field.crop,
    'Variety': field.variety,
    'Event ID': evt.id,
    'Date': evt.date,
    'Time': evt.timestamp,
    'Type': evt.type,
    'Title': evt.title,
    'Zone ID': evt.zoneId || 'All Zones',
    'Robot / Agent ID': evt.robotId || 'Manual',
    'Description': evt.description,
    'Metric Delta': evt.metricChange || 'N/A',
    'Effectiveness (%)': evt.effectivenessPct ? `${evt.effectivenessPct}%` : 'N/A',
    'Weather Snapshot': evt.weatherSnippet || 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);

  // UTF-8 BOM so Excel opens with proper encoding
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${field.name.replace(/\s+/g, '_')}_Passport_Ledger.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export entire Field & Crop Portfolio Table & Ledgers to Excel (.xlsx).
 */
export function exportAllFieldsPortfolioExcel(fields: Field[], events?: PassportEvent[]): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Portfolio Table
  const portfolioData = fields.map((f) => ({
    'Field ID': f.id,
    'Field Name': f.name,
    'Crop': f.crop,
    'Variety': f.variety,
    'Area (Acres)': f.area,
    'Plant Count': f.plantCount,
    'Health (%)': f.health,
    'Growth Stage': f.growthStage,
    'Crop Age (Days)': f.cropAgeDays,
    'Soil Moisture (%)': f.soilMoisture,
    'Disease Risk (%)': f.diseaseRisk,
    'Pest Risk (%)': f.pestRisk,
    'Weed Coverage (%)': f.weedCoverage,
    'Water Stress': f.waterStress,
    'Nutrient Status': f.nutrientStatus,
    'Last AI Scan': f.lastAiScan,
    'Expected Harvest': f.expectedHarvest,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(portfolioData), 'Portfolio Ledger');

  // Sheet 2: All Field Passport Events
  const allEvents = (events && events.length > 0 ? events : fieldPassportEventsData).map((evt) => ({
    'Event ID': evt.id,
    'Field ID': evt.fieldId,
    'Date': evt.date,
    'Time': evt.timestamp,
    'Type': evt.type,
    'Title': evt.title,
    'Zone ID': evt.zoneId || 'All',
    'Robot ID': evt.robotId || 'Manual',
    'Description': evt.description,
    'Metric Change': evt.metricChange || 'N/A',
    'Effectiveness (%)': evt.effectivenessPct ? `${evt.effectivenessPct}%` : 'N/A',
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(allEvents), 'All Passport Events');

  XLSX.writeFile(wb, 'Field_Crop_Portfolio_Ledger.xlsx');
}

/**
 * Export entire Field & Crop Portfolio Table to clean CSV (.csv).
 */
export function exportAllFieldsPortfolioCsv(fields: Field[]): void {
  const rows = fields.map((f) => ({
    'Field ID': f.id,
    'Field Name': f.name,
    'Crop': f.crop,
    'Variety': f.variety,
    'Area (Acres)': f.area,
    'Plant Count': f.plantCount,
    'Health (%)': f.health,
    'Growth Stage': f.growthStage,
    'Crop Age (Days)': f.cropAgeDays,
    'Soil Moisture (%)': f.soilMoisture,
    'Disease Risk (%)': f.diseaseRisk,
    'Pest Risk (%)': f.pestRisk,
    'Weed Coverage (%)': f.weedCoverage,
    'Water Stress': f.waterStress,
    'Nutrient Status': f.nutrientStatus,
    'Last AI Scan': f.lastAiScan,
    'Expected Harvest': f.expectedHarvest,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Field_Crop_Portfolio_Ledger.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

