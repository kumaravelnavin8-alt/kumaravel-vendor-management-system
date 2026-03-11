import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Type definition for autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const exportPDF = (title: string, columns: string[], data: any[][], fileName: string) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Header
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  // App Info
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text('Kumaravel LoomFlow - Vendor Management System', 14, 36);
  
  // Table
  doc.autoTable({
    startY: 45,
    head: [columns],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [24, 144, 255] }, // Ant Design primary blue
  });
  
  doc.save(`${fileName}.pdf`);
};

export const generateInvoicePDF = (vendor: any, transactions: any[]) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    doc.setFontSize(22);
    doc.text('INVOICE / STATEMENT', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Vendor: ${vendor.name}`, 14, 40);
    doc.text(`Contact: ${vendor.phone}`, 14, 46);
    doc.text(`GSTIN: ${vendor.gstNumber || 'N/A'}`, 14, 52);
    
    doc.autoTable({
        startY: 60,
        head: [['Date', 'Description', 'Type', 'Amount (INR)']],
        body: transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.description,
            t.transactionType,
            t.amount.toLocaleString()
        ]),
        theme: 'striped'
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Current Outstanding Balance: INR ${vendor.outstandingBalance.toLocaleString()}`, 14, finalY);
    
    doc.save(`Invoice_${vendor.name}_${Date.now()}.pdf`);
};
