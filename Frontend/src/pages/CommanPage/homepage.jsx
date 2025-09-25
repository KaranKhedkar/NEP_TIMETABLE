

import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import { Fragment } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />


      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -skew-y-3 bg-gradient-to-br from-indigo-50 to-white" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-14">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold leading-tight tracking-tight">
                Smart Timetables for NEP 2020
              </h1>
              <p className="mt-3 sm:mt-5 max-w-2xl text-base sm:text-lg text-slate-600">
                Automate conflict-free schedules across FYUP, B.Ed, M.Ed, and ITEP with scenario simulation, faculty load balancing, and room capacity intelligence.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto justify-center rounded-md bg-indigo-600 px-5 sm:px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  Build Timetable
                </Link>
                <Link
                  to="/features"
                  className="w-full sm:w-auto justify-center rounded-md border border-slate-300 bg-white px-5 sm:px-6 py-3 text-sm font-medium text-slate-800 hover:border-slate-400"
                >
                  See Demo video
                </Link>
              </div>
              <ul className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Dot /> Scenario comparison</li>
                <li className="flex items-center gap-2"><Dot /> Dual‑major & electives</li>
                <li className="flex items-center gap-2"><Dot /> Labs & practice blocks</li>
              </ul>
            </div>

            <div className="lg:col-span-5">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

 
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-semibold">From inputs to publish without the mess</h2>
          <p className="mt-2 text-slate-600">
            A guided flow that turns enrollments, faculties, and rooms into share‑ready schedules.
          </p>

          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12">
            <JourneyStep idx="01" title="Import data" text="Upload students, faculty, rooms, and courses via CSV/Excel or connect AMS." />
            <JourneyStep idx="02" title="Generate" text="Run AI‑assisted generation with credit→contact mapping and clash prevention." />
            <JourneyStep idx="03" title="Refine" text="Pin key slots, drag‑drop edits, and respect blackouts without breaking feasibility." />
            <JourneyStep idx="04" title="Publish" text="Export PDF/Excel/ICS and notify faculty/students instantly." />
          </div>
        </div>
      </section>


      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6">
              <h3 className="text-lg sm:text-xl font-semibold">NEP‑first by design</h3>
              <p className="mt-2 text-slate-600">
                Handles FYUP, B.Ed, M.Ed, and ITEP with electives, labs, and teaching practice so every cohort stays clash‑free.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <WhyCard title="Credit mapping" text="Convert credits into weekly contact hours and slot lengths." />
                <WhyCard title="Cohort safety" text="No overlaps across chosen Major/Minor/AEC/SEC/GE/VAC bundles." />
                <WhyCard title="Room intelligence" text="Capacity, equipment, and blackout windows enforced." />
                <WhyCard title="Scenario control" text="Compare gap/day‑span/load outcomes and pick the best." />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-2xl" />
                <div className="relative p-4 sm:p-6 pb-16 sm:pb-20 lg:pb-24 mb-70
                
                ">
                  <TimetablePreviewLarge />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg sm:text-xl font-semibold">Three audiences. One clean workflow.</h3>
          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <StoryCard
              badge="Admin"
              title="Plan a semester in days"
              bullets={["Bulk import and validation", "Live conflict indicators", "Utilization & load analytics"]}
            />
            <StoryCard
              badge="Faculty"
              title="Teach without surprises"
              bullets={["Clear weekly view", "Swap & leave requests", "Instant notifications"]}
            />
            <StoryCard
              badge="Student"
              title="Know where to be"
              bullets={["Program/semester filters", "Room shift alerts", "PDF/Excel/JPEG exports"]}
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6">
              <ExportPanel />
            </div>
            <div className="lg:col-span-6">
              <h3 className="text-lg sm:text-xl font-semibold">Share anywhere</h3>
              <p className="mt-2 text-slate-600">Publish official copies and personal calendars in one step.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Dot /> PDF for notice boards</li>
                <li className="flex items-center gap-2"><Dot /> Excel for department edits</li>
                <li className="flex items-center gap-2"><Dot /> JPEG for students</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Link to="/signup" className="flex-1 sm:flex-none rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700">
                  Generate Now
                </Link>
                <Link to="/docs" className="flex-1 sm:flex-none rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:border-slate-400">
                  Read Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

  
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Ready to publish a better timetable?</h3>
                <p className="mt-1 text-slate-600">Scenario‑driven, NEP‑aligned, and easy to share.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link to="/signup" className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 text-center">
                  Get Started
                </Link>
                <Link to="/contact" className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:border-slate-400 text-center">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


function Dot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-indigo-600" />;
}

function HeroPreview() {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-2xl" />
      <div className="relative p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium">Timetable Preview</div>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">Sample</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {["Mon","Tue","Wed","Thu","Fri"].map((d) => (
            <div key={d} className="rounded-lg border border-slate-200 bg-white p-2 sm:p-3 text-center text-xs text-slate-600">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          <Chip label="EDU101" color="indigo" />
          <Chip label="PHY201" color="emerald" />
          <Chip label="PSY110" color="amber" />
          <Chip label="SEC121" color="rose" />
          <Chip label="AEC140" color="blue" />
        </div>
      </div>
    </div>
  );
}

function Chip({ label, color }) {
  const map = {
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };
  return <div className={`rounded-md border p-2 sm:p-3 text-[11px] sm:text-xs ${map[color]}`}>{label}</div>;
}

function JourneyStep({ idx, title, text }) {
  return (
    <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="text-xs font-semibold text-indigo-600">{idx}</div>
      <h4 className="mt-1 font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function WhyCard({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function TimetablePreviewLarge() {
  const days = ["Mon","Tue","Wed","Thu","Fri"];
  const times = ["9:00","10:00","11:00","12:00","1:00","2:00","3:00"];
  const chips = [
    { d:0, t:0, span:2, label:"Major: EDU101", room:"A-204", color:"bg-indigo-50 border-indigo-200 text-indigo-700" },
    { d:2, t:2, span:3, label:"Lab: PHY201", room:"Lab-3", color:"bg-emerald-50 border-emerald-200 text-emerald-700" },
    { d:4, t:1, span:2, label:"GE: PSY110", room:"B-102", color:"bg-amber-50 border-amber-200 text-amber-700" },
  ];
  const rowH = 48;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="text-sm font-medium text-slate-700">Sample Timetable</div>
        <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">Preview</span>
      </div>

    
      <div className="grid grid-cols-[70px_repeat(5,1fr)] sm:grid-cols-[90px_repeat(5,1fr)]">
        <div />
        {days.map((d) => (
          <div key={d} className="px-1 sm:px-2 py-1 text-center text-[10px] sm:text-xs font-medium text-slate-600">{d}</div>
        ))}
      </div>


      <div className="grid grid-cols-[70px_repeat(5,1fr)] sm:grid-cols-[90px_repeat(5,1fr)] gap-px rounded-lg border border-slate-200 bg-slate-200">
        {times.map((time, row) => (
          <Fragment key={row}>
            <div className="bg-white px-2 py-2 sm:py-3 text-[10px] sm:text-xs text-slate-500">{time}</div>
            {Array.from({ length: 5 }).map((_, col) => (
              <div key={`${row}-${col}`} className="relative bg-white" style={{ height: `${rowH}px` }} />
            ))}
          </Fragment>
        ))}
      </div>


      <div className="relative -mt-[calc(48px*7)]">
        <div className="pointer-events-none absolute inset-0 grid grid-cols-[70px_repeat(5,1fr)] sm:grid-cols-[90px_repeat(5,1fr)]">
          <div />
          {Array.from({ length: 5 }).map((_, col) => (
            <div key={col} className="relative">
              {chips
                .filter(c => c.d === col)
                .map((c, idx) => (
                  <div
                    key={idx}
                    style={{ top: `${c.t * rowH + 6}px`, height: `${c.span * rowH - 10}px` }}
                    className={`pointer-events-auto absolute left-1.5 right-1.5 sm:left-2 sm:right-2 rounded-md border px-2 py-1 text-[10px] sm:text-xs shadow-sm ${c.color}`}
                  >
                    <div className="font-medium truncate">{c.label}</div>
                    <div className="text-[9px] sm:text-[10px] opacity-80">{c.room}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryCard({ badge, title, bullets }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-600">{badge}</span>
        <h4 className="mt-2 font-semibold">{title}</h4>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {bullets.map((b,i)=>(
            <li key={i} className="flex items-start gap-2">
              <Dot /> <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ExportPanel() {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl p-5 sm:p-6">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-2xl" />
      <div className="relative">
        <div className="text-sm font-medium">Exports</div>
        <p className="text-xs text-slate-600">Official and personal formats</p>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <ExportCard title="PDF" text="Print-ready layout" />
          <ExportCard title="Excel" text="Department editing" />
          <ExportCard title="JPEG" text="Student Friendly format" />
        </div>
      </div>
    </div>
  );
}

function ExportCard({ title, text }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-slate-600">{text}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-slate-600">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} NEP Timetable</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-indigo-600">Privacy</Link>
            <Link to="/terms" className="hover:text-indigo-600">Terms</Link>
            <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
