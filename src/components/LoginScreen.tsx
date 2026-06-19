import React, { useState } from 'react';
import { UserProfile } from '../types';
import { BookOpen, Key, User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<'Admin' | 'Librarian' | 'Student'>('Admin');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in both username and password.');
      return;
    }
    
    // Create professional user profile mock
    const profile: UserProfile = {
      username: username.toLowerCase(),
      name: role === 'Admin' ? 'Dr. Sarah Peterson' : role === 'Librarian' ? 'Nora Vance (Librarian)' : 'Alex Mercer (Student)',
      role: role,
      email: role === 'Admin' ? 'peterson.admin@university.edu' : role === 'Librarian' ? 'nvance@university.edu' : 'alex.mercer@university.edu',
      phone: role === 'Admin' ? '555-0100' : role === 'Librarian' ? '555-0105' : '555-0199',
      lastLogin: new Date().toLocaleString(),
    };
    
    setError('');
    onLoginSuccess(profile);
  };

  const autofill = (selectedRole: 'Admin' | 'Librarian' | 'Student') => {
    setRole(selectedRole);
    if (selectedRole === 'Admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (selectedRole === 'Librarian') {
      setUsername('librarian');
      setPassword('lib456');
    } else {
      setUsername('student');
      setPassword('stu789');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[550px]"
      >
        {/* Left column: Academic Display */}
        <div className="w-full md:w-1/2 bg-blue-950 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Decorative abstract graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900 rounded-full filter blur-3xl opacity-20 -ml-20 -mb-20"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2.5 bg-emerald-500 rounded-lg text-white shadow-lg shadow-emerald-500/20">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-display font-bold tracking-tight text-xl">U-Campus CLMS</span>
            </div>
            
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">CS3140 Academic Showcase</span>
              <h1 className="text-2xl md:text-3xl font-display font-medium leading-tight">
                Campus Library Management System
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                Streamlining academic assets, catalog transactions, student member registrations, automatic fine audits, and executive resource analytics.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-blue-900/60 relative z-10 text-xs text-slate-400 flex flex-col space-y-2">
            <p>Developed for Software Project Management presentation.</p>
            <div className="flex items-center space-x-2 text-emerald-400 font-mono mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Prototype System Online | Local State Active</span>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-medium text-slate-900">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to access your administrative workspace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-xs leading-relaxed text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Select Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                User Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <select
                  value={role}
                  onChange={(e) => autofill(e.target.value as any)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 text-sm bg-slate-50 hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                >
                  <option value="Admin">Admin (Full Access & Reports)</option>
                  <option value="Librarian">Librarian (Manager Mode)</option>
                  <option value="Student">Student (Catalog Search & Self Profile)</option>
                </select>
              </div>
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 flex justify-center items-center space-x-2 cursor-pointer mt-4"
            >
              <span>Authenticate Portal</span>
            </button>
          </form>

          {/* Quick Sandbox Logins */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-center mb-3">
              One-Click Guest Auth
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => autofill('Admin')}
                className={`py-2 px-1 rounded text-xs font-medium border text-center transition-all cursor-pointer ${
                  role === 'Admin'
                    ? 'border-blue-900 bg-blue-50/50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => autofill('Librarian')}
                className={`py-2 px-1 rounded text-xs font-medium border text-center transition-all cursor-pointer ${
                  role === 'Librarian'
                    ? 'border-blue-900 bg-blue-50/50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Librarian
              </button>
              <button
                type="button"
                onClick={() => autofill('Student')}
                className={`py-2 px-1 rounded text-xs font-medium border text-center transition-all cursor-pointer ${
                  role === 'Student'
                    ? 'border-blue-900 bg-blue-50/50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Student
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
