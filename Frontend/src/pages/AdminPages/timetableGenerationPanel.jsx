// TimetableGenerationPanel.jsx
import { useState } from "react";
import { BoltIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import ProgramTimetable from "./programTimetable";

function TimetableGenerationPanel() {
  const [loading, setLoading] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setTimetable([]);
    try {
      const response = await fetch("http://localhost:8000/generate-timetable", {
        method: "POST",
        headers: { accept: "application/json" },
      });
      const result = await response.json();
      if (!response.ok || result.status !== "success")
        throw new Error(result.message || "Failed to generate timetable");

      setSuccess("Timetable generated successfully!");

      const tRes = await fetch("http://localhost:8000/timetable");
      const tData = await tRes.json();
      setTimetable(tData.data || []);
    } catch (err) {
      setError(err.message || "Error generating timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
          <h3 className="font-semibold">Generation Settings</h3>
          <div className="mt-4 space-y-4">
            <button
              onClick={handleGenerate}
              className="flex items-center justify-center gap-2 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-all duration-200"
              disabled={loading}
            >
              <BoltIcon className="h-4 w-4" />
              {loading ? "Generating..." : "Generate Timetable"}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
          <h3 className="font-semibold">Generation Status</h3>
          <div className="mt-4">
            {loading && (
              <div className="flex items-center gap-3 text-slate-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                Please wait, generating optimized timetable...
              </div>
            )}
            {!timetable.length && !loading && (
              <div className="flex flex-col items-center justify-center text-slate-500 py-6">
                <CalendarDaysIcon className="h-10 w-10 mb-2" />
                <span>No timetable generated yet</span>
              </div>
            )}
            {timetable.length > 0 && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                 Generated {timetable.length} class slots successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {timetable.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">
          <ProgramTimetable data={timetable} />
        </div>
      )}
    </div>
  );
}

export default TimetableGenerationPanel;
