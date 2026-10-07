import { jsPDF } from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import { nimbusLogoBase64 } from '../../assets/nimbusLogoBase64.js';

// Explicitly register autoTable plugin to jsPDF prototype
try {
  applyPlugin(jsPDF);
} catch {
  // Ignore if already applied or self-registered
}

export class PdfReportGenerator {
  // Brand color palette - tuned for WCAG contrast & crisp print readability
  static COLORS = {
    primary: [14, 116, 188],       // sky-700
    primaryDark: [3, 73, 124],     // high-contrast deep blue
    primaryLight: [238, 246, 255], // very light tint
    accent: [13, 148, 136],        // teal-600
    accentLight: [204, 251, 241],  // teal-50
    dark: [15, 23, 42],            // slate-900 (sharp, high contrast)
    medium: [71, 85, 105],         // slate-600 (WCAG compliant contrast)
    light: [248, 250, 252],        // slate-50
    white: [255, 255, 255],
    amber: [180, 83, 9],           // amber-700 (darker, readable)
    amberDark: [120, 53, 15],      // amber-900 (crisp text)
    amberLight: [254, 243, 199],   // amber-100
    red: [220, 38, 38],            // red-600
    teal: [15, 118, 110],          // teal-700 (darker readable)
  };

  /**
   * @param {TelemetryExportRequest} exportRequest - Domain entity with export config
   */
  constructor(exportRequest) {
    this.request = exportRequest;
    this.doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 14;
    this.currentY = 0;
  }

  /**
   * Main entry point: composes full report and triggers browser download
   */
  generate() {
    this._renderCoverHeader();
    this._renderMetadataSection();
    this._renderDataTable();
    this._renderSummaryStatistics();
    this._renderRegulatoryFootnote();
    this._applyPageFooters();

    const fileName = this.request.defaultFileName.replace(/\.\w+$/, '.pdf');
    this.doc.save(fileName);
  }

  // ─── Cover Header with Logo & Branding ────────────────────────────

  _renderCoverHeader() {
    const { doc, pageWidth, margin } = this;
    const C = PdfReportGenerator.COLORS;

    // Top gradient band
    doc.setFillColor(...C.primary);
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Subtle accent stripe
    doc.setFillColor(...C.accent);
    doc.rect(0, 28, pageWidth, 1.5, 'F');

    // Logo
    try {
      doc.addImage(nimbusLogoBase64, 'PNG', margin, 3.5, 21, 21);
    } catch {
      // fallback: draw circle placeholder
      doc.setFillColor(...C.white);
      doc.circle(margin + 10.5, 14, 10.5, 'F');
    }

    // Title text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...C.white);
    doc.text('NIMBUS', margin + 25, 11);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(240, 246, 255);
    doc.text('Environmental Intelligence Platform', margin + 25, 17);

    // Report label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...C.white);
    doc.text('LAPORAN EKSPOR DATA TELEMETRI', margin + 25, 24);

    // Right side: timestamp and document ID
    const timestamp = new Date().toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(240, 246, 255);
    doc.text(`Dicetak: ${timestamp}`, pageWidth - margin, 10.5, { align: 'right' });

    const docId = `DOC-${Date.now().toString(36).toUpperCase()}`;
    doc.text(`ID: ${docId}`, pageWidth - margin, 16.5, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.white);
    const formatLabel = this.request.fileFormat?.toUpperCase() || 'PDF';
    doc.text(`FORMAT: PDF + ${formatLabel}`, pageWidth - margin, 24, { align: 'right' });

    this.currentY = 34;
  }

  // ─── Metadata Information Cards ───────────────────────────────────

  _renderMetadataSection() {
    const { doc, margin, pageWidth } = this;
    const C = PdfReportGenerator.COLORS;
    let y = this.currentY;

    // Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...C.dark);
    doc.text('SPESIFIKASI DATASET', margin, y + 5);

    // Thin line
    doc.setDrawColor(...C.primary);
    doc.setLineWidth(0.6);
    doc.line(margin, y + 7.5, margin + 44, y + 7.5);

    y += 12;

    // Info cards layout (2 cards side by side)
    const cardWidth = (pageWidth - margin * 2 - 6) / 2;

    // Card 1: Scope & Target
    this._drawInfoCard(margin, y, cardWidth, 33, [
      { label: 'Target Stasiun', value: this.request.stationLabel },
      { label: 'Resolusi Data', value: this._resolutionLabel() },
      { label: 'Jumlah Sensor', value: `${this.request.targetSensors.length || this.request.sensors.length} unit AWS` }
    ]);

    // Card 2: Date Range & Estimations
    this._drawInfoCard(margin + cardWidth + 6, y, cardWidth, 33, [
      { label: 'Rentang Tanggal', value: `${this.request.startDate}  s/d  ${this.request.endDate}` },
      { label: 'Durasi Observasi', value: `${this.request.daysCount} hari kalender` },
      { label: 'Estimasi Record', value: `~${this.request.estimatedRowsCount.toLocaleString()} baris  ·  ~${this.request.formattedFileSize}` }
    ]);

    y += 37;

    // Selected parameters badge strip
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.dark);
    doc.text('Parameter Terpilih:', margin, y + 4.5);

    const activeVars = this.request.availableVariables.filter(
      v => this.request.selectedParams[v.key]
    );

    let badgeX = margin + 34;
    activeVars.forEach(v => {
      const text = `${v.label} (${v.unit})`;
      const textWidth = doc.getTextWidth(text) + 6;

      // Badge background
      doc.setFillColor(...C.primaryLight);
      doc.roundedRect(badgeX, y, textWidth, 7, 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.primaryDark);
      doc.text(text, badgeX + 3, y + 4.8);

      badgeX += textWidth + 2.5;

      // Wrap to next line if exceeding
      if (badgeX > pageWidth - margin - 10) {
        badgeX = margin + 34;
        y += 8.5;
      }
    });

    this.currentY = y + 13;
  }

  _drawInfoCard(x, y, width, height, items) {
    const { doc } = this;
    const C = PdfReportGenerator.COLORS;

    // Card background
    doc.setFillColor(...C.light);
    doc.setDrawColor(215, 222, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 2, 2, 'FD');

    // Left accent bar
    doc.setFillColor(...C.primary);
    doc.roundedRect(x, y, 2, height, 1, 1, 'F');

    let itemY = y + 7;
    items.forEach((item, idx) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...C.medium);
      doc.text(item.label, x + 6, itemY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...C.dark);
      doc.text(item.value, x + 6, itemY + 4.8);

      itemY += idx < items.length - 1 ? 10.5 : 0;
    });
  }

  _resolutionLabel() {
    const map = {
      raw5m: 'Raw Sampling (Per 5 Menit)',
      hourly: 'Rata-Rata Per Jam (Hourly)',
      daily: 'Ringkasan Harian (Daily)'
    };
    return map[this.request.resolution] || this.request.resolution;
  }

  // ─── Telemetry Data Table ─────────────────────────────────────────

  _renderDataTable() {
    const { doc, margin } = this;
    const C = PdfReportGenerator.COLORS;

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...C.dark);
    doc.text('DATA OBSERVASI TELEMETRI', margin, this.currentY + 3);

    doc.setDrawColor(...C.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, this.currentY + 5.5, margin + 52, this.currentY + 5.5);

    const rows = this.request.generatePreviewRows(20);

    const columns = [
      { header: 'Timestamp', dataKey: 'time' },
      { header: 'Station ID', dataKey: 'id' },
    ];
    if (this.request.selectedParams.air_temp) columns.push({ header: 'Suhu (°C)', dataKey: 'temp' });
    if (this.request.selectedParams.humidity) columns.push({ header: 'RH (%)', dataKey: 'rh' });
    if (this.request.selectedParams.solar_rad) columns.push({ header: 'Solar (W/m²)', dataKey: 'solar' });
    if (this.request.selectedParams.rainfall) columns.push({ header: 'Hujan (mm)', dataKey: 'rain' });
    if (this.request.selectedParams.wind) columns.push({ header: 'Angin (m/s)', dataKey: 'wind' });
    if (this.request.selectedParams.tmat) columns.push({ header: 'TMAT (cm)', dataKey: 'tmat' });
    if (this.request.selectedParams.soil) columns.push({ header: 'Tanah (%)', dataKey: 'soil' });
    if (this.request.selectedParams.battery) columns.push({ header: 'Batt (V)', dataKey: 'volt' });

    const tableConfig = {
      columns,
      body: rows,
      startY: this.currentY + 9,
      margin: { left: margin, right: margin },
      styles: {
        font: 'helvetica',
        fontSize: 7,
        cellPadding: 2.5,
        lineColor: [220, 225, 230],
        lineWidth: 0.2,
        textColor: C.dark,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: C.primary,
        textColor: C.white,
        fontStyle: 'bold',
        fontSize: 7,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 250, 255]
      },
      bodyStyles: {
        halign: 'center'
      },
      columnStyles: {
        time: { halign: 'left', cellWidth: 32 },
        id: { halign: 'left', fontStyle: 'bold', cellWidth: 25 }
      },
      didParseCell: (data) => {
        // Highlight critical TMAT values
        if (data.column.dataKey === 'tmat' && data.section === 'body') {
          const val = parseFloat(data.cell.raw);
          if (!isNaN(val) && val < -40) {
            data.cell.styles.textColor = C.red;
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.raw !== 'N/A') {
            data.cell.styles.textColor = C.teal;
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = C.medium;
          }
        }
      },
      didDrawPage: (data) => {
        // Re-apply header watermark on multi-page overflows
        if (data.pageNumber > 1) {
          this._renderPageWatermark();
        }
      }
    };

    if (typeof doc.autoTable === 'function') {
      doc.autoTable(tableConfig);
    } else if (typeof autoTable === 'function') {
      autoTable(doc, tableConfig);
    }

    const finalY = doc.lastAutoTable?.finalY ?? (this.currentY + 50);
    this.currentY = finalY + 6;
  }

  // ─── Summary Statistics Box ───────────────────────────────────────

  _renderSummaryStatistics() {
    const { doc, margin, pageWidth } = this;
    const C = PdfReportGenerator.COLORS;
    let y = this.currentY;

    // Check page space
    if (y + 30 > this.pageHeight - 20) {
      doc.addPage();
      y = 20;
      this._renderPageWatermark();
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...C.dark);
    doc.text('RINGKASAN STATISTIK', margin, y + 3);

    doc.setDrawColor(...C.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 5.5, margin + 40, y + 5.5);

    y += 10;

    const rows = this.request.generatePreviewRows(20);

    // Compute stats from preview rows
    const temps = rows.map(r => parseFloat(r.temp)).filter(v => !isNaN(v));
    const rhs = rows.map(r => parseFloat(r.rh)).filter(v => !isNaN(v));
    const rains = rows.map(r => parseFloat(r.rain)).filter(v => !isNaN(v));
    const tmats = rows.map(r => parseFloat(r.tmat)).filter(v => !isNaN(v));

    const stats = [
      {
        label: 'Suhu Udara',
        min: temps.length ? `${Math.min(...temps).toFixed(1)} °C` : '-',
        max: temps.length ? `${Math.max(...temps).toFixed(1)} °C` : '-',
        avg: temps.length ? `${(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)} °C` : '-',
        color: C.primary
      },
      {
        label: 'Kelembaban',
        min: rhs.length ? `${Math.min(...rhs)} %` : '-',
        max: rhs.length ? `${Math.max(...rhs)} %` : '-',
        avg: rhs.length ? `${(rhs.reduce((a, b) => a + b, 0) / rhs.length).toFixed(0)} %` : '-',
        color: C.teal
      },
      {
        label: 'Curah Hujan',
        min: rains.length ? `${Math.min(...rains).toFixed(1)} mm` : '-',
        max: rains.length ? `${Math.max(...rains).toFixed(1)} mm` : '-',
        avg: rains.length ? `${(rains.reduce((a, b) => a + b, 0) / rains.length).toFixed(1)} mm` : '-',
        color: C.accent
      },
      {
        label: 'TMAT',
        min: tmats.length ? `${Math.min(...tmats).toFixed(1)} cm` : '-',
        max: tmats.length ? `${Math.max(...tmats).toFixed(1)} cm` : '-',
        avg: tmats.length ? `${(tmats.reduce((a, b) => a + b, 0) / tmats.length).toFixed(1)} cm` : '-',
        color: C.amber
      }
    ];

    // Draw stat cards
    const cardW = (pageWidth - margin * 2 - 9) / 4;
    stats.forEach((stat, i) => {
      const cx = margin + i * (cardW + 3);

      // Card bg
      doc.setFillColor(...C.white);
      doc.setDrawColor(215, 222, 230);
      doc.setLineWidth(0.3);
      doc.roundedRect(cx, y, cardW, 23, 2, 2, 'FD');

      // Top accent
      doc.setFillColor(...stat.color);
      doc.rect(cx + 3, y, cardW - 6, 1.2, 'F');

      // Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...stat.color);
      doc.text(stat.label, cx + cardW / 2, y + 5.5, { align: 'center' });

      // Values
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.medium);
      doc.text(`Min: ${stat.min}`, cx + 4, y + 12);
      doc.text(`Max: ${stat.max}`, cx + 4, y + 17);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...C.dark);
      doc.text(`Avg: ${stat.avg}`, cx + cardW - 4, y + 17, { align: 'right' });
    });

    this.currentY = y + 29;
  }

  // ─── Regulatory Footnote ──────────────────────────────────────────

  _renderRegulatoryFootnote() {
    const { doc, margin } = this;
    const C = PdfReportGenerator.COLORS;
    let y = this.currentY + 2;

    if (y + 10 > this.pageHeight - 20) {
      doc.addPage();
      y = 15;
      this._renderPageWatermark();
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.medium);
    doc.text(
      '* Data telemetri mencakup observasi kedalaman air tanah gambut (TMAT) sesuai standar BMKG & SIMATAG KLHK.',
      margin, y + 4
    );

    this.currentY = y + 8;
  }

  // ─── Page Watermark (for extra pages) ─────────────────────────────

  _renderPageWatermark() {
    const { doc, pageWidth, margin } = this;
    const C = PdfReportGenerator.COLORS;

    // Thin top brand bar
    doc.setFillColor(...C.primary);
    doc.rect(0, 0, pageWidth, 4, 'F');

    doc.setFillColor(...C.accent);
    doc.rect(0, 4, pageWidth, 0.8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...C.white);
    doc.text('NIMBUS Environmental Intelligence Platform', margin, 3);
  }

  // ─── Page Footers (applied after all content) ─────────────────────

  _applyPageFooters() {
    const { doc, pageWidth, pageHeight, margin } = this;
    const C = PdfReportGenerator.COLORS;
    const totalPages = doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Bottom bar
      doc.setFillColor(...C.dark);
      doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

      // Accent line on top of footer
      doc.setFillColor(...C.primary);
      doc.rect(0, pageHeight - 8, pageWidth, 0.6, 'F');

      // Left: platform name
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(180, 190, 200);
      doc.text(
        'Nimbus Environmental Intelligence Platform  ·  Laporan Telemetri Otomatis',
        margin, pageHeight - 3
      );

      // Right: page number
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.white);
      doc.text(
        `Halaman ${i} dari ${totalPages}`,
        pageWidth - margin, pageHeight - 3,
        { align: 'right' }
      );
    }
  }
}

export default PdfReportGenerator;
