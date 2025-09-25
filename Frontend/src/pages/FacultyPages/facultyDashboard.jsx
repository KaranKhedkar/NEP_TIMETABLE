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
        {/* <div className="lg:col-span-4">
          <UpcomingClassesPanel />
        </div> */}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* <WeeklyOverviewPanel />
        <RecentNotificationsPanel /> */}
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
        {/* <div className="lg:col-span-4">
          <RequestStatusPanel />
        </div> */}
      </div>

      {/* <PendingRequestsPanel /> */}
    </div>
  );
}

function MaterialsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Study Materials</h2>
          <p className="text-slate-600">
            Upload and manage course materials for your students
          </p>
        </div>
        <button className="flex items-center gap-2 w-full sm:w-auto rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
          <DocumentArrowUpIcon className="h-4 w-4" />
          Upload Material
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MaterialsListPanel />
        </div>
        <div>
          <MaterialsStatsPanel />
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
      room: "Room 204",
      students: "B.Ed Sem 3",
      status: "completed",
    },
    {
      time: "11:00 AM - 12:00 PM",
      course: "Curriculum Development",
      room: "Room 106",
      students: "M.Ed Sem 1",
      status: "completed",
    },
    {
      time: "2:00 PM - 3:00 PM",
      course: "Teaching Methodology",
      room: "Room 302",
      students: "B.Ed Sem 2",
      status: "upcoming",
    },
    {
      time: "4:00 PM - 5:00 PM",
      course: "Research Methods",
      room: "Room 108",
      students: "M.Ed Sem 2",
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
                  ? "border-amber-200 bg-amber-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  classItem.status === "completed"
                    ? "bg-emerald-100"
                    : classItem.status === "upcoming"
                    ? "bg-amber-100"
                    : "bg-slate-100"
                }`}
              >
                {classItem.status === "completed" ? (
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                ) : (
                  <ClockIcon className="h-6 w-6 text-amber-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{classItem.course}</div>
                  <div className="text-sm text-slate-600">{classItem.time}</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {classItem.room} • {classItem.students}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UpcomingClassesPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl p-6">
      <h3 className="font-semibold">Upcoming Classes</h3>
      <div className="mt-4 space-y-4">
        <div className="p-4 rounded-lg border border-slate-200">
          <div className="font-medium">Tomorrow</div>
          <div className="text-sm text-slate-600 mt-1">6 classes scheduled</div>
        </div>
        <div className="p-4 rounded-lg border border-slate-200">
          <div className="font-medium">This Week</div>
          <div className="text-sm text-slate-600 mt-1">24 total hours</div>
        </div>
        <div className="p-4 rounded-lg border border-slate-200">
          <div className="font-medium">Next Week</div>
          <div className="text-sm text-slate-600 mt-1">22 total hours</div>
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
        <StatRow label="Tuesday" value="4 classes" />
        <StatRow label="Wednesday" value="5 classes" />
        <StatRow label="Thursday" value="3 classes" />
        <StatRow label="Friday" value="6 classes" />
      </div>
    </div>
  );
}

function RecentNotificationsPanel() {
  const notifications = [
    {
      message: "Room change: Edu Psych moved to Room 205",
      time: "2 hours ago",
      type: "warning",
    },
    {
      message: "New student enrolled in M.Ed Sem 1",
      time: "1 day ago",
      type: "info",
    },
    {
      message: "Leave request approved for next Friday",
      time: "2 days ago",
      type: "success",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Recent Notifications</h3>
      <div className="mt-4 space-y-4">
        {notifications.map((notification, i) => (
          <div key={i} className="p-4 rounded-lg border border-slate-200">
            <div className="text-sm font-medium">{notification.message}</div>
            <div className="text-xs text-slate-600 mt-1">{notification.time}</div>
          </div>
        ))}
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left font-medium text-slate-600">Time</th>
              {days.map((day) => (
                <th key={day} className="p-3 text-left font-medium text-slate-600">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="p-3 font-medium text-slate-700">{time}</td>
                {days.map((day) => (
                  <td key={`${day}-${time}`} className="p-3">
                    {/* Sample data - replace with actual timetable data */}
                    {Math.random() > 0.6 && (
                      <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                        <div className="text-xs font-medium text-indigo-800">
                          Course Name
                        </div>
                        <div className="text-xs text-indigo-600">Room 101</div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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

function RequestStatusPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Request Status</h3>
      <div className="mt-4 space-y-3">
        <StatRow label="Pending" value="2" />
        <StatRow label="Approved" value="8" />
        <StatRow label="Rejected" value="1" />
        <StatRow label="Total Requests" value="11" />
      </div>
    </div>
  );
}

function PendingRequestsPanel() {
  const pendingRequests = [
    {
      type: "Leave Request",
      date: "Dec 15, 2024",
      status: "pending",
      urgent: true,
    },
    {
      type: "Class Swap",
      date: "Dec 12, 2024",
      status: "under_review",
      urgent: false,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Pending Requests</h3>
      <div className="mt-4 space-y-4">
        {pendingRequests.map((request, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{request.type}</span>
                {request.urgent && (
                  <span className="px-2 py-1 rounded-full text-xs bg-rose-100 text-rose-800">
                    Urgent
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-600">{request.date}</div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                request.status === "pending"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {request.status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialsListPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Course Materials</h3>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search materials..."
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>
      </div>
      <EmptyState
        icon={DocumentArrowUpIcon}
        title="No Materials Uploaded"
        description="Upload study materials for your courses"
      />
    </div>
  );
}

function MaterialsStatsPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Materials Overview</h3>
      <div className="mt-4 space-y-3">
        <StatRow label="Total Files" value="24" />
        <StatRow label="This Month" value="6" />
        <StatRow label="Most Downloaded" value="Lesson Plan 1" />
        <StatRow label="Storage Used" value="145 MB" />
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
