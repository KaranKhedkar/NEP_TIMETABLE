import { useState } from "react";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon 
} from "@heroicons/react/24/outline";

const facultyData = [
  {
    faculty_id: "F201",
    faculty_name: "Dr. Priya Sharma",
    department: "Education",
    expertise: "BED101, BED102, MED201, ITEP101",
    max_hours_week: 16
  },
  {
    faculty_id: "F202",
    faculty_name: "Dr. Rohan Gupta",
    department: "Computer Science",
    expertise: "FYUP-CS202, ITEP301, FYUP-CS301",
    max_hours_week: 18
  },
  {
    faculty_id: "F203",
    faculty_name: "Dr. Anjali Verma",
    department: "Physics",
    expertise: "FYUP-PHY101, FYUP-PHY201, FYUP-PHY301",
    max_hours_week: 16
  },
  {
    faculty_id: "F204",
    faculty_name: "Dr. Sameer Khan",
    department: "History",
    expertise: "FYUP-HIS101, FYUP-HIS301",
    max_hours_week: 18
  },
  {
    faculty_id: "F205",
    faculty_name: "Prof. Meena Iyer",
    department: "Environmental Science",
    expertise: "FYUP-EVS101, FYUP-EVS201",
    max_hours_week: 14
  },
  {
    faculty_id: "F206",
    faculty_name: "Dr. Arjun Rathore",
    department: "Mathematics",
    expertise: "FYUP-MAT102, FYUP-MAT201",
    max_hours_week: 18
  },
  {
    faculty_id: "F207",
    faculty_name: "Prof. Sunita Patil",
    department: "Communication",
    expertise: "FYUP-AEC101",
    max_hours_week: 14
  },
  {
    faculty_id: "F208",
    faculty_name: "Dr. Vikram Singh",
    department: "Chemistry",
    expertise: "FYUP-CHE101, FYUP-CHE202",
    max_hours_week: 16
  },
  {
    faculty_id: "F209",
    faculty_name: "Prof. Nisha Desai",
    department: "Commerce",
    expertise: "FYUP-ACC101, FYUP-ECO201",
    max_hours_week: 18
  },
  {
    faculty_id: "F210",
    faculty_name: "Dr. Karan Malhotra",
    department: "Political Science",
    expertise: "FYUP-POL102, FYUP-POL201",
    max_hours_week: 16
  }
];

export default function FacultyManagement() {
  const [faculty] = useState(facultyData);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaculty = faculty.filter(member =>
    member.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.expertise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: faculty.length,
    active: faculty.length,
    avgLoad: Math.round(faculty.reduce((sum, f) => sum + f.max_hours_week, 0) / faculty.length),
    overloaded: faculty.filter(f => f.max_hours_week > 17).length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Faculty Management</h2>
          <p className="text-slate-600">Manage faculty members and their assignments</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
          <PlusIcon className="h-4 w-4" />
          Add New Faculty
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Faculty List (54)</h3>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
            
            {filteredFaculty.length > 0 ? (
              <div className="space-y-3">
                {filteredFaculty.map((member) => (
                  <div
                    key={member.faculty_id}
                    className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900">{member.faculty_name}</h4>
                          <p className="text-sm text-slate-600">{member.department}</p>
                          <p className="text-xs text-slate-500 mt-1 break-words">
                            <span className="font-medium">Courses: </span>
                            {member.expertise}
                          </p>
                        </div>
                        
                        <div className="text-right ml-4 flex-shrink-0">
                          <div className="text-sm font-medium text-slate-900">
                            {member.max_hours_week}h/week
                          </div>
                          <div className="text-xs text-slate-500">Max Hours</div>
                          {member.max_hours_week > 17 && (
                            <div className="text-xs text-amber-600 font-medium mt-1">
                              High Load
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition" title="Edit Faculty">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition" title="Delete Faculty">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Faculty Found</h3>
                <p className="text-slate-600 mt-2">
                  {searchTerm ? `No results for "${searchTerm}"` : "No faculty members available"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
            <h3 className="font-semibold">Faculty Statistics</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Faculty</span>
                <span className="text-sm font-medium">54</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active This Semester</span>
                <span className="text-sm font-medium">46</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Average Load</span>
                <span className="text-sm font-medium">{stats.avgLoad} hrs/week</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">High Load (&gt;17hrs)</span>
                <span className="text-sm font-medium">{stats.overloaded}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
