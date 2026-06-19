import React from 'react';
import { UserProfile } from '../types';
import { UserCircle, Shield, Mail, Phone, Calendar, Clock, BookOpen, Flame } from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
}

export default function ProfileScreen({ user }: ProfileScreenProps) {
  return (
    <div className="max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden font-sans">
      {/* Banner design representing the university accent colors */}
      <div className="h-32 bg-blue-950 relative overflow-hidden flex items-end p-6">
        {/* Decorative backgrounds */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full filter blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-900/40 rounded-full filter blur-xl -ml-12 -mt-12"></div>
        
        {/* Little badge */}
        <span className="relative z-10 text-[10px] font-mono bg-emerald-500 text-white px-2.5 py-1 rounded font-bold uppercase tracking-widest leading-none">
          Verified Academic Account
        </span>
      </div>

      {/* Main card description */}
      <div className="p-6 md:p-8 relative">
        {/* Circular photo placeholder */}
        <div className="absolute -top-12 left-6 md:left-8">
          <div className="h-20 w-20 rounded-xl bg-slate-50 border-4 border-white shadow-md flex items-center justify-center text-blue-950 font-bold text-2xl uppercase">
            {user.name.substring(0, 2)}
          </div>
        </div>

        {/* Name and Designation description */}
        <div className="mt-10 mb-6 border-b border-slate-100 pb-5">
          <h3 className="font-display font-semibold text-xl text-slate-900 inline-flex items-center gap-1.5">
            <span>{user.name}</span>
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Sign-on Role: <strong className="text-blue-900 uppercase tracking-wider font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{user.role}</strong>
          </p>
        </div>

        {/* Detailed parameters */}
        <div className="space-y-4">
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Detailed Credentials</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field: Username */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
              <UserCircle className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9px] uppercase text-slate-400 font-semibold">Username Code</span>
                <span className="block text-slate-800 text-xs font-mono font-bold">{user.username}</span>
              </div>
            </div>

            {/* Field: Email */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
              <Mail className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9px] uppercase text-slate-400 font-semibold">Campus Email</span>
                <span className="block text-slate-800 text-xs font-medium truncate max-w-[180px]" title={user.email}>
                  {user.email}
                </span>
              </div>
            </div>

            {/* Field: Phone */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
              <Phone className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9px] uppercase text-slate-400 font-semibold">Direct Telephone</span>
                <span className="block text-slate-800 text-xs font-medium">{user.phone}</span>
              </div>
            </div>

            {/* Field: Last Login */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
              <Clock className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9px] uppercase text-slate-400 font-semibold">Current Session Login</span>
                <span className="block text-slate-800 text-xs font-mono leading-none">{user.lastLogin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CS3140 Academic Notice overlay */}
        <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-105 flex items-start space-x-3">
          <Flame className="h-5 w-5 text-blue-900 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 leading-relaxed">
            <h5 className="font-semibold text-slate-900">CS3140 Academic Security Guidelines</h5>
            <p className="text-slate-500 mt-1">
              Your security role controls clearance settings. Admin role holds aggregate administrative privileges over book catalogs, user memberships, analytical reporting, and cashier ledgers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
