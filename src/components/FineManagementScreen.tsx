import React, { useState } from 'react';
import { Transaction, UserProfile } from '../types';
import { CircleDollarSign, CheckCircle, Receipt, Trash2, Coins, Landmark } from 'lucide-react';

interface FineManagementScreenProps {
  transactions: Transaction[];
  onCollectFine: (transactionId: string) => void;
  user: UserProfile;
}

export default function FineManagementScreen({ 
  transactions, 
  onCollectFine,
  user 
}: FineManagementScreenProps) {
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter transactions that have/had a fine
  // If the user is a student, we filter to show only their fines. For demo purposes, we match against Alex Mercer or Emily Watson
  const fineTransactions = transactions
    .filter(t => t.fineAmount > 0)
    .filter(t => {
      if (user.role !== 'Student') return true;
      // Alex Mercer or Emily Watson (since Watson has the sample records in the ledger)
      return t.memberName.toLowerCase().includes(user.name.toLowerCase()) || 
             (user.name.includes('Alex Mercer') && t.memberName.includes('Emily Watson')); // show Watson's records for guest presentation ease
    });

  // Calculate total outstanding fine (Status = Unpaid)
  const outstandingTotal = fineTransactions
    .filter(t => t.fineStatus === 'Unpaid')
    .reduce((acc, t) => acc + t.fineAmount, 0);

  const handleCollect = (tId: string, member: string, amt: number) => {
    onCollectFine(tId);
    setSuccessMessage(`Fine collected! Standard receipt generated. Rs. ${amt} cleared for borrower "${member}".`);
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Outstanding banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4 md:col-span-2">
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl">
            <Coins className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <h3 className="font-display font-medium text-slate-800 text-sm">Fine Ledger & Cashier Desk</h3>
            <p className="text-slate-500 text-xs mt-0.5 max-w-lg">
              Collect fees, print transactional receipts, and manage outstanding late penalties. Fines accumulate at an audited scale of Rs. 10.00 daily for each out-of-compliance circulation.
            </p>
          </div>
        </div>

        {/* Total Outstanding Metric */}
        <div className="bg-amber-950 text-amber-100 p-6 rounded-2xl border border-amber-900 shadow-md flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">Aggregate Outstanding</span>
          <span className="text-2xl font-bold font-mono tracking-tight text-white mt-2">Rs. {outstandingTotal}</span>
          <span className="text-[10px] text-amber-300 mt-1">Pending campus collections</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs leading-relaxed text-emerald-800 flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Fine Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="px-5 py-4">Borrower Name</th>
                <th className="px-5 py-4">Book Title / Circulation ID</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Penalty Daily Slate</th>
                <th className="px-5 py-4">Elapsed Late Days</th>
                <th className="px-5 py-4">Subtotal Fine</th>
                <th className="px-5 py-4 font-medium">Payment status</th>
                <th className="px-5 py-4 text-right">Register Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fineTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No active or historical fines recorded in the ledger database.
                  </td>
                </tr>
              ) : (
                fineTransactions.map((t) => (
                  <tr key={t.transactionId} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{t.memberName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Member ID: {t.memberId}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">{t.bookTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Tran ID: {t.transactionId}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-medium">{t.dueDate}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 font-medium">Rs. 10 / day</td>
                    <td className="px-5 py-3.5 font-mono text-rose-600 font-bold">{t.overdueDays} days</td>
                    <td className="px-5 py-3.5 font-bold text-slate-950 font-mono">Rs. {t.fineAmount}</td>
                    <td className="px-5 py-3.5">
                      {t.fineStatus === 'Paid' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-500/10">
                          CLEARED & PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-500/10 animate-pulse">
                          UNPAID PENALTY
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {t.fineStatus === 'Unpaid' ? (
                        user.role !== 'Student' ? (
                          <button
                            onClick={() => handleCollect(t.transactionId, t.memberName, t.fineAmount)}
                            className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-white font-medium text-[11px] rounded-lg cursor-pointer flex items-center space-x-1.5 ml-auto"
                          >
                            <Receipt className="h-3 w-3" />
                            <span>Collect Fine</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/55 px-2 py-1 rounded font-semibold inline-flex items-center space-x-1">
                            <span>Pending Desk Clearance</span>
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end space-x-1">
                          <span>&bull; Transaction Sealed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Outstanding Drawer bottom */}
        {fineTransactions.length > 0 && (
          <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Outstanding Collections Count: {fineTransactions.filter(t => t.fineStatus === 'Unpaid').length} books on penalty</span>
            <span className="text-slate-900">Total Outstanding Fine Cleared: Rs. {fineTransactions.filter(t => t.fineStatus === 'Paid').reduce((acc, b) => acc + b.fineAmount, 0)} accrued historically</span>
          </div>
        )}
      </div>
    </div>
  );
}
