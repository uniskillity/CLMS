import React from 'react';
import { Book, Member, Transaction, UserProfile } from '../types';
import { 
  BookMarked, 
  BookmarkPlus, 
  Users, 
  AlertTriangle, 
  CircleDollarSign,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardScreenProps {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  user: UserProfile;
  setCurrentTab: (tab: string) => void;
}

export default function DashboardScreen({ 
  books, 
  members, 
  transactions, 
  user,
  setCurrentTab 
}: DashboardScreenProps) {

  // Dynamic calculations
  const totalBookTitles = books.length;
  const totalPhysicalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  
  const activeIssues = transactions.filter(t => t.returnDate === null);
  const totalIssuedCount = activeIssues.length;
  
  const totalMembersCount = members.length;
  
  // Overdue count
  const overdueIssues = activeIssues.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    return due < today;
  });
  const totalOverdueCount = overdueIssues.length;

  // Unpaid fines sum
  const unpaidFinesTotal = transactions
    .filter(t => t.fineStatus === 'Unpaid')
    .reduce((acc, t) => acc + t.fineAmount, 0);

  // Lists for tables
  const recentlyIssued = [...transactions]
    .sort((a,b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 5);

  const activeOverdues = [...transactions]
    .filter(t => t.returnDate === null && t.overdueDays > 0)
    .sort((a,b) => b.overdueDays - a.overdueDays);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-xs gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-medium text-slate-900 flex items-center space-x-2">
            <span>Welcome, {user.name}</span>
            <Sparkles className="h-5 w-5 text-emerald-500" />
          </h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Running CS3140 Prototype in <strong className="text-blue-900">{user.role} mode</strong>. Live administrative state synced.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-slate-500">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>System Date: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Numerical Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Books */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-900 rounded-xl">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Books</span>
            <span className="block text-xl font-bold text-slate-900">{totalBookTitles}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">{totalPhysicalCopies} copies</span>
          </div>
        </div>

        {/* Issued Books */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
            <BookmarkPlus className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Issued Books</span>
            <span className="block text-xl font-bold text-slate-900">{totalIssuedCount}</span>
            <span className="block text-[10px] text-emerald-600 font-medium mt-0.5">Active loans</span>
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-800 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Members</span>
            <span className="block text-xl font-bold text-slate-900">{totalMembersCount}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Registered users</span>
          </div>
        </div>

        {/* Overdue Books */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overdue Loans</span>
            <span className="block text-xl font-bold text-amber-600">{totalOverdueCount}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Action pending</span>
          </div>
        </div>

        {/* Total Fines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl">
            <CircleDollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Outstanding Fines</span>
            <span className="block text-xl font-bold text-rose-600">Rs. {unpaidFinesTotal}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Collectable</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Issued Books Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-display font-medium text-slate-900 text-sm">Recently Issued Books</h3>
              <p className="text-slate-500 text-xs mt-0.5">Latest chronological loan events</p>
            </div>
            {['Admin', 'Librarian'].includes(user.role) && (
              <button 
                onClick={() => setCurrentTab('issue')}
                className="text-xs text-blue-900 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>+ Issue Book</span>
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-5 py-3">Book ID</th>
                  <th className="px-5 py-3">Title / Member</th>
                  <th className="px-5 py-3">Issue Date</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentlyIssued.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                      No issue transactions logged.
                    </td>
                  </tr>
                ) : (
                  recentlyIssued.map((t) => (
                    <tr key={t.transactionId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-500">{t.bookId}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-800 line-clamp-1">{t.bookTitle}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">By {t.memberName}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{t.issueDate}</td>
                      <td className="px-5 py-3.5 text-slate-600">{t.dueDate}</td>
                      <td className="px-5 py-3.5">
                        {t.returnDate ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                            Returned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-medium">
                            On Loan
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Loans Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-display font-medium text-slate-900 text-sm">Overdue Loans Alerts</h3>
              <p className="text-slate-500 text-xs mt-0.5">Action pending with calculated fines</p>
            </div>
            {['Admin', 'Librarian'].includes(user.role) && (
              <button 
                onClick={() => setCurrentTab('return')}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>Return Desk &rarr;</span>
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-5 py-3">Book Title</th>
                  <th className="px-5 py-3">Borrower</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Overdue Days</th>
                  <th className="px-5 py-3">Fine (Rs. 10/day)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeOverdues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-emerald-600 bg-emerald-50/20 font-medium">
                      Excellent! No books are currently overdue.
                    </td>
                  </tr>
                ) : (
                  activeOverdues.map((t) => (
                    <tr key={t.transactionId} className="hover:bg-amber-50/10 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800 line-clamp-1">{t.bookTitle}</td>
                      <td className="px-5 py-3.5 text-slate-600">{t.memberName}</td>
                      <td className="px-5 py-3.5 text-slate-500">{t.dueDate}</td>
                      <td className="px-5 py-3.5 text-amber-600 font-bold font-mono">{t.overdueDays} days</td>
                      <td className="px-5 py-3.5 font-bold text-rose-600">Rs. {t.fineAmount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
