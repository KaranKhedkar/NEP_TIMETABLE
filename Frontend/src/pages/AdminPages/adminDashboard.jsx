import { useState, useMemo, Fragment } from "react";
import { useAuth } from "../../contexts/authContext";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  BoltIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";


import TimetableGenerationPanel from "./timetableGenerationPanel";

export default function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
    { id: "faculty", label: "Faculty Management", icon: UserGroupIcon },
    { id: "students", label: "Student Management", icon: AcademicCapIcon },
    { id: "courses", label: "Course Management", icon: BookOpenIcon },
    { id: "rooms", label: "Room Management", icon: BuildingOfficeIcon },
    { id: "generate", label: "Generate Timetable", icon: BoltIcon },
    { id: "timetable", label: "View/Edit Timetable", icon: CalendarDaysIcon },
    { id: "reports", label: "Reports & Analytics", icon: ChartPieIcon },
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
                NEP Timetable Admin
              </h1>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {profile?.role || "Admin"}
              </span>
            </div>
            <div className="flex items-center gap-4">
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
          {activeTab === "faculty" && <FacultyTab />}
          {activeTab === "students" && <StudentsTab />}
          {activeTab === "courses" && <CoursesTab />}
          {activeTab === "rooms" && <RoomsTab />}
          {activeTab === "generate" && <GenerateTab />}
          {activeTab === "timetable" && <TimetableTab />}
          {activeTab === "reports" && <ReportsTab />}
        </main>
      </div>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
        <p className="mt-2 text-slate-600">
          Monitor your timetable system at a glance
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Faculty"
          value="0"
       
          color="indigo"
          icon={UserGroupIcon}
        />
        <StatsCard
          title="Active Students"
          value="0"
       
          color="emerald"
          icon={AcademicCapIcon}
        />
        <StatsCard
          title="Courses Offered"
          value="0"
      
          color="amber"
          icon={BookOpenIcon}
        />
        <StatsCard
          title="Room Utilization"
          value="0"
       
          color="rose"
          icon={BuildingOfficeIcon}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <QuickActionsPanel />
        </div>

        <div className="lg:col-span-4">
          <SystemStatusPanel />
        </div>
      </div>

      <RecentActivityPanel />
    </div>
  );
}

function FacultyTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Faculty Management</h2>
          <p className="text-slate-600">
            Manage faculty members and their assignments
          </p>
        </div>
        <button className="flex items-center gap-2 w-full sm:w-auto rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
          <PlusIcon className="h-4 w-4" />
          Add New Faculty
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <FacultyListPanel />
        </div>

        <div className="lg:col-span-4">
          <FacultyStatsPanel />
        </div>
      </div>
    </div>
  );
}

function StudentsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Student Management</h2>
          <p className="text-slate-600">
            Import and manage student enrollment data
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 hover:border-slate-400 transition">
            <DocumentArrowUpIcon className="h-4 w-4" />
            Import Students
          </button>
          <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
            <PlusIcon className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <StudentListPanel />
        </div>
        <div className="lg:col-span-3">
          <StudentClassesPanel />
        </div>
      </div>
    </div>
  );
}

function CoursesTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Course Management</h2>
          <p className="text-slate-600">
            Manage subjects, credits, and course types
          </p>
        </div>
        <button className="flex items-center gap-2 w-full sm:w-auto rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
          <PlusIcon className="h-4 w-4" />
          Add New Course
        </button>
      </div>

      <CourseManagementPanel />
    </div>
  );
}

function RoomsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Room Management</h2>
          <p className="text-slate-600">
            Manage classrooms, labs, and resource allocation
          </p>
        </div>
        <button className="flex items-center gap-2 w-full sm:w-auto rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
          <PlusIcon className="h-4 w-4" />
          Add New Room
        </button>
      </div>

      <RoomManagementPanel />
    </div>
  );
}

function GenerateTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Generate Timetable</h2>
        <p className="text-slate-600">
          AI-powered timetable generation with conflict resolution
        </p>
      </div>

      <TimetableGenerationPanel />
    </div>
  );
}

function TimetableTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">View & Edit Timetable</h2>
          <p className="text-slate-600">
            Review and manually resolve timetable conflicts
          </p>
        </div>
        <div className="flex gap-3">
          <select className="rounded-md border border-slate-300 px-4 py-2 text-sm">
            <option>B.Ed Semester 3</option>
            <option>FYUP Science Year 2</option>
            <option>M.Ed Semester 1</option>
          </select>
          <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <DocumentArrowDownIcon className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <TimetableViewPanel />
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
        <p className="text-slate-600">
          Analyze room utilization, faculty workload, and system performance
        </p>
      </div>

      <ReportsAnalyticsPanel />
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

function QuickActionsPanel() {
  const actions = [
    {
      title: "Generate New Timetable",
      desc: "Create optimized schedules with AI",
      icon: BoltIcon,
      color: "indigo",
    },
    {
      title: "Import Faculty Data",
      desc: "Bulk upload faculty information",
      icon: UserGroupIcon,
      color: "emerald",
    },
    {
      title: "Add New Course",
      desc: "Create subjects and assign credits",
      icon: BookOpenIcon,
      color: "amber",
    },
    {
      title: "Room Utilization Report",
      desc: "Check space optimization",
      icon: ChartPieIcon,
      color: "rose",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-2xl" />
      <div className="relative p-6 sm:p-8">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="mt-2 text-slate-600">Common administrative tasks</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {actions.map((action, i) => {
            const IconComponent = action.icon;
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
                    {action.title}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {action.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SystemStatusPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl p-6">
      <h3 className="font-semibold">System Status</h3>
      <div className="mt-4 space-y-4">
        <StatusItem label="Timetable Engine" status="healthy" />
        <StatusItem label="Database" status="healthy" />
        <StatusItem label="AI Generator" status="running" />
        <StatusItem label="Last Backup" status="2 hours ago" />
      </div>
    </div>
  );
}

function StatusItem({ label, status }) {
  const isHealthy = status === "healthy" || status === "running";
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span
        className={`flex items-center gap-2 text-sm ${
          isHealthy ? "text-emerald-600" : "text-slate-600"
        }`}
      >
        {isHealthy && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
        {status}
      </span>
    </div>
  );
}

function RecentActivityPanel() {
  const activities = [
    {
      action: "Generated timetable for B.Ed Semester 3",
      time: "2 hours ago",
      type: "generation",
    },
    {
      action: "Added 5 new faculty members",
      time: "1 day ago",
      type: "faculty",
    },
    {
      action: "Resolved 3 schedule conflicts",
      time: "2 days ago",
      type: "conflict",
    },
    {
      action: "Imported 120 student records",
      time: "3 days ago",
      type: "student",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Recent Activity</h3>
      <div className="mt-4 space-y-4">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200"
          >
            <div className="flex-1">
              <div className="text-sm font-medium">{activity.action}</div>
              <div className="text-xs text-slate-600">{activity.time}</div>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">
              {activity.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacultyListPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Faculty List</h3>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search faculty..."
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>
      </div>
      <EmptyState
        icon={UserGroupIcon}
        title="No Faculty Added"
        description="Add faculty members to start managing schedules"
      />
    </div>
  );
}

function FacultyStatsPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Faculty Statistics</h3>
      <div className="mt-4 space-y-3">
        <StatRow label="Total Faculty" value="0" />
        <StatRow label="Active This Semester" value="0" />
        <StatRow label="Average Load" value="0 hrs/week" />
        <StatRow label="Overloaded" value="0" />
      </div>
    </div>
  );
}

function StudentListPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Student Enrollment</h3>
        <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm">
          <option>All Programs</option>
          <option>B.Ed</option>
          <option>M.Ed</option>
          <option>FYUP</option>
        </select>
      </div>
      <EmptyState
        icon={AcademicCapIcon}
        title="No Students Enrolled"
        description="Import student data to manage class assignments"
      />
    </div>
  );
}

function StudentClassesPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <h3 className="font-semibold">Class Distribution</h3>
      <div className="mt-4 space-y-3">
        <StatRow label="B.Ed Students" value="0" />
        <StatRow label="M.Ed Students" value="0" />
        <StatRow label="FYUP Students" value="0" />
        <StatRow label="Total Classes" value="0" />
      </div>
    </div>
  );
}

function CourseManagementPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
          <h3 className="font-semibold">Course List</h3>
          <EmptyState
            icon={BookOpenIcon}
            title="No Courses Added"
            description="Create subjects with credits and course types"
          />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
        <h3 className="font-semibold">Course Types</h3>
        <div className="mt-4 space-y-3">
          <TypeBadge label="Lecture" count="0" />
          <TypeBadge label="Lab" count="0" />
          <TypeBadge label="Tutorial" count="0" />
          <TypeBadge label="Practice" count="0" />
        </div>
      </div>
    </div>
  );
}

function RoomManagementPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
          <h3 className="font-semibold">Room Directory</h3>
          <EmptyState
            icon={BuildingOfficeIcon}
            title="No Rooms Configured"
            description="Add classrooms and labs with capacity details"
          />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
        <h3 className="font-semibold">Capacity Overview</h3>
        <div className="mt-4 space-y-3">
          <StatRow label="Total Rooms" value="0" />
          <StatRow label="Classrooms" value="0" />
          <StatRow label="Labs" value="0" />
          <StatRow label="Avg Capacity" value="0 seats" />
        </div>
      </div>
    </div>
  );
}

function ReportsAnalyticsPanel() {
  const reports = [
    {
      title: "Room Utilization",
      desc: "Space usage analysis",
      icon: BuildingOfficeIcon,
    },
    {
      title: "Faculty Workload",
      desc: "Teaching hour distribution",
      icon: UserGroupIcon,
    },
    {
      title: "Conflict Analysis",
      desc: "Schedule overlap reports",
      icon: Cog6ToothIcon,
    },
    {
      title: "Student Attendance",
      desc: "Class participation stats",
      icon: AcademicCapIcon,
    },
    {
      title: "Resource Usage",
      desc: "Lab and equipment usage",
      icon: ChartBarIcon,
    },
    {
      title: "Performance Metrics",
      desc: "System efficiency reports",
      icon: ChartPieIcon,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report, i) => {
        const IconComponent = report.icon;
        return (
          <button
            key={i}
            className="group rounded-2xl border border-slate-200 bg-white shadow-xl p-6 text-left hover:shadow-2xl transition"
          >
            <div className="p-3 rounded-xl bg-slate-50 w-fit mb-4">
              <IconComponent className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="font-semibold group-hover:text-indigo-600 transition">
              {report.title}
            </h3>
            <p className="text-sm text-slate-600 mt-2">{report.desc}</p>
          </button>
        );
      })}
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

function TypeBadge({ label, count }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
      <span className="text-sm font-medium">{label}</span>
      <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
        {count}
      </span>
    </div>
  );
}

function TimetableViewPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
      <EmptyState
        icon={CalendarDaysIcon}
        title="No Timetable Selected"
        description="Generate or select a timetable to view and edit"
      />
    </div>
  );
}

