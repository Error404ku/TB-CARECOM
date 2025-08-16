// utils/exportHelpers.ts
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getPatients, getDailyMonitoring } from '../api/perawatApi';
import { getAllDailyMonitoringAdmin } from '../api/adminApi';
import { getAllDailyMonitoring } from '../api/pmoApi';
import type { Patient, DailyMonitoring } from '../api/perawatApi';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

// Format date for export
const formatDateForExport = (dateString: string | null) => {
  if (!dateString) return 'Tidak diketahui';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format gender
const formatGender = (gender: string) => {
  return gender === 'L' ? 'Laki-laki' : 'Perempuan';
};

// Format patient status
const formatPatientStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'aktif': 'Aktif',
    'tidak_aktif': 'Tidak Aktif',
    'sembuh': 'Sembuh',
    'pindah': 'Pindah'
  };
  return statusMap[status] || status;
};

// Export patients to Excel
export const exportPatientsToExcel = async () => {
  try {
    // Fetch all patients with high pagination
    const response = await getPatients({ per_page: 1000000 });
    const patients = response.data.data;

    // Prepare data for Excel
    const excelData = patients.map((patient: Patient, index: number) => ({
      'No': index + 1,
      'Nama Pasien': patient.name,
      'Alamat': patient.address,
      'Jenis Kelamin': formatGender(patient.gender),
      'No. Telepon': patient.no_telp,
      'Status': formatPatientStatus(patient.status),
      'Mulai Pengobatan': formatDateForExport(patient.start_treatment_date),
      'Dibuat': formatDateForExport(patient.created_at),
      'Diperbarui': formatDateForExport(patient.updated_at)
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 },  // No
      { wch: 25 }, // Nama Pasien
      { wch: 30 }, // Alamat
      { wch: 15 }, // Jenis Kelamin
      { wch: 15 }, // No. Telepon
      { wch: 15 }, // Status
      { wch: 20 }, // Mulai Pengobatan
      { wch: 20 }, // Dibuat
      { wch: 20 }  // Diperbarui
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Pasien');
    
    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Daftar_Pasien_${currentDate}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Error exporting patients to Excel:', error);
    return false;
  }
};

// Export patients to PDF
export const exportPatientsToPDF = async () => {
  try {
    // Fetch all patients with high pagination
    const response = await getPatients({ per_page: 1000000 });
    const patients = response.data.data;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Daftar Pasien TB', 14, 15);
    
    // Add current date
    doc.setFontSize(10);
    doc.text(`Dicetak: ${formatDateForExport(new Date().toISOString())}`, 14, 25);

    // Prepare table data
    const tableData = patients.map((patient: Patient, index: number) => [
      index + 1,
      patient.name,
      patient.address,
      formatGender(patient.gender),
      patient.no_telp,
      formatPatientStatus(patient.status),
      formatDateForExport(patient.start_treatment_date)
    ]);

    // Add table using autoTable function directly
    autoTable(doc, {
      startY: 35,
      head: [['No', 'Nama Pasien', 'Alamat', 'Jenis Kelamin', 'No. Telepon', 'Status', 'Mulai Pengobatan']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      columnStyles: {
        0: { cellWidth: 10 },  // No
        1: { cellWidth: 30 },  // Nama Pasien
        2: { cellWidth: 40 },  // Alamat
        3: { cellWidth: 25 },  // Jenis Kelamin
        4: { cellWidth: 25 },  // No. Telepon
        5: { cellWidth: 25 },  // Status
        6: { cellWidth: 30 }   // Mulai Pengobatan
      }
    });

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Daftar_Pasien_${currentDate}.pdf`;
    
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting patients to PDF:', error);
    return false;
  }
};

// Export daily monitoring to Excel
export const exportDailyMonitoringToExcel = async (patientId: number, patientName?: string, filters?: any) => {
  try {
    // Fetch daily monitoring data with current filters
    const exportParams = {
      ...filters,
      per_page: filters?.per_page === -1 ? 1000000 : (filters?.per_page || 1000000)
    };
    const response = await getDailyMonitoring(patientId, exportParams);
    const monitoringData = response.data.data;

    // Prepare data for Excel
    const excelData = monitoringData.map((monitoring: DailyMonitoring, index: number) => ({
      'No': index + 1,
      'Nama Pasien': monitoring.patient?.name || patientName || 'Tidak diketahui',
      'Waktu Minum Obat': monitoring.medication_time || 'Tidak diketahui',
      'Deskripsi': monitoring.description || 'Tidak ada deskripsi',
      'Tanggal Dibuat': formatDateForExport(monitoring.created_at),
      'Terakhir Diperbarui': formatDateForExport(monitoring.updated_at)
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 },  // No
      { wch: 25 }, // Nama Pasien
      { wch: 20 }, // Waktu Minum Obat
      { wch: 40 }, // Deskripsi
      { wch: 20 }, // Tanggal Dibuat
      { wch: 20 }  // Terakhir Diperbarui
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Daily Monitoring');
    
    // Generate filename with current date and patient info
    const currentDate = new Date().toISOString().split('T')[0];
    const filterInfo = filters ? `_Filtered` : '';
    const filename = `Daily_Monitoring_${patientName || `Pasien_${patientId}`}${filterInfo}_${currentDate}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Error exporting daily monitoring to Excel:', error);
    return false;
  }
};

// Export daily monitoring to PDF
export const exportDailyMonitoringToPDF = async (patientId: number, patientName?: string, filters?: any) => {
  try {
    // Fetch daily monitoring data with current filters
    const exportParams = {
      ...filters,
      per_page: filters?.per_page === -1 ? 1000000 : (filters?.per_page || 1000000)
    };
    const response = await getDailyMonitoring(patientId, exportParams);
    const monitoringData = response.data.data;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Daily Monitoring Pasien TB', 14, 15);
    
    // Add patient info
    doc.setFontSize(12);
    doc.text(`Pasien: ${patientName || `ID ${patientId}`}`, 14, 25);
    
    // Add current date and filter info
    doc.setFontSize(10);
    doc.text(`Dicetak: ${formatDateForExport(new Date().toISOString())}`, 14, 35);
    
    // Add filter information if filters are applied
    if (filters && (filters.search || filters.start_date || filters.end_date)) {
      let filterText = 'Filter: ';
      if (filters.search) filterText += `Pencarian: "${filters.search}" `;
      if (filters.start_date) filterText += `Dari: ${filters.start_date} `;
      if (filters.end_date) filterText += `Sampai: ${filters.end_date} `;
      doc.text(filterText, 14, 42);
    }

    // Prepare table data
    const tableData = monitoringData.map((monitoring: DailyMonitoring, index: number) => [
      index + 1,
      monitoring.medication_time || 'Tidak diketahui',
      monitoring.description || 'Tidak ada deskripsi',
      formatDateForExport(monitoring.created_at)
    ]);

    // Add table using autoTable function directly
    const startY = filters && (filters.search || filters.start_date || filters.end_date) ? 52 : 45;
    autoTable(doc, {
      startY: startY,
      head: [['No', 'Waktu Minum Obat', 'Deskripsi', 'Tanggal']],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 139, 202] },
      columnStyles: {
        0: { cellWidth: 15 },  // No
        1: { cellWidth: 35 },  // Waktu Minum Obat
        2: { cellWidth: 80 },  // Deskripsi
        3: { cellWidth: 35 }   // Tanggal
      }
    });

    // Generate filename with current date and patient info
    const currentDate = new Date().toISOString().split('T')[0];
    const filterInfo = filters ? `_Filtered` : '';
    const filename = `Daily_Monitoring_${patientName || `Pasien_${patientId}`}${filterInfo}_${currentDate}.pdf`;
    
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting daily monitoring to PDF:', error);
    return false;
  }
};

// Export admin monitoring to Excel
export const exportAdminMonitoringToExcel = async () => {
  try {
    // Fetch all monitoring data with high pagination
    const response = await getAllDailyMonitoringAdmin({ per_page: 1000000 });
    const monitoringData = response.data.data;

    // Prepare data for Excel
    const excelData = monitoringData.map((monitoring: any, index: number) => ({
      'No': index + 1,
      'Nama Pasien': monitoring.patient?.name || 'Tidak diketahui',
      'Waktu Minum Obat': monitoring.medication_time || 'Tidak diketahui',
      'Deskripsi': monitoring.description || 'Tidak ada deskripsi',
      'Tanggal Dibuat': formatDateForExport(monitoring.created_at),
      'Terakhir Diperbarui': formatDateForExport(monitoring.updated_at)
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 },  // No
      { wch: 25 }, // Nama Pasien
      { wch: 20 }, // Waktu Minum Obat
      { wch: 40 }, // Deskripsi
      { wch: 20 }, // Tanggal Dibuat
      { wch: 20 }  // Terakhir Diperbarui
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Monitoring Admin');
    
    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Monitoring_Admin_${currentDate}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Error exporting admin monitoring to Excel:', error);
    return false;
  }
};

// Export admin monitoring to PDF
export const exportAdminMonitoringToPDF = async () => {
  try {
    // Fetch all monitoring data with high pagination
    const response = await getAllDailyMonitoringAdmin({ per_page: 1000000 });
    const monitoringData = response.data.data;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Monitoring Admin TB CareCom', 14, 15);
    
    // Add current date
    doc.setFontSize(10);
    doc.text(`Dicetak: ${formatDateForExport(new Date().toISOString())}`, 14, 25);

    // Prepare table data
    const tableData = monitoringData.map((monitoring: any, index: number) => [
      index + 1,
      monitoring.patient?.name || 'Tidak diketahui',
      monitoring.medication_time || 'Tidak diketahui',
      monitoring.description || 'Tidak ada deskripsi',
      formatDateForExport(monitoring.created_at)
    ]);

    // Add table using autoTable function directly
    autoTable(doc, {
      startY: 35,
      head: [['No', 'Nama Pasien', 'Waktu Minum Obat', 'Deskripsi', 'Tanggal']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      columnStyles: {
        0: { cellWidth: 10 },  // No
        1: { cellWidth: 35 },  // Nama Pasien
        2: { cellWidth: 35 },  // Waktu Minum Obat
        3: { cellWidth: 60 },  // Deskripsi
        4: { cellWidth: 25 }   // Tanggal
      }
    });

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Monitoring_Admin_${currentDate}.pdf`;
    
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting admin monitoring to PDF:', error);
    return false;
  }
};

// Export PMO monitoring to Excel
export const exportPMOMonitoringToExcel = async () => {
  try {
    // Fetch all monitoring data with high pagination
    const response = await getAllDailyMonitoring({ per_page: 1000000 });
    const monitoringData = response.data.data;

    // Prepare data for Excel
    const excelData = monitoringData.map((monitoring: any, index: number) => ({
      'No': index + 1,
      'Waktu Minum Obat': monitoring.medication_time || 'Tidak diketahui',
      'Deskripsi': monitoring.description || 'Tidak ada deskripsi',
      'Tanggal Dibuat': formatDateForExport(monitoring.created_at),
      'Terakhir Diperbarui': formatDateForExport(monitoring.updated_at)
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 },  // No
      { wch: 20 }, // Waktu Minum Obat
      { wch: 40 }, // Deskripsi
      { wch: 20 }, // Tanggal Dibuat
      { wch: 20 }  // Terakhir Diperbarui
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Monitoring PMO');
    
    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Monitoring_PMO_${currentDate}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Error exporting PMO monitoring to Excel:', error);
    return false;
  }
};

// Export PMO monitoring to PDF
export const exportPMOMonitoringToPDF = async () => {
  try {
    // Fetch all monitoring data with high pagination
    const response = await getAllDailyMonitoring({ per_page: 1000000 });
    const monitoringData = response.data.data;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Monitoring PMO TB CareCom', 14, 15);
    
    // Add current date
    doc.setFontSize(10);
    doc.text(`Dicetak: ${formatDateForExport(new Date().toISOString())}`, 14, 25);

    // Prepare table data
    const tableData = monitoringData.map((monitoring: any, index: number) => [
      index + 1,
      monitoring.medication_time || 'Tidak diketahui',
      monitoring.description || 'Tidak ada deskripsi',
      formatDateForExport(monitoring.created_at)
    ]);

    // Add table using autoTable function directly
    autoTable(doc, {
      startY: 35,
      head: [['No', 'Waktu Minum Obat', 'Deskripsi', 'Tanggal']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      columnStyles: {
        0: { cellWidth: 10 },  // No
        1: { cellWidth: 35 },  // Waktu Minum Obat
        2: { cellWidth: 80 },  // Deskripsi
        3: { cellWidth: 25 }   // Tanggal
      }
    });

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Monitoring_PMO_${currentDate}.pdf`;
    
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting PMO monitoring to PDF:', error);
    return false;
  }
}; 