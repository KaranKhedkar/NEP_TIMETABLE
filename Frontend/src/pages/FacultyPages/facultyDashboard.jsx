import { useState, useMemo, Fragment } from "react";
import { useAuth } from "../../contexts/authContext";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentArrowUpIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  UserIcon,
  ArrowPathIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function FacultyDashboard() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
    { id: "timetable", label: "My Timetable", icon: CalendarDaysIcon },
    { id: "requests", label: "Request Changes", icon: ArrowPathIcon },
  
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
                NEP Faculty Portal
              </h1>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {profile?.role || "Faculty"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-md border border-slate-300 bg-white hover:border-slate-400 transition">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div className="text-xs text-slate-600">{profile?.email}</div>
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
          {activeTab === "requests" && <RequestsTab />}
          
        </main>
      </div>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Faculty Dashboard</h2>
        <p className="mt-2 text-slate-600">
          Your teaching schedule and workload overview
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Weekly Hours"
          value="24"
          change="3 hrs today"
          color="indigo"
          icon={ClockIcon}
        />
        <StatsCard
          title="Active Courses"
          value="6"
          change="2 new this sem"
          color="emerald"
          icon={BookOpenIcon}
        />
        <StatsCard
          title="Classes Today"
          value="4"
          change="Next: 2:00 PM"
          color="amber"
          icon={CalendarDaysIcon}
        />
        <StatsCard
          title="Pending Requests"
          value="2"
          change="1 urgent"
          color="rose"
          icon={ExclamationTriangleIcon}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TodaySchedulePanel />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
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
            View your complete teaching schedule and room assignments
          </p>
        </div>
        <div className="flex gap-3">
          <select className="rounded-md border border-slate-300 px-4 py-2 text-sm">
            <option>Current Week</option>
            <option>Next Week</option>
            <option>Full Semester</option>
          </select>
          <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-800 hover:border-slate-400 transition">
            <DocumentArrowUpIcon className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <WeeklyTimetablePanel />
    </div>
  );
}

function RequestsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Request Changes</h2>
          <p className="text-slate-600">
            Submit requests for class swaps, conflict resolution, or leave
          </p>
        </div>
        <button className="flex items-center gap-2 w-full sm:w-auto rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
          <PlusIcon className="h-4 w-4" />
          New Request
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RequestFormsPanel />
        </div>
      </div>
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
      course: "Educational Psychology",
      courseCode: "BED102",
      room: "Room 204",
      students: "B.Ed Sem 1",
      status: "completed",
      type: "Major"
    },
    {
      time: "11:00 AM - 12:00 PM",
      course: "Research Methodology",
      courseCode: "MED202",
      room: "Physics Lab 2",
      students: "M.Ed Sem 1",
      status: "completed",
      type: "Major"
    },
    {
      time: "2:00 PM - 3:00 PM",
      course: "Curriculum Development",
      courseCode: "BED202",
      room: "Room 301",
      students: "B.Ed Sem 2",
      status: "upcoming",
      type: "Major"
    }
  ];

  const getTypeColor = (type) => {
    const colors = {
      "Major": "bg-blue-50 border-blue-300",
      "Minor": "bg-emerald-50 border-emerald-300",
      "Skill-Based": "bg-purple-50 border-purple-300"
    };
    return colors[type] || "bg-gray-50 border-gray-300";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="absolute -inset-1 rounded-2xl  blur-2xl" />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <p className="text-slate-600 text-sm">Thursday, September 29, 2025</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-slate-700">{todayClasses.length} Classes</div>
            <div className="text-xs text-slate-500">3 hrs total</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {todayClasses.map((classItem, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                classItem.status === "completed"
                  ? "border-emerald-200"
                  : classItem.status === "upcoming"
                  ? "border-amber-200 "
                  : "border-slate-200"
              }`}
            >
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  classItem.status === "completed"
                    ? "bg-emerald-100"
                    : classItem.status === "upcoming"
                    ? "bg-amber-100"
                    : "bg-slate-100"
                }`}
              >
                {classItem.status === "completed" ? (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-amber-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{classItem.course}</div>
                    <div className="flex items-center gap-2 mt-1">
                     
                      <span className={`text-xs px-2 py-1 rounded border ${getTypeColor(classItem.type)}`}>
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
                    <BuildingOfficeIcon className="h-4 w-4" />
                    <span>{classItem.room}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{classItem.students}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon className="h-4 w-4 text-indigo-600" />
            <span className="text-indigo-700 font-medium">Next class in 45 minutes</span>
            <span className="text-indigo-600">• Curriculum Development @ Room 301</span>
          </div>
        </div>
      </div>
    </div>
  );
}






function WeeklyTimetablePanel() {
  const facultyTimetable = {
    "Monday": {
      "09-10": {
        courseName: "Educational Psychology", 
        courseCode: "BED102",
        room: "Room 204", 
        students: "B.Ed Sem 1",
        type: "Major"
      },
      "10-11": {
        courseName: "Curriculum Development", 
        courseCode: "BED202",
        room: "Room 301", 
        students: "B.Ed Sem 2",
        type: "Major"
      },
      "11-12": {
        courseName: "Research Methodology", 
        courseCode: "MED202",
        room: "Seminar Hall A", 
        students: "M.Ed Sem 1",
        type: "Major"
      },
        "01-02": {
        courseName: "Gender, School and Society", 
        courseCode: "BED301",
        room: "Room 302", 
        students: "B.Ed Sem 3",
        type: "Skill-Based"
      },
        "02-03": {
        courseName: "Professional Communication", 
        courseCode: "FYUP-AEC101",
        room: "Room 204", 
        students: "FYUP Science Sem 1",
        type: "Ability Enhancement"
      }
    },
    "Tuesday": {
      "09-10": {
        courseName: "Childhood and Growing Up", 
        courseCode: "BED101",
        room: "Room 102", 
        students: "B.Ed Sem 1",
        type: "Major"
      },
      "11-12": {
        courseName: "Educational Technology", 
        courseCode: "MED301",
        room: "Computer Lab 3", 
        students: "M.Ed Sem 2",
        type: "Major"
      },
      "01-02": {
        courseName: "Assessment for Learning", 
        courseCode: "BED201",
        room: "Room 205", 
        students: "B.Ed Sem 2",
        type: "Major"
      }
    },
    "Wednesday": {
      "10-11": {
        courseName: "Advanced Curriculum Theory", 
        courseCode: "MED201",
        room: "Lecture Hall 1", 
        students: "M.Ed Sem 1",
        type: "Major"
      },
      "11-12": {
        courseName: "Gender, School and Society", 
        courseCode: "BED301",
        room: "Room 302", 
        students: "B.Ed Sem 3",
        type: "Skill-Based"
      },
      "02-03": {
        courseName: "Professional Communication", 
        courseCode: "FYUP-AEC101",
        room: "Room 204", 
        students: "FYUP Science Sem 1",
        type: "Ability Enhancement"
      },
    
    },
    "Thursday": {
      "10-11": {
        courseName: "Educational Psychology", 
        courseCode: "BED102",
        room: "Room 204", 
        students: "B.Ed Sem 1",
        type: "Major"
      },
      "11-12": {
        courseName: "Research Methodology", 
        courseCode: "MED202",
        room: "Physics Lab 2", 
        students: "M.Ed Sem 1",
        type: "Major"
      },
          "01-02": {
        courseName: "Gender, School and Society", 
        courseCode: "BED301",
        room: "Room 302", 
        students: "B.Ed Sem 3",
        type: "Skill-Based"
      },
      "02-03": {
        courseName: "Curriculum Development", 
        courseCode: "BED202",
        room: "Room 301", 
        students: "B.Ed Sem 2",
        type: "Major"
      }
    },
    "Friday": {
      "10-11": {
        courseName: "Assessment for Learning", 
        courseCode: "BED201",
        room: "Room 205", 
        students: "B.Ed Sem 2",
        type: "Major"
      },
      "11-12": {
        courseName: "Educational Technology", 
        courseCode: "MED301",
        room: "Computer Lab 3", 
        students: "M.Ed Sem 2",
        type: "Major"
      },
         "01-02": {
        courseName: "Professional Communication", 
        courseCode: "FYUP-AEC101",
        room: "Room 204", 
        students: "FYUP Science Sem 1",
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
      "Major": "bg-blue-50 border-blue-300 text-blue-800",
      "Minor": "bg-emerald-50 border-emerald-300 text-emerald-800",
      "Skill-Based": "bg-purple-50 border-purple-300 text-purple-800",
      "Ability Enhancement": "bg-pink-50 border-pink-300 text-pink-800",
      "Value-Added": "bg-amber-50 border-amber-300 text-amber-800"
    };
    return colors[type] || "bg-gray-50 border-gray-300 text-gray-800";
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
                  <div className="text-xs text-slate-500">PM</div>
                </div>
              </div>
              {days.map((day) => {
                const classData = facultyTimetable[day]?.[slot.code];
                
                return (
                  <div
                    key={`${day}-${slot.code}`}
                    className="border-r border-slate-200 last:border-r-0 p-2"
                  >
                    {classData ? (
                      <div className={`h-full rounded-lg border p-3 ${getTypeColor(classData.type)} shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="font-semibold text-xs mb-2 leading-tight">
                          {classData.courseName}
                        </div>
                        <div className="text-xs space-y-1">
                       
                          <div className="flex items-center gap-1">
                            <BuildingOfficeIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
                            <span className="truncate">{classData.room}</span>
                          </div>
                          {/* <div className="flex items-center gap-1">
                            <UserGroupIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
                            <span className="truncate text-xs">{classData.students}</span>
                          </div> */}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                        <div className="text-center">
                          <ClockIcon className="h-4 w-4 mx-auto mb-1 opacity-50" />
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
                     Lunch Break (12:00 - 1:00 PM)
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


function RequestFormsPanel() {
  const requestTypes = [
    {
      title: "Class Swap Request",
      desc: "Exchange classes with another faculty member",
      icon: ArrowPathIcon,
    },
    {
      title: "Conflict Resolution",
      desc: "Report scheduling conflicts",
      icon: ExclamationTriangleIcon,
    },
    {
      title: "Leave Request",
      desc: "Request time off from teaching duties",
      icon: UserIcon,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Request Types</h3>
      <div className="mt-6 grid gap-4">
        {requestTypes.map((request, i) => {
          const IconComponent = request.icon;
          return (
            <button
              key={i}
              className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left hover:shadow-lg transition"
            >
              <div className="p-2 rounded-lg bg-slate-50">
                <IconComponent className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <div className="font-medium group-hover:text-indigo-600 transition">
                  {request.title}
                </div>
                <div className="text-sm text-slate-600 mt-1">{request.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}






function EmptyState({ icon: IconComponent, title, description }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-fit p-4 rounded-xl bg-slate-50 mb-4">
        <IconComponent className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-slate-600 mt-2">{description}</p>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
