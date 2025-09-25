import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../../components/navbar";

export default function Login() {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.name === "email" ? e.target.value.trim().toLowerCase() : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
    setError(null);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;


    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }


    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        throw signInError;
      }

      if (data?.user) {
  
        navigate("/dashboard"); 
      }

    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
          <p className="mb-6 text-slate-600 text-sm">Welcome back. Enter your email and password below.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className="my-5 flex items-center justify-center gap-2">
            <span className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-500">or</span>
            <span className="h-px bg-slate-200 flex-1" />
          </div>
          
          <button
            type="button"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-800 hover:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
      
              alert("Google sign-in coming soon!");
            }}
          >
            <svg height="18" width="18" viewBox="0 0 48 48" aria-hidden="true">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.32 0 6.25 1.16 8.59 3.07l6.41-6.41C34.5 2.65 29.59 0 24 0 14.54 0 6.4 6.28 2.35 15.41l7.92 6.16C12.13 13.16 17.56 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.14 24c0-1.63-.15-3.21-.44-4.74H24v9.02h12.41c-.53 3.3-2.29 6.17-4.98 8.07l7.81 6.1C44.68 37.8 46.14 31.33 46.14 24z"/>
                <path fill="#FBBC05" d="M10.27 28.57c-1.11-3.07-1.11-6.43 0-9.5l-7.92-6.16C.47 17.82 0 20.85 0 24c0 3.15.47 6.18 1.35 9.09l7.92-6.16z"/>
                <path fill="#EA4335" d="M24 46c5.59 0 10.5-1.84 14.41-5.04l-7.81-6.1c-2.21 1.49-5.05 2.36-8.6 2.36-6.43 0-11.86-3.66-14.73-8.83L2.35 32.59C6.4 41.72 14.54 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            Sign in with Google
          </button>
          
          <div className="mt-6 text-center text-sm text-slate-600">
            New here?{" "}
            <Link 
              to="/register" 
              className="text-indigo-600 font-medium hover:underline focus:outline-none focus:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}