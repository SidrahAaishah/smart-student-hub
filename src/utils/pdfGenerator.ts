import jsPDF from 'jspdf';
import { Activity, Student } from '../types';

export const generatePortfolioPDF = (student: Student, activities: Activity[]) => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(0, 51, 102); // IIIT blue
  pdf.text('IIIT NAGPUR', 20, 20);
  pdf.setFontSize(16);
  pdf.text('Student Portfolio', 20, 30);
  
  // Student Info
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${student.name}`, 20, 50);
  pdf.text(`Roll Number: ${student.rollNumber}`, 20, 60);
  pdf.text(`Department: ${student.department}`, 20, 70);
  pdf.text(`CGPA: ${student.cgpa}`, 20, 80);
  pdf.text(`Attendance: ${student.attendance}%`, 20, 90);
  
  // Activities Section
  pdf.setFontSize(16);
  pdf.text('Activities & Achievements', 20, 110);
  
  let yPos = 130;
  const approvedActivities = activities.filter(a => a.status === 'approved');
  
  approvedActivities.forEach((activity, index) => {
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 51, 102);
    pdf.text(`${index + 1}. ${activity.title}`, 20, yPos);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Category: ${activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}`, 25, yPos + 10);
    pdf.text(`Date: ${new Date(activity.date).toLocaleDateString()}`, 25, yPos + 18);
    
    const descriptionLines = pdf.splitTextToSize(activity.description, 160);
    pdf.text(descriptionLines, 25, yPos + 26);
    
    yPos += 40 + (descriptionLines.length * 4);
  });
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pdf.internal.pageSize.height - 10);
  
  return pdf;
};

export const generateAnalyticsReport = (data: any) => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(0, 51, 102);
  pdf.text('IIIT NAGPUR', 20, 20);
  pdf.setFontSize(16);
  pdf.text('Analytics Report', 20, 30);
  
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Summary Statistics
  pdf.setFontSize(14);
  pdf.text('Summary Statistics', 20, 65);
  
  pdf.setFontSize(11);
  pdf.text(`Total Students: ${data.totalStudents}`, 20, 80);
  pdf.text(`Total Activities: ${data.totalActivities}`, 20, 90);
  pdf.text(`Approved Activities: ${data.approvedActivities}`, 20, 100);
  pdf.text(`Pending Activities: ${data.pendingActivities}`, 20, 110);
  pdf.text(`Average CGPA: ${data.avgCGPA}`, 20, 120);
  
  return pdf;
};