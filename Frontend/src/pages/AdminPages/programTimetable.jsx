

// ProgramTimetable.jsx
import { Fragment, useMemo, useState } from "react";
import {
  ChevronDownIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  exportVisualTimetableToPDF,
  exportToExcel,
} from "../../utils/exportUtils";

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
      "02-03": { display: "2:00", index: 3 },
      "03-04": { display: "3:00", index: 4 },
    };

    const dayMapping = {
      Monday: { short: "Mon", index: 0 },
      Tuesday: { short: "Tue", index: 1 },
      Wednesday: { short: "Wed", index: 2 },
      Thursday: { short: "Thu", index: 3 },
      Friday: { short: "Fri", index: 4 },
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
      }));

    return {
      processedData: processedChips,
      timeSlots: Object.values(timeMapping)
        .sort((a, b) => a.index - b.index)
        .map((t) => t.display),
      days: Object.values(dayMapping)
        .sort((a, b) => a.index - b.index)
        .map((d) => d.short),
    };
  }, [data, programToDisplay]);

  function getColorByType(type) {
    const colors = {
      Major: "bg-blue-50 border-blue-200 text-blue-800",
      Minor: "bg-green-50 border-green-200 text-green-800",
      "Value-Added": "bg-orange-50 border-orange-200 text-orange-800",
      "Skill-Based": "bg-purple-50 border-purple-200 text-purple-800",
      "Ability Enhancement": "bg-pink-50 border-pink-200 text-pink-800",
    };
    return colors[type] || "bg-gray-50 border-gray-200 text-gray-800";
  }

  if (!processedData.length) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-500">
          No classes scheduled for {programToDisplay}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-indigo-700">
          📚 {programToDisplay}
        </h3>
        <span className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-600 font-medium">
          {processedData.length} classes
        </span>
      </div>

      <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 mb-2">
        <div></div>
        {days.map((day) => (
          <div
            key={day}
            className="text-center py-3 font-semibold text-slate-700 bg-slate-100 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
        {timeSlots.map((time, rowIndex) => (
          <Fragment key={rowIndex}>
            <div className="flex items-center justify-center py-4 font-medium text-slate-600 bg-indigo-50 rounded-lg">
              {time}
            </div>

            {days.map((_, colIndex) => {
              const classInSlot = processedData.find(
                (c) => c.d === colIndex && c.t === rowIndex
              );

              return (
                <div
                  key={colIndex}
                  className="min-h-[80px] bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition-colors"
                >
                  {classInSlot ? (
                    <div
                      className={`h-full rounded-md border p-3 ${classInSlot.color} shadow-sm`}
                    >
                      <div className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">
                        {classInSlot.courseName}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="truncate">👨‍🏫 {classInSlot.faculty}</div>
                        <div className="truncate">🏫 {classInSlot.room}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      Free
                    </div>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
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

  useMemo(() => {
    if (availablePrograms.length > 0 && !selectedProgram) {
      setSelectedProgram(availablePrograms[0]);
      setShowAllPrograms(false);
    }
  }, [availablePrograms, selectedProgram]);

  if (!availablePrograms.length) {
    return (
      <div className="mt-8 text-center py-12">
        <div className="text-slate-500">No timetable data available</div>
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
    exportVisualTimetableToPDF("timetable-container", filename);
  };

  const handleDownloadExcel = () => {
    if (showAllPrograms) {
      exportToExcel(data, null, true);
    } else if (selectedProgram) {
      exportToExcel(data, selectedProgram, false);
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
            {/* ADD THESE DOWNLOAD BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={!data.length}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
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

            {/* Your existing buttons */}
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

      {/* ADD THE ID HERE FOR PDF CAPTURE */}
      <div
        id="timetable-container"
        className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6"
      >
        {showAllPrograms ? (
          <div>
            <div className="mb-6 text-center">
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
          <SingleProgramTimetable
            data={data}
            programToDisplay={selectedProgram}
          />
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
