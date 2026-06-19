import React, { useState } from 'react';
import { Book, Member, Transaction } from '../types';
import { BookmarkPlus, CheckCircle2, AlertCircle, Info, Calendar } from 'lucide-react';

interface IssueBookScreenProps {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  onIssueBook: (bookId: string, memberId: string, issueDate: string, dueDate: string) => void;
}

export default function IssueBookScreen({ 
  books, 
  members, 
  transactions, 
  onIssueBook 
}: IssueBookScreenProps) {
  
  // Form states
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getFutureDateString = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const [issueDate, setIssueDate] = useState(getTodayString());
  const [dueDate, setDueDate] = useState(getFutureDateString(14)); // default 14-day loan duration

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter lists for selection
  const availableBooks = books.filter(b => b.availableCopies > 0);
  const activeMembers = members.filter(m => m.status === 'Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId || !issueDate || !dueDate) {
      setMessage({ type: 'error', text: 'All fields are mandatory to record a loan entry.' });
      return;
    }

    const book = books.find(b => b.bookId === selectedBookId);
    const member = members.find(m => m.memberId === selectedMemberId);

    if (!book || book.availableCopies <= 0) {
      setMessage({ type: 'error', text: 'Selected volume is currently out of physical stock.' });
      return;
    }

    if (!member || member.status !== 'Active') {
      setMessage({ type: 'error', text: 'This member is currently suspended and ineligible for loans.' });
      return;
    }

    // Call callback
    onIssueBook(selectedBookId, selectedMemberId, issueDate, dueDate);
    
    // Set success state
    setMessage({ 
      type: 'success', 
      text: `Loan registered successfully! Vol "${book.title}" was checked out to member "${member.name}".` 
    });

    // Reset inputs
    setSelectedBookId('');
    setSelectedMemberId('');
    setIssueDate(getTodayString());
    setDueDate(getFutureDateString(14));

    // Clear alert after a few seconds
    setTimeout(() => {
      setMessage(null);
    }, 5500);
  };

  const activeLoans = transactions.filter(t => t.returnDate === null);

  return (
    <div className="space-y-6">
      {/* Form Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Creation form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-1">
          <div className="flex items-center space-x-2 text-slate-900 font-display font-medium text-sm mb-5 pb-3 border-b border-slate-100">
            <BookmarkPlus className="h-5 w-5 text-blue-900" />
            <span>Create New Book Loan Record</span>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-xs flex items-start space-x-2 mb-5 ${
              message.type === 'success' 
                ? 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800' 
                : 'bg-red-50 border-l-4 border-red-500 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Book */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Select Book Catalog *
              </label>
              <select
                required
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              >
                <option value="">-- Choose Volume --</option>
                {availableBooks.map((b) => (
                  <option key={b.bookId} value={b.bookId}>
                    [{b.bookId}] {b.title} ({b.availableCopies} available)
                  </option>
                ))}
              </select>
              {availableBooks.length === 0 && (
                <span className="text-[10px] text-rose-600 mt-1 block">All catalog volumes are currently out of stock.</span>
              )}
            </div>

            {/* Select Member */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Select Member borrower *
              </label>
              <select
                required
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              >
                <option value="">-- Choose Member --</option>
                {activeMembers.map((m) => (
                  <option key={m.memberId} value={m.memberId}>
                    [{m.memberId}] {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Issue Date
                </label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>
            </div>

            {/* Micro warning note */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start space-x-2 text-[10px] leading-relaxed text-slate-500">
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Loans run for 14 calendar days by default. Fines accrue at a rate of <strong>Rs. 10.00 per active day overdue</strong> thereafter.</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-medium text-xs rounded-lg shadow-sm transition-colors cursor-pointer text-center"
            >
              Issue Book Copies
            </button>
          </form>
        </div>

        {/* List of active loans */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-display font-medium text-slate-900 text-sm">Active Loan Database Entries</h3>
            <p className="text-slate-500 text-xs mt-0.5">Real-time outstanding circulation ledger</p>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-5 py-3">Book ID / Title</th>
                  <th className="px-5 py-3">Borrower Member</th>
                  <th className="px-5 py-3">Issue Date</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeLoans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      No active book loans are currently logged.
                    </td>
                  </tr>
                ) : (
                  activeLoans.map((loan) => (
                    <tr key={loan.transactionId} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800 line-clamp-1">{loan.bookTitle}</div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">Book ID: {loan.bookId} | Transaction: {loan.transactionId}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{loan.memberName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Member ID: {loan.memberId}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{loan.issueDate}</td>
                      <td className="px-5 py-3.5 text-slate-600">{loan.dueDate}</td>
                      <td className="px-5 py-3.5">
                        {loan.overdueDays > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                            Overdue {loan.overdueDays}d (Rs. {loan.fineAmount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                            In Circulation
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
      </div>
    </div>
  );
}
