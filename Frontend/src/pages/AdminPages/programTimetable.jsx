import { Fragment, useMemo, useState } from "react";
import {
  ChevronDownIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import {
  exportVisualTimetableToPDF,
  exportToExcel,
} from "../../utils/exportUtils";

import{
  exportTimetableToPDFTable,
  exportTimetableToExcelFormatted
} from "../../utils/pdfGenerator";

const SingleProgramTimetable = ({ data, programToDisplay }) => {
  const { processedData, timeSlots, days } = useMemo(() => {
    if (!data || data.length === 0)
      return { processedData: [], timeSlots: [], days: [] };

    const programSchedule = data.filter(
      (item) => item.program_code === programToDisplay
    );

    const timeMapping = {
      "09-10": { display: "9:00", index: 0 },
      "10-11": { display: "10:00", index: 1 },
      "11-12": { display: "11:00", index: 2 },
      "01-02": { display: "1:00", index: 3 }, 
      "02-03": { display: "2:00", index: 4 }, 
      "03-04": { display: "3:00", index: 5 }, 
    };

    const dayMapping = {
      Monday: { short: "MON", full: "Monday", index: 0 },
      Tuesday: { short: "TUE", full: "Tuesday", index: 1 },
      Wednesday: { short: "WED", full: "Wednesday", index: 2 },
      Thursday: { short: "THU", full: "Thursday", index: 3 },
      Friday: { short: "FRI", full: "Friday", index: 4 },
    };

    const processedChips = programSchedule
      .filter((item) => timeMapping[item.Time] && dayMapping[item.Day])
      .map((item) => ({
        d: dayMapping[item.Day].index,
        t: timeMapping[item.Time].index,
        span: 1,
        courseName: item.course_name,
        faculty: item.faculty_name,
        room: item.room_name,
        color: getColorByType(item.course_type),
        courseType: item.course_type,
      }));

    return {
      processedData: processedChips,
      timeSlots: Object.values(timeMapping)
        .sort((a, b) => a.index - b.index)
        .map((t) => t.display),
      days: Object.values(dayMapping)
        .sort((a, b) => a.index - b.index),
    };
  }, [data, programToDisplay]);

  function getColorByType(type) {
    const colors = {
      Major: "bg-blue-50 border-blue-300 text-blue-800",
      Minor: "bg-emerald-50 border-emerald-300 text-emerald-800",
      "Value-Added": "bg-amber-50 border-amber-300 text-amber-800",
      "Skill-Based": "bg-purple-50 border-purple-300 text-purple-800",
      "Ability Enhancement": "bg-pink-50 border-pink-300 text-pink-800",
      "Internship": "bg-red-50 border-red-300 text-red-800", 
    };
    return colors[type] || "bg-gray-50 border-gray-300 text-gray-800";
  }

  if (!processedData.length) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg">
        <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <div className="text-slate-600 font-medium">
          No classes scheduled for {programToDisplay}
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-timetable-section">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-indigo-700 pdf-program-title">
          📚 {programToDisplay}
        </h3>
        <span className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-600 font-medium pdf-class-count">
          {processedData.length} classes
        </span>
      </div>

      <div className="mb-3 bg-white rounded-lg p-3 border shadow-sm pdf-legend">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium text-slate-700">Types:</span>
          {Object.entries({
            Major: "bg-blue-50 border-blue-300 text-blue-800",
            Minor: "bg-emerald-50 border-emerald-300 text-emerald-800",
            "Value-Added": "bg-amber-50 border-amber-300 text-amber-800",
            "Skill-Based": "bg-purple-50 border-purple-300 text-purple-800",
            "Ability Enhancement": "bg-pink-50 border-pink-300 text-pink-800",
            "Internship": "bg-red-50 border-red-300 text-red-800", // Added internship
          }).map(([type, colorClass]) => (
            <div key={type} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded border ${colorClass}`}></div>
              <span className="text-xs">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pdf-timetable-grid bg-white rounded-lg shadow-md border overflow-hidden">
    
        <div className="grid grid-cols-[80px_repeat(5,1fr)] bg-slate-700 text-white text-sm">
          <div className="p-2 text-center font-medium border-r border-slate-600">
            <ClockIcon className="h-4 w-4 mx-auto" />
          </div>
          {days.map((day) => (
            <div
              key={day.short}
              className="p-2 text-center font-bold border-r border-slate-600 last:border-r-0 pdf-day-header"
            >
              {day.short}
            </div>
          ))}
        </div>

<div className="pdf-grid-content">
  {timeSlots.map((time, rowIndex) => (
    <Fragment key={rowIndex}>
      
      <div className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[80px] border-b border-slate-200">
   
        <div className="bg-slate-50 border-r border-slate-200 flex items-center justify-center pdf-time-slot">
          <div className="text-center">
            <div className="font-bold text-slate-700 text-sm">{time}</div>
          </div>
        </div>

   
        {days.map((day, colIndex) => {
          const classInSlot = processedData.find(
            (c) => c.d === colIndex && c.t === rowIndex
          );

          return (
            <div
              key={colIndex}
              className="border-r border-slate-200 last:border-r-0 p-2 hover:bg-slate-50 transition-colors pdf-cell"
            >
              {classInSlot ? (
                <div
                  className={`h-full rounded-md border p-2 ${classInSlot.color} shadow-sm hover:shadow-md transition-shadow pdf-class-card`}
                >
                  <div className="font-semibold text-xs mb-1 leading-tight pdf-course-name">
                    {classInSlot.courseName.length > 20 
                      ? classInSlot.courseName.substring(0, 18) + '...'
                      : classInSlot.courseName}
                  </div>
                  <div className="text-xs space-y-1 pdf-class-details">
                    <div className="flex items-center gap-1 pdf-faculty">
                      <UserGroupIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
                      <span className="truncate">
                        {classInSlot.faculty.length > 15 
                          ? classInSlot.faculty.substring(0, 13) + '..'
                          : classInSlot.faculty}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pdf-room">
                      <BuildingOfficeIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
                      <span className="truncate">{classInSlot.room}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs pdf-free-slot">
                  Free
                </div>
              )}
            </div>
          );
        })}
      </div>


      {rowIndex === 2 && (
        <div className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[50px] bg-slate-100 border-b border-slate-300">
          <div className="col-span-6 flex items-center justify-center">
            <div className="text-slate-600 font-medium text-sm">
               Lunch Break (12:00 - 1:00 PM)
            </div>
          </div>
        </div>
      )}
    </Fragment>
  ))}
</div>

      </div>
    </div>
  );
};

const ProgramTimetable = ({ data }) => {
  const availablePrograms = useMemo(() => {
    if (!data || data.length === 0) return [];
    const programs = [...new Set(data.map((item) => item.program_code))].filter(
      Boolean
    );
    return programs.sort();
  }, [data]);

  const [selectedProgram, setSelectedProgram] = useState("");
  const [showAllPrograms, setShowAllPrograms] = useState(true);
  const [exportMethod, setExportMethod] = useState("visual");

  useMemo(() => {
    if (availablePrograms.length > 0 && !selectedProgram) {
      setSelectedProgram(availablePrograms[0]);
      setShowAllPrograms(false);
    }
  }, [availablePrograms, selectedProgram]);

  if (!availablePrograms.length) {
    return (
      <div className="mt-8 text-center py-12">
        <CalendarIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <div className="text-slate-500 font-medium">No timetable data available</div>
      </div>
    );
  }

  const handleProgramChange = (program) => {
    if (program === "all") {
      setShowAllPrograms(true);
      setSelectedProgram("");
    } else {
      setShowAllPrograms(false);
      setSelectedProgram(program);
    }
  };

  const handleDownloadPDF = () => {
    const filename = showAllPrograms
      ? "All_Programs_Timetable"
      : `${selectedProgram}_Timetable`;
    
    if (exportMethod === "visual") {
      exportVisualTimetableToPDF("timetable-container", filename);
    } else {
      exportTimetableToPDFTable(data, selectedProgram, showAllPrograms);
    }
  };

  const handleDownloadExcel = () => {
    if (exportMethod === "visual") {
      if (showAllPrograms) {
        exportToExcel(data, null, true);
      } else if (selectedProgram) {
        exportToExcel(data, selectedProgram, false);
      }
    } else {
      exportTimetableToExcelFormatted(data, selectedProgram, showAllPrograms);
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              📋 Timetable Viewer
            </h2>
            <p className="text-slate-600 mt-1">
              Select a program to view its timetable
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setExportMethod("visual")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  exportMethod === "visual"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Visual PDF
              </button>
              <button
                onClick={() => setExportMethod("table")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  exportMethod === "table"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Table PDF
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={!data.length}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
                title={exportMethod === "visual" ? "Download Visual PDF" : "Download Table PDF"}
              >
                <DocumentTextIcon className="h-4 w-4" />
                Download PDF
              </button>

              <button
                onClick={handleDownloadExcel}
                disabled={!data.length}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Download Excel
              </button>
            </div>

            <button
              onClick={() => handleProgramChange("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showAllPrograms
                  ? "bg-slate-600 text-white shadow-lg"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              View All Programs
            </button>

            <div className="relative">
              <select
                value={selectedProgram}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Program</option>
                {availablePrograms.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-slate-600 mr-2">Quick Select:</span>
          {availablePrograms.map((program) => (
            <button
              key={program}
              onClick={() => handleProgramChange(program)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedProgram === program && !showAllPrograms
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {program}
            </button>
          ))}
        </div>
      </div>

      <div
        id="timetable-container"
        className="rounded-2xl bg-white p-6 pdf-container"
      >
        {showAllPrograms ? (
          <div>
            <div className="mb-6 text-center pdf-header">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                All Programs Overview
              </h3>
              <p className="text-slate-600">
                Showing timetables for all {availablePrograms.length} programs
              </p>
            </div>
            {availablePrograms.map((program) => (
              <div key={program} className="mb-12 last:mb-0">
                <SingleProgramTimetable
                  data={data}
                  programToDisplay={program}
                />
              </div>
            ))}
          </div>
        ) : selectedProgram ? (
          <div>
            <div className="mb-4 text-center pdf-header"></div>
            <SingleProgramTimetable
              data={data}
              programToDisplay={selectedProgram}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-500">
              Please select a program to view its timetable
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramTimetable;
