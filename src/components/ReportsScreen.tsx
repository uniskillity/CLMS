import React, { useState } from 'react';
import { Book, Member, Transaction } from '../types';
import { LineChart, BarChart3, FileSpreadsheet, Printer, ArrowLeft, Download, CheckCircle, Table } from 'lucide-react';

interface ReportsScreenProps {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
}

export default function ReportsScreen({
  books,
  members,
  transactions
}: ReportsScreenProps) {
  
  const [activeReport, setActiveReport] = useState<'issued' | 'overdue' | 'fines' | null>(null);
  const [spoolingPrint, setSpoolingPrint] = useState(false);

  // Filters
  const issuedReportList = [...transactions];
  const overdueReportList = transactions.filter(t => t.returnDate === null && t.overdueDays > 0);
  const fineReportList = transactions.filter(t => t.fineAmount > 0);

  // Stats
  const activeLoans = transactions.filter(t => t.returnDate === null).length;
  const returnedLoans = transactions.filter(t => t.returnDate !== null).length;

  const handlePrint = () => {
    setSpoolingPrint(true);
    
    // Simulate system spooling output for high-fidelity user response
    setTimeout(() => {
      setSpoolingPrint(false);
      window.print(); // open standard native dialogue
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-display font-medium text-slate-900 text-base">Executive Analytical Reports</h3>
          <p className="text-slate-500 text-xs mt-0.5">Synthesized charts, metrics, and ledgers in conformity with academic accreditation standards.</p>
        </div>
        
        {activeReport && (
          <button
            onClick={() => setActiveReport(null)}
            className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-white text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Index</span>
          </button>
        )}
      </div>

      {/* Grid of Report Cards (shown when no report is active) */}
      {!activeReport ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Issued Books */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="h-10 w-10 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-4">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h4 className="font-display font-semibold text-slate-900 text-sm">Issued Books Report</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Aggregated loan ledger with analytical statistics on active checkouts vs completed check-ins.
              </p>
              <div className="mt-4 flex items-center space-x-4 text-xs font-semibold text-slate-500">
                <span>Active: <strong className="text-blue-900">{activeLoans}</strong></span>
                <span>Returned: <strong className="text-emerald-700">{returnedLoans}</strong></span>
              </div>
            </div>
            <button
              onClick={() => setActiveReport('issued')}
              className="mt-6 w-full py-2 bg-slate-50 hover:bg-blue-900 hover:text-white text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              View Report Ledger
            </button>
          </div>

          {/* Card 2: Overdue Loans */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="h-10 w-10 bg-amber-50 text-amber-900 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h4 className="font-display font-semibold text-slate-900 text-sm">Overdue Books Report</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Audit list of out-of-compliance physical logs, detailing overdue periods and delinquent student accounts.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-rose-600">
                <span>Critical Delinquencies: {overdueReportList.length} volumes</span>
              </div>
            </div>
            <button
              onClick={() => setActiveReport('overdue')}
              className="mt-6 w-full py-2 bg-slate-50 hover:bg-amber-800 hover:text-white text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              View Overdue Metrics
            </button>
          </div>

          {/* Card 3: Fine Status */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="h-10 w-10 bg-rose-50 text-rose-950 rounded-xl flex items-center justify-center mb-4">
                <LineChart className="h-5 w-5" />
              </div>
              <h4 className="font-display font-semibold text-slate-900 text-sm">Fine & Cash Audit Report</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Complete reconciliation report of unpaid penalties, paid receipts, and total cash flow balance.
              </p>
              <div className="mt-4 flex items-center space-x-4 text-xs font-semibold text-slate-500">
                <span>Collectable: <strong className="text-rose-600">Rs. {transactions.filter(t => t.fineStatus === 'Unpaid').reduce((a, b) => a + b.fineAmount, 0)}</strong></span>
                <span>Cleared: <strong className="text-emerald-700">Rs. {transactions.filter(t => t.fineStatus === 'Paid').reduce((a, b) => a + b.fineAmount, 0)}</strong></span>
              </div>
            </div>
            <button
              onClick={() => setActiveReport('fines')}
              className="mt-6 w-full py-2 bg-slate-50 hover:bg-rose-950 hover:text-white text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              View Cash Audit
            </button>
          </div>
        </div>
      ) : (
        /* Report Tables display */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 space-y-6 print:border-none print:shadow-none animate-fade-in">
          {/* Action header inside active report */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
            <div>
              <h4 className="font-display font-semibold text-slate-900 text-base uppercase tracking-wider">
                {activeReport === 'issued' ? 'Circulation / Issued Books Log Report' : 
                 activeReport === 'overdue' ? 'Delinquent Overdue Loan Report' : 
                 'Fines Accrual and Settlement Report'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Generated dynamically on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>{spoolingPrint ? 'Generating PDF...' : 'Print Report'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid representing dynamic totals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 print:hidden">
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Total Records</span>
              <span className="block font-bold mt-1 text-slate-900 text-sm">
                {activeReport === 'issued' ? issuedReportList.length : 
                 activeReport === 'overdue' ? overdueReportList.length : 
                 fineReportList.length} rows
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Accrued Fine Subtotal</span>
              <span className="block font-bold mt-1 text-slate-900 text-sm">
                Rs. {activeReport === 'issued' ? issuedReportList.reduce((a, b) => a + b.fineAmount, 0) : 
                     activeReport === 'overdue' ? overdueReportList.reduce((a, b) => a + b.fineAmount, 0) : 
                     fineReportList.reduce((a, b) => a + b.fineAmount, 0)}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Academic Context</span>
              <span className="block font-medium mt-1 text-slate-700 text-[11px]">CS3140 Project Showcase</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Database Status</span>
              <span className="block text-emerald-600 font-semibold mt-1 text-[11px]">&bull; Read Only Ledger</span>
            </div>
          </div>

          {/* Report Data Table */}
          <div className="border border-slate-150 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-205">
                  <th className="px-5 py-3">Tran ID</th>
                  <th className="px-5 py-3">Book details</th>
                  <th className="px-5 py-3">Borrower member</th>
                  <th className="px-5 py-3">Issue / Due Date</th>
                  {activeReport === 'fines' ? (
                    <>
                      <th className="px-5 py-3">Fine Stat</th>
                      <th className="px-5 py-3 text-right">Fine sum</th>
                    </>
                  ) : (
                    <>
                      <th className="px-5 py-3">Overdue span</th>
                      <th className="px-5 py-3 text-right">Calculated Fee</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700">
                {activeReport === 'issued' && (
                  issuedReportList.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No loan records registered.</td></tr>
                  ) : (
                    issuedReportList.map(t => (
                      <tr key={t.transactionId} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-mono font-bold text-slate-500">{t.transactionId}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{t.bookTitle} (ID: {t.bookId})</td>
                        <td className="px-5 py-3">{t.memberName}</td>
                        <td className="px-5 py-3 text-slate-500">{t.issueDate} to {t.dueDate}</td>
                        <td className="px-5 py-3 font-semibold font-mono text-slate-500">{t.overdueDays}d overdue</td>
                        <td className="px-5 py-3 text-right font-bold text-slate-900">Rs. {t.fineAmount}</td>
                      </tr>
                    ))
                  )
                )}

                {activeReport === 'overdue' && (
                  overdueReportList.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-emerald-600 bg-emerald-50/10 font-bold">Excellent! Zero active loans are currently overdue.</td></tr>
                  ) : (
                    overdueReportList.map(t => (
                      <tr key={t.transactionId} className="hover:bg-rose-50/10">
                        <td className="px-5 py-3 font-mono font-bold text-slate-500">{t.transactionId}</td>
                        <td className="px-5 py-3 font-semibold text-slate-850">{t.bookTitle}</td>
                        <td className="px-5 py-3 text-rose-800">{t.memberName} (ID: {t.memberId})</td>
                        <td className="px-5 py-3 text-slate-500">Due: {t.dueDate}</td>
                        <td className="px-5 py-3 text-rose-600 font-bold font-mono">{t.overdueDays} operational days</td>
                        <td className="px-5 py-3 text-right font-bold text-rose-600">Rs. {t.fineAmount}</td>
                      </tr>
                    ))
                  )
                )}

                {activeReport === 'fines' && (
                  fineReportList.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No dynamic penalties cataloged.</td></tr>
                  ) : (
                    fineReportList.map(t => (
                      <tr key={t.transactionId} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-mono font-bold text-slate-500">{t.transactionId}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{t.bookTitle}</td>
                        <td className="px-5 py-3">{t.memberName}</td>
                        <td className="px-5 py-3 text-slate-500">Due: {t.dueDate}</td>
                        <td className="px-5 py-3 font-semibold">
                          {t.fineStatus === 'Paid' ? (
                            <span className="text-emerald-600">Paid Receipt Sealed</span>
                          ) : (
                            <span className="text-rose-600 font-bold">Unpaid</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-slate-900 font-mono">Rs. {t.fineAmount}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-4 flex justify-between items-center text-slate-500 text-xs">
            <p>Campus Library Management System &bull; CS3140 presentations portal</p>
            <p className="font-semibold text-slate-800">Authorization code: CLMS-EXEC-PROT-SECURED</p>
          </div>
        </div>
      )}
    </div>
  );
}
