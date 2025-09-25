import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';


export const exportTimetableToPDFTable = (data, programName, showAllPrograms = false) => {
  try {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    if (showAllPrograms) {
      const programs = [...new Set(data.map(item => item.program_code))].filter(Boolean).sort();
      
      programs.forEach((program, index) => {
        if (index > 0) pdf.addPage('landscape');
        
        const programData = data.filter(item => item.program_code === program);
        generateProgramTableManual(pdf, programData, program);
      });
    } else {
      const programData = data.filter(item => item.program_code === programName);
      generateProgramTableManual(pdf, programData, programName);
    }
    
    const filename = showAllPrograms ? 'All_Programs_Timetable' : `${programName}_Timetable`;
    pdf.save(`${filename}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

function generateProgramTableManual(pdf, programData, programName) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${programName} - Timetable`, 20, 25);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Classes: ${programData.length}`, 20, 35);
  pdf.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - 120, 35);
  
 
  const startX = 20;
  const startY = 50;
  const timeColWidth = 30;
  const dayColWidth = (pageWidth - startX * 2 - timeColWidth) / 5;
  const headerHeight = 12;
  const cellHeight = 30;
  
  const timeSlots = [
    { display: '9:00-10:00', key: '09-10' },
    { display: '10:00-11:00', key: '10-11' },
    { display: '11:00-12:00', key: '11-12' },
    { display: '2:00-3:00', key: '02-03' },
    { display: '3:00-4:00', key: '03-04' }
  ];
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  

  const timetableGrid = {};
  timeSlots.forEach(time => {
    timetableGrid[time.key] = {};
    days.forEach(day => {
      timetableGrid[time.key][day] = null;
    });
  });
  

  programData.forEach(item => {
    if (timetableGrid[item.Time] && timetableGrid[item.Time].hasOwnProperty(item.Day)) {
      timetableGrid[item.Time][item.Day] = {
        course: item.course_name,
        faculty: item.faculty_name,
        room: item.room_name,
        type: item.course_type
      };
    }
  });
  

  pdf.setLineWidth(0.5);
  pdf.setDrawColor(200, 200, 200);
  

  pdf.setFillColor(79, 70, 229); 
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  

  pdf.rect(startX, startY, timeColWidth, headerHeight, 'FD');
  pdf.text('Time', startX + timeColWidth/2, startY + headerHeight/2 + 2, { align: 'center' });
  

  days.forEach((day, index) => {
    const x = startX + timeColWidth + (index * dayColWidth);
    pdf.rect(x, startY, dayColWidth, headerHeight, 'FD');
    pdf.text(day, x + dayColWidth/2, startY + headerHeight/2 + 2, { align: 'center' });
  });
  

  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  
  timeSlots.forEach((timeSlot, rowIndex) => {
    const y = startY + headerHeight + (rowIndex * cellHeight);
    

    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX, y, timeColWidth, cellHeight, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(timeSlot.display, startX + timeColWidth/2, y + cellHeight/2 + 1, { align: 'center' });
    
 
    days.forEach((day, colIndex) => {
      const x = startX + timeColWidth + (colIndex * dayColWidth);
      const cellData = timetableGrid[timeSlot.key][day];
      

      let bgColor = [248, 250, 252]; 
      if (cellData) {
        switch (cellData.type) {
          case 'Major':
            bgColor = [219, 234, 254];
            break;
          case 'Minor':
            bgColor = [220, 252, 231]; 
            break;
          case 'Value-Added':
            bgColor = [255, 237, 213];
            break;
          case 'Skill-Based':
            bgColor = [243, 232, 255]; 
            break;
          case 'Ability Enhancement':
            bgColor = [252, 231, 243];
            break;
        }
      }
      
      pdf.setFillColor(...bgColor);
      pdf.rect(x, y, dayColWidth, cellHeight, 'FD');
      
      if (cellData) {
  
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        const courseName = cellData.course.length > 25 ? 
          cellData.course.substring(0, 22) + '...' : cellData.course;
        pdf.text(courseName, x + 2, y + 6);
        
 
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        const facultyName = cellData.faculty.length > 20 ? 
          cellData.faculty.substring(0, 17) + '...' : cellData.faculty;
        pdf.text(`Prof: ${facultyName}`, x + 2, y + 13);
        
 
        pdf.text(`Room: ${cellData.room}`, x + 2, y + 19);
        
  
        pdf.setFontSize(6);
        pdf.setTextColor(100, 100, 100);
        pdf.text(cellData.type, x + 2, y + 25);
        pdf.setTextColor(0, 0, 0);
      } else {
  
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Free', x + dayColWidth/2, y + cellHeight/2 + 1, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
      }
    });
  });
  

  const legendStartY = startY + headerHeight + (timeSlots.length * cellHeight) + 15;
  
  if (legendStartY + 20 < pageHeight - 20) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Course Types Legend:', startX, legendStartY);
    
    const legendItems = [
      { type: 'Major', color: [219, 234, 254] },
      { type: 'Minor', color: [220, 252, 231] },
      { type: 'Value-Added', color: [255, 237, 213] },
      { type: 'Skill-Based', color: [243, 232, 255] },
      { type: 'Ability Enhancement', color: [252, 231, 243] }
    ];
    
    const legendItemWidth = (pageWidth - startX * 2) / legendItems.length;
    
    legendItems.forEach((item, index) => {
      const x = startX + (index * legendItemWidth);
      const y = legendStartY + 8;
      

      pdf.setFillColor(...item.color);
      pdf.rect(x, y, 8, 6, 'F');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(item.type, x + 10, y + 4);
    });
  }
}

export const exportTimetableToExcelFormatted = (data, programName, showAllPrograms = false) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    if (showAllPrograms) {
      const programs = [...new Set(data.map(item => item.program_code))].filter(Boolean).sort();
      

      createSummarySheet(workbook, data, programs);
      

      programs.forEach(program => {
        const programData = data.filter(item => item.program_code === program);
        createTimetableGridSheet(workbook, programData, program);
      });
      
      XLSX.writeFile(workbook, 'All_Programs_Timetable.xlsx');
      
    } else {
      const programData = data.filter(item => item.program_code === programName);
      createTimetableGridSheet(workbook, programData, programName);
      
      const cleanName = programName.replace(/[\\/:*?[\]]/g, '');
      XLSX.writeFile(workbook, `${cleanName}_Timetable.xlsx`);
    }
    
  } catch (error) {
    console.error('Error generating Excel:', error);
    alert('Error generating Excel file. Please try again.');
  }
};

function createSummarySheet(workbook, data, programs) {
  const summaryData = [
    ['TIMETABLE SUMMARY REPORT'],
    ['Generated on:', new Date().toLocaleString()],
    [''],
    ['Program Code', 'Total Classes', 'Unique Courses', 'Faculty Count', 'Rooms Used'],
    ...programs.map(program => {
      const programData = data.filter(item => item.program_code === program);
      const uniqueCourses = [...new Set(programData.map(item => item.course_name))].length;
      const uniqueFaculty = [...new Set(programData.map(item => item.faculty_name))].length;
      const uniqueRooms = [...new Set(programData.map(item => item.room_name))].length;
      return [program, programData.length, uniqueCourses, uniqueFaculty, uniqueRooms];
    }),
    [''],
    ['TOTALS', 
     data.length, 
     [...new Set(data.map(item => item.course_name))].length,
     [...new Set(data.map(item => item.faculty_name))].length,
     [...new Set(data.map(item => item.room_name))].length
    ]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(summaryData);
  

  ws['!cols'] = [
    { wch: 25 }, 
    { wch: 15 },  
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }  
  ];
  
  XLSX.utils.book_append_sheet(workbook, ws, 'Summary');
}

function createTimetableGridSheet(workbook, programData, programName) {
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '2:00-3:00', '3:00-4:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  

  const headerRow = ['Time Slot', ...days];
  

  const timeMapping = {
    "09-10": 0, "10-11": 1, "11-12": 2, "02-03": 3, "03-04": 4
  };
  
  const dayMapping = {
    "Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3, "Friday": 4
  };
  

  const grid = [headerRow];
  
  timeSlots.forEach((timeSlot, timeIndex) => {
    const row = [timeSlot, '', '', '', '', ''];
    grid.push(row);
  });
  
 
  programData.forEach(item => {
    const timeIndex = timeMapping[item.Time];
    const dayIndex = dayMapping[item.Day];
    
    if (timeIndex !== undefined && dayIndex !== undefined) {
      const cellContent = [
        `📚 ${item.course_name}`,
        `👨‍🏫 ${item.faculty_name}`,
        `🏫 ${item.room_name}`,
        `🏷️ ${item.course_type}`
      ].join('\n');
      
      grid[timeIndex + 1][dayIndex + 1] = cellContent;
    }
  });
  

  for (let i = 1; i < grid.length; i++) {
    for (let j = 1; j < grid[i].length; j++) {
      if (!grid[i][j]) {
        grid[i][j] = 'Free';
      }
    }
  }
  
  const ws = XLSX.utils.aoa_to_sheet(grid);
  
 
  ws['!cols'] = [
    { wch: 15 },
    { wch: 25 }, 
    { wch: 25 },
    { wch: 25 }, 
    { wch: 25 }, 
    { wch: 25 }  
  ];
  
 
  ws['!rows'] = grid.map(() => ({ hpt: 80 }));
  

  const cleanName = programName.replace(/[\\/:*?[\]]/g, '').substring(0, 31);
  XLSX.utils.book_append_sheet(workbook, ws, cleanName);
}