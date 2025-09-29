import { useState } from "react";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  BookOpenIcon 
} from "@heroicons/react/24/outline";

const coursesData = [
  {
    course_id: "C001",
    course_code: "BED101",
    course_name: "Childhood and Growing Up",
    program_id: "P101",
    program_name: "B.Ed",
    semester: 1,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 3,
    practical_hours_week: 2
  },
  {
    course_id: "C002",
    course_code: "BED102",
    course_name: "Educational Psychology",
    program_id: "P101",
    program_name: "B.Ed",
    semester: 1,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 4,
    practical_hours_week: 0
  },
  {
    course_id: "C003",
    course_code: "BED201",
    course_name: "Assessment for Learning",
    program_id: "P101",
    program_name: "B.Ed",
    semester: 2,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 3,
    practical_hours_week: 2
  },
  {
    course_id: "C004",
    course_code: "BED202",
    course_name: "Curriculum Development",
    program_id: "P101",
    program_name: "B.Ed",
    semester: 2,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 4,
    practical_hours_week: 0
  },
  {
    course_id: "C005",
    course_code: "BED301",
    course_name: "Gender, School and Society",
    program_id: "P101",
    program_name: "B.Ed",
    semester: 3,
    credits: 3,
    course_type: "Skill-Based",
    lecture_hours_week: 3,
    practical_hours_week: 0
  },
  {
    course_id: "C006",
    course_code: "BED401",
    course_name: "Teaching Practice",
    program_id: "P101",
    program_name: "B.Ed",
    semester: 4,
    credits: 6,
    course_type: "Internship",
    lecture_hours_week: 0,
    practical_hours_week: 15
  },
  {
    course_id: "C007",
    course_code: "MED201",
    course_name: "Advanced Curriculum Theory",
    program_id: "P102",
    program_name: "M.Ed",
    semester: 1,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 4,
    practical_hours_week: 0
  },
  {
    course_id: "C008",
    course_code: "MED202",
    course_name: "Research Methodology in Education",
    program_id: "P102",
    program_name: "M.Ed",
    semester: 1,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 3,
    practical_hours_week: 2
  },
  {
    course_id: "C009",
    course_code: "MED301",
    course_name: "Educational Technology",
    program_id: "P102",
    program_name: "M.Ed",
    semester: 2,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 2,
    practical_hours_week: 4
  },
  {
    course_id: "C010",
    course_code: "MED401",
    course_name: "Dissertation",
    program_id: "P102",
    program_name: "M.Ed",
    semester: 4,
    credits: 6,
    course_type: "Internship",
    lecture_hours_week: 0,
    practical_hours_week: 15
  },
  {
    course_id: "C011",
    course_code: "FYUP-PHY101",
    course_name: "Classical Mechanics",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 1,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 3,
    practical_hours_week: 2
  },
  {
    course_id: "C012",
    course_code: "FYUP-CHE101",
    course_name: "Inorganic Chemistry",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 1,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 3,
    practical_hours_week: 2
  },
  {
    course_id: "C013",
    course_code: "FYUP-MAT102",
    course_name: "Calculus I",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 1,
    credits: 4,
    course_type: "Minor",
    lecture_hours_week: 4,
    practical_hours_week: 0
  },
  {
    course_id: "C014",
    course_code: "FYUP-CS101",
    course_name: "Intro to C Programming",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 1,
    credits: 3,
    course_type: "Skill-Based",
    lecture_hours_week: 1,
    practical_hours_week: 4
  },
  {
    course_id: "C015",
    course_code: "FYUP-AEC101",
    course_name: "Professional Communication",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 1,
    credits: 2,
    course_type: "Ability Enhancement",
    lecture_hours_week: 2,
    practical_hours_week: 0
  },
  {
    course_id: "C016",
    course_code: "FYUP-EVS101",
    course_name: "Environmental Science",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 1,
    credits: 2,
    course_type: "Value-Added",
    lecture_hours_week: 2,
    practical_hours_week: 0
  },
  {
    course_id: "C017",
    course_code: "FYUP-PHY201",
    course_name: "Electromagnetism",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 3,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 3,
    practical_hours_week: 2
  },
  {
    course_id: "C018",
    course_code: "FYUP-CHE202",
    course_name: "Organic Chemistry",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 3,
    credits: 4,
    course_type: "Major",
    lecture_hours_week: 3,
    practical_hours_week: 2
  },
  {
    course_id: "C019",
    course_code: "FYUP-MAT201",
    course_name: "Linear Algebra",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 3,
    credits: 4,
    course_type: "Minor",
    lecture_hours_week: 4,
    practical_hours_week: 0
  },
  {
    course_id: "C020",
    course_code: "FYUP-CS202",
    course_name: "Python Programming",
    program_id: "P103",
    program_name: "FYUP Science",
    semester: 3,
    credits: 3,
    course_type: "Skill-Based",
    lecture_hours_week: 1,
    practical_hours_week: 4
  }
];

export default function CourseManagement() {
  const [courses] = useState(coursesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const programs = [
    "all",
    ...new Set(courses.map(course => course.program_name))
  ];

  const courseTypes = [
    "all",
    ...new Set(courses.map(course => course.course_type))
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.program_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = selectedProgram === "all" || course.program_name === selectedProgram;
    const matchesType = selectedType === "all" || course.course_type === selectedType;
    
    return matchesSearch && matchesProgram && matchesType;
  });

  // Hardcoded statistics
  const stats = {
    totalCourses: 54,
    majorCourses: 38,
    minorCourses: 12,
    skillBased: 2,
    internships: 8,
    totalCredits: 134,
  };

  const getTypeColor = (type) => {
    const colors = {
      "Major": "bg-blue-100 text-blue-800",
      "Minor": "bg-green-100 text-green-800", 
      "Skill-Based": "bg-purple-100 text-purple-800",
      "Ability Enhancement": "bg-yellow-100 text-yellow-800",
      "Value-Added": "bg-indigo-100 text-indigo-800",
      "Internship": "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Course Management</h2>
          <p className="text-slate-600">Manage subjects, credits, and course types</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
          <PlusIcon className="h-4 w-4" />
          Add New Course
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h3 className="font-semibold">Course List (54)</h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-auto"
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

                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {courseTypes.map(type => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredCourses.length > 0 ? (
              <div className="space-y-3">
                {filteredCourses.map((course) => (
                  <div
                    key={course.course_id}
                    className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900">{course.course_name}</h4>
                        
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(course.course_type)}`}>
                              {course.course_type}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">
                              {course.program_name}
                            </span>
                            <span className="text-xs text-slate-500">
                              Semester {course.semester}
                            </span>
                          </div>
                      
                        </div>
                        
                        <div className="text-right ml-4 flex-shrink-0">
                          <div className="text-lg font-bold text-slate-900">
                            {course.credits + 1}
                          </div>
                          <div className="text-xs text-slate-500">Credits</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {course.lecture_hours_week + course.practical_hours_week + 10}h total
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                 
                      <button className="p-2 text-slate-400 hover:text-red-600 transition" title="Delete Course">
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
                <BookOpenIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Courses Found</h3>
                <p className="text-slate-600 mt-2">
                  {searchTerm || selectedProgram !== "all" || selectedType !== "all"
                    ? "No courses match your search criteria" 
                    : "Create subjects with credits and course types"
                  }
                </p>
                {(searchTerm || selectedProgram !== "all" || selectedType !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedProgram("all");
                      setSelectedType("all");
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
            <h3 className="font-semibold">Course Statistics</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Courses</span>
                <span className="text-sm font-medium">{stats.totalCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Major Courses</span>
                <span className="text-sm font-medium">{stats.majorCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Minor Courses</span>
                <span className="text-sm font-medium">{stats.minorCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Skill-Based</span>
                <span className="text-sm font-medium">{stats.skillBased}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Internships</span>
                <span className="text-sm font-medium">{stats.internships}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Credits</span>
                <span className="text-sm font-medium">{stats.totalCredits}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Course Types</h4>
              <div className="space-y-2">
                {Object.entries(
                  courses.reduce((acc, c) => {
                    acc[c.course_type] = (acc[c.course_type] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 truncate">{type}</span>
                    <span className="text-xs font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Credit Distribution</h4>
              <div className="space-y-2">
                {Object.entries(
                  courses.reduce((acc, c) => {
                    const credits = `${c.credits} Credits`;
                    acc[credits] = (acc[credits] || 0) + 1;
                    return acc;
                  }, {})
                ).sort(([a], [b]) => a.localeCompare(b)).map(([credits, count]) => (
                  <div key={credits} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{credits}</span>
                    <span className="text-xs font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
