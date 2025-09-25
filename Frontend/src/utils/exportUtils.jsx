import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportVisualTimetableToPDF = async (elementId, filename = 'timetable') => {
  let loadingDiv = null;
  
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('Timetable not found');
      return;
    }

    // Show loading
    loadingDiv = document.createElement('div');
    loadingDiv.id = 'pdf-loading-indicator';
    loadingDiv.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 9999; font-family: Arial;">
        🔄 Generating PDF... Please wait
      </div>
    `;
    document.body.appendChild(loadingDiv);

    // Enhanced color replacement - handle all problematic CSS properties
    const originalStyles = [];
    const allElements = element.querySelectorAll('*');
    
    allElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      const originalStyle = el.style.cssText;
      originalStyles.push({ element: el, originalStyle });
      
      // Handle all CSS color properties that might use oklch
      const colorProperties = [
        'backgroundColor', 'color', 'borderColor', 'borderTopColor', 
        'borderRightColor', 'borderBottomColor', 'borderLeftColor',
        'boxShadow', 'textShadow'
      ];
      
      colorProperties.forEach(property => {
        const value = computedStyle[property];
        if (value && (value.includes('oklch') || value.includes('color(') || value.includes('lab('))) {
          switch(property) {
            case 'backgroundColor':
              el.style.backgroundColor = getSimpleBackgroundColor(el);
              break;
            case 'color':
              el.style.color = getSimpleTextColor(el);
              break;
            case 'borderColor':
            case 'borderTopColor':
            case 'borderRightColor':
            case 'borderBottomColor':
            case 'borderLeftColor':
              el.style[property] = getSimpleBorderColor(el);
              break;
            case 'boxShadow':
              el.style.boxShadow = 'none'; // Remove problematic shadows
              break;
            case 'textShadow':
              el.style.textShadow = 'none'; // Remove problematic text shadows
              break;
          }
        }
      });
      
      // Force override any remaining problematic styles
      if (el.style.background && (el.style.background.includes('oklch') || el.style.background.includes('color('))) {
        el.style.background = getSimpleBackgroundColor(el);
      }
    });

    // Wait a moment for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));

    // Enhanced html2canvas options
    const canvas = await html2canvas(element, {
      scale: 1.2, // Slightly higher quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: true,
      foreignObjectRendering: false, // Disable to avoid some color issues
      ignoreElements: (element) => {
        // Ignore elements that might cause issues
        return element.tagName === 'SCRIPT' || 
               element.tagName === 'NOSCRIPT' ||
               element.id === 'pdf-loading-indicator';
      },
      onclone: (clonedDoc) => {
        // Additional cleanup in the cloned document
        const clonedElements = clonedDoc.querySelectorAll('*');
        clonedElements.forEach(el => {
          // Force simple colors in cloned document
          const computedStyle = window.getComputedStyle(el);
          
          // Override any remaining problematic colors
          if (el.style.color === '' || el.style.color.includes('oklch')) {
            el.style.color = getComputedTextColor(el) || '#000000';
          }
          
          if (el.style.backgroundColor === '' || el.style.backgroundColor.includes('oklch')) {
            el.style.backgroundColor = getComputedBackgroundColor(el) || 'transparent';
          }
          
          if (el.style.borderColor === '' || el.style.borderColor.includes('oklch')) {
            el.style.borderColor = getComputedBorderColor(el) || '#e5e7eb';
          }
          
          // Remove any CSS custom properties that might cause issues
          el.style.removeProperty('--tw-bg-opacity');
          el.style.removeProperty('--tw-text-opacity');
          el.style.removeProperty('--tw-border-opacity');
        });
      }
    });

    // Restore original styles immediately after capture
    originalStyles.forEach(({ element, originalStyle }) => {
      element.style.cssText = originalStyle;
    });

    // Create PDF with better error handling
    const imgData = canvas.toDataURL('image/png', 0.8);
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    
    // Calculate scaling to fit page with margins
    const maxWidth = pdfWidth - (margin * 2);
    const maxHeight = pdfHeight - (margin * 3); // Extra margin for footer
    const imgAspectRatio = canvas.height / canvas.width;
    
    let imgWidth = maxWidth;
    let imgHeight = imgWidth * imgAspectRatio;
    
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = imgHeight / imgAspectRatio;
    }
    
    const x = (pdfWidth - imgWidth) / 2;
    const y = margin;
    
    // Add the image to PDF
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    
    // Add footer with timestamp
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, pdfHeight - 10);
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
    
    // Show success message briefly
    if (loadingDiv) {
      loadingDiv.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: rgba(0,128,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 9999; font-family: Arial;">
          ✅ PDF Generated Successfully!
        </div>
      `;
      setTimeout(() => {
        if (loadingDiv && loadingDiv.parentNode) {
          loadingDiv.parentNode.removeChild(loadingDiv);
        }
      }, 1500);
    }
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    
    // Show detailed error message
    alert(`Error generating PDF: ${error.message}\n\nPlease try:\n1. Refreshing the page\n2. Selecting a different program\n3. Using a different browser`);
    
  } finally {
    // Cleanup loading indicator if still present
    const existingLoader = document.getElementById('pdf-loading-indicator');
    if (existingLoader && existingLoader.parentNode) {
      setTimeout(() => {
        existingLoader.parentNode.removeChild(existingLoader);
      }, 100);
    }
  }
};

// Enhanced helper functions with more color mappings
function getSimpleBackgroundColor(element) {
  // Check for specific Tailwind classes
  const classList = Array.from(element.classList);
  
  for (const className of classList) {
    switch(className) {
      case 'bg-blue-50': return '#eff6ff';
      case 'bg-green-50': return '#f0fdf4';
      case 'bg-orange-50': return '#fff7ed';
      case 'bg-purple-50': return '#faf5ff';
      case 'bg-pink-50': return '#fdf2f8';
      case 'bg-slate-50': return '#f8fafc';
      case 'bg-slate-100': return '#f1f5f9';
      case 'bg-indigo-50': return '#eef2ff';
      case 'bg-indigo-100': return '#e0e7ff';
      case 'bg-indigo-600': return '#4f46e5';
      case 'bg-white': return '#ffffff';
      case 'bg-gray-50': return '#f9fafb';
      case 'bg-red-50': return '#fef2f2';
      case 'bg-yellow-50': return '#fefce8';
    }
  }
  
  // Check parent elements for background colors
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    if (parent.classList.contains('bg-white')) return '#ffffff';
    if (parent.classList.contains('bg-slate-50')) return '#f8fafc';
    parent = parent.parentElement;
  }
  
  return 'transparent';
}

function getSimpleTextColor(element) {
  const classList = Array.from(element.classList);
  
  for (const className of classList) {
    switch(className) {
      case 'text-blue-800': return '#1e40af';
      case 'text-green-800': return '#166534';
      case 'text-orange-800': return '#9a3412';
      case 'text-purple-800': return '#6b21a8';
      case 'text-pink-800': return '#9d174d';
      case 'text-indigo-700': return '#4338ca';
      case 'text-indigo-800': return '#3730a3';
      case 'text-slate-700': return '#334155';
      case 'text-slate-600': return '#475569';
      case 'text-slate-800': return '#1e293b';
      case 'text-white': return '#ffffff';
      case 'text-gray-600': return '#4b5563';
      case 'text-black': return '#000000';
    }
  }
  return '#000000';
}

function getSimpleBorderColor(element) {
  const classList = Array.from(element.classList);
  
  for (const className of classList) {
    switch(className) {
      case 'border-blue-200': return '#bfdbfe';
      case 'border-green-200': return '#bbf7d0';
      case 'border-orange-200': return '#fed7aa';
      case 'border-purple-200': return '#e9d5ff';
      case 'border-pink-200': return '#fecdd3';
      case 'border-slate-200': return '#e2e8f0';
      case 'border-indigo-200': return '#c7d2fe';
      case 'border-indigo-300': return '#a5b4fc';
      case 'border-gray-200': return '#e5e7eb';
    }
  }
  return '#e5e7eb';
}

// Additional helper functions for computed styles
function getComputedTextColor(element) {
  if (element.classList.contains('text-white')) return '#ffffff';
  if (element.classList.contains('text-slate-700')) return '#334155';
  if (element.classList.contains('text-indigo-700')) return '#4338ca';
  return '#000000';
}

function getComputedBackgroundColor(element) {
  if (element.classList.contains('bg-white')) return '#ffffff';
  if (element.classList.contains('bg-indigo-50')) return '#eef2ff';
  if (element.classList.contains('bg-slate-100')) return '#f1f5f9';
  return 'transparent';
}

function getComputedBorderColor(element) {
  if (element.classList.contains('border-slate-200')) return '#e2e8f0';
  if (element.classList.contains('border-indigo-200')) return '#c7d2fe';
  return '#e5e7eb';
}

// Export to Excel (your existing function - keeping it as is)
export const exportToExcel = (data, programName, showAllPrograms = false) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    if (showAllPrograms) {
      const programs = [...new Set(data.map(item => item.program_code))].sort();
      
      programs.forEach(program => {
        const programData = data.filter(item => item.program_code === program);
        
        if (programData.length > 0) {
          const wsData = [
            ['Day', 'Time', 'Course Name', 'Faculty Name', 'Room', 'Course Type', 'Credits'],
            ...programData.map(item => [
              item.Day || '',
              item.Time || '',
              item.course_name || '',
              item.faculty_name || '',
              item.room_name || '',
              item.course_type || '',
              item.credits || ''
            ])
          ];
          
          const worksheet = XLSX.utils.aoa_to_sheet(wsData);
          worksheet['!cols'] = [
            { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 20 }, 
            { wch: 15 }, { wch: 15 }, { wch: 8 }
          ];
          
          const cleanProgramName = program.replace(/[\\/:*?[\]]/g, '').substring(0, 31);
          XLSX.utils.book_append_sheet(workbook, worksheet, cleanProgramName);
        }
      });
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'All_Programs_Timetable.xlsx');
      
    } else {
      const programData = data.filter(item => item.program_code === programName);
      
      if (programData.length === 0) {
        alert('No data found for the selected program');
        return;
      }
      
      const wsData = [
        ['Day', 'Time', 'Course Name', 'Faculty Name', 'Room', 'Course Type', 'Credits'],
        ...programData.map(item => [
          item.Day || '', item.Time || '', item.course_name || '',
          item.faculty_name || '', item.room_name || '', item.course_type || '', item.credits || ''
        ])
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      worksheet['!cols'] = [
        { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 20 }, 
        { wch: 15 }, { wch: 15 }, { wch: 8 }
      ];
      
      const cleanProgramName = programName.replace(/[\\/:*?[\]]/g, '').substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, cleanProgramName);
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${cleanProgramName}_Timetable.xlsx`);
    }
    
  } catch (error) {
    console.error('Error generating Excel:', error);
    alert('Error generating Excel file. Please try again.');
  }
};


// // Export to Excel
// export const exportToExcel = (data, programName, showAllPrograms = false) => {
//   try {
//     const workbook = XLSX.utils.book_new();
    
//     if (showAllPrograms) {
//       // Get all programs
//       const programs = [...new Set(data.map(item => item.program_code))].sort();
      
//       programs.forEach(program => {
//         const programData = data.filter(item => item.program_code === program);
        
//         if (programData.length > 0) {
//           // Create worksheet data
//           const wsData = [
//             ['Day', 'Time', 'Course Name', 'Faculty Name', 'Room', 'Course Type', 'Credits'],
//             ...programData.map(item => [
//               item.Day || '',
//               item.Time || '',
//               item.course_name || '',
//               item.faculty_name || '',
//               item.room_name || '',
//               item.course_type || '',
//               item.credits || ''
//             ])
//           ];
          
//           const worksheet = XLSX.utils.aoa_to_sheet(wsData);
          
//           // Set column widths
//           worksheet['!cols'] = [
//             { wch: 12 }, // Day
//             { wch: 10 }, // Time
//             { wch: 25 }, // Course Name
//             { wch: 20 }, // Faculty
//             { wch: 15 }, // Room
//             { wch: 15 }, // Type
//             { wch: 8 }   // Credits
//           ];
          
     
//           const cleanProgramName = program.replace(/[\\/:*?[\]]/g, '').substring(0, 31);
//           XLSX.utils.book_append_sheet(workbook, worksheet, cleanProgramName);
//         }
//       });
      
//       // Save workbook
//       const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//       const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, 'All_Programs_Timetable.xlsx');
      
//     } else {
//       // Single program
//       const programData = data.filter(item => item.program_code === programName);
      
//       if (programData.length === 0) {
//         alert('No data found for the selected program');
//         return;
//       }
      
//       // Create worksheet data
//       const wsData = [
//         ['Day', 'Time', 'Course Name', 'Faculty Name', 'Room', 'Course Type', 'Credits'],
//         ...programData.map(item => [
//           item.Day || '',
//           item.Time || '',
//           item.course_name || '',
//           item.faculty_name || '',
//           item.room_name || '',
//           item.course_type || '',
//           item.credits || ''
//         ])
//       ];
      
//       const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      
//       // Set column widths
//       worksheet['!cols'] = [
//         { wch: 12 }, // Day
//         { wch: 10 }, // Time
//         { wch: 25 }, // Course Name
//         { wch: 20 }, // Faculty
//         { wch: 15 }, // Room
//         { wch: 15 }, // Type
//         { wch: 8 }   // Credits
//       ];
      
//       const cleanProgramName = programName.replace(/[\\/:*?[\]]/g, '').substring(0, 31);
//       XLSX.utils.book_append_sheet(workbook, worksheet, cleanProgramName);
      
//       // Save workbook
//       const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//       const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, `${cleanProgramName}_Timetable.xlsx`);
//     }
    
//   } catch (error) {
//     console.error('Error generating Excel:', error);
//     alert('Error generating Excel file. Please try again.');
//   }
// };

















