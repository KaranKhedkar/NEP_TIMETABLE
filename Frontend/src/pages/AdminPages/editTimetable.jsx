import { Fragment, useMemo, useState } from "react";
import {
  ChevronDownIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  PencilSquareIcon,
  CheckIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

const EditableTimetable = ({ data, onSave }) => {
  const [timetableData, setTimetableData] = useState(data || []);
  const [draggedItem, setDraggedItem] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const availablePrograms = useMemo(() => {
    if (!timetableData || timetableData.length === 0) return [];
    const programs = [...new Set(timetableData.map((item) => item.program_code))].filter(Boolean);
    return programs.sort();
  }, [timetableData]);

  useMemo(() => {
    if (availablePrograms.length > 0 && !selectedProgram) {
      setSelectedProgram(availablePrograms[0]);
    }
  }, [availablePrograms, selectedProgram]);

  const { processedData, timeSlots, days } = useMemo(() => {
    if (!timetableData || timetableData.length === 0 || !selectedProgram)
      return { processedData: [], timeSlots: [], days: [] };

    const programSchedule = timetableData.filter(
      (item) => item.program_code === selectedProgram
    );

    const timeMapping = {
      "09-10": { display: "9:00", index: 0 },
      "10-11": { display: "10:00", index: 1 },
      "11-12": { display: "11:00", index: 2 },
      "02-03": { display: "2:00", index: 3 },
      "03-04": { display: "3:00", index: 4 },
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
      .map((item, idx) => ({
        id: `${item.program_code}-${item.Day}-${item.Time}-${idx}`,
        d: dayMapping[item.Day].index,
        t: timeMapping[item.Time].index,
        courseName: item.course_name,
        faculty: item.faculty_name,
        room: item.room_name,
        color: getColorByType(item.course_type),
        courseType: item.course_type,
        originalData: item,
      }));

    return {
      processedData: processedChips,
      timeSlots: Object.values(timeMapping)
        .sort((a, b) => a.index - b.index)
        .map((t) => t.display),
      days: Object.values(dayMapping).sort((a, b) => a.index - b.index),
    };
  }, [timetableData, selectedProgram]);

  function getColorByType(type) {
    const colors = {
      Major: "bg-blue-50 border-blue-300 text-blue-800",
      Minor: "bg-emerald-50 border-emerald-300 text-emerald-800",
      "Value-Added": "bg-amber-50 border-amber-300 text-amber-800",
      "Skill-Based": "bg-purple-50 border-purple-300 text-purple-800",
      "Ability Enhancement": "bg-pink-50 border-pink-300 text-pink-800",
    };
    return colors[type] || "bg-gray-50 border-gray-300 text-gray-800";
  }

  const getTimeKey = (timeIndex) => {
    const mapping = ["09-10", "10-11", "11-12", "02-03", "03-04"];
    return mapping[timeIndex];
  };

  const getDayKey = (dayIndex) => {
    const mapping = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return mapping[dayIndex];
  };

  const handleDragStart = (e, classItem) => {
    setDraggedItem(classItem);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dayIndex, timeIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    const existingClass = processedData.find(
      (c) => c.d === dayIndex && c.t === timeIndex
    );

    if (existingClass && existingClass.id !== draggedItem.id) {
      alert("This slot is already occupied!");
      setDraggedItem(null);
      return;
    }

    const updatedTimetable = timetableData.map((item) => {
      if (
        item.program_code === draggedItem.originalData.program_code &&
        item.Day === draggedItem.originalData.Day &&
        item.Time === draggedItem.originalData.Time &&
        item.course_name === draggedItem.originalData.course_name
      ) {
        return {
          ...item,
          Day: getDayKey(dayIndex),
          Time: getTimeKey(timeIndex),
        };
      }
      return item;
    });

    setTimetableData(updatedTimetable);
    setHasChanges(true);
    setDraggedItem(null);
  };

  const handleDeleteClass = (classItem) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    const updatedTimetable = timetableData.filter(
      (item) =>
        !(
          item.program_code === classItem.originalData.program_code &&
          item.Day === classItem.originalData.Day &&
          item.Time === classItem.originalData.Time &&
          item.course_name === classItem.originalData.course_name
        )
    );

    setTimetableData(updatedTimetable);
    setHasChanges(true);
  };

  const handleEditClass = (classItem) => {
    setEditingCell({
      ...classItem,
      editCourseName: classItem.courseName,
      editFaculty: classItem.faculty,
      editRoom: classItem.room,
    });
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const updatedTimetable = timetableData.map((item) => {
      if (
        item.program_code === editingCell.originalData.program_code &&
        item.Day === editingCell.originalData.Day &&
        item.Time === editingCell.originalData.Time &&
        item.course_name === editingCell.originalData.course_name
      ) {
        return {
          ...item,
          course_name: editingCell.editCourseName,
          faculty_name: editingCell.editFaculty,
          room_name: editingCell.editRoom,
        };
      }
      return item;
    });

    setTimetableData(updatedTimetable);
    setHasChanges(true);
    setEditingCell(null);
  };

  const handleSaveChanges = async () => {
    if (onSave) {
      await onSave(timetableData);
      setHasChanges(false);
      alert("Changes saved successfully!");
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all changes?")) {
      setTimetableData(data);
      setHasChanges(false);
    }
  };

  if (!availablePrograms.length) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg">
        <div className="text-slate-600 font-medium">No timetable data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
  
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">✏️ Edit Timetable</h2>
          <p className="text-slate-600 mt-1">Drag and drop classes to reschedule</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {hasChanges && (
            <>
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm"
              >
                <CheckIcon className="h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all font-medium text-sm"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Reset
              </button>
            </>
          )}

          <div className="relative">
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

   
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-slate-600 mr-2">Quick Select:</span>
        {availablePrograms.map((program) => (
          <button
            key={program}
            onClick={() => setSelectedProgram(program)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedProgram === program
                ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {program}
          </button>
        ))}
      </div>

   
      {selectedProgram && (
        <div className="bg-white rounded-lg p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-indigo-700">
              📚 {selectedProgram}
            </h3>
            <span className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-600 font-medium">
              {processedData.length} classes
            </span>
          </div>

       
          <div className="mb-4 bg-white rounded-lg p-3 border shadow-sm">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-medium text-slate-700">Types:</span>
              {Object.entries({
                Major: "bg-blue-50 border-blue-300 text-blue-800",
                Minor: "bg-emerald-50 border-emerald-300 text-emerald-800",
                "Value-Added": "bg-amber-50 border-amber-300 text-amber-800",
                "Skill-Based": "bg-purple-50 border-purple-300 text-purple-800",
                "Ability Enhancement": "bg-pink-50 border-pink-300 text-pink-800",
              }).map(([type, colorClass]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded border ${colorClass}`}></div>
                  <span className="text-xs">{type}</span>
                </div>
              ))}
            </div>
          </div>

        
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
       
            <div className="grid grid-cols-[80px_repeat(5,1fr)] bg-slate-700 text-white text-sm">
              <div className="p-2 text-center font-medium border-r border-slate-600">
                <ClockIcon className="h-4 w-4 mx-auto" />
              </div>
              {days.map((day) => (
                <div
                  key={day.short}
                  className="p-2 text-center font-bold border-r border-slate-600 last:border-r-0"
                >
                  {day.short}
                </div>
              ))}
            </div>

       
            <div>
              {timeSlots.map((time, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[100px] border-b border-slate-200 last:border-b-0"
                >
                  {/* Time Slot */}
                  <div className="bg-slate-50 border-r border-slate-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-bold text-slate-700 text-sm">{time}</div>
                    </div>
                  </div>

                  {/* Day Cells */}
                  {days.map((day, colIndex) => {
                    const classInSlot = processedData.find(
                      (c) => c.d === colIndex && c.t === rowIndex
                    );

                    return (
                      <div
                        key={colIndex}
                        className="border-r border-slate-200 last:border-r-0 p-2 hover:bg-slate-50 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, colIndex, rowIndex)}
                      >
                        {classInSlot ? (
                          editingCell && editingCell.id === classInSlot.id ? (
                            // Edit Mode
                            <div className={`h-full rounded-md border p-2 ${classInSlot.color}`}>
                              <input
                                type="text"
                                value={editingCell.editCourseName}
                                onChange={(e) =>
                                  setEditingCell({ ...editingCell, editCourseName: e.target.value })
                                }
                                className="w-full mb-1 px-1 py-0.5 text-xs border rounded"
                                placeholder="Course Name"
                              />
                              <input
                                type="text"
                                value={editingCell.editFaculty}
                                onChange={(e) =>
                                  setEditingCell({ ...editingCell, editFaculty: e.target.value })
                                }
                                className="w-full mb-1 px-1 py-0.5 text-xs border rounded"
                                placeholder="Faculty"
                              />
                              <input
                                type="text"
                                value={editingCell.editRoom}
                                onChange={(e) =>
                                  setEditingCell({ ...editingCell, editRoom: e.target.value })
                                }
                                className="w-full mb-2 px-1 py-0.5 text-xs border rounded"
                                placeholder="Room"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={handleSaveEdit}
                                  className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingCell(null)}
                                  className="flex-1 bg-slate-400 text-white px-2 py-1 rounded text-xs hover:bg-slate-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                          
                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, classInSlot)}
                              className={`h-full rounded-md border p-2 ${classInSlot.color} shadow-sm hover:shadow-md transition-all cursor-move relative group`}
                            >
                              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditClass(classInSlot)}
                                  className="bg-white rounded p-1 hover:bg-slate-100"
                                  title="Edit"
                                >
                                  <PencilSquareIcon className="h-3 w-3 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClass(classInSlot)}
                                  className="bg-white rounded p-1 hover:bg-slate-100"
                                  title="Delete"
                                >
                                  <XMarkIcon className="h-3 w-3 text-red-600" />
                                </button>
                              </div>
                              <div className="font-semibold text-xs mb-1 leading-tight pr-12">
                                {classInSlot.courseName}
                              </div>
                              <div className="text-xs space-y-1">
                                <div className="flex items-center gap-1">
                                  <UserGroupIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
                                  <span className="truncate">{classInSlot.faculty}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BuildingOfficeIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
                                  <span className="truncate">{classInSlot.room}</span>
                                </div>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-md">
                            Drop here
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableTimetable;