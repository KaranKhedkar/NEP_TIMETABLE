import { useState } from "react";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon 
} from "@heroicons/react/24/outline";


const roomsData = [
  {
    room_id: "R301",
    room_name: "Lecture Hall 1",
    capacity: 120,
    room_type: "Lecture Hall"
  },
  {
    room_id: "R302",
    room_name: "Room 204",
    capacity: 60,
    room_type: "Classroom"
  },
  {
    room_id: "R305",
    room_name: "Seminar Hall A",
    capacity: 75,
    room_type: "Seminar Room"
  },
  {
    room_id: "R306",
    room_name: "Lecture Hall 2",
    capacity: 150,
    room_type: "Lecture Hall"
  },
  {
    room_id: "R307",
    room_name: "Room 205",
    capacity: 60,
    room_type: "Classroom"
  },
  {
    room_id: "R308",
    room_name: "Room 301",
    capacity: 70,
    room_type: "Classroom"
  },
  {
    room_id: "R312",
    room_name: "Room 101",
    capacity: 45,
    room_type: "Classroom"
  },
  {
    room_id: "R313",
    room_name: "Room 102",
    capacity: 45,
    room_type: "Classroom"
  },
  {
    room_id: "R314",
    room_name: "Auditorium B",
    capacity: 250,
    room_type: "Lecture Hall"
  },
  {
    room_id: "R316",
    room_name: "Room 302",
    capacity: 70,
    room_type: "Classroom"
  }
];

export default function RoomManagement() {
  const [rooms] = useState(roomsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const roomTypes = [
    "all",
    ...new Set(rooms.map(room => room.room_type))
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.room_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || room.room_type === selectedType;
    
    return matchesSearch && matchesType;
  });


  const stats = {
    totalRooms: 85,
    classrooms: 42,
    lectureHalls: 18,
    labs: 15,
    seminarRooms: 10,
    avgCapacity: 72
  };

  const getTypeColor = (type) => {
    const colors = {
      "Classroom": "bg-blue-100 text-blue-800",
      "Lecture Hall": "bg-purple-100 text-purple-800",
      "Lab": "bg-green-100 text-green-800",
      "Seminar Room": "bg-yellow-100 text-yellow-800",
      "Conference Room": "bg-indigo-100 text-indigo-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getCapacityLevel = (capacity) => {
    if (capacity >= 150) return { label: "Large", color: "text-red-600" };
    if (capacity >= 70) return { label: "Medium", color: "text-yellow-600" };
    return { label: "Small", color: "text-green-600" };
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 80) return "bg-red-500";
    if (utilization >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

 
  const getUtilization = (roomId) => {
    const utilizationData = {
      "R301": 85, "R302": 72, "R305": 65, "R306": 90, "R307": 68,
      "R308": 75, "R312": 55, "R313": 60, "R314": 95, "R316": 70
    };
    return utilizationData[roomId] || 50;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Room Management</h2>
          <p className="text-slate-600">Manage classrooms, labs, and resource allocation</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
          <PlusIcon className="h-4 w-4" />
          Add New Room
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h3 className="font-semibold">Room Directory (85)</h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Room Types" : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredRooms.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRooms.map((room) => {
                  const capacityLevel = getCapacityLevel(room.capacity);
                  const utilization = getUtilization(room.room_id);
                  
                  return (
                    <div
                      key={room.room_id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 truncate">{room.room_name}</h4>
            
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                    
                          <button className="p-1 text-slate-400 hover:text-indigo-600 transition" title="Edit Room">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(room.room_type)}`}>
                            {room.room_type}
                          </span>
                          <span className={`text-xs font-medium ${capacityLevel.color}`}>
                            {capacityLevel.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Capacity</span>
                          <span className="text-sm font-medium">{room.capacity} seats</span>
                        </div>
                        
                        <div className="space-y-1">
                        
                      
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Rooms Found</h3>
                <p className="text-slate-600 mt-2">
                  {searchTerm || selectedType !== "all"
                    ? "No rooms match your search criteria" 
                    : "Add classrooms and labs with capacity details"
                  }
                </p>
                {(searchTerm || selectedType !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
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
            <h3 className="font-semibold">Room Statistics</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Rooms</span>
                <span className="text-sm font-medium">{stats.totalRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Classrooms</span>
                <span className="text-sm font-medium">{stats.classrooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Lecture Halls</span>
                <span className="text-sm font-medium">{stats.lectureHalls}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Labs</span>
                <span className="text-sm font-medium">{stats.labs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Seminar Rooms</span>
                <span className="text-sm font-medium">{stats.seminarRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Avg Capacity</span>
                <span className="text-sm font-medium">{stats.avgCapacity} seats</span>
              </div>
            </div>

      
          </div>
        </div>
      </div>
    </div>
  );
}
