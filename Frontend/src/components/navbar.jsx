import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItem =
    "px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-600 transition-colors";
  const active =
    "text-indigo-600";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/20" />
            <span className="text-lg font-semibold tracking-tight text-slate-800">
              NEP Timetable
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/features" className={({isActive}) => `${navItem} ${isActive ? active : "text-slate-700"}`}>
              Features
            </NavLink>
            <NavLink to="/solutions" className={({isActive}) => `${navItem} ${isActive ? active : "text-slate-700"}`}>
              Solutions
            </NavLink>
            <NavLink to="/docs" className={({isActive}) => `${navItem} ${isActive ? active : "text-slate-700"}`}>
              Docs
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => `${navItem} ${isActive ? active : "text-slate-700"}`}>
              Contact
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/login" className="px-3 py-2 text-sm text-slate-700 hover:text-indigo-600">
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <nav className="grid gap-1">
              <NavLink to="/features" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100">
                Features
              </NavLink>
              <NavLink to="/solutions" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100">
                Solutions
              </NavLink>
              <NavLink to="/docs" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100">
                Docs
              </NavLink>
              <NavLink to="/contact" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100">
                Contact
              </NavLink>
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-slate-700">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
