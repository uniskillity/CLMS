import React, { useState } from 'react';
import { Book, Transaction } from '../types';
import { Search, RotateCcw, CheckCircle, AlertTriangle, AlertCircle, Bookmark } from 'lucide-react';

interface ReturnBookScreenProps {
  books: Book[];
  transactions: Transaction[];
  onReturnBook: (transactionId: string, actualReturnDate: string) => void;
}

export default function ReturnBookScreen({ 
  books, 
  transactions, 
  onReturnBook 
}: ReturnBookScreenProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter transactions that are currently live (not returned yet)
  const activeTransactions = transactions.filter(t => t.returnDate === null);

  // Search logic
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Try finding exact transaction id or a transaction matching the Book ID
    const match = activeTransactions.find(t => 
      t.transactionId.toLowerCase() === searchTerm.trim().toLowerCase() ||
      t.bookId.toLowerCase() === searchTerm.trim().toLowerCase() ||
      t.memberName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (match) {
      // Calculate real overdue info based on today
      const today = new Date();
      today.setHours(0,0,0,0);
      const due = new Date(match.dueDate);
      
      let overdueDays = 0;
      let fineAmount = 0;

      if (due < today) {
        const diffTime = Math.abs(today.getTime() - due.getTime());
        overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fineAmount = overdueDays * 10; // Rs. 10 per day
      }

      setSelectedTransaction({
        ...match,
        overdueDays,
        fineAmount
      });
    } else {
      setSelectedTransaction(null);
      alert('No outstanding loans found matching search criteria. The volume may have already been returned, or ID is invalid.');
    }
  };

  const handleReturnAction = () => {
    if (!selectedTransaction) return;

    const returnToday = new Date().toISOString().split('T')[0];
    onReturnBook(selectedTransaction.transactionId, returnToday);

    setSuccessMessage(`Returned successfully! Book "${selectedTransaction.bookTitle}" was checked in. Total accrued fine calculated: Rs. ${selectedTransaction.fineAmount}.`);
    
    // Clear states
    setSelectedTransaction(null);
    setSearchTerm('');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 5500);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs max-w-2xl">
        <h3 className="font-display font-medium text-slate-900 text-sm mb-2">Check-in / Return Desk</h3>
        <p className="text-slate-500 text-xs mb-5">Search outstanding circulation records by Book ID, Transaction Code, or Member Name.</p>

        {successMessage && (
          <div className="mb-5 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs font-medium text-emerald-800 flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              placeholder="Enter Book ID (e.g., B001) or Transaction (e.g., T001)..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            Locate Loan
          </button>
        </form>

        {/* Suggestion tags for presentation */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Demo Suggestion:</span>
          <button 
            type="button" 
            onClick={() => { setSearchTerm('B001'); }} 
            className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 px-2 py-0.5 rounded cursor-pointer font-mono"
          >
            B001
          </button>
          <button 
            type="button" 
            onClick={() => { setSearchTerm('B004'); }} 
            className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 px-2 py-0.5 rounded cursor-pointer font-mono"
          >
            B004
          </button>
        </div>
      </div>

      {/* Transaction Details display */}
      {selectedTransaction ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-rose-100/50 bg-rose-50/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="h-4 w-4 text-blue-900" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">Loan Details Found</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold uppercase">
              {selectedTransaction.transactionId}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Book & Member Info Summary */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Catalog Item</span>
                <span className="block font-semibold text-slate-950 text-sm leading-tight">{selectedTransaction.bookTitle}</span>
                <span className="block text-[11px] text-slate-400 font-mono mt-1">Book ID: {selectedTransaction.bookId}</span>
              </div>

              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Borrower Member</span>
                <span className="block font-semibold text-slate-950 text-sm leading-tight">{selectedTransaction.memberName}</span>
                <span className="block text-[11px] text-slate-400 font-mono mt-1">Member ID: {selectedTransaction.memberId}</span>
              </div>
            </div>

            {/* Date metrics cards */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Issue Date</span>
                <span className="block text-xs font-semibold text-slate-700">{selectedTransaction.issueDate}</span>
              </div>

              <div>
                <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Due Date</span>
                <span className="block text-xs font-semibold text-slate-700">{selectedTransaction.dueDate}</span>
              </div>

              <div>
                <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Return Check-in</span>
                <span className="block text-xs font-bold text-emerald-600">Today</span>
              </div>
            </div>

            {/* Fine metrics panel */}
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Accumulated Overdue</span>
                {selectedTransaction.overdueDays > 0 ? (
                  <span className="block text-sm font-semibold text-amber-400 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{selectedTransaction.overdueDays} operational days overdue</span>
                  </span>
                ) : (
                  <span className="block text-xs font-semibold text-emerald-400 mt-1">On schedule (No penalties)</span>
                )}
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Calculated Fine</span>
                <span className="block text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  Rs. {selectedTransaction.fineAmount}
                </span>
              </div>
            </div>

            {/* Complete return click button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleReturnAction}
                className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-medium rounded-lg flex items-center space-x-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Process Return Check-In</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        searchTerm && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center max-w-2xl text-slate-500">
            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <h4 className="font-semibold text-sm text-slate-800">No active checkout record selected</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Please insert a valid outstanding Book ID or borrower transaction identifier and execute Search to fetch check-in properties.
            </p>
          </div>
        )
      )}
    </div>
  );
}
