import React from 'react';
import { UserProfile } from '../types';
import { 
  LayoutDashboard, 
  BookMarked, 
  BookmarkPlus, 
  RotateCcw, 
  Users, 
  CircleDollarSign, 
  LineChart, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onLogout, 
  mobileOpen, 
  setMobileOpen 
}: SidebarProps) {
  
  // Navigation tabs definition
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Librarian', 'Student'] },
    { id: 'books', label: 'Book Catalog', icon: BookMarked, roles: ['Admin', 'Librarian', 'Student'] },
    { id: 'issue', label: 'Issue Book', icon: BookmarkPlus, roles: ['Admin', 'Librarian'] },
    { id: 'return', label: 'Return Book', icon: RotateCcw, roles: ['Admin', 'Librarian'] },
    { id: 'members', label: 'Members', icon: Users, roles: ['Admin', 'Librarian'] },
    { id: 'fines', label: 'Fines Management', icon: CircleDollarSign, roles: ['Admin', 'Librarian', 'Student'] },
    { id: 'reports', label: 'Analytical Reports', icon: LineChart, roles: ['Admin', 'Librarian'] },
    { id: 'profile', label: 'My Profile', icon: UserCircle, roles: ['Admin', 'Librarian', 'Student'] },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false); // Close drawer on mobile selection
  };

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Top Navbar with Burger menu */}
      <div className="md:hidden flex items-center justify-between bg-blue-950 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-emerald-400" />
          <span className="font-display font-bold text-lg tracking-tight">CLMS</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 bg-blue-900 rounded-lg text-slate-200 hover:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Backdrop for mobile active drawer */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 bottom-0 h-full w-[260px] bg-blue-950 text-slate-300 flex flex-col justify-between z-50 shadow-2xl transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'transform translate-x-0' : 'transform -translate-x-full md:translate-x-0'}
      `}>
        {/* Upper Brand Info & Nav */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-blue-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-emerald-500 rounded text-white shadow-md shadow-emerald-500/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">CLMS</span>
            </div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 bg-blue-900/50 rounded-lg hover:bg-blue-900"
            >
              <X className="h-4 w-4 text-slate-300" />
            </button>
          </div>

          {/* User Profile Header section */}
          <div className="p-5 mx-3 my-4 bg-blue-900/40 rounded-xl border border-blue-900/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm uppercase">
                  {user.name.substring(0, 2)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-950 rounded-full"></span>
              </div>
              <div className="truncate min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 space-y-1">
            {filteredMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group cursor-pointer
                    ${isActive 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10 font-medium' 
                      : 'hover:bg-blue-900/50 hover:text-slate-100 text-slate-400'
                    }
                  `}
                >
                  <IconComponent className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions: Logout */}
        <div className="p-4 border-t border-blue-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out Control</span>
          </button>
        </div>
      </aside>
    </>
  );
}
