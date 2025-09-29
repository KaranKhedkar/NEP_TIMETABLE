import { useState } from "react";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  AcademicCapIcon,
  DocumentArrowUpIcon 
} from "@heroicons/react/24/outline";


const studentsData = [
  {
    student_id: "S20250001",
    student_name: "Vihaan Reddy",
    program_id: "P104",
    program_name: "B.Ed",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250002",
    student_name: "Aarav Iyer",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2023,
    current_semester: 5
  },
  {
    student_id: "S20250003",
    student_name: "Aryan Patel",
    program_id: "P104",
    program_name: "B.Ed",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250004",
    student_name: "Aryan Shah",
    program_id: "P105",
    program_name: "M.Ed",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250005",
    student_name: "Aryan Reddy",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2024,
    current_semester: 3
  },
  {
    student_id: "S20250006",
    student_name: "Kiara Singh",
    program_id: "P101",
    program_name: "FYUP Arts",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250007",
    student_name: "Riya Verma",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250008",
    student_name: "Vihaan Sharma",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2023,
    current_semester: 5
  },
  {
    student_id: "S20250009",
    student_name: "Rohan Pillai",
    program_id: "P104",
    program_name: "B.Ed",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250010",
    student_name: "Aditya Verma",
    program_id: "P105",
    program_name: "M.Ed",
    enrollment_year: 2024,
    current_semester: 3
  },
  {
    student_id: "S20250011",
    student_name: "Riya Singh",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2023,
    current_semester: 5
  },
  {
    student_id: "S20250012",
    student_name: "Diya Reddy",
    program_id: "P106",
    program_name: "FYUP Commerce",
    enrollment_year: 2024,
    current_semester: 3
  },
  {
    student_id: "S20250013",
    student_name: "Diya Khan",
    program_id: "P104",
    program_name: "B.Ed",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250014",
    student_name: "Aditya Nair",
    program_id: "P104",
    program_name: "B.Ed",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250015",
    student_name: "Rohan Khan",
    program_id: "P101",
    program_name: "FYUP Arts",
    enrollment_year: 2024,
    current_semester: 3
  },
  {
    student_id: "S20250016",
    student_name: "Rohan Verma",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250017",
    student_name: "Kiara Mehta",
    program_id: "P101",
    program_name: "FYUP Arts",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250018",
    student_name: "Myra Chatterjee",
    program_id: "P104",
    program_name: "B.Ed",
    enrollment_year: 2024,
    current_semester: 3
  },
  {
    student_id: "S20250019",
    student_name: "Aryan Mehta",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250020",
    student_name: "Kabir Nair",
    program_id: "P104",
    program_name: "B.Ed",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250021",
    student_name: "Aarav Singh",
    program_id: "P101",
    program_name: "FYUP Arts",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250022",
    student_name: "Siya Reddy",
    program_id: "P106",
    program_name: "FYUP Commerce",
    enrollment_year: 2024,
    current_semester: 3
  },
  {
    student_id: "S20250023",
    student_name: "Aarav Shah",
    program_id: "P104",
    program_name: "B.Ed",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250024",
    student_name: "Diya Shah",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2025,
    current_semester: 1
  },
  {
    student_id: "S20250025",
    student_name: "Arjun Sharma",
    program_id: "P103",
    program_name: "FYUP Science",
    enrollment_year: 2025,
    current_semester: 1
  }
];

export default function StudentManagement() {
  const [students] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");

  const programs = [
    "all",
    ...new Set(students.map(student => student.program_name))
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = selectedProgram === "all" || student.program_name === selectedProgram;
    
    return matchesSearch && matchesProgram;
  });

  const stats = {
    totalStudents: 550,
    bedStudents: 150,
    medStudents: 45,
    fyupStudents: 355,
  
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Student Management</h2>
          <p className="text-slate-600">Import and manage student enrollment data</p>
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
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h3 className="font-semibold">Student Enrollment (850)</h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                
                <select 
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {programs.map(program => (
                    <option key={program} value={program}>
                      {program === "all" ? "All Programs" : program}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredStudents.length > 0 ? (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.student_id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900">{student.student_name}</h4>
                          <p className="text-sm text-slate-600">{student.student_id}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                              {student.program_name}
                            </span>
                            <span className="text-xs text-slate-500">
                              Semester {student.current_semester}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4 flex-shrink-0">
                          <div className="text-sm font-medium text-slate-900">
                            {student.enrollment_year}
                          </div>
                          <div className="text-xs text-slate-500">Enrolled</div>
                          {student.current_semester >= 5 && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              Senior
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                 
                      <button className="p-2 text-slate-400 hover:text-red-600 transition" title="Remove Student">
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
                <AcademicCapIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Students Found</h3>
                <p className="text-slate-600 mt-2">
                  {searchTerm || selectedProgram !== "all" 
                    ? "No students match your search criteria" 
                    : "Import student data to manage class assignments"
                  }
                </p>
                {(searchTerm || selectedProgram !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedProgram("all");
                    }}
                    className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
            <h3 className="font-semibold">Student Statistics</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Students</span>
                <span className="text-sm font-medium">{stats.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">B.Ed Students</span>
                <span className="text-sm font-medium">{stats.bedStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">M.Ed Students</span>
                <span className="text-sm font-medium">{stats.medStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">FYUP Students</span>
                <span className="text-sm font-medium">{stats.fyupStudents}</span>
              </div>
            
            </div>

 
          </div>
        </div>
      </div>
    </div>
  );
}
