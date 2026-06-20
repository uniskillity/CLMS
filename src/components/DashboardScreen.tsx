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

      {/* Library Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Category Inventory Distribution (Bar Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-slate-900 text-sm">Inventory Distribution by Category</h3>
                <p className="text-slate-400 text-[11px]">Total copies stocked per academic discipline</p>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-mono font-semibold">
                {books.length} Titles
              </span>
            </div>

            {/* Pure Responsive SVG Bar Chart */}
            <div className="relative h-48 w-full mt-2">
              {(() => {
                const map: Record<string, number> = {};
                books.forEach(b => {
                  map[b.category] = (map[b.category] || 0) + b.totalCopies;
                });
                const entries = Object.entries(map);
                const maxVal = Math.max(...entries.map(([, count]) => count), 1);

                return (
                  <div className="h-full flex items-end justify-between space-x-4 pb-6 pt-2">
                    {entries.map(([categoryName, totalCopiesCount]) => {
                      const pct = (totalCopiesCount / maxVal) * 100;
                      return (
                        <div key={categoryName} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                          {/* Tooltip Overlay */}
                          <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded shadow-md pointer-events-none z-10 whitespace-nowrap">
                            {totalCopiesCount} Volumes
                          </div>
                          
                          {/* Interactive Bar */}
                          <div 
                            style={{ height: `${pct}%` }}
                            className="w-full bg-slate-100 hover:bg-blue-950 rounded-t-lg transition-all duration-300 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-linear-to-t from-blue-900/10 to-transparent"></div>
                          </div>

                          {/* Label info */}
                          <span className="text-[9px] font-semibold text-slate-500 mt-2 truncate w-full text-center group-hover:text-blue-950" title={categoryName}>
                            {categoryName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-2 pt-3 border-t border-slate-50 text-[10px] text-slate-400">
            <span className="inline-flex items-center">
              <span className="w-2 h-2 rounded bg-blue-950 mr-1.5 shrink-0"></span> Current Stock Count
            </span>
            <span>&bull; Hover bar to view quantities</span>
          </div>
        </div>

        {/* Dynamic Financial Performance (Circular Donut Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-900 text-sm mb-1">Fine Recovery & Status</h3>
            <p className="text-slate-400 text-[11px] mb-4">Ratio of collected vs outstanding penance receipts</p>

            {(() => {
              const collected = transactions
                .filter(t => t.fineStatus === 'Paid')
                .reduce((acc, t) => acc + t.fineAmount, 0);

              const outstanding = unpaidFinesTotal;
              const totalFinesAccrued = collected + outstanding;

              // Donut calculations
              const radius = 36;
              const circumference = 2 * Math.PI * radius;
              const collectedPct = totalFinesAccrued > 0 ? (collected / totalFinesAccrued) * 100 : 100;
              const strokeDashoffset = totalFinesAccrued > 0 
                ? circumference - (collectedPct / 100) * circumference 
                : 0;

              return (
                <div className="flex flex-col items-center justify-center p-2 relative">
                  {/* Circular donut representation */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="stroke-rose-100 fill-transparent"
                        strokeWidth="10"
                      />
                      {/* Foreground Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="stroke-emerald-500 fill-transparent transition-all duration-500"
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Percent Center Details */}
                    <div className="absolute text-center">
                      <span className="block text-base font-bold text-slate-900 font-mono">
                        {totalFinesAccrued > 0 ? `${Math.round(collectedPct)}%` : '100%'}
                      </span>
                      <span className="block text-[8px] uppercase tracking-wider font-bold text-slate-400">Recovery</span>
                    </div>
                  </div>

                  {/* Absolute Details list */}
                  <div className="w-full mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="inline-flex items-center text-emerald-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shrink-0"></span> Cleared Receipts
                      </span>
                      <span className="text-slate-900 font-mono">Rs. {collected}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="inline-flex items-center text-rose-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-100 border border-rose-300 mr-2 shrink-0"></span> Uncollected Fines
                      </span>
                      <span className="text-slate-900 font-mono">Rs. {outstanding}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="pt-3 border-t border-slate-50 text-[10px] text-slate-400 text-center">
            Total Accrued Penalty Pool: <strong className="text-slate-800">
              Rs. {transactions.reduce((acc, t) => acc + t.fineAmount, 0)}
            </strong>
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
