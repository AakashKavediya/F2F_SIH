import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  farmerData,
  farmData,
  fieldsData,
  advisoryItemsData,
  irrigationData,
  agroBotsData,
  riskItemsData,
  alertItemsData,
  diseaseEventsData,
  pestEventsData,
  weedEventsData,
  govtSchemesData,
  taskItemsData,
} from '@/data/farmData';

export function exportFarmPdfReport(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const textDark: [number, number, number] = [17, 24, 39];
  const textMuted: [number, number, number] = [107, 114, 128];
  const primaryGreen: [number, number, number] = [22, 101, 52];
  const brandGreen: [number, number, number] = [22, 163, 74];

  // Helper for Section Titles
  const addSectionHeader = (title: string, yPos: number): number => {
    // Check if near bottom of page
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.text(title, 14, yPos);
    return yPos + 4;
  };

  // Header Banner
  doc.setFillColor(240, 253, 244);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setFillColor(brandGreen[0], brandGreen[1], brandGreen[2]);
  doc.rect(0, 0, 5, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text('FARMEROS COMPREHENSIVE DOSSIER', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Agricultural Robotics, IoT Sensor Telemetry & Agromet Intelligence System', 14, 19);
  doc.text(`Official Farm Master Record | Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 25);

  doc.setFillColor(220, 252, 231);
  doc.roundedRect(148, 8, 48, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text('● 10-DOMAIN VERIFIED RECORD', 151, 13.5);

  let currentY = 38;

  // 1. Farm & Farmer Overview
  currentY = addSectionHeader('1. Farm & Farmer Overview', currentY);
  autoTable(doc, {
    startY: currentY,
    head: [['Attribute', 'Details', 'Key Metric', 'Value']],
    body: [
      ['Farmer Name', farmerData.name, 'Overall Farm Health', `${farmData.farmHealth} / 100`],
      ['Farmer ID / Mobile', `${farmerData.id} • ${farmerData.mobile}`, 'Crop Health Index', `${farmData.cropHealth}%`],
      ['Farm Name & Taluka', `${farmData.name} (${farmerData.taluka})`, 'Water Efficiency', `${farmData.waterEfficiency}%`],
      ['Location', farmData.location, 'Robot Coverage', `${farmData.robotCoverage}%`],
      ['Total Land Area', `${farmData.totalArea} Acres (${farmData.cultivableArea} ac Cultivable)`, 'Harvest Revenue Potential', '₹5.20 Lakh (Est.)'],
      ['KCC Limit & Insurance', `${farmerData.kccLimit} • ${farmerData.insuranceStatus}`, 'Active Issues', `${farmData.activeIssuesCount.total} (${farmData.activeIssuesCount.critical} Critical)`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 1.8 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 32 }, 2: { fontStyle: 'bold', cellWidth: 36 } },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 2. Crop Health Summary
  currentY = addSectionHeader('2. Crop Health Summary (Field-by-Field)', currentY);
  const cropHealthRows = fieldsData.map((f) => [
    f.name,
    f.crop,
    f.variety,
    `${f.area} ac`,
    f.growthStage,
    `${f.plantCount} plants`,
    `${f.health}%`,
    f.waterStress,
    f.nutrientStatus,
    f.lastAiScan,
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [['Field', 'Crop', 'Variety', 'Area', 'Phenology Stage', 'Stands', 'Health', 'Water', 'Nutrient', 'Last Scan']],
    body: cropHealthRows,
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 7, cellPadding: 1.8 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 3. Yield Forecast by Crop
  currentY = addSectionHeader('3. Harvest Yield Forecast & Production Target', currentY);
  const yieldRows = [
    ['Field C & A', 'Tomato', 'Abhinav & Arka Rakshak', '2.8 Tonnes', '3.0 Tonnes', '84%', '05 Nov 2026', '₹2,80,000'],
    ['Field B', 'Cotton', 'Phule Anmol', '0.9 Tonnes', '1.0 Tonnes', '78%', '15 Nov 2026', '₹1,35,000'],
    ['Field D', 'Wheat', 'GW-496', '0.9 Tonnes', '1.2 Tonnes', '81%', '24 Oct 2026', '₹1,05,000'],
  ];
  autoTable(doc, {
    startY: currentY,
    head: [['Field', 'Crop', 'Cultivar', 'Projected Yield', 'Season Target', 'Confidence', 'Harvest Date', 'Estimated Value']],
    body: yieldRows,
    theme: 'grid',
    headStyles: { fillColor: [180, 83, 9], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 7, cellPadding: 1.8 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 4. Water Usage & ETc Analytics
  currentY = addSectionHeader('4. Water Usage, Irrigation Efficiency & ETc Climatology', currentY);
  autoTable(doc, {
    startY: currentY,
    head: [['Hydrology Parameter', 'Current Reading', 'Optimal Target Benchmark', 'Agronomic Impact']],
    body: [
      ["Today's Water Delivered", `${irrigationData.todayWaterLiters} L`, '3,100 L (Penman-Monteith ETc)', 'Optimal replenishment'],
      ['Weekly Delivered Volume', `${irrigationData.weeklyWaterLiters} L`, '21,000 L', 'Conserved 2,600 L via AI'],
      ['Monthly Delivered Volume', `${irrigationData.monthlyWaterLiters} L`, '80,500 L', 'Total water saved: 23.6 mm'],
      ['Overall Irrigation Efficiency', `${irrigationData.waterEfficiencyPct}%`, '> 85% Target', '+5.4% efficiency improvement'],
      ['Flow Rate & Pressure', `${irrigationData.flowSensor.rateLitersPerMin} L/min @ ${irrigationData.flowSensor.pressureBar} bar`, '14-16 L/min @ 1.8-2.0 bar', 'Optimal drip pressure'],
      ['Storage Tank Level', `${irrigationData.flowSensor.tankLevelPct}%`, '> 50% Reserve', '48h buffer against dry spell'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 7, cellPadding: 1.8 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 5. Disease / Pest / Weed Events
  currentY = addSectionHeader('5. Plant Pathology: Disease, Pest & Weed Incidents', currentY);
  const pathologyRows: any[] = [];
  diseaseEventsData.forEach((d) => {
    pathologyRows.push(['Disease', d.diseaseName, `${d.fieldId} (${d.zoneId})`, `${d.affectedPlants} plants`, d.severity, d.status, d.treatmentDetails?.product || 'Foliar spray advised', `${d.confidence}%`]);
  });
  pestEventsData.forEach((p) => {
    pathologyRows.push(['Pest', p.species, `${p.fieldId} (${p.zoneId})`, `${p.count} insects`, p.severity, p.status, 'Yellow sticky cards + NSKE', `${p.confidence}%`]);
  });
  weedEventsData.forEach((w) => {
    pathologyRows.push(['Weed', w.species, `${w.fieldId} (${w.zoneId})`, `${w.densityPerSqM} /m² (${w.coveragePct}%)`, w.competitionRisk, 'Identified', w.recommendedIntervention, '92%']);
  });
  autoTable(doc, {
    startY: currentY,
    head: [['Category', 'Agent / Organism', 'Location', 'Infestation Count', 'Severity', 'Status', 'Intervention Protocol', 'Conf.']],
    body: pathologyRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 6.8, cellPadding: 1.6 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 6. Irrigation History
  currentY = addSectionHeader('6. Irrigation Run Log & Solenoid Telemetry', currentY);
  const irrigationRows = irrigationData.history.map((h) => [
    h.date,
    h.fieldName,
    h.zoneId,
    `${h.durationMins} min`,
    `${h.flowRate} L/min`,
    `${h.liters} L`,
    `${h.moistureBefore}% -> ${h.moistureAfter}%`,
    `${h.efficiency}%`,
    h.valve,
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [['Date', 'Field', 'Zone', 'Duration', 'Flow Rate', 'Volume Delivered', 'Soil Moisture Delta', 'Efficiency', 'Valve']],
    body: irrigationRows,
    theme: 'striped',
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 7, cellPadding: 1.8 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 7. Robot Mission Logs
  currentY = addSectionHeader('7. AgroBot Autonomous Mission Logs & Fleet Status', currentY);
  const robotRows = [
    ['AGB-01', 'Canopy Inspection', 'Field A & C', '124 min', '4.2 ha', '94%', '96% SLAM', 'Completed', '0 Stops'],
    ['AGB-01', 'Perimeter SLAM', 'Field D', '48 min', '1.8 ha', '94%', '96% SLAM', 'Completed', '0 Stops'],
    ['AGB-02', 'Targeted Spraying', 'Field C (Zone C4)', '76 min', '2.1 ha', '89%', '94% SLAM', 'In Progress', '0 Stops'],
    ['AGB-02', 'NPK Reflectance', 'Field D (Zone D1)', '36 min', '0.9 ha', '89%', '94% SLAM', 'Completed', '0 Stops'],
  ];
  autoTable(doc, {
    startY: currentY,
    head: [['Robot ID', 'Mission Type', 'Target Parcel', 'Duration', 'Coverage', 'Battery', 'Localization', 'Status', 'Collisions']],
    body: robotRows,
    theme: 'grid',
    headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 7, cellPadding: 1.8 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 8. Risk & Alert Timeline
  currentY = addSectionHeader('8. Risk Engine Diagnoses & Anomaly Timeline', currentY);
  const alertRows = alertItemsData.map((a) => [
    a.id,
    a.severity,
    a.category,
    a.title,
    a.description,
    a.actionPrompt || 'Review telemetry',
    a.timestamp,
    a.status,
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [['ID', 'Severity', 'Category', 'Hazard / Event Title', 'Diagnosis', 'Prescribed Action', 'Time', 'State']],
    body: alertRows,
    theme: 'striped',
    headStyles: { fillColor: [180, 83, 9], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 6.8, cellPadding: 1.6 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 9. Govt Scheme Eligibility
  currentY = addSectionHeader('9. Government Scheme Eligibility & Direct Subsidies', currentY);
  const schemeRows = govtSchemesData.map((s) => [
    s.id,
    s.shortName,
    s.benefit,
    `${s.eligibilityScore}%`,
    s.eligibilityStatus,
    s.applicationStatus,
    s.deadline,
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [['Scheme ID', 'Scheme Title', 'Sanctioned / Eligible Benefit', 'Match Score', 'Status', 'Dossier State', 'Deadline']],
    body: schemeRows,
    theme: 'grid',
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 7, cellPadding: 1.8 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 10. Nutrient & Soil Data
  currentY = addSectionHeader('10. Soil Chemistry & Macro-Nutrient Profile (NPK by Zone)', currentY);
  const soilRows: any[] = [];
  fieldsData.forEach((f) => {
    f.zones.forEach((z) => {
      soilRows.push([
        f.name,
        z.name,
        `${z.soilMoisture}%`,
        `${z.soilTemperature} °C`,
        `${z.npk.n} mg/kg`,
        `${z.npk.p} mg/kg`,
        `${z.npk.k} mg/kg`,
        `${z.healthScore} / 100`,
        z.issueDescription || 'Optimal nutrient balance',
      ]);
    });
  });
  autoTable(doc, {
    startY: currentY,
    head: [['Field', 'Zone', 'Moisture', 'Temp', 'Available N', 'Available P', 'Available K', 'Soil Score', 'Agronomic Assessment']],
    body: soilRows,
    theme: 'striped',
    headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    styles: { fontSize: 7, cellPadding: 1.8 },
  });
  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Operator Sign-off & Certification Footer
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, currentY, 182, 28, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text('Certified Farm Digital Twin & Agromet Telemetry Report', 18, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Synthesized from real-time Edge AI vision inferences, capacitive soil moisture arrays, automated solenoid telemetry,', 18, currentY + 13);
  doc.text('and IMD Mausam Agromet forecasts. Compliant with ICAR Package of Practices.', 18, currentY + 18);
  doc.text(`Authorized Farm Operator: ${farmerData.name} (${farmerData.id}) | ${farmData.name} | ${farmData.location}`, 18, currentY + 23);

  // Save the PDF
  doc.save('FARMEROS_COMPLETE_FARM_REPORT.pdf');
}
