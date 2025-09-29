import { useState, useMemo, Fragment } from "react";
import { useAuth } from "../../contexts/authContext";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  BookOpenIcon,
  DocumentArrowDownIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  CheckCircleIcon,
  UserGroupIcon,  
  BuildingOfficeIcon,  
  AcademicCapIcon,  
} from "@heroicons/react/24/outline";

export default function StudentDashboard() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
    { id: "timetable", label: "My Timetable", icon: CalendarDaysIcon },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-semibold">
                NEP Student Portal
              </h1>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {profile?.program || "B.Ed"} - Semester {profile?.semester || "2"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-md border border-slate-300 bg-white hover:border-slate-400 transition">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  2
                </span>
              </button>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium">
                  {profile?.first_name || "Aryan"} {profile?.last_name || "Patel"}
                </div>
                <div className="text-xs text-slate-600">
                  Roll No: {profile?.roll_number || "S20250003"}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:border-slate-400 transition"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 border-r border-slate-200 bg-slate-50 min-h-[calc(100vh-73px)] p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium rounded-lg transition ${
                    activeTab === item.id
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 p-6 lg:p-8">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "timetable" && <TimetableTab />}
        </main>
      </div>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Student Dashboard</h2>
        <p className="mt-2 text-slate-600">
          Your academic overview and daily schedule
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Classes"
          value="4"
          change="Next: 1:00 PM"
          color="indigo"
          icon={CalendarDaysIcon}
        />
        <StatsCard
          title="Enrolled Courses"
          value="6"
          change="All Major courses"
          color="emerald"
          icon={BookOpenIcon}
        />
        <StatsCard
          title="Current Semester"
          value="2"
          change="B.Ed Program"
          color="amber"
          icon={AcademicCapIcon}
        />
  
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TodaySchedulePanel />
        </div>
    
      </div>
    </div>
  );
}

function TimetableTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">My Timetable</h2>
          <p className="text-slate-600">
            View your complete class schedule for B.Ed Semester 2
          </p>
        </div>
        <div className="flex gap-3">
          <select className="rounded-md border border-slate-300 px-4 py-2 text-sm">
            <option>Current Week</option>
            <option>Next Week</option>
            <option>Full Semester</option>
          </select>
          <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
            <DocumentArrowDownIcon className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      <WeeklyTimetablePanel />
    </div>
  );
}

function StatsCard({ title, value, change, color, icon: IconComponent }) {
  const colorMap = {
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl p-6">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">{title}</p>
            <p className="text-3xl font-semibold mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{change}</p>
          </div>
          <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
            <IconComponent className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TodaySchedulePanel() {

  const todayClasses = [
    {
      time: "9:00 AM - 10:00 AM",
      course: "Childhood and Growing Up",
      courseCode: "BED101",
      faculty: "Dr. Priya Sharma",
      room: "Room 204",
      type: "Major",
      status: "completed",
    },
    {
      time: "10:00 AM - 11:00 AM",
      course: "Assessment for Learning",
      courseCode: "BED201",
      faculty: "Dr. Anjali Verma",
      room: "Room 205",
      type: "Major",
      status: "completed",
    },
    {
      time: "11:00 AM - 12:00 PM",
      course: "Curriculum Development",
      courseCode: "BED202",
      faculty: "Dr. Rohan Gupta",
      room: "Lecture Hall 1",
      type: "Major",
      status: "completed",
    },
    {
      time: "1:00 PM - 2:00 PM",
      course: "Gender, School and Society",
      courseCode: "BED301",
      faculty: "Prof. Meena Iyer",
      room: "Seminar Hall A",
      type: "Skill-Based",
      status: "upcoming",
    },
  ];

  const getTypeColor = (type) => {
    const colors = {
      "Major": "border-blue-200 bg-blue-50",
      "Minor": "border-emerald-200 bg-emerald-50",
      "Skill-Based": "border-purple-200 bg-purple-50",
      "Value-Added": "border-amber-200 bg-amber-50"
    };
    return colors[type] || "border-gray-200 bg-gray-50";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl">
      <div className="absolute -inset-1 rounded-2xl  blur-2xl" />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <p className="text-slate-600 text-sm">Monday, September 29, 2025</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-slate-700">{todayClasses.length} Classes</div>
            <div className="text-xs text-slate-500">4 hrs total</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {todayClasses.map((classItem, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                classItem.status === "completed"
                  ? "border-emerald-200"
                  : "border-blue-200 "
              }`}
            >
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  classItem.status === "completed"
                    ? ""
                    : ""
                }`}
              >
                {classItem.status === "completed" ? (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{classItem.course}</div>
                    <div className="flex items-center gap-2 mt-1">
                    
                      <span className={`text-xs px-2 py-1 rounded border ${getTypeColor(classItem.type)} text-slate-700`}>
                        {classItem.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-slate-700">{classItem.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{classItem.faculty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BuildingOfficeIcon className="h-4 w-4" />
                    <span>{classItem.room}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
  
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 font-medium">Next class in 30 minutes</span>
            <span className="text-blue-600">• Gender, School and Society @ Seminar Hall A</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeeklyTimetablePanel() {

  const studentTimetable = {
    "Monday": {
      "09-10": {
        course: "Childhood and Growing Up", 
        courseCode: "BED101",
        faculty: "Dr. Priya Sharma",
        room: "Room 204", 
        type: "Major"
      },
      "10-11": {
        course: "Assessment for Learning", 
        courseCode: "BED201",
        faculty: "Dr. Anjali Verma",
        room: "Room 205", 
        type: "Major"
      },
      "11-12": {
        course: "Curriculum Development", 
        courseCode: "BED202",
        faculty: "Dr. Rohan Gupta",
        room: "Lecture Hall 1", 
        type: "Major"
      },
      "01-02": {
        course: "Gender, School and Society", 
        courseCode: "BED301",
        faculty: "Prof. Meena Iyer",
        room: "Seminar Hall A", 
        type: "Skill-Based"
      }
    },
    "Tuesday": {
      "09-10": {
        course: "Educational Psychology", 
        courseCode: "BED102",
        faculty: "Dr. Sameer Khan",
        room: "Room 102", 
        type: "Major"
      },
           "10-11": {
        course: "Childhood and Growing Up", 
        courseCode: "BED101",
        faculty: "Dr. Priya Sharma",
        room: "Room 204", 
        type: "Major"
      },
           "11-12": {
        course: "Assessment for Learning", 
        courseCode: "BED201",
        faculty: "Dr. Anjali Verma",
        room: "Room 205", 
        type: "Major"
      },
      "02-03": {
        course: "Assessment for Learning", 
        courseCode: "BED201",
        faculty: "Dr. Anjali Verma",
        room: "Room 205", 
        type: "Major"
      },
      "03-04": {
        course: "Professional Communication", 
        courseCode: "FYUP-AEC101",
        faculty: "Prof. Sunita Patil",
        room: "Room 302", 
        type: "Ability Enhancement"
      }
    },
    "Wednesday": {
      "10-11": {
        course: "Curriculum Development", 
        courseCode: "BED202",
        faculty: "Dr. Rohan Gupta",
        room: "Lecture Hall 1", 
        type: "Major"
      },
      "01-02": {
        course: "Childhood and Growing Up", 
        courseCode: "BED101",
        faculty: "Dr. Priya Sharma",
        room: "Room 204", 
        type: "Major"
      },
           "02-03": {
        course: "Educational Psychology", 
        courseCode: "BED102",
        faculty: "Dr. Sameer Khan",
        room: "Room 102", 
        type: "Major"
      }
    },
    "Thursday": {
      "09-10": {
        course: "Educational Psychology", 
        courseCode: "BED102",
        faculty: "Dr. Sameer Khan",
        room: "Room 102", 
        type: "Major"
      },
      "11-12": {
        course: "Gender, School and Society", 
        courseCode: "BED301",
        faculty: "Prof. Meena Iyer",
        room: "Seminar Hall A", 
        type: "Skill-Based"
      },
           "10-11": {
        course: "Professional Communication", 
        courseCode: "FYUP-AEC101",
        faculty: "Prof. Sunita Patil",
        room: "Room 302", 
        type: "Ability Enhancement"
      },
          "01-02": {
        course: "Assessment for Learning", 
        courseCode: "BED201",
        faculty: "Dr. Anjali Verma",
        room: "Room 205", 
        type: "Major"
      },
    },
    "Friday": {
      "10-11": {
        course: "Assessment for Learning", 
        courseCode: "BED201",
        faculty: "Dr. Anjali Verma",
        room: "Room 205", 
        type: "Major"
      },
           "11-12": {
        course: "Gender, School and Society", 
        courseCode: "BED301",
        faculty: "Prof. Meena Iyer",
        room: "Seminar Hall A", 
        type: "Skill-Based"
      },
      "02-03": {
        course: "Professional Communication", 
        courseCode: "FYUP-AEC101",
        faculty: "Prof. Sunita Patil",
        room: "Room 302", 
        type: "Ability Enhancement"
      }
    }
  };

  const timeSlots = [
    { time: "9:00", code: "09-10" },
    { time: "10:00", code: "10-11" },
    { time: "11:00", code: "11-12" },
    { time: "1:00", code: "01-02" },
    { time: "2:00", code: "02-03" },
    { time: "3:00", code: "03-04" }
  ];
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getTypeColor = (type) => {
    const colors = {
      "Major": "border-blue-200 bg-blue-50 text-blue-800",
      "Minor": "border-emerald-200 bg-emerald-50 text-emerald-800",
      "Skill-Based": "border-purple-200 bg-purple-50 text-purple-800",
      "Ability Enhancement": "border-pink-200 bg-pink-50 text-pink-800",
      "Value-Added": "border-amber-200 bg-amber-50 text-amber-800"
    };
    return colors[type] || "border-gray-200 bg-gray-50 text-gray-800";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
 
      <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-slate-700 text-white text-sm">
        <div className="p-3 text-center font-medium border-r border-slate-600">
          <ClockIcon className="h-4 w-4 mx-auto mb-1" />
          <div className="text-xs">Time</div>
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="p-3 text-center font-bold border-r border-slate-600 last:border-r-0"
          >
            <div className="hidden sm:block">{day}</div>
            <div className="sm:hidden">{day.slice(0, 3).toUpperCase()}</div>
          </div>
        ))}
      </div>

    
      <div className="divide-y divide-slate-200">
        {timeSlots.map((slot, rowIndex) => (
          <Fragment key={slot.code}>
            <div className="grid grid-cols-[100px_repeat(5,1fr)] min-h-[80px]">
         
              <div className="bg-slate-50 border-r border-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-slate-700 text-sm">{slot.time}</div>
                  <div className="text-xs text-slate-500">
                    {slot.time === "9:00" || slot.time === "10:00" || slot.time === "11:00" ? "AM" : "PM"}
                  </div>
                </div>
              </div>

         
              {days.map((day) => {
                const classData = studentTimetable[day]?.[slot.code];
                
                return (
                  <div
                    key={`${day}-${slot.code}`}
                    className="border-r border-slate-200 last:border-r-0 p-2"
                  >
                    {classData ? (
                      <div className={`h-full rounded-lg border p-3 ${getTypeColor(classData.type)} shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="font-semibold text-xs mb-2 leading-tight">
                          {classData.course}
                        </div>
                        <div className="text-xs space-y-1">
      
                          <div className="flex items-center gap-1">
                            <UserGroupIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
                            <span className="truncate text-xs">{classData.faculty.split(' ').slice(0, 2).join(' ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BuildingOfficeIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
                            <span className="truncate">{classData.room}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                        <div className="text-center">
                          <div>Free</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

   
            {rowIndex === 2 && (
              <div className="grid grid-cols-[100px_repeat(5,1fr)] min-h-[50px] bg-slate-100 border-b border-slate-300">
                <div className="col-span-6 flex items-center justify-center">
                  <div className="text-slate-600 font-medium text-sm">
                    🍽️ Lunch Break (12:00 - 1:00 PM)
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>

 

    </div>
  );
}



