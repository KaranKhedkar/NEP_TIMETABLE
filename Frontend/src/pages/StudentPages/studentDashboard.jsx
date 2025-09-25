import { useState, useMemo, Fragment } from "react";
import { useAuth } from "../../contexts/authContext";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserIcon,
  DocumentArrowDownIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
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
                {profile?.program || "Student"} - {profile?.semester || "Semester"}
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
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div className="text-xs text-slate-600">
                  Roll No: {profile?.roll_number || "2023001"}
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
          value="5"
          change="Next: 11:00 AM"
          color="indigo"
          icon={CalendarDaysIcon}
        />
        <StatsCard
          title="Enrolled Courses"
          value="8"
      
          color="emerald"
          icon={BookOpenIcon}
        />
        {/* <StatsCard
          title="Attendance Rate"
          value="92%"
        
          color="amber"
          icon={AcademicCapIcon}
        />
        <StatsCard
          title="Upcoming Exams"
          value="3"
        
          color="rose"
          icon={ClockIcon}
        /> */}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TodaySchedulePanel />
        </div>
        {/* <div className="lg:col-span-4">
          <QuickInfoPanel />
        </div> */}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* <WeeklyOverviewPanel />
        <NotificationsPanel /> */}
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
            View your complete class schedule for the current semester
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
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* <div className="lg:col-span-2">
          <CourseDetailsPanel />
        </div>
        <div>
          <TimetableStatsPanel />
        </div> */}
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
      faculty: "Dr. Smith",
      room: "Room 204",
      type: "Lecture",
      status: "completed",
    },
    {
      time: "10:00 AM - 11:00 AM",
      course: "Teaching Methodology",
      faculty: "Prof. Johnson",
      room: "Room 106",
      type: "Tutorial",
      status: "completed",
    },
    {
      time: "11:00 AM - 12:00 PM",
      course: "Curriculum Development",
      faculty: "Dr. Brown",
      room: "Room 302",
      type: "Lecture",
      status: "upcoming",
    },
    {
      time: "2:00 PM - 3:00 PM",
      course: "Assessment & Evaluation",
      faculty: "Prof. Davis",
      room: "Room 108",
      type: "Practice",
      status: "upcoming",
    },
    {
      time: "3:00 PM - 4:00 PM",
      course: "Research Methods",
      faculty: "Dr. Wilson",
      room: "Room 205",
      type: "Lab",
      status: "upcoming",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-2xl" />
      <div className="relative p-6 sm:p-8">
        <h3 className="text-lg font-semibold">Today's Schedule</h3>
        <p className="mt-2 text-slate-600">Your classes for today</p>
        <div className="mt-6 space-y-4">
          {todayClasses.map((classItem, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                classItem.status === "completed"
                  ? "border-emerald-200 bg-emerald-50"
                  : classItem.status === "upcoming"
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  classItem.status === "completed"
                    ? "bg-emerald-100"
                    : classItem.status === "upcoming"
                    ? "bg-blue-100"
                    : "bg-slate-100"
                }`}
              >
                {classItem.status === "completed" ? (
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                ) : (
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{classItem.course}</div>
                  <div className="text-sm text-slate-600">{classItem.time}</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {classItem.faculty} • {classItem.room} • {classItem.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickInfoPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl p-6">
      <h3 className="font-semibold">Quick Info</h3>
      <div className="mt-4 space-y-4">
        <div className="p-4 rounded-lg border border-slate-200">
          <div className="font-medium">Current CGPA</div>
          <div className="text-2xl font-semibold text-emerald-600 mt-1">8.7</div>
          <div className="text-sm text-slate-600">Out of 10.0</div>
        </div>
        <div className="p-4 rounded-lg border border-slate-200">
          <div className="font-medium">Credits Completed</div>
          <div className="text-2xl font-semibold text-blue-600 mt-1">42</div>
          <div className="text-sm text-slate-600">Out of 120 total</div>
        </div>
        <div className="p-4 rounded-lg border border-slate-200">
          <div className="font-medium">Current Semester</div>
          <div className="text-2xl font-semibold text-indigo-600 mt-1">3</div>
          <div className="text-sm text-slate-600">B.Ed Program</div>
        </div>
      </div>
    </div>
  );
}

function WeeklyOverviewPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Weekly Overview</h3>
      <div className="mt-4 space-y-3">
        <StatRow label="Monday" value="6 classes" />
        <StatRow label="Tuesday" value="5 classes" />
        <StatRow label="Wednesday" value="4 classes" />
        <StatRow label="Thursday" value="6 classes" />
        <StatRow label="Friday" value="5 classes" />
        <StatRow label="Total Weekly Hours" value="26 hours" />
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const notifications = [
    {
      message: "Assignment deadline: Research Paper due tomorrow",
      time: "2 hours ago",
      type: "urgent",
      icon: ExclamationCircleIcon,
    },
    {
      message: "New study material uploaded for Curriculum Development",
      time: "1 day ago",
      type: "info",
      icon: InformationCircleIcon,
    },
    {
      message: "Mid-term exam schedule released",
      time: "2 days ago",
      type: "info",
      icon: CalendarDaysIcon,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Recent Notifications</h3>
      <div className="mt-4 space-y-4">
        {notifications.map((notification, i) => {
          const IconComponent = notification.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                notification.type === "urgent"
                  ? "border-rose-200 bg-rose-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-1 rounded ${
                    notification.type === "urgent"
                      ? "bg-rose-100"
                      : "bg-blue-100"
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 ${
                      notification.type === "urgent"
                        ? "text-rose-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{notification.message}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {notification.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyTimetablePanel() {
  const timeSlots = [
    "9:00 AM",
    "10:00 AM", 
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Sample timetable data - replace with actual data
  const timetableData = {
    "Monday": {
      "9:00 AM": { course: "Educational Psychology", room: "Room 204", type: "Lecture" },
      "10:00 AM": { course: "Teaching Methods", room: "Room 106", type: "Tutorial" },
      "11:00 AM": { course: "Break", room: "", type: "break" },
      "2:00 PM": { course: "Curriculum Dev", room: "Room 302", type: "Lecture" },
      "3:00 PM": { course: "Assessment", room: "Room 108", type: "Practice" },
    },
    "Tuesday": {
      "9:00 AM": { course: "Research Methods", room: "Lab 1", type: "Lab" },
      "11:00 AM": { course: "Child Psychology", room: "Room 205", type: "Lecture" },
      "2:00 PM": { course: "ICT in Education", room: "Computer Lab", type: "Lab" },
    },
    // Add more days...
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left font-medium text-slate-600 min-w-20">Time</th>
              {days.map((day) => (
                <th key={day} className="p-3 text-left font-medium text-slate-600 min-w-40">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="p-3 font-medium text-slate-700">{time}</td>
                {days.map((day) => {
                  const classData = timetableData[day]?.[time];
                  return (
                    <td key={`${day}-${time}`} className="p-3">
                      {classData && (
                        <div
                          className={`p-3 rounded-lg border ${
                            classData.type === "break"
                              ? "border-slate-200 bg-slate-50"
                              : classData.type === "Lab"
                              ? "border-emerald-200 bg-emerald-50"
                              : classData.type === "Tutorial"
                              ? "border-amber-200 bg-amber-50"
                              : "border-indigo-200 bg-indigo-50"
                          }`}
                        >
                          <div className="text-xs font-medium text-slate-800">
                            {classData.course}
                          </div>
                          {classData.room && (
                            <div className="text-xs text-slate-600 mt-1">
                              {classData.room}
                            </div>
                          )}
                          <div className="text-xs text-slate-500 mt-1">
                            {classData.type}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseDetailsPanel() {
  const courses = [
    {
      code: "EDU301",
      name: "Educational Psychology",
      credits: 4,
      faculty: "Dr. Smith",
      type: "Core",
    },
    {
      code: "EDU302",
      name: "Teaching Methodology", 
      credits: 3,
      faculty: "Prof. Johnson",
      type: "Core",
    },
    {
      code: "EDU303",
      name: "Curriculum Development",
      credits: 4,
      faculty: "Dr. Brown",
      type: "Core",
    },
    {
      code: "EDU304",
      name: "Assessment & Evaluation",
      credits: 3,
      faculty: "Prof. Davis",
      type: "Core",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Course Details</h3>
      <div className="mt-4 space-y-4">
        {courses.map((course, i) => (
          <div key={i} className="p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{course.name}</div>
                <div className="text-sm text-slate-600 mt-1">
                  {course.code} • {course.faculty} • {course.credits} Credits
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                {course.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimetableStatsPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Timetable Stats</h3>
      <div className="mt-4 space-y-3">
        <StatRow label="Total Classes/Week" value="26" />
        <StatRow label="Lecture Hours" value="18" />
        <StatRow label="Lab Hours" value="4" />
        <StatRow label="Tutorial Hours" value="4" />
        <StatRow label="Free Periods" value="8" />
      </div>
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
